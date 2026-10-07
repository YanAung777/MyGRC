# C&A Portal - Integration APIs & Backend Design Specification

This document provides a comprehensive audit of the **C&A Portal** frontend screens, their underlying data schemas, and the corresponding design of the full-stack REST API endpoints. This "API-first" design bridges the gap between client-side operations and durable cloud-hosted storage, keeping strict alignment with the **SOC 2 Type II** Trust Services Criteria.

The APIs are designed to run in a modular, highly secure Node.js/Express architecture within the `/backend` folder, with path definitions compatible with Postgres row-level patterns and object-relational mapping (ORM) setups.

---

## 1. System Audit: Screen-by-Screen Schema Mapping

We have conducted a thorough audit of the user interfaces to trace active state changes, form submissions, and data views. Each user action is mapped to its relational data contract below.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            C&A PORTAL CLIENT                                │
└──────┬──────────────────┬─────────────────┬─────────────────┬───────────────┘
       │                  │                 │                 │
       ▼                  ▼                 ▼                 ▼
 ┌───────────┐      ┌───────────┐     ┌───────────┐     ┌───────────┐
 │ Dashboard │      │Frameworks │     │Inventory  │     │Governance │
 └─────┬─────┘      └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
       │                  │                 │                 │
       ▼                  ▼                 ▼                 ▼
 ┌───────────┐      ┌───────────┐     ┌───────────┐     ┌───────────┐
 │ Analytics │      │ Standard  │     │ Projects  │     │ Policies, │
 │ Aggregates│      │ Controls  │     │ & Models  │     │ Trainings │
 └───────────┘      └───────────┘     └───────────┘     └───────────┘
