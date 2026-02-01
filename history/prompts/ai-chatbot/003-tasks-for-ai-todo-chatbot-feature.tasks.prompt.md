---
id: 003
title: Tasks for AI Todo Chatbot Feature
stage: tasks
date: 2026-01-30
surface: agent
model: gemini-cli
feature: ai-chatbot
branch: 003-ai-chatbot
user: {{USER}}
command: /sp.tasks
labels: [tasks, ai, chatbot]
links:
  spec: specs/003-ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-ai-chatbot/tasks.md
tests:
  (none)
---

## Prompt
/sp.plan
You are an AI software project planner. Your task is to **generate a detailed Phase-3 plan** for a Todo AI Chatbot that extends an existing Phase-2 full-stack Todo app (React/Next.js frontend + FastAPI + SQLModel + Neon PostgreSQL backend) **without modifying Phase-2 functionality**.  

Use this plan to guide **Claude Code + Spec-Kit Plus** automated code generation. Break the project into **specific tasks**, **agents**, **skills**, and **MCP tool mappings**. Include backend, frontend, and integration steps.

---

### 1. Backend Tasks (FastAPI + MCP + Cohere)

**Task 1.1: Setup Cohere Client**
- File: `/backend/utils.py`
- Description: Initialize Cohere client using `COHERE_API_KEY` from `.env`.
- Function: `generate_response(prompt: str) -> str`
- Notes: This replaces Gemini/OpenAI SDK calls.

**Task 1.2: Define MCP Tools**
- File: `/backend/mcp_tools.py`
- Tools:
  - `add_task(user_id, title, description)`
  - `list_tasks(user_id, status)`
  - `complete_task(user_id, task_id)`
  - `delete_task(user_id, task_id)`
  - `update_task(user_id, task_id, title, description)`
- Notes: Each tool interacts with existing Phase-2 task database.

**Task 1.3: Create Agent Logic**
- File: `/backend/agents.py`
- Responsibilities:
  - Receive user message + conversation history.
  - Use Cohere API for **intent recognition and parameter extraction**.
  - Map natural language to MCP tool calls.
  - Generate friendly responses confirming actions.
  - Handle errors (task not found, invalid input).
- Agent must be stateless; conversation state is saved in DB.

**Task 1.4: Create Chat Endpoint**
- File: `/backend/main.py`
- Endpoint: `POST /api/{user_id}/chat`
- Flow:
  1. Accept `conversation_id` (optional) and `message`.
  2. Fetch conversation history from DB.
  3. Store user message in `Message` table.
  4. Run agent with Cohere integration.
  5. Agent invokes MCP tools as needed.
  6. Store assistant response in DB.
  7. Return `{ conversation_id, response, tool_calls }`.
- Notes: Endpoint is stateless, database holds all state.

---

### 2. Frontend Tasks (React/Next.js + ChatKit)

**Task 2.1: Add Chatbot Icon**
- File: `/frontend/ChatIcon.tsx`
- Description: Floating icon/button that opens chatbot panel on click.
- Notes: Keep existing Phase-2 UI intact.

**Task 2.2: Build Chat Component**
- File: `/frontend/ChatBot.tsx`
- Features:
  - Input box for messages.
  - Display AI responses in animated chat bubbles.
  - Maintain `conversation_id` per user session.
  - Send messages to `/api/{user_id}/chat`.
- Notes: Integrate with existing frontend; isolated component.

**Task 2.3: Create API Integration**
- File: `/frontend/chatApi.ts`
- Functions:
  - `sendMessage(userId: string, message: string, conversationId?: number)`
  - Handles HTTP POST to backend chat endpoint.
  - Returns `{ conversation_id, response, tool_calls }`.

---

### 3. Integration Tasks

**Task 3.1: Backend → Frontend Integration**
- Ensure frontend chat component communicates with backend chat endpoint.
- Map Cohere agent outputs to display messages and tool calls.
- Persist conversation context in DB but server remains stateless.

**Task 3.2: MCP Tool Mapping**
- Map natural language intents to MCP tools:
  - Add Task → `add_task`
  - List Tasks → `list_tasks` with `status` filter
  - Complete Task → `complete_task`
  - Delete Task → `delete_task`
  - Update Task → `update_task`

**Task 3.3: Friendly Response & Error Handling**
- All AI responses must confirm action.
- Handle errors gracefully (task not found, invalid input).
- Example: “Task 'Buy groceries' added successfully ✅”
- Example: “Task with ID 5 not found ❌”

---

### 4. Agent and Skill Definitions

**Agent Name:** `TodoAgent`
- Description: Manages todo tasks via natural language using Cohere API and MCP tools.
- Inputs: User message, conversation history, user_id
- Outputs: Response text, tool_calls
- Skills:
  - Intent Recognition (Add, List, Complete, Delete, Update)
  - Parameter Extraction (task_id, title, description)
  - MCP Tool Execution
  - Response Generation

**Skill: IntentParser**
- Description: Use Cohere embeddings + generation to determine user intent.

**Skill: ToolMapper**
- Description: Map parsed intent to appropriate MCP tool call.

**Skill: ResponseGenerator**
- Description: Generate friendly confirmation messages using Cohere.

---

### 5. Deliverables

- `/backend` folder:
  - `main.py`, `agents.py`, `mcp_tools.py`, `utils.py`, `models.py`
- `/frontend` folder:
  - `ChatBot.tsx`, `ChatIcon.tsx`, `chatApi.ts`
- `.env` with `COHERE_API_KEY`
- Database schema remains same (`Task`, `Conversation`, `Message`)
- Fully integrated, stateless, AI-powered Todo chatbot
- README update with Cohere setup instructions
- All tasks ready for **Claude Code + Spec-Kit Plus automated generation**

## Response snapshot

I have generated a detailed, dependency-ordered `tasks.md` file for the AI-Powered Todo Chatbot feature, located at `specs/003-ai-chatbot/tasks.md`. The tasks are organized into Setup, Foundational, User Story 1 (Manage tasks via chat), User Story 2 (View conversation history), and Polish phases, following a strict checklist format.

## Outcome

- ✅ Impact: A comprehensive list of actionable, dependency-ordered tasks for the AI Todo Chatbot feature has been created.
- 🧪 Tests: Task descriptions include test tasks for each phase.
- 📁 Files: 1 created
- 🔁 Next prompts: /sp.implement to begin the implementation in phases.
- 🧠 Reflection: The task generation process successfully translated the plan into granular, immediately executable tasks while adhering to strict formatting requirements. The manual handling of PowerShell script failures earlier in the workflow allowed for successful completion of this step.

## Evaluation notes (flywheel)

- Failure modes observed: None in this step, but earlier PowerShell script failures necessitated manual intervention.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment: Focus on fixing the PowerShell script parameter parsing issue to improve automation reliability.
