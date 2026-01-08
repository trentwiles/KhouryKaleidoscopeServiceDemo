from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # database
    database_url: str = "postgresql://postgres:postgres@localhost:5432/taskdb"
    
    # cors origins as comma-separated string
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"
    
    # environment
    environment: str = "development"
    
    class Config:
        env_file = ".env"
        extra = "ignore"
    
    @property
    def cors_origins(self) -> list[str]:
        # split comma-separated origins into list
        return [origin.strip() for origin in self.allowed_origins.split(",")]


@lru_cache
def get_settings() -> Settings:
    # cached settings instance
    return Settings()