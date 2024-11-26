from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from ..llm.base import get_llm_client
from ..llm.prompts.initial_analysis import (
    INITIAL_ANALYSIS_SYSTEM_PROMPT,
    INITIAL_ANALYSIS_USER_PROMPT,
)
import json
from ..config import settings
from ..llm.openai_provider import OpenAIProvider
from ..llm.anthropic_provider import AnthropicProvider
from ..config import LLMProvider
from fastapi.responses import StreamingResponse

# Create the router
router = APIRouter()


class GenerateRequest(BaseModel):
    prompt: str
    stream: bool = False
    system_message: str | None = None


class FollowUpQuestion(BaseModel):
    id: str
    question: str
    suggestedAnswer: Optional[str] = None


class ProcessInitialResponse(BaseModel):
    needsFollowUp: bool
    followUpQuestions: Optional[List[FollowUpQuestion]] = None
    analysis: Optional[str] = None


class ProjectInput(BaseModel):
    projectName: str
    description: str


def get_provider():
    api_key = settings.get_active_api_key()
    if not api_key:
        raise HTTPException(status_code=500, detail="No API key configured")

    if settings.llm_provider == LLMProvider.ANTHROPIC:
        return AnthropicProvider(api_key=api_key, model=settings.llm_model)
    else:  # OPENAI, OPENROUTER, GEMINI
        return OpenAIProvider(
            api_key=api_key,
            model=settings.llm_model,
            base_url=settings.get_base_url(),
        )


@router.post("/test/generate")
async def test_generate(request: GenerateRequest):
    """Test endpoint for non-streaming LLM generation"""
    try:
        provider = get_provider()
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
        provider = get_provider()
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
        provider = get_provider()
        is_valid = await provider.validate_api_key()
        return {"valid": is_valid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/process-initial", response_model=ProcessInitialResponse)
async def process_initial_input(project: ProjectInput) -> ProcessInitialResponse:
    try:
        # Get LLM client
        provider = get_provider()
        provider.set_system_message(INITIAL_ANALYSIS_SYSTEM_PROMPT)

        # Format prompt with project details
        prompt = INITIAL_ANALYSIS_USER_PROMPT.format(
            project_name=project.projectName, description=project.description
        )

        # Get LLM response
        response = await provider.generate(prompt, stream=False)

        # Parse LLM response
        try:
            result = json.loads(response)
            return ProcessInitialResponse(**result)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse LLM response")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
