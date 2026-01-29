# backend/app/core/database.py
from sqlmodel import create_engine, Session
from ..core.config import settings

engine = create_engine(settings.NEON_DATABASE_URL, echo=True)

def create_db_and_tables():
    # This will create tables based on SQLModel metadata
    # In a real application, you would use Alembic for migrations
    # SQLModel.metadata.create_all(engine)
    pass

def get_session():
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()