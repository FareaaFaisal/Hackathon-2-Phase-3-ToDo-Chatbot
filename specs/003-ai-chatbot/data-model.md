# Data Model: AI-Powered Todo Chatbot

**Date**: 2026-01-30
**Spec**: [spec.md](spec.md)

This document describes the data model additions and modifications required for the AI-Powered Todo Chatbot feature. The existing `User` and `Task` models from Phase-2 will be reused without modification. New models for `Conversation` and `Message` are introduced to store chat history, ensuring a stateless backend and persistent conversation context.

## Existing Models (Reused from Phase-2)

### User
- **Purpose**: Represents an application user.
- **Key Attributes**:
  - `id`: Primary key, identifies the user.
  - (Other attributes as defined in Phase-2 `user.py` model)

### Task
- **Purpose**: Represents a to-do item for a specific user.
- **Key Attributes**:
  - `id`: Primary key, identifies the task.
  - `user_id`: Foreign key, links to the `User` who owns the task.
  - `title`: Description of the task.
  - `description`: Optional detailed description.
  - `status`: e.g., "pending", "completed".
  - (Other attributes as defined in Phase-2 `task.py` model)

## New Models (Phase-3)

### Conversation
- **Purpose**: Stores metadata about a chat session between a user and the AI chatbot.
- **Key Attributes**:
  - `id`: Primary key, auto-incrementing integer.
  - `user_id`: Foreign key, links to the `User` who initiated the conversation.
  - `created_at`: Timestamp, records when the conversation started.

### Message
- **Purpose**: Stores individual messages within a conversation, from both the user and the AI.
- **Key Attributes**:
  - `id`: Primary key, auto-incrementing integer.
  - `conversation_id`: Foreign key, links to the `Conversation` this message belongs to.
  - `sender_type`: String, indicates who sent the message (e.g., "user", "ai").
  - `content`: Text, the actual message content.
  - `timestamp`: Timestamp, records when the message was sent.
  - `tool_calls`: JSON (optional), stores structured data if the AI's response involves calling an MCP tool (e.g., function name, arguments).

## Relationships

- **User to Conversation**: One-to-many. A `User` can have multiple `Conversation`s.
- **Conversation to Message**: One-to-many. A `Conversation` can have multiple `Message`s.
- **Task**: Remains unchanged, associated with `User` as in Phase-2. Chatbot operations will modify `Task` records indirectly via MCP tools.

## Validation Rules

- `Conversation.user_id`: Must reference an existing `User.id`.
- `Message.conversation_id`: Must reference an existing `Conversation.id`.
- `Message.sender_type`: Must be one of ["user", "ai"].
- `Message.content`: Cannot be empty.
