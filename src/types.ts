export type RiskLevel = "MINIMAL" | "LIMITED" | "HIGH RISK" | "UNACCEPTABLE" | "LOW" | "MEDIUM" | "HIGH" | "VERY HIGH" | "NO RISK" | "MAJOR";

export interface Workspace {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface ProjectSystemReport {
  nameOfInitiative?: string;
  businessOwnerName?: string;
  stakeholdersNames?: string;
  systemOverviewDiagram?: string;
  referenceDocuments?: string;
}

export interface ProjectOverview {
  descriptionOfInitiative?: string;
  natureOfInformationHandled?: string;
  informationClassification?: string;
  impactConfidentialityBreached?: string;
  impactConfidentialityBreachedDescription?: string;
  impactIntegrityBreached?: string;
  impactIntegrityBreachedDescription?: string;
  impactAvailabilityBreached?: string;
  impactAvailabilityBreachedDescription?: string;
}

export interface ProjectDescriptionOfSystems {
  scope?: string;
  previouslyCertifiedAndUnchangedComponents?: string;
  outOfScope?: string;
  decommissioning?: string;
  integratedSubsystemOrServices?: string;
  actorsExternalUsers?: string;
  actorsEndUserDevices?: string;
  actorsInternalUsers?: string;
}

export interface ProjectSummaryOfBusinessProcess {
  summaryOfBusinessProcess?: string;
  geographicLocationOfData?: string;
  natureOfCloudServiceModel?: string;
  independentCertifications?: string;
  cloudPlatformServices?: string;
  publiclyAccessible?: string;
}

export interface ProjectAssessmentScope {
  securityScope?: string;
  securityScopeDescription?: string;
  privacyScope?: string;
  privacyScopeDescription?: string;
  humanRightsAndEthicsScope?: string;
  humanRightsAndEthicsScopeDescription?: string;
  informationManagementScope?: string;
  informationManagementScopeDescription?: string;
}

export interface ProjectSummaryOfFindings {
  findingsSecurity?: string;
  findingsPrivacy?: string;
  findingsHumanRights?: string;
  findingsEthics?: string;
  findingsInformationManagement?: string;
}

export interface RiskAssessmentEntry {
  id: string; // e.g. "SR02"
  title: string;
  description?: string;
  impacts?: string;
  exampleScenarios?: string;
  affects?: ("Confidentiality" | "Integrity" | "Availability")[];
  inherentRisk?: "Critical" | "High" | "Medium" | "Low";
  impactMagnitude?: "Minor" | "Moderate" | "Major" | "Severe" | "Critical";
  existingSecurityControls?: string[];
  currentResidualRisk?: "Critical" | "High" | "Medium" | "Low";
  targetResidualRisk?: "Critical" | "High" | "Medium" | "Low";
  remediationPlans?: string;
  noRemediationPlans?: string;
  rationale?: string;
  owner?: string;
}

export interface ProjectCommentaryOnRiskProfile {
  commentaryOnRiskProfile?: string;
  riskAcceptance?: string;
  riskEntries?: RiskAssessmentEntry[];
}

export interface PrePostRemediationItem {
  id: string;
  controlNo: string;
  controlName: string;
  remediationDescription: string;
  risks: "High" | "Medium" | "Low";
  manager: string;
  targetDate: string;
}

export interface AcceptedRiskItem {
  id: string;
  controlNo: string;
  controlName: string;
  justification: string;
  residualRisk: "High" | "Medium" | "Low";
  approver: string;
  reviewDate: string;
}

export interface ProjectRemediationPlan {
  preGoLive?: PrePostRemediationItem[];
  postGoLive?: PrePostRemediationItem[];
  acceptedRisks?: AcceptedRiskItem[];
}

export type CertificationLevel = "Certified" | "Qualified Certification" | "Not Certified" | "Pending Assessment";
export type AccreditationLevel = "Accreditation" | "Qualified Accreditation" | "Not Accredited" | "Pending Assessment";

export interface SignatoryDetails {
  name: string;
  title: string;
  date: string;
  signature: string; // base64 image data or typed digital signature
  confirmed: boolean;
}

export interface CertificationSignOff {
  level: CertificationLevel;
  comments: string;
  declarationConfirmed: boolean;
  signatory: SignatoryDetails;
}

export interface AccreditationSignOff {
  level: AccreditationLevel;
  comments: string;
  declarationConfirmed: boolean;
  signatory: SignatoryDetails;
}

export interface ProjectCASignOff {
  certification?: CertificationSignOff;
  accreditation?: AccreditationSignOff;
}

export interface ControlEvidenceArtifact {
  id: string;
  type: "link" | "file";
  title: string;
  url?: string;
}

export interface ControlMatrixItem {
  id: string; // e.g. "C01.SEC" or "C02"
  controlNumber: string; // e.g. "C02"
  title: string; // e.g. "Information Security Governance"
  description: string;
  objective?: string;
  tsc: string; // Trust Service Criteria, e.g. "CC1.1", "CC1.2", "CC6.2", "CC7.1"
  owner: string; // e.g. "Security Team", "IT Governance Lead"
  effectiveness: "NOT ASSESSED" | "EFFECTIVE" | "INEFFECTIVE" | "PARTIALLY EFFECTIVE";
  implementationDetails?: string;
  evidenceArtifacts?: ControlEvidenceArtifact[];
  remediationActivity?: string;
  responsibleManager?: string;
  agreedImplementationDate?: string;
  mappedRisks?: string[]; // e.g. ["SR02", "SR03", "SR04", "SR05", "SR08"]
}

export interface AIProject {
  id: string;
  workspaceId?: string;
  title: string;
  owner: string;
  status: "Not started" | "In progress" | "Completed" | "Active";
  geography: string;
  riskClassification: "Minimal" | "Limited" | "High Risk" | "Unacceptable";
  roleType: string;
  startDate: string;
  lastUpdated: string;
  framework: string;
  teamMembers: string[];
  goal: string;
  targetIndustry: string;
  description: string;
  mappedModels?: string[];
  completedComplianceTasks?: string[];

