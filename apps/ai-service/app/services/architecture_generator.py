import json
import re
import logging
from typing import Optional

import google.generativeai as genai
from app.config import settings
from app.schemas.architecture_schema import ArchitectureResult, ArchitectureComponentDto

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_ARCHITECTURE = """You are a Senior Principal Enterprise Software Architect.
Analyze the software project description and requirements to produce a comprehensive System Architecture blueprint.
Your output must be strict JSON matching this schema:
{
  "style": "string (e.g. Clean Modular Monorepo, Microservices, Event-Driven Architecture)",
  "summary": "detailed architectural narrative and rationale",
  "mermaid_diagram": "valid mermaid flowchart string starting with graph TD",
  "deployment_strategy": "containerized cloud deployment plan",
  "components": [
    {
      "name": "Component Name",
      "tech_stack": "Technology/Framework",
      "responsibility": "Core functional responsibility",
      "communication_protocol": "REST/HTTPS, gRPC, WebSocket, or JDBC"
    }
  ]
}
IMPORTANT for mermaid_diagram: Must be syntactically valid Mermaid.js graph TD flowchart. Do not include markdown codeblocks inside the json field."""

def _extract_json(text: str) -> str:
    match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    match = re.search(r"(\{.*\})", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()

def _generate_fallback_architecture(title: str, description: str) -> ArchitectureResult:
    """Intelligent deterministic architectural synthesis fallback."""
    is_microservice = any(k in description.lower() for k in ["microservice", "distributed", "kubernetes", "scale"])
    style = "Distributed Microservices Architecture" if is_microservice else "Modular Monorepo & Decoupled Service Architecture"

    mermaid = f"""graph TD
    Client["Web Client & Extensions<br/>(React 18 / Tailwind)"] -->|HTTPS / JWT| Gateway["API Gateway / Spring Security"]
    Gateway -->|REST / JSON| CoreBackend["Core Enterprise Backend<br/>(Spring Boot 3.2 + JPA)"]
    Gateway -->|Internal RPC / REST| AIService["AI Analyzer Microservice<br/>(FastAPI + Python)"]
    CoreBackend -->|JDBC Connection Pool| DB[("Primary Relational Database<br/>(PostgreSQL 16)")]
    AIService -->|Cloud HTTPS| GenAI["Generative AI LLM Endpoints<br/>(Google Gemini)"]
    CoreBackend -->|Async Events / Cache| Cache[("In-Memory State / Cache")]
    """

    components = [
        ArchitectureComponentDto(
            name="Presentation Client Layer",
            tech_stack="React 18 + Vite + Tailwind CSS + Lucide Icons",
            responsibility="Responsive SaaS workspace rendering, real-time diagram visualizers, and state management",
            communication_protocol="HTTPS / REST"
        ),
        ArchitectureComponentDto(
            name="API Security & Business Core",
            tech_stack="Spring Boot 3.2 + Spring Security 6 + Flyway",
            responsibility="Stateless JWT authentication, RBAC authorization, transactional data persistence, and orchestration",
            communication_protocol="HTTPS / REST & JDBC"
        ),
        ArchitectureComponentDto(
            name="Generative AI Microservice",
            tech_stack="FastAPI + Python 3.13 + Pydantic v2",
            responsibility="Domain requirement analysis, schema self-repair retry loops, and AI inference synthesis",
            communication_protocol="HTTP / REST & Cloud TLS"
        ),
        ArchitectureComponentDto(
            name="Relational Persistence Tier",
            tech_stack="PostgreSQL 16 + HikariCP",
            responsibility="ACID-compliant relational storage for projects, sources, architectures, sprints, and user roles",
            communication_protocol="JDBC Protocol (Port 5432)"
        )
    ]

    summary = (
        f"The architecture for '{title}' follows a {style.lower()} designed for high reliability, "
        "modularity, and strict security isolation. Business logic and identity management are enforced "
        "through an enterprise Spring Boot gateway, while specialized generative AI parsing is delegated "
        "to an asynchronous Python microservice backed by PostgreSQL 16."
    )

    deployment = "Docker Multi-Stage containerization with automated health checks, deployable to AWS ECS / Cloud Run."

    return ArchitectureResult(
        style=style,
        summary=summary,
        mermaid_diagram=mermaid.strip(),
        deployment_strategy=deployment,
        components=components
    )

def generate_architecture(project_title: str, project_description: str, requirements_context: str = "") -> ArchitectureResult:
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 5 and not settings.GEMINI_API_KEY.startswith("your_"):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_PROMPT_ARCHITECTURE)
            prompt = f"Project: {project_title}\nDescription: {project_description}\nContext: {requirements_context}"
            response = model.generate_content(prompt)
            data = json.loads(_extract_json(response.text))
            return ArchitectureResult.model_validate(data)
        except Exception as e:
            logger.warning(f"ArchitectureGenerator: Gemini call failed ({e}). Using deterministic fallback.")
    
    return _generate_fallback_architecture(project_title, project_description)

