from pydantic import BaseModel, Field
from typing import Generic, TypeVar, Optional, List, Dict, Any
from datetime import datetime

T = TypeVar('T')

class AIGenerationEnvelope(BaseModel, Generic[T]):
    project_id: str = Field(..., alias="projectId")
    analysis_type: str = Field(..., alias="analysisType")
    result: T
    confidence: float = Field(default=0.90, ge=0.0, le=1.0)
    warnings: List[str] = Field(default_factory=list)
    sources: List[str] = Field(default_factory=list)
    generated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat(), alias="generatedAt")

    class Config:
        populate_by_name = True
