"""
RequirementAnalyzer — Phase 4 AI Service
Calls Gemini API with retry/self-repair logic, returns validated RequirementAnalysisResult.
"""

import json
import re
import logging
from typing import Optional

import google.generativeai as genai

from app.config import settings
from app.schemas.requirement_schema import RequirementAnalysisResult
from app.prompts.requirement_prompt import SYSTEM_PROMPT_REQUIREMENTS, build_requirement_analysis_prompt

logger = logging.getLogger(__name__)

MAX_RETRIES = 2


def _extract_json(text: str) -> str:
    """Strip markdown code fences if Gemini wraps JSON in ```json ... ```."""
    # Try to find a JSON block enclosed in triple backticks
    match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    # Try to find a raw JSON object
    match = re.search(r"(\{.*\})", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()


def analyze_requirements(
    project_title: str,
    project_description: str,
    sources_text: str = "",
) -> RequirementAnalysisResult:
    """
    Generate structured requirements using Gemini API.

    Raises:
        RuntimeError: If Gemini API is not configured or all retries fail.
        ValueError: If Gemini returns unparseable JSON after all retries.
    """
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured. Cannot generate requirements.")

    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=SYSTEM_PROMPT_REQUIREMENTS,
    )

    user_prompt = build_requirement_analysis_prompt(
        project_title=project_title,
        project_description=project_description,
        sources_text=sources_text,
    )

    last_error: Optional[Exception] = None

    for attempt in range(1, MAX_RETRIES + 2):  # 1, 2, 3 (3 total attempts)
        try:
            logger.info(f"RequirementAnalyzer: Gemini call attempt {attempt}/{MAX_RETRIES + 1}")
            response = model.generate_content(user_prompt)
            raw_text = response.text

            json_str = _extract_json(raw_text)
            data = json.loads(json_str)
            result = RequirementAnalysisResult.model_validate(data)
            logger.info(f"RequirementAnalyzer: successfully parsed {len(result.requirements)} requirements.")
            return result

        except json.JSONDecodeError as e:
            logger.warning(f"RequirementAnalyzer: JSON parse error on attempt {attempt}: {e}")
            last_error = e
        except Exception as e:
            logger.warning(f"RequirementAnalyzer: error on attempt {attempt}: {e}")
            last_error = e

    raise ValueError(
        f"RequirementAnalyzer failed after {MAX_RETRIES + 1} attempts. "
        f"Last error: {last_error}"
    )
