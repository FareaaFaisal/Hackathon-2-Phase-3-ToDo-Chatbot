# backend/app/main.py
from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlmodel import Session, select
from datetime import datetime
import json

from .core.config import settings
from .core.database import get_session
from .routers import auth, tasks
from .api.deps import get_current_user
from .models.user import User
from .models.conversation_message import Conversation, Message

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

# Mount routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth")
app.include_router(tasks.router, prefix=f"{settings.API_V1_STR}")

# --- Chatbot Endpoint ---
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

    # Save user message
    user_message_obj = Message(
        conversation_id=conversation.id,
        sender_type="user",
        content=request.message,
        timestamp=datetime.utcnow()
    )
    session.add(user_message_obj)
    session.commit()
    session.refresh(user_message_obj)

    # --- TEMPORARY FIXED RESPONSES ---
    temp_msg = request.message.lower().strip()

    if temp_msg == "hi":
        agent_response_text = "Hello! How can I help you today?"
        agent_tool_calls = []
    elif temp_msg == "add a task fold clothes":
        agent_response_text = "Task 'fold clothes' added!"
        agent_tool_calls = [{"tool": "add_task", "task": "fold clothes"}]
    else:
        agent_response_text = "I am your AI assistant. Say 'hi' or 'add a task ...'."
        agent_tool_calls = []

    # Save AI response
    ai_message_obj = Message(
        conversation_id=conversation.id,
        sender_type="ai",
        content=agent_response_text,
        timestamp=datetime.utcnow(),
        tool_calls=json.dumps(agent_tool_calls) if agent_tool_calls else None
    )
    session.add(ai_message_obj)
    session.commit()
    session.refresh(ai_message_obj)

    return ChatResponse(
        conversation_id=conversation.id,
        response=agent_response_text,
        tool_calls=agent_tool_calls
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
