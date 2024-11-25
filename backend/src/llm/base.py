from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, Any


class LLMProvider(ABC):
    def __init__(self, api_key: str, model: str):
        self.api_key = api_key
        self.model = model
        self.system_message: str | None = None

    def set_system_message(self, message: str) -> None:
        self.system_message = message

    @abstractmethod
    async def generate(
        self, prompt: str, stream: bool = False, **kwargs
    ) -> AsyncGenerator[str, None] | str:
        pass

    @abstractmethod
    async def validate_api_key(self) -> bool:
        pass
