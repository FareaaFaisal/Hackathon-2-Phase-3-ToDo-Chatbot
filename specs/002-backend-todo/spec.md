# Feature Specification: Backend Implementation for Multi-User Todo Full-Stack Web Application

**Feature Branch**: `002-backend-todo`
**Created**: 2026-01-29
**Status**: Draft
**Input**: User description: "Project Phase: Backend Implementation for Multi-User Todo Full-Stack Web Application Scope: - Focus exclusively on backend implementation. - Frontend UI, components, layouts, and styling MUST NOT be modified in any way. - Backend must integrate seamlessly with the already implemented frontend. - Authentication will be handled using Better Auth. - Database will be PostgreSQL (Neon). Purpose: - Build a secure, scalable, production-ready backend that supports authentication and task management. - Integrate authentication and authorization cleanly with the existing frontend. - Ensure all APIs align with frontend expectations without UI changes. Authentication Requirements: - Use Better Auth for authentication and session management. - JWT tokens are issued by Better Auth. - Backend must verify JWT tokens on protected routes. - Authorization middleware must ensure: - Only authenticated users can access task APIs. - Users can only access and modify their own tasks. - Use BETTER_AUTH_SECRET and BETTER_AUTH_URL from environment variables. - Token verification must follow Better Auth recommended patterns. Database Requirements: - Use PostgreSQL via Neon. - Connection string provided via NEON_DATABASE_URL environment variable. - Use a clean schema design with proper relations and constraints. Minimum database tables: - users - id (primary key) - email (unique) - created_at - tasks - id (primary key) - user_id (foreign key → users.id) - title - description (optional) - completed (boolean) - created_at - updated_at Task API Requirements: - Create task - Read all tasks for authenticated user - Update task (title, description, completed) - Delete task - Toggle task completion - Filtering (pending, completed) - Sorting (title, created date) Technical Requirements: - Backend framework: FastAPI (Python) - Use SQLModel or SQLAlchemy ORM - Pydantic schemas for request/response validation - Proper separation of concerns: - routers/ - services/ - models/ - schemas/ - core (config, auth, database) - JWT verification middleware dependency - Async database operations where applicable - Centralized error handling with clear HTTP status codes - CORS configured to allow frontend origin only Environment Configuration: - Load environment variables from `.env` - Required variables: - BETTER_AUTH_SECRET - BETTER_AUTH_URL - NEON_DATABASE_URL Integration Constraints: - Do NOT modify frontend code, UI, or components. - API routes must match frontend expectations. - Response formats must be predictable and frontend-friendly. - No breaking changes to frontend authentication or task flows. Security Requirements: - All task routes must be protected. - Validate ownership of resources (user can only access own tasks). - Prevent common vulnerabilities (SQL injection, improper access). - No sensitive data exposed in responses. Deliverables: - Fully working backend with: - Auth verification - Task CRUD APIs - Database models and migrations - Clear project structure - Ready-to-run FastAPI server - Backend ready for immediate frontend integration Success Criteria: - Frontend works without any UI change. - Authenticated users can manage only their own tasks. - Backend runs successfully with provided environment variables. - Clean, maintainable, and hackathon-ready codebase. Agent Instructions: - Focus strictly on backend logic and APIs. - Assume frontend is already complete and correct. - Do not redesign or refactor UI assumptions. - Ask for clarification only if an API contract is ambiguous."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Authentication (Priority: P1)

As a user, I want to securely register and log in to the application, so that I can access my personalized task list.

**Why this priority**: Core security and entry point to the application.

**Independent Test**: API endpoints for registration and login can be tested independently. Verification of JWT issuance and basic token validity.

**Acceptance Scenarios**:

1.  **Given** valid registration credentials, **When** a user registers, **Then** a new user account is created, and a JWT is issued.
2.  **Given** valid login credentials, **When** a user logs in, **Then** a valid JWT is returned.
3.  **Given** invalid login credentials, **When** a user attempts to log in, **Then** an appropriate error response (e.g., 401 Unauthorized) is returned.
4.  **Given** a request to a protected endpoint without a valid JWT, **When** the request is made, **Then** an appropriate error response (e.g., 401 Unauthorized) is returned.

---

### User Story 2 - Task Management (Priority: P1)

As an authenticated user, I want to create, read, update, and delete only my own tasks, so that I can manage my to-do list effectively and securely.

**Why this priority**: Core functionality of the Todo application.

**Independent Test**: CRUD operations for tasks can be tested via API endpoints for a single authenticated user. Data ownership enforcement needs to be verified by attempting to access other users' tasks.

**Acceptance Scenarios**:

