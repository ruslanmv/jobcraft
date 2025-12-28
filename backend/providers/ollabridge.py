from __future__ import annotations

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from backend.core.settings import settings
from .base import LLMProvider

def _norm_base(url: str) -> str:
    return url.rstrip('/')

class OllaBridgeProvider(LLMProvider):
    name = 'ollabridge'

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=0.5, max=4))
    async def chat(self, *, system: str, user: str) -> str:
        if not settings.OLLABRIDGE_BASE_URL:
            raise RuntimeError('OLLABRIDGE_BASE_URL is not set (set it to your PC OllaBridge, e.g. http://localhost:11435)')
        if not settings.OLLABRIDGE_API_KEY:
            raise RuntimeError('OLLABRIDGE_API_KEY is not set (copy it from `ollabridge start` output)')

        url = f"{_norm_base(settings.OLLABRIDGE_BASE_URL)}/v1/chat/completions"
        headers = {
            # Accept both (OllaBridge can support both for SDK compatibility)
            'X-API-Key': settings.OLLABRIDGE_API_KEY,
            'Authorization': f"Bearer {settings.OLLABRIDGE_API_KEY}",
            'Content-Type': 'application/json',
        }
        payload = {
            'model': settings.OLLABRIDGE_MODEL,
            'messages': [
                {'role': 'system', 'content': system},
                {'role': 'user', 'content': user},
            ],
            'stream': False,
        }

        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(url, json=payload, headers=headers)
            r.raise_for_status()
            data = r.json()
            # OpenAI-like shape
            return data['choices'][0]['message']['content']
