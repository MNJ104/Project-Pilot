# Project Pilot – AI-Powered Software Planning & Architecture Assistant

> **Project Pilot** is an enterprise-grade AI software architecture and planning platform designed to analyze raw project inputs (webpages, GitHub repositories, Figma designs, technical docs, and manual text prompts) and automatically generate production-ready technical specifications, system architectures, database schemas, REST APIs, sprint plans, cost estimates, risk analyses, and code structure recommendations.

---

## 🚀 Phase 1 Status: COMPLETE & VERIFIED

Phase 1 Core Infrastructure, Authentication, Database Migrations, Python AI Microservice Skeleton, and React Web Dashboard Shell are **FULLY IMPLEMENTED AND VERIFIED**.

---

## 🛠 System Monorepo Architecture

```
Project-Pilot/
├── apps/
│   ├── extension/          # Manifest V3 Chrome Extension (React + TS + Vite) [Upcoming Phase 2]
│   ├── web-dashboard/     # SaaS Web Dashboard (React 18 + TS + Vite + Tailwind CSS)
│   ├── backend/           # Core API & Business Logic Server (Spring Boot 3.2 + Java 17 + PostgreSQL)
│   └── ai-service/        # Modular AI Engine (Python 3.11 + FastAPI + Gemini API + LangChain)
├── packages/
│   ├── shared-types/      # Common TypeScript types, DTO contracts & JSON schemas
│   └── docs/              # System architecture, API specifications, and database schemas
├── docker/                # Local development container configurations
├── docker-compose.yml     # Multi-service local development orchestration
└── README.md
```

---

## 📋 Prerequisites

- **Node.js**: `v20.x` or higher
- **Java**: `JDK 17` or higher
- **Python**: `3.11` or `3.13`
- **Docker**: Docker Desktop with Docker Compose
- **PostgreSQL**: PostgreSQL 16 (or run via Docker Compose)

---

## ⚙️ Environment Configuration

Copy the environment template before starting:
```bash
cp .env.example .env
```

Set your Google Gemini API key inside `.env`:
```env
GEMINI_API_KEY=your_actual_google_gemini_api_key
```

> **Security Guarantee**: Gemini API keys are processed strictly server-side inside `apps/ai-service`. Keys are NEVER sent to or exposed in the Chrome Extension or React Web Dashboard.

---

## 🚀 How to Run Locally

### 1. Start via Docker Compose (Recommended)

To start PostgreSQL, Spring Boot Backend, Python AI Service, and React Web Dashboard with a single command:

```bash
docker compose up --build
```

Access points:
- **React Web Dashboard**: `http://localhost:3000`
- **Spring Boot REST Backend**: `http://localhost:8080`
- **Spring Boot OpenAPI / Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **Python AI Microservice**: `http://localhost:8000`
- **Python AI Health Endpoint**: `http://localhost:8000/health`
- **PostgreSQL Database**: `localhost:5432` (Database: `project_pilot`, User: `pilot_user`)

---

### 2. Running Individual Microservices Manually

#### A. Spring Boot Backend (`apps/backend`)
```bash
cd apps/backend
mvn spring-boot:run
```

#### B. Python AI Microservice (`apps/ai-service`)
```bash
cd apps/ai-service
py -3 -m pip install -r requirements.txt
py -3 -m uvicorn app.main:app --reload --port 8000
```

#### C. React Web Dashboard (`apps/web-dashboard`)
```bash
cd apps/web-dashboard
npm install
npm run dev
```

---

## 🔐 Authentication API Catalog (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Create user account & return JWT bearer token | No |
| `POST` | `/api/v1/auth/login` | Authenticate credentials & return JWT bearer token | No |
| `GET` | `/api/v1/auth/me` | Fetch active user profile from JWT session | Yes (`Bearer <token>`) |
| `GET` | `/actuator/health` | Backend & Database connectivity health check | No |

### Sample Register Request Payload (`POST /api/v1/auth/register`):
```json
{
  "email": "manoj@company.com",
  "password": "securepassword123",
  "fullName": "Manoj Kumar",
  "role": "DEVELOPER"
}
```

### Sample Register/Login Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjNlNDU2Ny...",
  "tokenType": "Bearer",
  "expiresInMs": 86400000,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "manoj@company.com",
    "fullName": "Manoj Kumar",
    "roles": ["DEVELOPER"],
    "createdAt": "2026-09-03T14:30:00Z"
  }
}
```

---

## 🧪 Testing Suite Execution

Run automated unit and integration tests for each service:

```bash
# Test Spring Boot Backend (JUnit 5 + H2 Database)
cd apps/backend
mvn test

# Test Python AI Microservice (pytest + FastAPI TestClient)
cd apps/ai-service
py -3 -m pytest tests/

# Test Frontend Type Checks & Build (TypeScript + Vite)
cd apps/web-dashboard
npm run build
```

---

## ❓ Troubleshooting & FAQs

1. **Database connection failed on backend startup?**
   - Ensure PostgreSQL is running on port 5432 or start PostgreSQL via Docker Compose (`docker compose up postgres`).
2. **Flyway migration error?**
   - Verify `V1__init_auth_schema.sql` location. Flyway automatically runs database migrations on Spring Boot startup.
3. **Is Gemini API called on application startup?**
   - No. The `/health` endpoint checks Python service state without executing outbound LLM API calls.
