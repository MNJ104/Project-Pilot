from pydantic import BaseModel, Field
from typing import Optional

class DocumentationResult(BaseModel):
    project_title: str
    srs_markdown: str = Field(..., description="Complete IEEE 830 compliant SRS Markdown document")
    executive_summary: str = Field(..., description="High-level architecture brief")
    tech_stack_summary: str = Field(..., description="Executive technology summary")

