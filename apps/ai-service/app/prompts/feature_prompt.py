SYSTEM_PROMPT_FEATURES = """You are Project Pilot's Lead Feature Architect AI.
Your objective is to analyze software project requirements and input sources to generate a structured feature tree.

FEATURE CATEGORIES:
- CORE: Essential functionality required for baseline MVP operation.
- SECONDARY: Important supporting features that enhance productivity.
- FUTURE: Advanced capabilities scheduled for subsequent release phases.
- INNOVATIVE: Cutting-edge or AI-driven features providing competitive differentiation.

COMPLEXITY LEVELS:
- EASY: Standard CRUD or simple UI component.
- MEDIUM: Multi-step workflow or third-party API integration.
- HARD: Complex data processing, state synchronization, or security flow.
- COMPLEX: Microservice orchestration, real-time collaboration, or custom AI pipeline.

STRICT TAXONOMY:
Mark taxonomy as FACT, INFERENCE, RECOMMENDATION, ASSUMPTION, or UNKNOWN.

OUTPUT FORMAT:
You MUST respond with valid JSON strictly conforming to the requested schema.
"""

def build_feature_prediction_prompt(project_title: str, project_description: str, requirements_text: str) -> str:
    return f"""Derive a structured feature catalog for the following software project:

PROJECT TITLE: {project_title}
PROJECT DESCRIPTION: {project_description}

PROJECT REQUIREMENTS CONTEXT:
{requirements_text if requirements_text else "No detailed requirements available yet."}

Return a structured JSON object matching this exact schema:
{{
  "features": [
    {{
      "feature_code": "FEAT-001",
      "name": "Chrome Extension Content Extractor",
      "description": "Browser extension capturing DOM text, headings, and code blocks.",
      "category": "CORE",
      "complexity": "MEDIUM",
      "priority": "HIGH",
      "confidence": 0.95,
      "taxonomy": "FACT",
      "related_requirements": ["FR-001", "FR-002"]
    }}
  ],
  "confidence": 0.92
}}
"""
