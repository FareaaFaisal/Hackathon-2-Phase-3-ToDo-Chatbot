---
id: 001
title: AI Todo Chatbot Feature Specification
stage: spec
date: 2026-01-30
surface: agent
model: gemini-cli
feature: ai-chatbot
branch: 003-ai-chatbot
user: {{USER}}
command: /sp.specify
labels: [spec, ai, chatbot]
links:
  spec: specs/003-ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-ai-chatbot/spec.md
  - specs/003-ai-chatbot/checklists/requirements.md
tests:
  (none)
---

## Prompt
/sp.specify
You are a software code generation AI. Your task is to generate a **complete Phase-3 Todo AI Chatbot** that extends an existing Phase-2 full-stack Todo app (React/Next.js frontend + FastAPI + SQLModel + Neon PostgreSQL backend) **without breaking any existing functionality**. All output must be **ready-to-use code** in the appropriate folders: - `/backend` → FastAPI endpoints, MCP server, agents, and Cohere integration - `/frontend` → ChatKit-based UI component, chatbot icon, integration with backend Use the following guidelines: 1. **Backend – FastAPI + MCP + Cohere integration**: - Replace any OpenAI/Gemini SDK code with **Cohere API** calls. - Chat endpoint: `POST /api/{user_id}/chat` - Accepts: `conversation_id` (optional), `message` (string) - Returns: `{ conversation_id, response, tool_calls }` - Stateless server: conversation state stored in database tables (`Conversation`, `Message`), no in-memory state. - MCP tools for task operations: `add_task`, `list_tasks`, `complete_task`, `delete_task`, `update_task` (reuse Phase-2 database models). - Agent logic: - Parse natural language messages. - Decide which MCP tool to call. - Handle parameters extraction (task_id, title, description). - Generate a friendly, confirmatory response. - Cohere integration: - Use **text generation / embedding APIs** to understand intent and generate messages. - Cohere API key in `.env` as `COHERE_API_KEY`. - Example: replace Gemini/OpenAI async client code with Cohere generation logic. 2. **Frontend – Chat UI**: - Add **chatbot icon** on UI, click opens chat panel. - Input box for user messages. - Show AI responses in animated chat bubbles. - Send messages to `/api/{user_id}/chat` endpoint and display responses. - Maintain conversation_id per user session. 3. **Integration**: - Chatbot frontend communicates with backend seamlessly. - MCP tools call Phase-2 CRUD endpoints to manipulate tasks. - Confirm each action in chat with a friendly response. - Gracefully handle errors (task not found, invalid input, etc.). - Store conversation messages in `Message` table. 4. **Code Organization**: - Backend files inside `/backend` folder: - `main.py` → FastAPI server + chat endpoint - `mcp_tools.py` → MCP tools for task operations - `agents.py` → Cohere-powered AI agent logic - `models.py` → reuse Phase-2 SQLModel DB models - `utils.py` → helper functions (Cohere client, message parsing) - Frontend files inside `/frontend` folder: - `ChatBot.tsx` → chat component - `ChatIcon.tsx` → clickable icon - `chatApi.ts` → API integration with backend - `.env` → include `COHERE_API_KEY` 5. **Constraints & Requirements**: - Do not modify existing Phase-2 task UI or backend CRUD endpoints. - Chatbot must be fully integrated but isolated as a separate component. - Server must remain stateless; database is source of truth. - Agent logic should be generated using **Claude Code and Spec-Kit Plus**, no manual coding. - Cohere replaces OpenAI/Gemini SDK completely. 6. **Example Cohere integration snippet** (for your reference, replace Gemini code): ```python import cohere import os from dotenv import load_dotenv load_dotenv() cohere_api_key = os.getenv("COHERE_API_KEY") if not cohere_api_key: raise ValueError("COHERE_API_KEY is not set") co = cohere.Client(cohere_api_key) def generate_response(prompt: str) -> str: response = co.generate( model='xlarge', prompt=prompt, max_tokens=150, temperature=0.7 ) return response.generations[0].text Deliverables: Fully working backend in /backend with chat endpoint, MCP tools, Cohere agents. Fully working frontend in /frontend with chatbot UI and integration. Database persists conversation history and tasks. README update explaining Cohere setup and chat usage. All code ready for automated generation using Spec-Kit Plus + Claude Code. Your task: generate the complete backend and frontend code for Phase-3 chatbot integrated with Phase-2 app, replacing Gemini/OpenAI SDK with Cohere API and following the above architecture and specifications. 

## Response snapshot

I have created the feature specification for the AI-Powered Todo Chatbot, located at `specs/003-ai-chatbot/spec.md`. The spec abstracts the detailed implementation requirements into user stories, functional requirements, key entities, and success criteria. I also clarified the behavior for handling off-topic queries with the user, which has been resolved to 'Strict Limitation'. The `specs/003-ai-chatbot/checklists/requirements.md` has been updated to reflect the completion of the specification.

## Outcome

- ✅ Impact: A detailed and validated specification for the AI Todo Chatbot feature has been created.
- 🧪 Tests: Not applicable for specification creation.
- 📁 Files: 2 created
- 🔁 Next prompts: /sp.plan to initiate the technical planning based on this specification.
- 🧠 Reflection: The process successfully abstracted a highly detailed implementation prompt into a structured, technology-agnostic specification. The clarification mechanism worked to resolve an important UX decision. The PowerShell script for feature creation had a minor issue but the core functionality (branch and spec file creation) was successful.

## Evaluation notes (flywheel)

- Failure modes observed: PowerShell script issue (`create-new-feature.ps1`) leading to manual PHR creation.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment: Investigate and fix the `create-new-feature.ps1` script issue for future use.
