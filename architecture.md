# C&A Portal - Software Architecture Documentation

This document provides a comprehensive, developer-oriented overview of the software architecture of the **C&A Portal** (Compliance & Assurance Portal), an enterprise AI Governance, Risk, and Compliance (GRC) platform. 

The application is engineered as a secure, full-stack web application designed to help organizations manage AI policies, register algorithmic models, perform quantitative risk assessments, and align operations with key compliance standards (including **ISO 42001**, **ISO 27001**, and **NIST AI RMF**).

---

## 1. System Architecture Overview

C&A Portal uses a cohesive full-stack architecture that blends a responsive, interactive client-side Single Page Application (SPA) with a lightweight, secure Node.js backend.

```
       ┌────────────────────────────────────────────────────────┐
       │                     USER BROWSER                       │
       │                                                        │
       │     ┌────────────────────────────────────────────┐     │
       │     │            Tailwind React SPA              │     │
       │     └─────────────────────┬──────────────────────┘     │
       └───────────────────────────┼────────────────────────────┘
                                   │ HTTPS / JSON API
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                   EXPRESS WEB SERVER                   │
       │                                                        │
       │  ┌────────────────────────┐  ┌──────────────────────┐  │
       │  │   Vite Asset Server /  │  │  AI Copilot Router   │  │
       │  │   Static File Handler  │  │  /api/copilot/*      │  │
       │  └────────────────────────┘  └───────────┬──────────┘  │
       └──────────────────────────────────────────┼─────────────┘
                                                  │ SDK Protocol
                                                  ▼
                                      ┌──────────────────────┐
                                      │  Google Gemini API   │
                                      │  (gemini-3.5-flash)  │
                                      └──────────────────────┘
```

The system comprises two core conceptual tiers:
1. **Frontend Presentation & State Layer (Client)**: A React application configured with Vite and styled via Tailwind CSS, offering instantaneous state transitions, dense informative tables, modular audit modals, and an interactive policy-authoring interface.
2. **Backend Services & Integration Layer (Server)**: An Express server running on Node.js. It performs two duties: serving the compiled static assets in production (or proxying requests via Vite middleware in development) and proxying requests to the Google Gemini API securely, protecting the master `GEMINI_API_KEY` from client exposure.

---

## 2. Frontend Architecture & Design System

The frontend application follows the **Desktop-First Precision** and **Mobile-First Code** design patterns outlined in modern product architectures. It uses high-contrast light styling, mathematically proportional spacing, and modular components to maintain clean division of responsibilities.

### 2.1 Core Presentation Components

All views are rendered dynamically based on an active-view state (`activePage`) inside the master orchestrator, `/src/App.tsx`. 

*   **DashboardView** (`/src/components/DashboardView.tsx`): Displays high-level analytics, key metrics (clause compliance, pending risk statuses, total registered models, and policy draft progress), interactive charts, and actionable task alerts.
*   **FrameworksView** (`/src/components/FrameworksView.tsx`): Orchestrates requirements tracking for ISO 42001, ISO 27001, and NIST AI RMF. Users can navigate control structures, answer key audit questions, record notes, and upload and bind evidence files to specific compliance clauses.
*   **GovernanceView** (`/src/components/GovernanceView.tsx`): Manages central governance domains, containing four sub-tabs:
    *   *Organizational Policies*: Lists existing regulatory policies and hosts the AI-Powered Copilot.
    *   *Employee Training*: Tracks compliance curriculum milestones, departments, completion rates, and provider lists.
    *   *Vendor Management*: Performs third-party AI risk scoring and validation.
    *   *System Incidents*: Logs algorithmic and security anomalies.
