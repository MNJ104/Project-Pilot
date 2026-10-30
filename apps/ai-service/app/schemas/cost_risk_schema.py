from pydantic import BaseModel, Field
from typing import List, Optional

class CostEstimateResult(BaseModel):
    total_monthly_usd: float = Field(..., description="Estimated total monthly cloud expense in USD")
    compute_usd: float = Field(default=0.0, description="Compute resources (VMs, Containers)")
    database_usd: float = Field(default=0.0, description="Managed DB services (RDS, Aurora)")
    storage_usd: float = Field(default=0.0, description="Object & block storage (S3, EBS)")
    ai_inference_usd: float = Field(default=0.0, description="Token inference expenses")
    breakdown_notes: str = Field(..., description="Cost optimization recommendations and assumptions")

class RiskItemDto(BaseModel):
    category: str = Field(..., description="TECHNICAL, OPERATIONAL, SECURITY, BUSINESS")
    description: str = Field(..., description="Identified failure mode or vulnerability")
    probability: int = Field(..., ge=1, le=10, description="1 to 10 likelihood")
    impact: int = Field(..., ge=1, le=10, description="1 to 10 impact")
    severity_score: int = Field(..., description="probability * impact (1 to 100)")
    mitigation_strategy: str = Field(..., description="Proactive engineering mitigation")

class RiskPredictionResult(BaseModel):
    risks: List[RiskItemDto] = Field(default_factory=list, description="Categorized risks")
    overall_risk_level: str = Field(default="MODERATE", description="LOW, MODERATE, HIGH, CRITICAL")