  // Restructured multi-section metadata fields
  systemReport?: ProjectSystemReport;
  overview?: ProjectOverview;
  descriptionOfSystems?: ProjectDescriptionOfSystems;
  summaryOfBusinessProcess?: ProjectSummaryOfBusinessProcess;
  assessmentScope?: ProjectAssessmentScope;
  summaryOfFindings?: ProjectSummaryOfFindings;
  commentaryOnRiskProfile?: ProjectCommentaryOnRiskProfile;
  remediationPlan?: ProjectRemediationPlan;
  caSignOff?: ProjectCASignOff;
  controlQuestionnaires?: Record<string, { selectedAnswerIndex?: number; customAnswerText?: string; isCustom?: boolean; uploadedEvidenceIds?: string[] }>;
  complianceChecklist?: any;
  controlMatrix?: ControlMatrixItem[];
}

export interface ModelRecord {
  id: string;
  workspaceId?: string;
  provider: string;
  name: string;
  version: string;
  status: "Pending" | "Approved" | "Restricted" | "Blocked";
  approver: string;
  statusDate: string;
  useCasesCount: number;
  // Security Architect & Continuous GRC Assessment fields
  securityScore?: number; // 0 - 100
  zeroDataRetention?: boolean;
  trainingOptOut?: boolean;
  soc2Certified?: boolean;
  iso27001Certified?: boolean;
  hipaaCompliant?: boolean;
  euAiActTier?: "Minimal Risk" | "Transparency / Specific Risk" | "High-Risk" | "Prohibited" | "GPAI with Systemic Risk";
  dataResidency?: string;
  assessmentDate?: string;
  recommendedStatus?: "Approved" | "Restricted" | "Pending" | "Blocked";
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  notes?: string;
  sourceUrl?: string;
  externalReviewDate?: string;
  lastScannedAt?: string;
  scannerFeed?: string;
  vulnerabilitiesCount?: number;
  guardrailsVerified?: boolean;
}

export interface RiskRecord {
  id: string;
  workspaceId?: string;
  name: string;
  owner: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "VERY HIGH" | "MAJOR";
  mitigationStatus: "NOT STARTED" | "IN PROGRESS" | "COMPLETED";
  riskLevel: "NO RISK" | "LOW RISK" | "MEDIUM RISK" | "HIGH RISK" | "CRITICAL RISK";
  targetDate: string;
  description: string;
  applicableProjects: string[];
  applicableFrameworks: string[];
  lifecyclePhase: string;
  categories: string[];
  potentialImpact: string;
  likelihood: string;
  severityCalc: string;
  notes: string;
  mitigationPlan?: string;
  implementationStrategy?: string;
  residualLikelihood?: string;
  residualSeverity?: string;
  residualRiskLevel?: string;
  approver?: string;
  approvalStatus?: string;
  assessmentDate?: string;
  recommendations?: string;
}

export interface EvidenceFile {
  id: string;
  workspaceId?: string;
  name: string;
  uploadDate: string;
  uploader: string;
  source: string;
  version: string;
  status: "Draft" | "Approved" | "Under Review";
  folderId: string;
  size?: string;
  notes?: string;
}

export interface Folder {
  id: string;
  workspaceId?: string;
  name: string;
}

export interface ComplianceReport {
  id: string;
  workspaceId?: string;
  title: string;
  program: string;
  type: string;
  format: "PDF" | "DOCX";
  created: string;
}

export interface Vendor {
  id: string;
  workspaceId?: string;
  name: string;
  website: string;
  projects: string;
  reviewStatus: "Approved" | "Pending" | "Under Review" | "Rejected";
  score: string;
  assignee: string;
  reviewDate: string;
}

export interface TrainingRecord {
  id: string;
  workspaceId?: string;
  name: string;
  duration: string;
  provider: string;
  department: string;
  status: "Planned" | "In progress" | "Completed";
  peopleCount: number;
  description?: string;
}

export interface PolicyTemplate {
  id: string;
  title: string;
  tags: string[];
  description: string;
  purpose: string;
  scope: string;
  keyTerms: string;
  policyRequirements: string;
}

export interface OrganizationalPolicy {
  id: string;
  workspaceId?: string;
  title: string;
  status: "Published" | "Under review" | "Draft" | "Archived" | "Deprecated";
  tags: string[];
  teamSize: number;
  nextReview: string;
  lastUpdated: string;
  content?: string;
  owner?: string;
  category?: string;
}

export interface IncidentRecord {
  id: string;
  workspaceId?: string;
  project: string;
  type: string;
  severity: "MINOR" | "MODERATE" | "SERIOUS" | "CRITICAL";
  status: "Open" | "Investigating" | "Mitigated" | "Closed";
  occurred: string;
  approvedBy: string;
  description?: string;
  rootCause?: string;
  impact?: string;
}

export interface TeamMember {
  id: string;
  workspaceId?: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Reviewer" | "Auditor";
  joinedDate: string;
  isYou?: boolean;
}

export interface ControlRequirement {
  id: string; // e.g. "4.1"
  title: string;
  summary: string;
  implementationGuidance?: string;
  keyQuestions: string[];
  evidenceExamples: string[];
  implementationDescription: string;
  status: "Implemented" | "In progress" | "Not started";
  owner: string;
  reviewer: string;
  approver: string;
  dueDate: string;
  auditorFeedback: string;
  notes: string;
}

export interface FrameworkClause {
  id: string; // e.g. "4"
  title: string;
  type: "clause" | "annex";
  requirements: ControlRequirement[];
}

export interface Framework {
  id: "iso-27001" | "iso-42001" | "nist-ai-rmf";
  name: string;
  progress: number; // calculated dynamically
  clauses: FrameworkClause[];
  annexes?: FrameworkClause[];
  // For NIST
  functions?: {
    id: "govern" | "map" | "measure" | "manage";
    name: string;
    progress: number;
    categories: FrameworkClause[];
  }[];
}

export type AuditLogSeverity = "INFO" | "WARN" | "ERROR" | "CRITICAL";

export type AuditLogCategory = 
  | "SECURITY" 
  | "GOVERNANCE" 
  | "ACCESS_CONTROL" 
  | "RISK_MGMT" 
  | "DATA_PRIVACY" 
  | "SYSTEM" 
  | "API_INTEGRATION";

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO 8601 UTC
  isoControl: string; // e.g., "A.12.4.1", "A.9.4.2", "A.8.1.1", "8.15"
  action: string; // e.g. "POLICY_COPILOT_GENERATED", "RISK_ENTRY_CREATED", "SOC2_ANSWER_UPDATED"
  category: AuditLogCategory;
  severity: AuditLogSeverity;
  actor: {
    userId: string;
    email: string;
    role: string;
    ipAddress: string;
    userAgent: string;
  };
  targetResource: {
    type: string;
    id: string;
    name: string;
  };
  details: Record<string, any>;
  status: "SUCCESS" | "FAILURE";
  hash: string; // SHA-256 tamper-evident checksum
  previousHash: string; // Hash chain link
  siemForwarded: boolean;
  siemForwardedAt?: string;
}

