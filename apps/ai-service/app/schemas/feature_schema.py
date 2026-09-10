from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from app.schemas.requirement_schema import PriorityLevel, TaxonomyCategory

FeatureCategory = Literal['CORE', 'SECONDARY', 'FUTURE', 'INNOVATIVE']
ComplexityLevel = Literal['EASY', 'MEDIUM', 'HARD', 'COMPLEX']

class FeatureItem(BaseModel):
    id: Optional[str] = None
    feature_code: str = Field(..., description="Unique feature code, e.g., 'FEAT-001'")
    name: str = Field(..., description="Feature name")
    description: str = Field(..., description="Detailed description of what the feature accomplishes")
    category: FeatureCategory = Field(default='CORE')
    complexity: ComplexityLevel = Field(default='MEDIUM')
    priority: PriorityLevel = Field(default='HIGH')
    confidence: float = Field(default=0.90, ge=0.0, le=1.0)
    taxonomy: TaxonomyCategory = Field(default='RECOMMENDATION')
    related_requirements: List[str] = Field(default_factory=list, description="Requirement codes (e.g. FR-001) tied to this feature")

class FeaturePredictionResult(BaseModel):
    features: List[FeatureItem] = Field(default_factory=list)
    confidence: float = Field(default=0.90, ge=0.0, le=1.0)
