### **Skill: JWT-Based Authentication and Authorization for Full-Stack Applications**

#### **Purpose**

To define a secure and standardized methodology for implementing stateless, token-based authentication and authorization across full-stack applications, integrating a Better Auth-compliant frontend with a FastAPI backend.

#### **Capabilities**

An engineer with this skill can:

*   Architect and implement secure user registration and login endpoints on a FastAPI backend that issue JSON Web Tokens (JWTs).
*   Integrate a frontend framework with the Better Auth library for secure token storage, automatic token refresh, and injection of authentication headers into API requests.
*   Develop protected API endpoints that require and validate JWTs for access, rejecting any unauthorized requests.
*   Implement a robust JWT validation process on the backend, verifying the token's signature, expiration (`exp`), issuer (`iss`), and audience (`aud`).
*   Design and enforce authorization logic, including Role-Based Access Control (RBAC), using claims embedded within the JWT payload.
*   Manage the complete token lifecycle, including issuance, secure client-side storage, background refresh, and server-side revocation strategies.

#### **Best Practices**

*   **Stateless Backend:** Backend APIs must be designed to be stateless. All information required to process a user's request, including their identity and permissions, must be derived from the provided JWT. No server-side sessions should be used for authentication state.
*   **Token Transmission:** JWTs must be transmitted from the client to the server in the `Authorization` HTTP header using the `Bearer` scheme (e.g., `Authorization: Bearer <token>`).
*   **Secure Token Storage:** On the frontend, the Better Auth library should be configured to store tokens securely. Avoid using `localStorage` due to its vulnerability to Cross-Site Scripting (XSS). Prefer in-memory storage or secure, `HttpOnly` cookies for refresh tokens.
*   **Short-Lived Access Tokens:** Access tokens must have a short lifespan (e.g., 5-15 minutes) to minimize the impact of a token leak. The short expiration window limits the time an attacker can use a stolen token.
*   **Refresh Token Rotation:** Use long-lived refresh tokens to obtain new access tokens without re-authenticating the user. Refresh tokens must be invalidated upon use (rotation), and a new refresh token should be issued with each new access token to mitigate the risk of refresh token theft.
*   **Asymmetric Signature Algorithms:** Always use a strong, asymmetric cryptographic algorithm, such as `RS256`, for signing JWTs in production. This allows the public key to be used for verification without exposing the private signing key.

#### **Security Considerations**

*   **Cross-Site Scripting (XSS):** To prevent XSS attacks from capturing JWTs, ensure that tokens are never exposed to insecure client-side scripts. Utilize secure storage mechanisms provided by libraries like Better Auth and implement a strict Content Security Policy (CSP).
*   **Cross-Site Request Forgery (CSRF):** When using the `Authorization` header for token transmission, the application is protected against traditional CSRF attacks. If tokens are ever stored in cookies, strict `SameSite` policies and anti-CSRF tokens must be implemented.
*   **Token Revocation:** An effective revocation strategy is mandatory for security events like password changes or user-initiated logouts. This is typically implemented via a distributed denylist (e.g., a Redis cache) that stores the identifiers (`jti` claim) of revoked tokens.
*   **Replay Attacks:** Mitigate replay attacks by including a `jti` (JWT ID) claim in each token. The server should track processed `jti` values within a defined time window to reject replayed tokens.
*   **Payload Data Exposure:** The JWT payload is Base64Url encoded, not encrypted. It is publicly readable. **NEVER** store sensitive personal or application data in the JWT payload. Only include non-sensitive identifiers like user ID, roles, and permissions.
*   **Audience Restriction:** Use the `aud` (audience) claim to ensure that a JWT issued for one service cannot be used to access another. The backend must validate that it is the intended audience of the token.

#### **Common Patterns**

*   **Token Exchange Flow:** The standard authentication flow where a user submits credentials (e.g., username and password) to a secure endpoint. The backend validates these credentials, and upon success, returns a short-lived access token and a long-lived refresh token.
*   **Silent Token Refresh:** A frontend pattern, managed by Better Auth, where an expiring access token is automatically and silently refreshed in the background using the stored refresh token. This provides a seamless user experience without interrupting their workflow.
*   **Protected Route Dependency:** In FastAPI, a reusable dependency that is applied to protected endpoints. This dependency extracts and validates the JWT from the request header, retrieves the user's identity from the payload, and makes it available to the route's logic. If validation fails, it immediately returns a `401 Unauthorized` error.
*   **Scope-Based Authorization:** A pattern where specific permissions or "scopes" are included in the JWT payload (e.g., `tasks:read`, `tasks:write`). FastAPI dependencies can then be configured to require specific scopes for certain endpoints, enabling fine-grained access control.
