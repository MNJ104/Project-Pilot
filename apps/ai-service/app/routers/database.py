from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.database_designer import generate_database_design
from app.schemas.database_schema import DatabaseDesignResult

router = APIRouter(prefix="/ai/v1/database", tags=["Database Design"])

class GenerateDatabaseRequest(BaseModel):
    project_title: str
    project_description: str
    requirements_context: Optional[str] = ""

@router.get("/health")
async def database_health():
    return {"status": "UP", "service": "database-designer"}

@router.post("/generate", response_model=DatabaseDesignResult)
async def generate_database_endpoint(request: GenerateDatabaseRequest):
    try:
        return generate_database_design(
            project_title=request.project_title,
            project_description=request.project_description,
            requirements_context=request.requirements_context or ""
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database design generation failed: {str(e)}")

