# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    BETTER_AUTH_SECRET: str
    BETTER_AUTH_URL: str
    NEON_DATABASE_URL: str

    PROJECT_NAME: str = "TodoApp"
    API_V1_STR: str = "/api/v1"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # 30 minutes for access tokens
    
    # CORS settings
    FRONTEND_CORS_ORIGINS: list[str] = ["http://localhost:3000"] # Default for local frontend

settings = Settings()