import json
import re
import logging

import google.generativeai as genai
from app.config import settings
from app.schemas.cost_risk_schema import CostEstimateResult, RiskPredictionResult, RiskItemDto

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_COST = """You are a Cloud FinOps Architect and DevOps Cost Estimator.
Estimate the monthly cloud infrastructure cost for the given software project.
Output strict JSON matching this schema:
{
  "total_monthly_usd": 85.50,
  "compute_usd": 40.0,
  "database_usd": 25.0,
  "storage_usd": 8.0,
  "ai_inference_usd": 12.5,
  "breakdown_notes": "Detailed cost breakdown with service names and optimization tips"
}
"""

SYSTEM_PROMPT_RISK = """You are a Senior Software Risk Analyst and Enterprise Architect.
Identify and analyze the top 6-8 risks for the given software project.
Output strict JSON matching this schema:
{
  "risks": [
    {
      "category": "TECHNICAL|OPERATIONAL|SECURITY|BUSINESS",
      "description": "Specific risk description and failure mode",
      "probability": 7,
      "impact": 8,
      "severity_score": 56,
      "mitigation_strategy": "Concrete engineering mitigation steps"
    }
  ],
  "overall_risk_level": "LOW|MODERATE|HIGH|CRITICAL"
}
severity_score = probability * impact (1-100). overall_risk_level based on average severity.
"""

