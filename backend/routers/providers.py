"""
API endpoints for LLM provider management.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.core.config import LLMProvider, get_settings
from backend.core.llm_factory import get_provider_status
from backend.core.model_catalog import list_models_for_provider
from backend.core.settings_manager import get_settings_manager

router = APIRouter(prefix="/api/providers", tags=["providers"])


class ProviderInfo(BaseModel):
    """Provider information response."""
    id: str
    label: str
    type: str
    icon: str
    description: str
    configured: bool
    recommended: bool = False


class ProviderStatusResponse(BaseModel):
    """Provider status response."""
    active_provider: str
    providers: dict


class ProviderModelsResponse(BaseModel):
    """Provider models list response."""
    provider: str
    models: List[str]
    error: Optional[str] = None


class ProviderConfigUpdate(BaseModel):
    """Provider configuration update request."""
    api_key: Optional[str] = None
    model: Optional[str] = None
    base_url: Optional[str] = None
    project_id: Optional[str] = None  # For WatsonX


class ProviderConfigResponse(BaseModel):
    """Provider configuration response."""
    provider: str
    config: Dict[str, Any]


class ActiveProviderUpdate(BaseModel):
    """Active provider update request."""
    provider: str


@router.get("/", response_model=List[ProviderInfo])
async def list_providers():
    """
    List all available LLM providers with their configuration status.
    """
    settings = get_settings()
    status = get_provider_status(settings)

    providers = [
        ProviderInfo(
            id="ollabridge",
            label="Your Computer (OllaBridge)",
            type="local",
            icon="laptop",
            description="Private, free, local AI via secure tunnel. Recommended for maximum privacy.",
            configured=status["providers"]["ollabridge"]["configured"],
            recommended=True,
        ),
        ProviderInfo(
            id="ollama",
            label="Ollama (Local)",
            type="local",
            icon="laptop",
            description="Direct local Ollama server. Fast and private.",
            configured=status["providers"]["ollama"]["configured"],
        ),
        ProviderInfo(
            id="openai",
            label="OpenAI GPT-4",
            type="cloud",
            icon="bot",
            description="High reasoning capabilities. API Key required.",
            configured=status["providers"]["openai"]["configured"],
        ),
        ProviderInfo(
            id="claude",
            label="Anthropic Claude",
            type="cloud",
            icon="bot",
            description="Excellent for creative writing. API Key required.",
            configured=status["providers"]["claude"]["configured"],
        ),
        ProviderInfo(
            id="gemini",
            label="Google Gemini",
            type="cloud",
            icon="bot",
            description="Fast and multimodal. API Key required.",
            configured=status["providers"]["gemini"]["configured"],
        ),
        ProviderInfo(
            id="watsonx",
            label="IBM watsonx",
            type="cloud",
            icon="bot",
            description="Enterprise grade security. API Key and Project ID required.",
            configured=status["providers"]["watsonx"]["configured"],
        ),
    ]

    return providers


@router.get("/status", response_model=ProviderStatusResponse)
async def get_status():
    """
    Get current provider configuration status.
    """
    settings = get_settings()
    status = get_provider_status(settings)
    return ProviderStatusResponse(**status)


@router.get("/{provider_id}/models", response_model=ProviderModelsResponse)
async def get_provider_models(provider_id: str):
    """
    List available models for a specific provider.
    """
    try:
        provider = LLMProvider(provider_id)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid provider: {provider_id}")

    settings = get_settings()
    models, error = await list_models_for_provider(provider, settings)

    return ProviderModelsResponse(
        provider=provider_id,
        models=models,
        error=error,
    )


@router.post("/test/{provider_id}")
async def test_provider_connection(provider_id: str):
    """
    Test connection to a specific provider.
    """
    try:
        provider_enum = LLMProvider(provider_id)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid provider: {provider_id}")

    settings = get_settings()

    # Try to list models as a connection test
    models, error = await list_models_for_provider(provider_enum, settings)

    if error:
        return {
            "success": False,
            "provider": provider_id,
            "error": error,
        }

    return {
        "success": True,
        "provider": provider_id,
        "models_count": len(models),
        "message": f"Successfully connected to {provider_id}. Found {len(models)} models.",
    }


@router.get("/{provider_id}/config", response_model=ProviderConfigResponse)
async def get_provider_config(provider_id: str):
    """
    Get configuration for a specific provider.
    """
    try:
        LLMProvider(provider_id)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid provider: {provider_id}")

    manager = get_settings_manager()
    config = manager.get_provider_config(provider_id)

    # Mask API keys in response (show only last 4 chars)
    if "api_key" in config and config["api_key"]:
        key = config["api_key"]
        if len(key) > 8:
            config["api_key"] = "..." + key[-4:]
        else:
            config["api_key"] = "***"

    return ProviderConfigResponse(provider=provider_id, config=config)


@router.put("/{provider_id}/config", response_model=ProviderConfigResponse)
async def update_provider_config(provider_id: str, update: ProviderConfigUpdate):
    """
    Update configuration for a specific provider.
    """
    try:
        LLMProvider(provider_id)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid provider: {provider_id}")

    manager = get_settings_manager()

    # Convert to dict and filter out None values
    config_dict = update.model_dump(exclude_none=True)

    try:
        updated_config = manager.update_provider_config(provider_id, config_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update config: {str(e)}")

    # Mask API keys in response
    if "api_key" in updated_config and updated_config["api_key"]:
        key = updated_config["api_key"]
        if len(key) > 8:
            updated_config["api_key"] = "..." + key[-4:]
        else:
            updated_config["api_key"] = "***"

    return ProviderConfigResponse(provider=provider_id, config=updated_config)


@router.put("/active")
async def set_active_provider(update: ActiveProviderUpdate):
    """
    Set the active LLM provider.
    """
    manager = get_settings_manager()

    try:
        manager.set_active_provider(update.provider)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to set active provider: {str(e)}")

    return {
        "success": True,
        "active_provider": update.provider,
        "message": f"Active provider set to {update.provider}",
    }


@router.get("/active")
async def get_active_provider():
    """
    Get the currently active LLM provider.
    """
    manager = get_settings_manager()
    active = manager.get_active_provider()

    return {
        "active_provider": active,
    }
