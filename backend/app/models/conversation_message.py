from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel
from sqlalchemy import String # Import String type for JSON

from app.models.user import User # Assuming User model is in app.models.user

class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    user: User = Relationship(back_populates="conversations")
    messages: List["Message"] = Relationship(back_populates="conversation")


class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    sender_type: str = Field(max_length=4) # "user" or "ai"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    tool_calls: Optional[str] = Field(default=None, sa_column=Field(String)) # Store as JSON string, as Pydantic's JSON type might require specific DB support or a custom type. Store as string for now.

    conversation: Conversation = Relationship(back_populates="messages")
