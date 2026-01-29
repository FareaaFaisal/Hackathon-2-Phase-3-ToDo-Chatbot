# Phase II – Multi-User Todo Full-Stack Web Application Constitution

## Core Principles

### Specification-First Development
All implementation must be driven strictly by written specifications.

### Security by Default
Authentication, authorization, and user data isolation are mandatory.

### Single Source of Truth
Specs under /specs are authoritative over assumptions or improvisation.

### Separation of Concerns
Frontend, backend, database, and authentication responsibilities must remain clearly isolated.

### Reproducibility
Any agent output must be traceable to a spec, guideline, or requirement.

### Minimalism
No feature beyond the defined requirements may be added.

## Key Standards

- **Technology Stack Compliance:**
  - Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS
  - Backend: FastAPI (Python)
  - ORM: SQLModel
  - Database: Neon Serverless PostgreSQL
  - Authentication: Better Auth with JWT
- **API Design:**
  - RESTful conventions
  - All routes under /api/
  - JSON-only request and response bodies
- **Authentication & Authorization:**
  - All API endpoints require a valid JWT token
  - JWT verification must occur in the backend
  - Task ownership must be enforced on every operation
- **Data Integrity:**
  - Tasks must always be associated with a user_id
  - No cross-user data access is permitted
- **Spec Compliance:**
  - Feature behavior must match acceptance criteria exactly
  - Ambiguities must be resolved by updating specs, not guessing

## Constraints

- No manual coding: All implementation must be generated or modified through agent-guided prompts.
- Stateless Backend:
  - No backend session storage
  - Authentication relies solely on JWT verification
- Environment Configuration:
  - Shared JWT secret must be provided via environment variables
  - No hard-coded secrets allowed
- Scope Limitation:
  - Only Basic Level Todo features are allowed in Phase II
  - Advanced or AI features are explicitly excluded
- Repository Structure:
  - Monorepo structure must be preserved
  - Specs must remain organized per Spec-Kit conventions

## Operational Rules for Agents

- Agents must operate only within their defined responsibility scope.
- Agents must read relevant CLAUDE.md files before acting.
- Agents must reference specs explicitly when implementing features.
- Cross-layer changes require coordination through updated specs.
- Refactoring is allowed only if it improves spec compliance.

## Validation & Testing Requirements

- All endpoints must return 401 for missing or invalid JWT tokens.
- Users must never access or modify other users’ tasks.
- CRUD operations must work end-to-end for authenticated users.
- Error states must be handled consistently across frontend and backend.
- Integration testing must verify spec adherence, not just functionality.

## Success Criteria

- All Basic Level features implemented exactly as specified.
- Full JWT-secured, multi-user task isolation verified.
- Frontend and backend communicate correctly using authenticated APIs.
- No undocumented behavior or hidden features present.
- Project passes spec review, security review, and integration validation.