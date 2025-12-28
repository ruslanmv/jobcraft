from __future__ import annotations
from typing import Dict

from backend.core.settings import settings
from backend.providers.base import LLMProvider
from backend.providers.ollabridge import OllaBridgeProvider
from backend.providers.ollama import OllamaProvider
from backend.providers.openai_provider import OpenAIProvider
from backend.providers.anthropic import AnthropicProvider
from backend.providers.gemini import GeminiProvider
from backend.providers.watsonx import WatsonxProvider

class MultiLLMRouter:
    def __init__(self):
        self.providers: Dict[str, LLMProvider] = {
            'ollabridge': OllaBridgeProvider(),   # ✅ default
            'ollama': OllamaProvider(),           # optional
            'openai': OpenAIProvider(),
            'anthropic': AnthropicProvider(),
            'gemini': GeminiProvider(),
            'watsonx': WatsonxProvider(),
        }

    def list(self) -> list[str]:
        return sorted(self.providers.keys())

    async def chat(self, provider: str | None, *, system: str, user: str) -> str:
        name = (provider or settings.DEFAULT_PROVIDER).lower()
        if name not in self.providers:
            name = settings.DEFAULT_PROVIDER
        return await self.providers[name].chat(system=system, user=user)

router = MultiLLMRouter()
