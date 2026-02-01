# Implementation Plan: AI-Powered Todo Chatbot

**Branch**: `003-ai-chatbot` | **Date**: 2026-01-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-ai-chatbot/spec.md`

## Summary

This plan outlines the implementation of a stateless, AI-powered Todo Chatbot. The chatbot will be integrated into the existing Phase-2 full-stack application, allowing users to manage their tasks via natural language. The implementation will use the Cohere API for language understanding, a FastAPI backend with an MCP server, and a React/Next.js frontend with ChatKit, without modifying any existing functionality.

## Technical Context

**Language/Version**: Python 3.11 (backend), TypeScript (frontend)
**Primary Dependencies**: FastAPI, SQLModel, Cohere SDK (backend), React, Next.js, ChatKit (frontend)
**Storage**: Neon Serverless PostgreSQL
**Testing**: Pytest (backend), Jest & React Testing Library (frontend)
**Target Platform**: Web
**Project Type**: Web application
**Constraints**: Must remain stateless, must not modify existing Phase-2 code, must use Cohere API.

## Constitution Check

*GATE: All principles must be adhered to.*

- ✅ **Immutability of Existing Features**: The plan introduces the chatbot as an isolated feature, leaving all Phase-2 code untouched.
- ✅ **Tool-Based AI Integration**: The plan mandates the use of an MCP server with clearly defined tools (`add_task`, `list_tasks`, etc.) for all AI-to-backend interactions.
- ✅ **User-Centric AI Interaction**: The plan includes requirements for friendly, confirmatory responses and graceful error handling.
- ✅ **Automation-Driven Development**: The plan is explicitly designed to be executed by automated tools ("Claude Code + Spec-Kit Plus").
- ✅ **Specification-First Development**: This plan is derived directly from a validated feature specification.
- ✅ **Security by Default**: All interactions are scoped by `user_id`, and existing authentication mechanisms will be leveraged.

## Project Structure

### Documentation (this feature)

```text
specs/003-ai-chatbot/
├── plan.md              # This file
├── research.md          # Research on Cohere API and ChatKit integration
├── data-model.md        # Data models for Conversation and Message
├── quickstart.md        # Instructions for setting up COHERE_API_KEY
├── contracts/           # OpenAPI spec for the chat endpoint
│   └── openapi.yaml
└── tasks.md             # Detailed implementation tasks (to be generated)
```

### Source Code (repository root)

This feature follows the existing frontend/backend structure.

```text
backend/
├── app/
│   ├── main.py          # Add chat endpoint
│   ├── agents.py        # Agent logic with Cohere integration
│   ├── mcp_tools.py     # MCP tool definitions
│   └── utils.py         # Cohere client setup
└── tests/
    └── test_chat.py     # Tests for the chat endpoint and agent logic

frontend/
├── src/
│   ├── components/
│   │   ├── ChatBot.tsx    # The main chat component
│   │   └── ChatIcon.tsx   # The icon to open the chat
│   └── lib/
│       └── chatApi.ts   # Functions to call the backend chat API
└── tests/
    └── chat.test.tsx    # Tests for the chat components
```

**Structure Decision**: The project will follow the established `backend`/`frontend` monorepo structure to maintain consistency. New files will be added to implement the chatbot feature without modifying existing files and components, adhering to the immutability principle.

## Complexity Tracking

No constitutional violations identified.