export type SiemFormat = "JSON_STANDARD" | "SYSLOG_CEF" | "SPLUNK_HEC" | "DATADOG_LOGS";

export interface SiemWebhookConfig {
  id: string;
  name: string;
  url: string;
  format: SiemFormat;
  authHeader?: string;
  severityFilter: AuditLogSeverity[];
  isoControlFilter: string[];
  enabled: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  lastStatus?: "SUCCESS" | "FAILED" | "NEVER_RUN";
  lastResponseCode?: number;
  totalDispatchedCount: number;
}

export interface AIAssessmentChecklistItem {
  id: string;
  title: string;
  framework: string;
  clause: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Missing" | "Partial" | "Satisfied";
  description: string;
}

export interface AIAssessmentResult {
  projectId: string;
  projectTitle: string;
  evaluatedAt: string;
  executiveScore: number; // 0 - 100
  overallRiskTier: "Minimal" | "Limited" | "High Risk" | "Unacceptable";
  euAiActArticle: string;
  iso42001ReadinessPercent: number;
  nistAiRmfReadinessPercent: number;
  soc2AiReadinessPercent: number;
  summaryFindings: string;
  mandatoryEvidenceChecklist: AIAssessmentChecklistItem[];
  technicalSafeguards: {
    title: string;
    category: "Guardrails" | "Bias & Fairness" | "Privacy & DPIA" | "Human-in-the-Loop" | "Monitoring & Drift";
    recommendation: string;
  }[];
  regulatoryExposure: {
    regulation: string;
    level: "Low" | "Moderate" | "Severe" | "Critical";
    detail: string;
  }[];
}

