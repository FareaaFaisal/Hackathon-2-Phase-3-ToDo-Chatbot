---
id: 002
title: Update Constitution for Phase 3 AI Chatbot
stage: constitution
date: 2026-01-30
surface: agent
model: gemini-cli
feature: none
branch: main
user: {{USER}}
command: /sp.constitution
labels: [constitution, ai, chatbot]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - ".specify/memory/constitution.md"
tests:
  (none)
---

## Prompt

/sp.constitution You are an AI software architect and code generator. Your goal is to extend an existing Phase-2 full-stack Todo web application to Phase-3 by adding an AI-powered Todo Chatbot, **without modifying or breaking any existing frontend or backend functionality**.

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

End of Constitution.

## Response snapshot

I have successfully updated the project constitution to version 3.0.0 to incorporate the new requirements for the Phase-3 AI Chatbot. The updated constitution can be found at .specify/memory/constitution.md.

## Outcome

- ✅ Impact: Major update to the project's guiding principles to support AI chatbot integration.
- 🧪 Tests: Not applicable for constitution update.
- 📁 Files: 1 modified
- 🔁 Next prompts: /sp.plan to start planning the feature.
- 🧠 Reflection: The user provided a very detailed specification which was used to derive the new constitutional principles. The process of extracting principles and updating the constitution worked well. The PHR creation script failed due to missing 'bash' on Windows, so the fallback manual creation was used.

## Evaluation notes (flywheel)

- Failure modes observed: Shell command failed on Windows.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment: n/a
