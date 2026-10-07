import { 
  AIProject, 
  ModelRecord, 
  RiskRecord, 
  EvidenceFile, 
  Folder, 
  ComplianceReport, 
  Vendor, 
  TrainingRecord, 
  IncidentRecord, 
  TeamMember,
  Framework,
  OrganizationalPolicy
} from "../../src/types";

// In-Memory Database Store Hydrated with Initial Core Records
export class MockDatabase {
  public projects: AIProject[] = [
    {
      id: "proj-1",
      title: "Credit Risk Scoring Engine",
      owner: "You",
      status: "Active",
      geography: "US East (N. Virginia)",
      riskClassification: "High Risk",
      roleType: "Developer",
      startDate: "2026-01-15",
      lastUpdated: "2026-07-20",
      framework: "ISO 42001",
      teamMembers: ["You", "Alice Vance"],
      goal: "Automate loan scoring decisions safely and with high explanation accuracy.",
      targetIndustry: "Financial Services",
      description: "Neural network model analyzing financial parameters to recommend loan rates.",
      mappedModels: ["model-1"],
      completedComplianceTasks: ["4.1", "4.2"]
    },
    {
      id: "proj-2",
      title: "Customer Support Chatbot",
      owner: "Sarah Jenkins",
      status: "In progress",
      geography: "Global Cloud CDN",
      riskClassification: "Limited",
      roleType: "Provider",
      startDate: "2026-04-10",
      lastUpdated: "2026-07-15",
      framework: "NIST AI RMF",
      teamMembers: ["Sarah Jenkins", "Bob Miller"],
      goal: "Provide 24/7 conversational customer assistance.",
      targetIndustry: "Customer Operations",
      description: "Generative model built on fine-tuned LLaMA-3 models with guardrails for conversational integrity.",
      mappedModels: ["model-2"],
      completedComplianceTasks: ["govern-1"]
    }
  ];

  public models: ModelRecord[] = [
    {
      id: "model-1",
      name: "FinScore-Net v2.1",
      provider: "Internal Development",
      version: "v2.1.4",
      status: "Approved",
      approver: "Demo Assessor",
      statusDate: "2026-03-01",
      useCasesCount: 1
    },
    {
      id: "model-2",
      name: "SupportLLaMA-8B-Instruct",
      provider: "Meta AI / Fine-tuned",
      version: "v1.0.2",
      status: "Pending",
      approver: "Unassigned",
      statusDate: "2026-04-10",
      useCasesCount: 1
    },
    {
      id: "model-3",
      name: "Gemini 1.5 Pro (Workspace API Proxy)",
      provider: "Google Cloud",
      version: "Stable-002",
      status: "Approved",
      approver: "AI Governance Board",
      statusDate: "2026-05-18",
      useCasesCount: 4
    }
  ];

  public risks: RiskRecord[] = [
    {
      id: "risk-1",
      name: "Algorithmic Loan Disparity Bias",
      owner: "Alice Vance",
      severity: "HIGH",
      mitigationStatus: "IN PROGRESS",
      riskLevel: "HIGH RISK",
      targetDate: "2026-08-31",
      description: "Historical data could bias the credit scoring engine against specific geographic demographics.",
      applicableProjects: ["proj-1"],
      applicableFrameworks: ["ISO 42001"],
      lifecyclePhase: "Testing & Validation",
      categories: ["Bias & Fairness"],
      potentialImpact: "Regulatory penalties under fair lending laws and severe brand damage.",
      likelihood: "HIGH",
      severityCalc: "HIGH",
      notes: "Demographic parity checks scheduled weekly.",
      mitigationPlan: "Enforce demographic parity metrics and implement adversarial de-biasing during network training.",
      implementationStrategy: "Incorporate Fairlearn checks directly into our active Jenkins deployment validation pipeline."
    },
    {
      id: "risk-2",
      name: "Hallucinated Financial Recommendations",
      owner: "Sarah Jenkins",
      severity: "HIGH",
      mitigationStatus: "IN PROGRESS",
      riskLevel: "CRITICAL RISK",
      targetDate: "2026-07-28",
      description: "Chatbot could hallucinate inaccurate banking or product claims to clients.",
      applicableProjects: ["proj-2"],
      applicableFrameworks: ["NIST AI RMF"],
      lifecyclePhase: "Production & Deployment",
      categories: ["Security & Robustness", "Transparency"],
      potentialImpact: "Exposure to compliance actions and misleading customer transactions.",
      likelihood: "VERY HIGH",
      severityCalc: "HIGH",
      notes: "RAG verification database is actively audited daily.",
      mitigationPlan: "Configure a semantic retrieval context verification layer and strict system directives.",
      implementationStrategy: "Deploy NeMo Guardrails on all output endpoints to run real-time semantic hallucination checks."
    }
  ];

  public folders: Folder[] = [
    { id: "fld-branding", name: "Corporate Identity" },
    { id: "fld-feedback", name: "Feedback Logs" },
    { id: "fld-linkedin", name: "Social Assets" },
    { id: "fld-uncategorized", name: "Uncategorized" }
  ];

