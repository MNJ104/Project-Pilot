# Project Pilot - DevOps & Cloud Deployment Guide

## 1. Local Development (Docker Compose)

The monorepo contains a root `docker-compose.yml` that orchestrates all system dependencies for local testing.

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: pilot_postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-project_pilot}
      POSTGRES_USER: ${POSTGRES_USER:-pilot_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-pilot_password_change_me}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pilot_user -d project_pilot"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    container_name: pilot_backend
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/project_pilot
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-pilot_user}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD:-pilot_password_change_me}
      AI_SERVICE_URL: http://ai-service:8000
      JWT_SECRET: ${JWT_SECRET:-super_secret_jwt_key_at_least_64_characters_long_for_security_123456789}
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy

  ai-service:
    build:
      context: ./apps/ai-service
      dockerfile: Dockerfile
    container_name: pilot_ai_service
    environment:
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      PORT: 8000
    ports:
      - "8000:8000"

  web-dashboard:
    build:
      context: ./apps/web-dashboard
      dockerfile: Dockerfile
    container_name: pilot_web_dashboard
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 2. Fast 1-Click Render Production Deployment

A unified `render.yaml` Blueprint is located at the root of the repository.

### Steps:
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New > Blueprint**.
3. Select your repository `Project-Pilot`.
4. Render will automatically detect `render.yaml` and configure:
   - **pilot-postgres**: Managed PostgreSQL 16 instance.
   - **pilot-ai-service**: Python FastAPI microservice with automated health checks at `/health`.
   - **pilot-backend**: Dockerized Spring Boot 3.2 backend with health checks at `/actuator/health`.
   - **pilot-web-dashboard**: Static SPA frontend deployed with clean rewrites.
5. Provide your `GEMINI_API_KEY` in the Render dashboard prompt.
6. Click **Apply Blueprint**.

---

## 3. Vercel Frontend Deployment (Alternative)

For maximum global edge performance, the React 18 frontend can be deployed directly to Vercel:

1. Import `apps/web-dashboard` into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Root Directory: `apps/web-dashboard`.
4. Set Environment Variable:
   - `VITE_BACKEND_URL`: `https://<your-backend-url>/api/v1`
5. Deploy. The included `apps/web-dashboard/vercel.json` ensures client-side routing works for all routes (`/`, `/login`, `/register`, `/dashboard`).

---

## 4. Production Health Verification

Once services are deployed, verify health using the following endpoints:

### Backend Health Check:
```bash
curl -i https://<YOUR_BACKEND_URL>/actuator/health
# Expected 200 OK: {"status":"UP"}
```

### AI Service Health Check:
```bash
curl -i https://<YOUR_AI_SERVICE_URL>/health
# Expected 200 OK: {"status":"UP","service":"project-pilot-ai-service","details":{...}}
```

### AI Diagnostic Connectivity Test:
```bash
curl -i https://<YOUR_AI_SERVICE_URL>/ai/v1/diagnostic
# Confirms whether GEMINI_API_KEY is configured and reachable
```

### Swagger UI API Explorer:
```
https://<YOUR_BACKEND_URL>/swagger-ui/index.html
```

---

## 5. Security & Secret Management

- **GEMINI_API_KEY**: Stored exclusively as an environment variable in the AI microservice. Never exposed to web client or committed to git.
- **JWT_SECRET**: Minimum 64-character secret key generated for production signing.
- **CORS Configuration**: Handles wildcard authorization with `allowCredentials=true` for Web and Chrome extension cross-origin requests.
- **Flyway Migrations**: Applied automatically on Spring Boot startup against the target PostgreSQL instance (V1 -> V2 -> V3).
