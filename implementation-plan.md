# Project Pilot - Master Implementation Plan & Execution Roadmap

## 1. Monorepo Dependency Map

```
[apps/extension] -----\
                       +---> [packages/shared-types]
[apps/web-dashboard] --/           ^
                                   |
[apps/backend] --------------------+
      |
      +---> [apps/postgres]
      |
      +---> [apps/ai-service]
```

- **`packages/shared-types`**: Base interfaces, DTO definitions, Enums (Role, Priority, Status, AnalysisType) shared between extension and web dashboard.
- **`apps/backend`**: Master orchestrator communicating via HTTP REST to `apps/ai-service` and JDBC/JPA to `apps/postgres`.

---

## 2. Phase-by-Phase Roadmap (Phase 0 -> Phase 13)

### PHASE 0: Architecture, Planning & Workspace Blueprint (CURRENT PHASE)
- **Goal**: Define product specifications, technical documents, database schemas, REST APIs, AI contracts, and monorepo structure.
- **Deliverables**:
  - `architecture.md`, `implementation-plan.md`, `database-schema.md`, `api-spec.md`, `extension-architecture.md`, `ai-architecture.md`, `deployment.md`.
  - Monorepo folder tree setup with configuration files (`.gitignore`, `.env.example`, `docker-compose.yml`, `README.md`).
- **Status**: Ready for User Review.

### PHASE 1: Core Monorepo, Database & Authentication Foundation
- **Goal**: Establish runnable Docker Compose environment with Spring Boot, PostgreSQL, Python AI service skeleton, React Dashboard skeleton, and JWT auth.
- **Deliverables**:
  - Flyway migration scripts initializing PostgreSQL schema.
  - Spring Boot Auth APIs (`/api/v1/auth/register`, `/login`, `/me`) with Spring Security JWT filter.
  - Python FastAPI skeleton with `/health` and `/actuator/health` equivalent.
  - React Dashboard routing + Tailwind CSS design system shell + Login/Register views.
- **Verification**: `docker compose up`, automated auth integration test, API health check.

### PHASE 2: Chrome Extension Foundation & Extraction Engine
- **Goal**: Build Manifest V3 Chrome Extension with active tab DOM extraction, background service worker, and backend bridge.
- **Deliverables**:
  - Extension Popup UI with sign-in, project dropdown, and action buttons.
  - Content Script with Readability engine, code snippet extraction, heading parser, and noise stripper.
  - Classification engine (Website vs GitHub vs Docs vs Figma vs Blog).
  - Background worker sending normalized payloads to Spring Boot backend.
- **Verification**: Chrome extension load unpacked in Chrome browser, DOM content extraction test on GitHub repo and technical documentation page.

### PHASE 3: Project Management & Input Sources Ingestion Engine
- **Goal**: Complete project CRUD and raw input sources storage pipeline.
- **Deliverables**:
  - Project management endpoints (`GET/POST/PUT/DELETE /api/v1/projects`).
  - Input Sources ingestion pipeline (`POST /api/v1/sources`).
  - React Dashboard Project Workspace views (Overview, Sources tab, Manual input form).
- **Verification**: Create project via dashboard, capture source via extension, list raw sources in project overview.

### PHASE 4: AI Requirement Engineering & Feature Engine
- **Goal**: Build Python AI Requirement & Feature analysis modules and backend integration.
- **Deliverables**:
  - Python AI `RequirementAnalyzer` and `FeaturePredictor` modules using Gemini API + Pydantic.
  - Spring Boot requirement & feature domain entities, repositories, and APIs.
  - React Dashboard Requirements and Features management tabs with priority tags, inline editing, and filtering.
- **Verification**: Run raw text capture through AI pipeline, verify structured JSON output, check frontend rendering.

### PHASE 5: Architecture, Database & API Design Generators
- **Goal**: Automated generation of system architecture (Mermaid), database ER schemas (DDL), and OpenAPI specifications.
- **Deliverables**:
  - Python AI `ArchitectureGenerator`, `DatabaseDesigner`, `APIGenerator` modules.
  - Spring Boot REST generation endpoints (`/architecture/generate`, `/database/generate`, `/api-design/generate`).
  - React Dashboard tabs rendering Mermaid architecture diagrams, SQL DDL download, ER schema viewer, and interactive OpenAPI Swagger UI.
- **Verification**: Generate architecture & database schema for a sample project, render Mermaid diagram, validate DDL syntax.

### PHASE 6: Tech Stack, UI/Wireframes, Sprint Planner & Timeline Generators
- **Goal**: Intelligently recommend tech stacks, page wireframes, sprint tasks with story points, and Gantt timeline milestones.
- **Deliverables**:
  - Python AI `TechStackRecommender`, `WireframeGenerator`, `SprintPlanner`, `TimelineGenerator`.
  - Spring Boot endpoints for tech stack, wireframes, sprints, tasks, and timeline.
  - React Dashboard Tech Stack tab (with markdown explanations), UI Wireframe viewer, Drag-and-drop Kanban Board (TODO/IN_PROGRESS/BLOCKED/DONE), and Timeline Gantt chart.