  public evidence: EvidenceFile[] = [
    { id: "ev-1", name: "Chat Feedback 1", uploadDate: "2026-04-21", uploader: "You", source: "Not linked", version: "v1.0", status: "Draft", folderId: "fld-feedback" },
    { id: "ev-2", name: "LI Profile Demo", uploadDate: "2026-04-21", uploader: "You", source: "Not linked", version: "v1.0", status: "Draft", folderId: "fld-linkedin" },
    { id: "ev-3", name: "AI Governance Square Logo", uploadDate: "2026-04-21", uploader: "You", source: "Not linked", version: "v1.0", status: "Draft", folderId: "fld-branding" },
    { id: "ev-4", name: "Webinar@aigovernance.org", uploadDate: "2026-04-21", uploader: "You", source: "Not linked", version: "v1.0", status: "Draft", folderId: "fld-uncategorized" },
    { id: "ev-5", name: "Offer Page - shop.aigovernance.org", uploadDate: "2026-04-21", uploader: "You", source: "Not linked", version: "v1.0", status: "Draft", folderId: "fld-uncategorized" }
  ];

  public trainings: TrainingRecord[] = [
    { id: "tr-1", name: "Introduction to AI Ethics & ISO 42001", duration: "3 hours", provider: "AI Governance Academy", department: "Compliance", status: "Completed", peopleCount: 24, description: "Basic concepts of responsible AI design and standard alignment." },
    { id: "tr-2", name: "NIST Risk Management Implementation Guide", duration: "1 day", provider: "NIST Vendor Training", department: "Engineering", status: "In progress", peopleCount: 15, description: "How to trace and map algorithmic biases through functional engineering gates." }
  ];

  public vendors: Vendor[] = [
    { id: "ven-1", name: "Anthropic PBC", website: "anthropic.com", projects: "Claude APIs Integration", reviewStatus: "Approved", score: "94/100", assignee: "You", reviewDate: "2026-05-12" },
    { id: "ven-2", name: "Pinecone Systems Inc", website: "pinecone.io", projects: "Vector Index VectorStore", reviewStatus: "Under Review", score: "88/100", assignee: "Sarah Jenkins", reviewDate: "2026-06-01" }
  ];

  public incidents: IncidentRecord[] = [
    { id: "inc-1", project: "Credit Risk Scoring Engine", type: "Model Drift Bias Spike", severity: "SERIOUS", status: "Investigating", occurred: "2026-07-10", approvedBy: "Sarah Jenkins" },
    { id: "inc-2", project: "Customer Support Chatbot", type: "Hallucinated Policy Leak", severity: "MODERATE", status: "Mitigated", occurred: "2026-06-18", approvedBy: "You" }
  ];

  public workspaceMembers: TeamMember[] = [
    { id: "m-1", name: "Demo Assessor", email: "assessor@ca-portal.com", role: "Auditor", joinedDate: "2026-01-01", isYou: false },
    { id: "m-2", name: "Sarah Jenkins", email: "sarah.j@ca-portal.com", role: "Editor", joinedDate: "2026-02-15", isYou: false },
    { id: "m-3", name: "Alice Vance", email: "alice.v@ca-portal.com", role: "Reviewer", joinedDate: "2026-03-01", isYou: false },
    { id: "m-4", name: "You", email: "yan.aung@gmail.com", role: "Admin", joinedDate: "2026-01-01", isYou: true }
  ];

  public policies: OrganizationalPolicy[] = [
    { id: "pol-1", title: "Enterprise Algorithmic Transparency Directive", status: "Published", tags: ["ISO 42001", "Transparency"], teamSize: 24, nextReview: "2027-01-15", lastUpdated: "2026-01-15", content: "# Enterprise Algorithmic Transparency Directive\n\n## 1. Scope\nThis policy applies to all machine learning workloads deployed globally within our organization..." },
    { id: "pol-2", title: "AI Ethical Alignment and Fairness Policy", status: "Under review", tags: ["ISO 42001", "Ethics"], teamSize: 12, nextReview: "2026-12-01", lastUpdated: "2026-05-20", content: "# AI Ethical Alignment and Fairness Policy\n\n## 1. Objective\nEnsure all production algorithms prevent unfair discrimination and ensure demographic fairness..." }
  ];

  public frameworks: Framework[] = [
    {
      id: "iso-42001",
      name: "ISO/IEC 42001:2023 AI Management System",
      progress: 66,
      clauses: [
        {
          id: "4",
          title: "Context of the Organization",
          type: "clause",
          requirements: [
            {
              id: "4.1",
              title: "Understanding the organization and its context",
              summary: "Determine external and internal issues relevant to your purpose.",
              keyQuestions: ["Are systemic AI boundary limits established?", "Has the legal terrain been cataloged?"],
              evidenceExamples: ["Corporate scope documentation", "Stakeholder map"],
              implementationDescription: "Defined context mapping and documented in our internal transparency records.",
              status: "Implemented",
              owner: "Alice Vance",
              reviewer: "Demo Assessor",
              approver: "AI Governance Board",
              dueDate: "2026-04-01",
              auditorFeedback: "Context clearly aligns with active goals.",
              notes: "Aligned with ISO standards."
            }
          ]
        }
      ]
    }
  ];
}

export const db = new MockDatabase();
