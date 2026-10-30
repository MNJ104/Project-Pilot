from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.api_generator import generate_api_design
from app.schemas.api_schema import ApiDesignResult

router = APIRouter(prefix="/ai/v1/api-design", tags=["API Design"])

class GenerateApiRequest(BaseModel):
    project_title: str
    project_description: str
    requirements_context: Optional[str] = ""

@router.get("/health")
async def api_design_health():
    return {"status": "UP", "service": "api-generator"}

@router.post("/generate", response_model=ApiDesignResult)
async def generate_api_endpoint(request: GenerateApiRequest):
    try:
        return generate_api_design(
            project_title=request.project_title,
            project_description=request.project_description,
            requirements_context=request.requirements_context or ""
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API design generation failed: {str(e)}")

