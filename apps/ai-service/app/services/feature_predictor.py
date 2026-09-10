"""
FeaturePredictor — Phase 4 AI Service
Calls Gemini API with retry/self-repair logic, returns validated FeaturePredictionResult.
"""

import json
import re
import logging
from typing import Optional

import google.generativeai as genai

from app.config import settings
from app.schemas.feature_schema import FeaturePredictionResult
from app.prompts.feature_prompt import SYSTEM_PROMPT_FEATURES, build_feature_prediction_prompt

logger = logging.getLogger(__name__)

MAX_RETRIES = 2


def _extract_json(text: str) -> str:
    """Strip markdown code fences if Gemini wraps JSON in ```json ... ```."""
    match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    match = re.search(r"(\{.*\})", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()


def predict_features(
    project_title: str,
    project_description: str,
    requirements_text: str = "",
) -> FeaturePredictionResult:
    """
    Generate predicted software features using Gemini API.

    Raises:
        RuntimeError: If Gemini API is not configured or all retries fail.
        ValueError: If Gemini returns unparseable JSON after all retries.
    """
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured. Cannot generate features.")

    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=SYSTEM_PROMPT_FEATURES,
    )

    user_prompt = build_feature_prediction_prompt(
        project_title=project_title,
        project_description=project_description,
        requirements_text=requirements_text,
    )

    last_error: Optional[Exception] = None

    for attempt in range(1, MAX_RETRIES + 2):
        try:
            logger.info(f"FeaturePredictor: Gemini call attempt {attempt}/{MAX_RETRIES + 1}")
            response = model.generate_content(user_prompt)
            raw_text = response.text

            json_str = _extract_json(raw_text)
            data = json.loads(json_str)
            result = FeaturePredictionResult.model_validate(data)
            logger.info(f"FeaturePredictor: successfully parsed {len(result.features)} features.")
            return result

        except json.JSONDecodeError as e:
            logger.warning(f"FeaturePredictor: JSON parse error on attempt {attempt}: {e}")
            last_error = e
        except Exception as e:
            logger.warning(f"FeaturePredictor: error on attempt {attempt}: {e}")
            last_error = e

    raise ValueError(
        f"FeaturePredictor failed after {MAX_RETRIES + 1} attempts. "
        f"Last error: {last_error}"
    )
