# Project Pilot - Chrome Extension Architecture (Manifest V3)

## 1. Extension System Architecture

Built using Google Chrome Extension **Manifest V3**, TypeScript, React 18, Vite, and Chrome Extension APIs.

```
[ Active Webpage DOM ]
         |
         | (Message Passing)
         v
[ Content Script Engine ]  <--->  [ Content Normalizer & Extractor ]
         |
         | (Chrome Runtime Messaging)
         v
[ Background Service Worker ] <---> [ Storage Sync & Auth State ]
         |
         | (HTTPS REST API / JWT)
         v
[ Spring Boot Backend ] (/api/v1/sources)
```

---

## 2. Component Breakdown

1. **Popup UI (`apps/extension/src/popup`)**:
   - Built with React 18 & Tailwind CSS.
   - User authentication state (Sign In / Sign Out).
   - Project Selector Dropdown (`Select Active Project`).
   - Action Buttons: `[Analyze This Page]`, `[Capture Selection]`, `[Save to Project]`, `[Ask AI]`, `[Open Dashboard]`.
   - Live AI Analysis Summary Card (Page Summary, Domain, Requirements Count, Features Count, Complexity, Feasibility, Next Steps).
2. **Content Script Engine (`apps/extension/src/content`)**:
   - Injected into web pages upon user trigger or background command.
   - DOM Reader utilizing Readability algorithm for main body text extraction.
   - Extract headings (`<h1>` to `<h6>`), links (`<a>`), code blocks (`<pre>`, `<code>`), tables, and image metadata.
   - Noise Filter: Strips `<nav>`, `<footer>`, `<aside>`, `<script>`, `<style>`, and iframe advertisements.
3. **Classification & Normalization Engine**:
   - Automatically detects page type:
     - `GITHUB_REPO`: Inspects `github.com` URLs, extracts README, repo root files (`package.json`, `pom.xml`, `Dockerfile`, `requirements.txt`).
     - `FIGMA_DESIGN`: Inspects Figma URL patterns, extracts frame titles & component hierarchy.
     - `DOCUMENTATION`: Detects technical docs (ReadTheDocs, Docusaurus, GitBook).
     - `BLOG_ARTICLE`, `PRODUCT_PAGE`, `WEBSITE`.
   - Enforces token clipping limit (max 25,000 text characters) before sending to backend.
4. **Background Service Worker (`apps/extension/src/background`)**:
   - Persistent message listener handling background API dispatches.
   - Secure storage manager (`chrome.storage.sync` for auth tokens & active project state).
   - Token refresh loop and backend connection health checker.
5. **Options Page (`apps/extension/src/options`)**:
   - Backend URL configuration, API key status, default project defaults, extraction settings.

---

## 3. GitHub Extraction Engine Specifics

When a user triggers analysis on a `github.com/{owner}/{repo}` page:

1. Detect GitHub URL structure (`https://github.com/owner/repo`).
2. Utilize GitHub REST API (`https://api.github.com/repos/{owner}/{repo}`) if token is present, else fall back to DOM extraction.
3. Extract crucial repository metadata:
   - Repository Name, Owner, Description, Stars, Forks, Primary Languages.
   - Fetch `README.md` content.
   - Fetch root configuration files: `package.json`, `pom.xml`, `build.gradle`, `requirements.txt`, `Dockerfile`, `docker-compose.yml`.
   - Extract folder tree hierarchy up to 3 levels deep.
4. Construct a structured `GitHubExtractionPayload` and dispatch to Spring Boot backend.
