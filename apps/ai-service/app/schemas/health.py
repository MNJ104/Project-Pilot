from pydantic import BaseModel
from typing import Optional, Dict, Any

class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: str
    details: Optional[Dict[str, Any]] = None

class DiagnosticResponse(BaseModel):
    status: str
    gemini_configured: bool
    gemini_api_reachable: Optional[bool] = None
    message: str
