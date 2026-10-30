from pydantic import BaseModel, Field
from typing import List, Optional

class SprintTaskDto(BaseModel):
    title: str = Field(..., description="Actionable engineering task title")
    description: str = Field(..., description="Task implementation details & acceptance criteria")
    status: str = Field(default="TODO", description="TODO, IN_PROGRESS, BLOCKED, DONE")
    priority: str = Field(default="MEDIUM", description="CRITICAL, HIGH, MEDIUM, LOW")
    story_points: int = Field(default=3, description="Fibonacci estimate: 1, 2, 3, 5, 8")

class SprintDto(BaseModel):
    name: str = Field(..., description="Sprint Name, e.g., Sprint 1: Foundation & Ingestion")
    sprint_number: int = Field(default=1, description="Sequential sprint index")
    goal: str = Field(..., description="Sprint business goal")
    start_date: Optional[str] = Field(None, description="ISO date string")
    end_date: Optional[str] = Field(None, description="ISO date string")
    tasks: List[SprintTaskDto] = Field(default_factory=list, description="Sprint tasks")

class SprintPlanResult(BaseModel):
    sprints: List[SprintDto] = Field(default_factory=list, description="Sprint schedule")
    total_story_points: int = Field(default=0, description="Cumulative story points across all sprints")
    estimated_weeks: int = Field(default=6, description="Estimated calendar weeks for completion")

