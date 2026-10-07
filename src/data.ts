import {
  Workspace,
  AIProject,
  ModelRecord,
  RiskRecord,
  EvidenceFile,
  Folder,
  ComplianceReport,
  Vendor,
  TrainingRecord,
  PolicyTemplate,
  OrganizationalPolicy,
  IncidentRecord,
  TeamMember,
  FrameworkClause,
  ControlRequirement
} from "./types";

export const INITIAL_WORKSPACES: Workspace[] = [
  { id: "ws-1", name: "Certification and Accreditation", role: "Admin", email: "assessor@demo.com" },
  { id: "ws-2", name: "Alpha AI Consulting", role: "Partner", email: "assessor@alphaai.com" }
];

export const INITIAL_TEAM: TeamMember[] = [
  { id: "tm-1", workspaceId: "ws-1", name: "Demo Assessor", email: "assessor@demo.com", role: "Admin", joinedDate: "20 Apr 2026", isYou: true },
  { id: "tm-2", workspaceId: "ws-1", name: "Leo Vance", email: "wavicky576@gmail.com", role: "Editor", joinedDate: "24 Apr 2026" },
  { id: "tm-3", workspaceId: "ws-1", name: "Mark Taylor", email: "muhammadfaazkarim@gmail.com", role: "Editor", joinedDate: "25 Apr 2026" },
  { id: "tm-4", workspaceId: "ws-1", name: "Dr. Sarah Jenkins", email: "sarah.jenkins@compliance-audit.org", role: "Auditor", joinedDate: "28 Apr 2026" },
  
  // Alpha AI Consulting Team
  { id: "tm-ac-1", workspaceId: "ws-2", name: "Partner Assessor", email: "assessor@alphaai.com", role: "Admin", joinedDate: "15 Jan 2026", isYou: true },
  { id: "tm-ac-2", workspaceId: "ws-2", name: "Elena Rostova", email: "elena.rostova@aigovernance.io", role: "Reviewer", joinedDate: "01 May 2026" },
  { id: "tm-ac-3", workspaceId: "ws-2", name: "David K. Chen", email: "david.chen@enterprise-ai.com", role: "Editor", joinedDate: "02 May 2026" },
  { id: "tm-ac-4", workspaceId: "ws-2", name: "Amara Okafor", email: "amara.okafor@aigovernance.org", role: "Editor", joinedDate: "04 May 2026" },
  { id: "tm-ac-5", workspaceId: "ws-2", name: "Marcus Thorne", email: "marcus.thorne@cert-global.com", role: "Auditor", joinedDate: "05 May 2026" }
];

export const INITIAL_FOLDERS: Folder[] = [
  { id: "fld-all", workspaceId: "ws-1", name: "All files" },
  { id: "fld-uncategorized", workspaceId: "ws-1", name: "Uncategorized" },
  { id: "fld-images", workspaceId: "ws-1", name: "Images" },
  { id: "fld-branding", workspaceId: "ws-1", name: "Branding" },
  { id: "fld-linkedin", workspaceId: "ws-1", name: "LinkedIn" },
  { id: "fld-feedback", workspaceId: "ws-1", name: "Chat Feedback" },

  { id: "fld-ac-all", workspaceId: "ws-2", name: "All files" },
  { id: "fld-ac-hipaa", workspaceId: "ws-2", name: "HIPAA Audits" },
  { id: "fld-ac-client", workspaceId: "ws-2", name: "Client Contracts" }
];

export const INITIAL_EVIDENCE: EvidenceFile[] = [
  { id: "ev-1", workspaceId: "ws-1", name: "Chat Feedback 1", uploadDate: "Apr 21, 2026", uploader: "You", source: "Not linked", version: "v1.0", status: "Draft", folderId: "fld-feedback" },
  { id: "ev-2", workspaceId: "ws-1", name: "LI Profile Demo", uploadDate: "Apr 21, 2026", uploader: "You", source: "Not linked", version: "v1.0", status: "Draft", folderId: "fld-linkedin" },
  { id: "ev-3", workspaceId: "ws-1", name: "AI Governance Square Logo", uploadDate: "Apr 21, 2026", uploader: "You", source: "Not linked", version: "v1.0", status: "Draft", folderId: "fld-branding" },
  { id: "ev-4", workspaceId: "ws-1", name: "Webinar@aigovernance.org", uploadDate: "Apr 21, 2026", uploader: "You", source: "Not linked", version: "v1.0", status: "Draft", folderId: "fld-uncategorized" },
  { id: "ev-5", workspaceId: "ws-1", name: "Offer Page - shop.aigovernance.org", uploadDate: "Apr 21, 2026", uploader: "You", source: "Not linked", version: "v1.0", status: "Draft", folderId: "fld-uncategorized" },

  // Alpha AI Consulting Evidence
  { id: "ev-ac-1", workspaceId: "ws-2", name: "Alpha AI HIPAA Compliance Audit Report 2026.pdf", uploadDate: "May 02, 2026", uploader: "Partner Assessor", source: "External Audit", version: "v2.0", status: "Approved", folderId: "fld-ac-hipaa" },
  { id: "ev-ac-2", workspaceId: "ws-2", name: "Client Advisory Data Handling & NDA Terms.pdf", uploadDate: "Apr 18, 2026", uploader: "Partner Assessor", source: "Legal Team", version: "v1.1", status: "Approved", folderId: "fld-ac-client" }
];

export const INITIAL_PROJECTS: AIProject[] = [
  {
    id: "UC-20",
    title: "Customer Churn Prediction Model",
    owner: "Demo Assessor",
    status: "Active",
    geography: "North America",
    riskClassification: "Limited",
    roleType: "Provider",
    startDate: "2 May 2026",
    lastUpdated: "1 May 2026",
    framework: "ISO 42001",
    teamMembers: ["Demo Assessor", "Leo Vance"],
    goal: "Predict customer churn probability with high accuracy using historical interaction data.",
    targetIndustry: "Telecommunications",
    description: "An XGBoost-based customer classification model integrated with sales dashboards.",
    systemReport: {
      nameOfInitiative: "Customer Retention AI Engine",
      businessOwnerName: "Demo Assessor",
      stakeholdersNames: "Leo Vance, Mark Taylor, Sarah Jenkins",
      systemOverviewDiagram: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="800" height="400" fill="%23f8fafc" rx="16"/><rect x="20" y="20" width="760" height="360" fill="%23ffffff" stroke="%23e2e8f0" stroke-width="2" rx="12"/><text x="40" y="55" font-family="sans-serif" font-size="18" font-weight="bold" fill="%231e293b">SYSTEM OVERVIEW ARCHITECTURE DIAGRAM</text><text x="40" y="78" font-family="sans-serif" font-size="12" fill="%2364748b">SOC 2 %26 ISO 42001 Governance Scope — Churn Prediction AI Pipeline</text><g transform="translate(40, 110)"><rect width="180" height="220" fill="%23eff6ff" stroke="%23bfdbfe" stroke-width="1.5" rx="10"/><text x="15" y="30" font-family="sans-serif" font-size="14" font-weight="bold" fill="%231e40af">1. Ingestion Layer</text><rect x="15" y="50" width="150" height="40" fill="%23ffffff" stroke="%2393c5fd" rx="6"/><text x="25" y="75" font-family="sans-serif" font-size="11" font-weight="600" fill="%231e3a8a">Snowflake Data WH</text><rect x="15" y="100" width="150" height="40" fill="%23ffffff" stroke="%2393c5fd" rx="6"/><text x="25" y="125" font-family="sans-serif" font-size="11" font-weight="600" fill="%231e3a8a">PostgreSQL DB</text><rect x="15" y="150" width="150" height="40" fill="%23ffffff" stroke="%2393c5fd" rx="6"/><text x="25" y="175" font-family="sans-serif" font-size="11" font-weight="600" fill="%231e3a8a">CRM Interaction Logs</text></g><path d="M 230 220 L 270 220" stroke="%233b82f6" stroke-width="3"/><g transform="translate(280, 110)"><rect width="200" height="220" fill="%23f0fdf4" stroke="%23bbf7d0" stroke-width="1.5" rx="10"/><text x="15" y="30" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23166534">2. Processing %26 ML</text><rect x="15" y="50" width="170" height="40" fill="%23ffffff" stroke="%2386efac" rx="6"/><text x="25" y="75" font-family="sans-serif" font-size="11" font-weight="600" fill="%2314532d">Feature Pipeline (Airflow)</text><rect x="15" y="100" width="170" height="40" fill="%23ffffff" stroke="%2386efac" rx="6"/><text x="25" y="125" font-family="sans-serif" font-size="11" font-weight="600" fill="%2314532d">Vertex AI XGBoost Endpoint</text><rect x="15" y="150" width="170" height="40" fill="%23ffffff" stroke="%2386efac" rx="6"/><text x="25" y="175" font-family="sans-serif" font-size="11" font-weight="600" fill="%2314532d">Model Registry %26 Auditing</text></g><path d="M 490 220 L 530 220" stroke="%2322c55e" stroke-width="3"/><g transform="translate(540, 110)"><rect width="200" height="220" fill="%23faf5ff" stroke="%23e9d5ff" stroke-width="1.5" rx="10"/><text x="15" y="30" font-family="sans-serif" font-size="14" font-weight="bold" fill="%236b21a8">3. Downstream CRM</text><rect x="15" y="50" width="170" height="40" fill="%23ffffff" stroke="%23d8b4fe" rx="6"/><text x="25" y="75" font-family="sans-serif" font-size="11" font-weight="600" fill="%23581c87">Salesforce CRM API</text><rect x="15" y="100" width="170" height="40" fill="%23ffffff" stroke="%23d8b4fe" rx="6"/><text x="25" y="125" font-family="sans-serif" font-size="11" font-weight="600" fill="%23581c87">Account Manager Portal</text><rect x="15" y="150" width="170" height="40" fill="%23ffffff" stroke="%23d8b4fe" rx="6"/><text x="25" y="175" font-family="sans-serif" font-size="11" font-weight="600" fill="%23581c87">Automated Alert Triggers</text></g></svg>'
    },
    overview: {
      descriptionOfInitiative: "Machine learning classifier designed to identify accounts with high churn probability before contract renewals.",
      natureOfInformationHandled: "Customer account transaction logs, billing history, support interaction frequencies, and usage telemetry.",
      informationClassification: "SENSITIVE",
      impactConfidentialityBreached: "Major",
      impactConfidentialityBreachedDescription: "Potential unauthorized exposure of customer usage patterns and financial tiering.",
      impactIntegrityBreached: "Major",
      impactIntegrityBreachedDescription: "Model corruption could lead to inaccurate customer scoring and misallocated marketing interventions.",
      impactAvailabilityBreached: "Moderate",
      impactAvailabilityBreachedDescription: "Temporary outage degrades real-time portal recommendation widgets."
    },
    descriptionOfSystems: {
      scope: "Full model pipeline including data ingestion, feature store, XGBoost inference microservice, and CRM dashboard integration.",
      previouslyCertifiedAndUnchangedComponents: "Core PostgreSQL customer database and Okta SSO authentication layer.",
      outOfScope: "Legacy billing processing system and third-party SMS delivery gateway.",
      decommissioning: "Legacy heuristic rule engine scheduled for sunsetting Q4 2026.",
      integratedSubsystemOrServices: "Snowflake Data Warehouse, Vertex AI Endpoint Service, Salesforce CRM API.",
      actorsExternalUsers: "End customers receiving targeted retention offers.",
      actorsEndUserDevices: "Web browser dashboards used by Account Managers.",
      actorsInternalUsers: "Data Science Team, Customer Success Representatives."
    },
    summaryOfBusinessProcess: {
      summaryOfBusinessProcess: "Nightly ETL extracts usage logs, transforms features, passes inputs through Vertex AI XGBoost endpoint, and posts churn risk scores to CRM records.",
      geographicLocationOfData: "AWS us-east-1 (Primary) and us-west-2 (Failover)",
      natureOfCloudServiceModel: "PaaS",
      independentCertifications: "ISO 27001, SOC 2 Type II, ISO 42001",
      cloudPlatformServices: "Google Vertex AI, AWS S3, Snowflake Cloud Data Warehouse",
      publiclyAccessible: "No"
    },
    assessmentScope: {
      securityScope: "Full Scope",
      securityScopeDescription: "End-to-end encryption in transit (TLS 1.3) and at rest (AES-256) across inference microservices.",
      privacyScope: "Full Scope",
      privacyScopeDescription: "PII masking and anonymization applied prior to model ingestion.",
      humanRightsAndEthicsScope: "Limited Scope",
      humanRightsAndEthicsScopeDescription: "Fairness and demographic bias audits conducted bi-annually.",
      informationManagementScope: "Full Scope",
      informationManagementScopeDescription: "Strict data retention policies with 90-day feature cache purge cycles."
    },
    summaryOfFindings: {
      findingsSecurity: "All API endpoints enforced with mTLS and IAM role-based access control. No public egress permitted.",
      findingsPrivacy: "Data minimization verified. Direct customer identifiers replaced with hashed UUIDs.",
      findingsHumanRights: "Low risk of discrimination across evaluated user cohorts.",
      findingsEthics: "Model explainability via SHAP values integrated directly into account manager views.",
      findingsInformationManagement: "Automated audit logging active for all model predictions and feature inputs."
    },
    commentaryOnRiskProfile: {
      commentaryOnRiskProfile: "Overall risk profile is well-managed under Limited AI Risk classification with ongoing ISO 42001 control monitoring.",
      riskAcceptance: "Residual risk accepted by Chief Risk Officer on May 1, 2026."
    },
    remediationPlan: {
      preGoLive: [
        {
          id: "rem-pre-1",
          controlNo: "CC-2.1",
          controlName: "Encryption at Rest",
          remediationDescription: "Enable AES-256 encryption for all production database volumes.",
          risks: "High",
          manager: "M. Chen (Eng)",
          targetDate: "2024-02-28"
        }
      ],
      postGoLive: [
        {
          id: "rem-post-1",
          controlNo: "CC-1.2",
          controlName: "Access Revocation SLA",
          remediationDescription: "Implement automated script to disable user accounts across all internal systems within 24 hours of termination.",
          risks: "Medium",
          manager: "J. Smith (IT)",
          targetDate: "2024-03-15"
        },
        {
          id: "rem-post-2",
          controlNo: "CC-6.1",
          controlName: "Vulnerability Scanning",
          remediationDescription: "Procure and configure an automated vulnerability scanner for external-facing assets. Schedule weekly scans.",
          risks: "High",
          manager: "A. Patel (Sec)",
          targetDate: "2024-04-01"
        }
      ],
      acceptedRisks: [
        {
          id: "rem-acc-1",
          controlNo: "CC-8.1",
          controlName: "Legacy API Auth",
          justification: "Legacy system uses static API keys; migration to OAuth 2.0 deferred due to cost.",
          residualRisk: "Medium",
          approver: "R. Taylor (CTO)",
          reviewDate: "2024-12-31"
        }
      ]
    }
  },
  {
    id: "UC-10",
    title: "Create Meta Ad Images",
    owner: "Leo Vance",
    status: "Completed",
    geography: "Global",
    riskClassification: "Minimal",
    roleType: "Both",
    startDate: "19 Mar 2026",
    lastUpdated: "22 Apr 2026",
    framework: "None",
    teamMembers: ["Leo Vance"],
    goal: "Generate optimized promotional image drafts for social media campaigns.",
    targetIndustry: "Marketing",
    description: "Diffusion-model-based pipeline generating tailored visual layouts for ad testing."
  },
  {
    id: "UC-9",
    title: "Voice agents to cold call Government",
    owner: "Demo Assessor",
    status: "In progress",
    geography: "Federal",
    riskClassification: "Minimal",
    roleType: "Both",
    startDate: "18 Mar 2026",
    lastUpdated: "21 Apr 2026",
    framework: "NIST AI RMF",
    teamMembers: ["Demo Assessor", "Mark Taylor"],
    goal: "Automate outbound regulatory inquiries via highly natural speech agents.",
    targetIndustry: "Government",
    description: "Conversational text-to-speech agents optimized for cold inquiries and data collection."
  },
  {
    id: "UC-8",
    title: "Voice Agent for Virtual Training Room",
    owner: "Mark Taylor",
    status: "In progress",
    geography: "EU",
    riskClassification: "Minimal",
    roleType: "Both",
    startDate: "14 Apr 2026",
    lastUpdated: "21 Apr 2026",
    framework: "ISO 42001",
    teamMembers: ["Mark Taylor"],
    goal: "Provide simulated interactive client responses in professional development drills.",
    targetIndustry: "Education / HR",
    description: "Real-time speech system playing multiple buyer personas to train sales specialists."
  },
  {
    id: "UC-6",
    title: "AI Governance News Aggregator",
    owner: "Leo Vance",
    status: "Active",
    geography: "Global",
    riskClassification: "Minimal",
    roleType: "Both",
    startDate: "20 Apr 2026",
    lastUpdated: "20 Apr 2026",
    framework: "NIST AI RMF",
    teamMembers: ["Leo Vance", "Mark Taylor"],
    goal: "Scrape and summarize public regulatory shifts and policy news regarding AI globally.",
    targetIndustry: "Compliance",
    description: "Vector search database compiling AI GRC updates daily from news feeds."
  },
  {
    id: "UC-5",
    title: "AI Voice Generation for Courses",
    owner: "Demo Assessor",
    status: "Completed",
    geography: "Global",
    riskClassification: "Limited",
    roleType: "Both",
    startDate: "20 Apr 2026",
    lastUpdated: "20 Apr 2026",
    framework: "SOC 2",
    teamMembers: ["Demo Assessor"],
    goal: "Synthesize high-fidelity voice overs for online training slide decks in 12 languages.",
    targetIndustry: "E-Learning",
    description: "Multilingual text-to-speech converter using customized professional voice clones."
  },

  // Alpha AI Consulting Projects
  {
    id: "AC-101",
    workspaceId: "ws-2",
    title: "Healthcare Patient Intake Summarizer",
    owner: "Partner Assessor",
    status: "Active",
    geography: "North America",
    riskClassification: "High Risk",
    roleType: "Deployer",
    startDate: "10 Feb 2026",
    lastUpdated: "08 May 2026",
    framework: "ISO 42001",
    teamMembers: ["Partner Assessor", "Dr. Sarah Jenkins"],
    goal: "Summarize unstructured patient intake notes with HIPAA privacy compliance safeguards.",
    targetIndustry: "Healthcare",
    description: "An LLM-driven patient clinical intake note summarization pipeline integrated with EHR."
  },
  {
    id: "AC-102",
    workspaceId: "ws-2",
    title: "Wealth Advisory Portfolio Chatbot",
    owner: "Elena Rostova",
    status: "In progress",
    geography: "Global",
    riskClassification: "Limited",
    roleType: "Provider",
    startDate: "01 Mar 2026",
    lastUpdated: "02 May 2026",
    framework: "NIST AI RMF",
    teamMembers: ["Elena Rostova", "David K. Chen"],
    goal: "AI-assisted investment portfolio allocation and advice summarizer.",
    targetIndustry: "Financial Services",
    description: "RAG-enhanced wealth advisory assistant providing customized market summaries."
  },
  {
    id: "AC-103",
    workspaceId: "ws-2",
    title: "Supply Chain Demand Forecaster",
    owner: "David K. Chen",
    status: "Active",
    geography: "Europe",
    riskClassification: "Minimal",
    roleType: "Provider",
    startDate: "15 Jan 2026",
    lastUpdated: "20 Apr 2026",
    framework: "SOC 2",
    teamMembers: ["David K. Chen"],
    goal: "Predict regional inventory demands using time-series gradient boosting.",
    targetIndustry: "Logistics",
    description: "Automated inventory optimization engine for multi-region retail distribution."
  }
];

