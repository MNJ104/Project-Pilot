import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Project Pilot AI Service"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8000"))
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
