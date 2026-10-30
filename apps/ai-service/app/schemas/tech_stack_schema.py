from pydantic import BaseModel, Field
from typing import List, Optional

class TechStackItemDto(BaseModel):
    category: str = Field(..., description="FRONTEND, BACKEND, DATABASE, DEVOPS, AI_MODELS")
    technology_name: str = Field(..., description="e.g., React 18, Spring Boot 3.2, PostgreSQL 16")
    justification: str = Field(..., description="Architectural reasoning for choosing this technology")

class WireframeItemDto(BaseModel):
    page_name: str = Field(..., description="Dashboard, Ingestion Wizard, Sprints Kanban")
    layout_description: str = Field(..., description="Structural layout description")
    components_list: List[str] = Field(default_factory=list, description="Key UI components on this page")

class TechStackResult(BaseModel):
    recommendations: List[TechStackItemDto] = Field(default_factory=list, description="Categorized technology choices")
    wireframes: List[WireframeItemDto] = Field(default_factory=list, description="UI screen wireframe blueprints")
    summary: str = Field(..., description="High-level tech stack rationale")