*   **InventoryView** (`/src/components/InventoryView.tsx`): Tracks AI workloads. Features dedicated sub-views to manage parent **AI Projects** (with structural geography, target industry, risk classifications, and mapped teams) and **Algorithmic Models** (verifying source providers, versions, usage counts, and strict gating statuses).
*   **RiskAssuranceView** (`/src/components/RiskAssuranceView.tsx`): Features active threat assessment tools, risk matrix registers (evaluating severity and likelihood to calculate residual risk), compliant reports exporter, and an executive evidence repository that supports interactive file previews and complete file deletion.
*   **SettingsView** (`/src/components/SettingsView.tsx`): Configures enterprise profiles, target risk appetites, local workspace metadata, and verifies server environment status.
*   **EvidenceFilePreviewModal** (`/src/components/EvidenceFilePreviewModal.tsx`): A custom multi-purpose document drawer that loads mocked internal document content, presents linked structures, and allows auditors to instantly modify document statuses (`Draft`, `Under Review`, `Approved`).

### 2.2 Client State Orchestration

The application uses a unified, top-down state architecture in `App.tsx`:
*   **Initial State**: Mock data is imported from `src/data.ts` to hydrate initial states on load (e.g., `INITIAL_PROJECTS`, `INITIAL_EVIDENCE`, `INITIAL_TRAININGS`).
*   **Reactivity**: CRUD operations are written as pure functions mutating parent state array hooks (e.g., `handleAddEvidenceFile`, `handleDeleteEvidenceFile`, `handleUpdateEvidenceFileStatus`).
*   **Refinement Loop**: State update handlers are passed down to child modular views as strict property callbacks to keep rendering cycles predictable.

### 2.3 Styling and Icons Guidelines
*   **Utility Classes**: Built exclusively on **Tailwind CSS** with a warm neutral aesthetic (soft slate, indigo and violet highlights, high-contrast typography, and clear visual indicators).
*   **Icons**: Rendered purely using `lucide-react` components to maintain consistency across tables, action lists, and navigations.

---

## 3. Backend & Integration Layer

The server component (`/server.ts`) is designed with Express and operates on standard Node.js runtimes.

### 3.1 AI Copilot Integration

A secure server-side API endpoint (`/api/copilot/draft-policy`) acts as a secure middleware layer to talk to the Google Gemini API. This design keeps credentials out of client exposure.

*   **SDK Protocol**: Utilizes the modern `@google/genai` TypeScript SDK.
*   **Client Configuration**: Initiates an instances of `GoogleGenAI` with `process.env.GEMINI_API_KEY`.
*   **Engine Configuration**: Uses the powerful and fast `gemini-3.5-flash` model, ensuring rapid responses.
*   **System Prompting**: Employs a comprehensive system instruction defining the C&A Copilot as an expert AI GRC consultant. It enforces strict markdown structures, key governance metrics, and mappings to frameworks.
*   **Conversational Continuity**: Captures previous dialogue arrays (`chatHistory`) to allow interactive iterative refinement of the generated drafts.

### 3.2 Routing & Dual-serving Architecture

The Express server handles dual-environments dynamically:
*   **Development**: If `process.env.NODE_ENV` is not set to `"production"`, the server starts an integrated Vite Development Server in `middlewareMode: true` with `appType: "spa"`. All asset compilation, live module bundling, and client requests route through Vite.
*   **Production**: If executing in production, the server serves static build files from the client distribution folder (`/dist`). It also explicitly serves `marketing.html` and uses standard single-page app (SPA) fallback routing (`*`) to load the application `index.html`.

---

## 4. Data Models & Domain Specifications

The type-system is fully detailed in `/src/types.ts`. The primary domain models are:

### 4.1 AIProject
Describes an active artificial intelligence workload or system deployed or under development:
*   `id`: Unique system identifier.
*   `title` & `description`: Project objectives.
*   `status`: System maturity lifecycle state (`Not started` | `In progress` | `Completed` | `Active`).
*   `riskClassification`: Evaluates severity tiering (`Minimal` | `Limited` | `High Risk` | `Unacceptable`).
*   `geography`, `framework`, `roleType`, `startDate`, `lastUpdated`: Audit metrics.
*   `mappedModels`: IDs of associated models from the registry.