```

### 1.1 Dashboard View (`DashboardView.tsx`)
*   **Purpose**: High-level telemetry, actionable alerts, executive KPI aggregates, and progress trackers.
*   **Involved Schemas**: Aggregates from `AIProject`, `RiskRecord`, `ModelRecord`, `Framework`, and `OrganizationalPolicy`.
*   **User Actions**:
    *   Loading visual statistics (compliance rate, open risk breakdown, model gating statuses).
    *   Reading active system-wide notifications and scheduled tasks.
*   **Required Endpoints**:
    *   `GET /api/dashboard/stats`: Returns pre-aggregated telemetry metrics (computed server-side for speed and processing integrity).
    *   `GET /api/dashboard/alerts`: Retrieves active reminders, pending audit actions, or unmitigated risks.

### 1.2 Frameworks View (`FrameworksView.tsx`)
*   **Purpose**: Navigating control structures (ISO 42001, ISO 27001, NIST AI RMF), tracking requirement implementation, uploading evidence.
*   **Involved Schemas**: `Framework`, `FrameworkClause`, `ControlRequirement`, `EvidenceFile`.
*   **User Actions**:
    *   Updating requirement status (e.g. `Implemented`, `In progress`, `Not started`).
    *   Assigning responsibility (`owner`, `reviewer`, `approver`).
    *   Recording notes, setting due dates, and capturing auditor feedback.
    *   Linking specific compliance evidence files (`EvidenceFile`) to requirements.
*   **Required Endpoints**:
    *   `GET /api/frameworks`: Lists active standards and computed completion rates.
    *   `GET /api/frameworks/:frameworkId/requirements`: Fetches full clause and control structures.
    *   `PATCH /api/frameworks/:frameworkId/requirements/:reqId`: Partially updates requirement status, assignees, or comments.
    *   `POST /api/frameworks/:frameworkId/requirements/:reqId/evidence`: Associates an existing `EvidenceFile` ID with a control requirement.
    *   `DELETE /api/frameworks/:frameworkId/requirements/:reqId/evidence/:evidenceId`: Unlinks evidence from a requirement.

### 1.3 Governance View (`GovernanceView.tsx`)
*   **Purpose**: Tracks institutional compliance processes across four distinct domains:
    *   *Organizational Policies*: Listing regulatory drafts, editing metadata, and executing AI-powered policy writing.
    *   *Employee Training*: Cataloging courses, tracking completion metrics, departments, and enrollments.
    *   *Vendor Management*: Vetting third-party AI dependencies, logging risk score evaluations.
    *   *System Incidents*: Logging model drift, security events, bias alerts, and their mitigation lifecycle.
*   **Involved Schemas**: `OrganizationalPolicy`, `TrainingRecord`, `Vendor`, `IncidentRecord`, `PolicyTemplate`.
*   **User Actions**:
    *   Creating, updating, and archiving organization policies.
    *   Generating templates via the server-side Gemini AI Copilot.
    *   Enrolling training courses and updating attendee counts.
    *   Scoring external AI vendors and modifying audit approval statuses.
    *   Registering new AI incidents, triggering triage pipelines, and closing resolved incidents.
*   **Required Endpoints**:
    *   `GET /api/governance/policies` / `POST` / `PUT` / `DELETE` for organizational policies.
    *   `POST /api/copilot/draft-policy`: Invokes the Gemini API (server-side proxy) to generate or iterate on policy drafts.
    *   `GET /api/governance/trainings` / `POST` / `PUT` / `DELETE` for training records.
    *   `GET /api/governance/vendors` / `POST` / `PUT` / `DELETE` for vendor risk files.
    *   `GET /api/governance/incidents` / `POST` / `PATCH` for security and bias logs.

### 1.4 Inventory View (`InventoryView.tsx`)
*   **Purpose**: Tracking active AI systems (Projects) and specific foundational models (Model Registry) deployed inside the enterprise.
*   **Involved Schemas**: `AIProject`, `ModelRecord`, `TeamMember`.
*   **User Actions**:
    *   Registering new AI Projects (selecting geography, industry, risk tier, startup goals, and teams).
    *   Editing project specifications, linking registered models, and recording progress.
    *   Cataloging new models in the registry (specifying vendor, parameter scales, version nodes).
    *   Transitioning model gating statuses through authorization gates (`Pending` ──► `Approved` / `Blocked` / `Restricted`).
*   **Required Endpoints**:
    *   `GET /api/inventory/projects` / `POST` / `PUT` / `DELETE` for AI projects.
    *   `GET /api/inventory/models` / `POST` / `PATCH` / `DELETE` for models in the registry.
    *   `POST /api/inventory/projects/:projectId/models/:modelId`: Maps a model to a project.

### 1.5 Risk Assurance View (`RiskAssuranceView.tsx`)
*   **Purpose**: Active risk calculations (severity, likelihood), mitigation blueprints, compliance reports exportation, and evidence document controls.
*   **Involved Schemas**: `RiskRecord`, `EvidenceFile`, `Folder`, `ComplianceReport`.
*   **User Actions**:
    *   Adding new operational risks to the ledger.
    *   Updating mathematical calculations for inherent and residual risks.
    *   Documenting technical mitigation actions and setting target dates.
    *   Creating new compliance folder structures.
    *   Uploading and previewing evidence documents; deleting evidence files.
    *   Generating compliance assessment reports (PDF or DOCX structure downloads).
*   **Required Endpoints**:
    *   `GET /api/risks` / `POST` / `PUT` / `DELETE` for risk records.
    *   `GET /api/evidence/folders` / `POST` / `DELETE` for directory categorization.
    *   `GET /api/evidence/files` / `POST` / `PATCH` / `DELETE` for evidence document files.
    *   `POST /api/reports/generate`: Generates static downloadable reports (mapped server-side to prevent memory leaks).

### 1.6 Settings View (`SettingsView.tsx`)
*   **Purpose**: Managing team rosters, organizational preferences, risk appetite boundaries, and system metadata.
*   **Involved Schemas**: `Workspace`, `TeamMember`.
*   **User Actions**:
    *   Adding or offboarding workspace collaborators.
    *   Updating corporate profile metadata.
    *   Adjusting general system configuration values.
*   **Required Endpoints**:
    *   `GET /api/workspace` / `PUT` for organization profile.
    *   `GET /api/workspace/team` / `POST` / `PUT` / `DELETE` for managing identity rosters.

---

## 2. API Data Schemas & Validation Models

To guarantee strict compliance with **SOC 2 Type II Processing Integrity**, every entity has its strict type structures detailed below. These representations are designed to map smoothly to PostgreSQL relational tables and Zod input validations.

```
       ┌────────────────────────────────────────────────────────┐
       │                 REQUEST BODY VALIDATOR                 │
       │                   (Zod Schema Engine)                  │
       └───────────────────────────┬────────────────────────────┘
                                   │ Strict Type Checking
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                POSTGRESQL DB ENTITY                    │
       │                 (Drizzle ORM Schema)                   │
       └────────────────────────────────────────────────────────┘
