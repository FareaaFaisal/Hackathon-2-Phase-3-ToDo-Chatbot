### **Skill: Spec-Driven Software Development Using Spec-Kit Plus**

#### **Purpose**

To establish a rigorous, systematic methodology for software development where implementation is strictly and exclusively guided by formal specifications. This skill ensures that all development work is traceable, verifiable, and directly aligned with predefined requirements, eliminating ambiguity and assumption-based errors.

#### **Capabilities**

An engineer with this skill can:

*   Translate abstract feature requests into concrete, testable specifications for features, APIs, and database schemas.
*   Decompose complex requirements into a set of discrete, verifiable acceptance criteria.
*   Develop software by methodically implementing each point in a specification without deviation or addition.
*   Identify ambiguities, inconsistencies, or gaps in specifications and formally request clarification before proceeding with implementation.
*   Validate a completed implementation directly against its corresponding specification to prove correctness and completeness.
*   Author and maintain a suite of specification documents that serve as the single source of truth for a feature's expected behavior.

#### **Best Practices**

*   **Specification as Contract:** Treat the specification document as an immutable contract for a given development cycle. Any change to the scope or behavior must be reflected in the spec before implementation begins.
*   **No Assumptions:** Never infer or assume requirements that are not explicitly stated in the specification. If a detail is missing, it must be added to the spec through a formal clarification process.
*   **Traceability:** Every line of code written should be directly traceable to a specific requirement or acceptance criterion in a specification document.
*   **Verifiability:** All requirements must be written in a manner that is objectively verifiable. Vague or subjective requirements are not permissible.
*   **Separation of Concerns:** Maintain a clear distinction between what the system must do (the specification) and how it is implemented (the code). The spec must not dictate implementation details.
*   **Atomic Specifications:** Each specification should describe a single, well-bounded feature or component. Inter-feature dependencies should be explicitly documented.

#### **Workflow**

1.  **Specification Phase:** A formal specification is authored. This includes defining the feature's purpose, scope, user-facing behavior, API contracts, and data schema. Every requirement is paired with clear acceptance criteria.
2.  **Review and Approval Phase:** The specification is reviewed by all stakeholders (e.g., product owners, engineers, QA). All ambiguities are resolved, and the spec is formally approved.
3.  **Implementation Phase:** The engineer implements the feature by systematically working through the specification. The implementation must not begin until the spec is approved. The engineer's sole focus is to satisfy the acceptance criteria as written.
4.  **Validation Phase:** The completed implementation is validated against the specification's acceptance criteria. This can be done through manual testing, automated tests, or code review, with each criterion being checked off.
5.  **Handoff/Delivery Phase:** Once all acceptance criteria are met, the feature is considered complete and is handed off for deployment or further integration testing.

#### **Common Patterns**

*   **Acceptance Criteria-Driven Development:** A development practice where the primary focus is on writing code to satisfy a checklist of acceptance criteria derived from the specification.
*   **Specification Clarification Request (SCR):** A formal process for an engineer to request clarification on an ambiguous or incomplete part of a specification. This typically involves pausing implementation, documenting the question, and updating the spec with the answer.
*   **Three-Tier Specification:** A pattern of creating three linked specifications for a single feature: a Feature Spec (describing user-facing behavior), an API Spec (defining the REST/RPC contracts), and a Database Spec (defining the data models and schema).
*   **Behavioral Matrix:** A table within a feature specification that maps different user roles, system states, and inputs to their expected outcomes and error conditions. This is used to exhaustively define complex business logic.
*   **Non-Functional Requirements Specification:** A separate but linked document that specifies system-wide qualities like performance, security, and reliability, which are applicable to all feature implementations.
