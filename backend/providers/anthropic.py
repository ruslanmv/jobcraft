from __future__ import annotations

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential
from backend.core.settings import settings
from .base import LLMProvider

class AnthropicProvider(LLMProvider):
    name = 'anthropic'

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=0.5, max=4))
    async def chat(self, *, system: str, user: str) -> str:
        if not settings.ANTHROPIC_API_KEY:
            raise RuntimeError('ANTHROPIC_API_KEY is not set')

        payload = {
            'model': settings.ANTHROPIC_MODEL,
            'max_tokens': 1024,
            'system': system,
            'messages': [{'role': 'user', 'content': user}],
        }
        headers = {
            'x-api-key': settings.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        }
        async with httpx.AsyncClient(timeout=90) as client:
            r = await client.post('https://api.anthropic.com/v1/messages', json=payload, headers=headers)
            r.raise_for_status()
            data = r.json()
            blocks = data.get('content', [])
            return ''.join(b.get('text', '') for b in blocks if b.get('type') == 'text')
