from pydantic import BaseModel, Field
from typing import List, Optional

class ArchitectureComponentDto(BaseModel):
    name: str = Field(..., description="Component name, e.g., Web Gateway, Auth Service")
    tech_stack: str = Field(..., description="Framework or language, e.g., Spring Boot 3, React 18")
    responsibility: str = Field(..., description="Primary functional responsibility")
    communication_protocol: str = Field(..., description="e.g., REST/HTTPS, gRPC, WebSocket")

class ArchitectureResult(BaseModel):
    style: str = Field(..., description="Architectural style, e.g., Modular Monorepo, Microservices")
    summary: str = Field(..., description="High-level architectural narrative")
    mermaid_diagram: str = Field(..., description="Valid Mermaid.js flowchart string starting with graph TD")
    deployment_strategy: Optional[str] = Field(None, description="Cloud or container deployment topology")
    components: List[ArchitectureComponentDto] = Field(default_factory=list, description="List of architecture components")

