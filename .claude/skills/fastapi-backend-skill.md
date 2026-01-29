### **Skill: FastAPI Backend Development for a Secure Multi-User Todo Application**

#### **Purpose**

To establish the standards, practices, and architectural patterns for building a secure, scalable, and production-ready backend service for a multi-user todo application using the FastAPI framework. This skill ensures consistency, maintainability, and adherence to security best practices across the development lifecycle.

#### **Capabilities**

An engineer with this skill can:

*   Design and implement RESTful APIs that are compliant with OpenAPI and JSON API standards.
*   Develop robust data models and interact with a PostgreSQL database using SQLModel and SQLAlchemy.
*   Implement and enforce a secure authentication system using JWT bearer tokens and OAuth2 password flow.
*   Enforce strict authorization and data ownership, ensuring users can only access their own resources.
*   Create a well-structured, modular, and scalable FastAPI project.
*   Manage application configuration and secrets securely using environment variables.
*   Implement comprehensive error handling to provide clear and consistent API responses.
*   Write unit and integration tests to ensure code quality and reliability.

#### **Best Practices**

*   **Dependency Injection:** Leverage FastAPI's dependency injection system for managing database sessions, obtaining the current authenticated user, and other shared resources. Dependencies must be used to enforce API and business logic constraints.
*   **Authentication:** All API endpoints that handle user data must be protected and require a valid JWT. The token's validity, signature, and expiration must be checked on every request.
*   **Authorization:** Data access must be strictly controlled. After authenticating a user, all database queries for user-specific resources must be filtered by the current user's ID. Any attempt to access or modify another user's data must result in a `403 Forbidden` or `404 Not Found` error.
*   **Data Validation:** Use SQLModel and Pydantic for rigorous request and response data validation. This ensures data integrity and provides clear error messages for invalid inputs.
*   **Configuration Management:** Externalize all configuration (e.g., database connection strings, JWT secrets, CORS origins) using environment variables. Never hardcode secrets or environment-specific settings.
*   **Asynchronous Operations:** Utilize `async` and `await` for all I/O-bound operations, particularly database interactions and external API calls, to ensure high performance and concurrency.
*   **Database Migrations:** Employ Alembic for managing database schema migrations. All schema changes must be version-controlled and applied through migration scripts.
*   **Separation of Concerns:** Maintain a clear separation between API route logic, business logic (services), and data access logic (repositories/models).

#### **File Structure**

A standardized file structure should be followed to ensure predictability and ease of navigation.

```
/
├── alembic/             # Database migration scripts
├── app/
│   ├── api/
│   │   ├── deps.py      # FastAPI dependencies (e.g., get_current_user)
│   │   └── endpoints/   # API route modules (e.g., tasks.py, users.py)
│   ├── core/
│   │   ├── config.py    # Configuration loading from environment variables
│   │   └── security.py  # Password hashing, JWT creation and validation
│   ├── db/
│   │   ├── session.py   # Database session management
│   │   └── base.py      # Base model and SQLModel engine setup
│   ├── models/          # SQLModel database models (tables)
│   ├── schemas/         # Pydantic schemas for API requests and responses
│   └── main.py          # FastAPI application entrypoint and middleware
├── tests/                 # Unit and integration tests
└── .env                   # Environment variable definitions (not committed)
```

#### **Common Patterns**

*   **Authenticated User Dependency:** A reusable dependency that validates the JWT from the `Authorization` header and returns the corresponding user model from the database. This dependency should be used on all protected endpoints.
*   **CRUD Repository:** A generic class or a set of functions that implement the basic Create, Read, Update, and Delete operations for a given SQLModel model. This promotes code reuse and standardizes data access.
*   **Paginated Responses:** A standardized response schema for returning lists of resources, including details like `total`, `page`, `size`, and `pages`, to support client-side pagination.
*   **Service Layer:** A layer of business logic that sits between the API endpoints and the database repositories. Services orchestrate operations and enforce business rules.
