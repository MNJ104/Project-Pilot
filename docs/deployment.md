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
      context: .
      dockerfile: docker/Dockerfile.backend
    container_name: pilot_backend
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/project_pilot
      SPRING_DATASOURCE_USERNAME: pilot_user
      SPRING_DATASOURCE_PASSWORD: pilot_password_change_me
      AI_SERVICE_URL: http://ai-service:8000
      JWT_SECRET: super_secret_jwt_key_at_least_64_characters_long_for_security_123456789
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy

  ai-service:
    build:
      context: .
      dockerfile: docker/Dockerfile.ai-service
    container_name: pilot_ai_service
    environment:
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      PORT: 8000
    ports:
      - "8000:8000"

  web-dashboard:
    build:
      context: .
      dockerfile: docker/Dockerfile.web
    container_name: pilot_web_dashboard
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 2. AWS Production Cloud Architecture

```
[ End User Browser / Extension ]
               |
               v
      [ AWS CloudFront CDN ]
               |
        +------+------+
        |             |
        v             v
   [ S3 Bucket ]   [ Application Load Balancer ] (ALB)
  (React Static)      | (HTTPS SSL via ACM)
                      +-------------------+
                      |                   |
                      v                   v
              [ AWS ECS Fargate ]  [ AWS ECS Fargate ]
              (Spring Boot API)    (Python AI Service)
                      |                   |
                      v                   |
              [ Amazon RDS Postgres ] <---+
               (Multi-AZ DB)              |
                                          v
                                   [ Gemini API ]
                                   (Outbound Egress)
```

### AWS Service Component Matrix

1. **Frontend Hosting**: AWS S3 + Amazon CloudFront (Global CDN with SSL/TLS).
2. **Compute Layer**: AWS ECS (Elastic Container Service) with AWS Fargate serverless containers running in private VPC subnets.
3. **Database Layer**: Amazon RDS PostgreSQL (Multi-AZ deployment, automated daily snapshots, storage auto-scaling).
4. **Secret Management**: AWS Secrets Manager for storing Gemini API keys, DB credentials, and JWT signing keys.
5. **Container Registry**: Amazon ECR (Elastic Container Registry) for backend & AI docker images.
6. **Network & Security**: AWS ALB with Web Application Firewall (AWS WAF), Security Groups restricting database access exclusively to ECS tasks.