### 4.2 ModelRecord
Specifies individual algorithmic systems registered under governance supervision:
*   `id`: Registered model ID.
*   `name`, `provider`, `version`: Model taxonomy.
*   `status`: Current deployment gate (`Pending` | `Approved` | `Restricted` | `Blocked`).
*   `approver`, `statusDate`: Internal authorization path.
*   `useCasesCount`: Quantified application map count.

### 4.3 RiskRecord
Identifies specific operational, privacy, legal, or systemic risks:
*   `id`: Threat identifier.
*   `name`, `description`, `potentialImpact`, `likelihood`: Operational impact metadata.
*   `severityCalc`, `riskLevel`: Quantitative calculated risk vectors.
*   `mitigationStatus`: Active mitigation milestone (`NOT STARTED` | `IN PROGRESS` | `COMPLETED`).
*   `mitigationPlan`, `implementationStrategy`: Technical resolution guides.

### 4.4 EvidenceFile
Represents documentation uploaded by stakeholders to validate compliance implementation:
*   `id`: Cryptographic identification string.
*   `name`, `uploadDate`, `uploader`, `version`: Verification details.
*   `status`: Audit review phase (`Draft` | `Under Review` | `Approved`).
*   `folderId`: Target document bucket.

---

## 5. Main Interaction and Data Flows

### 5.1 Evidence Lifecycle Flow

The creation, status update, and disposal of compliance proof documents are handled as follows:

```
 [User Upload / Add] ──► Local State Array ──► Framework Map (Linked to ISO requirement)
                                                    │
                                                    ▼
   [Delete Action] ◄─── State Filtering (removes file) ◄─── [Preview & Status Edit Modal]
```

1.  **Add**: Users add proof from the Framework or Inventory views, triggering `onAddEvidenceFile` which updates the local state array.
2.  **Preview**: The preview handler (`onPreviewFile`) activates a global modal presenting dummy contents. Auditors can dynamically review or verify compliance proofs and update the state to `Approved`.
3.  **Delete**: Triggering the *Delete* action prompts a verification request; confirmation executes `onDeleteEvidenceFile`, unlinking evidence from any associated project structures and cleanly removing it from memory state.

### 5.2 Interactive Copilot Flow

Iterative drafting of complex policies uses the following flow:

```
  1. Input Goal & Frameworks ──► 2. Express Backend API (/api/copilot/draft-policy)
                                                     │
                                                     ▼
  4. Display & Iterative Chat ◄─── 3. Gemini Flash Generation (System Prompts Applied)
```

1.  **Request**: Users describe policy objectives in the Copilot UI, selecting compliance standards.
2.  **Delivery**: The payload is sent via a POST request containing structural settings and active `chatHistory`.
3.  **Synthesis**: The server validates credentials, applies system-level formatting instructions, invokes the Gemini API, and returns raw Markdown.
4.  **Refinement**: The client renders the Markdown, adding the returned draft to the session chat history for subsequent follow-up queries.

---

## 6. Build and Environment Configuration

### 6.1 Package Scripts (`package.json`)
*   `npm run dev`: Executes backend server compilation on-the-fly utilizing `tsx server.ts`.
*   `npm run build`: Dual-stage build script compiling front-end static files via `vite build` followed by a server-side build. `esbuild` bundles `/server.ts` into a self-contained, high-performance CommonJS file at `/dist/server.cjs` targeting Node environments.
*   `npm run start`: Runs the compiled build in standalone production container environments using `node dist/server.cjs`.

### 6.2 Application Settings (`metadata.json`)
*   Declares application name, descriptions, and capabilities.
*   Maintains the `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` configuration parameter to indicate that model requests are safely proxied through backend routes.

---

*C&A Portal is built with React 18, Vite, Express, and Google Gemini AI services.*