```

### 2.1 Project Schema (`AIProject`)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AIProject",
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "title": { "type": "string", "minLength": 3, "maxLength": 100 },
    "owner": { "type": "string" },
    "status": { "type": "string", "enum": ["Not started", "In progress", "Completed", "Active"] },
    "geography": { "type": "string" },
    "riskClassification": { "type": "string", "enum": ["Minimal", "Limited", "High Risk", "Unacceptable"] },
    "roleType": { "type": "string" },
    "startDate": { "type": "string", "format": "date" },
    "lastUpdated": { "type": "string", "format": "date-time" },
    "framework": { "type": "string" },
    "teamMembers": { "type": "array", "items": { "type": "string" } },
    "goal": { "type": "string", "maxLength": 500 },
    "targetIndustry": { "type": "string" },
    "description": { "type": "string", "maxLength": 2000 },
    "mappedModels": { "type": "array", "items": { "type": "string" } },
    "completedComplianceTasks": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["id", "title", "status", "riskClassification", "description"]
}
```

### 2.2 Model Schema (`ModelRecord`)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ModelRecord",
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "provider": { "type": "string", "minLength": 1 },
    "name": { "type": "string", "minLength": 2, "maxLength": 80 },
    "version": { "type": "string" },
    "status": { "type": "string", "enum": ["Pending", "Approved", "Restricted", "Blocked"] },
    "approver": { "type": "string" },
    "statusDate": { "type": "string", "format": "date" },
    "useCasesCount": { "type": "integer", "minimum": 0 }
  },
  "required": ["id", "provider", "name", "status"]
}
```

### 2.3 Risk Schema (`RiskRecord`)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "RiskRecord",
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "name": { "type": "string", "minLength": 5, "maxLength": 150 },
    "owner": { "type": "string" },
    "severity": { "type": "string", "enum": ["LOW", "MEDIUM", "HIGH", "VERY HIGH", "MAJOR"] },
    "mitigationStatus": { "type": "string", "enum": ["NOT STARTED", "IN PROGRESS", "COMPLETED"] },
    "riskLevel": { "type": "string", "enum": ["NO RISK", "LOW RISK", "MEDIUM RISK", "HIGH RISK", "CRITICAL RISK"] },
    "targetDate": { "type": "string", "format": "date" },
    "description": { "type": "string" },
    "applicableProjects": { "type": "array", "items": { "type": "string" } },
    "applicableFrameworks": { "type": "array", "items": { "type": "string" } },
    "lifecyclePhase": { "type": "string" },
    "categories": { "type": "array", "items": { "type": "string" } },
    "potentialImpact": { "type": "string" },
    "likelihood": { "type": "string" },
    "severityCalc": { "type": "string" },
    "notes": { "type": "string" },
    "mitigationPlan": { "type": "string" },
    "implementationStrategy": { "type": "string" },
    "residualLikelihood": { "type": "string" },
    "residualSeverity": { "type": "string" },
    "residualRiskLevel": { "type": "string" }
  },
  "required": ["id", "name", "severity", "mitigationStatus", "riskLevel"]
}
```

