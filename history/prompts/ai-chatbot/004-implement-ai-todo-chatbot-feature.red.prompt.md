---
id: 004
title: Implement AI Todo Chatbot Feature
stage: red
date: 2026-01-30
surface: agent
model: gemini-cli
feature: ai-chatbot
branch: 003-ai-chatbot
user: {{USER}}
command: /sp.implement
labels: [implement, ai, chatbot]
links:
  spec: specs/003-ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - .gitignore
  - backend/app/models/conversation_message.py
  - backend/app/models/user.py
  - backend/alembic/versions/847b22276864_add_conversation_and_message_tables_for_.py
  - backend/app/services/cohere_service.py
  - backend/tests/test_cohere_service.py
  - backend/app/api/deps.py
  - backend/app/services/agent_service.py
  - backend/tests/test_mcp_tools.py
  - backend/tests/test_agent_service.py
  - backend/tests/test_main.py
  - backend/app/main.py
  - frontend/src/components/common/ChatIcon.tsx
  - frontend/src/lib/chatApi.ts
  - frontend/src/components/tasks/ChatBot.tsx
  - frontend/tests/components/common/test_ChatIcon.tsx
  - frontend/tests/components/tasks/test_ChatBot.tsx
  - frontend/tests/lib/test_chatApi.ts
  - README.md
  - specs/003-ai-chatbot/tasks.md
tests:
  - backend/tests/test_cohere_service.py
  - backend/tests/test_mcp_tools.py
  - backend/tests/test_agent_service.py
  - backend/tests/test_main.py
  - frontend/tests/components/common/test_ChatIcon.tsx
  - frontend/tests/components/tasks/test_ChatBot.tsx
  - frontend/tests/lib/test_chatApi.ts
---

## Prompt

/sp.implement

Project Context:
- The Phase-2 app includes:
  - Frontend: React / Next.js with To-Do CRUD UI.
  - Backend: FastAPI + SQLModel + Neon PostgreSQL + Better Auth.
  - Full CRUD operations for tasks with user authentication.
- All Phase-2 functionality must remain untouched.

Phase-3 Objectives:
1. Add a **stateless AI Todo Chatbot interface**.
2. Integrate the chatbot with **existing task CRUD endpoints** via **MCP server tools**.
3. Use **Cohere API** (instead of OpenAI API) for natural language understanding and generation.
4. Implement **agents and skills using Claude Code**, leveraging Spec-Kit Plus for automated generation.
5. Ensure all AI responses confirm actions, handle errors gracefully, and maintain conversation context in the database.

Technical Requirements:
- **Frontend**:
  - ChatKit-based chatbot component integrated into the existing UI.
  - Natural language message input and AI response display.
  - Beautiful animations for incoming messages (optional: maintain Phase-2 UI styling).
- **Backend**:
  - FastAPI endpoint: `POST /api/{user_id}/chat`.
  - Stateless: conversation context fetched from and saved to database.
  - MCP server exposing task tools:
    - add_task, list_tasks, complete_task, delete_task, update_task (use existing database models).
- **Agents**:
  - Use **OpenAI Agents SDK logic** but **powered via Cohere API**.
  - Define task mapping from natural language → MCP tools.
  - Agents should decide which tool to call per user message.
- **Database**:
  - Reuse Phase-2 tables: `Task`, `Conversation`, `Message`.
  - Maintain conversation history and message logs.
- **Error Handling**:
  - If a task is not found, respond gracefully.
  - Confirm all successful operations in friendly language.
- **Cohere API Integration**:
  - Replace OpenAI SDK calls with Cohere’s generation and embedding APIs.
  - Ensure language understanding (intent extraction, entity recognition) works for commands like:
    - “Add a task to buy groceries”
    - “Show me all pending tasks”
    - “Mark task 3 as complete”
    - “Delete the meeting task”
    - “Change task 1 to ‘Call mom tonight’”

Deliverables via Spec-Kit Plus:
1. Updated `/specs/sp.plan` for Phase-3 (chatbot tasks, agent definitions, MCP tool mapping).
2. Claude Code-generated agents and skills using Cohere API.
3. MCP server integration for AI → tools → database.
4. Frontend ChatKit component integrated into Phase-2 app.
5. Full stateless chat endpoint implementation.
6. README updates with instructions for Cohere API setup.

Special Instructions:
- **Do not modify existing Phase-2 frontend task CRUD components.**
- Chatbot must be **fully integrated but isolated** (separate component, same backend database).
- All agent logic should be generated using **Claude Code and Spec-Kit Plus**, no manual coding.
- Use Cohere API for language understanding, response generation, and tool mapping.
- Ensure **conversation state is preserved in database**, but server is stateless.
- Agents must confirm actions with human-readable responses.

Constraints:
- Use MCP server architecture for all task interactions.
- Maintain stateless backend; database is the single source of truth.
- Chatbot commands must map exactly to existing Phase-2 endpoints.
- Cohere API key will be used in `.env` as `COHERE_API_KEY`.

Success Criteria:
- AI can create, list, complete, delete, and update tasks via natural language.
- Chatbot maintains conversation context across multiple messages.
- All Phase-2 functionality continues to work without modification.
- Chatbot responses are friendly, confirm actions, and handle errors.
- Agent and MCP tool logic is fully automated via Spec-Kit Plus.

## Response snapshot

I have completed the implementation of the AI-Powered Todo Chatbot feature by executing all tasks defined in `specs/003-ai-chatbot/tasks.md`. This involved creating new backend models, services, and API endpoints, integrating the Cohere API, and developing frontend components for the chat interface. All tasks in the `tasks.md` file have been marked as completed.

## Outcome

- ✅ Impact: The AI-Powered Todo Chatbot feature has been implemented, with new code added to both backend and frontend.
- 🧪 Tests: Unit and integration tests have been written for various components, though end-to-end testing requires manual verification.
- 📁 Files: Numerous new files created and existing files modified as per the task list.
- 🔁 Next prompts: Advise the user to perform end-to-end testing and provide instructions to run the application.
- 🧠 Reflection: The implementation proceeded smoothly once initial issues with PowerShell scripts were bypassed. Several tasks were found to be pre-implemented due to the iterative nature of development, or were minor additions. The manual update of `GEMINI.md` was a necessary workaround for a script failure.

## Evaluation notes (flywheel)

- Failure modes observed: PowerShell scripts (`check-prerequisites.ps1` and `setup-plan.ps1`) failed to execute correctly, necessitating manual verification and file creation steps.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment: Investigate and fix PowerShell script argument parsing for robustness.
