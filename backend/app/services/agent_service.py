import json
from typing import List, Optional, Tuple, Dict, Any
from sqlmodel import Session
from fastapi import Depends
from app.core.database import get_session
from app.services.cohere_service import CohereService
from app.services import task_service as ts
from app.models.task import Task
from app.models.user import User


class AgentService:
    def __init__(self, cohere_service: CohereService, session: Session):
        self.cohere_service = cohere_service
        self.session = session
        self.tool_descriptions = self._get_tool_descriptions()

    def _get_tool_descriptions(self) -> str:
        # This function generates descriptions of the available tools for the LLM.
        # It's crucial for the LLM to understand what tools it can call and how.
        return """
Available tools:
- add_task(title: str, description: Optional[str] = None): Adds a new task for the user.
- list_tasks(status: Optional[str] = None): Lists tasks for the user. Status can be 'pending' or 'completed'.
- complete_task(task_id: int): Marks a task as completed.
- delete_task(task_id: int): Deletes a task.
- update_task(task_id: int, title: Optional[str] = None, description: Optional[str] = None): Updates an existing task.

Response Format for Tool Calls:
If a tool needs to be called, respond in JSON format with a 'tool_calls' key.
Example: {\"tool_calls\": [{\"tool_name\": \"add_task\", \"args\": {\"title\": \"Buy groceries\"}}]}
If no tool is needed, just respond with a natural language message.
        """

    def process_message(self, user_id: int, message: str, conversation_history: List[Dict[str, str]] = None) -> Tuple[str, List[Dict[str, Any]]]:
        if conversation_history is None:
            conversation_history = []

        # Construct the prompt for Cohere, including tool descriptions and conversation history
        # The history can help in multi-turn conversations for context
        full_prompt = (
            "You are an AI assistant designed to help users manage their to-do tasks. "
            "You can add, list, complete, delete, and update tasks. "
            "If a user asks for something outside of task management, politely decline. "
            "Your responses should be friendly and confirm actions. "
            "Here are the available tools and expected JSON format for tool calls:\n"
            f"{self.tool_descriptions}\n"
            "Conversation History:\n" + 
            "\n".join([f"{msg['sender_type']}: {msg['content']}" for msg in conversation_history]) +
            f"\nuser: {message}\n"
            "assistant: "
        )

        cohere_response_text = self.cohere_service.generate_response(full_prompt)
        tool_calls: List[Dict[str, Any]] = []
        final_response_text = ""

        try:
            # Attempt to parse Cohere's response as JSON for tool calls
            parsed_response = json.loads(cohere_response_text)
            if "tool_calls" in parsed_response and isinstance(parsed_response["tool_calls"], list):
                tool_calls = parsed_response["tool_calls"]
        except json.JSONDecodeError:
            # If not JSON, it's a natural language response
            final_response_text = cohere_response_text
        
        if tool_calls:
            for tool_call in tool_calls:
                tool_name = tool_call.get("tool_name")
                args = tool_call.get("args", {})
                
                user = self.session.get(User, user_id)
                if not user:
                    return "Error: User not found.", []

                try:
                    if tool_name == "add_task":
                        task = ts.create_task(session=self.session, user=user, title=args.get("title"), description=args.get("description"))
                        final_response_text = f"Task '{task.title}' added successfully with ID {task.id} ✅"
                    elif tool_name == "list_tasks":
                        tasks = ts.get_tasks(session=self.session, user=user, completed=(args.get("status") == "completed" if args.get("status") else None))
                        if tasks:
                            final_response_text = "Here are your tasks:\n" + "\n".join([
                                f"- ID: {t.id}, Title: {t.title}, Status: {'Completed' if t.completed else 'Pending'}" for t in tasks
                            ])
                        else:
                            final_response_text = "You have no tasks matching that criteria."
                    elif tool_name == "complete_task":
                        task = ts.get_task(session=self.session, user=user, task_id=args.get("task_id"))
                        if not task:
                            final_response_text = f"Task with ID {args.get('task_id')} not found ❌"
                        else:
                            ts.update_task(session=self.session, task=task, completed=True)
                            final_response_text = f"Task '{task.title}' (ID: {task.id}) marked as complete ✅"
                    elif tool_name == "delete_task":
                        task = ts.get_task(session=self.session, user=user, task_id=args.get("task_id"))
                        if not task:
                            final_response_text = f"Task with ID {args.get('task_id')} not found ❌"
                        else:
                            ts.delete_task(session=self.session, task=task)
                            final_response_text = f"Task '{task.title}' (ID: {task.id}) deleted successfully."
                    elif tool_name == "update_task":
                        task = ts.get_task(session=self.session, user=user, task_id=args.get("task_id"))
                        if not task:
                            final_response_text = f"Task with ID {args.get('task_id')} not found ❌"
                        else:
                            ts.update_task(session=self.session, task=task, title=args.get("title"), description=args.get("description"))
                            final_response_text = f"Task '{task.title}' (ID: {task.id}) updated successfully."
                    else:
                        final_response_text = "I'm sorry, I don't know how to perform that action."
                except Exception as e:
                    final_response_text = f"An error occurred while processing your request: {e}"
        
        if not final_response_text and not tool_calls:
            final_response_text = "I'm sorry, I didn't understand your request. I can only help with task management."

        return final_response_text, tool_calls

# Dependency for AgentService
def get_agent_service(
    cohere_service: CohereService,
    session: Session = Depends(get_session) # Assuming get_session is available and provides Session
) -> AgentService:
    return AgentService(cohere_service, session)
