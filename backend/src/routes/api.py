from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import AsyncGenerator
from fastapi.responses import StreamingResponse
from ..llm.openai_provider import OpenAIProvider
from ..config import settings

router = APIRouter()


class GenerateRequest(BaseModel):
    prompt: str
    stream: bool = False
    system_message: str | None = None


@router.post("/test/generate")
async def test_generate(request: GenerateRequest):
    """Test endpoint for non-streaming LLM generation"""
    try:
        provider = OpenAIProvider(
            api_key=settings.get_active_api_key() or "",
            model=settings.llm_model,
        )

        if request.system_message:
            provider.set_system_message(request.system_message)

        response = await provider.generate(request.prompt, stream=False)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test/generate/stream")
async def test_generate_stream(request: GenerateRequest):
    """Test endpoint for streaming LLM generation"""
    try:
        provider = OpenAIProvider(
            api_key=settings.get_active_api_key() or "",
            model=settings.llm_model,
        )

        if request.system_message:
            provider.set_system_message(request.system_message)

        async def generate():
            async for chunk in await provider.generate(request.prompt, stream=True):
                yield f"data: {chunk}\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/test/validate-key")
async def test_validate_key():
    """Test endpoint for validating the current API key"""
    try:
        provider = OpenAIProvider(
            api_key=settings.get_active_api_key() or "",
            model=settings.llm_model,
        )
        is_valid = await provider.validate_api_key()
        return {"valid": is_valid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
