from __future__ import annotations

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential
from backend.core.settings import settings
from .base import LLMProvider

class GeminiProvider(LLMProvider):
    name = 'gemini'

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=0.5, max=4))
    async def chat(self, *, system: str, user: str) -> str:
        if not settings.GEMINI_API_KEY:
            raise RuntimeError('GEMINI_API_KEY is not set')

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
        payload = {
            'contents': [
                {'role': 'user', 'parts': [{'text': f\"{system}\n\n{user}\"}]}
            ]
        }
        async with httpx.AsyncClient(timeout=90) as client:
            r = await client.post(url, json=payload)
            r.raise_for_status()
            data = r.json()
            cands = data.get('candidates', [])
            if not cands:
                return ''
            parts = cands[0].get('content', {}).get('parts', [])
            return ''.join(p.get('text', '') for p in parts)
