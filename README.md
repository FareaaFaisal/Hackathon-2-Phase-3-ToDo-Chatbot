# TO-DO Full Stack Web App

A modern full-stack To-Do web application built with Next.js / React for the frontend and FastAPI + SQLModel for the backend.
This project was developed following Spec-Driven Development (SDD) using Gemini-CLI with SpecKit Plus, and I also created agents and skills using Claude Code to automate certain frontend and backend tasks.
The UI features beautiful moving animations, and the backend uses a Neon database for storage along with enhanced authentication for secure user management.
Users can create, update, complete, and delete tasks with real-time updates and a smooth, visually appealing interface.

---

## Features

- **User Authentication:** Sign up and log in with JWT tokens.
- **CRUD Operations:** Create, Read, Update, Delete tasks.
- **Task Completion:** Mark tasks as completed or pending.
- **Filtering & Sorting:** Filter tasks by status and sort by date or title.
- **Responsive UI:** Works on desktop and mobile devices.
- **Secure API:** Backend validates users and protects task access.

---

## Tech Stack

**Frontend:**

- Next.js (React)
- TypeScript
- Tailwind CSS
- Axios for API requests

**Backend:**

- FastAPI
- SQLModel + PostgreSQL
- JWT/Better Auth Authentication
- Uvicorn server

**Database:**

- NEON Serverless POSTGRES Database

---

## Getting Started

### **Backend Setup**

1. Go to the backend folder:
   ```bash
   cd backend
   ```

2. Create virtual environment and activate:
  ```bash
  python -m venv venv
  venv\Scripts\activate      # Windows
  source venv/bin/activate   # Mac/Linux
  ```

3. Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```

4. Set up environment variables (.env):
  ```env
  DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
  SECRET_KEY=your_secret_key
  ```

5. **Configure Cohere API Key (.env):**
    The AI Chatbot utilizes the Cohere API. Obtain an API key from [Cohere website](https://cohere.ai).
    Add the following to your `.env` file:
    ```env
    COHERE_API_KEY=YOUR_COHERE_API_KEY
    ```

6. Run the backend server:
  ```bash
  uvicorn app.main:app --reload --port 8000
  ```

---

### **Frontend Setup**

1. Go to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (.env):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

4. Run the frontend:
```bash
npm run dev
```

5. Open your browser at http://localhost:3000

---

### **Database Migrations for Chatbot**

If this is a fresh setup or if you're adding the chat feature to an existing Phase-2 application, you will need to run database migrations to create the new `Conversation` and `Message` tables.

1. Ensure your backend virtual environment is activated.
2. Navigate to the `backend/` directory.
3. Run the Alembic migration commands:

    ```bash
    alembic revision --autogenerate -m "Add Conversation and Message tables for AI Chatbot"
    alembic upgrade head
    ```
    *   Review the generated migration script (usually in `alembic/versions/`) before running `alembic upgrade head` to ensure it correctly defines the `conversation` and `message` tables.

---

### **AI Chatbot Usage**

1. Ensure both your backend and frontend servers are running.
2. Log in to the application.
3. Locate the chatbot icon (typically a floating button) in the UI and click it to open the chat panel.
4. Type your natural language commands to manage your to-do tasks (e.g., "Add 'buy groceries'", "List my pending tasks", "Complete task 5").
5. Observe the chatbot's responses and the updates to your task list.

---

### **Usage**

1. Sign up or log in.
2. Create a new task using “Add Task” button.
3. Edit or delete tasks as needed.
4. Filter tasks by status (All, Pending, Completed) and sort them.
5. Mark tasks as completed using the Mark Done / Completed button.

---

### **License**

This project is open source and available under the MIT License.

---

### **Author**

Fareaa Faisal

GitHub: https://github.com/FareaaFaisal
