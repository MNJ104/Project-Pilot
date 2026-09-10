# Project Pilot - Python AI Service Microservice Architecture

## 1. System Design Overview

Built as a dedicated microservice using **Python 3.11**, **FastAPI**, **Pydantic v2**, **Google Gemini 1.5/2.0 API**, and **LangChain**.

```
[ Spring Boot Backend ]
         |
         | HTTP REST (Pydantic JSON Payloads)
         v
[ FastAPI AI Service Router ] (`/ai/v1/...`)
         |
         +---> [ Prompt Library Manager ] (`app/prompts/`)
         +---> [ Modular Analyzer Engine ] (`app/services/`)
         |
         v
[ Gemini API Provider (Server-Side) ]
         |
         v
[ Pydantic Output Validator ]
         |
         +---> (Success) ---> Return JSON Response Envelope
         |
         +---> (Schema Error) ---> [ Self-Repair LLM Loop ] (Max 2 Retries)
```

---

## 2. Modular Engine Structure (`apps/ai-service/app/services/`)

The AI engine is strictly divided into 17 specialized analyzer modules:

```
apps/ai-service/app/
├── main.py                     # FastAPI application entry point & CORS
├── config.py                   # Environment & Gemini API key configuration
├── schemas/                    # Pydantic JSON contracts
│   ├── envelope.py             # Standard AI Generation Envelope
│   ├── requirement_schema.py   # FR, NFR, User Stories, Business Rules
│   ├── feature_schema.py       # Core, Secondary, Future, Innovative
│   ├── architecture_schema.py  # Components, Mermaid diagrams
│   ├── database_schema.py      # DDL SQL, ER diagram
│   ├── api_schema.py           # OpenAPI specs, Postman endpoints
│   ├── tech_stack_schema.py    # Stack recommendations + reasoning
│   ├── sprint_schema.py        # Sprints, Tasks, Story points
│   ├── cost_schema.py          # Financial & cloud cost model
│   ├── risk_schema.py          # Severity score matrix (1-10)
│   └── doc_schema.py           # SRS, Tech spec, README markdown
├── prompts/                    # System Prompts & Structured Instructions
│   ├── requirement_prompt.py
│   ├── feature_prompt.py
│   ├── architecture_prompt.py
│   ├── database_prompt.py
│   ├── api_prompt.py
│   ├── tech_stack_prompt.py
│   ├── sprint_prompt.py
│   ├── cost_prompt.py
│   └── risk_prompt.py
└── services/                   # 17 Independent Analyzer Modules
    ├── requirement_analyzer.py
    ├── domain_identifier.py
    ├── research_gap_finder.py
    ├── feature_predictor.py
    ├── complexity_analyzer.py
    ├── feasibility_analyzer.py
    ├── architecture_generator.py
    ├── database_designer.py
    ├── api_generator.py
    ├── tech_stack_recommender.py
    ├── wireframe_generator.py
    ├── sprint_planner.py
    ├── timeline_generator.py
    ├── cost_estimator.py
    ├── risk_predictor.py
    ├── documentation_generator.py
    └── code_structure_generator.py
```

---

## 3. Strict Taxonomy & Anti-Hallucination Framework

Every AI analysis response must categorize generated statements into 5 explicit buckets:

1. `FACT`: Directly verified from provided source text or repository files.
2. `INFERENCE`: Logically derived based on standard engineering patterns.
3. `RECOMMENDATION`: Suggested architectural choices with technical justification.
4. `ASSUMPTION`: Unstated constraints assumed to hold true (e.g., target user base size).
5. `UNKNOWN`: Explicitly identified missing information (e.g., "Insufficient information regarding compliance requirements").

---

## 4. Structured Output Self-Repair Pipeline

```python
async def execute_ai_generation(prompt: str, pydantic_schema: Type[T]) -> T:
    for attempt in range(MAX_RETRIES):
        raw_response = await call_gemini_api(prompt)
        try:
            cleaned_json = extract_json_block(raw_response)
            validated_obj = pydantic_schema.model_validate_json(cleaned_json)
            return validated_obj
        except ValidationError as e:
            if attempt == MAX_RETRIES - 1:
                logger.error(f"Pydantic Validation failed after retries: {e}")
                raise HTTPException(status_code=522, detail="AI JSON schema repair failed.")
            # Inject error back into prompt for self-correction
            prompt = construct_repair_prompt(prompt, raw_response, str(e))
```
