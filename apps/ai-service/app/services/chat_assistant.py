import logging
from typing import List

import google.generativeai as genai
from app.config import settings
from app.schemas.chat_schema import ChatRequest, ChatResponse, ChatMessageDto

logger = logging.getLogger(__name__)


def _build_system_prompt(project_title: str, project_context: str) -> str:
    context_section = f"\n\nProject Context (use this to answer questions accurately):\n{project_context}" if project_context else ""
    return (
        f"You are an expert AI Software Architecture Assistant for the project '{project_title}'. "
        "You help developers understand architectural decisions, requirements, database design, API contracts, "
        "sprint planning, cost estimates, and risk mitigation strategies. "
        "Provide concise, technically accurate answers. Use markdown formatting for code, tables, and lists. "
        "When you don't know something specific, say so and offer general architectural best practices instead."
        f"{context_section}"
    )


def _generate_fallback_reply(messages: List[ChatMessageDto], project_title: str, project_context: str) -> str:
    """Deterministic rule-based chat fallback when Gemini is unavailable."""
    if not messages:
        return f"Hello! I'm the AI assistant for **{project_title}**. I can answer questions about requirements, architecture, database design, API endpoints, sprint planning, cost estimates, and risks. What would you like to know?"

    last_user_msg = next((m.content.lower() for m in reversed(messages) if m.role == "user"), "")

    if any(k in last_user_msg for k in ["architecture", "system design", "components"]):
        return (
            f"The **{project_title}** system uses a **Modular Monorepo Architecture** with these key components:\n\n"
            "- **React 18 Frontend** — TypeScript + Tailwind CSS, communicates via REST API\n"
            "- **Spring Boot 3.2 Backend** — JWT auth, Flyway migrations, JPA/Hibernate ORM\n"
            "- **FastAPI AI Microservice** — Python 3.13, Google Gemini integration with deterministic fallback\n"
            "- **PostgreSQL 16** — ACID-compliant relational database with UUID keys\n\n"
            "All components are containerized with Docker and deployed to Railway/Vercel."
        )
    elif any(k in last_user_msg for k in ["database", "db", "schema", "table", "sql"]):
        return (
            f"The **{project_title}** database uses **PostgreSQL 16** with these core tables:\n\n"
            "| Table | Purpose |\n|---|---|\n"
            "| `users` | Authentication and user profiles |\n"
            "| `projects` | Software planning projects |\n"
            "| `sources` | GitHub URLs and text requirements |\n"
            "| `requirements` | FURPS+ classified requirements |\n"
            "| `architectures` | Generated architecture diagrams |\n"
            "| `sprints` | Agile sprint schedules |\n"
            "| `tasks` | Sprint task backlog |\n\n"
            "All tables use UUID primary keys and include `created_at`/`updated_at` timestamps."
        )
    elif any(k in last_user_msg for k in ["api", "endpoint", "rest", "route"]):
        return (
            f"The **{project_title}** REST API (base: `/api/v1`) includes:\n\n"
            "**Auth:** POST /auth/register, POST /auth/login, POST /auth/refresh\n\n"
            "**Projects:** GET/POST /projects, GET/PUT/DELETE /projects/{id}\n\n"
            "**AI Generation:** POST /projects/{id}/generate/[requirements|architecture|database|sprints|all]\n\n"
            "**Export:** GET /projects/{id}/export/[markdown|sql|openapi]\n\n"
            "All endpoints (except /auth/* and /health) require `Authorization: Bearer <jwt>` header."
        )
    elif any(k in last_user_msg for k in ["risk", "security", "threat"]):
        return (
            f"The top risks for **{project_title}** are:\n\n"
            "1. **Gemini API rate limits** (Severity: 56) — mitigated by retry logic + fallback generators\n"
            "2. **DB connection exhaustion** (Severity: 54) — mitigated by HikariCP tuning\n"
            "3. **JWT secret exposure** (Severity: 40) — mitigated by cloud secret manager\n"
            "4. **Cold start latency** (Severity: 48) — mitigated by health check warm-up\n\n"
            "Overall risk level: **HIGH** → requires proactive monitoring and alerting."
        )
    elif any(k in last_user_msg for k in ["sprint", "agile", "task", "story point"]):
        return (
            f"The **{project_title}** agile plan has 3 sprints (6 weeks total):\n\n"
            "- **Sprint 1** (2 weeks): Auth, DB schema, CI/CD, Docker setup — 24 story points\n"
            "- **Sprint 2** (2 weeks): APIs, AI generation, React dashboard — 29 story points\n"
            "- **Sprint 3** (2 weeks): Export, Chat, E2E tests, Production deployment — 29 story points\n\n"
            "Story points use Fibonacci scale (1, 2, 3, 5, 8). Total: **82 story points**."
        )
    elif any(k in last_user_msg for k in ["cost", "price", "budget", "billing"]):
        return (
            f"Estimated monthly cloud cost for **{project_title}**:\n\n"
            "| Service | Monthly Cost |\n|---|---|\n"
            "| Compute (Railway) | ~$25/mo |\n"
            "| Database (PostgreSQL) | ~$15/mo |\n"
            "| Storage | ~$5/mo |\n"
            "| Gemini API (AI) | ~$10/mo |\n"
            "| Frontend (Vercel) | FREE |\n"
            "| **Total** | **~$55/mo** |\n\n"
            "Set Google Cloud billing alerts at $10/$50/$100 to avoid surprises."
        )
    else:
        return (
            f"I'm the AI assistant for **{project_title}**. I can help you with:\n\n"
            "- 🏗️ **Architecture** — System design, components, deployment strategy\n"
            "- 🗄️ **Database** — Schema design, table relationships, SQL queries\n"
            "- 🔌 **APIs** — Endpoint design, authentication, request/response formats\n"
            "- 📋 **Requirements** — FURPS+ taxonomy, user stories, acceptance criteria\n"
            "- 🏃 **Sprints** — Agile planning, story points, task prioritization\n"
            "- 💰 **Cost & Risk** — Cloud cost estimates, risk analysis, mitigation strategies\n\n"
            "What specific question do you have?"
        )


def chat(request: ChatRequest) -> ChatResponse:
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 5 and not settings.GEMINI_API_KEY.startswith("your_"):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            system_prompt = _build_system_prompt(request.project_title, request.project_context or "")
            model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=system_prompt)

            # Build conversation history for multi-turn
            history = []
            for msg in request.messages[:-1]:  # All but last
                if msg.role in ("user", "assistant"):
                    history.append({
                        "role": "user" if msg.role == "user" else "model",
                        "parts": [msg.content]
                    })

            chat_session = model.start_chat(history=history)
            last_user_msg = request.messages[-1].content if request.messages else "Hello"
            response = chat_session.send_message(last_user_msg)

            return ChatResponse(reply=response.text.strip(), taxonomy_tag="INFERENCE")
        except Exception as e:
            logger.warning(f"ChatAssistant: Gemini call failed ({e}). Using rule-based fallback.")

    reply = _generate_fallback_reply(request.messages, request.project_title, request.project_context or "")
    return ChatResponse(reply=reply, taxonomy_tag="FACT")
