from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    llm_model: str = "gpt-4o-2024-11-20"  # Default model

    model_config = SettingsConfigDict(env_file=".env")

    def get_active_api_key(self) -> str | None:
        return {
            LLMProvider.OPENAI: self.openai_api_key,
            LLMProvider.ANTHROPIC: self.anthropic_api_key,
            LLMProvider.OPENROUTER: self.openrouter_api_key,
            LLMProvider.GEMINI: self.gemini_api_key,
        }[self.llm_provider]


app = FastAPI(title="ai-charter API")
settings = Settings()

if not settings.get_active_api_key():
    print(f"Warning: No API key set for selected provider: {settings.llm_provider}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
