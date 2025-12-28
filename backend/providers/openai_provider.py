from __future__ import annotations

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential
from backend.core.settings import settings
from .base import LLMProvider

class OpenAIProvider(LLMProvider):
    name = 'openai'

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=0.5, max=4))
    async def chat(self, *, system: str, user: str) -> str:
        if not settings.OPENAI_API_KEY:
            raise RuntimeError('OPENAI_API_KEY is not set')

        payload = {
            'model': settings.OPENAI_MODEL,
            'messages': [
                {'role': 'system', 'content': system},
                {'role': 'user', 'content': user},
            ],
        }
        headers = {
            'Authorization': f"Bearer {settings.OPENAI_API_KEY}",
            'Content-Type': 'application/json',
        }
        async with httpx.AsyncClient(timeout=90) as client:
            r = await client.post('https://api.openai.com/v1/chat/completions', json=payload, headers=headers)
            r.raise_for_status()
            data = r.json()
            return data['choices'][0]['message']['content']
