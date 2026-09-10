from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import google.generativeai as genai

from app.config import settings
from app.schemas.health import HealthResponse, DiagnosticResponse

app = FastAPI(
    title="Project Pilot AI Service",
    description="Modular AI Microservice for Software Planning & Architecture Generation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Standard health check endpoint.
    Fast & lightweight - does NOT call external Gemini API.
    """
    is_gemini_set = bool(settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 5)
    return HealthResponse(
        status="UP",
        service="project-pilot-ai-service",
        timestamp=datetime.utcnow().isoformat(),
        details={
            "gemini_api_configured": is_gemini_set,
            "environment": settings.ENVIRONMENT
        }
    )

@app.get("/ai/v1/diagnostic", response_model=DiagnosticResponse, tags=["Diagnostic"])
async def diagnostic_check():
    """
    Explicit diagnostic check for Gemini API connectivity.
    Called only when requested; protected diagnostic route.
    """
    if not settings.GEMINI_API_KEY:
        return DiagnosticResponse(
            status="WARNING",
            gemini_configured=False,
            gemini_api_reachable=False,
            message="GEMINI_API_KEY environment variable is not configured."
        )

    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")
        # Lightweight test prompt
        response = model.generate_content("Ping")
        return DiagnosticResponse(
            status="UP",
            gemini_configured=True,
            gemini_api_reachable=True,
            message="Successfully reached Gemini API."
        )
    except Exception as e:
        return DiagnosticResponse(
            status="ERROR",
            gemini_configured=True,
            gemini_api_reachable=False,
            message=f"Gemini API test failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
