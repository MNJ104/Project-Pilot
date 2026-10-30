import json
import re
import logging

import google.generativeai as genai
from app.config import settings
from app.schemas.api_schema import ApiDesignResult, ApiEndpointDto

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_API = """You are a Senior API Architect specializing in RESTful API design.
Analyze the project requirements and generate a complete REST API specification.
Output strict JSON matching this schema:
{
  "title": "Project API",
  "version": "1.0.0",
  "base_path": "/api/v1",
  "endpoints": [
    {
      "endpoint_path": "/resource/{id}",
      "http_method": "GET",
      "summary": "Short description",
      "request_schema": "JSON schema string or null",
      "response_schema": "JSON schema string",
      "auth_required": true
    }
  ],
  "openapi_spec_json": "complete OpenAPI 3.0 JSON string"
}
Include auth, CRUD for main resources, and AI generation endpoints.
"""

def _extract_json(text: str) -> str:
    match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    match = re.search(r"(\{.*\})", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()


def _generate_fallback_api(title: str, description: str) -> ApiDesignResult:
    """Deterministic REST API design fallback."""
    endpoints = [
        ApiEndpointDto(endpoint_path="/auth/register", http_method="POST",
                       summary="Register new user account", auth_required=False),
        ApiEndpointDto(endpoint_path="/auth/login", http_method="POST",
                       summary="Authenticate and obtain JWT token", auth_required=False),
        ApiEndpointDto(endpoint_path="/auth/refresh", http_method="POST",
                       summary="Refresh JWT access token", auth_required=False),
        ApiEndpointDto(endpoint_path="/projects", http_method="GET",
                       summary="List all projects for authenticated user", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects", http_method="POST",
                       summary="Create a new software planning project", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}", http_method="GET",
                       summary="Get project details by ID", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}", http_method="PUT",
                       summary="Update project metadata", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}", http_method="DELETE",
                       summary="Delete project and all artifacts", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/sources", http_method="POST",
                       summary="Add GitHub URL or text as project source", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/sources", http_method="GET",
                       summary="List all project sources", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/generate/requirements", http_method="POST",
                       summary="AI-generate structured FURPS+ requirements", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/generate/features", http_method="POST",
                       summary="AI-generate feature predictions", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/generate/architecture", http_method="POST",
                       summary="AI-generate system architecture with Mermaid diagram", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/generate/database", http_method="POST",
                       summary="AI-generate ER diagram and PostgreSQL DDL", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/generate/api-design", http_method="POST",
                       summary="AI-generate REST API specification", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/generate/tech-stack", http_method="POST",
                       summary="AI-generate technology recommendations", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/generate/sprints", http_method="POST",
                       summary="AI-generate agile sprint plan with story points", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/generate/cost-risk", http_method="POST",
                       summary="AI-generate cost estimates and risk analysis", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/generate/all", http_method="POST",
                       summary="Generate complete AI blueprint for all artifacts", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/artifacts", http_method="GET",
                       summary="Retrieve all stored AI-generated artifacts", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/chat", http_method="POST",
                       summary="AI contextual chat assistant for the project", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/export/markdown", http_method="GET",
                       summary="Export complete blueprint as Markdown document", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/export/sql", http_method="GET",
                       summary="Export database schema as SQL migration file", auth_required=True),
        ApiEndpointDto(endpoint_path="/projects/{id}/export/openapi", http_method="GET",
                       summary="Export API spec as OpenAPI 3.0 JSON", auth_required=True),
        ApiEndpointDto(endpoint_path="/health", http_method="GET",
                       summary="Service health check", auth_required=False),
    ]

    openapi_spec = {
        "openapi": "3.0.3",
        "info": {"title": f"{title} REST API", "description": description, "version": "1.0.0"},
        "servers": [{"url": "/api/v1", "description": "API Base"}],
        "components": {
            "securitySchemes": {
                "bearerAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}
            }
        },
        "paths": {
            ep.endpoint_path: {
                ep.http_method.lower(): {
                    "summary": ep.summary,
                    "security": [{"bearerAuth": []}] if ep.auth_required else [],
                    "responses": {"200": {"description": "Success"}, "401": {"description": "Unauthorized"}}
                }
            }
            for ep in endpoints
        }
    }

    return ApiDesignResult(
        title=f"{title} REST API",
        version="1.0.0",
        base_path="/api/v1",
        endpoints=endpoints,
        openapi_spec_json=json.dumps(openapi_spec, indent=2)
    )


def generate_api_design(project_title: str, project_description: str, requirements_context: str = "") -> ApiDesignResult:
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 5 and not settings.GEMINI_API_KEY.startswith("your_"):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_PROMPT_API)
            prompt = f"Project: {project_title}\nDescription: {project_description}\nContext: {requirements_context}"
            response = model.generate_content(prompt)
            data = json.loads(_extract_json(response.text))
            return ApiDesignResult.model_validate(data)
        except Exception as e:
            logger.warning(f"ApiGenerator: Gemini call failed ({e}). Using deterministic fallback.")

    return _generate_fallback_api(project_title, project_description)
