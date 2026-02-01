# Research: AI-Powered Todo Chatbot

**Date**: 2026-01-30
**Spec**: [spec.md](spec.md)

This document summarizes the key technology decisions for the AI-Powered Todo Chatbot feature. As the feature was specified with a prescriptive technology stack, this research phase serves to confirm and document those choices.

## Language Model API

- **Decision**: Use the Cohere API for all natural language understanding and generation tasks.
- **Rationale**: This was a direct requirement from the feature prompt. The project constitution has been updated to reflect this as a standard for AI features. The Cohere SDK will be used for integration.
- **Alternatives Considered**: OpenAI API, Gemini API. These were rejected to adhere to the specified project requirements.

## Frontend Chat Component

- **Decision**: Use ChatKit for the frontend chat interface.
- **Rationale**: This was a direct requirement from the feature prompt. ChatKit provides a pre-built set of components for creating chat UIs, which will accelerate frontend development.
- **Alternatives Considered**: Building a custom chat component. This was rejected as it would be more time-consuming and is not required by the project's goals.

## AI-to-Backend Integration

- **Decision**: Implement an MCP (Machine-Orchestrated Process) server to expose backend functionality as discrete tools for the AI agent.
- **Rationale**: This aligns with the "Tool-Based AI Integration" principle in the constitution. It decouples the AI logic from the core business logic, improving modularity and maintainability.
- **Alternatives Considered**: Directly calling backend service functions from the agent logic. This was rejected as it would create a tighter coupling and make the system harder to test and maintain.
