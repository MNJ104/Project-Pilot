from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.documentation_generator import generate_documentation
from app.schemas.documentation_schema import DocumentationResult

router = APIRouter(prefix="/ai/v1/documentation", tags=["Documentation"])

class GenerateDocumentationRequest(BaseModel):
    project_title: str
    project_description: str
    requirements_context: Optional[str] = ""

@router.get("/health")
async def documentation_health():
    return {"status": "UP", "service": "documentation-generator"}

@router.post("/generate", response_model=DocumentationResult)
async def generate_documentation_endpoint(request: GenerateDocumentationRequest):
    try:
        return generate_documentation(
            project_title=request.project_title,
            project_description=request.project_description,
            requirements_context=request.requirements_context or ""
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Documentation generation failed: {str(e)}")