### 2.4 Evidence Schema (`EvidenceFile`)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "EvidenceFile",
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "name": { "type": "string", "minLength": 2, "maxLength": 200 },
    "uploadDate": { "type": "string", "format": "date" },
    "uploader": { "type": "string" },
    "source": { "type": "string" },
    "version": { "type": "string" },
    "status": { "type": "string", "enum": ["Draft", "Under Review", "Approved"] },
    "folderId": { "type": "string" }
  },
  "required": ["id", "name", "uploadDate", "uploader", "status", "folderId"]
}
```

---

## 3. Endpoints Specifications: REST Contract Catalog

Each service interface returned from the backend `/backend` router follows HTTP standards. Default response formats are JSON-encoded. Authentication must be verified via authorization headers (`Authorization: Bearer <jwt>`).

### 3.1 AI Projects API

#### `GET /api/inventory/projects`
*   **Description**: Lists all tracked AI workloads.
*   **Query Parameters**:
    *   `riskClassification` (optional): Filter projects by risk class level.
    *   `status` (optional): Filter projects by status state.
*   **Response (200 OK)**:
    ```json
    [
      {
        "id": "proj-uuid-1",
        "title": "Customer Intent Classifier",
        "owner": "Sarah Jenkins",
        "status": "Active",
        "geography": "EU (Frankfurt)",
        "riskClassification": "High Risk",
        "roleType": "Developer",
        "startDate": "2026-04-10",
        "lastUpdated": "2026-07-20T11:45:00Z",
        "framework": "ISO 42001",
        "teamMembers": ["Demo Assessor", "Sarah Jenkins"],
        "goal": "Classify user support interactions securely.",
        "targetIndustry": "Customer Support",
        "description": "Internal transformer model sorting personal user inbound feedback.",
        "mappedModels": ["model-uuid-2"],
        "completedComplianceTasks": ["4.1", "4.2"]
      }
    ]
    ```

#### `POST /api/inventory/projects`
*   **Description**: Creates a new AI Project.
*   **Request Body**:
    ```json
    {
      "title": "Medical Diagnosis Co-pilot",
      "status": "In progress",
      "riskClassification": "Unacceptable",
      "description": "Medical scanning AI assistant.",
      "geography": "Global",
      "roleType": "Provider",
      "framework": "NIST AI RMF",
      "goal": "Classify and flag visual anomalies on scans.",
      "targetIndustry": "Healthcare"
    }
    ```
*   **Response (201 Created)**: Returns the generated project entity with a system-assigned UUID.

#### `PUT /api/inventory/projects/:id`
*   **Description**: Updates a project's details.
*   **Response (200 OK)**: Returns the fully updated project entity.

#### `DELETE /api/inventory/projects/:id`
*   **Description**: Deletes a project.
*   **Response (204 No Content)**: Empty body confirming removal.

---

### 3.2 Model Registry API

#### `GET /api/inventory/models`
*   **Description**: Fetches all models logged in the central governance register.
*   **Response (200 OK)**: Array of `ModelRecord` objects.

#### `POST /api/inventory/models`
*   **Description**: Registers an algorithmic model.
*   **Request Body**:
    ```json
    {
      "provider": "Anthropic",
      "name": "Claude 3.5 Sonnet",
      "version": "v1.0"
    }
    ```
*   **Response (201 Created)**: Returns the registered model containing default `Pending` gate status and auto-assigned ID.

#### `PATCH /api/inventory/models/:id`
*   **Description**: Performs fine-grained status changes (approvals gating).
*   **Request Body**:
    ```json
    {
      "status": "Approved",
      "approver": "Assessor Demo",
      "statusDate": "2026-07-22"
    }
    ```
*   **Response (200 OK)**: Returns the modified model configuration.

---

### 3.3 Risk Assessment API

#### `GET /api/risks`
*   **Description**: Returns active risk items logged in the Risk Matrix.
*   **Response (200 OK)**: Array of complete `RiskRecord` objects.

#### `POST /api/risks`
*   **Description**: Log a new potential systemic, technical, or legal risk.
*   **Request Body**:
    ```json
    {
      "name": "Data Poisoning Threat",
      "severity": "HIGH",
      "mitigationStatus": "NOT STARTED",
      "riskLevel": "MEDIUM RISK",
      "description": "Risk of adversarial manipulation of active training sets.",
      "targetDate": "2026-09-30",
      "potentialImpact": "Subversion of validation gates.",
      "likelihood": "MEDIUM",
      "severityCalc": "HIGH"
    }
    ```
*   **Response (201 Created)**: Returns the created risk payload.

#### `PUT /api/risks/:id`
*   **Description**: Updates a risk assessment, modifying fields or calculating residual risk levels.
*   **Response (200 OK)**: Fully updated risk metadata.

#### `DELETE /api/risks/:id`
*   **Description**: Purges a risk record from the matrix.
*   **Response (204 No Content)**: Empty response.

---

### 3.4 Evidence File System API

#### `GET /api/evidence/files`
*   **Description**: Lists all audit proofs uploaded into the system workspace.
*   **Query Parameters**:
    *   `folderId` (optional): Filter files by target folder directory.
*   **Response (200 OK)**: Array of `EvidenceFile` values.

#### `POST /api/evidence/files`
*   **Description**: Registers a newly uploaded evidence document.
*   **Request Body** (Multipart / JSON metadata):
    ```json
    {
      "name": "ISO 42001 Policy Signoff.pdf",
      "folderId": "fld-branding"
    }
    ```
*   **Response (201 Created)**: Returns the created file entry.

#### `PATCH /api/evidence/files/:id`
*   **Description**: Updates a document's audit status (e.g., transition `Draft` ──► `Approved`).
*   **Request Body**:
    ```json
    {
      "status": "Approved"
    }
    ```
*   **Response (200 OK)**: Modified file record.

#### `DELETE /api/evidence/files/:id`
*   **Description**: Permanently purges an evidence file.
*   **Response (204 No Content)**: Empty body confirming complete deletion.

---

### 3.5 Compliance Frameworks API

#### `GET /api/frameworks`
*   **Description**: Gets compliance coverage rates across standards (ISO 42001, etc.).
*   **Response (200 OK)**: Array of frameworks with their active progression.

#### `GET /api/frameworks/:frameworkId/requirements`
*   **Description**: Returns full hierarchy of requirements, keys, questions, and descriptions for a framework.
*   **Response (200 OK)**: Fully populated clause data containing `requirements` lists.

#### `PATCH /api/frameworks/:frameworkId/requirements/:reqId`
*   **Description**: Saves audit answers and status modifications to a specific control requirement.
*   **Request Body**:
    ```json
    {
      "status": "Implemented",
      "implementationDescription": "All active developers have completed ISO 42001 ethics training.",
      "owner": "Sarah Jenkins",
      "notes": "Audited on July 20th."
    }
    ```
*   **Response (200 OK)**: Updated requirement configuration.

---

### 3.6 AI Copilot Proxy API

#### `POST /api/copilot/draft-policy`
*   **Description**: Proxies request safely to Google Gemini (using the `gemini-3.5-flash` model), sending the system context instructions along with the dialog state.
*   **Request Body**:
    ```json
    {
      "prompt": "Create an AI security incident response procedure complying with ISO 42001 Annex B.",
      "chatHistory": [
        { "role": "user", "text": "Draft a policy on model transparency." },
        { "role": "model", "text": "### Model Transparency Policy..." }
      ]
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "text": "### AI Security Incident Response Procedure\n\n1. **Objective**...\n2. **Scope**..."
    }
    ```

---

## 4. SOC 2 Compliant API Security & Audit Designs

To build trust and pass a **SOC 2 Type II** audit, the backend enforces structural controls across authentication, input sanitization, and immutable audit trailing.

```
 [CLIENT HTTP REQUEST] ──► API Gateway / JWT Authenticator
                                 │
                                 ▼
                     Role Check (RBAC Middleware)
                                 │
                                 ▼
                    Zod Schema Validation (Zod Engine)
                                 │
                                 ▼
                    Immutable Audit Trail Logger
                                 │
                                 ▼
                    Database Core Operations (PG / RLS)
