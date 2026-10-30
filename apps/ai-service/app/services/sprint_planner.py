import json
import re
import logging
from datetime import date, timedelta

import google.generativeai as genai
from app.config import settings
from app.schemas.sprint_schema import SprintPlanResult, SprintDto, SprintTaskDto

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_SPRINT = """You are a Senior Agile Coach and Engineering Program Manager.
Generate a realistic 3-sprint agile development plan for the given software project.
Output strict JSON matching this schema:
{
  "sprints": [
    {
      "name": "Sprint 1: Foundation & Core Setup",
      "sprint_number": 1,
      "goal": "Sprint business goal statement",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "tasks": [
        {
          "title": "Task title",
          "description": "Implementation details and acceptance criteria",
          "status": "TODO",
          "priority": "HIGH",
          "story_points": 3
        }
      ]
    }
  ],
  "total_story_points": 55,
  "estimated_weeks": 6
}
Use Fibonacci story points: 1, 2, 3, 5, 8. Each sprint is 2 weeks with 4-6 tasks.
"""

def _extract_json(text: str) -> str:
    match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    match = re.search(r"(\{.*\})", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()


def _generate_fallback_sprint_plan(title: str, description: str) -> SprintPlanResult:
    """Deterministic agile sprint plan fallback."""
    today = date.today()

    sprint1_start = today
    sprint1_end = today + timedelta(weeks=2)
    sprint2_start = sprint1_end + timedelta(days=1)
    sprint2_end = sprint2_start + timedelta(weeks=2)
    sprint3_start = sprint2_end + timedelta(days=1)
    sprint3_end = sprint3_start + timedelta(weeks=2)

    sprint1 = SprintDto(
        name="Sprint 1: Foundation & Infrastructure",
        sprint_number=1,
        goal=f"Establish core project infrastructure, authentication, database schema, and CI/CD pipeline for {title}.",
        start_date=sprint1_start.isoformat(),
        end_date=sprint1_end.isoformat(),
        tasks=[
            SprintTaskDto(title="Project repository setup & CI/CD pipeline configuration",
                          description="Initialize monorepo, configure GitHub Actions for build/test/deploy, set up branch protection rules and PR templates.",
                          status="TODO", priority="CRITICAL", story_points=3),
            SprintTaskDto(title="Database schema design & Flyway migrations",
                          description="Design normalized relational schema, write V1/V2/V3 Flyway migration scripts, validate on PostgreSQL 16.",
                          status="TODO", priority="CRITICAL", story_points=5),
            SprintTaskDto(title="User authentication system (JWT + Spring Security 6)",
                          description="Implement register/login endpoints, JWT token generation/validation, refresh token rotation, and role-based access control.",
                          status="TODO", priority="CRITICAL", story_points=8),
            SprintTaskDto(title="Docker Compose development environment",
                          description="Create docker-compose.yml with services for backend, AI microservice, PostgreSQL, and frontend dev server with hot-reload.",
                          status="TODO", priority="HIGH", story_points=3),
            SprintTaskDto(title="FastAPI AI microservice scaffolding",
                          description="Set up FastAPI app with health endpoints, Pydantic v2 schemas, Gemini SDK integration, and modular router structure.",
                          status="TODO", priority="HIGH", story_points=5),
        ]
    )

    sprint2 = SprintDto(
        name="Sprint 2: Core Features & AI Integration",
        sprint_number=2,
        goal="Implement project management CRUD, source ingestion, and all AI generation endpoints with Gemini integration.",
        start_date=sprint2_start.isoformat(),
        end_date=sprint2_end.isoformat(),
        tasks=[
            SprintTaskDto(title="Project & source management APIs",
                          description="Build CRUD REST APIs for projects and sources, with proper validation, pagination, and ownership checks.",
                          status="TODO", priority="HIGH", story_points=5),
            SprintTaskDto(title="AI requirement & feature analysis endpoints",
                          description="Implement /generate/requirements and /generate/features endpoints calling Gemini with FURPS+ taxonomy and structured JSON output.",
                          status="TODO", priority="HIGH", story_points=8),
            SprintTaskDto(title="Architecture & database design generation",
                          description="Implement /generate/architecture (Mermaid flowchart) and /generate/database (ER diagram + PostgreSQL DDL) endpoints.",
                          status="TODO", priority="HIGH", story_points=8),
            SprintTaskDto(title="Sprint planning & cost-risk analysis endpoints",
                          description="Implement /generate/sprints with Fibonacci story points and /generate/cost-risk with per-service cost breakdown.",
                          status="TODO", priority="MEDIUM", story_points=5),
            SprintTaskDto(title="React dashboard core UI - sidebar & routing",
                          description="Implement multi-tab sidebar navigation, protected route guards, and page skeleton components for all major views.",
                          status="TODO", priority="HIGH", story_points=3),
        ]
    )

    sprint3 = SprintDto(
        name="Sprint 3: Polish, Testing & Production Deployment",
        sprint_number=3,
        goal="Complete frontend pages, implement export functionality, run full E2E tests, and deploy to production.",
        start_date=sprint3_start.isoformat(),
        end_date=sprint3_end.isoformat(),
        tasks=[
            SprintTaskDto(title="Complete all React dashboard pages",
                          description="Finish Architecture, Database, Sprints Kanban, Cost/Risk, Tech Stack, and Chat pages with proper loading states and error handling.",
                          status="TODO", priority="HIGH", story_points=8),
            SprintTaskDto(title="Export functionality (Markdown, SQL, OpenAPI)",
                          description="Implement /export/markdown, /export/sql, and /export/openapi endpoints that compile all artifacts into downloadable documents.",
                          status="TODO", priority="MEDIUM", story_points=5),
            SprintTaskDto(title="AI contextual chat assistant",
                          description="Implement sliding chat drawer with project-context-aware conversation, message history, and Gemini-powered responses.",
                          status="TODO", priority="MEDIUM", story_points=5),
            SprintTaskDto(title="Production deployment - backend & AI service",
                          description="Deploy Spring Boot to Railway, FastAPI to Railway/Render, PostgreSQL managed instance. Configure env vars, CORS, and health checks.",
                          status="TODO", priority="CRITICAL", story_points=5),
            SprintTaskDto(title="Frontend production build & Vercel deployment",
                          description="Build React app, deploy to Vercel, configure VITE_BACKEND_URL, test complete E2E flow on production URLs.",
                          status="TODO", priority="CRITICAL", story_points=3),
            SprintTaskDto(title="End-to-end testing & bug fixes",
                          description="Run full test suite (JUnit, pytest, Playwright), fix critical bugs, validate all API endpoints, verify Gemini fallback works.",
                          status="TODO", priority="HIGH", story_points=3),
        ]
    )

    all_sprints = [sprint1, sprint2, sprint3]
    total_points = sum(task.story_points for s in all_sprints for task in s.tasks)

    return SprintPlanResult(sprints=all_sprints, total_story_points=total_points, estimated_weeks=6)


def generate_sprint_plan(project_title: str, project_description: str, requirements_context: str = "") -> SprintPlanResult:
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 5 and not settings.GEMINI_API_KEY.startswith("your_"):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_PROMPT_SPRINT)
            prompt = f"Project: {project_title}\nDescription: {project_description}\nContext: {requirements_context}"
            response = model.generate_content(prompt)
            data = json.loads(_extract_json(response.text))
            return SprintPlanResult.model_validate(data)
        except Exception as e:
            logger.warning(f"SprintPlanner: Gemini call failed ({e}). Using deterministic fallback.")

    return _generate_fallback_sprint_plan(project_title, project_description)

