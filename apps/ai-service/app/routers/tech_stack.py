from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.tech_stack_recommender import generate_tech_stack
from app.schemas.tech_stack_schema import TechStackResult

router = APIRouter(prefix="/ai/v1/tech-stack", tags=["Tech Stack"])

class GenerateTechStackRequest(BaseModel):
    project_title: str
    project_description: str
    requirements_context: Optional[str] = ""

@router.get("/health")
async def tech_stack_health():
    return {"status": "UP", "service": "tech-stack-recommender"}

@router.post("/generate", response_model=TechStackResult)
async def generate_tech_stack_endpoint(request: GenerateTechStackRequest):
    try:
        return generate_tech_stack(
            project_title=request.project_title,
            project_description=request.project_description,
            requirements_context=request.requirements_context or ""
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tech stack generation failed: {str(e)}")

