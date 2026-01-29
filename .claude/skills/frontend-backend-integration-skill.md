### **Skill: Frontend-Backend Integration for Authenticated Full-Stack Applications**

#### **Purpose**

To define a standardized and resilient methodology for integrating a Next.js frontend with a FastAPI backend, with a focus on secure, token-based authentication, robust state management, and graceful error handling.

#### **Capabilities**

An engineer with this skill can:

*   Implement secure and seamless user authentication flows between the frontend and backend.
*   Configure a shared API client or SDK for making type-safe requests from the Next.js frontend to the FastAPI backend.
*   Manage JWTs (access and refresh tokens) on the client-side, including secure storage, automatic injection into API requests, and silent token refresh.
*   Develop frontend components that effectively manage asynchronous states (loading, success, error) when interacting with the backend.
*   Handle and interpret API error responses (e.g., 401, 403, 404, 422) in the frontend to provide clear and actionable user feedback.
*   Integrate frontend routing with backend authentication state, protecting client-side routes and redirecting unauthorized users.

#### **Best Practices**

*   **Centralized API Client:** Use a single, centralized API client instance (e.g., an Axios or Fetch wrapper) across the Next.js application. This client should be configured to automatically handle base URLs, headers, and token injection.
*   **Environment Variables:** Store the backend API URL in environment variables on the frontend (e.g., `NEXT_PUBLIC_API_URL`). Do not hardcode URLs.
*   **Stateless Communication:** All communication must be stateless. The frontend must send a valid JWT with every authenticated API request, and the backend must not rely on server-side sessions.
*   **Consistent Error Schema:** The backend must provide a consistent JSON error schema for all error responses. The frontend should have a standardized utility for parsing these errors.
*   **Data Transfer Objects (DTOs):** Define clear data contracts (schemas or TypeScript types) for API request and response bodies that are shared or mirrored between the frontend and backend to ensure type safety.
*   **CORS Configuration:** The FastAPI backend must be securely configured with a strict Cross-Origin Resource Sharing (CORS) policy, allowing requests only from the authorized frontend domain.

#### **Integration Flow**

1.  **User Login:** The user submits credentials via a Next.js form. The frontend sends a POST request to the backend's `/login` endpoint.
2.  **Token Issuance:** The FastAPI backend validates the credentials and, upon success, returns a short-lived access token and a long-lived refresh token.
3.  **Token Storage:** The Next.js client securely stores the tokens (e.g., in memory, managed by a state library or a secure cookie).
4.  **Authenticated Requests:** For subsequent API calls, the frontend's API client automatically attaches the access token to the `Authorization: Bearer <token>` header.
5.  **Backend Verification:** The FastAPI backend receives the request, validates the JWT from the header, and processes the request if the token is valid and the user is authorized.
6.  **Token Refresh:** If an API call fails with a `401 Unauthorized` error (due to an expired access token), the API client automatically triggers a request to the backend's `/token/refresh` endpoint, sending the refresh token. A new access token is received and stored, and the original failed request is retried.
7.  **Logout:** Upon logout, the frontend discards the tokens and sends a request to a backend endpoint to invalidate the refresh token (if a server-side revocation mechanism is in use).

#### **Common Patterns**

*   **Authenticated Higher-Order Component (HOC) / Hook:** In Next.js, a reusable HOC or custom hook that wraps pages or components to protect them. It checks for a valid authentication state and redirects to a login page if the user is not authenticated.
*   **Global State Management for Auth:** Using a global state management library (e.g., Zustand, Redux, React Context) to store the user's authentication status, user profile, and tokens, making them accessible throughout the application.
*   **Asynchronous State Hook:** A custom React hook (e.g., `useAsync`) that simplifies handling the `loading`, `error`, and `data` states for API calls within components. It abstracts away the boilerplate of managing these states manually.
*   **API Error Interceptor:** An interceptor configured in the API client that automatically handles common API errors. For example, it can catch `401` errors to trigger the token refresh flow or `403` errors to show a "Permission Denied" message.
*   **Type-Safe API Layer:** Using tools like OpenAPI Generator or manually creating TypeScript types that mirror the FastAPI Pydantic models to enable type-safe API calls and reduce runtime errors.
