from __future__ import annotations

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential
from backend.core.settings import settings
from .base import LLMProvider

class WatsonxProvider(LLMProvider):
    name = 'watsonx'

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=0.5, max=4))
    async def chat(self, *, system: str, user: str) -> str:
        if not (settings.WATSONX_API_KEY and settings.WATSONX_URL and settings.WATSONX_PROJECT_ID):
            raise RuntimeError('WATSONX_API_KEY/WATSONX_URL/WATSONX_PROJECT_ID must be set')

        payload = {
            'model_id': settings.WATSONX_MODEL_ID,
            'project_id': settings.WATSONX_PROJECT_ID,
            'input': f"{system}\n\n{user}",
            'parameters': {'decoding_method': 'greedy', 'max_new_tokens': 800},
        }
        headers = {
            'Authorization': f"Bearer {settings.WATSONX_API_KEY}",
            'Content-Type': 'application/json',
        }
        async with httpx.AsyncClient(timeout=90) as client:
            r = await client.post(
                f"{settings.WATSONX_URL.rstrip('/')}/ml/v1/text/generation?version=2024-05-01",
                json=payload,
                headers=headers,
            )
            r.raise_for_status()
            data = r.json()
            results = data.get('results', [])
            return (results[0].get('generated_text', '') if results else '') or ''
