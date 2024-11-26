from typing import AsyncGenerator
import openai
from .base import LLMProvider


class OpenAIProvider(LLMProvider):
    def __init__(self, api_key: str, model: str, base_url: str | None = None):
        super().__init__(api_key, model)
        client_args = {"api_key": api_key}
        if base_url:
            client_args["base_url"] = base_url
        self.client = openai.AsyncOpenAI(**client_args)

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
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    stream=False,
                    **kwargs,
                )
                return response.choices[0].message.content or ""
        except Exception as e:
            raise e

    async def _generate_stream(self, messages: list, **kwargs) -> AsyncGenerator[str, None]:
        stream = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            stream=True,
            **kwargs,
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    async def validate_api_key(self) -> bool:
        try:
            await self.client.models.list()
            return True
        except:
            return False
