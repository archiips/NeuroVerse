"""Application configuration settings"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings and configuration"""

    # Database
    database_url: str = "sqlite:///./neuroverse.db"

    # OpenNeuro API
    openneuro_graphql_url: str = "https://openneuro.org/crn/graphql"

    # API Settings
    api_title: str = "NeuroVerse API"
    api_version: str = "1.0.0"
    api_description: str = "API for neuroscience dataset visualization platform"

    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://localhost:8000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
