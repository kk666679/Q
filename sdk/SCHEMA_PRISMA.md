# Comprehensive Prisma Schema for QMS Generator

This document provides a detailed explanation of the Prisma schema designed for the QMS Generator application. The schema supports multi‑agent workflows, ISO 9001 compliance tracking, document versioning, process mapping, and user/organization management. It is built for **PostgreSQL** and uses Prisma ORM version **7.4.2**.

## Overview

The database consists of the following core entities:

- **User** – individuals who interact with the system.
- **Organization** – groups that own projects and have members.
- **Project** – a QMS implementation effort.
- **Process** – business processes defined within a project.
- **Document** – QMS documents (quality manual, policy, procedures, etc.).
- **ComplianceScan** – results of ISO 9001 compliance checks on documents.
- **AgentTask** – tasks processed by AI agents.
- **Skill** – metadata for AI skills (optional, for agent orchestration).
- **AuditLog** – optional tracking of changes.

Relationships are enforced with foreign keys and cascading deletes where appropriate. Indexes on frequently queried fields ensure performance.

## Enums

The schema uses several PostgreSQL enums (mapped via Prisma `enum`) to constrain field values.

| Enum | Purpose | Values |
|------|---------|--------|
| `UserRole` | Access level within an organization | `ADMIN`, `MANAGER`, `USER`, `VIEWER` |
| `ProjectStatus` | Lifecycle state of a project | `DRAFT`, `ACTIVE`, `ARCHIVED` |
| `ProcessType` | Category of business process | `CORE`, `SUPPORT`, `MANAGEMENT` |
| `DocumentType` | Type of QMS document | `QUALITY_MANUAL`, `QUALITY_POLICY`, `PROCEDURE`, `WORK_INSTRUCTION`, `FORM`, `RECORD`, `COMPLIANCE_REPORT` |
| `DocumentStatus` | Approval state of a document | `DRAFT`, `REVIEW`, `APPROVED`, `OBSOLETE` |
| `AgentTaskStatus` | Execution status of an agent task | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED` |
| `AgentRole` | Role of an AI agent | `SUPERVISOR`, `PROCESS_ANALYST`, `DOCUMENT_DRAFTER`, `PROCEDURE_GENERATOR`, `COMPLIANCE_CHECKER` |

## Models

### `User`

Represents a system user.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` @id | CUID unique identifier |
| `email` | `String` @unique | User's email (login) |
| `name` | `String?` | Display name |
| `role` | `UserRole` | Global role (may be overridden in org context) |
| `createdAt` | `DateTime` | Timestamp |
| `updatedAt` | `DateTime` | Timestamp |

**Relations:**

- `organizationMemberships` – join table `OrganizationMember` (many‑to‑many with `Organization`).
- `projects` – projects where the user is a direct owner (if applicable).
- `createdDocuments` – documents created by this user.
- `agentTasks` – tasks assigned to this user (if any).

---

### `Organization`

Represents a tenant (company, team) that groups projects.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` @id | CUID |
| `name` | `String` | Organization name |
| `slug` | `String` @unique | URL-friendly identifier |
| `subscription` | `String?` | Plan type (e.g., "free", "pro") |
| `settings` | `Json?` | JSON configuration object |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

**Relations:**

- `members` – list of `OrganizationMember` records.
- `projects` – all projects belonging to this organization.

---

### `OrganizationMember`

Join table between `User` and `Organization`, with an explicit role.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` @id | CUID |
| `organizationId` | `String` | FK to `Organization` |
| `userId` | `String` | FK to `User` |
| `role` | `UserRole` | Role within this organization |
| `joinedAt` | `DateTime` | |

**Unique constraint:** `[organizationId, userId]` ensures a user is not added twice.

---

### `Project`

