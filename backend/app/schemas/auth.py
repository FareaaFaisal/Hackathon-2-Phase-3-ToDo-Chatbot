# backend/app/schemas/auth.py
from typing import Optional
from pydantic import BaseModel, EmailStr
from sqlmodel import SQLModel

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserRead(SQLModel):
    id: int
    email: EmailStr