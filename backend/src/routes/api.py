from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class GenerateRequest(BaseModel):
    prompt: str
    doc_type: str


@router.post("/generate")
async def generate_document(request: GenerateRequest):
    try:
        # Will implement actual generation logic later
        return {"status": "success", "message": "Document generation endpoint"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
