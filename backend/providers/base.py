from __future__ import annotations
from abc import ABC, abstractmethod

class LLMProvider(ABC):
    name: str

    @abstractmethod
    async def chat(self, *, system: str, user: str) -> str:
        raise NotImplementedError
