---
description: Orchestrates the entire feature development lifecycle from specification to implementation.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). The user input is the feature description.

## Outline

This command orchestrates the full lifecycle of a feature, from an idea to a full implementation. It is a meta-command that calls other `sp.*` commands in sequence.

1.  **Specification (`/sp.specify`)**:
    *   Given the feature description from the user, first call the `/sp.specify` command.
    *   This will create a new branch for the feature, a `spec.md` file with the feature specification, and a `requirements.md` checklist.
    *   The `/sp.specify` command will handle any necessary clarifications with the user.
    *   Wait for the `/sp.specify` command to complete successfully. The spec must be complete and validated.

2.  **Planning (`/sp.plan`)**:
    *   Once the specification is ready, call the `/sp.plan` command.
    *   This will generate the technical plan in `plan.md`, a `data-model.md` if applicable, and any API contracts in the `contracts/` directory.
    *   Wait for the `/sp.plan` command to complete successfully.

3.  **Task Breakdown (`/sp.tasks`)**:
    *   With the technical plan in place, call the `/sp.tasks` command.
    *   This will generate a detailed, actionable `tasks.md` file, with tasks organized by user story and phase.
    *   Wait for the `/sp.tasks` command to complete successfully.

4.  **Implementation (`/sp.implement`)**:
    *   Finally, with a complete set of tasks, call the `/sp.implement` command.
    *   This will execute the tasks in `tasks.md`, implementing the feature.
    *   The `/sp.implement` command will handle project setup, dependency installation, and the phased execution of tasks. It will also track progress by updating `tasks.md`.
    *   Wait for the `/sp.implement` command to complete successfully.

5.  **Completion**:
    *   Once the implementation is finished, report the final status to the user.
    *   The report should include:
        *   The name of the feature branch.
        *   A summary of the implemented feature.
        *   Links to the key artifacts created during the process (`spec.md`, `plan.md`, `tasks.md`).

## Error Handling

*   If any of the sub-commands (`/sp.specify`, `/sp.plan`, `/sp.tasks`, `/sp.implement`) fail, this command should stop and report the error to the user.
*   The error message from the failed sub-command should be propagated to the user.