export interface EvidenceAnalysisResult {
  fileId: string;
  fileName: string;
  analyzedAt: string;
  validityScore: number; // 0 - 100
  auditStatus: "Compliant" | "Needs Remediation" | "Insufficient Evidence";
  mappedClause: string;
  keyStrengths: string[];
  deficiencies: string[];
  recommendedAddenda: string;
}

export interface AuditorReviewNote {
  id: string;
  workspaceId: string;
  auditorName: string;
  auditorFirm: string;
  timestamp: string;
  category: "ISO 42001" | "ISO 27001" | "NIST AI RMF" | "SOC 2" | "EU AI Act";
  status: "APPROVED" | "CONDITIONAL_ACCEPTANCE" | "REQUIRES_REMEDIATION" | "DEFICIENT";
  findingSummary: string;
  clauseReference: string;
  remediationDueDate?: string;
  signatureChecksum: string;
}

export interface ExternalAuditorRoom {
  id: string;
  workspaceId: string;
  token: string;
  auditorFirm: string;
  auditorContactEmail: string;
  assignedStandard: "ISO 42001" | "ISO 27001" | "NIST AI RMF" | "SOC 2 Type II" | "Full AI Governance Suite";
  expiresAt: string;
  isActive: boolean;
  notesCount: number;
  createdAt: string;
}

