# agent_service.py
import json
from typing import List, Dict, Any, Optional, Tuple

from fastapi import Depends
from sqlmodel import Session

from app.core.database import get_session
from app.services.cohere_service import CohereService
from app.services import task_service as ts
from app.models.user import User


class AgentService:
    def __init__(self, cohere_service: CohereService, session: Session):
        self.cohere_service = cohere_service
        self.session = session
        self.tool_descriptions = self._get_tool_descriptions()

    def _get_tool_descriptions(self) -> str:
        return """
Available tools:

- add_task(title: str, description: Optional[str] = None)
- list_tasks(status: Optional[str] = None)   # status = "pending" | "completed"
- complete_task(task_id: int, title: Optional[str])
- delete_task(task_id: int, title: Optional[str])
- update_task(task_id: int, title: Optional[str], description: Optional[str], old_title: Optional[str])
- show_tasks_overview(status: Optional[str] = None)  # status = "pending", "completed", or None

Tool Call Format (JSON ONLY):
{
  "tool_calls": [
    {
      "tool_name": "add_task",
      "args": {
        "title": "Buy milk",
        "description": "From store"
      }
    }
  ]
}

If no tool is required, respond with plain text.
        """

    def process_message(
        self,
        user_id: int,
        message: str,
        conversation_history: List[Dict[str, str]] = None
    ) -> Tuple[str, List[Dict[str, Any]]]:

        if conversation_history is None:
            conversation_history = []

        chat_history = [
            {"role": "USER" if msg["sender_type"] == "user" else "CHATBOT",
             "message": msg["content"]}
            for msg in conversation_history
        ]

        system_prompt = (
            "You are a task management assistant.\n"
            "You help users manage to-do tasks.\n"
            "Only perform task-related actions. If the user asks about something unrelated to tasks, politely decline.\n"
            "Use tools ONLY when required.\n"
            "Respond in JSON when calling tools.\n\n"
            f"{self.tool_descriptions}"
        )

        # Call Cohere
        response_text = self.cohere_service.generate_response(
            prompt=f"{system_prompt}\n\nUser: {message}",
            chat_history=chat_history
        )

        tool_calls: List[Dict[str, Any]] = []
        final_response = ""

        # Parse JSON tool_calls
        try:
            parsed = json.loads(response_text)
            if isinstance(parsed, dict) and "tool_calls" in parsed:
                tool_calls = parsed["tool_calls"]
        except json.JSONDecodeError:
            final_response = response_text  # plain text fallback

        # Execute all tool calls
        executed_responses = []
        remaining_tool_calls = []

        for call in tool_calls:
            tool_name = call.get("tool_name")
            # Always return human-readable text for task lists
            if tool_name in ["list_tasks", "show_tasks_overview"]:
                executed_responses.append(self.execute_tool_call(call, user_id))
            else:
                remaining_tool_calls.append(call)

        # Combine executed responses into one final string
        if executed_responses:
            final_response = "\n".join(executed_responses)
        elif not final_response and remaining_tool_calls:
            final_response = json.dumps({"tool_calls": remaining_tool_calls}, indent=2)

        return final_response, remaining_tool_calls

    def execute_tool_call(self, call: Dict[str, Any], user_id: int) -> str:
        """Executes a single tool call and returns human-readable text."""
        user = self.session.get(User, user_id)
        if not user:
            return "User not found."

        tool_name = call.get("tool_name")
        args = call.get("args", {})

        task = None
        task_id = args.get("task_id")
        task_title = args.get("title")
        old_title = args.get("old_title")
        description = args.get("description")

        # Lookup task by id, old_title, or fuzzy title
        if task_id:
            task = ts.get_task(session=self.session, task_id=task_id, user=user)
        if not task and old_title:
            for t in ts.get_tasks(session=self.session, user=user):
                if t.title.strip().lower() == old_title.strip().lower():
                    task = t
                    break
        if not task and task_title:
            for t in ts.get_tasks(session=self.session, user=user):
                if task_title.strip().lower() in t.title.strip().lower() or t.title.strip().lower() in task_title.strip().lower():
                    task = t
                    break

        try:
            if tool_name == "complete_task":
                if not task:
                    return "Task not found ❌"
                ts.update_task(self.session, task, completed=True)
                return f"Task '{task.title}' marked complete ✅"

            elif tool_name == "add_task":
                task = ts.create_task(
                    session=self.session,
                    user=user,
                    title=task_title,
                    description=description
                )
                return f"Task '{task.title}' added successfully ✅"

            elif tool_name == "delete_task":
                if not task:
                    return "Task not found ❌"
                ts.delete_task(self.session, task)
                return f"Task '{task.title}' deleted 🗑️"

            elif tool_name == "update_task":
                if not task:
                    return "Task not found ❌"
                ts.update_task(
                    self.session,
                    task,
                    title=task_title or task.title,
                    description=description if description is not None else task.description
                )
                return f"Task '{task.title}' updated ✏️"

            elif tool_name in ["list_tasks", "show_tasks_overview"]:
                # Always return human-readable list
                status = args.get("status")  # "completed", "pending", or None
                return self.get_tasks_overview(user_id=user.id, filter_status=status)

            else:
                return "Unknown tool requested."

        except Exception as e:
            return f"Error executing tool: {e}"

    # -------------------------------
    # Human-readable tasks helper
    # -------------------------------
    def get_tasks_overview(self, user_id: int, filter_status: Optional[str] = None) -> str:
        user = self.session.get(User, user_id)
        if not user:
            return "User not found."

        # Determine filter
        if filter_status == "completed":
            completed_flag = True
        elif filter_status == "pending":
            completed_flag = False
        else:
            completed_flag = None  # all tasks

        tasks = ts.get_tasks(session=self.session, user=user, completed=completed_flag)
        if not tasks:
            if filter_status == "completed":
                return "You have no completed tasks."
            elif filter_status == "pending":
                return "You have no pending tasks."
            return "You have no tasks."

        # Human-friendly list
        header = {
            "completed": "Your completed tasks:",
            "pending": "Your pending tasks:",
            None: "All your tasks:"
        }[filter_status]

        lines = [
            f"- {t.id}: {t.title} ({'✅ Completed' if t.completed else '❌ Pending'})"
            for t in tasks
        ]

        return header + "\n" + "\n".join(lines)


# Dependency injection
def get_agent_service(
    cohere_service: CohereService = Depends(),
    session: Session = Depends(get_session)
) -> AgentService:
    return AgentService(cohere_service, session)
