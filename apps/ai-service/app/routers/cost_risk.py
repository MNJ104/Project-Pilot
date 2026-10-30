from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.cost_risk_analyzer import generate_cost_estimate, generate_risk_prediction
from app.schemas.cost_risk_schema import CostEstimateResult, RiskPredictionResult

router = APIRouter(prefix="/ai/v1/cost-risk", tags=["Cost & Risk"])

class GenerateCostRiskRequest(BaseModel):
    project_title: str
    project_description: str
    requirements_context: Optional[str] = ""

@router.get("/health")
async def cost_risk_health():
    return {"status": "UP", "service": "cost-risk-analyzer"}

@router.post("/cost/generate", response_model=CostEstimateResult)
async def generate_cost_endpoint(request: GenerateCostRiskRequest):
    try:
        return generate_cost_estimate(
            project_title=request.project_title,
            project_description=request.project_description,
            requirements_context=request.requirements_context or ""
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cost estimation failed: {str(e)}")

@router.post("/risk/generate", response_model=RiskPredictionResult)
async def generate_risk_endpoint(request: GenerateCostRiskRequest):
    try:
        return generate_risk_prediction(
            project_title=request.project_title,
            project_description=request.project_description,
            requirements_context=request.requirements_context or ""
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk prediction failed: {str(e)}")