1.  **Given** an authenticated user, **When** they create a task with a title and optional description, **Then** the task is created and associated with their user ID.
2.  **Given** an authenticated user, **When** they request their tasks, **Then** only tasks owned by that user are returned.
3.  **Given** an authenticated user and an existing task they own, **When** they update its title, description, or completion status, **Then** the task is updated.
4.  **Given** an authenticated user and an existing task they own, **When** they delete it, **Then** the task is removed.
5.  **Given** an authenticated user, **When** they attempt to access, modify, or delete a task not owned by them, **Then** an appropriate error response (e.g., 403 Forbidden or 404 Not Found) is returned.

---

### User Story 3 - Task Filtering and Sorting (Priority: P2)

As an authenticated user, I want to filter my tasks by completion status and sort them by title or creation date, so that I can easily organize and find specific tasks.

**Why this priority**: Enhances usability for task management.

**Independent Test**: API endpoints for fetching tasks can be tested with different filter and sort parameters to ensure correct results.

**Acceptance Scenarios**:

1.  **Given** an authenticated user with multiple tasks of varying completion statuses, **When** they request tasks filtered by 'pending', **Then** only incomplete tasks owned by that user are returned.
2.  **Given** an authenticated user with multiple tasks, **When** they request tasks sorted by 'title' in ascending order, **Then** tasks owned by that user are returned sorted alphabetically by title.
3.  **Given** an authenticated user with multiple tasks, **When** they request tasks sorted by 'created date' in descending order, **Then** tasks owned by that user are returned sorted by creation date from newest to oldest.

---

### Edge Cases

-   **API Errors**: The API MUST return consistent and informative error messages (e.g., 400 Bad Request for invalid input, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity for validation errors).
-   **Empty Task List**: When an authenticated user has no tasks, the API should return an empty list without error.
-   **Invalid JWT**: Requests with invalid, expired, or malformed JWTs MUST result in a 401 Unauthorized response.
-   **Database Connection Issues**: The backend should gracefully handle database connection failures and return appropriate 5xx errors.

## Requirements *(mandatory)*

### Functional Requirements

-   **FR-001**: The backend MUST provide an API endpoint for user registration (`POST /auth/signup`).
-   **FR-002**: The backend MUST provide an API endpoint for user login (`POST /auth/login`).
-   **FR-003**: The backend MUST issue JWT tokens upon successful user registration and login.
-   **FR-004**: The backend MUST implement JWT verification middleware for protected routes.
-   **FR-005**: The backend MUST provide an API endpoint to create new tasks (`POST /tasks`).
-   **FR-006**: The backend MUST provide an API endpoint to retrieve all tasks for the authenticated user (`GET /tasks`).
-   **FR-007**: The backend MUST provide an API endpoint to retrieve a specific task by ID for the authenticated user (`GET /tasks/{task_id}`).
-   **FR-008**: The backend MUST provide an API endpoint to update an existing task for the authenticated user (`PUT /tasks/{task_id}`).
-   **FR-009**: The backend MUST provide an API endpoint to delete an existing task for the authenticated user (`DELETE /tasks/{task_id}`).
-   **FR-010**: The backend MUST allow filtering tasks by completion status (`GET /tasks?status=`).
-   **FR-011**: The backend MUST allow sorting tasks by title or creation date (`GET /tasks?sort_by=&order=`).
-   **FR-012**: All task management API endpoints MUST enforce data ownership, ensuring a user can only interact with their own tasks.
-   **FR-013**: The backend MUST use PostgreSQL as its database.
-   **FR-014**: The backend MUST load configuration from environment variables (`.env`).
-   **FR-015**: The backend MUST configure CORS to allow requests from the frontend origin.

### Non-Functional Requirements

-   **NFR-001 (Security)**: All API endpoints for task management and authentication MUST be protected against unauthorized access.
-   **NFR-002 (Security)**: The backend MUST prevent SQL injection and other common web vulnerabilities.
-   **NFR-003 (Reliability)**: The backend MUST handle and return consistent HTTP status codes and error messages for all API operations.
-   **NFR-004 (Performance)**: API response times should be optimized for efficient interaction with the frontend. (Specific metrics deferred to planning).

### Key Entities

-   **User**: Represents an authenticated user in the system.
    -   Attributes: `id` (primary key), `email` (unique), `created_at`.
-   **Task**: Represents a to-do item owned by a user.
    -   Attributes: `id` (primary key), `user_id` (foreign key → User.id), `title`, `description` (optional), `completed` (boolean), `created_at`, `updated_at`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

-   **SC-001**: Frontend login and signup flows successfully communicate with the backend and receive/verify JWTs.
-   **SC-002**: Authenticated users can successfully perform all CRUD operations on their own tasks via the API.
-   **SC-003**: Attempts by users to access or modify other users' tasks result in a 403 Forbidden or 404 Not Found error.
-   **SC-004**: Task filtering and sorting API parameters function correctly and return the expected results.
-   **SC-005**: The FastAPI application starts and runs successfully with the specified environment variables (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEON_DATABASE_URL`).
-   **SC-006**: The database schema is correctly applied and accessible by the backend.