export interface ModelIntegrationTelemetry {
  id: string;
  modelId: string;
  modelName: string;
  provider: string;
  timestamp: string;
  promptSafetyScore: number; // 0 - 100
  driftStatus: "Optimal" | "Moderate Drift" | "Severe Drift";
  p95LatencyMs: number;
  tokenUsage24h: number;
  complianceState: "PASS" | "WARN" | "FAIL";
  lastLoggedAction: string;
}

export interface CICDPipelineGateEvent {
  id: string;
  workspaceId: string;
  repository: string;
  branch: string;
  commitHash: string;
  triggeredBy: string;
  timestamp: string;
  scanResult: "GATE_PASSED" | "BLOCKED_HIGH_RISK" | "NEEDS_APPROVAL";
  blockedReasons?: string[];
  verifiedEvidenceCount: number;
}

export interface BusinessUnit {
  id: string;
  name: string;
  code: string;
  description: string;
  dpoName: string;
  dpoEmail: string;
  aiCustodian: string;
  riskAppetite: "Zero Tolerance" | "Conservative" | "Balanced" | "Innovative / Sandbox";
  maxAllowedInherentRisk: "Low" | "Medium" | "High";
  complianceHealthScore: number; // 0 - 100
  projectCount: number;
  modelCount: number;
  incidentCount: number;
  industryDomain: "Healthcare & Life Sciences" | "Financial Services & Fraud" | "Enterprise SaaS & GenAI" | "Autonomous Systems & Robotics" | "Retail & Customer Intelligence";
}

export interface AutomatedEvidenceConnector {
  id: string;
  name: string;
  provider: "AWS CloudTrail & GuardDuty" | "Google Cloud SCC & Vertex AI" | "GitHub Enterprise & Security" | "Datadog Cloud SIEM" | "Jira Compliance & ServiceNow";
  category: "Cloud Infrastructure" | "Model Registry" | "CI/CD & Source Code" | "Runtime Monitoring" | "ITSM & Change Control";
  status: "Connected & Ingesting" | "Sync Scheduled" | "Needs Re-Auth" | "Disconnected";
  lastSyncAt: string;
  syncFrequency: "Continuous (Real-time Webhook)" | "Every 1 hour" | "Every 6 hours" | "Daily 00:00 UTC";
  autoIngestedCount: number;
  mappedIsoControls: string[];
  iconType: "aws" | "gcp" | "github" | "datadog" | "jira";
  authConfig: {
    endpoint: string;
    authType: "IAM Role ARN" | "OAuth 2.0 Token" | "API Key / Webhook Secret";
    maskedSecret: string;
  };
}

export interface RegulatoryDossierPackage {
  id: string;
  standard: "EU AI Act Annex IV" | "NIST AI RMF 1.0 Profile" | "ISO/IEC 42001:2023 SoA" | "SOC 2 Type II AI Security";
  title: string;
  targetSystem: string;
  generatedAt: string;
  generatedBy: string;
  assessorRole: string;
  digitalSignatureHash: string;
  overallComplianceScore: number;
  sections: {
    sectionId: string;
    sectionTitle: string;
    status: "Compliant" | "Partially Addressed" | "Not Applicable" | "Action Required";
    clauseReference: string;
    content: string;
    attachedEvidenceIds: string[];
  }[];
}



