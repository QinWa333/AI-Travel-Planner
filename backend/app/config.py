from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    openai_api_key: Optional[str] = None
    dashscope_api_key: Optional[str] = None  # 阿里云通义千问 API Key
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080
    frontend_url: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
