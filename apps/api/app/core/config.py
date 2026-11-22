"""
Application Configuration and Environment Settings for verelli.lol API.
Adheres to Pydantic v2 Settings specifications.
"""
from typing import List, Optional
import os

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    # Resilient Pydantic v2 fallback when pydantic-settings is not present in runtime
    from pydantic import BaseModel

    class BaseSettings(BaseModel):  # type: ignore
        def __init__(self, **values):
            data = {}
            for field_name, field_info in self.model_fields.items():
                env_val = os.getenv(field_name)
                if env_val is not None:
                    if field_info.annotation in (float, Optional[float]):
                        try:
                            data[field_name] = float(env_val)
                        except ValueError:
                            data[field_name] = env_val
                    elif field_info.annotation in (int, Optional[int]):
                        try:
                            data[field_name] = int(env_val)
                        except ValueError:
                            data[field_name] = env_val
                    elif field_info.annotation in (bool, Optional[bool]):
                        data[field_name] = env_val.lower() in ("true", "1", "yes")
                    elif field_info.annotation in (List[str], list[str], Optional[List[str]]):
                        data[field_name] = [item.strip() for item in env_val.split(",") if item.strip()]
                    else:
                        data[field_name] = env_val
                elif field_name in values:
                    data[field_name] = values[field_name]
                elif field_info.default is not ...:
                    data[field_name] = field_info.default
            super().__init__(**data)

    def SettingsConfigDict(**kwargs):  # type: ignore
        return kwargs


class Settings(BaseSettings):
    """Core application settings with environment variable auto-discovery."""

    PROJECT_NAME: str = "verelli.lol API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"

    # Database & Third-Party Vector Provider Credentials
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None

    # Zero-Hallucination Semantic Boundary
    SIMILARITY_THRESHOLD: float = 0.65

    # CORS Configuration - Explicitly allows local dev and production domains
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://verelli.lol",
    ]

    @property
    def effective_supabase_key(self) -> Optional[str]:
        """Returns service role key if available, otherwise anonymous public key."""
        return self.SUPABASE_SERVICE_ROLE_KEY or self.SUPABASE_KEY

    # Model Configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )


settings = Settings()
