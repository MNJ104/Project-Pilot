import json
import re
import logging

import google.generativeai as genai
from app.config import settings
from app.schemas.tech_stack_schema import TechStackResult, TechStackItemDto, WireframeItemDto

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_TECH_STACK = """You are a Senior Technology Advisor and Principal Architect.
Analyze the software project and recommend a complete, justified technology stack with UI wireframe blueprints.
Output strict JSON matching this schema:
{
  "recommendations": [
    {
      "category": "FRONTEND|BACKEND|DATABASE|DEVOPS|AI_MODELS",
      "technology_name": "Technology Name + Version",
      "justification": "Detailed architectural justification"
    }
  ],
  "wireframes": [
    {
      "page_name": "Page Name",
      "layout_description": "Layout structure description",
      "components_list": ["Component1", "Component2"]
    }
  ],
  "summary": "Overall tech stack rationale paragraph"
}
"""

def _extract_json(text: str) -> str:
    match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    match = re.search(r"(\{.*\})", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()


def _generate_fallback_tech_stack(title: str, description: str) -> TechStackResult:
    """Deterministic tech stack recommendation fallback."""
    desc_lower = description.lower()
    is_ml = any(k in desc_lower for k in ["ml", "machine learning", "neural", "model", "train"])
    is_realtime = any(k in desc_lower for k in ["realtime", "real-time", "websocket", "live"])

    recommendations = [
        TechStackItemDto(category="FRONTEND", technology_name="React 18 + Vite 5 + TypeScript",
                         justification="Component-based SPA framework with fast HMR builds, TypeScript safety, and rich ecosystem for enterprise dashboards."),
        TechStackItemDto(category="FRONTEND", technology_name="Tailwind CSS 3 + shadcn/ui",
                         justification="Utility-first CSS with accessible, unstyled component primitives for rapid consistent UI development."),
        TechStackItemDto(category="FRONTEND", technology_name="Mermaid.js + Recharts",
                         justification="Client-side diagram rendering for architecture/ER diagrams and interactive data visualization charts."),
        TechStackItemDto(category="BACKEND", technology_name="Spring Boot 3.2 + Java 17",
                         justification="Production-grade enterprise framework with native virtual threads, Spring Security 6 JWT, Flyway migrations, and JPA/Hibernate ORM."),
        TechStackItemDto(category="BACKEND", technology_name="FastAPI 0.110 + Python 3.11+",
                         justification="High-performance async Python framework ideal for AI/ML microservice integration with automatic OpenAPI docs and Pydantic v2 validation."),
        TechStackItemDto(category="DATABASE", technology_name="PostgreSQL 16",
                         justification="ACID-compliant relational database with JSONB support, excellent full-text search, pgcrypto extension for UUIDs, and strong cloud managed offerings."),
        TechStackItemDto(category="DATABASE", technology_name="Redis 7 (Optional Cache)",
                         justification="In-memory cache layer for AI response caching, session storage, and rate limiting to reduce Gemini API costs."),
        TechStackItemDto(category="DEVOPS", technology_name="Docker + Docker Compose",
                         justification="Containerization for consistent dev/prod environments, multi-service orchestration, and simplified cloud deployment."),
        TechStackItemDto(category="DEVOPS", technology_name="GitHub Actions CI/CD",
                         justification="Automated build, test, and deploy pipelines with secrets management and environment-specific deployments."),
        TechStackItemDto(category="DEVOPS", technology_name="Railway / Render (Cloud Hosting)",
                         justification="Zero-config managed PaaS with automatic TLS, PostgreSQL add-ons, and GitHub integration for rapid deployment."),
        TechStackItemDto(category="AI_MODELS", technology_name="Google Gemini 1.5 Flash",
                         justification="Fast, cost-efficient multimodal LLM for structured JSON generation, code analysis, and architectural synthesis with 1M token context."),
    ]
    if is_ml:
        recommendations.append(TechStackItemDto(category="AI_MODELS", technology_name="Google Gemini 1.5 Pro",
                                                justification="Advanced reasoning model for complex ML pipeline design, code generation, and deep architectural analysis."))

    wireframes = [
        WireframeItemDto(
            page_name="Dashboard Home",
            layout_description="Two-column layout: left sidebar navigation (fixed 240px), right main content area with project cards grid and quick-action header.",
            components_list=["Sidebar Navigation", "Project Card Grid", "New Project FAB", "User Avatar Menu", "Status Badge", "Search Bar"]
        ),
        WireframeItemDto(
            page_name="Source Ingestion Wizard",
            layout_description="Centered wizard with 3-step progress indicator: (1) Add Source, (2) Analyze, (3) Review. Card-based form with GitHub URL or text input.",
            components_list=["Progress Stepper", "GitHub URL Input", "Text Area", "Analyze Button", "Loading Spinner", "Source Summary Card"]
        ),
        WireframeItemDto(
            page_name="Architecture Viewer",
            layout_description="Full-width diagram canvas (top) with collapsible component details panel (bottom). Generate button in header with export options.",
            components_list=["Mermaid Diagram Canvas", "Generate Blueprint Button", "Component Detail Table", "Export Dropdown", "Loading Skeleton"]
        ),
        WireframeItemDto(
            page_name="Sprint Kanban Board",
            layout_description="Horizontal kanban with 4 swim-lane columns: TODO, IN_PROGRESS, BLOCKED, DONE. Task cards with story point badges and drag-handle.",
            components_list=["Sprint Selector Tabs", "Kanban Column", "Task Card", "Story Point Badge", "Priority Indicator", "Move Task Button"]
        ),
        WireframeItemDto(
            page_name="Cost & Risk Analysis",
            layout_description="Split view: cost breakdown bar chart (left 60%), risk severity heatmap table (right 40%). Summary cards in header row.",
            components_list=["Cost Summary Cards", "Bar Chart (Recharts)", "Risk Matrix Table", "Severity Badge", "Overall Risk Indicator", "Export Button"]
        ),
        WireframeItemDto(
            page_name="AI Chat Assistant",
            layout_description="Slide-over drawer (right 480px) with message thread, sticky input bar at bottom. Context-aware: shows current project name in header.",
            components_list=["Chat Message Thread", "Message Input Bar", "Send Button", "Loading Dots Animation", "Project Context Badge", "Clear Chat Button"]
        ),
    ]

    summary = (
        f"The technology stack for '{title}' is architected for enterprise reliability, developer velocity, and AI-first design. "
        "React 18 + TypeScript provides a type-safe frontend with interactive diagram visualization via Mermaid.js. "
        "Spring Boot 3.2 serves as the secure orchestration backbone with JWT auth and Flyway-managed PostgreSQL persistence. "
        "A dedicated FastAPI Python microservice handles all Gemini AI inference with deterministic fallback, "
        "isolating AI failure modes from core business logic. Docker + Railway enables zero-downtime cloud deployment."
    )

    return TechStackResult(recommendations=recommendations, wireframes=wireframes, summary=summary)


def generate_tech_stack(project_title: str, project_description: str, requirements_context: str = "") -> TechStackResult:
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 5 and not settings.GEMINI_API_KEY.startswith("your_"):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_PROMPT_TECH_STACK)
            prompt = f"Project: {project_title}\nDescription: {project_description}\nContext: {requirements_context}"
            response = model.generate_content(prompt)
            data = json.loads(_extract_json(response.text))
            return TechStackResult.model_validate(data)
        except Exception as e:
            logger.warning(f"TechStackRecommender: Gemini call failed ({e}). Using deterministic fallback.")

    return _generate_fallback_tech_stack(project_title, project_description)