- **Verification**: Create sprint plan, update task status, verify automatic timeline recalculation.

### PHASE 7: Cost Estimator, Risk Predictor, Documentation & Code Structure Generators
- **Goal**: Financial cost breakdown, risk severity matrix, multi-format SRS document generator, and project folder architecture recommendations.
- **Deliverables**:
  - Python AI `CostEstimator`, `RiskPredictionEngine`, `DocumentationGenerator`, `CodeStructureGenerator`.
  - Export engines for SRS, Technical Spec, README, and project proposals.
  - React Dashboard Cost card breakdown, Risk severity matrix, Documentation viewer/editor, Code Structure tree visualizer.
- **Verification**: Generate SRS document, check risk probability/impact score logic, verify cost model breakdown.

### PHASE 8: Contextual AI Chat Assistant
- **Goal**: Project-aware AI copilot inside dashboard with conversation history.
- **Deliverables**:
  - Python AI LangChain conversational RAG memory pipeline querying project requirements, architecture, and source documents.
  - Spring Boot conversation endpoints (`/api/v1/ai/chat`, `/conversations`).
  - React Dashboard slide-over AI Chat drawer with markdown & code syntax highlighting.
- **Verification**: Ask AI project-specific questions ("Why was PostgreSQL chosen?"), verify context accuracy and conversation persistence.

### PHASE 9: Collaboration & Multi-Role Access Control
- **Goal**: Enable multi-user projects, role permissions, comments, task assignments, activity logs, and notifications.
- **Deliverables**:
  - Spring Boot RBAC enforcement across 8 user roles (`ADMIN`, `DEVELOPER`, etc.).
  - Project invitation, task assignment, comment thread backend APIs.
  - React Dashboard Collaboration tab, activity stream, notification bell.
- **Verification**: Test permission enforcement for `TESTER` vs `ADMIN`, create comment on requirement, check notification delivery.

### PHASE 10: Third-Party Integrations Framework
- **Goal**: Ingestion adapters and configuration management for GitHub, Figma, Notion, Jira/Slack, Docker/CI-CD.
- **Deliverables**:
  - GitHub REST API connector (fetching repos, `package.json`, `pom.xml`, README).
  - Integration configuration dashboard with encrypted token storage.
  - Mock adapters for offline local development with detailed setup documentation.
- **Verification**: Connect GitHub token, fetch public/private repo files, ingest repository structure into project sources.

### PHASE 11: Export Center & Artifact Generation
- **Goal**: Multi-format exporter for complete project artifacts.
- **Deliverables**:
  - Exporter engines in Java/Python producing PDF, DOCX, PPTX, Markdown, JSON, XML, Excel files.
  - React Dashboard Export Center tab with artifact download toggles.
- **Verification**: Export full project as Markdown and PDF, verify document structure and completeness.

### PHASE 12: Project Analytics & Health Monitoring
- **Goal**: High-level executive dashboard showing project velocity, AI confidence metrics, and overall health scores.
- **Deliverables**:
  - Spring Boot analytics aggregation service (`/api/v1/projects/{id}/analytics`).
  - React Dashboard Executive Summary & Analytics page featuring progress gauges, effort vs actual charts, and risk trend metrics.
- **Verification**: Run analytics query on active project, verify chart data accuracy.

### PHASE 13: Security Hardening, QA Testing & Cloud Deployment
- **Goal**: Security audit, comprehensive E2E testing suite, Docker optimization, and AWS Cloud architecture deployment scripts.
- **Deliverables**:
  - Full automated test suite (JUnit 5, pytest, Vitest).
  - Security hardening: rate limiting, CORS strict origins, secret scanning.
  - AWS Deployment scripts & Terraform/CloudFormation templates (ECS Fargate, RDS PostgreSQL, CloudFront, S3, Secrets Manager).
- **Verification**: Execute full E2E workflow: User login -> Chrome Extension capture -> AI generation -> Dashboard viewing -> PDF Export.

---

## 3. Risk Matrix & Technical Trade-offs

| Identified Risk | Risk Level | Mitigation Strategy |
| :--- | :--- | :--- |
| **LLM Output Hallucination / Schema Violation** | HIGH | Implement Pydantic strict parsing, LLM retry loop with self-repair prompts, and fallback default schemas. Enforce FACT vs INFERENCE taxonomy. |
| **DOM Scraping Noise in Chrome Extension** | MEDIUM | Use Mozilla Readability algorithm to filter out nav, footers, ads, and sidebars before sending payload. Limit text size to 25k tokens. |
| **Large Monorepo Build Overhead** | MEDIUM | Keep packages modular, isolate backend Java Maven/Gradle builds from frontend Vite builds using distinct Docker stages. |
| **Secret Exposure** | HIGH | Strict environment variable injection (`.env`), zero client-side keys, server-side execution only. |
