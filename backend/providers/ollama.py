from __future__ import annotations

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from backend.core.settings import settings
from .base import LLMProvider

class OllamaProvider(LLMProvider):
    name = 'ollama'

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=0.5, max=4))
    async def chat(self, *, system: str, user: str) -> str:
        payload = {
            'model': settings.OLLAMA_MODEL,
            'messages': [
                {'role': 'system', 'content': system},
                {'role': 'user', 'content': user},
            ],
            'stream': False,
        }
        async with httpx.AsyncClient(timeout=90) as client:
            r = await client.post(f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/chat", json=payload)
            r.raise_for_status()
            data = r.json()
            return data.get('message', {}).get('content', '') or ''
