# Project Pilot - Master Technical Architecture

## 1. System Vision & Overview

Project Pilot is an enterprise-grade AI-powered software planning and architecture platform. It acts as an automated software architect and lead technical strategist, ingesting disparate project inputs (webpages, GitHub repos, Figma designs, technical documentation, and manual text prompts) and synthesizing them into structured, production-ready software artifacts.

The system is built as a **Modular Monorepo** ensuring clean isolation of concerns, secure credential boundaries, server-side AI execution, and clear API contracts.

---

## 2. Monorepo & System Architecture

```
                                  +---------------------------------------+
                                  |         Chrome Extension (MV3)        |
                                  |  (React 18 + TS + Content Extractor)  |
                                  +-------------------+-------------------+
                                                      |
                                                      | HTTPS REST API (JWT)
                                                      v
+-----------------------------------+     +-----------------------------------+
|         React Web Dashboard       |---->|        Spring Boot Backend        |
| (React 18 + TS + Tailwind + Vite) |     |  (Java 17 + Spring Security + JPA)|
+-----------------------------------+     +---------+---------------+---------+
                                                    |               |
                                                    v               v
                                            +---------------+ +---------------+
                                            | PostgreSQL DB | | Python AI Svc |
                                            | (Relational)  | |  (FastAPI)    |
                                            +---------------+ +-------+-------+
                                                                      |
                                                                      v
                                                              +---------------+
                                                              | Gemini AI API |
                                                              +---------------+
```

### Application Components

1. **`apps/extension`**: Chrome Extension built with Manifest V3, TypeScript, React 18, Vite, and Chrome Extension APIs. Interacts with active tab DOM via content scripts, extracts clean normalized page content, and proxies through the background service worker to the Spring Boot Backend.
2. **`apps/web-dashboard`**: Full-featured SaaS Web Application built with React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, and Mermaid.js for visual rendering of system architecture diagrams and ER schemas.
3. **`apps/backend`**: Core API & Business Logic Server built with Java 17, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, and PostgreSQL. Orchestrates project states, persistence, permissions, integration connectors, and delegates AI tasks to the Python AI service.
4. **`apps/ai-service`**: Isolated AI microservice built with Python 3.11, FastAPI, Pydantic v2, Google Gemini 1.5/2.0 API, and LangChain. House 17 distinct domain-specific AI analyzer engines with strict JSON output schemas and automated self-repair fallback pipelines.
5. **`apps/postgres`**: PostgreSQL 16 relational database enforcing strong data integrity, foreign key relations, indexing, and audit tracking across 28 entities.

---

## 3. Core Data Flow Sequence

```
User -> Chrome Extension / Web Dashboard
   |
   +--> 1. Capture Page / Submit Raw Content (Web, GitHub, Text)
   |
Spring Boot Backend (/api/v1/sources)
   |
   +--> 2. Persist Raw Source Document in PostgreSQL
   |
   +--> 3. Dispatch AI Extraction Request -> Python AI Service (/ai/v1/extract-requirements)
            |
            +--> 4. Prompt Construction + Pydantic Schema Injection
            +--> 5. Call Gemini API (Server-Side Execution)
            +--> 6. JSON Schema Validation & Self-Repair Pipeline
            |
   +<--- 7. Return Structured JSON Result
   |
Spring Boot Backend
   |
   +--> 8. Persist Generated Requirement / Architecture / DB / API records in PostgreSQL
   |
React Dashboard
   |<-- 9. Render Interactive Dashboards, Mermaid Diagrams & Gantt Charts
```

---

## 4. Security & Credential Isolation Rules

- **Zero Client-Side Keys**: Gemini API keys, GitHub OAuth client secrets, and third-party tokens are NEVER embedded in the Chrome Extension or React Web Dashboard.
- **Server-Side API Proxying**: All LLM interactions are proxied through the Python AI Service, strictly accessible internally by the Spring Boot backend via secure internal network calls or authenticated headers.
- **JWT Authentication**: User authentication uses stateless HMAC-SHA256 JWT tokens. Password hashing is enforced via BCrypt (strength 12).
- **Role-Based Access Control (RBAC)**: Enforces 8 granular system roles (`ADMIN`, `PROJECT_MANAGER`, `DEVELOPER`, `DESIGNER`, `TESTER`, `CLIENT`, `RESEARCHER`, `STUDENT`) across all project resources.

---

## 5. Technology Matrix & Justification

| Layer | Selected Tech | Justification |
| :--- | :--- | :--- |
| **Monorepo Strategy** | npm Workspaces | Simple, lightweight native monorepo management without unnecessary build tool bloat. |
| **Backend Framework** | Spring Boot 3.2 + Java 17 | Enterprise stability, robust transaction management, strong typing, mature security. |
| **AI Microservice** | FastAPI + Python 3.11 | Native async Python execution, seamless integration with LangChain & Pydantic. |
| **LLM Provider** | Google Gemini 1.5 Pro / Flash | Large context window (1M+ tokens), fast structured JSON responses, low cost. |
| **Database** | PostgreSQL 16 | ACID compliance, JSONB support for unstructured source snapshots, rich relational constraints. |
| **Frontend UI** | React 18 + TypeScript + Vite | High performance, modular component tree, fast HMR, type safety. |
| **Styling** | Tailwind CSS | Utility-first CSS, flexible customization, clean modern SaaS styling. |
| **Chrome Extension** | Manifest V3 + Service Worker | Google Chrome store compliance, secure background processing. |
| **Diagrams & Visuals**| Mermaid.js + Recharts | Native web rendering of ER diagrams, sequence flows, and project analytics. |