```

### 4.1 Input Validation Middleware
No payload is directly written to the database without passing through Zod validators. This completely mitigates code injection and data corruption vectors.

```typescript
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation Failed",
          details: error.errors.map(err => ({
            field: err.path.join("."),
            message: err.message
          }))
        });
        return;
      }
      res.status(500).json({ error: "Internal validation exception" });
    }
  };
};
```

### 4.2 Non-Repudiation Audit Trail Middleware
For every state mutation (POST, PUT, PATCH, DELETE), an entry is written directly to an `audit_logs` database table. This provides a clear trail of operations for SOC 2 auditors.

```typescript
import { Request, Response, NextFunction } from "express";

interface AuditLog {
  timestamp: string;
  userId: string;
  userEmail: string;
  ipAddress: string;
  method: string;
  endpoint: string;
  targetId?: string;
  payload: string;
}

export const auditTrailLogger = async (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  
  // Intercept the response to ensure we only log successful mutations
  res.json = function (body) {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && res.statusCode >= 200 && res.statusCode < 300) {
      const logEntry: AuditLog = {
        timestamp: new Date().toISOString(),
        userId: req.user?.id || "anonymous-identity",
        userEmail: req.user?.email || "anonymous@ca-portal.com",
        ipAddress: req.ip || req.headers["x-forwarded-for"]?.toString() || "127.0.0.1",
        method: req.method,
        endpoint: req.originalUrl,
        targetId: req.params.id,
        payload: JSON.stringify(req.body)
      };
      
      // Persist the audit log entry asynchronously to prevent blocking requests
      db.insert(auditLogsTable).values(logEntry).catch((err) => {
        console.error("SOC 2 Audit Logging Failure:", err);
      });
    }
    return originalJson.call(this, body);
  };
  
  next();
};
```

### 4.3 Error Handling & Information Leak Prevention
SOC 2 processing integrity requires secure, predictable error states that do not leak internal database details (such as stack traces or database structure) to the client.

```typescript
import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[SYSTEM ERROR] ${new Date().toISOString()}:`, err.stack);

  const isProduction = process.env.NODE_ENV === "production";
  
  res.status(500).json({
    error: "Internal Server Error",
    message: isProduction 
      ? "An unexpected error occurred. Please contact support." 
      : err.message,
    code: "ERR_INTERNAL_EXCEPTION",
    ...(isProduction ? {} : { stack: err.stack })
  });
};
```

