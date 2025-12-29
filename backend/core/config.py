"""
Enhanced settings with LLM provider configuration.
"""
from __future__ import annotations

from enum import Enum
from pathlib import Path
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class LLMProvider(str, Enum):
    """Supported LLM providers."""
    ollabridge = "ollabridge"
    ollama = "ollama"
    openai = "openai"
    claude = "claude"
    gemini = "gemini"
    watsonx = "watsonx"


class OllaBridgeConfig(BaseSettings):
    """OllaBridge configuration."""
    base_url: Optional[str] = Field(None, alias="OLLABRIDGE_BASE_URL")
    api_key: Optional[str] = Field(None, alias="OLLABRIDGE_API_KEY")
    model: str = Field("deepseek-r1", alias="OLLABRIDGE_MODEL")


class OllamaConfig(BaseSettings):
    """Ollama configuration."""
    base_url: str = Field("http://localhost:11434", alias="OLLAMA_BASE_URL")
    model: str = Field("deepseek-r1", alias="OLLAMA_MODEL")


class OpenAIConfig(BaseSettings):
    """OpenAI configuration."""
    api_key: Optional[str] = Field(None, alias="OPENAI_API_KEY")
    model: str = Field("gpt-4o-mini", alias="OPENAI_MODEL")
    base_url: Optional[str] = Field(None, alias="OPENAI_BASE_URL")


class ClaudeConfig(BaseSettings):
    """Anthropic Claude configuration."""
    api_key: Optional[str] = Field(None, alias="ANTHROPIC_API_KEY")
    model: str = Field("claude-3-5-sonnet-latest", alias="ANTHROPIC_MODEL")
    base_url: Optional[str] = Field(None, alias="ANTHROPIC_BASE_URL")


class GeminiConfig(BaseSettings):
    """Google Gemini configuration."""
    api_key: Optional[str] = Field(None, alias="GEMINI_API_KEY")
    model: str = Field("gemini-1.5-pro", alias="GEMINI_MODEL")


class WatsonxConfig(BaseSettings):
    """IBM watsonx configuration."""
    api_key: Optional[str] = Field(None, alias="WATSONX_API_KEY")
    base_url: str = Field("https://us-south.ml.cloud.ibm.com", alias="WATSONX_URL")
    project_id: Optional[str] = Field(None, alias="WATSONX_PROJECT_ID")
    model_id: str = Field("ibm/granite-3-8b-instruct", alias="WATSONX_MODEL_ID")


class AppSettings(BaseSettings):
    """Application settings with provider configs."""
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra='ignore'
    )

    # General
    app_name: str = Field("JobCraft Copilot", alias="APP_NAME")
    env: str = Field("dev", alias="ENV")
    data_dir: Path = Field(Path.home() / '.jobcraft', alias="DATA_DIR")

    # Active provider (default: ollabridge for privacy)
    provider: LLMProvider = Field(LLMProvider.ollabridge, alias="DEFAULT_PROVIDER")

    # Provider configurations
    ollabridge: OllaBridgeConfig = Field(default_factory=OllaBridgeConfig)
    ollama: OllamaConfig = Field(default_factory=OllamaConfig)
    openai: OpenAIConfig = Field(default_factory=OpenAIConfig)
    claude: ClaudeConfig = Field(default_factory=ClaudeConfig)
    gemini: GeminiConfig = Field(default_factory=GeminiConfig)
    watsonx: WatsonxConfig = Field(default_factory=WatsonxConfig)

    # Regional defaults (Europe-first)
    default_countries: str = Field("IT,DE,GB,CH", alias="DEFAULT_COUNTRIES")
    default_locale: str = Field("en-GB", alias="DEFAULT_LOCALE")
    default_timezone: str = Field("Europe/Rome", alias="DEFAULT_TIMEZONE")

    # Database
    database_url: Optional[str] = Field(None, alias="DATABASE_URL")

    # Email (SMTP)
    smtp_host: Optional[str] = Field(None, alias="SMTP_HOST")
    smtp_port: int = Field(587, alias="SMTP_PORT")
    smtp_username: Optional[str] = Field(None, alias="SMTP_USERNAME")
    smtp_password: Optional[str] = Field(None, alias="SMTP_PASSWORD")
    smtp_from: Optional[str] = Field(None, alias="SMTP_FROM")

    # Safety (compliance allowlist)
    allowlist_job_domains: str = Field(
        "boards.greenhouse.io,jobs.lever.co,jobs.ashbyhq.com,workable.com",
        alias="ALLOWLIST_JOB_DOMAINS"
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Ensure data directory exists
        self.data_dir.mkdir(parents=True, exist_ok=True)


# Global settings instance
_settings: Optional[AppSettings] = None


def get_settings() -> AppSettings:
    """Get or create settings instance."""
    global _settings
    if _settings is None:
        _settings = AppSettings()
    return _settings


# Legacy compatibility
settings = get_settings()
