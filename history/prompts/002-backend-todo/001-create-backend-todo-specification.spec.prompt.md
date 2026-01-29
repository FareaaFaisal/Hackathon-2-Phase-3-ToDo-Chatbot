---
id: 001
title: Create Backend Todo Specification
stage: spec
date: 2026-01-29
surface: agent
model: gemini-2.5-flash
feature: 002-backend-todo
branch: 002-backend-todo
user: FAREAA
command: /sp.specify
labels: ["spec","backend","todo"]
links:
  spec: specs/002-backend-todo/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-backend-todo/spec.md
  - specs/002-backend-todo/checklists/requirements.md
tests:

---

## Prompt

/sp.specify

Project Phase: Backend Implementation for Multi-User Todo Full-Stack Web Application 
Scope: - Focus exclusively on backend implementation. - Frontend UI, components, layouts, and styling MUST NOT be modified in any way. - Backend must integrate seamlessly with the already implemented frontend. - Authentication will be handled using Better Auth. - Database will be PostgreSQL (Neon). Purpose: - Build a secure, scalable, production-ready backend that supports authentication and task management. - Integrate authentication and authorization cleanly with the existing frontend. - Ensure all APIs align with frontend expectations without UI changes. Authentication Requirements: - Use Better Auth for authentication and session management. - JWT tokens are issued by Better Auth. - Backend must verify JWT tokens on protected routes. - Authorization middleware must ensure: - Only authenticated users can access task APIs. - Users can only access and modify their own tasks. - Use BETTER_AUTH_SECRET and BETTER_AUTH_URL from environment variables. - Token verification must follow Better Auth recommended patterns. Database Requirements: - Use PostgreSQL via Neon. - Connection string provided via NEON_DATABASE_URL environment variable. - Use a clean schema design with proper relations and constraints. Minimum database tables: - users - id (primary key) - email (unique) - created_at - tasks - id (primary key) - user_id (foreign key → users.id) - title - description (optional) - completed (boolean) - created_at - updated_at Task API Requirements: - Create task - Read all tasks for authenticated user - Update task (title, description, completed) - Delete task - Toggle task completion - Filtering (pending, completed) - Sorting (title, created date) Technical Requirements: - Backend framework: FastAPI (Python) - Use SQLModel or SQLAlchemy ORM - Pydantic schemas for request/response validation - Proper separation of concerns: - routers/ - services/ - models/ - schemas/ - core (config, auth, database) - JWT verification middleware dependency - Async database operations where applicable - Centralized error handling with clear HTTP status codes - CORS configured to allow frontend origin only Environment Configuration: - Load environment variables from `.env` - Required variables: - BETTER_AUTH_SECRET - BETTER_AUTH_URL - NEON_DATABASE_URL Integration Constraints: - Do NOT modify frontend code, UI, or components. - API routes must match frontend expectations. - Response formats must be predictable and frontend-friendly. - No breaking changes to frontend authentication or task flows. Security Requirements: - All task routes must be protected. - Validate ownership of resources (user can only access own tasks). - Prevent common vulnerabilities (SQL injection, improper access). - No sensitive data exposed in responses. Deliverables: - Fully working backend with: - Auth verification - Task CRUD APIs - Database models and migrations - Clear project structure - Ready-to-run FastAPI server - Backend ready for immediate frontend integration Success Criteria: - Frontend works without any UI change. - Authenticated users can manage only their own tasks. - Backend runs successfully with provided environment variables. - Clean, maintainable, and hackathon-ready codebase. Agent Instructions: - Focus strictly on backend logic and APIs. - Assume frontend is already complete and correct. - Do not redesign or refactor UI assumptions. - Ask for clarification only if an API contract is ambiguous.

## Response snapshot

The feature specification `specs/002-backend-todo/spec.md` has been created and is now complete.
The spec quality checklist `specs/002-backend-todo/checklists/requirements.md` has been created and all items are marked as passed.

This feature is now ready for the planning phase.

```
BRANCH_NAME: 002-backend-todo
SPEC_FILE: C:\Users\FAREAA\Desktop\TO-DO Full Stack App\specs\002-backend-todo\spec.md
FEATURE_NUM: 002
HAS_GIT: True
```

## Outcome

- ✅ Impact: A detailed feature specification for the backend implementation was created.
- 🧪 Tests: No tests applicable.
- 📁 Files: `specs/002-backend-todo/spec.md` and `specs/002-backend-todo/checklists/requirements.md` were created.
- 🔁 Next prompts: User can now proceed to the planning phase for this feature.
- 🧠 Reflection: The `create-new-feature.ps1` script failed to create the directory and spec file, so I manually created them. This indicates a persistent issue with the script.

## Evaluation notes (flywheel)

- Failure modes observed: The `create-new-feature.ps1` script failed to create the directory and spec file. This required manual intervention. The `ParameterBindingException` suggests an issue with how the PowerShell script is parsing arguments from the shell.
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Investigate and fix `create-new-feature.ps1` to handle arguments correctly, especially for multi-line strings. Alternatively, implement the directory and file creation logic directly in Python within the agent if shell script parsing remains problematic.