export const INITIAL_MODELS: ModelRecord[] = [
  {
    id: "mod-claude-3-7-sonnet",
    workspaceId: "ws-1",
    provider: "Anthropic",
    name: "Claude 3.7 Sonnet (Hybrid Reasoning)",
    version: "20250219",
    status: "Approved",
    approver: "Lead Security Architect",
    statusDate: "19-02-2025",
    useCasesCount: 4,
    securityScore: 98,
    zeroDataRetention: true,
    trainingOptOut: true,
    soc2Certified: true,
    iso27001Certified: true,
    hipaaCompliant: true,
    euAiActTier: "GPAI with Systemic Risk",
    dataResidency: "US, EU (Multi-Region via Bedrock & Vertex AI)",
    assessmentDate: "2025-02-20",
    recommendedStatus: "Approved",
    riskLevel: "LOW",
    notes: "Anthropic's latest hybrid reasoning foundation model. Supports standard low-latency mode and extended reasoning tokens. Commercial API terms enforce Zero Data Retention (ZDR) and customer data privacy. Inputs/outputs are never used for model training.",
    sourceUrl: "https://www.anthropic.com/legal/commercial-terms",
    scannerFeed: "Weekly GRC Market Continuous Review",
    vulnerabilitiesCount: 0,
    guardrailsVerified: true
  },
  {
    id: "mod-claude-3-5-sonnet",
    workspaceId: "ws-1",
    provider: "Anthropic",
    name: "Claude 3.5 Sonnet (Upgraded v2)",
    version: "20241022",
    status: "Approved",
    approver: "Lead Security Architect",
    statusDate: "22-10-2024",
    useCasesCount: 6,
    securityScore: 96,
    zeroDataRetention: true,
    trainingOptOut: true,
    soc2Certified: true,
    iso27001Certified: true,
    hipaaCompliant: true,
    euAiActTier: "GPAI with Systemic Risk",
    dataResidency: "US, EU (AWS Bedrock & GCP Vertex AI)",
    assessmentDate: "2024-10-23",
    recommendedStatus: "Approved",
    riskLevel: "LOW",
    notes: "Frontier code generation and complex logic model. Strong constitutional AI safety alignment. Zero Data Retention confirmed on enterprise tier.",
    sourceUrl: "https://www.anthropic.com/claude/sonnet",
    scannerFeed: "Weekly GRC Market Continuous Review",
    vulnerabilitiesCount: 0,
    guardrailsVerified: true
  },
  {
    id: "mod-claude-3-5-haiku",
    workspaceId: "ws-1",
    provider: "Anthropic",
    name: "Claude 3.5 Haiku",
    version: "20241022",
    status: "Approved",
    approver: "Lead Security Architect",
    statusDate: "04-11-2024",
    useCasesCount: 3,
    securityScore: 95,
    zeroDataRetention: true,
    trainingOptOut: true,
    soc2Certified: true,
    iso27001Certified: true,
    hipaaCompliant: true,
    euAiActTier: "Transparency / Specific Risk",
    dataResidency: "US, EU (Multi-Region)",
    assessmentDate: "2024-11-05",
    recommendedStatus: "Approved",
    riskLevel: "LOW",
    notes: "High-throughput, cost-efficient model with Opus-level intelligence. Full ZDR and enterprise compliance terms verified.",
    sourceUrl: "https://www.anthropic.com/claude/haiku",
    scannerFeed: "Weekly GRC Market Continuous Review",
    vulnerabilitiesCount: 0,
    guardrailsVerified: true
  },
  {
    id: "mod-claude-3-opus",
    workspaceId: "ws-1",
    provider: "Anthropic",
    name: "Claude 3 Opus",
    version: "20240229",
    status: "Approved",
    approver: "Lead Security Architect",
    statusDate: "01-03-2024",
    useCasesCount: 2,
    securityScore: 94,
    zeroDataRetention: true,
    trainingOptOut: true,
    soc2Certified: true,
    iso27001Certified: true,
    hipaaCompliant: true,
    euAiActTier: "GPAI with Systemic Risk",
    dataResidency: "US, EU",
    assessmentDate: "2024-03-02",
    recommendedStatus: "Approved",
    riskLevel: "LOW",
    notes: "Deep analytical model suited for complex regulatory mapping and audit synthesis. Commercial privacy terms active.",
    sourceUrl: "https://www.anthropic.com/claude/opus",
    scannerFeed: "Weekly GRC Market Continuous Review",
    vulnerabilitiesCount: 0,
    guardrailsVerified: true
  },
  {
    id: "mod-gpt-4o",
    workspaceId: "ws-1",
    provider: "OpenAI",
    name: "GPT-4o",
    version: "2024-11-20",
    status: "Approved",
    approver: "Demo Assessor",
    statusDate: "20-11-2024",
    useCasesCount: 5,
    securityScore: 94,
    zeroDataRetention: true,
    trainingOptOut: true,
    soc2Certified: true,
    iso27001Certified: true,
    hipaaCompliant: true,
    euAiActTier: "GPAI with Systemic Risk",
    dataResidency: "US, EU (Azure OpenAI Enclaves)",
    assessmentDate: "2024-11-21",
    recommendedStatus: "Approved",
    riskLevel: "LOW",
    notes: "Omni-modal model with enterprise zero data retention and Azure tenant isolation.",
    sourceUrl: "https://openai.com/enterprise-privacy/",
    scannerFeed: "Weekly GRC Market Continuous Review",
    vulnerabilitiesCount: 0,
    guardrailsVerified: true
  },
  {
    id: "mod-gemini-1-5-pro",
    workspaceId: "ws-1",
    provider: "Google Cloud",
    name: "Gemini 1.5 Pro",
    version: "002",
    status: "Approved",
    approver: "Demo Assessor",
    statusDate: "24-09-2024",
    useCasesCount: 4,
    securityScore: 97,
    zeroDataRetention: true,
    trainingOptOut: true,
    soc2Certified: true,
    iso27001Certified: true,
    hipaaCompliant: true,
    euAiActTier: "GPAI with Systemic Risk",
    dataResidency: "Global (39 GCP Sovereign Regions)",
    assessmentDate: "2024-09-25",
    recommendedStatus: "Approved",
    riskLevel: "LOW",
    notes: "2M token context window. Governed by Vertex AI Enterprise DPA with VPC-SC boundaries.",
    sourceUrl: "https://cloud.google.com/vertex-ai/docs/generative-ai/data-governance",
    scannerFeed: "Weekly GRC Market Continuous Review",
    vulnerabilitiesCount: 0,
    guardrailsVerified: true
  },
  {
    id: "mod-deepseek-r1",
    workspaceId: "ws-1",
    provider: "DeepSeek",
    name: "DeepSeek-R1 (Distill / Self-Hosted)",
    version: "v1.0",
    status: "Restricted",
    approver: "Lead Security Architect",
    statusDate: "22-01-2025",
    useCasesCount: 1,
    securityScore: 68,
    zeroDataRetention: false,
    trainingOptOut: false,
    soc2Certified: false,
    iso27001Certified: false,
    hipaaCompliant: false,
    euAiActTier: "GPAI with Systemic Risk",
    dataResidency: "Isolated Internal VPC Only",
    assessmentDate: "2025-01-22",
    recommendedStatus: "Restricted",
    riskLevel: "MEDIUM",
    notes: "RESTRICTED POLICY: Public web API (api.deepseek.com) is BLOCKED. Deployment permitted strictly via self-hosted air-gapped private VPC or via AWS Bedrock / Azure with telemetry disabled.",
    sourceUrl: "https://chat.deepseek.com/privacy",
    scannerFeed: "Weekly GRC Market Continuous Review",
    vulnerabilitiesCount: 1,
    guardrailsVerified: false
  },

  // Alpha AI Consulting Models
  { id: "mod-ac-1", workspaceId: "ws-2", provider: "Anthropic", name: "Claude 3.7 Sonnet (Alpha Consulting)", version: "20250219", status: "Approved", approver: "Partner Assessor", statusDate: "20 Feb 2025", useCasesCount: 3, securityScore: 98, zeroDataRetention: true, soc2Certified: true },
  { id: "mod-ac-2", workspaceId: "ws-2", provider: "Custom Fine-tuned", name: "BioGPT Clinical Summarizer", version: "v3.0.1", status: "Pending", approver: "Dr. Sarah Jenkins", statusDate: "28 Apr 2026", useCasesCount: 1, securityScore: 82, zeroDataRetention: true, soc2Certified: true },
  { id: "mod-ac-3", workspaceId: "ws-2", provider: "Mistral AI", name: "Mistral Large 2 (Consulting Pipeline)", version: "2407", status: "Approved", approver: "Partner Assessor", statusDate: "05 Apr 2026", useCasesCount: 2, securityScore: 93, zeroDataRetention: true, soc2Certified: true }
];

export const INITIAL_RISKS: RiskRecord[] = [
  {
    id: "RSK-001",
    name: "Risk Register",
    owner: "Demo Assessor",
    severity: "LOW",
    mitigationStatus: "NOT STARTED",
    riskLevel: "NO RISK",
    targetDate: "30-09-2026",
    description: "Audit gaps in registering risk assessments across decentralized corporate workspaces.",
    applicableProjects: ["Customer Churn Prediction Model"],
    applicableFrameworks: ["ISO 42001", "SOC 2"],
    lifecyclePhase: "Design & Scoping",
    categories: ["Operational risk", "Compliance risk"],
    potentialImpact: "Moderate loss of regulatory compliance readiness for internal audits.",
    likelihood: "2",
    severityCalc: "2",
    notes: "Review schedule is set for bi-weekly checkups."
  },
  {
    id: "RSK-002",
    name: "Hallucination",
    owner: "Demo Assessor",
    severity: "MAJOR",
    mitigationStatus: "NOT STARTED",
    riskLevel: "HIGH RISK",
    targetDate: "25-04-2026",
    description: "The AI agent synthesizes incorrect, misleading, or completely false compliance requirements.",
    applicableProjects: ["AI Governance News Aggregator"],
    applicableFrameworks: ["NIST AI RMF", "ISO 42001"],
    lifecyclePhase: "Operation & Deployment",
    categories: ["Reputational risk", "Technical risk", "Bias risk"],
    potentialImpact: "Critical errors in news briefings read by executive-level auditors.",
    likelihood: "4",
    severityCalc: "4",
    notes: "Add retrieval grounding from trust sources to restrict out-of-context facts."
  },
  {
    id: "RSK-003",
    name: "Model and Data Drift",
    owner: "Demo Assessor",
    severity: "MEDIUM",
    mitigationStatus: "IN PROGRESS",
    riskLevel: "MEDIUM RISK",
    targetDate: "15-11-2026",
    description: "Post-deployment changes in production data distributions (covariate/concept shift) leading to degradation of model prediction accuracy and invalid classifications over time.",
    applicableProjects: ["Customer Churn Prediction Model"],
    applicableFrameworks: ["ISO 42001", "NIST AI RMF"],
    lifecyclePhase: "Operation & Deployment",
    categories: ["Technical risk", "Operational risk"],
    potentialImpact: "Severe drop in predictive churn accuracy, leading to unaddressed customer attrition and erroneous resource allocation in sales dashboards.",
    likelihood: "3",
    severityCalc: "3",
    notes: "Deploying automated validation tests using Kolmogorov-Smirnov (KS) test statistics on incoming request payloads.",
    mitigationPlan: "Configure automated monthly drift detection reports and establish dynamic retraining schedules with pre-defined validation and regression thresholds.",
    implementationStrategy: "Set up telemetry hooks in the prediction pipeline that compare current input distribution parameters against baseline training distributions.",
    residualLikelihood: "2",
    residualSeverity: "2",
    residualRiskLevel: "LOW RISK",
    approver: "Leo Vance",
    approvalStatus: "Approved",
    assessmentDate: "15-06-2026",
    recommendations: "Integrate automatic email alerts when PSI (Population Stability Index) exceeds 0.25."
  },
  {
    id: "RSK-004",
    name: "Intellectual Property & Copyright Compliance",
    owner: "Leo Vance",
    severity: "HIGH",
    mitigationStatus: "NOT STARTED",
    riskLevel: "HIGH RISK",
    targetDate: "10-10-2026",
    description: "Generative AI systems (image diffusion or synthetic voice models) utilizing pre-training data or generating commercial assets that inadvertently violate third-party copyrights or trademark protections.",
    applicableProjects: ["Create Meta Ad Images", "AI Voice Generation for Courses"],
    applicableFrameworks: ["ISO 42001"],
    lifecyclePhase: "Design & Scoping",
    categories: ["Compliance risk", "Legal risk", "Reputational risk"],
    potentialImpact: "Direct exposure to copyright infringement lawsuits, platform-wide takedowns of active advertising campaigns, and public reputational damage.",
    likelihood: "3",
    severityCalc: "4",
    notes: "Requires a legal sign-off on dataset origins and licensing terms before public ad campaigns launch.",
    mitigationPlan: "Establish pre-deployment data lineage sheets verifying dataset usage rights, use public domain or licensed base material, and incorporate automated post-generation similarity filter scans.",
    implementationStrategy: "Mandate use of watermarked content libraries and licensed synthetic voice profiles with complete commercial release clearances.",
    residualLikelihood: "1",
    residualSeverity: "4",
    residualRiskLevel: "LOW RISK",
    approver: "Mark Taylor",
    approvalStatus: "Pending",
    assessmentDate: "12-07-2026",
    recommendations: "Consult external copyright counsel for a formal risk assessment on diffusion model training pipelines."
  },
  {
    id: "RSK-005",
    name: "Prompt Injection & Adversarial Jailbreaking",
    owner: "Mark Taylor",
    severity: "HIGH",
    mitigationStatus: "IN PROGRESS",
    riskLevel: "HIGH RISK",
    targetDate: "30-10-2026",
    description: "Adversarial prompt engineering where malicious actors craft specialized inputs to bypass alignment controls, forcing LLMs or speech agents to ignore system instructions and output harmful, biased, or restricted content.",
    applicableProjects: ["Voice agents to cold call Government", "Voice Agent for Virtual Training Room"],
    applicableFrameworks: ["ISO 42001", "NIST AI RMF"],
    lifecyclePhase: "Operation & Deployment",
    categories: ["Security risk", "Technical risk"],
    potentialImpact: "Speech agents generating offensive remarks, misrepresenting governmental/regulatory policies, or leaking proprietary system instructions during calls.",
    likelihood: "4",
    severityCalc: "4",
    notes: "Adversarial red-teaming exercises scheduled prior to production release.",
    mitigationPlan: "Deploy active input-validation guardrail models, use strict System Prompts isolated from user inputs, sanitize incoming payloads, and bound conversational scope.",
    implementationStrategy: "Implement dual-LLM pattern where a secondary lightweight classifier validates user prompt safety prior to feeding it to the primary model.",
    residualLikelihood: "2",
    residualSeverity: "3",
    residualRiskLevel: "MEDIUM RISK",
    approver: "Demo Assessor",
    approvalStatus: "Approved",
    assessmentDate: "20-06-2026",
    recommendations: "Run continuous automated fuzz testing with a curated set of known jailbreak vectors."
  },
  {
    id: "RSK-006",
    name: "Training Data Poisoning & Supply Chain Vulnerabilities",
    owner: "Demo Assessor",
    severity: "HIGH",
    mitigationStatus: "NOT STARTED",
    riskLevel: "HIGH RISK",
    targetDate: "05-12-2026",
    description: "Malicious manipulation of upstream datasets, public scraping feeds, or third-party packages used in retraining, introducing backdoors or bias that degrades model performance and safety profiles.",
    applicableProjects: ["Customer Churn Prediction Model", "AI Governance News Aggregator"],
    applicableFrameworks: ["ISO 42001", "NIST AI RMF"],
    lifecyclePhase: "Data Curation & Engineering",
    categories: ["Security risk", "Technical risk", "Compliance risk"],
    potentialImpact: "Degradation of model integrity, targeted model failures triggered by specific input patterns, or violation of dataset sanitization standards.",
    likelihood: "2",
    severityCalc: "4",
    notes: "Dataset hashes should be verified and locked in production.",
    mitigationPlan: "Enforce strict Role-Based Access Control (RBAC) on raw data repositories, establish rigorous checksum verification on dataset downloads, and validate datasets using isolated test suites.",
    implementationStrategy: "Incorporate anomaly detection algorithms into the ETL pipelines to filter statistical outliers or malicious inputs from public feeds.",
    residualLikelihood: "1",
    residualSeverity: "4",
    residualRiskLevel: "LOW RISK",
    approver: "Leo Vance",
    approvalStatus: "Pending",
    assessmentDate: "18-07-2026",
    recommendations: "Apply data-cleansing algorithms specifically targeting labels with high anomaly scores."
  },
  {
    id: "RSK-007",
    name: "Sensitive Data Leakage & Privacy Violations",
    owner: "Demo Assessor",
    severity: "VERY HIGH",
    mitigationStatus: "COMPLETED",
    riskLevel: "CRITICAL RISK",
    targetDate: "20-09-2026",
    description: "Inadvertent inclusion of proprietary source code, private customer records (PII), or confidential corporate IP in training sets or prompt histories, risking subsequent memorization and disclosure via model outputs.",
    applicableProjects: ["Customer Churn Prediction Model", "Voice agents to cold call Government", "AI Voice Generation for Courses"],
    applicableFrameworks: ["ISO 42001", "NIST AI RMF"],
    lifecyclePhase: "Design & Scoping",
    categories: ["Compliance risk", "Privacy risk"],
    potentialImpact: "Fines under CCPA/GDPR regulations, severe user trust degradation, and exposure of commercial trade secrets.",
    likelihood: "3",
    severityCalc: "5",
    notes: "Implemented a custom PII scrubber proxy filter that intercepts all outgoing model API calls.",
    mitigationPlan: "Integrate automatic anonymization and regex filtering into the prompt proxy layer; disable global model retraining from customer chat histories; implement automated PII audits on raw training logs.",
    implementationStrategy: "Deploy Microsoft Presidio or a custom NER (Named Entity Recognition) model on input buffers to redact emails, phone numbers, and names.",
    residualLikelihood: "1",
    residualSeverity: "4",
    residualRiskLevel: "LOW RISK",
    approver: "Mark Taylor",
    approvalStatus: "Approved",
    assessmentDate: "10-06-2026",
    recommendations: "Ensure no raw data is written to external model provider logs by setting data-retention options to zero."
  },

  // Alpha AI Consulting Risks
  {
    id: "RSK-AC-01",
    workspaceId: "ws-2",
    name: "Patient Data Privacy Breach in Intake Summaries",
    owner: "Partner Assessor",
    severity: "VERY HIGH",
    mitigationStatus: "IN PROGRESS",
    riskLevel: "HIGH RISK",
    targetDate: "15-06-2026",
    description: "Inadvertent exposure of Protected Health Information (PHI) to third-party model inference APIs.",
    applicableProjects: ["Healthcare Patient Intake Summarizer"],
    applicableFrameworks: ["ISO 42001"],
    lifecyclePhase: "Operation & Deployment",
    categories: ["Privacy risk", "Compliance risk"],
    potentialImpact: "Severe HIPAA fines and customer trust loss.",
    likelihood: "2",
    severityCalc: "5",
    notes: "HIPAA Scrubbing proxy layer deployed on input stream."
  }
];

