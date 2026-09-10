"""
Features Router — Phase 4
POST /ai/v1/features/generate  →  FeaturePredictionResult
GET  /ai/v1/features/health    →  router health (no Gemini)
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.schemas.feature_schema import FeaturePredictionResult
from app.services.feature_predictor import predict_features

router = APIRouter(prefix="/ai/v1/features", tags=["Features"])
logger = logging.getLogger(__name__)


class GenerateFeaturesRequest(BaseModel):
    project_title: str = Field(..., min_length=1, description="Project title")
    project_description: str = Field(..., min_length=10, description="Project description")
    requirements_text: str = Field(
        default="",
        description="Serialized requirement list (JSON or plain text) for feature derivation"
    )


@router.get("/health")
async def features_router_health():
    """Fast router health check — does NOT call Gemini."""
    return {"status": "UP", "router": "features"}


@router.post("/generate", response_model=FeaturePredictionResult)
async def generate_features(request: GenerateFeaturesRequest):
    """
    Derive a structured feature catalog from project description + requirements context.
    Calls Gemini API — only invoked on explicit user request.
    """
    logger.info(
        f"Generating features for project: '{request.project_title}' "
        f"(requirements_text length: {len(request.requirements_text)} chars)"
    )
    try:
        result = predict_features(
            project_title=request.project_title,
            project_description=request.project_description,
            requirements_text=request.requirements_text,
        )
        return result
    except RuntimeError as e:
        logger.error(f"FeaturePredictor RuntimeError: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except ValueError as e:
        logger.error(f"FeaturePredictor ValueError: {e}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"FeaturePredictor unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Feature prediction failed unexpectedly.")
