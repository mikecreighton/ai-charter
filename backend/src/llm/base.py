from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, Any, List
import openai
from openai import AsyncOpenAI
import os
from functools import lru_cache


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


class LLMClient:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def create_chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000,
    ) -> str:
        """
        Create a chat completion using the OpenAI API.

        Args:
            messages: List of message dictionaries with 'role' and 'content'
            temperature: Controls randomness (0-1)
            max_tokens: Maximum tokens in response

        Returns:
            The LLM's response text
        """
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",  # or your preferred model
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content

        except Exception as e:
            raise Exception(f"LLM API error: {str(e)}")


@lru_cache()
def get_llm_client() -> LLMClient:
    """Get or create a singleton LLM client instance."""
    return LLMClient()
