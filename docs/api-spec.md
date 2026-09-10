# Project Pilot - REST API Specification (`/api/v1/`)

## 1. Overview & General Standards

- **Base Path**: `/api/v1/`
- **Authentication**: HTTP Header `Authorization: Bearer <JWT_TOKEN>`
- **Response Content-Type**: `application/json`
- **Error Standard**: RFC 7807 Problem Details for HTTP APIs

### Standard AI Generation Envelope Schema
```json
{
  "projectId": "123e4567-e89b-12d3-a456-426614174000",
  "analysisType": "requirements",
  "result": {},
  "confidence": 0.92,
  "warnings": [],
  "sources": ["src-7890"],
  "generatedAt": "2026-09-03T14:30:00Z"
}
```

---

## 2. API Endpoints Catalog

### Authentication
- `POST /api/v1/auth/register` - Create user account
- `POST /api/v1/auth/login` - Authenticate & return JWT token
- `GET  /api/v1/auth/me` - Fetch current authenticated profile
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Project Management
- `GET    /api/v1/projects` - List user projects
- `POST   /api/v1/projects` - Create new project workspace
- `GET    /api/v1/projects/{id}` - Fetch project details
- `PUT    /api/v1/projects/{id}` - Update project meta
- `DELETE /api/v1/projects/{id}` - Soft delete project
- `POST   /api/v1/projects/{id}/members` - Add team member (RBAC)

### Input Sources & Extraction
- `GET  /api/v1/projects/{id}/sources` - List captured sources
- `POST /api/v1/sources` - Ingest web / GitHub / text source
- `POST /api/v1/sources/analyze` - Trigger AI analysis on source

### AI Planning Generators
- `GET  /api/v1/projects/{id}/requirements` - Fetch requirements
- `POST /api/v1/projects/{id}/requirements/generate` - Trigger AI requirement extraction
- `POST /api/v1/projects/{id}/features/generate` - Trigger AI feature prediction
- `POST /api/v1/projects/{id}/architecture/generate` - Generate system & component architecture (Mermaid)
- `POST /api/v1/projects/{id}/database/generate` - Generate PostgreSQL DDL & ER diagram
- `POST /api/v1/projects/{id}/api-design/generate` - Generate OpenAPI specs & Postman collections
- `POST /api/v1/projects/{id}/tech-stack/generate` - Generate tech stack recommendations with justification
- `POST /api/v1/projects/{id}/wireframes/generate` - Generate UI wireframe layouts
- `POST /api/v1/projects/{id}/sprints/generate` - Generate sprint backlog & story point breakdown
- `POST /api/v1/projects/{id}/timeline/generate` - Generate milestone schedule & Gantt timeline
- `POST /api/v1/projects/{id}/cost/generate` - Generate cost estimations & cloud breakdown
- `POST /api/v1/projects/{id}/risks/analyze` - Generate risk severity matrix & mitigations
- `POST /api/v1/projects/{id}/documentation/generate` - Generate SRS / Tech Spec / README documents
- `POST /api/v1/projects/{id}/code-structure/generate` - Generate recommended package structure

### Sprints & Tasks (Kanban CRUD)
- `GET  /api/v1/projects/{id}/sprints` - List sprints
- `POST /api/v1/projects/{id}/tasks` - Create task
- `PUT  /api/v1/tasks/{taskId}` - Update task status / assignee

### AI Chat Assistant
- `POST /api/v1/ai/chat` - Send query to contextual AI copilot
- `GET  /api/v1/projects/{id}/conversations` - Fetch project chat history

### Analytics & Exports
- `GET /api/v1/projects/{id}/analytics` - Fetch health score & progress velocity
- `POST /api/v1/projects/{id}/export` - Trigger export (PDF, DOCX, PPTX, Markdown, JSON, XML, Excel)