def _extract_json(text: str) -> str:
    match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    match = re.search(r"(\{.*\})", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()


def _generate_fallback_cost(title: str, description: str) -> CostEstimateResult:
    """Deterministic cloud cost estimate fallback."""
    desc_lower = description.lower()
    is_heavy = any(k in desc_lower for k in ["enterprise", "scale", "high traffic", "microservices", "kubernetes"])

    if is_heavy:
        compute, database, storage, ai = 120.0, 60.0, 20.0, 35.0
    else:
        compute, database, storage, ai = 25.0, 15.0, 5.0, 10.0

    total = compute + database + storage + ai
    notes = (
        f"Cost estimate for '{title}' on Railway/Render + Vercel hosting:\\n"
        f"• Compute (${compute}/mo): Backend Spring Boot + FastAPI AI service on Railway starter plan\\n"
        f"• Database (${database}/mo): Railway/Supabase managed PostgreSQL with daily backups\\n"
        f"• Storage (${storage}/mo): Object storage for exported documents and attachments\\n"
        f"• AI Inference (${ai}/mo): Google Gemini 1.5 Flash API calls (~50K tokens/day estimated)\\n"
        f"• Frontend hosting: FREE via Vercel hobby plan\\n"
        f"Optimization tips: Enable Gemini response caching, use connection pooling (HikariCP), "
        f"schedule database snapshots daily, set auto-scaling thresholds at 70% CPU."
    )

    return CostEstimateResult(
        total_monthly_usd=round(total, 2),
        compute_usd=compute,
        database_usd=database,
        storage_usd=storage,
        ai_inference_usd=ai,
        breakdown_notes=notes
    )


def _generate_fallback_risks(title: str, description: str) -> RiskPredictionResult:
    """Deterministic risk analysis fallback."""
    desc_lower = description.lower()
    has_auth = any(k in desc_lower for k in ["user", "auth", "login", "account"])
    has_ai = any(k in desc_lower for k in ["ai", "gemini", "llm", "gpt", "model"])

    risks = [
        RiskItemDto(
            category="TECHNICAL",
            description="Gemini API rate limits or quota exhaustion causing AI generation failures during high-demand periods",
            probability=7, impact=8, severity_score=56,
            mitigation_strategy="Implement exponential backoff retry logic, cache AI responses in Redis with TTL, and maintain deterministic fallback generators for all 8 AI services."
        ),
        RiskItemDto(
            category="TECHNICAL",
            description="Database connection pool exhaustion under concurrent request load leading to 500 errors",
            probability=6, impact=9, severity_score=54,
            mitigation_strategy="Configure HikariCP with max-pool-size=20, set connection timeout to 30s, implement health check endpoint that validates DB connectivity, use read replicas for heavy queries."
        ),
        RiskItemDto(
            category="SECURITY",
            description="JWT token secret key exposure in environment variables or git history",
            probability=4, impact=10, severity_score=40,
            mitigation_strategy="Store JWT_SECRET in cloud provider secret manager (Railway/Render secret variables), rotate keys every 90 days, run git-secrets pre-commit hooks, never commit .env files."
        ),
        RiskItemDto(
            category="SECURITY",
            description="CORS misconfiguration allowing unauthorized cross-origin API access",
            probability=5, impact=8, severity_score=40,
            mitigation_strategy="Restrict CORS allowed-origins to explicit production frontend domain only. Remove wildcard '*' in production CorsConfig. Validate Origin header server-side."
        ),
        RiskItemDto(
            category="OPERATIONAL",
            description="Spring Boot cold start latency (10-15s) on Railway/Render free tier causing request timeouts",
            probability=8, impact=6, severity_score=48,
            mitigation_strategy="Enable Spring Boot native compilation with GraalVM, implement health check warm-up endpoint, configure Railway to use 512MB minimum memory, add frontend loading state for initial API calls."
        ),
        RiskItemDto(
            category="OPERATIONAL",
            description="AI service (FastAPI) response timeout on complex generation requests exceeding 30s",
            probability=6, impact=7, severity_score=42,
            mitigation_strategy="Set Gemini API timeout to 25s, implement async background job processing for /generate/all endpoint, return job_id immediately and poll for results, show progress indicators in UI."
        ),
        RiskItemDto(
            category="BUSINESS",
            description="Gemini API billing costs exceeding budget due to unexpectedly large token usage",
            probability=5, impact=7, severity_score=35,
            mitigation_strategy="Set Google Cloud billing budget alerts at $10/$50/$100 thresholds, log all API call token counts, implement per-user rate limiting (10 generations/day on free tier), use gemini-1.5-flash (cheaper) over pro."
        ),
        RiskItemDto(
            category="TECHNICAL",
            description="Java 17 vs JDK 23 incompatibility causing test failures or build errors in CI/CD",
            probability=4, impact=6, severity_score=24,
            mitigation_strategy="Pin Java 17 in pom.xml source/target, use JAVA_HOME pointing to JDK 17 in CI pipeline, test with GitHub Actions matrix (java: [17, 21]), add byte-buddy experimental flag for JDK 23 local dev."
        ),
    ]

    avg_severity = sum(r.severity_score for r in risks) / len(risks)
    if avg_severity >= 60:
        level = "CRITICAL"
    elif avg_severity >= 40:
        level = "HIGH"
    elif avg_severity >= 20:
        level = "MODERATE"
    else:
        level = "LOW"

    return RiskPredictionResult(risks=risks, overall_risk_level=level)


def generate_cost_estimate(project_title: str, project_description: str, requirements_context: str = "") -> CostEstimateResult:
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 5 and not settings.GEMINI_API_KEY.startswith("your_"):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_PROMPT_COST)
            prompt = f"Project: {project_title}\nDescription: {project_description}\nContext: {requirements_context}"
            response = model.generate_content(prompt)
            data = json.loads(_extract_json(response.text))
            return CostEstimateResult.model_validate(data)
        except Exception as e:
            logger.warning(f"CostEstimator: Gemini call failed ({e}). Using deterministic fallback.")
    return _generate_fallback_cost(project_title, project_description)


def generate_risk_prediction(project_title: str, project_description: str, requirements_context: str = "") -> RiskPredictionResult:
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 5 and not settings.GEMINI_API_KEY.startswith("your_"):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_PROMPT_RISK)
            prompt = f"Project: {project_title}\nDescription: {project_description}\nContext: {requirements_context}"
            response = model.generate_content(prompt)
            data = json.loads(_extract_json(response.text))
            return RiskPredictionResult.model_validate(data)
        except Exception as e:
            logger.warning(f"RiskPredictor: Gemini call failed ({e}). Using deterministic fallback.")
    return _generate_fallback_risks(project_title, project_description)

