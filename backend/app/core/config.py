import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered Resume & Interview Coach"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment variables
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-for-hackathon-demo-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./ai_resume.db")
    
    # AI API Configuration
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "gpt-4o-mini")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "openai")  # openai, gemini, or mock
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