export const INITIAL_REPORTS: ComplianceReport[] = [
  { id: "rep-1", workspaceId: "ws-1", title: "Report", program: "Certification and Accreditation", type: "Organizational report", format: "PDF", created: "Apr 26, 2026, 11:08 PM" },
  { id: "rep-2", workspaceId: "ws-1", title: "iso", program: "Certification and Accreditation", type: "Organizational report", format: "PDF", created: "Apr 25, 2026, 4:41 PM" },

  // Alpha AI Consulting Reports
  { id: "rep-ac-1", workspaceId: "ws-2", title: "Alpha AI Consulting Q1 HIPAA & ISO 42001 Audit Summary", program: "Alpha AI Consulting", type: "Client Report", format: "PDF", created: "May 01, 2026, 10:15 AM" }
];

export const INITIAL_VENDORS: Vendor[] = [
  { id: "vnd-1", workspaceId: "ws-1", name: "Anthropic", website: "claude.ai", projects: "SEO Blog Generation", reviewStatus: "Approved", score: "N/A", assignee: "Demo Assessor", reviewDate: "Mar 10, 2026" },
  { id: "vnd-2", workspaceId: "ws-1", name: "Focussee", website: "www.focussee.imobil.com", projects: "Course AI Chatbot", reviewStatus: "Approved", score: "N/A", assignee: "—", reviewDate: "Apr 21, 2026" },

  // Alpha AI Consulting Vendors
  { id: "vnd-ac-1", workspaceId: "ws-2", name: "AWS HealthLake", website: "aws.amazon.com/healthlake", projects: "Patient Intake Summarizer", reviewStatus: "Approved", score: "98/100", assignee: "Partner Assessor", reviewDate: "Apr 05, 2026" }
];

export const INITIAL_TRAININGS: TrainingRecord[] = [
  { id: "tr-1", workspaceId: "ws-1", name: "Introduction to AI Ethics & ISO 42001", duration: "3 hours", provider: "AI Governance Academy", department: "Compliance", status: "Completed", peopleCount: 24, description: "Basic concepts of responsible AI design and standard alignment." },
  { id: "tr-2", workspaceId: "ws-1", name: "NIST Risk Management Implementation Guide", duration: "1 day", provider: "NIST Vendor Training", department: "Engineering", status: "In progress", peopleCount: 15, description: "How to trace and map algorithmic biases through functional engineering gates." },

  // Alpha AI Consulting Trainings
  { id: "tr-ac-1", workspaceId: "ws-2", name: "HIPAA Data Anonymization for GenAI Engineers", duration: "4 hours", provider: "HealthTech Compliance Council", department: "Engineering", status: "Completed", peopleCount: 12, description: "Technical safeguards for LLM prompts in clinical domains." }
];

export const INITIAL_POLICIES: OrganizationalPolicy[] = [
  { id: "pol-1", workspaceId: "ws-1", title: "AI Risk Assessment Policy", status: "Published", tags: ["Governance", "Compliance"], teamSize: 1, nextReview: "Jun 4, 2026", lastUpdated: "Jun 4, 2026", content: "Details of risk score calculation formulas, severity boundaries, and mitigations." },
  { id: "pol-2", workspaceId: "ws-1", title: "AI Continuous Monitoring Policy", status: "Under review", tags: ["Compliance", "Model Risk"], teamSize: 1, nextReview: "Jun 4, 2026", lastUpdated: "Jun 4, 2026", content: "Requirements for monthly model performance monitoring, drift detection, and automated alarms." },
  { id: "pol-3", workspaceId: "ws-1", title: "Bias Detection and Mitigation Policy", status: "Under review", tags: ["Fairness", "Model Risk"], teamSize: 0, nextReview: "May 21, 2026", lastUpdated: "May 21, 2026", content: "Demographic parity assessment steps and model tuning guidelines." },
  { id: "pol-4", workspaceId: "ws-1", title: "Model Versioning and Rollback Policy", status: "Under review", tags: ["Model Risk", "Governance"], teamSize: 1, nextReview: "May 17, 2026", lastUpdated: "May 17, 2026", content: "Guidelines for model version controls, fallback procedures, and approval registries." },

  // Alpha AI Consulting Policies
  { id: "pol-ac-1", workspaceId: "ws-2", title: "Healthcare AI Safeguards & Patient Data Policy", status: "Published", tags: ["Healthcare", "HIPAA", "Privacy"], teamSize: 3, nextReview: "Aug 15, 2026", lastUpdated: "May 02, 2026", content: "Mandatory zero-retention settings for external LLMs and strict PHI redaction guidelines." }
];

export const POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    id: "tpl-1",
    title: "AI Accessibility and Inclusion Policy",
    tags: ["Fairness", "AI Ethics"],
    description: "Makes sure AI systems are accessible to all people and avoid digital exclusion.",
    purpose: "Ensure AI-driven products adhere strictly to universal design guidelines.",
    scope: "All employee, customer-facing AI utilities, and interactive chat models.",
    keyTerms: "Universal Design: Systems built to accommodate diverse human capability levels.",
    policyRequirements: "Regular accessibility audits with screen readers, alternative text systems, and multilingual assistance."
  },
  {
    id: "tpl-2",
    title: "AI Change Management Policy",
    tags: ["Governance", "Accountability"],
    description: "Keeps updates to AI models controlled, reviewed, and properly documented.",
    purpose: "Prevent drift or regressions during incremental fine-tuning pipelines.",
    scope: "Core engineering teams, research specialists, and operations managers.",
    keyTerms: "Model Regression: Drop in benchmark standards after training updates.",
    policyRequirements: "Mandatory multi-stage review gates and integration of testing protocols prior to general deployment."
  },
  {
    id: "tpl-3",
    title: "AI Continuous Monitoring Policy",
    tags: ["Compliance", "Model Risk"],
    description: "Sets the ongoing monitoring expectations for production-grade AI.",
    purpose: "Assure reliability and drift tracking across long-term cycles.",
    scope: "All deployed systems handling customer data records.",
    keyTerms: "Data Drift: Shift in runtime distribution compared to training baselines.",
    policyRequirements: "Configure telemetry alerts to notify compliance managers whenever confidence falls below 85%."
  },
  {
    id: "tpl-4",
    title: "AI Data Usage Policy",
    tags: ["Privacy", "Data Governance"],
    description: "Governs lawful grounds, consent capture, and pipeline safety for fine-tuning data.",
    purpose: "Ensure proper usage of internal and external data collections.",
    scope: "Research, development, and data extraction pipelines.",
    keyTerms: "Consent Guard: Filter layer rejecting records without explicit end-user signoffs.",
    policyRequirements: "Data anonymization is required before feed delivery. No PIIs are allowed in base prompt contexts."
  },
  {
    id: "tpl-5",
    title: "AI Ethics Charter",
    tags: ["AI Ethics", "Fairness"],
    description: "States the ethical ground rules and off-limits uses for AI in the organization.",
    purpose: "Put in writing the ethical guardrails that every AI effort in the organization is expected to operate within, so that our values translate into day-to-day engineering and product decisions.",
    scope: "Applies to every employee, contractor, and partner involved in shaping or running AI on behalf of the organization.",
    keyTerms: "Off-Limits Use: A category of AI deployment that is not permitted under this charter.\nPersonal Dignity: The baseline respect owed to every individual that AI must preserve.\nEthics Review: A structured evaluation that weighs an AI system against these principles.",
    policyRequirements: "AI must not be turned toward manipulating, deceiving, or taking advantage of individuals.\nFacial recognition applied to indiscriminate mass surveillance is disallowed.\nLife-critical decisions cannot be fully delegated to AI; a qualified human stays in the loop.\nEvery AI project clears an ethics review before entering production."
  }
];

export const INITIAL_INCIDENTS: IncidentRecord[] = [
  { id: "INC-0004", workspaceId: "ws-1", project: "Certification and Accreditation", type: "Bias", severity: "SERIOUS", status: "Open", occurred: "25-04-2026", approvedBy: "Demo Assessor" },
  { id: "INC-0003", workspaceId: "ws-1", project: "Certification and Accreditation", type: "Unintended output", severity: "MODERATE", status: "Closed", occurred: "18-02-2026", approvedBy: "Demo Assessor" },
  { id: "INC-0002", workspaceId: "ws-1", project: "Certification and Accreditation", type: "Unintended output", severity: "MODERATE", status: "Open", occurred: "02-03-2026", approvedBy: "Demo Assessor" },
  { id: "INC-0001", workspaceId: "ws-1", project: "Certification and Accreditation", type: "Bias", severity: "MINOR", status: "Closed", occurred: "07-04-2026", approvedBy: "Demo Assessor" },

  // Alpha AI Consulting Incidents
  { id: "INC-AC-01", workspaceId: "ws-2", project: "Healthcare Patient Intake Summarizer", type: "PHI Masking Glitch", severity: "SERIOUS", status: "Mitigated", occurred: "14-04-2026", approvedBy: "Partner Assessor" }
];

