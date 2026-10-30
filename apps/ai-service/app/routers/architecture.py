from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.architecture_generator import generate_architecture
from app.schemas.architecture_schema import ArchitectureResult

router = APIRouter(prefix="/ai/v1/architecture", tags=["Architecture"])

class GenerateArchitectureRequest(BaseModel):
    project_title: str
    project_description: str
    requirements_context: Optional[str] = ""

@router.get("/health")
async def architecture_health():
    return {"status": "UP", "service": "architecture-generator"}

@router.post("/generate", response_model=ArchitectureResult)
async def generate_architecture_endpoint(request: GenerateArchitectureRequest):
    try:
        return generate_architecture(
            project_title=request.project_title,
            project_description=request.project_description,
            requirements_context=request.requirements_context or ""
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Architecture generation failed: {str(e)}")

