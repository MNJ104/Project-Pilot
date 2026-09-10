from pydantic import BaseModel, Field
from typing import List, Optional, Literal

RequirementType = Literal['FUNCTIONAL', 'NON_FUNCTIONAL', 'CONSTRAINT', 'DEPENDENCY', 'BUSINESS_RULE']
PriorityLevel = Literal['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
TaxonomyCategory = Literal['FACT', 'INFERENCE', 'RECOMMENDATION', 'ASSUMPTION', 'UNKNOWN']

class UserStory(BaseModel):
    as_a: str = Field(..., description="Role of the user, e.g., 'Project Manager'")
    i_want_to: str = Field(..., description="Desired capability or feature")
    so_that: str = Field(..., description="Business value or rationale")

class RequirementItem(BaseModel):
    id: Optional[str] = None
    req_code: str = Field(..., description="Unique requirement code, e.g., 'FR-001' or 'NFR-002'")
    title: str = Field(..., description="Concise requirement title")
    description: str = Field(..., description="Detailed description of the requirement")
    type: RequirementType = Field(default='FUNCTIONAL')
    priority: PriorityLevel = Field(default='HIGH')
    confidence: float = Field(default=0.90, ge=0.0, le=1.0)
    taxonomy: TaxonomyCategory = Field(default='INFERENCE')
    user_story: Optional[UserStory] = None
    acceptance_criteria: List[str] = Field(default_factory=list, description="List of acceptance criteria statements")
    dependencies: List[str] = Field(default_factory=list, description="IDs/codes of prerequisite requirements")
    source_reference: Optional[str] = Field(default=None, description="Title or URL of source document referenced")

class RequirementAnalysisResult(BaseModel):
    project_summary: str = Field(..., description="High-level technical synthesis of the project")
    domain_identification: str = Field(..., description="Identified primary domain, e.g., 'Fintech', 'SaaS'")
    requirements: List[RequirementItem] = Field(default_factory=list)
    research_gaps: List[str] = Field(default_factory=list, description="Unclear or missing requirements explicitly marked as UNKNOWN")
    confidence: float = Field(default=0.90, ge=0.0, le=1.0)
