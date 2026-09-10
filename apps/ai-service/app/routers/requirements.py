"""
Requirements Router — Phase 4
POST /ai/v1/requirements/generate  →  RequirementAnalysisResult
GET  /ai/v1/requirements/health    →  router health (no Gemini)
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.schemas.requirement_schema import RequirementAnalysisResult
from app.services.requirement_analyzer import analyze_requirements

router = APIRouter(prefix="/ai/v1/requirements", tags=["Requirements"])
logger = logging.getLogger(__name__)


class GenerateRequirementsRequest(BaseModel):
    project_title: str = Field(..., min_length=1, description="Project title")
    project_description: str = Field(..., min_length=10, description="Project description")
    sources_text: str = Field(default="", description="Concatenated extracted source text")


@router.get("/health")
async def requirements_router_health():
    """Fast router health check — does NOT call Gemini."""
    return {"status": "UP", "router": "requirements"}


@router.post("/generate", response_model=RequirementAnalysisResult)
async def generate_requirements(request: GenerateRequirementsRequest):
    """
    Analyze a software project and generate structured requirements.
    Calls Gemini API — only invoked on explicit user request.
    """
    logger.info(
        f"Generating requirements for project: '{request.project_title}' "
        f"(sources_text length: {len(request.sources_text)} chars)"
    )
    try:
        result = analyze_requirements(
            project_title=request.project_title,
            project_description=request.project_description,
            sources_text=request.sources_text,
        )
        return result
    except RuntimeError as e:
        logger.error(f"RequirementAnalyzer RuntimeError: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except ValueError as e:
        logger.error(f"RequirementAnalyzer ValueError: {e}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"RequirementAnalyzer unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Requirement analysis failed unexpectedly.")
