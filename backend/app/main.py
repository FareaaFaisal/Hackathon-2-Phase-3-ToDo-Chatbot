# main.py
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlmodel import Session, select
from datetime import datetime
import json
from dotenv import load_dotenv

load_dotenv()

from .core.config import settings
from .core.database import get_session
from .routers import auth, tasks
from .api.deps import get_current_user
from .models.user import User
from .models.conversation_message import Conversation, Message
from .services.cohere_service import CohereService
from .services.agent_service import AgentService

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.FRONTEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth")
app.include_router(tasks.router, prefix=f"{settings.API_V1_STR}")


# -----------------------
# Chatbot Endpoint
# -----------------------
class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    message: str

class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: List[Dict[str, Any]] = []

@app.post(f"{settings.API_V1_STR}/chat", response_model=ChatResponse)
async def chat_with_bot(
    request: ChatRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    user_id = current_user.id
    cohere_service_instance = CohereService()
    agent_service_instance = AgentService(cohere_service_instance, session)

    # Fetch or create conversation
    conversation = None
    if request.conversation_id:
        conversation = session.get(Conversation, request.conversation_id)
        if not conversation or conversation.user_id != user_id:
            raise HTTPException(status_code=404, detail="Conversation not found")
    if not conversation:
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

    # Fetch conversation history
    messages = session.exec(
        select(Message).where(Message.conversation_id == conversation.id).order_by(Message.timestamp)
    ).all()
    conversation_history = [{"sender_type": m.sender_type, "content": m.content} for m in messages]

    # Save user message
    user_msg = Message(
        conversation_id=conversation.id,
        sender_type="user",
        content=request.message,
        timestamp=datetime.utcnow()
    )
    session.add(user_msg)
    session.commit()
    session.refresh(user_msg)

    # Process message with AI
    agent_response_text, agent_tool_calls = agent_service_instance.process_message(
        user_id=user_id,
        message=request.message,
        conversation_history=conversation_history
    )

    # Execute tool calls
    executed_tool_responses = []
    for tool_call in agent_tool_calls or []:
        try:
            result_text = agent_service_instance.execute_tool_call(tool_call, user_id)
            executed_tool_responses.append({
                "tool_name": tool_call.get("tool_name", "unknown"),
                "args": tool_call.get("args", {}),
                "result": result_text
            })
        except Exception as e:
            executed_tool_responses.append({
                "tool_name": tool_call.get("tool_name", "unknown"),
                "args": tool_call.get("args", {}),
                "error": str(e)
            })

    # Update chatbot response
    if executed_tool_responses:
        agent_response_text = executed_tool_responses[0].get("result", agent_response_text)

    # Save AI message
    ai_msg = Message(
        conversation_id=conversation.id,
        sender_type="ai",
        content=agent_response_text,
        timestamp=datetime.utcnow(),
        tool_calls=json.dumps(executed_tool_responses) if executed_tool_responses else None
    )
    session.add(ai_msg)
    session.commit()
    session.refresh(ai_msg)

    return ChatResponse(
        conversation_id=conversation.id,
        response=agent_response_text,
        tool_calls=executed_tool_responses
    )


# Exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.get("/")
async def root():
    return {"message": "Welcome to the Todo App Backend!"}
