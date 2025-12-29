"""
Model catalog for listing available models from each provider.
"""
from __future__ import annotations

import os
from datetime import datetime
from typing import List, Tuple, Optional, Dict, Any

import httpx

from .config import AppSettings, LLMProvider, get_settings


# Watsonx public endpoints
WATSONX_BASE_URLS = [
    "https://us-south.ml.cloud.ibm.com",
    "https://eu-de.ml.cloud.ibm.com",
    "https://jp-tok.ml.cloud.ibm.com",
    "https://au-syd.ml.cloud.ibm.com",
]

WATSONX_ENDPOINT = "/ml/v1/foundation_model_specs"
WATSONX_PARAMS = {
    "version": "2024-09-16",
    "filters": "!function_embedding,!lifecycle_withdrawn",
}
TODAY = datetime.today().strftime("%Y-%m-%d")


def _is_deprecated_or_withdrawn(lifecycle: List[Dict[str, Any]]) -> bool:
    """Check if model lifecycle includes deprecated/withdrawn status."""
    for entry in lifecycle:
        if entry.get("id") in {"deprecated", "withdrawn"} and entry.get("start_date", "") <= TODAY:
            return True
    return False


async def _list_ollabridge_models(settings: AppSettings) -> Tuple[List[str], Optional[str]]:
    """List models from OllaBridge server via /api/tags."""
    base_url = settings.ollabridge.base_url
    if not base_url:
        return [], "OllaBridge base URL not configured"

    url = f"{base_url.rstrip('/')}/api/tags"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json().get("models", [])
            models = sorted({m.get("name", "") for m in data if m.get("name")})
            return models, None
    except Exception as e:
        return [], f"Error listing OllaBridge models: {e}"


async def _list_ollama_models(settings: AppSettings) -> Tuple[List[str], Optional[str]]:
    """List models from Ollama server via /api/tags."""
    base_url = settings.ollama.base_url
    url = f"{base_url.rstrip('/')}/api/tags"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json().get("models", [])
            models = sorted({m.get("name", "") for m in data if m.get("name")})
            return models, None
    except Exception as e:
        return [], f"Error listing Ollama models: {e}"


async def _list_openai_models(settings: AppSettings) -> Tuple[List[str], Optional[str]]:
    """List OpenAI models via /v1/models endpoint."""
    api_key = settings.openai.api_key
    if not api_key:
        return [], "OpenAI API key not configured"

    base_url = settings.openai.base_url or "https://api.openai.com"
    url = f"{base_url.rstrip('/')}/v1/models"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                url,
                headers={"Authorization": f"Bearer {api_key}"}
            )
            resp.raise_for_status()
            data = resp.json().get("data", [])
            models = sorted({m.get("id", "") for m in data if m.get("id")})
            return models, None
    except Exception as e:
        return [], f"Error listing OpenAI models: {e}"


async def _list_claude_models(settings: AppSettings) -> Tuple[List[str], Optional[str]]:
    """List Claude models via Anthropic /v1/models endpoint."""
    api_key = settings.claude.api_key
    if not api_key:
        return [], "Claude API key not configured"

    base_url = settings.claude.base_url or "https://api.anthropic.com"
    url = f"{base_url.rstrip('/')}/v1/models"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                url,
                headers={
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01"
                }
            )
            resp.raise_for_status()
            data = resp.json().get("data", [])
            models = sorted({m.get("id", "") for m in data if m.get("id")})
            return models, None
    except Exception as e:
        return [], f"Error listing Claude models: {e}"


async def _list_gemini_models(settings: AppSettings) -> Tuple[List[str], Optional[str]]:
    """Return default Gemini models (Google doesn't have a public model list API)."""
    if not settings.gemini.api_key:
        return [], "Gemini API key not configured"

    # Default Gemini models
    models = [
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-1.0-pro"
    ]
    return models, None


async def _list_watsonx_models(settings: AppSettings) -> Tuple[List[str], Optional[str]]:
    """List Watsonx models from public foundation model specs."""
    all_models = set()

    for base in WATSONX_BASE_URLS:
        url = f"{base}{WATSONX_ENDPOINT}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, params=WATSONX_PARAMS)
                resp.raise_for_status()
                resources = resp.json().get("resources", [])
                for m in resources:
                    if _is_deprecated_or_withdrawn(m.get("lifecycle", [])):
                        continue
                    model_id = m.get("model_id")
                    if model_id:
                        all_models.add(model_id)
        except Exception:
            continue

    if not all_models:
        return [], "No Watsonx models found"

    return sorted(all_models), None


async def list_models_for_provider(
    provider: LLMProvider,
    settings: Optional[AppSettings] = None
) -> Tuple[List[str], Optional[str]]:
    """
    List available models for a provider.

    Returns:
        (models, error) tuple where models is a list of model IDs
        and error is None if successful, otherwise an error message.
    """
    if settings is None:
        settings = get_settings()

    if provider == LLMProvider.ollabridge:
        return await _list_ollabridge_models(settings)
    elif provider == LLMProvider.ollama:
        return await _list_ollama_models(settings)
    elif provider == LLMProvider.openai:
        return await _list_openai_models(settings)
    elif provider == LLMProvider.claude:
        return await _list_claude_models(settings)
    elif provider == LLMProvider.gemini:
        return await _list_gemini_models(settings)
    elif provider == LLMProvider.watsonx:
        return await _list_watsonx_models(settings)
    else:
        return [], f"Unsupported provider: {provider}"
