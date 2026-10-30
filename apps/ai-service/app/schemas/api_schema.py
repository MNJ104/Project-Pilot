from pydantic import BaseModel, Field
from typing import List, Optional

class ApiEndpointDto(BaseModel):
    endpoint_path: str = Field(..., description="URI route path, e.g., /api/v1/projects/{id}")
    http_method: str = Field(..., description="GET, POST, PUT, DELETE, PATCH")
    summary: str = Field(..., description="Brief endpoint description")
    request_schema: Optional[str] = Field(None, description="JSON Schema or description of request body")
    response_schema: Optional[str] = Field(None, description="JSON Schema or description of 200 response")
    auth_required: bool = Field(default=True, description="Whether authentication is required")

class ApiDesignResult(BaseModel):
    title: str = Field(..., description="API Specification Title")
    version: str = Field(default="1.0.0", description="Semantic API version")
    base_path: str = Field(default="/api/v1", description="Common base URL path")
    endpoints: List[ApiEndpointDto] = Field(default_factory=list, description="List of generated REST endpoints")
    openapi_spec_json: Optional[str] = Field(None, description="Complete OpenAPI 3.0 JSON specification string")

