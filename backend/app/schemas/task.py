from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel

class TaskCreate(SQLModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskRead(SQLModel):
    id: int
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime
    updated_at: datetime
    user_id: int

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
