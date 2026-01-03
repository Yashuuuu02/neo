"""
Core configuration module.
Loads environment variables and provides typed settings.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # OpenRouter Configuration (OpenAI-compatible)
    openrouter_api_key: str
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    
    # LLM Configuration
    llm_model: str = "deepseek/deepseek-r1-0528:free"
    llm_temperature: float = 0.7
    
    # Pinecone Configuration
    pinecone_api_key: str
    pinecone_index: str
    
    # RAG Configuration
    rag_similarity_threshold: float = 0.35
    
    # Embedding Configuration (we'll use a free alternative)
    embedding_model: str = "text-embedding-3-large"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """
    Returns cached settings instance.
    Uses lru_cache to avoid reloading env vars on every request.
    """
    return Settings()