---

## 5. PostgreSQL Database Integration Blueprint

Once mock API iterations are finalized, migrating the backend state engine to a **Cloud SQL for PostgreSQL** instance utilizes the following transition path.

### 5.1 Step 1: Establish Database Migration with Drizzle ORM
1.  Initialize **Drizzle ORM** inside `/backend/db`.
2.  Define entities in `schema.ts` matching `/src/types.ts` types exactly.
3.  Inject connection credentials:
    ```typescript
    import { drizzle } from "drizzle-orm/node-postgres";
    import { Pool } from "pg";
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false
    });
    
    export const db = drizzle(pool);
    ```

### 5.2 Step 2: Implement Row-Level Security (RLS) in PostgreSQL
Enforce direct tenant and department boundaries in the SQL layer so database-level security policies back stop code-level bugs:

```sql
-- Enable Row Level Security on Risk Records
ALTER TABLE risk_records ENABLE ROW LEVEL SECURITY;

-- Create policy allowing members to only select/view their department's risk entries
CREATE POLICY department_isolation_policy ON risk_records
  FOR ALL
  USING (applicable_department = current_setting('app.current_user_department', true));
```

### 5.3 Step 3: Run Incremental Database Migrations
Generate SQL migration statements and apply them to PostgreSQL automatically on container startup:
```bash
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

---

*This document serves as the operational guide for backend engineers developing and implementing GRC capabilities for the C&A Portal.*
