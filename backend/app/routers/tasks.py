from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List, Optional

from app.core.database import get_session
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.services import task_service

router = APIRouter()

# Create task
@router.post("/tasks", response_model=TaskRead)
def create_new_task(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    task_in: TaskCreate,
):
    task = task_service.create_task(
        session, title=task_in.title, description=task_in.description, user=current_user
    )
    return task

# Get all tasks
@router.get("/tasks", response_model=List[TaskRead])
def get_all_tasks(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    completed: Optional[bool] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = None,
):
    tasks = task_service.get_tasks(
        session, user=current_user, completed=completed, sort_by=sort_by or "created_at", sort_order=sort_order or "desc"
    )
    return tasks

# Get single task
@router.get("/tasks/{task_id}", response_model=TaskRead)
def get_task_by_id(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    task_id: int,
):
    task = task_service.get_task(session, task_id=task_id, user=current_user)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

# Update task
@router.put("/tasks/{task_id}", response_model=TaskRead)
def update_existing_task(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    task_id: int,
    task_in: TaskUpdate,
):
    task = task_service.get_task(session, task_id=task_id, user=current_user)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    updated_task = task_service.update_task(
        session,
        task,
        title=task_in.title,
        description=task_in.description,
        completed=task_in.completed,
    )
    return updated_task

# Delete task
@router.delete("/tasks/{task_id}", status_code=status.HTTP_200_OK)
def delete_existing_task(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    task_id: int,
):
    task = task_service.get_task(session, task_id=task_id, user=current_user)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    task_service.delete_task(session, task)
    return {"detail": "Task deleted successfully"}
