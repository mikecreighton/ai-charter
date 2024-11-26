from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict
from enum import Enum
from ..llm.base import get_llm_client
from ..llm.prompts.initial_analysis import (
    INITIAL_ANALYSIS_SYSTEM_PROMPT,
    INITIAL_ANALYSIS_USER_PROMPT,
)
from ..llm.prompts.project_overview import (
    PROJECT_OVERVIEW_SYSTEM_PROMPT,
    PROJECT_OVERVIEW_USER_PROMPT,
    PROJECT_OVERVIEW_USER_PROMPT_WITH_FOLLOW_UP,
)
import json
from ..config import settings
from ..llm.openai_provider import OpenAIProvider
from ..llm.anthropic_provider import AnthropicProvider
from ..config import LLMProvider
from fastapi.responses import StreamingResponse
import uuid

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


class DocumentType(str, Enum):
    OVERVIEW = "overview"
    PRD = "prd"
    TECH_STACK = "techStack"
    CODE_RULES = "codeRules"
    DEVELOPMENT_PLAN = "developmentPlan"


class BaseDocumentRequest(BaseModel):
    type: DocumentType


class OverviewRequest(BaseDocumentRequest):
    projectName: str
    description: str
    analysis: Optional[str] = None
    followUpQuestions: Optional[List[FollowUpQuestion]] = None
    followUpResponses: Optional[Dict[str, str]] = None


class PrdRequest(BaseDocumentRequest):
    overview: str


class TechStackRequest(BaseDocumentRequest):
    overview: str
    prd: str


class CodeRulesRequest(BaseDocumentRequest):
    techStack: str


class DevelopmentPlanRequest(BaseDocumentRequest):
    overview: str
    prd: str
    techStack: str
    codeRules: str


GenerateDocumentRequest = (
    OverviewRequest
    | PrdRequest
    | TechStackRequest
    | CodeRulesRequest
    | DevelopmentPlanRequest
)


class GenerateDocumentResponse(BaseModel):
    success: bool
    content: Optional[str] = None
    error: Optional[str] = None


class GenerateOverviewRequest(BaseModel):
    projectName: str
    description: str
    analysis: str
    followUpQuestions: Optional[List[FollowUpQuestion]] = None
    followUpResponses: Optional[dict[str, str]] = None


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
    """
    Test endpoint for non-streaming LLM generation
    """
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
    """
    Test endpoint for streaming LLM generation
    """
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
    """
    Test endpoint for validating the current API key
    """
    try:
        provider = get_provider()
        is_valid = await provider.validate_api_key()
        return {"valid": is_valid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/process-initial", response_model=ProcessInitialResponse)
async def process_initial_input(project: ProjectInput) -> ProcessInitialResponse:
    """
    Process the initial input for a project and return the analysis and follow-up questions (if the LLM deems them necessary).
    """
    try:
        provider = get_provider()
        provider.set_system_message(INITIAL_ANALYSIS_SYSTEM_PROMPT)

        prompt = INITIAL_ANALYSIS_USER_PROMPT.format(
            project_name=project.projectName, description=project.description
        )

        response = await provider.generate(prompt, stream=False)

        try:
            result = json.loads(response)

            if result.get("needsFollowUp") and result.get("followUpQuestions"):
                for question in result["followUpQuestions"]:
                    if "id" not in question:
                        question["id"] = f"q_{uuid.uuid4().hex[:8]}"

            return ProcessInitialResponse(**result)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse LLM response")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate", response_model=GenerateDocumentResponse)
async def generate_document(request: GenerateDocumentRequest):
    """
    Generate a document based on the provided request.
    """
    try:
        provider = get_provider()

        if isinstance(request, OverviewRequest):
            # Set the system prompt for overview generation
            provider.set_system_message(PROJECT_OVERVIEW_SYSTEM_PROMPT)

            # Format the base prompt with the required fields
            prompt = PROJECT_OVERVIEW_USER_PROMPT.format(
                project_name=request.projectName,
                description=request.description,
                analysis=request.analysis or "",
            )

            # Add follow-up responses if they exist
            if request.followUpQuestions and request.followUpResponses:
                prompt += PROJECT_OVERVIEW_USER_PROMPT_WITH_FOLLOW_UP.format(
                    follow_up_questions_and_responses=format_followup_responses(
                        request.followUpQuestions, request.followUpResponses
                    ),
                )

            # Generate the content
            content = await provider.generate(prompt, stream=False)
            print("-- HIGH-LEVEL OVERVIEW CONTENT ------------------------- ")
            print(content + "\n")
            return {"success": True, "content": content}

        # TODO: Implement other document types (PRD, TechStack, etc.)
        elif isinstance(request, PrdRequest):
            return {"success": True, "content": "PRD content"}

        elif isinstance(request, TechStackRequest):
            return {"success": True, "content": "Tech Stack content"}

        elif isinstance(request, CodeRulesRequest):
            return {"success": True, "content": "Code Rules content"}

        elif isinstance(request, DevelopmentPlanRequest):
            return {"success": True, "content": "Development Plan content"}

    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/generate-overview")
async def generate_overview(request: GenerateOverviewRequest):
    """
    Generate project overview with or without follow-up responses
    """
    try:
        provider = get_provider()
        provider.set_system_message(PROJECT_OVERVIEW_SYSTEM_PROMPT)
        # Use a prompt for direct overview generation

        prompt = PROJECT_OVERVIEW_USER_PROMPT.format(
            project_name=request.projectName,
            description=request.description,
            analysis=request.analysis,
        )

        if request.followUpQuestions and request.followUpResponses:
            # Use a prompt that incorporates follow-up responses
            prompt += PROJECT_OVERVIEW_USER_PROMPT_WITH_FOLLOW_UP.format(
                follow_up_questions_and_responses=format_followup_responses(
                    request.followUpQuestions, request.followUpResponses
                ),
            )

        response = await provider.generate(prompt, stream=False)
        return {"overview": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def format_followup_responses(
    questions: List[FollowUpQuestion], responses: dict[str, str]
) -> str:
    formatted = []
    for q in questions:
        response = responses.get(q.id, "No response provided")
        formatted.append(f"Your question: {q.question}\nUser response: {response}")
    return "\n\n".join(formatted)
