from pydantic_settings import BaseSettings, SettingsConfigDict
from enum import Enum


class LLMProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    OPENROUTER = "openrouter"
    GEMINI = "gemini"


class Settings(BaseSettings):
    openai_api_key: str | None = None
    openrouter_api_key: str | None = None
    gemini_api_key: str | None = None
    anthropic_api_key: str | None = None
    llm_provider: LLMProvider = LLMProvider.OPENAI
    llm_model: str = "gpt-4o"  # Default model

    model_config = SettingsConfigDict(env_file=".env")

    def get_active_api_key(self) -> str | None:
        return {
            LLMProvider.OPENAI: self.openai_api_key,
            LLMProvider.ANTHROPIC: self.anthropic_api_key,
            LLMProvider.OPENROUTER: self.openrouter_api_key,
            LLMProvider.GEMINI: self.gemini_api_key,
        }[self.llm_provider]

    def get_base_url(self) -> str | None:
        return {
            LLMProvider.OPENAI: None,
            LLMProvider.ANTHROPIC: None,
            LLMProvider.OPENROUTER: "https://openrouter.ai/api/v1",
            LLMProvider.GEMINI: "https://generativelanguage.googleapis.com/v1beta/openai/",
        }[self.llm_provider]


settings = Settings()
