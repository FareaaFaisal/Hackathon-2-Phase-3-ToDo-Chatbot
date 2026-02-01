# backend/app/api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from app.core.config import settings
from app.core.database import get_session
from app.core.security import verify_jwt
from app.models.user import User
from app.models.task import Task
from app.services import task_service as ts # Import task_service module

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


def get_current_user(session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user_id = verify_jwt(token)
    if user_id is None:
        raise credentials_exception

    user = session.get(User, user_id)
    if not user:
        raise credentials_exception
    return user

# Dependency to provide TaskService functions (the module itself for now)
def get_task_service() -> type(ts): # Returns the module type for better type hinting
    return ts

# --- MCP Tool Functions ---

def mcp_add_task(
    title: str,
    description: str = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Task:
    return ts.create_task(session=session, title=title, description=description, user=current_user)

def mcp_list_tasks(
    status: str = None, # "pending" or "completed"
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> list[Task]:
    completed = None
    if status == "pending":
        completed = False
    elif status == "completed":
        completed = True
    return ts.get_tasks(session=session, user=current_user, completed=completed)

def mcp_complete_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Task:
    task = ts.get_task(session=session, task_id=task_id, user=current_user)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return ts.update_task(session=session, task=task, completed=True)

def mcp_delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    task = ts.get_task(session=session, task_id=task_id, user=current_user)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    ts.delete_task(session=session, task=task)
    return {"message": f"Task {task_id} deleted successfully."}

def mcp_update_task(
    task_id: int,
    title: str = None,
    description: str = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Task:
    task = ts.get_task(session=session, task_id=task_id, user=current_user)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return ts.update_task(session=session, task=task, title=title, description=description)