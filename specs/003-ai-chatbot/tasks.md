# Tasks: AI-Powered Todo Chatbot

**Input**: Design documents from `specs/003-ai-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md (decisions), data-model.md (entities), contracts/ (API endpoints), quickstart.md (test scenarios)

**Tests**: Test tasks are included as part of each user story phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify project structure adheres to plan.md
- [X] T002 Update `README.md` with setup instructions for `COHERE_API_KEY` (placeholder)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create `Conversation` and `Message` SQLModel definitions in `backend/app/models/conversation_message.py`
- [X] T004 Generate and apply Alembic migration for `Conversation` and `Message` tables in `backend/alembic/versions/`
- [X] T005 Implement Cohere client initialization and basic `generate_response` function in `backend/app/services/cohere_service.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Manage tasks via chat (Priority: P1) 🎯 MVP

**Goal**: Implement the core functionality allowing users to manage tasks via natural language through the chatbot.

**Independent Test**: Send natural language commands for task CRUD operations to the chatbot and verify that the corresponding task operations are correctly performed in the database and reflected in the existing UI.

### Tests for User Story 1

- [X] T006 [P] [US1] Write unit tests for Cohere client in `backend/tests/test_cohere_service.py`
- [X] T007 [P] [US1] Write unit tests for MCP tools in `backend/tests/test_mcp_tools.py`
- [X] T008 [P] [US1] Write unit tests for agent logic in `backend/tests/test_agent_service.py`
- [X] T009 [P] [US1] Write integration tests for chat endpoint in `backend/tests/test_main.py`
- [X] T010 [P] [US1] Write unit tests for `ChatIcon` component in `frontend/tests/components/common/test_ChatIcon.tsx`
- [X] T011 [P] [US1] Write unit tests for `ChatBot` component (initial render) in `frontend/tests/components/tasks/test_ChatBot.tsx`
- [X] T012 [P] [US1] Write integration tests for `chatApi.ts` in `frontend/tests/lib/test_chatApi.ts`

### Implementation for User Story 1

- [X] T013 [P] [US1] Implement MCP tools for task operations in `backend/app/api/deps.py`
  - `add_task(user_id, title, description)`
  - `list_tasks(user_id, status)`
  - `complete_task(user_id, task_id)`
  - `delete_task(user_id, task_id)`
  - `update_task(user_id, task_id, title, description)`
- [X] T014 [US1] Implement agent logic (intent recognition, parameter extraction, tool mapping, response generation) in `backend/app/services/agent_service.py` (depends on T013)
- [X] T015 [US1] Implement chat endpoint `POST /api/{user_id}/chat` in `backend/app/main.py` (depends on T014)
- [X] T016 [P] [US1] Create `ChatIcon.tsx` component in `frontend/src/components/common/ChatIcon.tsx`
- [X] T017 [P] [US1] Create `chatApi.ts` for backend communication in `frontend/src/lib/chatApi.ts`
- [X] T018 [US1] Create `ChatBot.tsx` component (initial structure, message input, send functionality) in `frontend/src/components/tasks/ChatBot.tsx` (depends on T017)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View conversation history (Priority: P2)

**Goal**: Implement persistence and display of conversation history within the chatbot interface.

**Independent Test**: Have a conversation with the chatbot, close and reopen the chatbot interface, and verify that the previous messages are still visible and correctly ordered.

### Tests for User Story 2

- [X] T019 [P] [US2] Write unit tests for conversation history retrieval and persistence in `backend/tests/test_main.py` (focused on new Message/Conversation models)
- [X] T020 [P] [US2] Write integration tests for displaying conversation history in `frontend/tests/components/tasks/test_ChatBot.tsx`

### Implementation for User Story 2

- [X] T021 [US2] Modify chat endpoint in `backend/app/main.py` to retrieve conversation history from DB when `conversation_id` is provided
- [X] T022 [US2] Modify chat endpoint in `backend/app/main.py` to persist user messages to `Message` table
- [X] T023 [US2] Modify chat endpoint in `backend/app/main.py` to persist AI responses to `Message` table
- [X] T024 [US2] Modify `ChatBot.tsx` to display conversation history, including message types (user/AI) and optional tool calls

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T025 Implement graceful error handling for "task not found", ambiguous commands, and off-topic queries ("I'm sorry, I can only help with your to-do list.") in `backend/app/services/agent_service.py`
- [X] T026 Update `README.md` with comprehensive Cohere setup instructions and chatbot usage guide
- [X] T027 Conduct general code cleanup, formatting, and minor refactoring across `backend/` and `frontend/`
- [X] T028 Perform end-to-end integration testing for the entire chatbot feature, covering all user stories and edge cases

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1's core chat functionality.

### Within Each User Story

- Tests MUST be written and FAIL before implementation.
- Models (if new) before services.
- Services before endpoints.
- Core implementation before integration.
- Story complete before moving to next priority.

### Parallel Opportunities

- All Setup tasks (Phase 1) can run in parallel.
- All Foundational tasks (Phase 2) can run in parallel.
- Tests within each user story marked `[P]` can run in parallel.
- Frontend and Backend implementation tasks within a user story can run in parallel (e.g., T013-T015 vs T016-T018).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Backend)
   - Developer B: User Story 1 (Frontend)
   - Developer C: User Story 2 (Backend)
   - Developer D: User Story 2 (Frontend)
3. Stories complete and integrate independently

---

## Notes

- `[P]` tasks = different files, no dependencies
- `[Story]` label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
