# C&A Portal - Database Strategy & SOC 2 Compliance Design

This document details the backend database recommendation and the early-stage design considerations required to meet **SOC 2 (System and Organization Controls 2)** compliance. 

As an enterprise AI Governance, Risk, and Compliance (GRC) platform, establishing a secure, highly auditable, and resilient infrastructure from the beginning is critical to earning and maintaining customer trust.

---

## 1. Database Architecture: PostgreSQL vs. MySQL

For a compliance and AI registry product, **PostgreSQL is highly recommended** over MySQL as the backend relational database. 

### Why PostgreSQL is the Superior Choice for AI GRC

| Architectural Dimension | PostgreSQL Capabilities | Why It Matters for C&A Portal |
| :--- | :--- | :--- |
| **Semi-Structured AI Metadata** | Native `JSONB` support with indexing (GIN). | AI model registry entries frequently contain complex, non-uniform parameters (e.g., hyperparameter configurations, token limits, model bias test results, prompt templates). PostgreSQL stores these efficiently as indexed JSONB without sacrificing SQL querying speed. |
| **Granular Access Control** | Built-in Row-Level Security (RLS). | Compliance systems require strict tenant isolation and department-level permissions. PostgreSQL RLS allows you to write policies directly in the database layer, ensuring a user from Department A can never accidentally access Risk Records or Evidence belonging to Department B. |
| **Audit Trails & Versioning** | Robust transactional DDL and temporal table patterns. | Compliance regulations (like ISO 42001 and SOC 2) require proof of change control. PostgreSQL supports transactional schema changes and advanced temporal extensions, making it straightforward to build immutable historic audit logs for policies, risk registers, and approval gates. |
| **Data Integrity & Constraints** | Strict ANSI SQL compliance, advanced check constraints, and custom domains. | Compliance data calculations (such as calculating Residual Risk from Likelihood $\times$ Severity) must be deterministic and guarded against corruption. PostgreSQL handles strict data type enforcement, customized constraints, and trigger functions cleanly. |

---

## 2. Achieving SOC 2 Compliance from Day One

SOC 2 audits evaluate an organization's controls based on one or more of five **Trust Services Criteria (TSC)**: *Security, Availability, Processing Integrity, Confidentiality, and Privacy*. 

Designing these controls into the C&A Portal architecture from the start prevents costly code rewrites during your audit readiness assessment.

---

## 3. SOC 2 Trust Services Criteria Mapping

### 3.1 Security (The Common Criteria)
*The system must be protected against unauthorized physical and logical access.*

*   **Identity & Access Management (SSO)**:
    *   Do not implement a custom credentials database. Integrate with enterprise Identity Providers (IDPs) such as **Google Workspace SSO**, **Okta**, or **Microsoft Entra ID** using standard protocols (OIDC / SAML).
    *   Enforce Multi-Factor Authentication (MFA) at the IDP layer.
*   **Role-Based Access Control (RBAC)**:
    *   Define precise roles within the application schema: `Auditor`, `Compliance Lead`, `Developer/Model Owner`, and `Viewer`.
    *   Enforce these scopes at every Express API gateway (`/api/*`) and database query level.
*   **Secure Secrets Management**:
    *   *Never* commit keys (such as `GEMINI_API_KEY` or database credentials) to source control.
    *   Inject configuration credentials at runtime using secure container secret managers (e.g., **Google Cloud Secret Manager** or **AWS Secrets Manager**).
*   **Encrypted Traffic**:
    *   Enforce HTTPS/TLS 1.3 for all traffic in transit.
    *   Configure HTTP Strict Transport Security (HSTS) headers globally in the Express server to prevent downgrading.

### 3.2 Confidentiality
*Information designated as confidential must be protected from disclosure through its entire lifecycle.*

*   **Encryption at Rest**:
    *   Ensure all database disks, cloud storage buckets holding compliance evidence files, and server log stores are encrypted using industry-standard AES-256 keys.
*   **Data Minimization & Deletion**:
    *   Build complete, reliable data-purging actions (like the *Evidence Deletion Flow*). When a user deletes evidence, the file must be deleted from cloud storage buckets and database records permanently (or soft-deleted with an automated hard-purge policy).
*   **Data Masking & Redaction**:
    *   Before sending compliance policies or model descriptions to the Gemini API for analysis, apply sanitization layers to redact Personally Identifiable Information (PII) or internal trade secrets.

### 3.3 Availability
*The system must be online and operationally resilient to meet agreements.*

*   **High-Availability Hosting**:
    *   Deploy the compiled Express server inside stateless container environments (like **Google Cloud Run** or **AWS ECS**) that auto-scale and heal.
*   **Automated Backups**:
    *   Utilize managed databases (such as Cloud SQL for PostgreSQL) to execute daily automated backups with multi-region replication and a 30-day point-in-time recovery window.
*   **Active Health Monitoring**:
    *   Expose dedicated liveness and readiness probes (e.g., `/api/health` endpoint) to ping and monitor server status and database connectivity.

### 3.4 Processing Integrity
*System processing must be complete, valid, accurate, timely, and authorized.*

*   **Form Validation**:
    *   Enforce schema-level model validation (using libraries like `zod`) on both the client and server. Never assume client-side validation is sufficient.
*   **Calculation Auditability**:
    *   Ensure risk calculations, compliance progress rates, and model deployment gates follow auditable mathematical definitions. Keep the grading formulas simple, logical, and transparently documented.

---

## 4. Immediate Architectural Considerations

To ensure the codebase naturally matures into a SOC 2 compliant environment, build the following design patterns into the foundation:

```
                  ┌──────────────────────────────────────────────┐
                  │                 API GATEWAY                  │
                  │   Authentication & OAuth Token Validation    │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │              EXPRESS MIDDLEWARE              │
                  │   RBAC Check ──► Activity Logger (Audit Log) │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │              POSTGRESQL DATABASE             │
                  │   Row-Level Security ──► Encrypted Storage   │
                  └──────────────────────────────────────────────┘
```

1.  **Centralized Activity and Audit Logging**:
    *   Create a dedicated system-wide event logging middleware.
    *   Every destructive or sensitive user action (e.g., policy update, risk status change, model registry approval, evidence deletion) must write a non-repudiable audit log entry containing: `timestamp`, `userId`, `actionPerformed`, `resourceId`, and `ipAddress`.
2.  **Infrastructure as Code (IaC)**:
    *   Define all cloud databases, storage buckets, and server configurations in Terraform. This serves as documented proof to SOC 2 auditors of a predictable, peer-reviewed infrastructure change management workflow.
3.  **CI/CD Pipeline Security**:
    *   Configure automated static application security testing (SAST) and dependency vulnerability checkers (e.g., `npm audit`, Snyk, or GitHub Dependabot) to block builds with critical or high security issues.
4.  **Security-Minded Content Security Policy (CSP)**:
    *   Utilize packages like `helmet` in the Express backend to securely configure HTTP security headers, protecting clients against Cross-Site Scripting (XSS), clickjacking, and MIME sniffing attacks.

---

*For detailed software structural details, refer to the accompanying `architecture.md` file.*
