from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import api
from .config import settings


app = FastAPI(title="ai-charter API")

app.include_router(api.router)

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
