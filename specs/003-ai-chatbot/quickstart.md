# Quickstart: AI-Powered Todo Chatbot Setup

**Date**: 2026-01-30
**Spec**: [spec.md](spec.md)

This quickstart guide provides instructions for setting up the necessary environment variables and initial steps to use the AI-Powered Todo Chatbot feature.

## 1. Obtain Cohere API Key

The AI Chatbot utilizes the Cohere API for natural language understanding and generation. You will need a Cohere API key to run the backend components.

1.  Visit the [Cohere website](https://cohere.ai) and sign up for an account.
2.  Navigate to your API keys section and generate a new API key.
3.  Copy this API key.

## 2. Configure Environment Variables

The Cohere API key must be provided as an environment variable in the backend's `.env` file.

1.  Navigate to the `backend/` directory of your project.
2.  Open the `.env` file (or create one if it doesn't exist).
3.  Add the following line, replacing `YOUR_COHERE_API_KEY` with the key you obtained in the previous step:

    ```
    COHERE_API_KEY=YOUR_COHERE_API_KEY
    ```
4.  Save the `.env` file.

## 3. Database Migrations (Initial Setup)

If this is a fresh setup or if you're adding the chat feature to an existing Phase-2 application, you will need to run database migrations to create the new `Conversation` and `Message` tables.

1.  Ensure your backend virtual environment is activated.
2.  Navigate to the `backend/` directory.
3.  Run the Alembic migration commands:

    ```bash
    alembic revision --autogenerate -m "Add Conversation and Message tables for AI Chatbot"
    alembic upgrade head
    ```
    *   Review the generated migration script (usually in `alembic/versions/`) before running `alembic upgrade head` to ensure it correctly defines the `conversation` and `message` tables.

## 4. Using the Chatbot (Once Implemented)

After the backend and frontend components are implemented and running:

1.  Start your backend server (e.g., `uvicorn app.main:app --reload`).
2.  Start your frontend application (e.g., `npm run dev`).
3.  Log in to the application.
4.  Locate the chatbot icon (typically a floating button) in the UI and click it to open the chat panel.
5.  Type your natural language commands to manage your to-do tasks (e.g., "Add 'buy groceries'", "List my pending tasks", "Complete task 5").
6.  Observe the chatbot's responses and the updates to your task list.
