<!--
    Sync Impact Report
    - Version change: 2.0.0 -> 3.0.0
    - Modified principles: All principles updated for Phase-3.
    - Added sections:
        - Principle: Immutability of Existing Features
        - Principle: Tool-Based AI Integration
        - Principle: User-Centric AI Interaction
        - Principle: Automation-Driven Development
    - Removed sections:
        - All Phase-2 principles have been redefined for Phase-3.
    - Templates requiring updates:
        - ⚠ pending: README.md (to add Phase-3 features, Cohere setup)
        - ✅ updated: .specify/memory/constitution.md
    - Follow-up TODOs: None
-->
# Phase III – AI-Powered Todo Chatbot Constitution

**Version**: 3.0.0
**Ratification Date**: 2026-01-30
**Last Amended**: 2026-01-30

## Core Principles

### Immutability of Existing Features
**Description**: All existing Phase-2 functionality, including frontend and backend, must remain unmodified and fully functional.
**Rationale**: To ensure stability and prevent breaking changes to the established application while extending its capabilities. The new AI chatbot feature will be implemented as a separate, isolated component.

### Tool-Based AI Integration
**Description**: The AI chatbot must interact with the application's backend services exclusively through a well-defined MCP (Machine-Orchestrated Process) server. Agents will use these tools (e.g., `add_task`, `list_tasks`) to perform actions.
**Rationale**: This decouples the AI from the core application logic, allowing for independent development and easier maintenance. It provides a secure and structured way for the AI to interact with the system.

### User-Centric AI Interaction
**Description**: The AI chatbot must provide a friendly and reliable user experience. This includes confirming successful operations, handling errors gracefully (e.g., "task not found"), and maintaining a natural conversational flow.
**Rationale**: To build user trust and ensure the chatbot is a helpful and intuitive extension of the application's functionality.

### Automation-Driven Development
**Description**: All agent and skill logic must be generated automatically using Claude Code and Spec-Kit Plus. Manual coding of agent logic is prohibited.
**Rationale**: To accelerate development, reduce human error, and ensure that all generated components conform to the project's specifications and standards.

### Specification-First Development
**Description**: All implementation must be driven strictly by written specifications.
**Rationale**: Specs under `/specs` are authoritative over assumptions or improvisation.

### Security by Default
**Description**: Authentication, authorization, and user data isolation are mandatory for all features, including AI interactions.
**Rationale**: To protect user data and ensure system integrity.

## Key Standards

- **Technology Stack Compliance:**
  - **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS
  - **Backend**: FastAPI (Python)
  - **ORM**: SQLModel
  - **Database**: Neon Serverless PostgreSQL
  - **Authentication**: Better Auth with JWT
  - **AI Chatbot**:
    - **Language Model**: Cohere API
    - **Frontend Component**: ChatKit
    - **Agent Logic**: OpenAI Agents SDK patterns, implemented via Cohere
- **API Design:**
  - RESTful conventions for all non-chat endpoints.
  - Chat endpoint at `POST /api/{user_id}/chat`.
- **Authentication & Authorization:**
  - All API endpoints require a valid JWT token.
  - Task ownership must be enforced on every operation, whether initiated by a user or an AI agent.
- **Data Integrity:**
  - Tasks must always be associated with a `user_id`.
  - Conversation history (`Conversation`, `Message` tables) must be maintained for the chatbot.

## Constraints

- **Stateless Backend, Persistent Conversations**:
  - Backend services, particularly the chat endpoint, must be stateless.
  - All conversation history and context must be persisted in the database.
- **Environment Configuration**:
  - Shared secrets (JWT, Cohere API Key) must be provided via `.env` files.
  - No hard-coded secrets are allowed.
- **Scope Limitation**:
  - Phase-3 scope is limited to the AI Todo Chatbot and its integration.
  - Existing Phase-2 CRUD components must not be modified.
- **Repository Structure**:
  - Monorepo structure must be preserved.
  - Specs must remain organized per Spec-Kit conventions.

## Operational Rules for Agents

- Agents must operate only within their defined responsibility scope.
- Agents must read relevant `CLAUDE.md` and `GEMINI.md` files before acting.
- Agents must reference specs explicitly when implementing features.
- All agent logic must be generated via Spec-Kit Plus and Claude Code.

## Validation & Testing Requirements

- All Phase-2 functionality must continue to work without modification.
- The AI chatbot must be able to create, list, complete, delete, and update tasks via natural language.
- The chatbot must maintain conversation context across multiple messages.
- All endpoints must return 401 for missing or invalid JWT tokens.
- Users must never access or modify other users’ tasks, either directly or through the chatbot.

## Success Criteria

- All Phase-3 features are implemented exactly as specified.
- The AI can create, list, complete, delete, and update tasks via natural language commands.
- The chatbot maintains conversation context and provides friendly, confirmatory responses.
- Full JWT-secured, multi-user task isolation is verified for both UI and chatbot interactions.
- All agent and MCP tool logic is fully automated via Spec-Kit Plus.
