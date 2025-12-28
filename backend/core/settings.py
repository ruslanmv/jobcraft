from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    # General
    APP_NAME: str = 'JobCraft Copilot'
    ENV: str = 'dev'
    DATA_DIR: Path = Path.home() / '.jobcraft'

    # Regions (defaults: Italy, Germany, UK, Switzerland)
    # ISO-2: IT, DE, GB, CH
    DEFAULT_COUNTRIES: str = 'IT,DE,GB,CH'
    DEFAULT_LOCALE: str = 'en-GB'
    DEFAULT_TIMEZONE: str = 'Europe/Rome'

    # Router default (OllaBridge-first)
    DEFAULT_PROVIDER: str = 'ollabridge'

    # --- OllaBridge (recommended) ---
    # Example:
    #   OLLABRIDGE_BASE_URL=http://localhost:11435
    #   OLLABRIDGE_API_KEY=sk-ollabridge-...
    OLLABRIDGE_BASE_URL: str | None = None
    OLLABRIDGE_API_KEY: str | None = None
    OLLABRIDGE_MODEL: str = 'deepseek-r1'

    # OpenAI
    OPENAI_API_KEY: str | None = None
    OPENAI_MODEL: str = 'gpt-4o-mini'

    # Anthropic
    ANTHROPIC_API_KEY: str | None = None
    ANTHROPIC_MODEL: str = 'claude-3-5-sonnet-latest'

    # Gemini
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = 'gemini-1.5-pro'

    # watsonx
    WATSONX_API_KEY: str | None = None
    WATSONX_URL: str | None = None
    WATSONX_PROJECT_ID: str | None = None
    WATSONX_MODEL_ID: str = 'ibm/granite-20b-code-instruct'

    # Ollama (direct; optional fallback)
    OLLAMA_BASE_URL: str = 'http://localhost:11434'
    OLLAMA_MODEL: str = 'deepseek-r1'

    # Database
    # SQLite default under DATA_DIR
    DATABASE_URL: str | None = None

    # Email
    SMTP_HOST: str | None = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: str | None = None
    SMTP_PASSWORD: str | None = None
    SMTP_FROM: str | None = None

    # Safety
    # Only allow automated fetching/assist on these ATS/boards.
    ALLOWLIST_JOB_DOMAINS: str = (
        'boards.greenhouse.io, jobs.lever.co, jobs.ashbyhq.com, workable.com, greenhouse.io, lever.co, ashbyhq.com'
    )

settings = Settings()
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
