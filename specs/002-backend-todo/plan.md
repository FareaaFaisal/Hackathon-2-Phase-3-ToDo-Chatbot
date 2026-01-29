# Implementation Plan: Backend Implementation for Multi-User Todo Full-Stack Web Application

**Branch**: `002-backend-todo` | **Date**: 2026-01-29 | **Spec**: [specs/002-backend-todo/spec.md](specs/002-backend-todo/spec.md)
**Input**: Feature specification from `/specs/002-backend-todo/spec.md`

## Summary

This plan outlines the implementation of a secure, scalable, and maintainable FastAPI backend for a multi-user Todo application. It will seamlessly integrate with the existing frontend without requiring any UI modifications, focusing on robust authentication with Better Auth, task management APIs, and PostgreSQL (Neon) database integration.

## Technical Context

**Language/Version**: Python (latest stable), FastAPI
**Primary Dependencies**: FastAPI, SQLModel, Better Auth (for JWT), PostgreSQL (Neon)
**Storage**: PostgreSQL (Neon) database via SQLModel ORM
**Testing**: TBD (likely Pytest)
**Target Platform**: Server-side (Docker container for deployment)
**Project Type**: Web Application Backend (API-only)
**Performance Goals**: API response times optimized for efficient frontend interaction.
**Constraints**: No frontend UI or logic modification. API routes and response formats must match frontend expectations. Use environment variables for sensitive configuration (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEON_DATABASE_URL`).
**Scale/Scope**: Multi-user Todo application backend with authentication, authorization, and CRUD operations for tasks including filtering and sorting.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The plan adheres to the project constitution's principles and key standards:

-   **Specification-First Development**: This plan is directly derived from `specs/002-backend-todo/spec.md`.
-   **Security by Default**: Focuses on JWT verification, data ownership enforcement, and preventing common vulnerabilities. Uses `BETTER_AUTH_SECRET`.
-   **Single Source of Truth**: `spec.md` and `plan.md` serve as authoritative sources.
-   **Separation of Concerns**: Clearly isolates backend responsibilities (APIs, database, business logic) from frontend.
-   **Reproducibility**: All planned components and steps can be traced back to the spec.
-   **Minimalism**: Features are limited to the defined Todo application scope.

**Key Standards Compliance**:

-   **Technology Stack Compliance**: Adheres to FastAPI (Python), SQLModel, Neon Serverless PostgreSQL, Better Auth with JWT.
-   **API Design**: Implements RESTful conventions with JSON-only request/response bodies, with all routes under `/api/`.
-   **Authentication & Authorization**: Backend verifies JWT tokens, enforces task ownership per `user_id`, and uses `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`.
-   **Data Integrity**: Tasks will be associated with `user_id`, and cross-user data access will be prevented.
-   **Spec Compliance**: All API contracts and behavioral requirements from the spec are addressed.

**Constraints Compliance**:

-   **No manual coding**: All implementation steps are designed for agent-guided generation.
-   **Stateless Backend**: Backend will not use session storage, relying solely on JWT verification.
-   **Environment Configuration**: Explicitly uses environment variables for `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEON_DATABASE_URL`.
-   **Scope Limitation**: Limited to Basic Level Todo features.
-   **Repository Structure**: Monorepo structure will be preserved (backend lives in a `backend/` directory).

## Project Structure

### Documentation (this feature)

```text
specs/002-backend-todo/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py    # Environment variables, settings
│   │   ├── security.py  # JWT handling (encoding/decoding, Better Auth integration)
│   │   └── database.py  # DB session, engine setup
│   ├── models/          # SQLModel database models (User, Task)
│   ├── schemas/         # Pydantic schemas for API requests/responses
│   ├── routers/         # FastAPI router modules (auth, tasks)
│   └── services/        # Business logic for tasks
├── alembic/             # Database migration scripts
├── .env                 # Environment variables (local dev)
└── tests/               # Unit and integration tests
```

**Structure Decision**: The "Web application" option, specifically for the backend, is selected. The structure aligns with FastAPI best practices for a modular and scalable application.

## Implementation Sequence

This sequence outlines the steps to build the backend from ground up, ensuring a logical progression and addressing dependencies.

### Phase 1: Project & Environment Setup

**Goal**: Initialize FastAPI project and establish foundational environment settings.

1.  **Initialize FastAPI Project**:
    *   **Task**: Create a new Python project, install FastAPI, SQLModel, Uvicorn, python-dotenv, psycopg2-binary, and other necessary dependencies.
    *   **Output**: `backend/` directory with `main.py`, `requirements.txt`.

2.  **Configure Project Structure**:
    *   **Task**: Create core directories: `app/core/`, `app/models/`, `app/schemas/`, `app/routers/`, `app/services/`.
    *   **Output**: Empty directories.

3.  **Load Environment Variables (`app/core/config.py`)**:
    *   **Task**: Implement a configuration module to load `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEON_DATABASE_URL` from `.env`.
    *   **Purpose**: Centralized and secure configuration management.

4.  **Configure CORS (`app/main.py`)**:
    *   **Task**: Add CORS middleware to FastAPI application to allow requests from the frontend origin.
    *   **Purpose**: Enable secure communication between frontend and backend.

5.  **Verify Application Boot**:
    *   **Task**: Ensure the basic FastAPI application can start without errors.

### Phase 2: Database & ORM Setup

**Goal**: Define database models and establish database connectivity.

1.  **Configure SQLModel (`app/core/database.py`)**:
    *   **Task**: Set up SQLModel engine and session management for PostgreSQL.
    *   **Purpose**: ORM setup and database connection pooling.

2.  **Define Database Models (`app/models/`)**:
    *   **Task**: Create `User` model (SQLModel) with `id`, `email`, `created_at` matching Better Auth's user identity.
    *   **Task**: Create `Task` model (SQLModel) with `id`, `user_id` (Foreign Key to User), `title`, `description`, `completed`, `created_at`, `updated_at`.
    *   **Purpose**: Type-safe database schema definition.

3.  **Alembic Migrations Setup**:
    *   **Task**: Initialize Alembic for database migrations and configure it for SQLModel.
    *   **Output**: `alembic/` directory, `alembic.ini`.

4.  **Initial Database Migration**:
    *   **Task**: Generate and apply an initial migration to create `users` and `tasks` tables.
    *   **Purpose**: Version-controlled database schema management.

5.  **Validate Database Connectivity**:
    *   **Task**: Write a simple endpoint or test to verify the backend can connect to and perform basic operations on the Neon PostgreSQL database.

### Phase 3: Authentication & Authorization

**Goal**: Implement JWT verification and user authorization.

1.  **Integrate Better Auth JWT Verification (`app/core/security.py`)**:
    *   **Task**: Implement functions for JWT decoding, validation, and user retrieval using `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`.
    *   **Purpose**: Centralized JWT handling.

2.  **Implement Authentication Dependency (`app/api/deps.py`)**:
    *   **Task**: Create a FastAPI dependency (`get_current_user`) that extracts, validates JWT, and returns the authenticated `User` object.
    *   **Purpose**: Reusable authentication guard for protected endpoints.

3.  **Enforce Authentication on Routes**:
    *   **Task**: Apply `get_current_user` dependency to all protected API routes (task routes).
    *   **Purpose**: Secure access to user-specific data.

4.  **Prevent Unauthorized Resource Access**:
    *   **Task**: Implement logic to ensure that tasks can only be accessed, modified, or deleted by their owning user.
    *   **Purpose**: Enforce data ownership (FR-012).

### Phase 4: Task CRUD Business Logic

**Goal**: Develop the core business logic for task management.

1.  **Task Service Layer (`app/services/task_service.py`)**:
    *   **Task**: Implement functions for `create_task`, `get_tasks_by_user`, `get_task_by_id_for_user`, `update_task`, `delete_task`.
    *   **Purpose**: Encapsulate business rules and data access.

2.  **Implement Filtering Logic**:
    *   **Task**: Add logic to `get_tasks_by_user` to filter by completion status (pending/completed).
    *   **Purpose**: Support FR-010.

3.  **Implement Sorting Logic**:
    *   **Task**: Add logic to `get_tasks_by_user` to sort by title or creation date.
    *   **Purpose**: Support FR-011.

### Phase 5: API Routes Implementation

**Goal**: Expose task management functionality via RESTful API endpoints.

1.  **Define Pydantic Schemas (`app/schemas/`)**:
    *   **Task**: Create Pydantic schemas for request bodies (e.g., `TaskCreate`, `TaskUpdate`) and response bodies (e.g., `TaskRead`, `UserRead`).
    *   **Purpose**: Input/output validation and clear API contracts.

2.  **Implement Task Router (`app/routers/tasks.py`)**:
    *   **Task**: Create FastAPI router with endpoints:
        -   `POST /tasks` (FR-005)
        -   `GET /tasks` (FR-006, FR-010, FR-011)
        -   `GET /tasks/{task_id}` (FR-007)
        -   `PUT /tasks/{task_id}` (FR-008)
        -   `DELETE /tasks/{task_id}` (FR-009)
    *   **Purpose**: Map HTTP requests to business logic, handle authentication dependency.

### Phase 6: Error Handling & Validation

**Goal**: Centralize and standardize error reporting.

1.  **Centralized Exception Handling (`app/main.py`)**:
    *   **Task**: Implement custom exception handlers for common scenarios (e.g., `HTTPException`).
    *   **Purpose**: Consistent error responses.

2.  **Meaningful Error Messages**:
    *   **Task**: Ensure error messages returned are informative but do not expose sensitive internal details.
    *   **Purpose**: User-friendly and secure error feedback.

### Phase 7: Security & Best Practices

**Goal**: Reinforce security and code quality.

1.  **Review Authentication Enforcement**:
    *   **Task**: Double-check that all task routes are protected and authorization logic is sound.
    *   **Purpose**: Ensure NFR-001 is met.

2.  **Prevent Vulnerabilities**:
    *   **Task**: Review code for potential SQL injection or other vulnerabilities (e.g., using ORM correctly).
    *   **Purpose**: Ensure NFR-002 is met.

3.  **Async Operations**:
    *   **Task**: Verify `async`/`await` is used appropriately for I/O-bound operations.
    *   **Purpose**: Performance and responsiveness.

### Phase 8: Integration Verification

**Goal**: Confirm seamless frontend-backend interaction.

1.  **Manual Integration Test**:
    *   **Task**: Manually test frontend authentication flow (signup/login) with the new backend.
    *   **Task**: Manually test frontend task CRUD operations with the new backend.
    *   **Purpose**: Verify SC-001, SC-002.

2.  **Data Isolation Check**:
    *   **Task**: Verify (e.g., via manual tests with multiple users) that User A cannot access User B's tasks.
    *   **Purpose**: Verify SC-003.

### Phase 9: Final Review & Readiness

**Goal**: Prepare for hackathon submission and future development.

1.  **Code Review**:
    *   **Task**: Final review for maintainability, modularity, and adherence to Python/FastAPI best practices.
    *   **Purpose**: Ensure code quality.

2.  **Documentation Update**:
    *   **Task**: Ensure environment variables (`.env.example`) are documented and an API usage guide (e.g., simple README section) is available.
    *   **Purpose**: Ease of onboarding and deployment.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |