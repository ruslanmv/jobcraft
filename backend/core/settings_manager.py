"""
Runtime settings manager for storing provider configurations.

Stores runtime overrides in a secure JSON file, separate from .env.
This allows users to update provider credentials via the UI without modifying .env.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, Optional

from backend.core.config import AppSettings, LLMProvider, get_settings


class SettingsManager:
    """Manages runtime provider settings."""

    def __init__(self, settings: Optional[AppSettings] = None):
        self.settings = settings or get_settings()
        self.config_file = self.settings.data_dir / "provider_config.json"
        self._runtime_config: Dict[str, Any] = {}
        self._load()

    def _load(self):
        """Load runtime config from file."""
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    self._runtime_config = json.load(f)
            except Exception as e:
                print(f"Warning: Failed to load runtime config: {e}")
                self._runtime_config = {}
        else:
            self._runtime_config = {}

    def _save(self):
        """Save runtime config to file."""
        try:
            self.config_file.parent.mkdir(parents=True, exist_ok=True)
            with open(self.config_file, 'w') as f:
                json.dump(self._runtime_config, f, indent=2)
        except Exception as e:
            raise RuntimeError(f"Failed to save runtime config: {e}")

    def get_active_provider(self) -> str:
        """Get the currently active provider."""
        # Runtime override takes precedence
        if "active_provider" in self._runtime_config:
            return self._runtime_config["active_provider"]
        # Otherwise use env/default
        return self.settings.provider.value

    def set_active_provider(self, provider_id: str) -> None:
        """Set the active provider."""
        try:
            # Validate provider
            LLMProvider(provider_id)
        except ValueError:
            raise ValueError(f"Invalid provider: {provider_id}")

        self._runtime_config["active_provider"] = provider_id
        self._save()

    def get_provider_config(self, provider_id: str) -> Dict[str, Any]:
        """Get configuration for a specific provider."""
        # Start with defaults from env/settings
        defaults = self._get_defaults_for_provider(provider_id)

        # Apply runtime overrides
        runtime = self._runtime_config.get("providers", {}).get(provider_id, {})

        # Merge (runtime overrides defaults)
        return {**defaults, **runtime}

    def update_provider_config(
        self,
        provider_id: str,
        config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update configuration for a specific provider."""
        # Validate provider
        try:
            LLMProvider(provider_id)
        except ValueError:
            raise ValueError(f"Invalid provider: {provider_id}")

        # Ensure providers dict exists
        if "providers" not in self._runtime_config:
            self._runtime_config["providers"] = {}

        # Filter out None/empty values
        filtered_config = {k: v for k, v in config.items() if v}

        # Update runtime config
        self._runtime_config["providers"][provider_id] = filtered_config
        self._save()

        return self.get_provider_config(provider_id)

    def _get_defaults_for_provider(self, provider_id: str) -> Dict[str, Any]:
        """Get default configuration from env/settings."""
        if provider_id == "ollabridge":
            return {
                "base_url": self.settings.ollabridge.base_url or "",
                "api_key": self.settings.ollabridge.api_key or "",
                "model": self.settings.ollabridge.model,
            }
        elif provider_id == "ollama":
            return {
                "base_url": self.settings.ollama.base_url,
                "model": self.settings.ollama.model,
            }
        elif provider_id == "openai":
            return {
                "api_key": self.settings.openai.api_key or "",
                "model": self.settings.openai.model,
                "base_url": self.settings.openai.base_url or "",
            }
        elif provider_id == "claude":
            return {
                "api_key": self.settings.claude.api_key or "",
                "model": self.settings.claude.model,
                "base_url": self.settings.claude.base_url or "",
            }
        elif provider_id == "gemini":
            return {
                "api_key": self.settings.gemini.api_key or "",
                "model": self.settings.gemini.model,
            }
        elif provider_id == "watsonx":
            return {
                "api_key": self.settings.watsonx.api_key or "",
                "project_id": self.settings.watsonx.project_id or "",
                "model": self.settings.watsonx.model_id,
                "base_url": self.settings.watsonx.base_url,
            }
        else:
            return {}

    def get_all_configs(self) -> Dict[str, Dict[str, Any]]:
        """Get all provider configurations."""
        providers = ["ollabridge", "ollama", "openai", "claude", "gemini", "watsonx"]
        return {
            provider: self.get_provider_config(provider)
            for provider in providers
        }


# Global instance
_manager: Optional[SettingsManager] = None


def get_settings_manager() -> SettingsManager:
    """Get or create settings manager instance."""
    global _manager
    if _manager is None:
        _manager = SettingsManager()
    return _manager
