from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.sprint_planner import generate_sprint_plan
from app.schemas.sprint_schema import SprintPlanResult

router = APIRouter(prefix="/ai/v1/sprints", tags=["Sprint Planning"])

class GenerateSprintsRequest(BaseModel):
    project_title: str
    project_description: str
    requirements_context: Optional[str] = ""

@router.get("/health")
async def sprints_health():
    return {"status": "UP", "service": "sprint-planner"}

@router.post("/generate", response_model=SprintPlanResult)
async def generate_sprints_endpoint(request: GenerateSprintsRequest):
    try:
        return generate_sprint_plan(
            project_title=request.project_title,
            project_description=request.project_description,
            requirements_context=request.requirements_context or ""
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sprint plan generation failed: {str(e)}")