// Seed controls for the three frameworks:
export const ISO_42001_CLAUSES: FrameworkClause[] = [
  {
    id: "4",
    title: "Clause 4: Context of the Organization",
    type: "clause",
    requirements: [
      {
        id: "4.1.1",
        title: "External & Internal Issues",
        summary: "Determine external and internal issues relevant to the organization's purpose and affecting its ability to achieve intended AIMS outcomes.",
        implementationGuidance: "Perform structured environmental scanning (e.g., PESTLE and SWOT analyses) tailored to AI technologies, market positioning, legal dynamics, and operational context.",
        keyQuestions: [
          "How does the organization systematically identify, review, and update internal and external issues affecting AI deployment?",
          "Can you demonstrate how issues like technological shift, market competition, or operational readiness impact AIMS outcomes?"
        ],
        evidenceExamples: [
          "External & Internal Context Register",
          "PESTLE/SWOT Analysis Reports",
          "Enterprise Context Log",
          "Executive Risk Horizon Reviews"
        ],
        implementationDescription: "We have completed a comprehensive environmental SWOT and PESTLE scan evaluating our AI tooling deployment, identifying key risks around data compliance, third-party model dependency, and talent gaps.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "27 May 2026",
        auditorFeedback: "Initial charter and mapping documentation align correctly with general compliance goals.",
        notes: "Remember to re-verify compliance scopes in late Q3."
      },
      {
        id: "4.1.2",
        title: "Climate Change Relevance",
        summary: "Explicitly evaluate and determine whether climate change is a relevant issue affecting the AI Management System.",
        implementationGuidance: "Evaluate compute infrastructure energy consumption, carbon footprint of model training/inference, supply chain impacts, and environmental sustainability goals.",
        keyQuestions: [
          "Has the organization conducted a formal assessment on whether climate change is a relevant factor for your AI compute and operations?",
          "If relevant, how are environmental impacts (e.g., energy consumption, compute efficiency, hardware lifecycle) measured and controlled?"
        ],
        evidenceExamples: [
          "Climate Relevance Determination Records",
          "ESG & Environmental Impact Report for AI Compute",
          "Compute Energy Metrics"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "15 Jun 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "4.1.3",
        title: "AI Intended Purpose & Role Determination",
        summary: "Consider system intended purposes and determine organizational role(s) (e.g., Provider, Producer, Customer, Partner, Subject, Authority).",
        implementationGuidance: "Map all current and planned AI systems against ISO/IEC 22989 and NIST AI RMF role definitions to establish compliance and risk responsibilities across the lifecycle.",
        keyQuestions: [
          "What process is used to define the intended purpose for every AI system in scope?",
          "How do you determine whether your role is Provider, Producer, Customer, or Partner for a given AI system, and how does this affect control selection?"
        ],
        evidenceExamples: [
          "AI System Inventory & Purpose Specifications",
          "Role Mapping Matrix (ISO/IEC 22989 alignment)",
          "Purpose Statements"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Demo Assessor",
        approver: "Mark Taylor",
        dueDate: "30 Jun 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "4.1.4",
        title: "External Context & Regulatory Landscape",
        summary: "Consider legal/regulatory mandates (including prohibited uses), directives, cultural norms, ethics, and competitive landscape.",
        implementationGuidance: "Establish legal horizon scanning for regional AI regulations (e.g., EU AI Act, local statutes), monitor regulatory guidelines, and assess sector ethical norms.",
        keyQuestions: [
          "How do you track evolving AI laws, regulations, and ethical guidelines across jurisdictions where your systems operate?",
          "How are prohibited AI practices or localized compliance restrictions identified and enforced?"
        ],
        evidenceExamples: [
          "Regulatory Compliance Horizon Register",
          "Legal & Ethical Policy Alignment Reviews",
          "Industry Benchmark Studies",
          "Legal Compliance Tracker"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Demo Assessor",
        approver: "Leo Vance",
        dueDate: "15 Jul 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "4.1.5",
        title: "Internal Context & Governance",
        summary: "Consider internal governance, strategic business objectives, policies, organizational structure, contractual obligations, and technical capabilities.",
        implementationGuidance: "Align AIMS objectives with enterprise business strategy, review existing IT/Sec policies for AI overlap, and assess internal AI skills and resources.",
        keyQuestions: [
          "How are AIMS requirements integrated into existing enterprise governance structures, culture, and business capabilities?",
          "How do existing IT, Security, and Quality management systems align with AI governance?"
        ],
        evidenceExamples: [
          "Enterprise Governance Charters",
          "Corporate Policy Cross-Reference Matrix",
          "Resource Capability Review",
          "Capability Assessment Reports"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "20 Jul 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "4.1.6",
        title: "Data Categories & Legal Obligations",
        summary: "Inform role determination based on categories of data processed (e.g., PII Controller vs. PII Processor) and legal requirements.",
        implementationGuidance: "Analyze data ingestion pipelines against ISO/IEC 29100 and regional privacy laws to establish precise controller/processor boundaries and legal obligations.",
        keyQuestions: [
          "How do you classify the data categories processed by your AI models (e.g., PII, IP, confidential)?",
          "How are your legal roles as Data Controller vs. Data Processor established and reflected in contracts and data flows?"
        ],
        evidenceExamples: [
          "Data Processing Role Agreements (DPA)",
          "PII Data Flow & Lineage Map",
          "Privacy Role Determination Record"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Demo Assessor",
        approver: "Mark Taylor",
        dueDate: "25 Jul 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "4.2",
        title: "Needs & Expectations of Interested Parties",
        summary: "Identify relevant interested parties, their requirements, and determine which will be addressed through the AIMS (including climate change needs).",
        implementationGuidance: "Perform stakeholder analysis across internal and external groups (regulators, customers, subjects, suppliers) and capture statutory, contractual, and societal expectations.",
        keyQuestions: [
          "Who are the key internal and external interested parties for your AI systems, and how were their expectations captured?",
          "How do you determine which stakeholder requirements must be addressed within the AIMS?"
        ],
        evidenceExamples: [
          "Stakeholder Requirements Matrix",
          "Interested Party Register",
          "Compliance & Expectation Tracking Logs"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "15 Jun 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "4.3",
        title: "Determining the Scope of the AIMS",
        summary: "Determine boundaries and applicability of the AIMS based on 4.1 issues, 4.2 requirements, and organizational activities. Document the scope.",
        implementationGuidance: "Define operational, geographic, and technical boundaries; document explicit inclusions and exclusions of specific AI systems or business units with justification.",
        keyQuestions: [
          "Where is the formal boundaries and applicability document for the AIMS defined?",
          "If any AI systems, locations, or business units are excluded from scope, what is the documented justification?"
        ],
        evidenceExamples: [
          "Formally Approved AIMS Scope Document",
          "Scope Boundary Map",
          "Statement of Applicability (SoA) Inputs",
          "Justification Records"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Demo Assessor",
        approver: "Mark Taylor",
        dueDate: "30 Jun 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "4.4",
        title: "AI Management System",
        summary: "Establish, implement, maintain, continually improve, and document an AIMS and its process interactions.",
        implementationGuidance: "Integrate AIMS workflows into existing management frameworks (e.g., ISO/IEC 27001 ISMS, ISO 9001 QMS) and establish cross-functional governance processes.",
        keyQuestions: [
          "How are AIMS processes integrated with existing management frameworks (e.g., ISO/IEC 27001)?",
          "Can you show how process inputs, outputs, and cross-functional interactions are maintained and continually improved?"
        ],
        evidenceExamples: [
          "AIMS Architecture Document",
          "Process Interaction Workflow Map",
          "Continuous Improvement Register"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Demo Assessor",
        approver: "Leo Vance",
        dueDate: "05 Aug 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "5",
    title: "Clause 5: Leadership",
    type: "clause",
    requirements: [
      {
        id: "5.1.1",
        title: "Strategic Alignment & Business Integration",
        summary: "Top management shall ensure the AI policy and objectives are established, compatible with strategic direction, and integrated into core business processes.",
        implementationGuidance: "Embed AI governance directly into enterprise architecture, MLOps release pipelines, and strategic planning. Integrate AI risk gating into existing steering committees.",
        keyQuestions: [
          "How does top management demonstrate active sponsorship and oversight of the AIMS?",
          "How are AI policy and objectives embedded into corporate business strategy and product lifecycles?"
        ],
        evidenceExamples: [
          "Board & Executive Committee Minutes",
          "Strategic Business Plans",
          "Business Process Integration Map",
          "Steering Committee Charters"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Mark Taylor",
        approver: "Leo Vance",
        dueDate: "10 Jul 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "5.1.2",
        title: "Resource Allocation & Organizational Support",
        summary: "Top management shall ensure the availability of resources needed for the AIMS, direct personnel to contribute to effectiveness, and support relevant leadership roles.",
        implementationGuidance: "Allocate explicit capital, staffing, and infrastructure budgets for AIMS operation (e.g., AI Governance Officers, automated monitoring platforms). Empower domain leads to enforce compliance.",
        keyQuestions: [
          "What evidence demonstrates that top management has allocated sufficient budget, staffing, and tooling for the AIMS?",
          "How are resource bottlenecks or AI skill shortages identified and addressed by leadership?"
        ],
        evidenceExamples: [
          "Approved AIMS Capital & Staffing Budget",
          "Resource Allocation Requests",
          "Tooling/Infrastructure Procurement Sign-offs",
          "AI Governance Org Chart"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "15 Jul 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "5.1.3",
        title: "Culture, Communication & Continual Improvement",
        summary: "Top management shall communicate the importance of effective AI management, ensure intended outcomes are met, and actively promote a responsible AI culture and continual improvement.",
        implementationGuidance: "Issue executive messaging on responsible AI principles, sponsor enterprise-wide AI literacy and ethics training, and establish leadership feedback loops regarding AIMS performance.",
        keyQuestions: [
          "How does executive leadership communicate the importance of ethical, legal, and effective AI management to staff?",
          "What programs or initiatives exist to drive an enterprise-wide responsible AI culture?"
        ],
        evidenceExamples: [
          "CEO/Executive Broadcasts",
          "Enterprise Town Hall Decks",
          "AI Literacy & Ethics Training Logs",
          "Management Review Sponsoring Records"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "20 Jul 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "5.2.1",
        title: "Establishing & Tailoring the AI Policy",
        summary: "Establish an AI policy appropriate to organizational purpose, providing a framework for objectives, including commitments to satisfy requirements and continually improve the AIMS.",
        implementationGuidance: "Draft an overarching AI Policy establishing core principles (fairness, robustness, transparency, safety, privacy, accountability). Tailor principles to organizational domain, legal duties, and risk appetite.",
        keyQuestions: [
          "Is the AI Policy formally approved by executive management and tailored to the organization's specific AI context and risk profile?",
          "Does the policy include explicit commitments to fulfill legal obligations and continually improve the AIMS?"
        ],
        evidenceExamples: [
          "Signed Enterprise AI Policy Document",
          "Executive Approval Sign-off",
          "Policy Drafting Rationale Document",
          "Legal & Ethical Alignment Matrix"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "25 Jul 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "5.2.2",
        title: "Policy Alignment, Communication & Availability",
        summary: "Maintain the AI policy as documented information, reference related policies (InfoSec, Privacy), communicate internally, and make available to interested parties as appropriate.",
        implementationGuidance: "Cross-reference the AI Policy with existing management standards (ISO 27001 ISMS, ISO 27701 PIMS, ISO 9001 QMS). Publish internally on corporate portals and expose external transparency disclosures.",
        keyQuestions: [
          "Where is the AI Policy published, and how is it made accessible to employees and relevant external stakeholders?",
          "How is the AI Policy linked with complementary policies like Information Security, Data Privacy, and Code of Conduct?"
        ],
        evidenceExamples: [
          "Policy Intersect / Cross-Reference Matrix",
          "Intranet Publication Links",
          "Public AI Transparency Statements",
          "Staff Acknowledgment Records"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Mark Taylor",
        approver: "Leo Vance",
        dueDate: "30 Jul 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "5.3.1",
        title: "Organizational Roles & Authority Allocation",
        summary: "Ensure that responsibilities and authorities for relevant roles are assigned, documented, and communicated across the AI lifecycle.",
        implementationGuidance: "Establish a detailed RACI matrix mapping accountabilities across the AI lifecycle (data collection, model engineering, validation, human oversight, deployment, post-market monitoring). Update job descriptions.",
        keyQuestions: [
          "How are RACI accountabilities assigned and communicated across all stages of the AI lifecycle (design, build, deploy, monitor)?",
          "Are AI governance responsibilities explicitly included in official job descriptions and performance goals?"
        ],
        evidenceExamples: [
          "Enterprise AI Lifecycle RACI Matrix",
          "Updated Position Descriptions (e.g., AI System Owner, ML Engineer, Data Steward)",
          "Delegation of Authority Charter"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "05 Aug 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "5.3.2",
        title: "Mandatory Named Authorities",
        summary: "Assign specific responsibility and authority for: a) ensuring AIMS conforms to ISO/IEC 42001; b) reporting AIMS performance to top management.",
        implementationGuidance: "Formally designate a Lead AI Governance / Compliance Officer (or Chief AI Officer / CISO) with explicit authority to enforce AIMS conformance and present structured performance reports directly to top management.",
        keyQuestions: [
          "Who has been assigned named authority to ensure AIMS conformance to ISO/IEC 42001?",
          "What is the formal reporting channel and cadence used to apprise top management of AIMS performance and issues?"
        ],
        evidenceExamples: [
          "Formal Designation Letters for Named Authorities (CAIO / Head of AI Governance)",
          "Executive Reporting Schedules",
          "Management Briefing Decks"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "10 Aug 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "6",
    title: "Clause 6: Planning",
    type: "clause",
    requirements: [
      {
        id: "6.1.1",
        title: "General (AIMS Risks & Opportunities)",
        summary: "Determine risks and opportunities based on context (4.1) and stakeholder expectations (4.2) to ensure AIMS outcomes, prevent unintended effects, and drive continual improvement.",
        implementationGuidance: "Integrate AIMS organizational risk assessments into Enterprise Risk Management (ERM). Evaluate systemic risks like regulatory non-compliance, loss of public trust, operational misalignment, and tech dependency.",
        keyQuestions: [
          "How does the organization identify and evaluate systemic risks and opportunities associated with operating an AIMS?",
          "How are these risks integrated into the broader Enterprise Risk Management (ERM) framework?"
        ],
        evidenceExamples: [
          "AIMS Summary of Risks & Opportunity Register",
          "ERM Alignment Charter",
          "Strategic Risk Appetite Statement"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "15 Aug 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "6.1.2",
        title: "AI Risk Assessment",
        summary: "Define and apply a repeatable AI risk assessment process across system lifecycles. Identify risks related to system behavior, safety, fairness, bias, transparency, data privacy, and technical robustness.",
        implementationGuidance: "Establish standardized risk scoring methodologies (likelihood vs. impact) for MLOps/software pipelines. Evaluate model-specific risks (e.g., data drift, hallucination, adversarial attacks, lack of explainability).",
        keyQuestions: [
          "What methodology is used to assess technical and operational risks (e.g., bias, drift, hallucination, safety) for specific AI models?",
          "Is the AI risk assessment repeatable, and how often is it triggered across the system lifecycle?"
        ],
        evidenceExamples: [
          "Standardized AI Risk Assessment Procedure",
          "Completed AI System Risk Reports (per model)",
          "Risk Scoring Criteria"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Demo Assessor",
        approver: "Mark Taylor",
        dueDate: "20 Aug 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "6.1.3",
        title: "AI Risk Treatment & SoA",
        summary: "Define an AI risk treatment process to select mitigation options, select Annex A controls, produce a Risk Treatment Plan (RTP), and establish a Statement of Applicability (SoA).",
        implementationGuidance: "Map identified AI risks directly to ISO/IEC 42001 Annex A/B controls. Document justification for control selection or exclusion in the SoA, and secure formal risk acceptance sign-offs from designated risk owners.",
        keyQuestions: [
          "How are Annex A/B controls selected to treat identified AI risks?",
          "Does the Statement of Applicability (SoA) clearly document and justify all control inclusions and exclusions, with formal risk owner acceptance?"
        ],
        evidenceExamples: [
          "Statement of Applicability (SoA)",
          "AI Risk Treatment Plan (RTP)",
          "Formal Risk Owner Sign-offs",
          "Control Implementation Roadmap"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "25 Aug 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "6.1.4",
        title: "AI System Impact Assessment (AISIA)",
        summary: "Perform assessments of potential impacts on individuals, groups, and society (including fundamental rights, non-discrimination, safety, well-being, and legal rights).",
        implementationGuidance: "Mandate an AISIA during early design and prior to major deployment shifts. Evaluate societal harm, algorithmic bias against protected groups, employment impacts, and human agency constraints.",
        keyQuestions: [
          "What criteria trigger an AISIA, and how do you assess potential societal, fundamental rights, and human impacts before model deployment?",
          "How are recommendations from an AISIA tracked to completion?"
        ],
        evidenceExamples: [
          "Executed AISIA Reports",
          "Ethics Committee Review Board Minutes",
          "Fairness/Impact Mitigation Plans",
          "Bias & Fairness Audits"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "30 Aug 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "6.2.1",
        title: "Establishing AI Objectives",
        summary: "Establish measurable AI objectives across relevant functions and levels that align with the AI policy, are monitored, communicated, and regularly updated.",
        implementationGuidance: "Define quantitative and qualitative governance KPIs (e.g., 100% AISIA coverage prior to production, zero high-severity unmitigated bias findings, target latency and drift thresholds).",
        keyQuestions: [
          "What measurable AI objectives are currently defined, and how do they map back to the overarching AI Policy?",
          "What key performance metrics (KPIs) are tracked to evaluate if AI objectives are being met?"
        ],
        evidenceExamples: [
          "Enterprise AI Objectives Register",
          "AI Governance Metrics Dashboard",
          "Management Review Objective Minutes",
          "KPI Measurement Tracking Logs"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "05 Sep 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "6.2.2",
        title: "Planning to Achieve AI Objectives",
        summary: "Formulate operational plans defining: what will be done, required resources, responsible personnel, completion timelines, and evaluation criteria.",
        implementationGuidance: "Develop concrete project plans for each AI objective. Assign clear RACI accountabilities, allocate budget/tooling, establish milestone target dates, and define performance tracking methods.",
        keyQuestions: [
          "What operational plans exist to achieve each AI objective, including assigned owners, budgets, timelines, and evaluation criteria?",
          "How frequently are objective achievement roadmaps reviewed and adjusted?"
        ],
        evidenceExamples: [
          "AIMS Action Plans & Project Schedules",
          "Resource Allocation Approvals",
          "Objective Progress Tracking Logs",
          "Target Completion Sign-offs"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "10 Sep 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "6.3.1",
        title: "AIMS Change Management",
        summary: "Plan and execute structural or operational changes to the AIMS while maintaining system integrity, resource availability, and explicit role assignments.",
        implementationGuidance: "Establish a formal Change Management Procedure for changes to model architectures, governance frameworks, operational scopes, or underlying data pipelines. Conduct pre-change impact assessments.",
        keyQuestions: [
          "How are significant structural, operational, or technical changes to the AI systems or AIMS managed?",
          "How do you evaluate potential risk and compliance impacts prior to executing a major change?"
        ],
        evidenceExamples: [
          "AIMS Change Management Procedure",
          "Change Impact Assessment Records",
          "Approved Architecture & Policy Change Requests",
          "Post-Implementation Review Logs"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Mark Taylor",
        approver: "Leo Vance",
        dueDate: "15 Sep 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "7",
    title: "Clause 7: Support",
    type: "clause",
    requirements: [
      {
        id: "7.1",
        title: "Resources",
        summary: "Determine and provide resources needed for the establishment, implementation, maintenance, and continual improvement of the AIMS.",
        implementationGuidance: "Allocate necessary specialized resources including compute infrastructure (GPUs/TPUs), data storage pipelines, high-quality training datasets, AI tooling, and domain expertise (data scientists, AI ethicists, safety architects).",
        keyQuestions: [
          "How does the organization evaluate and provision specialized technical and domain resources required for AIMS operations?",
          "How are resource constraints handled during AI model training, testing, or scaling?"
        ],
        evidenceExamples: [
          "AIMS Resource Allocation Plan",
          "Compute & Data Infrastructure Budget Approvals",
          "AI Tooling & License Inventory",
          "Staffing & Capacity Plans"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "15 Oct 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "7.2",
        title: "Competence",
        summary: "Ensure personnel performing work affecting AI performance and AIMS effectiveness are competent based on education, training, or experience.",
        implementationGuidance: "Define role-specific competency requirements across engineering, data management, ethics, and legal/compliance. Conduct skill gap analyses and deliver specialized training on AI safety, bias mitigation, and algorithmic risk.",
        keyQuestions: [
          "What AI-specific competencies are required for roles involved in AI design, data curation, validation, and oversight?",
          "How does the organization maintain competency in rapidly evolving AI models and techniques?"
        ],
        evidenceExamples: [
          "AI Role Competency Matrix",
          "AI Safety & Governance Training Completion Records",
          "Professional Qualifications/Certifications",
          "Skill Gap Assessments"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "20 Oct 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "7.3",
        title: "Awareness",
        summary: "Ensure persons working under organizational control are aware of the AI policy, their contribution to AIMS effectiveness, and implications of non-conformity.",
        implementationGuidance: "Implement AI awareness programs covering responsible AI principles, misuse scenarios, hallucination/bias awareness, data privacy, and the societal and ethical impacts of the organization's AI systems.",
        keyQuestions: [
          "How are employees, contractors, and third parties made aware of the AI Policy and ethical AI guidelines?",
          "How do personnel understand the potential impacts and risks of the AI systems they build or operate?"
        ],
        evidenceExamples: [
          "AI Policy Awareness Training Modules",
          "Staff Attendance Logs",
          "Responsible AI Campaign Materials",
          "Knowledge Check Assessments"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Demo Assessor",
        approver: "Leo Vance",
        dueDate: "25 Oct 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "7.4",
        title: "Communication",
        summary: "Determine internal and external communications relevant to the AIMS, including what, when, with whom, and how to communicate.",
        implementationGuidance: "Establish a clear Communication Matrix specifying protocols for internal AIMS reporting, AI transparency disclosures to end-users, regulatory notifications, public safety announcements, and AI incident communications.",
        keyQuestions: [
          "What procedures govern internal and external communication regarding AI system capabilities, limitations, and risks?",
          "How are AI-related safety issues or unexpected model behaviors communicated to leadership and stakeholders?"
        ],
        evidenceExamples: [
          "AIMS Communication Strategy & Matrix",
          "AI Transparency Disclosures",
          "Stakeholder Notification Protocols",
          "System Public Notices / Model Cards"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "30 Oct 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "7.5",
        title: "Documented Information",
        summary: "Create, update, and control documented information required by ISO 42001 and the organization to ensure availability, protection, and suitability.",
        implementationGuidance: "Establish standardized documentation workflows for AI System Impact Assessments (AISIA), dataset lineage specifications, model architecture cards, and hyperparameter logs. Enforce strict access control over proprietary code and training data.",
        keyQuestions: [
          "How are AIMS policies, model specifications, dataset documentation, and evaluation logs created, version-controlled, and protected?",
          "How do you ensure obsolete model documentation or legacy datasets are retired appropriately?"
        ],
        evidenceExamples: [
          "Document Control Procedure for AIMS",
          "AI System Documentation (Model Cards, Dataset Sheets)",
          "Version Control Policies",
          "Approved Document Repository"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "05 Nov 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "8",
    title: "Clause 8: Operation",
    type: "clause",
    requirements: [
      {
        id: "8.1",
        title: "Operational Planning and Control",
        summary: "Plan, implement, and control processes needed to meet AIMS requirements and execute Clause 6 actions. Establish process criteria, control planned/unintended changes, and oversee externally provided AI processes/products.",
        implementationGuidance: "Operationalize Annex A controls across the AI lifecycle (data collection, engineering, testing, release, and post-market monitoring). Enforce deployment phase-gates, change control protocols, and vendor SLA monitoring.",
        keyQuestions: [
          "How are operational criteria and controls established across each stage of the AI system lifecycle?",
          "How does the organization manage unintended changes or control third-party AI components in production?"
        ],
        evidenceExamples: [
          "Operational SOPs & Runbooks",
          "AI Deployment Gate Checklists",
          "Approved Change Management Requests",
          "Third-Party AI Oversight SLA Reports"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "12 Nov 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "8.2",
        title: "AI Risk Assessment Execution",
        summary: "Perform AI risk assessments in accordance with 6.1.2 at planned intervals or when significant changes are proposed or occur. Retain documented results.",
        implementationGuidance: "Conduct recurring operational AI risk assessments (e.g., prior to model retraining, when autonomy/scope increases, or post-incident). Re-evaluate model vulnerabilities, data drift, hallucination, and adversarial risks.",
        keyQuestions: [
          "What triggers an operational AI risk assessment outside of regularly scheduled reviews?",
          "How do operational risk assessment findings update the overall enterprise risk profile?"
        ],
        evidenceExamples: [
          "Operational AI Risk Assessment Reports",
          "Trigger Event Evaluation Logs",
          "Updated Model Threat Models",
          "Model Drift Incident Reviews"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "18 Nov 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "8.3",
        title: "AI Risk Treatment Execution",
        summary: "Implement the AI risk treatment plan according to 6.1.3 and verify its effectiveness. Revalidate treatment options if ineffective and retain results.",
        implementationGuidance: "Operationalize selected Annex A/B controls (e.g., input/output guardrails, Human-in-the-Loop gates, red-teaming). Routinely test control efficacy and update treatment plans if controls fail.",
        keyQuestions: [
          "How does the organization verify that operational AI risk treatment options are functioning effectively in production?",
          "What protocol is followed when a control option is determined to be ineffective?"
        ],
        evidenceExamples: [
          "Risk Treatment Plan (RTP) Execution Tracker",
          "Guardrail Efficacy Audit Logs",
          "Revalidated RTP Sign-offs",
          "Control Efficacy Test Records"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Demo Assessor",
        approver: "Leo Vance",
        dueDate: "25 Nov 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "8.4",
        title: "AI System Impact Assessment (AISIA) Execution",
        summary: "Perform AI system impact assessments according to 6.1.4 at planned intervals or when significant changes occur. Retain documented results.",
        implementationGuidance: "Re-run or update AISIA evaluations when changes occur in target demographics, model autonomy, or deployment environments. Evaluate potential harms to individuals, fundamental rights, non-discrimination, and safety.",
        keyQuestions: [
          "How frequently are AI System Impact Assessments updated during runtime and model retraining cycles?",
          "How are mitigation recommendations from operational AISIA reports tracked and verified?"
        ],
        evidenceExamples: [
          "Executed Operational AISIA Reports",
          "Ethics Committee Review Minutes",
          "Demographic & Fairness Disparity Audits",
          "AISIA Remediation Action Log"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "30 Nov 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "9",
    title: "Clause 9: Performance Evaluation",
    type: "clause",
    requirements: [
      {
        id: "9.1",
        title: "Monitoring, Measurement, Analysis and Evaluation",
        summary: "Determine what needs to be monitored/measured, methods used, timing, and who evaluates AIMS and AI system performance. Document evidence of results.",
        implementationGuidance: "Establish automated telemetry for AI system metrics (accuracy, drift, hallucination rate, latency, bias indicators) and AIMS operational metrics. Conduct periodic statistical analysis to evaluate control efficacy.",
        keyQuestions: [
          "What quantitative and qualitative metrics are monitored to measure AI model and AIMS performance?",
          "How are monitoring results analyzed and reported to demonstrate system effectiveness?"
        ],
        evidenceExamples: [
          "AI Performance Telemetry Dashboards",
          "Model Drift & Accuracy Reports",
          "AIMS KPI Measurement Logs",
          "Statistical Analysis Summaries"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "05 Dec 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "9.2",
        title: "Internal Audit",
        summary: "Conduct internal audits at planned intervals to determine whether the AIMS conforms to standard requirements and is effectively implemented and maintained.",
        implementationGuidance: "Establish an independent internal audit program covering AIMS processes, MLOps lifecycles, dataset governance, and Annex A controls. Document findings and track nonconformities to closure.",
        keyQuestions: [
          "Is there an approved internal audit schedule that covers all AIMS clauses and Annex A controls?",
          "How do you ensure the independence and objectivity of internal AI auditors?"
        ],
        evidenceExamples: [
          "Annual Internal Audit Program",
          "Internal Audit Reports",
          "Auditor Independence Charters",
          "Corrective Action Log (CARs)"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "12 Dec 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "9.3.1",
        title: "Management Review — General",
        summary: "Top management shall review the organization's AIMS at planned intervals to ensure its continuing suitability, adequacy, and effectiveness.",
        implementationGuidance: "Schedule formal executive reviews (e.g., annually or bi-annually) led by C-suite executives/Chief AI Officer to evaluate strategic alignment, risk appetite, and overall AIMS performance.",
        keyQuestions: [
          "How frequently does top management formally review AIMS performance and strategic alignment?",
          "What evidence demonstrates executive leadership's active participation in management reviews?"
        ],
        evidenceExamples: [
          "Management Review Committee Charter",
          "Executive Meeting Schedule",
          "Approved Management Review Minutes",
          "C-Suite Briefing Decks"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Demo Assessor",
        approver: "Leo Vance",
        dueDate: "15 Dec 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "9.3.2",
        title: "Management Review — Inputs",
        summary: "Review inputs shall include status of prior review actions, context changes, performance trends (audit results, nonconformities, AISIA updates, model drift), resource adequacy, and stakeholder feedback.",
        implementationGuidance: "Compile a comprehensive review pack covering internal/external shifts (e.g., EU AI Act, new foundation models), AISIA results, safety incident logs, model performance trends, and resource constraints.",
        keyQuestions: [
          "What specific AI risk, audit, impact assessment, and operational telemetry inputs are presented to management?",
          "How are external regulatory shifts and stakeholder expectations incorporated into review inputs?"
        ],
        evidenceExamples: [
          "Management Review Input Dossier",
          "AISIA Update Summaries",
          "AI Incident & Drift Trends",
          "Resource Adequacy Analysis"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "20 Dec 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "9.3.3",
        title: "Management Review — Results & Outputs",
        summary: "Review results shall include decisions and actions related to continual improvement opportunities, required changes to the AIMS, resource allocations, and policy updates.",
        implementationGuidance: "Document formal executive decisions on resource allocations, policy updates, risk treatment adjustments, guardrail modifications, and strategic changes to the AIMS scope.",
        keyQuestions: [
          "What decisions and action items were produced during the most recent management review?",
          "How are management review decisions communicated and tracked to completion?"
        ],
        evidenceExamples: [
          "Formal Management Review Decisions Record",
          "Executive Action Item Tracking Log",
          "Updated AIMS Resource Allocation Orders",
          "Revised AI Policy Sign-offs"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "24 Dec 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "10",
    title: "Clause 10: Improvement",
    type: "clause",
    requirements: [
      {
        id: "10.1",
        title: "Continual Improvement",
        summary: "Continually improve the suitability, adequacy, and effectiveness of the AIMS and overall AI system performance.",
        implementationGuidance: "Leverage AI telemetry, TEVV benchmarks, audit results, post-market monitoring, and management review outputs to drive systematic enhancements in AI safety, model alignment, guardrail accuracy, and AIMS maturity.",
        keyQuestions: [
          "How does the organization systematically evaluate performance data to drive continual improvement of the AIMS and AI systems?",
          "What recent initiatives or model architecture updates demonstrate proactive safety and capability enhancements?"
        ],
        evidenceExamples: [
          "AIMS Continual Improvement Register",
          "AI System Capability & Safety Roadmap",
          "Post-Market Evaluation Reviews",
          "Model Alignment & Retraining Logs"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "28 Dec 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "10.2",
        title: "Nonconformity and Corrective Action",
        summary: "React to nonconformities and AI safety/operational incidents, evaluate root causes, implement corrective action, review effectiveness, and update AIMS risks and AISIA as needed.",
        implementationGuidance: "Establish an integrated CAPA (Corrective and Preventive Action) workflow for AIMS nonconformities and AI system failures (e.g., severe hallucination spikes, prompt injection breaches, algorithmic bias drift). Conduct Root Cause Analysis (RCA) and update risk registers and AISIA.",
        keyQuestions: [
          "What workflow is triggered when an audit nonconformity, regulatory breach, or AI safety failure occurs?",
          "How do you verify that implemented corrective actions effectively eliminate the root cause and prevent recurrence across model versions?"
        ],
        evidenceExamples: [
          "Corrective Action Requests (CARs)",
          "AI Incident Root Cause Analysis (RCA) Reports",
          "CAPA Tracking Register",
          "Updated AI Risk & Impact Assessments"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "31 Dec 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  }
];

export const ISO_27001_CLAUSES: FrameworkClause[] = [
  {
    id: "4",
    title: "Clause 4: Context of the Organization",
    type: "clause",
    requirements: [
      {
        id: "4.1",
        title: "External & Internal Issues",
        summary: "Determine external and internal issues relevant to organizational purpose and affecting ISMS outcomes.",
        implementationGuidance: "Conduct environmental scanning (PESTLE, SWOT) focusing on cyber threat landscape, supply chain dependencies, legal/regulatory duties, and tech infrastructure.",
        keyQuestions: [
          "How does the organization identify and review internal and external security issues?",
          "How are changes in threat landscape or technology reflected in context reviews?"
        ],
        evidenceExamples: [
          "External & Internal Context Register",
          "PESTLE/SWOT Reports",
          "Threat Horizon Analysis",
          "Enterprise Risk Log"
        ],
        implementationDescription: "Data map created covering our main cloud databases and regional file storage sites.",
        status: "In progress",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "20 May 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "4.2",
        title: "Needs & Expectations of Interested Parties",
        summary: "Identify interested parties (regulators, clients, partners) and their information security requirements.",
        implementationGuidance: "Map external legal/contractual requirements (e.g., GDPR, HIPAA, PCI-DSS) and internal stakeholder expectations into a centralized compliance register.",
        keyQuestions: [
          "Who are your key interested parties, and how are their security expectations captured?",
          "How do statutory or contractual obligations feed into ISMS requirements?"
        ],
        evidenceExamples: [
          "Stakeholder Requirements Matrix",
          "Interested Party Register",
          "Contractual Compliance Map",
          "Legal Horizon Tracker"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "30 May 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "4.3",
        title: "Determining the Scope of the ISMS",
        summary: "Define physical, logical, operational, and organizational boundaries and applicability of the ISMS.",
        implementationGuidance: "Document ISMS boundaries including physical locations, cloud infrastructure, network segments, business units, and supply-chain interfaces. Document exclusions with rationale.",
        keyQuestions: [
          "Where is the formal ISMS Scope Statement defined and approved?",
          "How are network boundaries, cloud environments, and third-party integrations accounted for in scope?"
        ],
        evidenceExamples: [
          "Formally Approved ISMS Scope Document",
          "Network Boundary Diagrams",
          "Scope Justification Rationale"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Demo Assessor",
        approver: "Mark Taylor",
        dueDate: "15 Jun 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "4.4",
        title: "Information Security Management System",
        summary: "Establish, implement, maintain, and continually improve an ISMS including necessary processes and interactions.",
        implementationGuidance: "Integrate ISMS processes into enterprise operations (ITIL, DevOps/DevSecOps, CI/CD, Enterprise Risk Management) and establish continuous monitoring.",
        keyQuestions: [
          "How are ISMS workflows integrated into day-to-day IT and operational workflows?",
          "How is process effectiveness evaluated and continually improved?"
        ],
        evidenceExamples: [
          "ISMS Process Interaction Map",
          "Governance Framework Specification",
          "Continual Improvement Log"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Demo Assessor",
        approver: "Leo Vance",
        dueDate: "30 Jun 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "5",
    title: "Clause 5: Leadership",
    type: "clause",
    requirements: [
      {
        id: "5.1",
        title: "Leadership & Commitment",
        summary: "Top management must demonstrate leadership and commitment to the ISMS, ensure policy/objectives alignment, and provide resources.",
        implementationGuidance: "Embed security governance into executive steering committees. Allocate capital, staffing, and tooling for security operations. Promote security culture across the enterprise.",
        keyQuestions: [
          "How does executive leadership demonstrate active sponsorship of information security?",
          "How are security requirements balanced against strategic business objectives?"
        ],
        evidenceExamples: [
          "Executive Committee Minutes",
          "Approved Security Capital & OPEX Budgets",
          "Executive Broadcasts",
          "Steering Committee Charters"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "10 Jul 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "5.2",
        title: "Information Security Policy",
        summary: "Establish an overarching Information Security Policy and relevant topic-specific policies (e.g., Access Control, Data Classification).",
        implementationGuidance: "Draft, approve, and annually review the Information Security Policy. Align topic-specific policies with ISO 27001 Annex A controls. Communicate policies internally and externally.",
        keyQuestions: [
          "Is the Information Security Policy approved by top management and accessible to all personnel?",
          "How often are security policies reviewed and updated?"
        ],
        evidenceExamples: [
          "Approved Information Security Policy",
          "Topic-Specific Security Policies",
          "Intranet Links",
          "Staff Policy Sign-offs"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "20 Jul 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "5.3",
        title: "Organizational Roles, Responsibilities & Authorities",
        summary: "Ensure responsibilities and authorities for security roles are assigned, documented, and communicated across the organization.",
        implementationGuidance: "Establish a RACI matrix for information security tasks across IT, HR, Legal, and Business units. Appoint a named CISO / ISMS Lead and define asset ownership accountabilities.",
        keyQuestions: [
          "Who holds authority for ISMS operation and reporting performance to executive leadership?",
          "Are security accountabilities documented in official job descriptions?"
        ],
        evidenceExamples: [
          "Security RACI Matrix",
          "CISO Formal Designation Letter",
          "Updated Position Descriptions",
          "Asset Ownership Register"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "30 Jul 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "6",
    title: "Clause 6: Planning",
    type: "clause",
    requirements: [
      {
        id: "6.1.1",
        title: "General (Risks & Opportunities)",
        summary: "Determine systemic risks and opportunities to ensure ISMS achieves intended outcomes and prevents unwanted effects.",
        implementationGuidance: "Evaluate systemic risks such as resource constraints, organizational restructuring, major tech shifts, and supply chain fragility within the risk management framework.",
        keyQuestions: [
          "How are systemic risks affecting the ISMS identified and addressed?",
          "How are opportunities for security capability improvement captured?"
        ],
        evidenceExamples: [
          "ISMS Risk & Opportunity Register",
          "Enterprise Risk Management Framework",
          "Security Improvement Roadmap"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "05 Aug 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "6.1.2",
        title: "Information Security Risk Assessment",
        summary: "Define and apply a repeatable risk assessment process that establishes risk criteria, identifies threats/vulnerabilities, and calculates risk scores.",
        implementationGuidance: "Standardize risk scoring (Likelihood x Impact). Assess asset-based, threat-based, or scenario-based risks across all infrastructure, applications, data, and personnel.",
        keyQuestions: [
          "What methodology is used to conduct security risk assessments, and is it consistently applied?",
          "How are risk criteria, appetite, and impact levels established?"
        ],
        evidenceExamples: [
          "Information Security Risk Assessment Methodology",
          "Completed Risk Assessment Reports",
          "Asset & Threat Registers"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Demo Assessor",
        approver: "Mark Taylor",
        dueDate: "15 Aug 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "6.1.3",
        title: "Information Security Risk Treatment",
        summary: "Formulate a Risk Treatment Plan, select Annex A controls, justify exclusions, and produce a formal Statement of Applicability (SoA).",
        implementationGuidance: "Select control options (Mitigate, Transfer, Avoid, Accept). Map selected mitigations to ISO/IEC 27001:2022 Annex A controls (Organizational, People, Physical, Technological). Obtain formal sign-offs.",
        keyQuestions: [
          "How are risk mitigations mapped to Annex A controls?",
          "Does the Statement of Applicability (SoA) detail justifications for both included and excluded controls?"
        ],
        evidenceExamples: [
          "Statement of Applicability (SoA)",
          "Risk Treatment Plan (RTP)",
          "Formal Risk Acceptance Sign-offs",
          "Control Roadmap"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "25 Aug 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "6.2",
        title: "Information Security Objectives & Planning",
        summary: "Establish measurable security objectives at relevant functions and levels that align with security policy, monitored, and updated.",
        implementationGuidance: "Define quantitative security KPIs (e.g., patching SLAs, MTTR for security incidents, vulnerability remediation windows). Create action plans detailing assigned owners, budgets, and deadlines.",
        keyQuestions: [
          "What measurable security objectives are currently established?",
          "How is progress toward meeting these security goals tracked and reported?"
        ],
        evidenceExamples: [
          "Information Security Objectives Log",
          "Security Metrics Dashboard",
          "Management Review Minutes"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Mark Taylor",
        approver: "Leo Vance",
        dueDate: "05 Sep 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "6.3",
        title: "Planning of Changes",
        summary: "Determine the need for changes to the ISMS and carry them out in a planned and controlled manner.",
        implementationGuidance: "Integrate security review gates into corporate change management (CAB), architecture boards, and CI/CD pipelines to assess security impacts before implementation.",
        keyQuestions: [
          "How are structural, technical, or process changes evaluated for security impact before rollout?",
          "How do you maintain ISMS integrity during major changes?"
        ],
        evidenceExamples: [
          "Security Change Management Procedure",
          "Security Impact Assessments",
          "CAB Sign-offs",
          "Architecture Review Log"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "15 Sep 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "7",
    title: "Clause 7: Support",
    type: "clause",
    requirements: [
      {
        id: "7.1",
        title: "Resources",
        summary: "Determine and provide resources needed for the establishment, implementation, maintenance, and continual improvement of the ISMS.",
        implementationGuidance: "Identify headcount, budget, specialized software (SIEM, EDR, GRC), and external expertise required to sustain information security operations.",
        keyQuestions: [
          "How does the organization determine resource adequacy for security controls and operations?",
          "What budget or headcount requests have been fulfilled to support ISMS needs?"
        ],
        evidenceExamples: [
          "Resource Allocation Plan",
          "Annual Security Budget Approvals",
          "Tooling Licenses",
          "Staffing Capacity Reviews"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "25 Sep 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "7.2",
        title: "Competence",
        summary: "Ensure personnel performing work affecting security performance are competent based on education, training, or experience.",
        implementationGuidance: "Define required security competencies per role. Conduct skills gap analysis, provide specialized training (e.g., secure coding, cloud security), and maintain certifications.",
        keyQuestions: [
          "How do you determine necessary security competencies for key technical and non-technical roles?",
          "What evidence exists that personnel have completed required security training?"
        ],
        evidenceExamples: [
          "Role Competency Matrix",
          "Training Completion Records",
          "Professional Certifications (CISSP, CISM, etc.)",
          "Skill Gap Assessments"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Demo Assessor",
        approver: "Mark Taylor",
        dueDate: "05 Oct 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "7.3",
        title: "Awareness",
        summary: "Ensure persons working under control are aware of security policy, their contribution to ISMS effectiveness, and consequences of non-conformity.",
        implementationGuidance: "Mandate security awareness training during onboarding and annually. Conduct regular phishing simulations and security awareness campaigns.",
        keyQuestions: [
          "How is security awareness communicated to employees, contractors, and third parties?",
          "How do you test staff awareness and address low performance (e.g., failed phishing tests)?"
        ],
        evidenceExamples: [
          "Security Awareness Training Modules",
          "Phishing Simulation Reports",
          "Attendance Logs",
          "Awareness Campaign Materials"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "15 Oct 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "7.4",
        title: "Communication",
        summary: "Determine internal and external communications relevant to the ISMS, including what, when, with whom, and how to communicate.",
        implementationGuidance: "Establish a clear Communication Matrix for routine security updates, incident notifications, and regulatory disclosures (e.g., data breach reporting procedures).",
        keyQuestions: [
          "What protocol exists for internal and external communications regarding security incidents or policy updates?",
          "Who is authorized to communicate with regulators or media during an incident?"
        ],
        evidenceExamples: [
          "Security Communication Strategy",
          "Incident Communication Plan",
          "Regulatory Notification Playbooks",
          "Intranet Broadcasts"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Mark Taylor",
        approver: "Leo Vance",
        dueDate: "25 Oct 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "7.5",
        title: "Documented Information",
        summary: "Create, update, and control documented information required by the ISMS to ensure availability, adequacy, protection, and proper versioning.",
        implementationGuidance: "Establish a document management framework with standard formatting, classification levels, access control, version histories, and formal approval workflows.",
        keyQuestions: [
          "How are ISMS policies, procedures, and evidence files created, reviewed, approved, and controlled?",
          "How do you ensure obsolete documents are retired and current versions are protected from unauthorized change?"
        ],
        evidenceExamples: [
          "Document Control Procedure",
          "Information Classification Standard",
          "Document Version Control Logs",
          "Approved Policy Repository"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Demo Assessor",
        approver: "Mark Taylor",
        dueDate: "05 Nov 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "8",
    title: "Clause 8: Operation",
    type: "clause",
    requirements: [
      {
        id: "8.1",
        title: "Operational Planning & Control",
        summary: "Plan, implement, and control processes needed to meet information security requirements and execute Clause 6 risk treatments.",
        implementationGuidance: "Translate Annex A controls and risk treatments into concrete Standard Operating Procedures (SOPs). Monitor outsourced processes and vendor compliance.",
        keyQuestions: [
          "How are security requirements operationalized into daily IT and business workflows?",
          "How do you verify that outsourced or third-party processes comply with ISMS requirements?"
        ],
        evidenceExamples: [
          "Operational SOPs",
          "System Build Standards",
          "Vendor SLA Monitoring Reports",
          "Outsourcing Risk Reviews"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "15 Nov 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "8.2",
        title: "Information Security Risk Assessment Execution",
        summary: "Perform information security risk assessments at planned intervals or when significant changes occur.",
        implementationGuidance: "Trigger automated or manual risk re-evaluations prior to major architecture releases, post-incident, or at regular scheduled intervals (e.g., bi-annually).",
        keyQuestions: [
          "What triggers an updated risk assessment outside of scheduled reviews?",
          "Can you provide records of risk assessments conducted following a recent major change?"
        ],
        evidenceExamples: [
          "Risk Assessment Execution Logs",
          "Change-Triggered Risk Reviews",
          "Updated Risk Registers"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "25 Nov 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "8.3",
        title: "Information Security Risk Treatment Execution",
        summary: "Implement the risk treatment plan formulated during the Clause 6 planning process.",
        implementationGuidance: "Deploy technical controls, policy controls, and physical safeguards outlined in the Risk Treatment Plan (RTP). Track remediation tasks to completion.",
        keyQuestions: [
          "How are risk treatment tasks assigned, tracked, and verified upon completion?",
          "What evidence confirms that selected Annex A controls are actively operating?"
        ],
        evidenceExamples: [
          "RTP Implementation Tracker",
          "Security Engineering Tickets (Jira/ServiceNow)",
          "Control Verification Test Results"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "05 Dec 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "9",
    title: "Clause 9: Performance Evaluation",
    type: "clause",
    requirements: [
      {
        id: "9.1",
        title: "Monitoring, Measurement, Analysis & Evaluation",
        summary: "Determine what needs to be monitored, methods used, timing, and who evaluates information security performance.",
        implementationGuidance: "Implement automated monitoring (SIEM, vulnerability scanners, compliance dashboards). Define key performance metrics (KPIs) and key risk indicators (KRIs).",
        keyQuestions: [
          "What metrics are used to measure the effectiveness of the ISMS and security controls?",
          "How frequently are security performance metrics analyzed and reported to management?"
        ],
        evidenceExamples: [
          "Security Monitoring Metrics",
          "Vulnerability Scan Summaries",
          "SIEM Performance Reports",
          "KPI/KRI Dashboards"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "15 Dec 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "9.2",
        title: "Internal Audit",
        summary: "Conduct internal audits at planned intervals to determine whether the ISMS conforms to requirements and is effectively implemented.",
        implementationGuidance: "Establish an independent annual Internal Audit Program. Audit all standard clauses and selected Annex A controls. Report nonconformities to management.",
        keyQuestions: [
          "Is there an approved Internal Audit Schedule covering all ISMS processes and controls?",
          "How is auditor independence ensured, and how are audit findings remediated?"
        ],
        evidenceExamples: [
          "Internal Audit Charter",
          "Annual Audit Schedule",
          "Internal Audit Reports",
          "Corrective Action Tracking Logs"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Mark Taylor",
        approver: "Leo Vance",
        dueDate: "20 Dec 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "9.3",
        title: "Management Review",
        summary: "Top management must review the organization's ISMS at planned intervals to ensure its continuing suitability, adequacy, and effectiveness.",
        implementationGuidance: "Schedule formal executive Management Review meetings at least annually. Review risk assessment updates, incident trends, audit findings, and resource needs.",
        keyQuestions: [
          "How frequently does top management formally review ISMS performance?",
          "What decisions and actions resulted from the most recent Management Review meeting?"
        ],
        evidenceExamples: [
          "Management Review Meeting Minutes",
          "Executive Presentation Decks",
          "Formal Management Review Decisions Record"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "25 Dec 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "10",
    title: "Clause 10: Improvement",
    type: "clause",
    requirements: [
      {
        id: "10.1",
        title: "Continual Improvement",
        summary: "Continually improve the suitability, adequacy, and effectiveness of the ISMS.",
        implementationGuidance: "Analyze performance data, incident lessons learned, audit findings, and external benchmarks to drive continuous security capability enhancements.",
        keyQuestions: [
          "How does the organization demonstrate systematic, ongoing improvement of the ISMS?",
          "What recent initiatives were launched to enhance security effectiveness?"
        ],
        evidenceExamples: [
          "Continual Improvement Register",
          "Post-Incident Root Cause Analysis (RCA)",
          "Capability Maturity Models"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Demo Assessor",
        approver: "Leo Vance",
        dueDate: "30 Dec 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "10.2",
        title: "Nonconformity & Corrective Action",
        summary: "React to nonconformities, evaluate root causes, implement corrective action, review effectiveness, and update risks if necessary.",
        implementationGuidance: "Establish a formal Corrective Action Preventive Action (CAPA) process. Perform root cause analysis for audit nonconformities or security incidents and track closure.",
        keyQuestions: [
          "What process is triggered when an audit nonconformity or control failure occurs?",
          "How do you verify that corrective actions effectively prevent recurrence of root causes?"
        ],
        evidenceExamples: [
          "Corrective Action Requests (CARs)",
          "Root Cause Analysis (RCA) Documents",
          "CAPA Closure Approvals"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "31 Dec 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  }
];

export const NIST_AI_RMF_CATEGORIES: FrameworkClause[] = [
  {
    id: "GV",
    title: "GOVERN Function",
    type: "clause",
    requirements: [
      {
        id: "GV-1",
        title: "Governance & Lifecycle Policies",
        summary: "Policies, processes, procedures, and practices across organizational AI lifecycles are established, documented, and maintained.",
        implementationGuidance: "Draft and operationalize organizational policies for AI design, development, procurement, deployment, and decommission. Align with enterprise risk appetite.",
        keyQuestions: [
          "How are enterprise AI policies established, maintained, and communicated across engineering and product teams?",
          "What mechanisms exist to enforce policy compliance throughout the model lifecycle?"
        ],
        evidenceExamples: [
          "AI Lifecycle Policy Charter",
          "AI Governance Directives",
          "Enterprise Risk Appetite Statement",
          "Policy Conformance Audits"
        ],
        implementationDescription: "Draft review of corporate AI guidelines completed and matched against our active projects.",
        status: "In progress",
        owner: "Demo Assessor",
        reviewer: "Mark Taylor",
        approver: "Leo Vance",
        dueDate: "12 Aug 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "GV-2",
        title: "Roles & Accountabilities",
        summary: "Accountability structures, roles, and responsibilities are defined, documented, and assigned for AI system lifecycles.",
        implementationGuidance: "Establish RACI matrices for AI risk decisions. Designate clear system owners, MLOps leads, risk managers, and ethics review board authorities.",
        keyQuestions: [
          "Who is formally accountable for sign-off on AI risk acceptance and model releases?",
          "How are responsibilities delineated between engineering, compliance, and product teams?"
        ],
        evidenceExamples: [
          "AI Lifecycle RACI Matrix",
          "AI Governance Committee Charter",
          "Position Description Updates",
          "Delegation of Authority Matrix"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "22 Aug 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "GV-3",
        title: "Workforce Competence & Literacy",
        summary: "Workforce capabilities, diversity, equity, inclusion, and AI literacy are cultivated and sustained.",
        implementationGuidance: "Implement AI literacy programs covering technical safety, algorithmic bias, privacy, and regulatory rules tailored for developers, operators, and executives.",
        keyQuestions: [
          "How does the organization assess and advance workforce competency in responsible AI design and operation?",
          "What training is required prior to deploying production AI workloads?"
        ],
        evidenceExamples: [
          "AI Literacy Curriculum",
          "Training Completion Registers",
          "Role Competency Assessment Records",
          "Skill Gap Reports"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "30 Aug 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "GV-4",
        title: "Organizational Culture & Trust",
        summary: "Organizational commitment to a culture of safety, trust, ethics, and transparency is communicated and incentivized.",
        implementationGuidance: "Establish whistleblower pathways for algorithmic harm reporting, incentivize bias/vulnerability disclosures, and embed responsible AI metrics into annual performance reviews.",
        keyQuestions: [
          "How does management encourage open reporting of technical AI failures, safety flaws, or emergent risks?",
          "What formal ethical guidelines govern AI projects?"
        ],
        evidenceExamples: [
          "Corporate Code of Ethics for AI",
          "Whistleblower Policy Logs",
          "Safety Culture Survey Reports",
          "Executive Communication Logs"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Mark Taylor",
        approver: "Leo Vance",
        dueDate: "05 Sep 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "GV-5",
        title: "Stakeholder Engagement",
        summary: "Stakeholder engagement processes, including internal/external impacted communities, are established and integrated.",
        implementationGuidance: "Engage affected end-users, subject matter experts, and regulatory bodies during initial model framing and post-deployment impact assessments.",
        keyQuestions: [
          "How are feedback and concerns from end-users or impacted communities captured and integrated into AI design?",
          "What external consultation processes exist?"
        ],
        evidenceExamples: [
          "Stakeholder Consultative Matrix",
          "Impacted Community Feedback Reports",
          "External Expert Panel Review Minutes"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "10 Sep 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "GV-6",
        title: "Third-Party & Vendor AI Risk",
        summary: "Policies and procedures for identifying, managing, and governing third-party/vendor AI components are established.",
        implementationGuidance: "Establish third-party AI risk screening (vendor model provenance, API security, data license rights, vendor model cards, and liability terms).",
        keyQuestions: [
          "How are third-party AI models, SaaS APIs, or pre-trained foundation models vetted before integration?",
          "What contractual clauses enforce vendor transparency?"
        ],
        evidenceExamples: [
          "Vendor AI Security Assessments",
          "AI Procurement Checklist",
          "Third-Party Model Provenance Audits",
          "Service Level Agreements (SLAs)"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "15 Sep 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "MP",
    title: "MAP Function",
    type: "clause",
    requirements: [
      {
        id: "MP-1",
        title: "Context & Intended Use Definition",
        summary: "Context, intended capabilities, boundaries, and operational environment of the AI system are mapped and documented.",
        implementationGuidance: "Define explicit intended use cases, target user personas, system boundaries, out-of-scope usages, and operational constraints for each AI system.",
        keyQuestions: [
          "Where is the intended purpose, operating environment, and boundary of the AI system formally documented?",
          "How are misuse cases or unauthorized deployment scenarios identified?"
        ],
        evidenceExamples: [
          "AI System Intended Purpose Specification",
          "Operational Boundary Diagrams",
          "Misuse Scenario Catalog"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "20 Sep 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "MP-2",
        title: "System Classification & Dependencies",
        summary: "AI system categorization, data inputs, hardware/software dependencies, and model architecture are mapped.",
        implementationGuidance: "Maintain a detailed AI System Inventory detailing data pipelines, foundation models, fine-tuning datasets, tech stack dependencies, and cloud architecture.",
        keyQuestions: [
          "Is there a central registry capturing system inputs, model architectures, and infrastructure dependencies?",
          "How are upstream and downstream data flows mapped?"
        ],
        evidenceExamples: [
          "Enterprise AI System Inventory",
          "Data Lineage Diagrams",
          "Software Bill of Materials (SBOM / AIBOM)",
          "Tech Stack Architecture"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "30 Sep 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "MP-3",
        title: "Risk & Societal Impact Characterization",
        summary: "Benefits, potential individual/societal harms, legal impacts, and fundamental rights risks are identified and categorized.",
        implementationGuidance: "Perform AI System Impact Assessments (AISIA) evaluating fairness, fundamental rights, economic impact, environmental consumption, and physical safety risks.",
        keyQuestions: [
          "How does the organization evaluate broader societal, equity, or safety impacts prior to model training?",
          "What criteria define unacceptable or high-risk AI deployments?"
        ],
        evidenceExamples: [
          "Executed AISIA Reports",
          "Fundamental Rights Impact Assessments",
          "Societal & Environmental Harm Evaluations"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "05 Oct 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "MP-4",
        title: "Trustworthy AI Characteristics Mapping",
        summary: "Risks related to key trustworthy AI characteristics (safety, security, resilience, transparency, privacy, bias, explainability) are mapped.",
        implementationGuidance: "Cross-reference model architectures against NIST AI RMF Trustworthy AI Dimensions (Valid/Reliable, Safe, Secure/Resilient, Accountable/Transparent, Explainable/Interpretable, Privacy-Preserving, Fair with Bias Mitigated).",
        keyQuestions: [
          "How are specific technical risks mapped to the seven NIST Trustworthy AI characteristics?",
          "What trade-offs between characteristics (e.g., accuracy vs. privacy) were documented?"
        ],
        evidenceExamples: [
          "Trustworthy AI Mapping Matrix",
          "Trade-Off Analysis Documentation",
          "AI Characteristic Risk Register"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Mark Taylor",
        approver: "Leo Vance",
        dueDate: "15 Oct 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "MP-5",
        title: "External Data & System Dependencies",
        summary: "Third-party systems, external datasets, open-source weights, and vendor integrations are mapped and evaluated.",
        implementationGuidance: "Verify data licensing, legal rights, copyright risks, data collection consent pipelines, and security risks of third-party dataset inputs or pre-trained models.",
        keyQuestions: [
          "How do you verify the legal, privacy, and safety provenance of external training or fine-tuning datasets?",
          "What dependencies on external vendor APIs exist?"
        ],
        evidenceExamples: [
          "Dataset Licensing & Provenance Log",
          "External Data Lineage Records",
          "Third-Party Model Cards",
          "Legal Review Clearance"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "25 Oct 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "MS",
    title: "MEASURE Function",
    type: "clause",
    requirements: [
      {
        id: "MS-1",
        title: "TEVV Metrics & Measurement Framework",
        summary: "Appropriate metrics, tools, and methodologies for Testing, Evaluation, Verification, and Validation (TEVV) are defined and applied.",
        implementationGuidance: "Define domain-specific benchmarks (e.g., precision, recall, F1-score, toxicity rate, hallucination rate, latency, differential privacy metrics).",
        keyQuestions: [
          "What quantitative and qualitative metrics are established to evaluate AI model safety, accuracy, and fairness?",
          "How are testing thresholds set and approved?"
        ],
        evidenceExamples: [
          "TEVV Framework Specification",
          "Benchmark Selection Records",
          "Metric Threshold Criteria"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "05 Nov 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "MS-2",
        title: "Empirical Evaluation & Model Testing",
        summary: "AI systems are evaluated regularly for performance, robustness, security vulnerabilities, and bias through empirical testing.",
        implementationGuidance: "Conduct adversarial robustness testing, red-teaming, prompt injection audits, differential bias testing across demographic subsets, and out-of-distribution testing.",
        keyQuestions: [
          "What empirical testing (including red-teaming and bias testing) was performed before model release?",
          "How are edge cases and adversarial scenarios validated?"
        ],
        evidenceExamples: [
          "Red-Team Testing Reports",
          "Model Validation & Verification Test Results",
          "Demographic Disparity Reports",
          "Adversarial Assessment"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Mark Taylor",
        approver: "Leo Vance",
        dueDate: "15 Nov 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "MS-3",
        title: "Continuous Monitoring & Drift Detection",
        summary: "AI system performance, data drift, concept drift, safety, and security are continuously monitored in production environments.",
        implementationGuidance: "Implement automated telemetry to monitor input data drift, model output distribution changes, performance degradation, latency anomalies, and hallucination spikes.",
        keyQuestions: [
          "How is the model monitored in production to detect performance drift, bias, or emergent vulnerabilities?",
          "What alerting thresholds trigger human intervention?"
        ],
        evidenceExamples: [
          "Production Monitoring Dashboards",
          "Model Drift Log",
          "Automated Alert History",
          "Performance Degradation Summaries"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "25 Nov 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "MS-4",
        title: "Feedback Loops & Metric Documentation",
        summary: "Feedback mechanisms and evaluation results are documented, communicated, and utilized to update risk assessments.",
        implementationGuidance: "Document all TEVV results in standardized Model Cards. Feed production incident metrics back into the MAP and GOVERN risk re-evaluations.",
        keyQuestions: [
          "Are TEVV results systematically published in standardized documentation like Model Cards or System Cards?",
          "How does production telemetry inform model retrain cycles?"
        ],
        evidenceExamples: [
          "Published Model Cards / System Cards",
          "TEVV Summary Reports",
          "Feedback Integration Logs",
          "Retrain Decision Records"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "05 Dec 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "MN",
    title: "MANAGE Function",
    type: "clause",
    requirements: [
      {
        id: "MN-1",
        title: "Risk Mitigation & Treatment Prioritization",
        summary: "Identified AI risks are prioritized, treated, mitigated, or avoided based on risk assessments and impact analyses.",
        implementationGuidance: "Formulate an AI Risk Treatment Plan. Implement guardrails (input/output filters, alignment tuning, RLHF, guardrail models, access controls).",
        keyQuestions: [
          "How are mapped and measured AI risks prioritized and treated prior to deployment?",
          "What technical guardrails are deployed to block toxic, biased, or unsafe outputs?"
        ],
        evidenceExamples: [
          "AI Risk Treatment Plan (RTP)",
          "Guardrail Configuration Specs",
          "Risk Acceptance Forms",
          "Mitigation Verification Logs"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "10 Dec 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "MN-2",
        title: "Operational Controls & Risk Response Execution",
        summary: "Risk management strategies and mitigation controls are operationalized, maintained, and routinely evaluated.",
        implementationGuidance: "Integrate automated guardrails into MLOps pipelines (e.g., NeMo Guardrails, Llama Guard, WAF rules). Enforce Human-in-the-Loop (HITL) gates for high-stakes actions.",
        keyQuestions: [
          "What operational controls or Human-in-the-Loop (HITL) requirements exist for automated decisioning?",
          "How are guardrail failures managed?"
        ],
        evidenceExamples: [
          "MLOps Security Pipeline Configurations",
          "HITL Operational Procedures",
          "Guardrail Audit Logs",
          "Mitigation Control Testing"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Leo Vance",
        reviewer: "Mark Taylor",
        approver: "Demo Assessor",
        dueDate: "15 Dec 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "MN-3",
        title: "Third-Party Risk Management Operations",
        summary: "Risks associated with third-party AI models, components, data, and cloud providers are managed and controlled dynamically.",
        implementationGuidance: "Monitor third-party vendor status, track vendor model updates/deprecation, enforce API rate limits, and sanitize data passed to third-party endpoints.",
        keyQuestions: [
          "How are dynamic risks from third-party model updates or API changes managed post-deployment?",
          "How is vendor data privacy ensured during API calls?"
        ],
        evidenceExamples: [
          "Third-Party API Safeguard Specs",
          "Vendor Model Deprecation Watchlist",
          "Data Sanitization Gateway Logs"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Mark Taylor",
        reviewer: "Leo Vance",
        approver: "Demo Assessor",
        dueDate: "20 Dec 2026",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "MN-4",
        title: "Incident Response, Fallbacks & Decommissioning",
        summary: "Emergency shutdown procedures, fallback mechanisms, incident response playbooks, and decommissioning protocols are established.",
        implementationGuidance: "Create AI Incident Playbooks (handling hallucination, data breach, prompt injection, bias crisis). Implement fallback rules (switching to rule-based logic or human operators) and kill-switches.",
        keyQuestions: [
          "Is there a documented kill-switch or emergency fallback mechanism if the AI system behaves unpredictably?",
          "How are AI safety incidents handled and reported?"
        ],
        evidenceExamples: [
          "AI Incident Response Playbook",
          "Emergency Kill-Switch Test Records",
          "Fallback Logic Architectural Specs",
          "System Decommissioning Logs"
        ],
        implementationDescription: "",
        status: "Not started",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "31 Dec 2026",
        auditorFeedback: "",
        notes: ""
      }
    ]
  }
];

export const SOC_2_CLAUSES: FrameworkClause[] = [
  {
    id: "CC1",
    title: "CC1 – Control Environment",
    type: "clause",
    requirements: [
      {
        id: "CC1.1",
        title: "Integrity & Ethical Values",
        summary: "Establishes organizational commitment to integrity, ethical behavior, and accountability through a formal Code of Conduct, acknowledgments, reporting channels, and background screening.",
        implementationGuidance: "Publish a clear Code of Conduct / Acceptable Use Policy covering ethics, conflicts of interest, data handling, and violation reporting. Require acknowledgment at hire and annually. Implement an anonymous whistleblower channel. Perform background checks for sensitive roles. Enforce the Code consistently and document actions taken.",
        keyQuestions: [
          "Does a current Code of Conduct exist and cover key topics?",
          "How is acknowledgment tracked for employees and contractors?",
          "Is there an anonymous reporting channel and how is it used?",
          "For which roles are background checks required?",
          "How are violations investigated and remediated?"
        ],
        evidenceExamples: [
          "Signed/electronic acknowledgments",
          "LMS or policy-tool completion reports",
          "Background check logs",
          "Whistleblower reports and investigation records",
          "Disciplinary action documentation"
        ],
        implementationDescription: "Code of Conduct published and integrated into onboarding workflow with automated annual re-attestation.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-30",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC1.2",
        title: "Board Oversight",
        summary: "Ensures independent oversight of the security and compliance program by the board or equivalent body.",
        implementationGuidance: "Include security/compliance oversight in the board or advisory board charter. Provide quarterly status updates. Conduct or commission an independent review of the security program at least annually. Document discussions and follow-up actions.",
        keyQuestions: [
          "Does the board charter explicitly include security/compliance oversight?",
          "How often does management report to the board?",
          "Is there evidence of independent review?",
          "How are board action items tracked?"
        ],
        evidenceExamples: [
          "Board/advisory board charter",
          "Meeting minutes",
          "Presentation decks",
          "Independent review reports",
          "Action-item trackers"
        ],
        implementationDescription: "Quarterly Board Cyber & AI Governance reporting deck scheduled.",
        status: "In progress",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-09-15",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC1.3",
        title: "Structures & Authorities",
        summary: "Defines clear organizational structure, reporting lines, authorities, and control ownership so responsibilities are understood and executed.",
        implementationGuidance: "Maintain a current organizational chart. Document a RACI or control ownership matrix. Include security responsibilities in job descriptions. Define escalation paths for security decisions and incidents.",
        keyQuestions: [
          "Is the org chart current and does it show security/compliance reporting lines?",
          "Is control ownership formally assigned?",
          "Do job descriptions include security duties?",
          "How are authorities and escalations defined?"
        ],
        evidenceExamples: [
          "Organizational chart",
          "RACI/control ownership matrix",
          "Job descriptions",
          "Access approval workflows tied to roles"
        ],
        implementationDescription: "Control ownership matrix mapped across all system modules and departments.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-15",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC1.4",
        title: "Competence",
        summary: "Ensures the organization attracts, develops, and retains people with the competence needed to support security objectives.",
        implementationGuidance: "Deliver security awareness training at onboarding and annually. Provide role-based technical training for engineers and admins. Include security responsibilities in performance reviews. Assess competency for privileged roles.",
        keyQuestions: [
          "Is awareness training mandatory at hire and annually?",
          "What role-based training exists for privileged users?",
          "Are security responsibilities included in performance reviews?",
          "How is competency assessed for high-risk roles?"
        ],
        evidenceExamples: [
          "LMS completion reports",
          "Training materials",
          "Performance review samples",
          "Competency assessment records"
        ],
        implementationDescription: "Mandatory security and AI safety training deployed via LMS with 95% completion rate.",
        status: "In progress",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-09-01",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC1.5",
        title: "Accountability",
        summary: "Holds individuals accountable for their internal control responsibilities through ownership, review of failures, and performance metrics.",
        implementationGuidance: "Assign documented control owners. Review control failures and track corrective actions. Incorporate security metrics into team or individual goals. Apply consistent consequences for non-compliance.",
        keyQuestions: [
          "Are control owners formally documented and aware of their duties?",
          "How does management review control failures?",
          "Are security metrics part of performance goals?",
          "What happens when responsibilities are not met?"
        ],
        evidenceExamples: [
          "Control ownership register",
          "Remediation tickets",
          "Management review records",
          "Performance review excerpts containing security metrics"
        ],
        implementationDescription: "Control owner assignments established and tracked in quarterly compliance reviews.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-20",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "CC2",
    title: "CC2 – Communication and Information",
    type: "clause",
    requirements: [
      {
        id: "CC2.1",
        title: "Quality Information",
        summary: "Ensures relevant, quality information is obtained, generated, and used to support internal control.",
        implementationGuidance: "Implement centralized logging (SIEM or equivalent) of security-relevant events. Maintain dashboards for control status, vulnerabilities, and incidents. Define data quality standards for compliance evidence.",
        keyQuestions: [
          "What security events are logged and for how long?",
          "What dashboards exist and who reviews them?",
          "Are data quality standards defined for evidence?",
          "How is completeness and accuracy of monitoring data ensured?"
        ],
        evidenceExamples: [
          "Log retention configuration",
          "Sample dashboard screenshots/exports",
          "Evidence collection procedures",
          "SIEM rule documentation"
        ],
        implementationDescription: "SIEM centralized logging active with 90-day hot retention and cold archiving.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-10",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC2.2",
        title: "Internal Communication",
        summary: "Communicates objectives, responsibilities, and security information so personnel can fulfill their control duties.",
        implementationGuidance: "Distribute policies via a managed tool with acknowledgment tracking. Send regular security updates (newsletters, all-hands). Maintain clear incident reporting and escalation channels. Include security orientation in onboarding.",
        keyQuestions: [
          "How are policies distributed and acknowledgments tracked?",
          "What ongoing security communications occur?",
          "How do employees report incidents?",
          "Is security covered in new-hire orientation?"
        ],
        evidenceExamples: [
          "Policy distribution and acknowledgment logs",
          "Communication samples (newsletters, Slack/Teams)",
          "Incident reporting procedure",
          "Onboarding checklists"
        ],
        implementationDescription: "Policy portal established with Slack integration for security alerts and announcements.",
        status: "In progress",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-09-10",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC2.3",
        title: "External Communication",
        summary: "Communicates relevant security and control information to external parties (customers, vendors, public).",
        implementationGuidance: "Maintain an accurate public Trust Center or security page. Define and follow a customer incident notification procedure with clear timelines. Establish vendor security communication channels. Operate a status page for availability incidents if applicable.",
        keyQuestions: [
          "Does the Trust Center accurately describe the system and controls?",
          "What is the customer notification procedure and timeline?",
          "How are vendors informed of security issues?",
          "Is a status page maintained?"
        ],
        evidenceExamples: [
          "Trust Center content",
          "Notification templates and sample emails",
          "Vendor communication records",
          "Status page history"
        ],
        implementationDescription: "Public Trust Center published with active SOC 2 compliance status badge.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-01",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "CC3",
    title: "CC3 – Risk Assessment",
    type: "clause",
    requirements: [
      {
        id: "CC3.1",
        title: "Specify Objectives",
        summary: "Defines clear security objectives aligned to the Trust Services Criteria and service commitments so risks can be identified.",
        implementationGuidance: "Document security objectives in policy or risk management documentation. Align them explicitly to in-scope TSC categories and customer SLAs/commitments. Review and update periodically.",
        keyQuestions: [
          "Where are security objectives documented?",
          "Are they aligned to the in-scope TSC and customer commitments?",
          "How often are they reviewed?"
        ],
        evidenceExamples: [
          "Security policy or risk management policy stating objectives",
          "Alignment mapping to TSC/SLAs"
        ],
        implementationDescription: "Security objectives defined and mapped against TSC criteria and customer SLAs.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-12",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC3.2",
        title: "Identify & Analyze Risks",
        summary: "Systematically identifies and analyzes risks to the achievement of objectives across people, process, technology, and third parties.",
        implementationGuidance: "Adopt a formal methodology (likelihood × impact). Perform at least annual risk assessments. Maintain a living risk register with owners and treatment plans. Use an asset inventory as a key input.",
        keyQuestions: [
          "What methodology is used?",
          "What is the assessment frequency and scope?",
          "Is the risk register kept current with owners and treatments?",
          "Is an asset inventory maintained and used?"
        ],
        evidenceExamples: [
          "Risk assessment methodology",
          "Latest risk assessment report",
          "Living risk register",
          "Asset inventory"
        ],
        implementationDescription: "Annual risk assessment completed; risk register updated in Risk & Assurance module.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-07-30",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC3.3",
        title: "Fraud Risk",
        summary: "Explicitly considers the potential for fraud (including IT-specific scenarios) when assessing risks.",
        implementationGuidance: "Include dedicated fraud scenarios (insider threat, privilege abuse, data manipulation, social engineering) in the risk assessment. Perform segregation-of-duties analysis for critical processes.",
        keyQuestions: [
          "Are fraud risks explicitly assessed?",
          "What scenarios are considered?",
          "Has an SoD analysis been performed for critical processes?"
        ],
        evidenceExamples: [
          "Fraud risk section of the risk assessment",
          "SoD matrix or analysis results"
        ],
        implementationDescription: "Fraud risk scenarios added to standard risk evaluation matrix.",
        status: "In progress",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-09-15",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC3.4",
        title: "Assess Changes",
        summary: "Identifies and assesses significant changes that could impact the system of internal control.",
        implementationGuidance: "Define a change impact assessment process covering technology, personnel, vendor, and regulatory changes. Trigger risk re-assessment after material events. Document the assessment and any resulting risk register updates.",
        keyQuestions: [
          "Is there a defined process to assess control impact of significant changes?",
          "What events trigger re-assessment?",
          "Who performs and approves the assessments?"
        ],
        evidenceExamples: [
          "Change tickets with risk impact notes",
          "Updated risk register entries",
          "Change impact assessment procedure"
        ],
        implementationDescription: "Change management policy integrated with mandatory risk impact review steps.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-22",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "CC4",
    title: "CC4 – Monitoring Activities",
    type: "clause",
    requirements: [
      {
        id: "CC4.1",
        title: "Ongoing / Separate Evaluations",
        summary: "Continuously and periodically evaluates whether controls are present and functioning.",
        implementationGuidance: "Deploy continuous monitoring (SIEM alerts, vulnerability scanning, control health dashboards). Perform periodic internal self-assessments or internal audits. Conduct annual penetration testing or red-team exercises.",
        keyQuestions: [
          "What continuous monitoring is in place?",
          "Are internal evaluations performed and how often?",
          "Is pen-testing conducted at least annually?",
          "How is coverage of in-scope systems ensured?"
        ],
        evidenceExamples: [
          "Alert triage tickets",
          "Internal audit/self-assessment reports",
          "Pen-test reports",
          "Dashboard exports"
        ],
        implementationDescription: "Annual third-party penetration test executed with zero critical findings.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-05",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC4.2",
        title: "Communicate Deficiencies",
        summary: "Evaluates and communicates control deficiencies in a timely manner to those responsible for corrective action.",
        implementationGuidance: "Define a process and severity matrix for reporting deficiencies. Track issues to remediation with escalation. Report status regularly to senior management and the board.",
        keyQuestions: [
          "Is there a defined deficiency reporting process and severity matrix?",
          "How are issues tracked and escalated?",
          "How often is status reported to management/board?"
        ],
        evidenceExamples: [
          "Deficiency log",
          "Remediation tickets",
          "Management/board reports",
          "Severity matrix"
        ],
        implementationDescription: "Deficiency SLA tracking matrix configured with automatic escalation triggers.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-18",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "CC5",
    title: "CC5 – Control Activities",
    type: "clause",
    requirements: [
      {
        id: "CC5.1",
        title: "Select Control Activities",
        summary: "Selects and develops control activities that mitigate identified risks to acceptable levels.",
        implementationGuidance: "Map controls to risks in the risk register. Maintain a documented mix of preventive and detective controls. Review the mapping when risks or systems change.",
        keyQuestions: [
          "Are controls formally mapped to risks?",
          "Is there a documented mix of preventive and detective controls?",
          "How is the mapping kept current?"
        ],
        evidenceExamples: [
          "Risk-to-control mapping matrix"
        ],
        implementationDescription: "Comprehensive risk-to-control matrix established.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-14",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC5.2",
        title: "Technology General Controls",
        summary: "Establishes general technology controls that support the achievement of objectives.",
        implementationGuidance: "Define and enforce hardened baseline configurations, encryption standards, network segmentation, logging standards, and secure coding requirements. Monitor compliance with baselines.",
        keyQuestions: [
          "Are hardened baselines defined and monitored?",
          "What encryption standards apply?",
          "How is network segmentation implemented?",
          "Are secure coding requirements enforced?"
        ],
        evidenceExamples: [
          "Configuration baselines",
          "Encryption policy",
          "Network diagrams",
          "Secure SDLC policy"
        ],
        implementationDescription: "Infrastructure-as-Code templates enforce baseline security configurations.",
        status: "In progress",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-09-20",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC5.3",
        title: "Policies & Procedures",
        summary: "Deploys control activities through policies that set expectations and procedures that put policies into action.",
        implementationGuidance: "Maintain a suite of written policies (Access, Change, IR, Vendor, Data Classification, etc.). Review and approve at least annually. Create supporting procedures. Operate a documented exception process.",
        keyQuestions: [
          "What policies exist and when were they last reviewed?",
          "Do procedures operationalize the policies?",
          "Is there an exception process with approvals?"
        ],
        evidenceExamples: [
          "Policy documents with review/approval dates",
          "Procedure documents",
          "Exception logs"
        ],
        implementationDescription: "Full policy suite reviewed and published in Governance module.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-01",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "CC6",
    title: "CC6 – Logical and Physical Access Controls",
    type: "clause",
    requirements: [
      {
        id: "CC6.1",
        title: "Logical Access Security",
        summary: "Implements logical access security software, infrastructure, and architectures to protect information assets.",
        implementationGuidance: "Enforce SSO + MFA for production and administrative access. Implement RBAC. Encrypt data at rest (AES-256 or equivalent) and in transit (TLS 1.2+). Apply network segmentation and firewalls/security groups.",
        keyQuestions: [
          "Is SSO + MFA enforced for all production/admin access?",
          "How is RBAC implemented?",
          "What encryption is used at rest and in transit?",
          "How is network segmentation configured?"
        ],
        evidenceExamples: [
          "IdP configuration screenshots/exports",
          "MFA enforcement reports",
          "Encryption configurations",
          "Network diagrams"
        ],
        implementationDescription: "SSO with WebAuthn/TOTP MFA mandated across all internal services and cloud portals.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-08",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC6.2",
        title: "User Registration & Authorization",
        summary: "Registers and authorizes new users before issuing credentials and granting access.",
        implementationGuidance: "Use a formal access request and approval workflow. Ensure the approver is not the requester. Apply least privilege at provisioning.",
        keyQuestions: [
          "What is the access request/approval workflow?",
          "Is segregation of duties enforced (requester ≠ approver)?",
          "How is least privilege applied?"
        ],
        evidenceExamples: [
          "Access request tickets with approvals",
          "Provisioning logs"
        ],
        implementationDescription: "Automated ticketing workflow enforces dual-authorization for privileged access requests.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-11",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC6.3",
        title: "Access Modification & Removal",
        summary: "Modifies or removes access based on roles and changes, applying least privilege and segregation of duties; performs timely de-provisioning and periodic reviews.",
        implementationGuidance: "De-provision access on termination or role change within a defined target (same day/next business day). Conduct periodic access reviews (at least quarterly for privileged accounts). Use PAM or just-in-time access for elevated privileges.",
        keyQuestions: [
          "What is the de-provisioning timeline and how is it enforced?",
          "How often are access reviews performed and who signs off?",
          "Is PAM/JIT used for privileged access?"
        ],
        evidenceExamples: [
          "Offboarding checklists",
          "Access review reports with sign-off",
          "PAM logs",
          "Access removal records"
        ],
        implementationDescription: "Quarterly access review completed; automated de-provisioning linked to HR system termination events.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-15",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC6.4",
        title: "Physical Access",
        summary: "Restricts physical access to facilities and protected information assets to authorized personnel.",
        implementationGuidance: "Implement badge access (or equivalent) and visitor logging for offices/data centers. For cloud environments, rely on the provider’s SOC 2/ISO report and document complementary user entity controls.",
        keyQuestions: [
          "What physical controls exist for offices and data centers?",
          "Is visitor logging enforced?",
          "For cloud, is provider reliance documented along with CUECs?"
        ],
        evidenceExamples: [
          "Badge access logs",
          "Visitor logs",
          "Cloud provider attestation reports",
          "Documented CUECs"
        ],
        implementationDescription: "GCP / AWS SOC 2 Type II reports reviewed and CUEC cross-mapping documented.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-07-28",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC6.5",
        title: "Asset Disposal",
        summary: "Discontinues logical and physical protections over assets only after the ability to recover data/software has been removed.",
        implementationGuidance: "Define secure wipe or destruction procedures for media and devices. Track assets through their lifecycle. Obtain certificates of destruction where appropriate.",
        keyQuestions: [
          "What secure disposal procedures are used?",
          "How are assets tracked to disposal?",
          "Are destruction certificates retained?"
        ],
        evidenceExamples: [
          "Disposal certificates",
          "Wipe logs",
          "Asset inventory status records"
        ],
        implementationDescription: "NIST 800-88 cryptographic wipe procedure mandated for decommissioned storage volumes.",
        status: "In progress",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-09-05",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC6.6",
        title: "Boundary Protection",
        summary: "Implements logical access security measures to protect against threats from outside system boundaries.",
        implementationGuidance: "Deploy perimeter firewalls/security groups, WAF, DDoS protection, and IDS/IPS. Restrict administrative access from the internet.",
        keyQuestions: [
          "What perimeter protections are in place?",
          "How is administrative access from the internet restricted?",
          "How are IDS/IPS alerts handled?"
        ],
        evidenceExamples: [
          "Firewall rulesets",
          "WAF configs",
          "IDS/IPS alert samples"
        ],
        implementationDescription: "Cloud WAF and DDoS mitigation active with zero public SSH/RDP exposure.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-03",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC6.7",
        title: "Transmission / Movement of Information",
        summary: "Restricts and protects the transmission, movement, and removal of information.",
        implementationGuidance: "Apply DLP controls or data classification labels. Require encrypted channels for data movement. Control removable media and downloads of sensitive data.",
        keyQuestions: [
          "Are DLP or classification labels used?",
          "Are encrypted channels required for data movement?",
          "What controls exist over removable media and sensitive downloads?"
        ],
        evidenceExamples: [
          "DLP policies",
          "Encryption configs",
          "Download logs or restriction settings"
        ],
        implementationDescription: "TLS 1.3 enforced on external endpoints; AES-256 for internal service-to-service communication.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-09",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC6.8",
        title: "Malware Prevention",
        summary: "Prevents or detects and acts upon the introduction of unauthorized or malicious software.",
        implementationGuidance: "Deploy EDR or antivirus on endpoints and servers. Use application allow-listing where appropriate. Keep signatures/behavior models updated. Define response procedures for detections.",
        keyQuestions: [
          "What endpoint/server protection is deployed and what is the coverage?",
          "Is allow-listing used?",
          "How are detections handled and how are signatures kept current?"
        ],
        evidenceExamples: [
          "EDR coverage reports",
          "Malware detection tickets",
          "Allow-listing configuration"
        ],
        implementationDescription: "EDR deployed on 100% of corporate endpoints and cloud container nodes.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-16",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "CC7",
    title: "CC7 – System Operations",
    type: "clause",
    requirements: [
      {
        id: "CC7.1",
        title: "Vulnerability Management",
        summary: "Detects configuration changes and new vulnerabilities and manages them according to risk.",
        implementationGuidance: "Perform regular (preferably authenticated) vulnerability scanning. Define and enforce patch SLAs by severity. Monitor configuration drift.",
        keyQuestions: [
          "How often is scanning performed and what is the scope?",
          "What are the patch SLAs by severity?",
          "Is configuration drift monitored?"
        ],
        evidenceExamples: [
          "Scan reports",
          "Patch tickets with timelines",
          "Config drift alerts"
        ],
        implementationDescription: "Weekly automated container and host vulnerability scans with SLA-bound patching.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-12",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC7.2",
        title: "Security Monitoring",
        summary: "Monitors system components for anomalies indicative of malicious acts, natural disasters, or errors.",
        implementationGuidance: "Implement centralized logging and alerting on anomalous activity (failed logins, privilege escalation, unusual data access). Define monitoring coverage (24×7 or specified hours) and on-call arrangements.",
        keyQuestions: [
          "What activities generate alerts?",
          "What is the monitoring coverage model?",
          "Who reviews alerts and within what timeframe?"
        ],
        evidenceExamples: [
          "SIEM rules",
          "Alert samples",
          "On-call schedules"
        ],
        implementationDescription: "24/7 automated security alerting with PagerDuty escalation rotas.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-07",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC7.3",
        title: "Security Event Evaluation",
        summary: "Evaluates security events to determine whether they constitute incidents that could affect objectives.",
        implementationGuidance: "Define a clear process and severity classification for evaluating alerts and promoting them to incidents.",
        keyQuestions: [
          "What process is used to evaluate alerts?",
          "How is severity classified?",
          "When is an event escalated to incident status?"
        ],
        evidenceExamples: [
          "Alert triage tickets",
          "Incident classification criteria"
        ],
        implementationDescription: "SOAR playbook automatically triages and categorizes security events.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-14",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC7.4",
        title: "Incident Response",
        summary: "Responds to identified security incidents through a defined program covering understanding, containment, remediation, and communication.",
        implementationGuidance: "Maintain a documented Incident Response Plan with roles, communication plans, and containment steps. Conduct tabletop exercises at least annually. Track incidents and perform post-incident reviews.",
        keyQuestions: [
          "Is the IR Plan current and complete?",
          "Are tabletop exercises performed annually?",
          "Were there actual incidents and were they handled according to the plan?"
        ],
        evidenceExamples: [
          "IR Plan",
          "Tabletop exercise reports",
          "Incident tickets and post-mortems"
        ],
        implementationDescription: "IR Plan reviewed annually; annual tabletop simulation executed.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-02",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC7.5",
        title: "Incident Recovery",
        summary: "Identifies, develops, and implements activities to recover from identified security incidents.",
        implementationGuidance: "Integrate recovery procedures with the IR Plan. Conduct lessons-learned reviews and feed findings back into controls.",
        keyQuestions: [
          "Are recovery procedures documented and linked to the IR Plan?",
          "Is there a formal lessons-learned process?",
          "How do findings drive control improvements?"
        ],
        evidenceExamples: [
          "Recovery runbooks",
          "Closed post-incident action items"
        ],
        implementationDescription: "Post-incident review template and corrective action tracking integrated in Governance module.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-19",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "CC8",
    title: "CC8 – Change Management",
    type: "clause",
    requirements: [
      {
        id: "CC8.1",
        title: "Change Management",
        summary: "Authorizes, designs, develops/acquires, configures, documents, tests, approves, and implements changes to infrastructure, data, software, and procedures.",
        implementationGuidance: "Enforce a formal change request and approval process. Maintain separation of duties (developers cannot promote alone). Require peer code review and automated testing in CI/CD. Document an emergency change procedure with retrospective review. Ensure rollback capability.",
        keyQuestions: [
          "What is the standard change process?",
          "Is separation of duties enforced?",
          "Are peer reviews and automated tests required?",
          "How are emergency changes handled and reviewed?",
          "Is rollback capability required?"
        ],
        evidenceExamples: [
          "Change tickets",
          "PR approvals",
          "CI/CD pipeline configurations",
          "Emergency change logs"
        ],
        implementationDescription: "GitHub branch protection rules mandate peer approvals and green CI passes prior to merge.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-04",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "CC9",
    title: "CC9 – Risk Mitigation",
    type: "clause",
    requirements: [
      {
        id: "CC9.1",
        title: "Business Disruption",
        summary: "Identifies, selects, and develops risk-mitigation activities for risks arising from potential business disruptions.",
        implementationGuidance: "Maintain a BC/DR plan with defined RTO/RPO. Implement backup procedures and test restoration.",
        keyQuestions: [
          "Does a BC/DR plan with RTO/RPO exist?",
          "What backup procedures are in place?",
          "Has restoration been tested?"
        ],
        evidenceExamples: [
          "BC/DR plan",
          "Backup logs",
          "Restoration test reports"
        ],
        implementationDescription: "BC/DR plan established with RTO < 4h and RPO < 1h; automated backup validation enabled.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-17",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "CC9.2",
        title: "Vendor Risk Management",
        summary: "Assesses and manages risks associated with vendors and business partners.",
        implementationGuidance: "Maintain a vendor inventory with criticality tiering. Assess critical vendors via questionnaires or SOC 2/ISO report reviews. Include security and incident notification requirements in contracts. Perform periodic re-assessments.",
        keyQuestions: [
          "Is there a tiered vendor inventory?",
          "How are critical vendors assessed?",
          "Do contracts contain security clauses?",
          "How often are vendors re-assessed?"
        ],
        evidenceExamples: [
          "Vendor risk assessments",
          "Signed contracts with security clauses",
          "Review schedule and results"
        ],
        implementationDescription: "Vendor Risk Management module tracks all third-party AI and cloud vendors with annual review schedules.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-06",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "A1",
    title: "Availability (A1)",
    type: "clause",
    requirements: [
      {
        id: "A1.1",
        title: "Capacity",
        summary: "Maintains, monitors, and evaluates processing capacity to manage demand and enable additional capacity.",
        implementationGuidance: "Implement capacity monitoring and alerting (CPU, memory, storage, network). Link capacity planning to growth forecasts. Use auto-scaling where appropriate.",
        keyQuestions: [
          "What capacity metrics and thresholds are monitored?",
          "Is capacity planning linked to growth forecasts?",
          "Is auto-scaling used?"
        ],
        evidenceExamples: [
          "Monitoring dashboards",
          "Capacity planning documents",
          "Scaling event logs"
        ],
        implementationDescription: "Cloud auto-scaling configured with 70% CPU/memory utilization alert thresholds.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-21",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "A1.2",
        title: "Environmental & Recovery",
        summary: "Implements environmental protections, software, data backup processes, and recovery infrastructure.",
        implementationGuidance: "Design redundant architecture (multi-AZ/multi-region). Automate backups with defined retention. Apply environmental monitoring for on-premises facilities.",
        keyQuestions: [
          "Is the architecture redundant?",
          "Are backups automated and retention defined?",
          "What environmental monitoring exists for on-prem?"
        ],
        evidenceExamples: [
          "Architecture diagrams",
          "Backup job success rates",
          "Retention settings"
        ],
        implementationDescription: "Multi-AZ deployment with automated point-in-time database snapshots.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-13",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "A1.3",
        title: "Recovery Testing",
        summary: "Tests recovery plan procedures supporting system recovery.",
        implementationGuidance: "Perform DR/failover testing at least annually. Document results, issues, and remediation.",
        keyQuestions: [
          "How often is DR/failover testing performed?",
          "Are results and remediation documented?"
        ],
        evidenceExamples: [
          "DR test reports",
          "Issues log and closure evidence"
        ],
        implementationDescription: "Bi-annual failover and database restoration drill executed successfully.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-25",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "PI1",
    title: "Processing Integrity (PI1)",
    type: "clause",
    requirements: [
      {
        id: "PI1.1",
        title: "Information Quality",
        summary: "Obtains or generates quality information regarding processing objectives, data definitions, and specifications.",
        implementationGuidance: "Document clear data definitions, input specifications, and processing objectives. Keep them accessible and current.",
        keyQuestions: [
          "Are data definitions and processing objectives documented and current?",
          "Who uses them?"
        ],
        evidenceExamples: [
          "Data dictionary",
          "Processing specifications"
        ],
        implementationDescription: "Centralized data dictionary and schema documentation published for all AI pipelines.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-16",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "PI1.2",
        title: "System Inputs",
        summary: "Implements policies and procedures over system inputs for completeness, accuracy, and authorization.",
        implementationGuidance: "Apply input validation (format, range, completeness, authorization). Define rejection and error-handling processes.",
        keyQuestions: [
          "What validation is performed on inputs?",
          "How are invalid inputs rejected and handled?"
        ],
        evidenceExamples: [
          "Validation rules",
          "Error logs",
          "Sample rejected transactions"
        ],
        implementationDescription: "API gateway schema validation and input sanitization enforced.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-23",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "PI1.3",
        title: "Processing",
        summary: "Implements controls so processing produces complete, accurate, timely, and authorized results.",
        implementationGuidance: "Use automated processing controls, reconciliations, batch controls, or checksums. Perform authorization checks during processing.",
        keyQuestions: [
          "What automated controls or reconciliations exist during processing?",
          "Are authorization checks performed?"
        ],
        evidenceExamples: [
          "Processing logs",
          "Reconciliation reports"
        ],
        implementationDescription: "Automated batch processing reconciliations and checksum verifications active.",
        status: "In progress",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-09-12",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "PI1.4",
        title: "Outputs",
        summary: "Ensures outputs are complete, accurate, timely, and delivered to intended recipients.",
        implementationGuidance: "Validate outputs, confirm delivery, and apply access controls on reports/results.",
        keyQuestions: [
          "How is output validated?",
          "How is delivery confirmed?",
          "What access controls exist on outputs?"
        ],
        evidenceExamples: [
          "Output samples",
          "Delivery logs"
        ],
        implementationDescription: "Output delivery verification logs and role-based output access rules configured.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-27",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "PI1.5",
        title: "Stored Data",
        summary: "Maintains completeness, accuracy, and availability of stored inputs, in-process items, and outputs.",
        implementationGuidance: "Perform integrity checks on stored data. Verify backup integrity. Enforce retention aligned to requirements.",
        keyQuestions: [
          "What integrity checks are performed?",
          "Is backup integrity verified?",
          "How is retention enforced?"
        ],
        evidenceExamples: [
          "Integrity check results",
          "Retention policy enforcement evidence"
        ],
        implementationDescription: "Automated database integrity checks and retention policy scripts active.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-29",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "C1",
    title: "Confidentiality (C1)",
    type: "clause",
    requirements: [
      {
        id: "C1.1",
        title: "Identify & Maintain",
        summary: "Identifies and maintains confidential information to meet confidentiality objectives.",
        implementationGuidance: "Implement a data classification scheme that includes 'Confidential'. Label/tag confidential data. Apply specific access restrictions and encryption. Use NDAs or contractual confidentiality clauses.",
        keyQuestions: [
          "Does a classification scheme including Confidential exist?",
          "How is confidential data identified and protected?",
          "Are contractual clauses used?"
        ],
        evidenceExamples: [
          "Classification policy",
          "Sample labeled data",
          "Access control lists",
          "Contracts/NDAs"
        ],
        implementationDescription: "Data classification policy published; confidential tagging enforced across data stores.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-11",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "C1.2",
        title: "Disposal",
        summary: "Disposes of confidential information to meet confidentiality objectives.",
        implementationGuidance: "Define secure disposal procedures (crypto-shredding, certified destruction). Use a retention schedule that triggers disposal.",
        keyQuestions: [
          "What secure disposal methods are used?",
          "Does a retention schedule trigger disposal?"
        ],
        evidenceExamples: [
          "Disposal certificates",
          "Retention and disposal logs"
        ],
        implementationDescription: "Automated lifecycle retention policies crypto-shred confidential objects upon expiration.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-24",
        auditorFeedback: "",
        notes: ""
      }
    ]
  },
  {
    id: "P1",
    title: "Privacy (P Series)",
    type: "clause",
    requirements: [
      {
        id: "P1.1",
        title: "Notice",
        summary: "Provides clear notice of privacy practices to data subjects.",
        implementationGuidance: "Publish an accurate privacy notice. Maintain a process to update it and notify data subjects of material changes.",
        keyQuestions: [
          "Is the privacy notice accurate and current?",
          "How are material changes communicated?"
        ],
        evidenceExamples: [
          "Published privacy notice",
          "Change logs",
          "Notification records"
        ],
        implementationDescription: "Public Privacy Notice published and annually re-assessed.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-02",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "P2.1",
        title: "Choice / Consent",
        summary: "Offers and honors choices regarding personal information.",
        implementationGuidance: "Implement mechanisms to obtain and record consent or opt-out. Enforce user preferences.",
        keyQuestions: [
          "What consent/opt-out mechanisms exist?",
          "How are preferences enforced?"
        ],
        evidenceExamples: [
          "Consent records",
          "Preference management logs"
        ],
        implementationDescription: "Consent preference center integrated with customer accounts.",
        status: "In progress",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-09-08",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "P3.1",
        title: "Collection",
        summary: "Limits collection to identified purposes.",
        implementationGuidance: "Document and enforce purpose limitation.",
        keyQuestions: [
          "How is collection limited to stated purposes?"
        ],
        evidenceExamples: [
          "Purpose limitation documentation",
          "Collection procedures"
        ],
        implementationDescription: "Data minimization rules applied during user onboarding data collection.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-19",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "P4.1",
        title: "Use, Retention, Disposal",
        summary: "Restricts use, retains only as needed, and securely disposes of personal data.",
        implementationGuidance: "Maintain a retention schedule. Perform secure deletion when data is no longer needed. Enforce purpose limitation.",
        keyQuestions: [
          "Is there a retention schedule?",
          "How is secure deletion performed?"
        ],
        evidenceExamples: [
          "Retention schedule",
          "Deletion logs"
        ],
        implementationDescription: "Privacy retention schedule enforced across user analytics and logs.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-22",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "P5.1",
        title: "Access (DSAR)",
        summary: "Provides individuals the ability to access, correct, or delete their personal data.",
        implementationGuidance: "Implement a DSAR process with defined SLAs. Track and fulfill requests.",
        keyQuestions: [
          "What is the DSAR process and SLA?",
          "Can sample fulfilled requests be shown?"
        ],
        evidenceExamples: [
          "DSAR procedure",
          "Request logs",
          "Fulfillment evidence"
        ],
        implementationDescription: "Automated DSAR intake portal and fulfillment workflows operational.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-15",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "P6.1",
        title: "Disclosure to Third Parties",
        summary: "Controls disclosure of personal data to third parties.",
        implementationGuidance: "Maintain an inventory of third parties. Include contractual requirements. Perform transfer impact assessments where required.",
        keyQuestions: [
          "Is there a third-party inventory?",
          "What contractual and assessment controls exist?"
        ],
        evidenceExamples: [
          "Third-party inventory",
          "Contracts",
          "Transfer impact assessments"
        ],
        implementationDescription: "Data Processing Agreements (DPAs) signed with all third-party subprocessors.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-05",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "P7.1",
        title: "Security for Privacy",
        summary: "Applies technical and organizational measures to protect personal data.",
        implementationGuidance: "Align with CC6/CC7 controls and add privacy-specific measures as needed.",
        keyQuestions: [
          "What measures specifically protect personal data?"
        ],
        evidenceExamples: [
          "Overlapping CC6/CC7 evidence plus privacy-specific configurations"
        ],
        implementationDescription: "Privacy-by-design baseline technical controls aligned with CC6 & CC7.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-12",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "P8.1",
        title: "Quality",
        summary: "Maintains accuracy of personal data.",
        implementationGuidance: "Define procedures to keep personal data accurate and up to date.",
        keyQuestions: [
          "What procedures maintain data accuracy?"
        ],
        evidenceExamples: [
          "Data quality procedures",
          "Correction logs"
        ],
        implementationDescription: "Self-service profile correction tools provided to users.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-26",
        auditorFeedback: "",
        notes: ""
      },
      {
        id: "P9.1",
        title: "Monitoring & Enforcement",
        summary: "Monitors compliance and handles privacy-related inquiries and complaints.",
        implementationGuidance: "Perform privacy impact assessments. Maintain a complaint-handling process. Conduct periodic privacy compliance reviews.",
        keyQuestions: [
          "Are PIAs performed?",
          "How are complaints handled?",
          "Are periodic reviews conducted?"
        ],
        evidenceExamples: [
          "PIA reports",
          "Complaint logs",
          "Compliance review reports"
        ],
        implementationDescription: "Privacy Impact Assessment (PIA) required for all new product feature launches.",
        status: "Implemented",
        owner: "Demo Assessor",
        reviewer: "Leo Vance",
        approver: "Mark Taylor",
        dueDate: "2026-08-28",
        auditorFeedback: "",
        notes: ""
      }
    ]
  }
];

export const INITIAL_BUSINESS_UNITS = [
  {
    id: "bu-healthcare",
    name: "Healthcare & Clinical AI",
    code: "BU-HLTH",
    description: "Clinical decision support, patient diagnostic imaging, and HIPAA-governed predictive models.",
    dpoName: "Dr. Rachel Sterling",
    dpoEmail: "rachel.sterling@onyx-health.ai",
    aiCustodian: "Dr. Sanjay Gupta (Clinical ML Lead)",
    riskAppetite: "Zero Tolerance" as const,
    maxAllowedInherentRisk: "Low" as const,
    complianceHealthScore: 98,
    projectCount: 4,
    modelCount: 6,
    incidentCount: 0,
    industryDomain: "Healthcare & Life Sciences" as const,
  },
  {
    id: "bu-fraud",
    name: "Financial Fraud & AML Analytics",
    code: "BU-FIN",
    description: "Real-time payment fraud anomaly detection, high-frequency transaction scoring, and anti-money laundering pipelines.",
    dpoName: "Vikram Sethi (Chief Risk Officer)",
    dpoEmail: "vikram.sethi@onyx-finance.ai",
    aiCustodian: "Alex Chen (Staff MLOps Architect)",
    riskAppetite: "Conservative" as const,
    maxAllowedInherentRisk: "Medium" as const,
    complianceHealthScore: 94,
    projectCount: 5,
    modelCount: 8,
    incidentCount: 1,
    industryDomain: "Financial Services & Fraud" as const,
  },
  {
    id: "bu-genai",
    name: "Enterprise Customer GenAI",
    code: "BU-GENAI",
    description: "Customer service copilot, automated contract clause generation, and LLM-assisted knowledge synthesis.",
    dpoName: "Yan Aung (Compliance Officer)",
    dpoEmail: "yan.aung@gmail.com",
    aiCustodian: "Maya Lin (GenAI Platform Lead)",
    riskAppetite: "Balanced" as const,
    maxAllowedInherentRisk: "Medium" as const,
    complianceHealthScore: 91,
    projectCount: 7,
    modelCount: 12,
    incidentCount: 2,
    industryDomain: "Enterprise SaaS & GenAI" as const,
  },
  {
    id: "bu-autonomous",
    name: "Autonomous Robotics & Edge Vision",
    code: "BU-AUTO",
    description: "Factory floor safety computer vision, autonomous drone inspection, and edge embedded neural networks.",
    dpoName: "Elena Rostova (CISO)",
    dpoEmail: "ciso@onyx-ai.security",
    aiCustodian: "Dr. Klaus Richter (Robotics Lead)",
    riskAppetite: "Innovative / Sandbox" as const,
    maxAllowedInherentRisk: "High" as const,
    complianceHealthScore: 89,
    projectCount: 3,
    modelCount: 5,
    incidentCount: 1,
    industryDomain: "Autonomous Systems & Robotics" as const,
  },
];

export const INITIAL_AUTOMATED_CONNECTORS = [
  {
    id: "conn-aws",
    name: "AWS CloudTrail & GuardDuty",
    provider: "AWS CloudTrail & GuardDuty" as const,
    category: "Cloud Infrastructure" as const,
    status: "Connected & Ingesting" as const,
    lastSyncAt: "10 mins ago",
    syncFrequency: "Continuous (Real-time Webhook)" as const,
    autoIngestedCount: 42,
    mappedIsoControls: ["A.12.1.2 (Security Logging)", "A.9.2.3 (Privileged Access)", "A.13.1.1 (Network Controls)"],
    iconType: "aws" as const,
    authConfig: {
      endpoint: "https://cloudtrail.us-east-1.amazonaws.com/audit-stream",
      authType: "IAM Role ARN" as const,
      maskedSecret: "arn:aws:iam::477020889997:role/OnyxGRCAuditIngress",
    },
  },
  {
    id: "conn-gcp",
    name: "Google Cloud SCC & Vertex AI",
    provider: "Google Cloud SCC & Vertex AI" as const,
    category: "Model Registry" as const,
    status: "Connected & Ingesting" as const,
    lastSyncAt: "3 mins ago",
    syncFrequency: "Continuous (Real-time Webhook)" as const,
    autoIngestedCount: 68,
    mappedIsoControls: ["ISO 42001 Cl.6.2 (Model Objectives)", "A.8.1.1 (Asset Inventory)", "ISO 42001 Cl.8.4 (AI Bias)"],
    iconType: "gcp" as const,
    authConfig: {
      endpoint: "https://securitycenter.googleapis.com/v1/organizations/onyx/findings",
      authType: "OAuth 2.0 Token" as const,
      maskedSecret: "ya29.a0AfH6SMD...[Service Account JWT]",
    },
  },
  {
    id: "conn-github",
    name: "GitHub Enterprise & Security",
    provider: "GitHub Enterprise & Security" as const,
    category: "CI/CD & Source Code" as const,
    status: "Connected & Ingesting" as const,
    lastSyncAt: "15 mins ago",
    syncFrequency: "Continuous (Real-time Webhook)" as const,
    autoIngestedCount: 114,
    mappedIsoControls: ["A.14.2.8 (System Security Testing)", "ISO 42001 Cl.8.3 (Data Lineage)", "A.14.2.2 (Change Control)"],
    iconType: "github" as const,
    authConfig: {
      endpoint: "https://api.github.com/orgs/onyx-ai/events",
      authType: "API Key / Webhook Secret" as const,
      maskedSecret: "ghp_secure_webhook_key_********************",
    },
  },
  {
    id: "conn-datadog",
    name: "Datadog Cloud SIEM & AI Watcher",
    provider: "Datadog Cloud SIEM" as const,
    category: "Runtime Monitoring" as const,
    status: "Connected & Ingesting" as const,
    lastSyncAt: "1 min ago",
    syncFrequency: "Continuous (Real-time Webhook)" as const,
    autoIngestedCount: 89,
    mappedIsoControls: ["ISO 42001 Cl.9.1 (AI Monitoring)", "A.12.4.1 (Event Logging)", "ISO 42001 Cl.8.4 (Safety Drift)"],
    iconType: "datadog" as const,
    authConfig: {
      endpoint: "https://http-intake.logs.datadoghq.com/api/v2/logs",
      authType: "API Key / Webhook Secret" as const,
      maskedSecret: "dd_api_key_********************************",
    },
  },
  {
    id: "conn-jira",
    name: "Jira Compliance & ServiceNow GRC",
    provider: "Jira Compliance & ServiceNow" as const,
    category: "ITSM & Change Control" as const,
    status: "Connected & Ingesting" as const,
    lastSyncAt: "25 mins ago",
    syncFrequency: "Every 1 hour" as const,
    autoIngestedCount: 35,
    mappedIsoControls: ["A.12.1.2 (Change Management)", "ISO 42001 Cl.10.2 (Corrective Action)", "A.16.1.1 (Incident Response)"],
    iconType: "jira" as const,
    authConfig: {
      endpoint: "https://onyx-enterprise.atlassian.net/rest/api/3/issue",
      authType: "API Key / Webhook Secret" as const,
      maskedSecret: "jira_oauth_token_**************************",
    },
  },
];