The central entity representing a QMS implementation project.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` @id | CUID |
| `name` | `String` | Project name |
| `description` | `String?` | Optional description |
| `organizationId` | `String` | FK to `Organization` |
| `organizationType` | `String` | e.g., "corporation", "sme" |
| `industry` | `String` | e.g., "technology", "manufacturing" |
| `scope` | `String` | Text describing QMS scope |
| `status` | `ProjectStatus` | Current status |
| `metadata` | `Json` | Flexible JSON for extra attributes |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

**Relations:**

- `organization` – parent org (cascade delete).
- `processes` – list of processes.
- `documents` – list of documents.
- `complianceScans` – scans performed on documents of this project.
- `agentTasks` – tasks related to this project.

**Indexes:** `organizationId`, `status` – for fast filtering.

---

### `Process`

Represents a business process identified during QMS analysis.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` @id | CUID |
| `projectId` | `String` | FK to `Project` |
| `name` | `String` | Process name |
| `description` | `String` | Detailed description |
| `type` | `ProcessType` | Core, support, or management |
| `flowData` | `Json` | Stores nodes, edges, viewport for visual process map (default `{"nodes":[],"edges":[]}`) |
| `inputs` | `String[]` | Array of input descriptions (PostgreSQL text array) |
| `outputs` | `String[]` | Array of output descriptions |
| `owner` | `String?` | Name/role of process owner |
| `metrics` | `Json[]` | Array of metric objects: `{ name, description, target? }` |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

**Relations:**

- `project` – parent project (cascade delete).

**Index:** `projectId`.

---

### `Document`

Stores QMS documents with versioning.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` @id | CUID |
| `projectId` | `String` | FK to `Project` |
| `title` | `String` | Document title |
| `content` | `String` @db.Text | Markdown/HTML content |
| `type` | `DocumentType` | Type of document |
| `version` | `Int` @default(1) | Version number (increments on update) |
| `status` | `DocumentStatus` | Approval status |
| `createdBy` | `String` | Either a userId (FK) or "ai" |
| `metadata` | `Json` | JSON with `isoClauses`, `keywords`, `wordCount`, etc. |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |
| `approvedAt` | `DateTime?` | Timestamp when approved |

**Relations:**

- `project` – parent project (cascade delete).
- `creator` – optional FK to `User` (if created by a human).
- `scans` – compliance scans performed on this document.

**Indexes:** `projectId`, `status`, `type`.

---

### `ComplianceScan`

Records results of ISO 9001 compliance checks on a document.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` @id | CUID |
| `documentId` | `String` | FK to `Document` |
| `projectId` | `String` | FK to `Project` (denormalized for query efficiency) |
| `findings` | `Json` | Array of objects: `{ clause, status, severity, explanation, suggestion, confidence? }` |
| `score` | `Float` | Overall compliance score (0–100) |
| `passed` | `Boolean` | Whether the document meets a defined threshold |
| `summary` | `String` @db.Text | Short textual summary |
| `createdAt` | `DateTime` | |

**Relations:**

- `document` – the scanned document (cascade delete).
- `project` – the project (cascade delete).

**Indexes:** `documentId`, `projectId`, `passed`.

---

### `AgentTask`

Tracks tasks processed by AI agents (or assigned to humans). Note: The schema originally contained a flawed relation for `assignedUser`. See **Important Note** below.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` @id | CUID |
| `projectId` | `String` | FK to `Project` |
| `type` | `String` | Task type, e.g., "process-analysis", "document-drafting" |
| `input` | `Json` | Parameters for the task |
| `output` | `Json?` | Result of the task (if completed) |
| `status` | `AgentTaskStatus` | Current status |
| `assignedTo` | `AgentRole?` | Which agent role is/was responsible |
| `createdAt` | `DateTime` | |
| `completedAt` | `DateTime?` | |

**Relations:**

- `project` – the related project (cascade delete).

**Important Note:** The original schema attempted to add a relation `assignedUser` to `User`. However, the field `assignedTo` is an enum (`AgentRole`), not a string, so it cannot be used as a foreign key. To allow tasks assigned to humans, you should add a separate nullable field `assignedUserId` (String) and a relation:

```prisma
assignedUserId String?
assignedUser   User?   @relation("TaskAssignee", fields: [assignedUserId], references: [id])
```

Then, a task can be assigned either to an AI agent (via `assignedTo`) or to a human (via `assignedUserId`). The example above omits that relation for clarity but should be adjusted in production.

**Indexes:** `projectId`, `status`.

---

### `Skill` (Optional)

Stores metadata about AI skills loaded from the filesystem. This table is optional; skills can also be discovered on‑the‑fly.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` @id | CUID |
| `name` | `String` @unique | Skill name (matches directory name) |
| `description` | `String` | Short description from frontmatter |
| `version` | `String?` | Skill version |
| `path` | `String` | Filesystem path to skill directory |
| `metadata` | `Json?` | Additional metadata (author, license, etc.) |
| `createdAt` | `DateTime` | |
| `updatedAt` | `DateTime` | |

