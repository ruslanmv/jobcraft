"""
LLM provider factory for initializing LLM instances.
"""
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from backend.providers.base import LLMProvider as BaseProvider

from .config import AppSettings, LLMProvider, get_settings


def build_llm_provider() -> "BaseProvider":
    """
    Build and return the configured LLM provider instance.

    Returns:
        LLMProvider instance configured based on settings.

    Raises:
        ValueError: If provider is not configured or unsupported.
    """
    settings = get_settings()
    provider = settings.provider

    if provider == LLMProvider.ollabridge:
        from backend.providers.ollabridge import OllaBridgeProvider

        if not settings.ollabridge.base_url:
            raise ValueError(
                "OllaBridge base URL is required. "
                "Set OLLABRIDGE_BASE_URL in .env (e.g., http://localhost:11435)"
            )
        if not settings.ollabridge.api_key:
            raise ValueError(
                "OllaBridge API key is required. "
                "Set OLLABRIDGE_API_KEY in .env (copy from `ollabridge start` output)"
            )

        return OllaBridgeProvider()

    elif provider == LLMProvider.ollama:
        from backend.providers.ollama import OllamaProvider

        if not settings.ollama.base_url:
            raise ValueError(
                "Ollama base URL is required. "
                "Set OLLAMA_BASE_URL in .env (e.g., http://localhost:11434)"
            )

        return OllamaProvider()

    elif provider == LLMProvider.openai:
        from backend.providers.openai_provider import OpenAIProvider

        if not settings.openai.api_key:
            raise ValueError(
                "OpenAI API key is required. "
                "Set OPENAI_API_KEY in .env or configure in Settings"
            )

        return OpenAIProvider()

    elif provider == LLMProvider.claude:
        from backend.providers.anthropic import AnthropicProvider

        if not settings.claude.api_key:
            raise ValueError(
                "Anthropic API key is required. "
                "Set ANTHROPIC_API_KEY in .env or configure in Settings"
            )

        return AnthropicProvider()

    elif provider == LLMProvider.gemini:
        from backend.providers.gemini import GeminiProvider

        if not settings.gemini.api_key:
            raise ValueError(
                "Gemini API key is required. "
                "Set GEMINI_API_KEY in .env or configure in Settings"
            )

        return GeminiProvider()

    elif provider == LLMProvider.watsonx:
        from backend.providers.watsonx import WatsonxProvider

        if not settings.watsonx.api_key:
            raise ValueError(
                "Watsonx API key is required. "
                "Set WATSONX_API_KEY in .env or configure in Settings"
            )
        if not settings.watsonx.project_id:
            raise ValueError(
                "Watsonx project ID is required. "
                "Set WATSONX_PROJECT_ID in .env or configure in Settings"
            )

        return WatsonxProvider()

    else:
        raise ValueError(f"Unsupported provider: {provider}")


def get_provider_status(settings: AppSettings = None) -> dict:
    """
    Get configuration status for all providers.

    Returns:
        Dictionary with provider status information.
    """
    if settings is None:
        settings = get_settings()

    return {
        "active_provider": settings.provider.value,
        "providers": {
            "ollabridge": {
                "configured": bool(settings.ollabridge.base_url and settings.ollabridge.api_key),
                "base_url": settings.ollabridge.base_url,
                "model": settings.ollabridge.model,
                "has_api_key": bool(settings.ollabridge.api_key),
            },
            "ollama": {
                "configured": bool(settings.ollama.base_url),
                "base_url": settings.ollama.base_url,
                "model": settings.ollama.model,
            },
            "openai": {
                "configured": bool(settings.openai.api_key),
                "model": settings.openai.model,
                "has_api_key": bool(settings.openai.api_key),
                "base_url": settings.openai.base_url,
            },
            "claude": {
                "configured": bool(settings.claude.api_key),
                "model": settings.claude.model,
                "has_api_key": bool(settings.claude.api_key),
                "base_url": settings.claude.base_url,
            },
            "gemini": {
                "configured": bool(settings.gemini.api_key),
                "model": settings.gemini.model,
                "has_api_key": bool(settings.gemini.api_key),
            },
            "watsonx": {
                "configured": bool(settings.watsonx.api_key and settings.watsonx.project_id),
                "model_id": settings.watsonx.model_id,
                "has_api_key": bool(settings.watsonx.api_key),
                "has_project_id": bool(settings.watsonx.project_id),
                "base_url": settings.watsonx.base_url,
            },
        },
    }
