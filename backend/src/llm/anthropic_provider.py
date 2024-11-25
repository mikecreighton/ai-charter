from typing import AsyncGenerator
from anthropic import AsyncAnthropic
from .base import LLMProvider


class AnthropicProvider(LLMProvider):
    def __init__(self, api_key: str, model: str):
        super().__init__(api_key, model)
        self.client = AsyncAnthropic(api_key=api_key)

    async def generate(
        self, prompt: str, stream: bool = False, **kwargs
    ) -> AsyncGenerator[str, None] | str:
        try:
            messages = []
            if self.system_message:
                messages.append({"role": "system", "content": self.system_message})
            messages.append({"role": "user", "content": prompt})

            if stream:
                return self._generate_stream(messages, **kwargs)
            else:
                response = await self.client.messages.create(
                    model=self.model,
                    messages=messages,
                    stream=False,
                    **kwargs,
                )
                return response.content[0].text
        except Exception as e:
            raise e

    async def _generate_stream(self, messages: list, **kwargs) -> AsyncGenerator[str, None]:
        stream = await self.client.messages.create(
            model=self.model,
            messages=messages,
            stream=True,
            **kwargs,
        )
        async for chunk in stream.text_stream:
            yield chunk

    async def validate_api_key(self) -> bool:
        try:
            # Make a minimal request to test the API key
            await self.client.messages.create(
                model=self.model,
                messages=[{"role": "user", "content": "test"}],
                max_tokens=1,
            )
            return True
        except Exception:
            return False