---

### `AuditLog` (Optional)

Tracks changes to sensitive data for compliance and debugging.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` @id | CUID |
| `userId` | `String?` | User who performed the action (if any) |
| `action` | `String` | e.g., "CREATE", "UPDATE", "DELETE" |
| `entityType` | `String` | e.g., "Project", "Document" |
| `entityId` | `String?` | ID of the affected entity |
| `changes` | `Json?` | Before/after values (or just a summary) |
| `timestamp` | `DateTime` | When the action occurred |
| `ipAddress` | `String?` | Client IP (if applicable) |

**Indexes:** `userId`, `[entityType, entityId]`.

## Relationships Summary

```
User 1--* OrganizationMember *--1 Organization
Organization 1--* Project
Project 1--* Process
Project 1--* Document
Project 1--* ComplianceScan
Project 1--* AgentTask
Document 1--* ComplianceScan
User 1--* Document (creator)
User ?--* AgentTask (assignee)   // if human assignment added
```

## Design Considerations

1. **JSON fields** are used extensively (`metadata`, `flowData`, `metrics`, `findings`, `input`/`output`, `changes`) to store semi‑structured data. This provides flexibility for future extensions without schema migrations. PostgreSQL’s JSONB support ensures efficient querying when needed.

2. **Arrays** (`inputs`, `outputs`, `metrics`) leverage PostgreSQL native array types, simplifying storage of multiple values.

3. **Cascading deletes** (`onDelete: Cascade`) ensure referential integrity when a parent entity is removed.

4. **Indexes** on foreign keys and frequently filtered columns improve query performance.

5. **Enum usage** enforces data consistency and improves readability.

6. **Denormalization** – `projectId` in `ComplianceScan` duplicates the parent key for faster project‑level queries without joining through `Document`.

7. **Versioning** – Documents have a `version` field that increments on each update (handled by application logic).

8. **Agent tasks** – JSON `input`/`output` allow arbitrary data structures required by different agent skills.

## Required Fixes / Improvements

- **AgentTask‑User relation** – As noted, the current schema incorrectly tries to use `assignedTo` (enum) as a foreign key. A corrected version should include:
  ```prisma
  assignedTo   AgentRole?
  assignedUserId String?
  assignedUser   User?   @relation("TaskAssignee", fields: [assignedUserId], references: [id])
  ```
- **Cascading on User deletion** – Currently, deleting a user with `createdDocuments` would fail because `Document.createdBy` is not nullable and has no `onDelete` action. Consider either:
  - Making `createdBy` optional and setting `onDelete: SetNull` (if you want to retain documents after user deletion).
  - Adding `onDelete: Cascade` (if you want to delete user‑created documents).
- **Organization slug** – Ensure uniqueness and consider adding an index on `slug` (already unique, which creates an index).

## Conclusion

***This Prisma schema provides a robust foundation for the QMS Generator application. It captures all core entities and their relationships, supports flexible data storage via JSON, and includes indexes for performance. With minor corrections, it is ready for production use with Prisma 7.4.2 and PostgreSQL.**