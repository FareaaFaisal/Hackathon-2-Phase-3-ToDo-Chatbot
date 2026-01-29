### **Skill: PostgreSQL & SQLModel Database Engineering for Multi-User Applications**

#### **Purpose**

To establish the engineering principles and standards for designing, building, and maintaining a robust, scalable, and secure database architecture for multi-user applications. This skill focuses on leveraging Neon's serverless PostgreSQL platform and the SQLModel Object-Relational Mapper (ORM) to ensure data integrity, performance, and strict data isolation.

#### **Capabilities**

A Database Engineer with this skill can:

*   Architect and implement normalized, multi-tenant database schemas from technical specifications.
*   Define data models, relationships, and constraints using SQLModel with type-safe Pythonic structures.
*   Implement and enforce tenant-based data isolation at the schema and query level.
*   Design and apply advanced indexing strategies to optimize query performance and resource utilization.
*   Manage the full lifecycle of the database schema, including version-controlled migrations and data evolution.
*   Leverage the unique features of Neon PostgreSQL, such as autoscaling, branching, and connection pooling, to build cost-efficient and resilient systems.
*   Analyze query performance and identify optimization opportunities.

#### **Best Practices**

*   **Strict Data Isolation:** All data access patterns must be scoped to the authenticated user or tenant. Direct, unfiltered queries to tables containing tenant-specific data are strictly prohibited. This principle must be enforced through application logic and, where possible, database-level security policies.
*   **Strategic Indexing:** Foreign keys and columns frequently used in query filters, join conditions, and ordering clauses must be indexed. Composite indexes should be utilized for queries that filter on multiple columns simultaneously. Regularly analyze query performance to identify and add missing indexes.
*   **Connection Management:** Utilize an external connection pooler, as recommended for serverless PostgreSQL environments like Neon, to manage connections efficiently. This prevents connection exhaustion and reduces latency.
*   **Version-Controlled Migrations:** All schema modifications must be executed through version-controlled migration scripts managed by a tool such as Alembic. Manual alterations to the database schema in any environment are forbidden to ensure consistency and reproducibility.
*   **Precise Data Typing:** Employ the most specific and appropriate data type for each column. This enforces data integrity at the lowest level, optimizes storage, and improves performance.
*   **Default to Normalization:** Adhere to database normalization principles (at a minimum, Third Normal Form) to minimize data redundancy and prevent anomalies. Denormalization should be a deliberate, documented choice for specific performance-critical read paths, not a default.

#### **Schema Design Principles**

*   **Primary Keys:** Every table must define a primary key. Prefer non-sequential, randomly generated identifiers (e.g., UUIDs) over sequential integers to prevent enumeration vulnerabilities.
*   **Tenant-Ownership Foreign Key:** Every table containing tenant-specific data must include a non-nullable foreign key column referencing the owning entity (e.g., `user_id` or `tenant_id`). This is the foundational element for enforcing data isolation.
*   **Referential Integrity:** Use foreign key constraints to maintain referential integrity between tables. Define clear and predictable behavior for constraint violations and related actions (e.g., cascading deletes).
*   **Lifecycle Timestamps:** All mutable tables should include non-nullable `created_at` and `updated_at` timestamp columns. These should be automatically managed by the database or application to provide a clear audit trail of data changes.
*   **Soft Deletion:** For critical records, implement a soft-delete mechanism (e.g., a `deleted_at` timestamp) instead of permanent deletion. This allows for data recovery and maintains historical integrity.
*   **Consistent Naming Conventions:** Adhere to a project-wide standard for naming tables, columns, indexes, and constraints (e.g., lowercase `snake_case`). Consistency improves readability and reduces ambiguity.

#### **Common Patterns**

*   **Row-Level Tenant Isolation:** The primary pattern for multi-tenancy where a `tenant_id` or `user_id` on each record dictates ownership. All database read and write operations must implicitly include a filter for the active tenant's ID.
*   **Index-Only Scans:** Designing indexes that include all columns required by a query, allowing the database to answer the query from the index alone without accessing the table heap. This pattern is highly effective for optimizing read performance.
*   **Partial Indexes for Filtered Queries:** Creating indexes on a specific subset of table rows that match a certain condition. This is useful for optimizing queries that frequently target a small, well-defined portion of the data (e.g., an index on `is_active = true`).
*   **Check Constraints for Data Integrity:** Using database check constraints to enforce business rules and data validation at the database level, providing a stronger layer of integrity beyond application-level checks.