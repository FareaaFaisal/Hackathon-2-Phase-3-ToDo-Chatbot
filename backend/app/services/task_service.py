from sqlmodel import Session, select
from app.models.task import Task
from datetime import datetime

def create_task(session: Session, title: str, description: str, user) -> Task:
    task = Task(title=title, description=description, user_id=user.id)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def get_tasks(session: Session, user, completed: bool = None, sort_by: str = "created_at", sort_order: str = "desc"):
    query = select(Task).where(Task.user_id == user.id)
    if completed is not None:
        query = query.where(Task.completed == completed)
    if sort_by == "title":
        query = query.order_by(Task.title.asc() if sort_order == "asc" else Task.title.desc())
    else:
        query = query.order_by(Task.created_at.asc() if sort_order == "asc" else Task.created_at.desc())
    return session.exec(query).all()

def get_task(session: Session, task_id: int, user) -> Task | None:
    return session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user.id)
    ).first()

def update_task(session: Session, task: Task, title: str = None, description: str = None, completed: bool = None) -> Task:
    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    if completed is not None:
        task.completed = completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def delete_task(session: Session, task: Task):
    session.delete(task)
    session.commit()
