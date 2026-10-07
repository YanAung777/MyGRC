import React, { useState } from "react";
import {
  FileCheck2,
  Users2,
  GraduationCap,
  ShieldAlert,
  Search,
  Plus,
  ArrowUpRight,
  Sparkles,
  Info,
  CheckCircle2,
  Layers,
  X,
  ArrowRight,
  BookOpen,
  Edit2,
  Trash2,
  Download,
  Terminal,
  HelpCircle
} from "lucide-react";
import {
  Vendor,
  TrainingRecord,
  OrganizationalPolicy,
  PolicyTemplate,
  IncidentRecord,
  TeamMember,
  AIProject
} from "../types";
import { POLICY_TEMPLATES } from "../data";
import CopilotGapDetectionWidget from "./CopilotGapDetectionWidget";

const getIncidentDetails = (type: string, id: string) => {
  switch (type.toLowerCase()) {
    case "bias":
    case "bias & discrimination":
      return {
        description: "The machine learning assessment model was detected to exhibit demographic parity violations, assigning significantly lower qualification scores to candidate profiles from particular cultural background descriptors and non-traditional career paths.",
        rootCause: "Skewed historical dataset weighting from 2018-2022 hiring patterns, where candidate distributions were highly homogenous. The model learned to correlate specific formatting styles and geographical markers with positive outcomes.",
        impact: "Severe. Evaluated approximately 1,200 candidate resumes during the Q2 hiring push. High risk of non-compliance with the EU AI Act bias prevention clauses and local employment regulations.",
        playbookSteps: [
          { name: "De-escalate & Contain", desc: "Immediately pause the automated resume screening pipeline. Revert candidate processing to manual GRC assessment templates.", status: "Completed" },
          { name: "Analyze Bias Vectors", desc: "Execute demographic parity and equal opportunity difference tests using fairlearn benchmarks.", status: "Completed" },
          { name: "Mitigation Tuning", desc: "Perform adversarial debiasing on model weights or apply a hard boundary post-processing filter to ensure demographic parity.", status: "In Progress" },
          { name: "Audit & Redeploy", desc: "Re-run compliance audits, obtain peer approval, and deploy model v2.1.2 with real-time fairness drift detection logs active.", status: "Planned" }
        ]
      };
    case "unintended output":
      return {
        description: "A production language model generated hallucinated policy references and non-existent ISO certification codes when answering client compliance queries, leading to external confusion and potential legal misrepresentations.",
        rootCause: "High prompt temperature setting (1.2) coupled with weak grounding rules on the custom PDF vector search database. The RAG pipeline failed to retrieve matching documents, allowing the LLM to fill in knowledge gaps creatively.",
        impact: "Moderate. Affected 45 customer sessions. Internal sales teams corrected the clients manually, but automated confidence is degraded.",
        playbookSteps: [
          { name: "Containment Guard", desc: "Hard-limit prompt temperature to 0.2 and deploy regex-based hallucination detection filters on outbound tokens.", status: "Completed" },
          { name: "Grounding Audit", desc: "Inspect vector database embeddings chunking parameters and verify source document completeness.", status: "Completed" },
          { name: "Safety Alignment", desc: "Implement system prompt instructions enforcing a strict 'If not found, reply: I do not know' clause.", status: "Completed" },
          { name: "Testing Loop", desc: "Perform automated adversarial prompt evaluation against 200 standard ISO 42001 and ISO 27001 questions.", status: "In Progress" }
        ]
      };
    case "data leakage":
    case "data leak":
      return {
        description: "A data pipeline synchronization process was found to export raw PII records and internal developer keys into the public evaluation logs of our model registry, exposing sensitive data to unauthorized internal staff.",
        rootCause: "An automated diagnostic logger was configured to dump the entire request context including bearer headers instead of sanitized parameters. Tracing script had debugging mode enabled.",
        impact: "Serious. Leak affected 12 administrative users. No external exposure has been detected, but security boundaries were technically breached.",
        playbookSteps: [
          { name: "Token Revocation", desc: "Immediately rotate all compromised developer API tokens, SSH keys, and system passwords.", status: "Completed" },
          { name: "Logger Sanitization", desc: "Deploy a sanitize-regex middleware filter that redacts email, password, and Authorization header patterns.", status: "Completed" },
          { name: "Database Scrubbing", desc: "Purge affected evaluation log databases and run secure data shredding processes on old files.", status: "Completed" },
          { name: "Compliance Notification", desc: "Log incident details in the internal ISO 27001 evidence register for external auditor inspection.", status: "In Progress" }
        ]
      };
    default:
      return {
        description: "An unexpected anomaly was detected in the active model's telemetry output, which may indicate performance drift, adversarial inputs, or unauthorized configuration changes.",
        rootCause: "A mismatch between evaluation benchmarks and real-world runtime traffic characteristics, causing unexpected edge cases.",
        impact: "Moderate. Telemetry flags raised alerts across internal GRC dashboards. No user-facing failures reported.",
        playbookSteps: [
          { name: "Alert Isolation", desc: "Isolate affected container nodes and spin up replica fallback instances with strict threshold monitoring.", status: "Completed" },
          { name: "Log Forensic Analysis", desc: "Download and analyze the last 24 hours of payload receipts to identify potential prompt-injection attacks.", status: "Completed" },
          { name: "Threshold Tuning", desc: "Re-calibrate anomaly detection thresholds to reduce false positives under heavy traffic.", status: "In Progress" },
          { name: "Governance Sign-off", desc: "Obtain formal GRC review and document resolution in compliance registers.", status: "Planned" }
        ]
      };
  }
};

interface GovernanceViewProps {
  activePage?: string;
  vendors: Vendor[];
  onAddVendor: (v: Vendor) => void;
  onUpdateVendor?: (v: Vendor) => void;
  onDeleteVendor?: (id: string) => void;
  trainings: TrainingRecord[];
  onAddTraining: (t: TrainingRecord) => void;
  onUpdateTraining?: (t: TrainingRecord) => void;
  onDeleteTraining?: (id: string) => void;
  policies: OrganizationalPolicy[];
  onAddPolicy: (p: OrganizationalPolicy) => void;
  onUpdatePolicy?: (p: OrganizationalPolicy) => void;
  onDeletePolicy: (id: string) => void;
  incidents: IncidentRecord[];
  onAddIncident: (inc: IncidentRecord) => void;
  onUpdateIncident?: (inc: IncidentRecord) => void;
  onDeleteIncident?: (id: string) => void;
  onToggleIncidentStatus: (id: string) => void;
  onUpdateIncidentStatus?: (id: string, status: "Open" | "Investigating" | "Mitigated" | "Closed") => void;
  team: TeamMember[];
  projects: AIProject[];
}

export default function GovernanceView({
  activePage,
  vendors,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
  trainings,
  onAddTraining,
  onUpdateTraining,
  onDeleteTraining,
  policies,
  onAddPolicy,
  onUpdatePolicy,
  onDeletePolicy,
  incidents,
  onAddIncident,
  onUpdateIncident,
  onDeleteIncident,
  onToggleIncidentStatus,
  onUpdateIncidentStatus,
  team,
  projects
} : GovernanceViewProps) {
  // Sub-tabs: "vendor" | "training" | "policy" | "incident"
  const [activeTab, setActiveTab] = useState<"vendor" | "training" | "policy" | "incident">("policy");

  React.useEffect(() => {
    if (activePage === "vendors") setActiveTab("vendor");
    else if (activePage === "trainings") setActiveTab("training");
    else if (activePage === "policies") setActiveTab("policy");
    else if (activePage === "incidents") setActiveTab("incident");
  }, [activePage]);

  // Filter queries
  const [vendorQuery, setVendorQuery] = useState("");
  const [trainingQuery, setTrainingQuery] = useState("");
  const [policyQuery, setPolicyQuery] = useState("");
  const [incidentQuery, setIncidentQuery] = useState("");

  // Sub tab inside Policy Center: "org" | "templates" | "copilot"
  const [policySubTab, setPolicySubTab] = useState<"org" | "templates" | "copilot">("org");

  // --- AI-Powered Compliance Copilot States ---
  const [copilotWorkspace, setCopilotWorkspace] = useState("C&A Portal Workspace");
  const [copilotIndustry, setCopilotIndustry] = useState("Fintech & Digital Banking");
  const [copilotFrameworks, setCopilotFrameworks] = useState<string[]>(["ISO 42001", "NIST AI RMF"]);
  const [copilotTone, setCopilotTone] = useState("Strict & Rigorous Regulatory");
  const [copilotObjective, setCopilotObjective] = useState("Write an operational policy covering Model Version Control and Rollback procedures, specifying that version records must be preserved for at least 3 years and defining exact criteria for hot-fixes versus minor model updates.");
  const [copilotDraftedContent, setCopilotDraftedContent] = useState("");
  const [copilotDraftedTitle, setCopilotDraftedTitle] = useState("AI Model Versioning and Rollback Policy");
  const [copilotIsLoading, setCopilotIsLoading] = useState(false);
  const [copilotLoadingStep, setCopilotLoadingStep] = useState("");
  const [copilotError, setCopilotError] = useState("");
  const [copilotRefinementInput, setCopilotRefinementInput] = useState("");
  const [copilotChatHistory, setCopilotChatHistory] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [copilotSaveStatus, setCopilotSaveStatus] = useState<"Published" | "Under review" | "Draft">("Draft");
  const [copilotSaveTag, setCopilotSaveTag] = useState("Governance");

  // Incident status filter button
  const [incidentFilter, setIncidentFilter] = useState<"ALL" | "Open" | "Investigating" | "Mitigated" | "Closed">("ALL");

  // Modals / Drawers State
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  
  // Custom template editor drawer for policies
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate | null>(null);
  const [customPolicyTitle, setCustomPolicyTitle] = useState("");
  const [customPolicyContent, setCustomPolicyContent] = useState("");
  const [customPolicyTag, setCustomPolicyTag] = useState("Governance");

  // --- Vendor Form ---
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [selectedVendorDetail, setSelectedVendorDetail] = useState<Vendor | null>(null);
  const [vendorStatusFilter, setVendorStatusFilter] = useState<string>("ALL");
  const [vName, setVName] = useState("");
  const [vUrl, setVUrl] = useState("");
  const [vProjects, setVProjects] = useState("");
  const [vStatus, setVStatus] = useState<"Approved" | "Pending" | "Rejected">("Approved");
  const [vScore, setVScore] = useState("N/A");
  const [vAssignee, setVAssignee] = useState("");
  const [vReviewDate, setVReviewDate] = useState("");

  // --- Vendor Workspace State ---
  const [vendorWorkspace, setVendorWorkspace] = useState<"directory" | "risks">("directory");
  const [vendorRisks, setVendorRisks] = useState<any[]>([]);
  const [isVendorRiskModalOpen, setIsVendorRiskModalOpen] = useState(false);

  // --- Vendor Risk Form State ---
  const [vrName, setVrName] = useState("");
  const [vrVendorId, setVrVendorId] = useState("");
  const [vrSeverity, setVrSeverity] = useState<"LOW" | "MEDIUM" | "HIGH" | "VERY HIGH">("LOW");
  const [vrDescription, setVrDescription] = useState("");
  const [vrMitigationStatus, setVrMitigationStatus] = useState<"NOT STARTED" | "IN PROGRESS" | "COMPLETED">("NOT STARTED");
  const [vrTargetDate, setVrTargetDate] = useState("");

  const handleCreateVendorRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vrName || !vrVendorId) return;

    const vendorObj = vendors.find(v => v.id === vrVendorId);
    const newRisk = {
      id: `VRK-${vendorRisks.length + 101}`,
      vendorId: vrVendorId,
      vendorName: vendorObj ? vendorObj.name : "Unknown",
      riskName: vrName,
      severity: vrSeverity,
      description: vrDescription,
      mitigationStatus: vrMitigationStatus,
      targetDate: vrTargetDate || "Dec 31, 2026"
    };

    setVendorRisks(prev => [newRisk, ...prev]);
    setIsVendorRiskModalOpen(false);

    // Reset Form
    setVrName("");
    setVrVendorId("");
    setVrSeverity("LOW");
    setVrDescription("");
    setVrMitigationStatus("NOT STARTED");
    setVrTargetDate("");
  };

  // --- Training Form & Management State ---
  const [editingTraining, setEditingTraining] = useState<TrainingRecord | null>(null);
  const [selectedTrainingDetail, setSelectedTrainingDetail] = useState<TrainingRecord | null>(null);
  const [trainingStatusFilter, setTrainingStatusFilter] = useState<"ALL" | "Planned" | "In progress" | "Completed">("ALL");
  const [tName, setTName] = useState("");
  const [tDur, setTDur] = useState("");
  const [tProv, setTProv] = useState("");
  const [tDept, setTDept] = useState("");
  const [tStatus, setTStatus] = useState<"Planned" | "In progress" | "Completed">("Planned");
  const [tPeople, setTPeople] = useState(1);
  const [tDesc, setTDesc] = useState("");

  // --- Incident Form & Management State ---
  const [editingIncident, setEditingIncident] = useState<IncidentRecord | null>(null);
  const [incProject, setIncProject] = useState("");
  const [incType, setIncType] = useState("Unintended output");
  const [incSeverity, setIncSeverity] = useState<"MINOR" | "MODERATE" | "SERIOUS" | "CRITICAL">("MINOR");
  const [incStatus, setIncStatus] = useState<"Open" | "Investigating" | "Mitigated" | "Closed">("Open");
  const [incApprovedBy, setIncApprovedBy] = useState("Demo Assessor");
  const [incOccurred, setIncOccurred] = useState("");
  const [incDescription, setIncDescription] = useState("");
  const [incRootCause, setIncRootCause] = useState("");
  const [incImpact, setIncImpact] = useState("");

  // --- Selected Incident for Detailed Response Workspace ---
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);

  // Local notes/comments state for incidents to support interactive response updates!
  const [incidentNotes, setIncidentNotes] = useState<Record<string, { author: string; text: string; date: string }[]>>({
    "INC-0004": [
      { author: "Demo Assessor", text: "Flagged anomalous risk-classification behavior in candidate assessment outputs.", date: "2026-04-25 10:15" },
      { author: "Leo Vance", text: "Initiating response triage. Verifying training benchmarks against production traffic logs.", date: "2026-04-25 14:30" }
    ],
    "INC-0003": [
      { author: "Demo Assessor", text: "Client reported a hallucinated ISO-42001 certification requirement during automated chatbot inquiry.", date: "2026-02-18 09:00" },
      { author: "Leo Vance", text: "Configured strict grounding rules and forced temperature limit to 0.2. Deployed regex hotfix.", date: "2026-02-18 16:45" }
    ],
    "INC-0002": [
      { author: "Demo Assessor", text: "Detected anomalous prompt-injection vectors attempting to bypass core GRC constraints.", date: "2026-03-02 11:20" }
    ],
    "INC-0001": [
      { author: "Demo Assessor", text: "Initial model evaluation displayed slight demographic bias toward certain regional descriptors.", date: "2026-04-07 08:30" },
      { author: "Leo Vance", text: "Re-adjusted evaluation weights and ran full fairlearn regression tests. Score approved.", date: "2026-04-07 15:10" }
    ]
  });

  const [newNoteText, setNewNoteText] = useState("");

  // --- Policy Form & Management State ---
  const [editingPolicy, setEditingPolicy] = useState<OrganizationalPolicy | null>(null);
  const [selectedPolicyDetail, setSelectedPolicyDetail] = useState<OrganizationalPolicy | null>(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [policyStatusFilter, setPolicyStatusFilter] = useState<"ALL" | "Published" | "Under review" | "Draft" | "Archived" | "Deprecated">("ALL");

  const [polTitle, setPolTitle] = useState("");
  const [polStatus, setPolStatus] = useState<"Published" | "Under review" | "Draft" | "Archived" | "Deprecated">("Published");
  const [polTag, setPolTag] = useState("Governance");
  const [polTeamSize, setPolTeamSize] = useState(1);
  const [polNextReview, setPolNextReview] = useState("");
  const [polLastUpdated, setPolLastUpdated] = useState("");
  const [polOwner, setPolOwner] = useState("Demo Assessor");
  const [polCategory, setPolCategory] = useState("Governance");
  const [polContent, setPolContent] = useState("");
  const [governanceToast, setGovernanceToast] = useState<string | null>(null);

  const showGovToast = (msg: string) => {
    setGovernanceToast(msg);
    setTimeout(() => setGovernanceToast(null), 3500);
  };

  const handleOpenAddPolicy = () => {
    setEditingPolicy(null);
    setPolTitle("");
    setPolStatus("Published");
    setPolTag("Governance");
    setPolTeamSize(1);
    setPolNextReview("");
    setPolLastUpdated("");
    setPolOwner("Demo Assessor");
    setPolCategory("Governance");
    setPolContent("");
    setIsPolicyModalOpen(true);
  };

  const handleOpenEditPolicy = (p: OrganizationalPolicy) => {
    setEditingPolicy(p);
    setPolTitle(p.title);
    setPolStatus(p.status || "Published");
    setPolTag(p.tags[0] || "Governance");
    setPolTeamSize(p.teamSize || 1);
    setPolNextReview(p.nextReview || "");
    setPolLastUpdated(p.lastUpdated || "");
    setPolOwner(p.owner || "Demo Assessor");
    setPolCategory(p.category || p.tags[0] || "Governance");
    setPolContent(p.content || "");
    setIsPolicyModalOpen(true);
  };

  const handleDeletePolicyClick = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete policy "${title}"?`)) {
      onDeletePolicy(id);
      if (selectedPolicyDetail?.id === id) {
        setSelectedPolicyDetail(null);
      }
    }
  };

  const handleQuickPolicyStatusChange = (p: OrganizationalPolicy, status: "Published" | "Under review" | "Draft" | "Archived" | "Deprecated") => {
    const updated: OrganizationalPolicy = { ...p, status };
    if (onUpdatePolicy) {
      onUpdatePolicy(updated);
    }
    if (selectedPolicyDetail?.id === p.id) {
      setSelectedPolicyDetail(updated);
    }
  };

  const handleExportPoliciesCSV = () => {
    const headers = ["Policy ID", "Title", "Status", "Category / Tag", "Owner", "Team Size", "Last Updated", "Next Review", "Content Narrative"];
    const rows = filteredPolicies.map(p => [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.status}"`,
      `"${(p.category || p.tags[0] || "Governance").replace(/"/g, '""')}"`,
      `"${(p.owner || "Demo Assessor").replace(/"/g, '""')}"`,
      `"${p.teamSize}"`,
      `"${p.lastUpdated}"`,
      `"${p.nextReview}"`,
      `"${(p.content || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Organizational_Policies_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateOrUpdatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!polTitle.trim()) return;

    if (editingPolicy) {
      const updatedPol: OrganizationalPolicy = {
        ...editingPolicy,
        title: polTitle,
        status: polStatus,
        tags: [polTag || polCategory || "Governance"],
        teamSize: Number(polTeamSize) || 1,
        nextReview: polNextReview || editingPolicy.nextReview || "Dec 31, 2026",
        lastUpdated: polLastUpdated || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        owner: polOwner || "Demo Assessor",
        category: polCategory || polTag || "Governance",
        content: polContent
      };
      if (onUpdatePolicy) {
        onUpdatePolicy(updatedPol);
      }
      if (selectedPolicyDetail?.id === editingPolicy.id) {
        setSelectedPolicyDetail(updatedPol);
      }
    } else {
      const newPol: OrganizationalPolicy = {
        id: `pol-${policies.length + 101}`,
        title: polTitle,
        status: polStatus,
        tags: [polTag || polCategory || "Governance"],
        teamSize: Number(polTeamSize) || 1,
        nextReview: polNextReview || "Dec 31, 2026",
        lastUpdated: polLastUpdated || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        owner: polOwner || "Demo Assessor",
        category: polCategory || polTag || "Governance",
        content: polContent
      };
      onAddPolicy(newPol);
    }

    setIsPolicyModalOpen(false);
    setEditingPolicy(null);

    // Reset Form
    setPolTitle("");
    setPolStatus("Published");
    setPolTag("Governance");
    setPolTeamSize(1);
    setPolNextReview("");
    setPolLastUpdated("");
    setPolOwner("Demo Assessor");
    setPolCategory("Governance");
    setPolContent("");
  };

  // Save Custom Policy from template
  const handleSavePolicyFromTemplate = () => {
    if (!customPolicyTitle) return;

    const newPolicy: OrganizationalPolicy = {
      id: `pol-${policies.length + 10}`,
      title: customPolicyTitle,
      status: "Published",
      tags: [customPolicyTag],
      teamSize: 1,
      nextReview: "Dec 31, 2026",
      lastUpdated: "Jun 4, 2026",
      content: customPolicyContent
    };

    onAddPolicy(newPolicy);
    setSelectedTemplate(null);
    showGovToast('Policy published successfully into "Organizational Policies" repository.');
  };

  const handleOpenAddVendor = () => {
    setEditingVendor(null);
    setVName("");
    setVUrl("");
    setVProjects("");
    setVStatus("Approved");
    setVScore("N/A");
    setVAssignee("");
    setVReviewDate("");
    setIsVendorModalOpen(true);
  };

  const handleOpenEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setVName(vendor.name);
    setVUrl(vendor.website || "");
    setVProjects(vendor.projects || "");
    setVStatus((vendor.reviewStatus as any) || "Approved");
    setVScore(vendor.score || "N/A");
    setVAssignee(vendor.assignee || "");
    setVReviewDate("");
    setIsVendorModalOpen(true);
  };

  const handleDeleteVendorClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove vendor "${name}" from the directory?`)) {
      if (onDeleteVendor) {
        onDeleteVendor(id);
      }
      if (selectedVendorDetail?.id === id) {
        setSelectedVendorDetail(null);
      }
    }
  };

  const handleQuickStatusChange = (vendor: Vendor, status: "Approved" | "Pending" | "Rejected") => {
    const updated: Vendor = { ...vendor, reviewStatus: status };
    if (onUpdateVendor) {
      onUpdateVendor(updated);
    }
    if (selectedVendorDetail?.id === vendor.id) {
      setSelectedVendorDetail(updated);
    }
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName) return;

    // Format current date if not provided (e.g. "Jul 12, 2026")
    const formattedDate = vReviewDate 
      ? new Date(vReviewDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : (editingVendor?.reviewDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));

    if (editingVendor) {
      const updatedVendor: Vendor = {
        ...editingVendor,
        name: vName,
        website: vUrl,
        projects: vProjects || "None",
        reviewStatus: vStatus as any,
        score: vScore || "N/A",
        assignee: vAssignee || "—",
        reviewDate: formattedDate
      };
      if (onUpdateVendor) {
        onUpdateVendor(updatedVendor);
      }
      if (selectedVendorDetail?.id === editingVendor.id) {
        setSelectedVendorDetail(updatedVendor);
      }
    } else {
      const newVendor: Vendor = {
        id: `vnd-${vendors.length + 1}`,
        name: vName,
        website: vUrl,
        projects: vProjects || "None",
        reviewStatus: vStatus as any,
        score: vScore || "N/A",
        assignee: vAssignee || "—",
        reviewDate: formattedDate
      };
      onAddVendor(newVendor);
    }

    setIsVendorModalOpen(false);
    setEditingVendor(null);

    // Clear Form
    setVName("");
    setVUrl("");
    setVProjects("");
    setVStatus("Approved");
    setVScore("N/A");
    setVAssignee("");
    setVReviewDate("");
  };

  const handleOpenAddTraining = () => {
    setEditingTraining(null);
    setTName("");
    setTDur("");
    setTProv("");
    setTDept("");
    setTStatus("Planned");
    setTPeople(1);
    setTDesc("");
    setIsTrainingModalOpen(true);
  };

  const handleOpenEditTraining = (training: TrainingRecord) => {
    setEditingTraining(training);
    setTName(training.name);
    setTDur(training.duration || "");
    setTProv(training.provider || "");
    setTDept(training.department || "");
    setTStatus(training.status);
    setTPeople(training.peopleCount || 1);
    setTDesc(training.description || "");
    setIsTrainingModalOpen(true);
  };

  const handleDeleteTrainingClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete training record "${name}" (${id})?`)) {
      if (onDeleteTraining) {
        onDeleteTraining(id);
      }
      if (selectedTrainingDetail?.id === id) {
        setSelectedTrainingDetail(null);
      }
    }
  };

  const handleQuickTrainingStatusChange = (training: TrainingRecord, status: "Planned" | "In progress" | "Completed") => {
    const updated = { ...training, status };
    if (onUpdateTraining) {
      onUpdateTraining(updated);
    }
    if (selectedTrainingDetail?.id === training.id) {
      setSelectedTrainingDetail(updated);
    }
  };

  const handleExportTrainingsCSV = () => {
    const headers = ["ID", "Training Name", "Duration", "Provider", "Department", "Status", "Attendees Count", "Description"];
    const rows = filteredTrainings.map(t => [
      `"${t.id}"`,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.duration}"`,
      `"${t.provider}"`,
      `"${t.department}"`,
      `"${t.status}"`,
      `"${t.peopleCount}"`,
      `"${(t.description || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Training_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName) return;

    if (editingTraining) {
      const updatedTraining: TrainingRecord = {
        ...editingTraining,
        name: tName,
        duration: tDur || "1 hour",
        provider: tProv || "Internal Training",
        department: tDept || "Compliance",
        status: tStatus,
        peopleCount: tPeople,
        description: tDesc
      };
      if (onUpdateTraining) {
        onUpdateTraining(updatedTraining);
      }
      if (selectedTrainingDetail?.id === editingTraining.id) {
        setSelectedTrainingDetail(updatedTraining);
      }
    } else {
      const newTraining: TrainingRecord = {
        id: `tr-${trainings.length + 1}`,
        name: tName,
        duration: tDur || "1 hour",
        provider: tProv || "Internal Training",
        department: tDept || "Compliance",
        status: tStatus,
        peopleCount: tPeople,
        description: tDesc
      };
      onAddTraining(newTraining);
    }

    setIsTrainingModalOpen(false);
    setEditingTraining(null);

    // Clear Form
    setTName("");
    setTDur("");
    setTProv("");
    setTDept("");
    setTStatus("Planned");
    setTPeople(1);
    setTDesc("");
  };

  const handleOpenAddIncident = () => {
    setEditingIncident(null);
    setIncProject(projects[0]?.title || "");
    setIncType("Unintended output");
    setIncSeverity("MINOR");
    setIncStatus("Open");
    setIncApprovedBy("Demo Assessor");
    setIncOccurred(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
    setIncDescription("");
    setIncRootCause("");
    setIncImpact("");
    setIsIncidentModalOpen(true);
  };

  const handleOpenEditIncident = (inc: IncidentRecord) => {
    setEditingIncident(inc);
    setIncProject(inc.project);
    setIncType(inc.type);
    setIncSeverity(inc.severity);
    setIncStatus(inc.status);
    setIncApprovedBy(inc.approvedBy || "Demo Assessor");
    setIncOccurred(inc.occurred || "");
    setIncDescription(inc.description || "");
    setIncRootCause(inc.rootCause || "");
    setIncImpact(inc.impact || "");
    setIsIncidentModalOpen(true);
  };

  const handleDeleteIncidentClick = (id: string, project: string) => {
    if (confirm(`Are you sure you want to delete incident record "${id}" (${project})?`)) {
      if (onDeleteIncident) {
        onDeleteIncident(id);
      }
      if (selectedIncident?.id === id) {
        setSelectedIncident(null);
      }
    }
  };

  const handleExportIncidentsCSV = () => {
    const headers = ["Incident ID", "AI Project", "Type", "Severity", "Status", "Occurred Date", "Approved By", "Narrative / Description", "Root Cause", "Impact"];
    const rows = filteredIncidents.map(i => [
      `"${i.id}"`,
      `"${i.project.replace(/"/g, '""')}"`,
      `"${i.type.replace(/"/g, '""')}"`,
      `"${i.severity}"`,
      `"${i.status}"`,
      `"${i.occurred}"`,
      `"${i.approvedBy.replace(/"/g, '""')}"`,
      `"${(i.description || "").replace(/"/g, '""')}"`,
      `"${(i.rootCause || "").replace(/"/g, '""')}"`,
      `"${(i.impact || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Incident_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incProject) return;

    if (editingIncident) {
      const updatedInc: IncidentRecord = {
        ...editingIncident,
        project: incProject,
        type: incType,
        severity: incSeverity,
        status: incStatus,
        occurred: incOccurred || editingIncident.occurred,
        approvedBy: incApprovedBy || "Demo Assessor",
        description: incDescription,
        rootCause: incRootCause,
        impact: incImpact
      };
      if (onUpdateIncident) {
        onUpdateIncident(updatedInc);
      }
      if (selectedIncident?.id === editingIncident.id) {
        setSelectedIncident(updatedInc);
      }
    } else {
      const newInc: IncidentRecord = {
        id: `INC-000${incidents.length + 1}`,
        project: incProject,
        type: incType,
        severity: incSeverity,
        status: incStatus,
        occurred: incOccurred || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        approvedBy: incApprovedBy || "Demo Assessor",
        description: incDescription,
        rootCause: incRootCause,
        impact: incImpact
      };
      onAddIncident(newInc);
    }

    setIsIncidentModalOpen(false);
    setEditingIncident(null);

    // Reset Form
    setIncProject("");
    setIncType("Unintended output");
    setIncSeverity("MINOR");
    setIncStatus("Open");
    setIncApprovedBy("Demo Assessor");
    setIncOccurred("");
    setIncDescription("");
    setIncRootCause("");
    setIncImpact("");
  };

  const handleAddIncidentNote = (incidentId: string) => {
    if (!newNoteText.trim()) return;

    const newNote = {
      author: "Demo Assessor",
      text: newNoteText,
      date: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    setIncidentNotes((prev) => ({
      ...prev,
      [incidentId]: [...(prev[incidentId] || []), newNote]
    }));

    setNewNoteText("");
  };

  // Open Template Customizer
  const handleOpenTemplateCustomizer = (tpl: PolicyTemplate) => {
    setSelectedTemplate(tpl);
    setCustomPolicyTitle(tpl.title);
    setCustomPolicyContent(
      `POLICY TITLE: ${tpl.title}\nTAGS: ${tpl.tags.join(", ")}\n\nPURPOSE:\n${tpl.purpose}\n\nSCOPE:\n${tpl.scope}\n\nKEY TERMS:\n${tpl.keyTerms}\n\nREQUIREMENTS:\n${tpl.policyRequirements}`
    );
    if (tpl.tags && tpl.tags.length > 0) {
      setCustomPolicyTag(tpl.tags[0]);
    }
  };

  // --- AI Compliance Copilot Handlers ---
  const handleToggleFramework = (fw: string) => {
    if (copilotFrameworks.includes(fw)) {
      setCopilotFrameworks(copilotFrameworks.filter(f => f !== fw));
    } else {
      setCopilotFrameworks([...copilotFrameworks, fw]);
    }
  };

  const handleGenerateCopilotPolicy = async () => {
    if (!copilotObjective.trim()) {
      setCopilotError("Please provide a policy objective or focus guidelines.");
      return;
    }

    setCopilotIsLoading(true);
    setCopilotError("");
    setCopilotLoadingStep("Analyzing regulatory controls...");

    try {
      const steps = [
        "Analyzing regulatory controls...",
        "Mapping system-level risk boundaries...",
        "Synthesizing tailored requirements...",
        "Formatting compliance metadata..."
      ];
      
      let stepIdx = 0;
      const interval = setInterval(() => {
        if (stepIdx < steps.length - 1) {
          stepIdx++;
          setCopilotLoadingStep(steps[stepIdx]);
        }
      }, 1500);

      const response = await fetch("/api/copilot/draft-policy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          workspaceName: copilotWorkspace,
          industry: copilotIndustry,
          frameworks: copilotFrameworks,
          objective: copilotObjective,
          tone: copilotTone,
          chatHistory: [] // fresh start
        })
      });

      clearInterval(interval);

      const data = await response.json().catch(() => ({}));
      if (!response.ok && !data.content) {
        let msg = data.error || "Failed to generate policy";
        try {
          if (typeof msg === "string" && msg.startsWith("{")) {
            const parsed = JSON.parse(msg);
            msg = parsed.error?.message || parsed.message || msg;
          }
        } catch {}
        throw new Error(msg);
      }
      
      let extractedTitle = copilotDraftedTitle;
      const titleMatch = data.content.match(/#\s*(.+)/);
      if (titleMatch && titleMatch[1]) {
        extractedTitle = titleMatch[1].trim().replace(/\*\*|#/g, "");
      } else {
        extractedTitle = "AI Compliance Policy";
      }

      setCopilotDraftedContent(data.content);
      setCopilotDraftedTitle(extractedTitle);
      setCopilotChatHistory([
        { role: "assistant", text: data.content }
      ]);
    } catch (err: any) {
      console.error(err);
      let friendlyError = err.message || "An unexpected error occurred during policy drafting.";
      try {
        if (typeof friendlyError === "string" && friendlyError.startsWith("{")) {
          const parsed = JSON.parse(friendlyError);
          friendlyError = parsed.error?.message || parsed.message || friendlyError;
        }
      } catch {}
      setCopilotError(friendlyError);
    } finally {
      setCopilotIsLoading(false);
      setCopilotLoadingStep("");
    }
  };

  const handleRefineCopilotPolicy = async () => {
    if (!copilotRefinementInput.trim()) return;
    if (!copilotDraftedContent) return;

    setCopilotIsLoading(true);
    setCopilotError("");
    setCopilotLoadingStep("Refining drafted policy sections...");

    const updatedHistory = [
      ...copilotChatHistory,
      { role: "user" as const, text: copilotRefinementInput }
    ];

    setCopilotChatHistory(updatedHistory);
    const refinementRequest = copilotRefinementInput;
    setCopilotRefinementInput("");

    try {
      const response = await fetch("/api/copilot/draft-policy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          workspaceName: copilotWorkspace,
          industry: copilotIndustry,
          frameworks: copilotFrameworks,
          objective: copilotObjective,
          tone: copilotTone,
          chatHistory: updatedHistory
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok && !data.content) {
        let msg = data.error || "Failed to refine policy";
        try {
          if (typeof msg === "string" && msg.startsWith("{")) {
            const parsed = JSON.parse(msg);
            msg = parsed.error?.message || parsed.message || msg;
          }
        } catch {}
        throw new Error(msg);
      }

      let extractedTitle = copilotDraftedTitle;
      const titleMatch = data.content.match(/#\s*(.+)/);
      if (titleMatch && titleMatch[1]) {
        extractedTitle = titleMatch[1].trim().replace(/\*\*|#/g, "");
      }

      setCopilotDraftedContent(data.content);
      setCopilotDraftedTitle(extractedTitle);
      setCopilotChatHistory([
        ...updatedHistory,
        { role: "assistant" as const, text: data.content }
      ]);
    } catch (err: any) {
      console.error(err);
      let friendlyError = err.message || "An unexpected error occurred during refinement.";
      try {
        if (typeof friendlyError === "string" && friendlyError.startsWith("{")) {
          const parsed = JSON.parse(friendlyError);
          friendlyError = parsed.error?.message || parsed.message || friendlyError;
        }
      } catch {}
      setCopilotError(friendlyError);
    } finally {
      setCopilotIsLoading(false);
      setCopilotLoadingStep("");
    }
  };

  const handleSaveCopilotPolicy = () => {
    if (!copilotDraftedContent) return;

    const newPolicy: OrganizationalPolicy = {
      id: `pol-${policies.length + 10}`,
      title: copilotDraftedTitle,
      status: copilotSaveStatus,
      tags: [copilotSaveTag],
      teamSize: 1,
      nextReview: "Dec 31, 2026",
      lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      content: copilotDraftedContent
    };

    onAddPolicy(newPolicy);
    showGovToast(`Successfully saved "${copilotDraftedTitle}" to Organizational Policies!`);
    setPolicySubTab("org");
  };

  // Filters
  const filteredVendors = vendors.filter(v => {
    const q = vendorQuery.toLowerCase();
    const matchesQuery =
      v.name.toLowerCase().includes(q) ||
      v.projects.toLowerCase().includes(q) ||
      (v.website && v.website.toLowerCase().includes(q)) ||
      (v.assignee && v.assignee.toLowerCase().includes(q));
    const matchesStatus = vendorStatusFilter === "ALL" || v.reviewStatus === vendorStatusFilter;
    return matchesQuery && matchesStatus;
  });

  const filteredTrainings = trainings.filter(t => {
    const q = trainingQuery.toLowerCase();
    const matchesQuery =
      t.name.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.provider.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q));
    const matchesStatus = trainingStatusFilter === "ALL" || t.status === trainingStatusFilter;
    return matchesQuery && matchesStatus;
  });

  const filteredPolicies = policies.filter(p => {
    const q = policyQuery.toLowerCase();
    const matchesQuery =
      p.title.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      (p.owner && p.owner.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.content && p.content.toLowerCase().includes(q));
    const matchesStatus = policyStatusFilter === "ALL" || p.status === policyStatusFilter;
    return matchesQuery && matchesStatus;
  });

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.project.toLowerCase().includes(incidentQuery.toLowerCase()) || inc.type.toLowerCase().includes(incidentQuery.toLowerCase());
    if (incidentFilter === "ALL") return matchesSearch;
    return matchesSearch && inc.status === incidentFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Tab selection menu header */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Governance</h1>
            <p className="text-sm text-slate-500 mt-1">Configure compliance policies, verify third-party vendors, manage training programs, and report algorithmic incidents.</p>
          </div>

          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100 flex-wrap gap-1">
            <button
              onClick={() => setActiveTab("policy")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "policy"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              id="gov-tab-policy"
            >
              Policy Center
            </button>
            <button
              onClick={() => setActiveTab("vendor")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "vendor"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              id="gov-tab-vendor"
            >
              Vendor Management
            </button>
            <button
              onClick={() => setActiveTab("training")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "training"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              id="gov-tab-training"
            >
              Training Registry
            </button>
            <button
              onClick={() => setActiveTab("incident")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "incident"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              id="gov-tab-incident"
            >
              Incident Response
            </button>
          </div>
        </div>
      </div>

      {/* 1. Policy Center Tab */}
      {activeTab === "policy" && (
        <div className="space-y-6 animate-fade-in" id="panel-policy-center">
          
          {/* Policy metrics summary banner */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Policies</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{policies.length}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-emerald-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Published</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
                {policies.filter(p => p.status === "Published").length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-amber-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Under Review</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
                {policies.filter(p => p.status === "Under review").length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-slate-400">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Drafts</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
                {policies.filter(p => p.status === "Draft").length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-indigo-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Templates Mapped</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{POLICY_TEMPLATES.length}</span>
            </div>
          </div>

          {/* Sub menu controls */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 w-full md:w-auto">
              <button
                onClick={() => setPolicySubTab("org")}
                className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  policySubTab === "org" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-700"
                }`}
                id="btn-policy-org"
              >
                Organizational policies
              </button>
              <button
                onClick={() => setPolicySubTab("templates")}
                className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  policySubTab === "templates" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-700"
                }`}
                id="btn-policy-templates"
              >
                Policy templates
              </button>
              <button
                onClick={() => setPolicySubTab("copilot")}
                className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  policySubTab === "copilot" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-700"
                }`}
                id="btn-policy-copilot"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Compliance Copilot</span>
              </button>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={policySubTab === "org" ? "Search current policies..." : policySubTab === "templates" ? "Search standard templates..." : "Copilot is ready to draft..."}
                disabled={policySubTab === "copilot"}
                value={policyQuery}
                onChange={(e) => setPolicyQuery(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none disabled:opacity-50"
                id="search-policies"
              />
            </div>
          </div>

          {/* Render Policy Lists based on sub-tab */}
          {policySubTab === "org" ? (
            <div className="space-y-4">
              {/* Toolbar & Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                {/* Status Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(["ALL", "Published", "Under review", "Draft", "Archived", "Deprecated"] as const).map((st) => {
                    const count = st === "ALL" ? policies.length : policies.filter(p => p.status === st).length;
                    return (
                      <button
                        key={st}
                        onClick={() => setPolicyStatusFilter(st)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                          policyStatusFilter === st
                            ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span>{st}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          policyStatusFilter === st ? "bg-slate-700 text-slate-100" : "bg-slate-100 text-slate-500"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={handleExportPoliciesCSV}
                    className="px-3.5 py-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={handleOpenAddPolicy}
                    className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Policy</span>
                  </button>
                </div>
              </div>

              {/* Policy List */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                {filteredPolicies.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    No policies found matching query or status filter. Click "New Policy" or use Policy Templates to add one.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredPolicies.map((p) => (
                      <div key={p.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/40 transition-colors">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              onClick={() => setSelectedPolicyDetail(p)}
                              className="text-xs font-extrabold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                            >
                              {p.title}
                            </h4>
                            <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {p.id}
                            </span>
                            {p.category && (
                              <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                                {p.category}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                            <span>Owner: <strong className="text-slate-700">{p.owner || "Demo Assessor"}</strong></span>
                            <span className="text-slate-200">•</span>
                            <span>Team size: <strong className="text-slate-700">{p.teamSize || 1} members</strong></span>
                            <span className="text-slate-200">•</span>
                            <span>Updated: <span className="font-mono">{p.lastUpdated}</span></span>
                            <span className="text-slate-200">•</span>
                            <span>Next Review: <span className="font-mono text-indigo-600">{p.nextReview}</span></span>
                          </div>

                          {p.tags && p.tags.length > 0 && (
                            <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                              {p.tags.map(tag => (
                                <span key={tag} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 self-end md:self-center">
                          {/* Quick Status Select Dropdown */}
                          <select
                            value={p.status}
                            onChange={(e) => handleQuickPolicyStatusChange(p, e.target.value as any)}
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border outline-none cursor-pointer transition-all ${
                              p.status === "Published"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : p.status === "Under review"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : p.status === "Draft"
                                ? "bg-slate-100 text-slate-700 border-slate-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            <option value="Published">Published</option>
                            <option value="Under review">Under review</option>
                            <option value="Draft">Draft</option>
                            <option value="Archived">Archived</option>
                            <option value="Deprecated">Deprecated</option>
                          </select>

                          <button
                            onClick={() => setSelectedPolicyDetail(p)}
                            className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleOpenEditPolicy(p)}
                            className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>

                          <button
                            onClick={() => handleDeletePolicyClick(p.id, p.title)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Policy"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : policySubTab === "templates" ? (
            /* Templates Directory Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {POLICY_TEMPLATES.filter(tpl => tpl.title.toLowerCase().includes(policyQuery.toLowerCase())).map((tpl) => (
                <div key={tpl.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {tpl.tags.map(tag => (
                        <span key={tag} className="text-[8px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-800 leading-snug">{tpl.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">{tpl.description}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Standard</span>
                    <button
                      onClick={() => handleOpenTemplateCustomizer(tpl)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      Use template <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Compliance Copilot Workspace & Automated Gap Detection */
            <div className="space-y-6" id="copilot-container">
              {/* Gap Detection Prompt Bar */}
              <CopilotGapDetectionWidget project={projects[0]} projects={projects} />

              {/* Interactive Policy Drafting Console */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
              {/* Left Column: Controls & Setup (5 columns) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5 text-left relative overflow-hidden">
                  {/* Visual Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>

                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">C&A Portal GRC Engine</h3>
                      <p className="text-[10px] text-slate-400">Configure parameters for custom policy drafting.</p>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Input 1: Company Context */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Workspace Context *</label>
                    <input
                      type="text"
                      value={copilotWorkspace}
                      onChange={(e) => setCopilotWorkspace(e.target.value)}
                      placeholder="e.g. C&A Portal Enterprise Hub"
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 rounded-lg p-2.5 outline-none transition-all"
                    />
                  </div>

                  {/* Input 2: Industry Domain */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Industry Domain *</label>
                    <select
                      value={copilotIndustry}
                      onChange={(e) => setCopilotIndustry(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 rounded-lg p-2.5 outline-none transition-all"
                    >
                      <option value="Fintech & Digital Banking">Fintech & Digital Banking</option>
                      <option value="Healthcare, Biotech & Medtech">Healthcare, Biotech & Medtech</option>
                      <option value="SaaS & Enterprise Cloud Platforms">SaaS & Enterprise Cloud Platforms</option>
                      <option value="E-commerce, Retail & Consumer Tech">E-commerce, Retail & Consumer Tech</option>
                      <option value="Autonomous Robotics & Smart Manufacturing">Autonomous Robotics & Smart Manufacturing</option>
                      <option value="Public Sector & National Security Systems">Public Sector & National Security Systems</option>
                      <option value="Automotive & Aerospace Engineering">Automotive & Aerospace Engineering</option>
                      <option value="General Commercial Enterprise">General Commercial Enterprise</option>
                    </select>
                  </div>

                  {/* Input 3: Regulatory Frameworks */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Framework Alignment</label>
                    <div className="flex flex-wrap gap-2">
                      {["ISO 42001", "NIST AI RMF", "EU AI Act", "SOC 2 Type II", "HIPAA Security"].map((fw) => {
                        const active = copilotFrameworks.includes(fw);
                        return (
                          <button
                            key={fw}
                            type="button"
                            onClick={() => handleToggleFramework(fw)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                              active
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            {fw}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input 4: Drafting Tone */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Drafting Profile / Tone</label>
                    <select
                      value={copilotTone}
                      onChange={(e) => setCopilotTone(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 rounded-lg p-2.5 outline-none transition-all"
                    >
                      <option value="Strict & Rigorous Regulatory">Strict & Rigorous Regulatory</option>
                      <option value="Modern Tech Start-up / Agile">Modern Tech Start-up / Agile</option>
                      <option value="Enterprise Executive Summary GRC">Enterprise Executive Summary GRC</option>
                      <option value="Plain English GRC Guidelines">Plain English GRC Guidelines</option>
                    </select>
                  </div>

                  {/* Input 5: Policy Objective */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Primary Policy Focus & Objective *</label>
                    <textarea
                      value={copilotObjective}
                      onChange={(e) => setCopilotObjective(e.target.value)}
                      placeholder="e.g. Draft a monthly model bias and hallucination audit procedure mapping to ISO 42001, defining metrics thresholds, roles, and emergency rollback timelines."
                      rows={4}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 rounded-lg p-2.5 outline-none transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleGenerateCopilotPolicy}
                    disabled={copilotIsLoading}
                    className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    id="btn-trigger-copilot-draft"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Draft Policy with C&A Portal Copilot</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Drafting Canvas Sandbox & Refinement (7 columns) */}
              <div className="lg:col-span-7 flex flex-col h-full min-h-[580px]">
                {/* Loader State overlay */}
                {copilotIsLoading && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-40 rounded-2xl p-6 border border-slate-100">
                    <div className="flex flex-col items-center space-y-4 text-center">
                      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800">{copilotLoadingStep || "Consulting C&A Portal Copilot..."}</p>
                        <p className="text-[10px] text-slate-400 animate-pulse">This secure server-side LLM proxy takes ~10 seconds to compile extensive controls.</p>
                      </div>
                    </div>
                  </div>
                )}

                {copilotError && (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-4 text-left">
                    <div className="flex gap-2">
                      <span className="text-rose-500 font-extrabold text-sm">⚠️</span>
                      <div>
                        <h4 className="text-xs font-bold text-rose-800">Drafting Error</h4>
                        <p className="text-[11px] text-rose-600 mt-1">{copilotError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {!copilotDraftedContent ? (
                  /* Sandbox Welcome state */
                  <div className="flex-1 bg-slate-50 border border-slate-200/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xs border border-slate-100 text-indigo-500">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <h4 className="text-xs font-bold text-slate-800">Interactive Policy Sandbox</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Customize draft objectives on the left or select a rapid compliance preset below to instantly compile tailored GRC documentation.
                      </p>
                    </div>

                    <div className="w-full max-w-md space-y-2 text-left">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block text-center">Select drafting presets</span>
                      <button
                        onClick={() => {
                          setCopilotObjective("Create a strict GRC policy specifying ethical AI development workflows, model validation gating (checking bias, safety), and senior manager sign-off processes matching ISO 42001 and NIST AI RMF.");
                          setCopilotDraftedTitle("Ethical AI Development & Model Validation Policy");
                        }}
                        className="w-full bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/10 p-3 rounded-xl text-left cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-700 block">Ethical AI Validation Gating</span>
                          <span className="text-[9px] text-slate-400 block">Strict bias checkpoints, safety evaluations, and governance signing.</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      </button>

                      <button
                        onClick={() => {
                          setCopilotObjective("Draft a data privacy and user consent policy specifically regulating the fine-tuning of Large Language Models, covering user opt-outs, strict scrubbing/anonymization pipelines, and SOC 2 alignment.");
                          setCopilotDraftedTitle("LLM Fine-Tuning Data Privacy & Consent Policy");
                        }}
                        className="w-full bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/10 p-3 rounded-xl text-left cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-700 block">LLM Fine-Tuning Privacy Guidelines</span>
                          <span className="text-[9px] text-slate-400 block">Opt-out frameworks, automated scrubbing pipelines, and training locks.</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      </button>

                      <button
                        onClick={() => {
                          setCopilotObjective("Formulate a strict third-party LLM security and model auditing compliance policy regulating how suppliers access client data APIs, including logging, token rotation, and incident report timelines.");
                          setCopilotDraftedTitle("Third-Party AI Supplier Security Policy");
                        }}
                        className="w-full bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/10 p-3 rounded-xl text-left cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-700 block">Third-Party Supplier Security</span>
                          <span className="text-[9px] text-slate-400 block">SaaS API audits, token expiry systems, and forensic incident workflows.</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Sandbox Editor Panel */
                  <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between text-left">
                    {/* Sandbox Header */}
                    <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                          <h4 className="text-xs font-bold text-slate-800">Draft Document Live Sandbox</h4>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-0.5">Interactive workspace: Touch up raw text or use refinement chats.</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(copilotDraftedContent);
                            showGovToast("Copied draft policy content to clipboard!");
                          }}
                          className="px-2.5 py-1 text-[10px] font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Copy Draft</span>
                        </button>
                      </div>
                    </div>

                    {/* Document View & Edit Block */}
                    <div className="flex-1 p-5 space-y-4 flex flex-col">
                      {/* Title Edit */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Policy Title</label>
                        <input
                          type="text"
                          value={copilotDraftedTitle}
                          onChange={(e) => setCopilotDraftedTitle(e.target.value)}
                          className="w-full text-xs font-extrabold text-slate-800 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 outline-none"
                        />
                      </div>

                      {/* Content Edit */}
                      <div className="space-y-1 flex-1 flex flex-col">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Editable Text Controls</label>
                        <textarea
                          value={copilotDraftedContent}
                          onChange={(e) => setCopilotDraftedContent(e.target.value)}
                          className="w-full flex-1 min-h-[260px] text-[11px] font-mono text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl p-4 focus:bg-white focus:border-indigo-500 outline-none resize-none leading-relaxed scrollbar-thin"
                        />
                      </div>
                    </div>

                    {/* Interactive Refinement & Direct GRC Saving */}
                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-4">
                      {/* Refinement Prompt chatbox */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider inline-flex items-center gap-1">
                            <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Interactive Follow-up Prompt</span>
                          </label>
                          <span className="text-[9px] text-slate-400">Ask C&A Portal to update sections or add specific requirements.</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={copilotRefinementInput}
                            onChange={(e) => setCopilotRefinementInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRefineCopilotPolicy()}
                            placeholder="e.g. 'Add a third section detailing compliance steps for the GDPR key requirements'"
                            className="flex-1 text-xs text-slate-800 border border-slate-200 bg-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-all"
                          />
                          <button
                            onClick={handleRefineCopilotPolicy}
                            disabled={copilotIsLoading || !copilotRefinementInput.trim()}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg disabled:opacity-45 cursor-pointer transition-all"
                          >
                            Refine
                          </button>
                        </div>
                      </div>

                      {/* Publish Direct Save parameters */}
                      <div className="pt-3 border-t border-slate-100/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase">Tag</span>
                            <select
                              value={copilotSaveTag}
                              onChange={(e) => setCopilotSaveTag(e.target.value)}
                              className="text-[10px] text-slate-700 bg-white border border-slate-200 rounded-md px-1.5 py-1 outline-none"
                            >
                              <option value="Governance">Governance</option>
                              <option value="Compliance">Compliance</option>
                              <option value="AI Ethics">AI Ethics</option>
                              <option value="Fairness">Fairness</option>
                              <option value="Privacy">Privacy</option>
                            </select>
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase">Publish Status</span>
                            <select
                              value={copilotSaveStatus}
                              onChange={(e) => setCopilotSaveStatus(e.target.value as any)}
                              className="text-[10px] text-slate-700 bg-white border border-slate-200 rounded-md px-1.5 py-1 outline-none"
                            >
                              <option value="Draft">Draft</option>
                              <option value="Under review">Under review</option>
                              <option value="Published">Published</option>
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={handleSaveCopilotPolicy}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-all flex items-center gap-1"
                          id="btn-save-copilot-draft"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Publish to Organizational Policies</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          )}

        </div>
      )}

      {/* 2. Vendor Management Tab */}
      {activeTab === "vendor" && (
        <div className="space-y-6 animate-fade-in" id="panel-vendor">
          {/* Vendor counters */}
          <div className="text-left space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Registry Overview</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {/* Card 1: Vendors */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs">
                <span className="text-2xl font-black text-slate-800">
                  {vendors.length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Vendors
                </span>
              </div>

              {/* Card 2: Vendor Risks */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs">
                <span className="text-2xl font-black text-slate-800">
                  {vendorRisks.length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Vendor Risks
                </span>
              </div>

              {/* Card 3: Very High */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs border-l-4 border-l-rose-500">
                <span className="text-2xl font-black text-rose-600">
                  {vendorRisks.filter(r => r.severity === "VERY HIGH").length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Very High
                </span>
              </div>

              {/* Card 4: High */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs border-l-4 border-l-orange-500">
                <span className="text-2xl font-black text-orange-500">
                  {vendorRisks.filter(r => r.severity === "HIGH").length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  High
                </span>
              </div>

              {/* Card 5: Medium */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs border-l-4 border-l-amber-500">
                <span className="text-2xl font-black text-amber-500">
                  {vendorRisks.filter(r => r.severity === "MEDIUM").length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Medium
                </span>
              </div>

              {/* Card 6: Low */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs border-l-4 border-l-emerald-500">
                <span className="text-2xl font-black text-emerald-600">
                  {vendorRisks.filter(r => r.severity === "LOW").length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Low
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed text-left">
              External AI suppliers and services — track reviews, scores, and vendor-specific risks.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
            
            {/* Left Sidebar Pane: WORKSPACE */}
            <div className="lg:col-span-3 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-left">
                Workspace
              </span>
              <div className="bg-white border border-slate-200 rounded-xl p-2 space-y-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setVendorWorkspace("directory")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vendorWorkspace === "directory"
                      ? "bg-indigo-50/70 text-indigo-700 border-l-4 border-l-indigo-600"
                      : "text-slate-600 hover:bg-slate-50/80"
                  }`}
                >
                  <span className="text-left">Vendor directory</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${
                    vendorWorkspace === "directory"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {vendors.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setVendorWorkspace("risks")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vendorWorkspace === "risks"
                      ? "bg-indigo-50/70 text-indigo-700 border-l-4 border-l-indigo-600"
                      : "text-slate-600 hover:bg-slate-50/80"
                  }`}
                >
                  <span className="text-left">Vendor risks</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${
                    vendorWorkspace === "risks"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {vendorRisks.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Pane: Main Panel Content */}
            <div className="lg:col-span-9 space-y-4">
              {vendorWorkspace === "directory" ? (
                <div className="space-y-4">
                  {/* Header & Controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-slate-800">Vendor directory</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        External AI suppliers and services in your registry.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenAddVendor}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      Add new vendor
                    </button>
                  </div>

                  {/* Search and Status Filters */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search vendors by name, project, website, assignee..."
                        value={vendorQuery}
                        onChange={(e) => setVendorQuery(e.target.value)}
                        className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-indigo-500 transition-all shadow-xs text-left"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 overflow-x-auto">
                      {(["ALL", "Approved", "Pending", "Rejected"] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setVendorStatusFilter(st)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                            vendorStatusFilter === st
                              ? "bg-white text-indigo-600 shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {st === "ALL" ? "All Statuses" : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vendors Table */}
                  {filteredVendors.length === 0 ? (
                    <div className="bg-white p-12 text-center text-slate-400 text-xs rounded-xl border border-slate-200">
                      No matching vendors found. Click "Add new vendor" or adjust filter parameters.
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <th className="p-4 pl-6">Vendor / Domain</th>
                              <th className="p-4">Projects</th>
                              <th className="p-4">Review Status</th>
                              <th className="p-4">Score</th>
                              <th className="p-4">Assignee</th>
                              <th className="p-4">Review Date</th>
                              <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredVendors.map((v) => (
                              <tr key={v.id} className="hover:bg-slate-50/40 transition-colors text-xs text-slate-700">
                                <td className="p-4 pl-6">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedVendorDetail(v)}
                                    className="text-left group cursor-pointer"
                                  >
                                    <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors block">
                                      {v.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">{v.website || "—"}</span>
                                  </button>
                                </td>
                                <td className="p-4 text-left">
                                  <span className="inline-block bg-slate-50 border border-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded text-[11px]">
                                    {v.projects}
                                  </span>
                                </td>
                                <td className="p-4 text-left">
                                  <select
                                    value={v.reviewStatus}
                                    onChange={(e) => handleQuickStatusChange(v, e.target.value as any)}
                                    className={`text-[10px] font-extrabold px-2 py-1 rounded-lg border outline-none cursor-pointer transition-all ${
                                      v.reviewStatus === "Approved"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : v.reviewStatus === "Rejected"
                                        ? "bg-rose-50 text-rose-700 border-rose-200"
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                                  >
                                    <option value="Approved">Approved</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Rejected">Rejected</option>
                                  </select>
                                </td>
                                <td className="p-4 text-left font-mono font-bold text-slate-600">
                                  {v.score}
                                </td>
                                <td className="p-4 text-left font-semibold text-slate-500">
                                  {v.assignee}
                                </td>
                                <td className="p-4 text-left text-slate-400">
                                  {v.reviewDate}
                                </td>
                                <td className="p-4 pr-6 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedVendorDetail(v)}
                                      title="View vendor details"
                                      className="px-2 py-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer transition-colors"
                                    >
                                      View
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditVendor(v)}
                                      title="Edit vendor"
                                      className="px-2 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded text-xs font-semibold cursor-pointer transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteVendorClick(v.id, v.name)}
                                      title="Delete vendor"
                                      className="px-2 py-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded text-xs font-semibold cursor-pointer transition-colors"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Footer */}
                      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
                        <span className="text-xs text-slate-400">
                          Showing 1-{filteredVendors.length} of {filteredVendors.length}
                        </span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Rows</span>
                            <select className="text-xs text-slate-700 bg-white border border-slate-200 rounded px-1.5 py-1 outline-none cursor-pointer">
                              <option value="10">10</option>
                              <option value="25">25</option>
                              <option value="50">50</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button className="px-2.5 py-1 text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-md cursor-not-allowed" disabled>
                              Prev
                            </button>
                            <span className="text-xs text-slate-500 font-bold font-mono">1/1</span>
                            <button className="px-2.5 py-1 text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-md cursor-not-allowed" disabled>
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Header & Controls for Risks */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-slate-800">Vendor risks</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Identify and monitor compliance or privacy risks associated with your third-party AI suppliers.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsVendorRiskModalOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      Add vendor risk
                    </button>
                  </div>

                  {/* Vendor Risks Table */}
                  {vendorRisks.length === 0 ? (
                    <div className="bg-white p-12 text-center text-slate-400 text-xs rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center space-y-3">
                      <span className="text-slate-300">No vendor-specific risks identified yet.</span>
                      <button
                        type="button"
                        onClick={() => setIsVendorRiskModalOpen(true)}
                        className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded border border-indigo-100 cursor-pointer transition-colors"
                      >
                        Record first risk
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <th className="p-4 pl-6">Risk ID</th>
                              <th className="p-4">Vendor</th>
                              <th className="p-4">Risk Title</th>
                              <th className="p-4">Severity</th>
                              <th className="p-4">Status</th>
                              <th className="p-4">Target Date</th>
                              <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {vendorRisks.map((r) => (
                              <tr key={r.id} className="hover:bg-slate-50/20 transition-colors text-xs text-slate-700">
                                <td className="p-4 pl-6 font-mono font-bold text-slate-400 text-left">{r.id}</td>
                                <td className="p-4 font-bold text-slate-800 text-left">{r.vendorName}</td>
                                <td className="p-4 text-slate-600 text-left font-semibold">
                                  <div>
                                    <span>{r.riskName}</span>
                                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-normal">{r.description}</p>
                                  </div>
                                </td>
                                <td className="p-4 text-left">
                                  <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded border ${
                                    r.severity === "VERY HIGH"
                                      ? "bg-rose-50 text-rose-700 border-rose-100"
                                      : r.severity === "HIGH"
                                      ? "bg-orange-50 text-orange-700 border-orange-100"
                                      : r.severity === "MEDIUM"
                                      ? "bg-amber-50 text-amber-700 border-amber-100"
                                      : "bg-emerald-50 text-emerald-700 border-emerald-100"
                                  }`}>
                                    {r.severity}
                                  </span>
                                </td>
                                <td className="p-4 text-left">
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    r.mitigationStatus === "COMPLETED"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : r.mitigationStatus === "IN PROGRESS"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-slate-100 text-slate-500"
                                  }`}>
                                    {r.mitigationStatus}
                                  </span>
                                </td>
                                <td className="p-4 text-slate-400 text-left">{r.targetDate}</td>
                                <td className="p-4 pr-6 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setVendorRisks(prev => prev.filter(item => item.id !== r.id));
                                    }}
                                    className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded cursor-pointer font-bold"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Training Registry Tab */}
      {activeTab === "training" && (
        <div className="space-y-6 animate-fade-in" id="panel-training">
          
          {/* Header Banner */}
          <div className="p-6 bg-indigo-50/40 rounded-xl border border-indigo-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1 text-left">
              <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Training records prove your team understands AI governance
              </h3>
              <p className="text-xs text-indigo-700 leading-relaxed">
                Regulators and auditors want evidence that your builders, managers, and designers are trained in ethical guidelines and corporate AI boundaries.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={handleExportTrainingsCSV}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Registry</span>
              </button>
              <button
                type="button"
                onClick={handleOpenAddTraining}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5"
                id="btn-add-training"
              >
                <Plus className="w-4 h-4" />
                <span>New training</span>
              </button>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="text-left space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Registry Overview</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs">
                <span className="text-2xl font-black text-slate-800">{trainings.length}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Total Sessions</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs border-l-4 border-l-emerald-500">
                <span className="text-2xl font-black text-emerald-600">
                  {trainings.filter(t => t.status === "Completed").length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Completed</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs border-l-4 border-l-amber-500">
                <span className="text-2xl font-black text-amber-500">
                  {trainings.filter(t => t.status === "In progress").length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">In Progress</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs border-l-4 border-l-indigo-500">
                <span className="text-2xl font-black text-indigo-600">
                  {trainings.filter(t => t.status === "Planned").length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Planned</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs">
                <span className="text-2xl font-black text-slate-800">
                  {trainings.reduce((sum, t) => sum + (t.peopleCount || 0), 0)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Trained Staff</span>
              </div>
            </div>
          </div>

          {/* Search & Status Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search training records by name, provider, department, or description..."
                value={trainingQuery}
                onChange={(e) => setTrainingQuery(e.target.value)}
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-indigo-500 transition-all shadow-xs text-left"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 overflow-x-auto">
              {(["ALL", "Completed", "In progress", "Planned"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setTrainingStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    trainingStatusFilter === st
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {st === "ALL" ? "All Statuses" : st}
                </button>
              ))}
            </div>
          </div>

          {/* Trainings list table */}
          {filteredTrainings.length === 0 ? (
            <div className="bg-white p-12 text-center text-slate-400 text-xs rounded-xl border border-slate-200">
              No matching training sessions found. Click "New training" to log a record or adjust search filter.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6">Training Title & Syllabus</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Provider</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Attendees</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTrainings.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors text-xs text-slate-700">
                        <td className="p-4 pl-6">
                          <button
                            type="button"
                            onClick={() => setSelectedTrainingDetail(t)}
                            className="text-left group cursor-pointer"
                          >
                            <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors block">
                              {t.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5 leading-relaxed line-clamp-1">
                              {t.description || "No description logged"}
                            </span>
                          </button>
                        </td>
                        <td className="p-4 text-slate-500 font-mono font-medium">{t.duration}</td>
                        <td className="p-4 font-semibold text-slate-600">{t.provider}</td>
                        <td className="p-4 text-slate-500">{t.department}</td>
                        <td className="p-4">
                          <select
                            value={t.status}
                            onChange={(e) => handleQuickTrainingStatusChange(t, e.target.value as any)}
                            className={`text-[10px] font-extrabold px-2 py-1 rounded-lg border outline-none cursor-pointer transition-all ${
                              t.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : t.status === "In progress"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-indigo-50 text-indigo-700 border-indigo-200"
                            }`}
                          >
                            <option value="Planned">Planned</option>
                            <option value="In progress">In progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="p-4 text-center font-bold text-slate-700">{t.peopleCount}</td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedTrainingDetail(t)}
                              title="View details"
                              className="px-2 py-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer transition-colors"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditTraining(t)}
                              title="Edit record"
                              className="px-2 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded text-xs font-semibold cursor-pointer transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTrainingClick(t.id, t.name)}
                              title="Delete record"
                              className="px-2 py-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded text-xs font-semibold cursor-pointer transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. Incident Response Tab */}
      {activeTab === "incident" && (
        <div className="space-y-6 animate-fade-in" id="panel-incident">
          
          {/* Registry Overview Header */}
          <div className="text-left space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Registry Overview</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              
              {/* Card 1: Total Incidents */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs">
                <span className="text-2xl font-black text-slate-800">
                  {incidents.length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Total
                </span>
              </div>

              {/* Card 2: Open Cases */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs border-l-4 border-l-rose-500">
                <span className="text-2xl font-black text-rose-600">
                  {incidents.filter(i => i.status === "Open").length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Open
                </span>
              </div>

              {/* Card 3: Investigating */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs border-l-4 border-l-amber-500">
                <span className="text-2xl font-black text-amber-500">
                  {incidents.filter(i => i.status === "Investigating").length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Investigating
                </span>
              </div>

              {/* Card 4: Mitigated */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs border-l-4 border-l-indigo-500">
                <span className="text-2xl font-black text-indigo-500">
                  {incidents.filter(i => i.status === "Mitigated").length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Mitigated
                </span>
              </div>

              {/* Card 5: Closed Cases */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-xs border-l-4 border-l-emerald-500">
                <span className="text-2xl font-black text-emerald-600">
                  {incidents.filter(i => i.status === "Closed").length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Closed
                </span>
              </div>

            </div>
            <p className="text-xs text-slate-400 leading-relaxed text-left">
              Log AI-related incidents, track severity and status, and document mitigations and approvals.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
            
            {/* Left Sidebar Pane: WORKSPACE */}
            <div className="lg:col-span-3 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-left">
                Workspace
              </span>
              <div className="bg-white border border-slate-200 rounded-xl p-2 space-y-1 shadow-xs">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-3 rounded-lg text-xs font-bold transition-all bg-indigo-50/70 text-indigo-700 border-l-4 border-l-indigo-600 cursor-default"
                >
                  <span className="text-left flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-indigo-500" />
                    Incident log
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-indigo-100 text-indigo-800">
                    {incidents.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Pane: Main Panel Content */}
            <div className="lg:col-span-9 space-y-4">
              
              <div className="space-y-4">
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-slate-800">Incident log</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Filter by status, search, and manage the full incident register.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search incidents..."
                        value={incidentQuery}
                        onChange={(e) => setIncidentQuery(e.target.value)}
                        className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none"
                        id="search-incidents"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleExportIncidentsCSV}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      Export Registry
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenAddIncident}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
                      id="btn-add-incident"
                    >
                      <Plus className="w-4 h-4" />
                      Add incident
                    </button>
                  </div>
                </div>

                {/* Status Filter Cards Row */}
                <div className="flex flex-wrap bg-slate-100 p-0.5 rounded-lg border border-slate-200 w-full">
                  <button
                    onClick={() => setIncidentFilter("ALL")}
                    className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      incidentFilter === "ALL" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    ALL ({incidents.length})
                  </button>
                  <button
                    onClick={() => setIncidentFilter("Open")}
                    className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      incidentFilter === "Open" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    OPEN ({incidents.filter(i => i.status === "Open").length})
                  </button>
                  <button
                    onClick={() => setIncidentFilter("Investigating")}
                    className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      incidentFilter === "Investigating" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    INVESTIGATING ({incidents.filter(i => i.status === "Investigating").length})
                  </button>
                  <button
                    onClick={() => setIncidentFilter("Mitigated")}
                    className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      incidentFilter === "Mitigated" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    MITIGATED ({incidents.filter(i => i.status === "Mitigated").length})
                  </button>
                  <button
                    onClick={() => setIncidentFilter("Closed")}
                    className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      incidentFilter === "Closed" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    CLOSED ({incidents.filter(i => i.status === "Closed").length})
                  </button>
                </div>

                {/* Table of incidents */}
                {filteredIncidents.length === 0 ? (
                  <div className="bg-white p-12 text-center text-slate-400 text-xs rounded-xl border border-gray-150 shadow-xs">
                    No incidents mapped for this filter selection. Systems all clear.
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="p-4 pl-6 text-left">Incident ID</th>
                            <th className="p-4 text-left">AI Project</th>
                            <th className="p-4 text-left">Type</th>
                            <th className="p-4 text-left">Severity</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Occurred</th>
                            <th className="p-4 text-left">Approved By</th>
                            <th className="p-4 pr-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredIncidents.map((i) => (
                            <tr
                              key={i.id}
                              className="group hover:bg-indigo-50/25 transition-colors text-xs text-slate-700"
                            >
                              <td className="p-4 pl-6 font-mono font-bold text-slate-400 text-left">{i.id}</td>
                              <td className="p-4 font-bold text-slate-800 text-left">
                                <div>{i.project}</div>
                                {i.description && (
                                  <span className="text-[10px] text-slate-400 font-normal line-clamp-1 mt-0.5">{i.description}</span>
                                )}
                              </td>
                              <td className="p-4 font-semibold text-slate-600 text-left">{i.type}</td>
                              <td className="p-4 text-left">
                                <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded border ${
                                  i.severity === "CRITICAL"
                                    ? "bg-rose-50 text-rose-700 border-rose-100 font-black"
                                    : i.severity === "SERIOUS"
                                    ? "bg-red-50 text-red-700 border-red-100"
                                    : i.severity === "MODERATE"
                                    ? "bg-amber-50 text-amber-700 border-amber-100"
                                    : "bg-slate-50 text-slate-700 border-slate-200"
                                }`}>
                                  {i.severity}
                                </span>
                              </td>
                              <td className="p-4 text-left">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  i.status === "Closed"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    : i.status === "Mitigated"
                                    ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                                    : i.status === "Investigating"
                                    ? "bg-amber-50 text-amber-700 border border-amber-100 animate-pulse"
                                    : "bg-rose-50 text-rose-700 border border-rose-100 animate-pulse"
                                }`}>
                                  {i.status}
                                </span>
                              </td>
                              <td className="p-4 text-slate-400 text-left">{i.occurred}</td>
                              <td className="p-4 font-semibold text-slate-500 text-left">
                                {i.approvedBy || "N/A"}
                              </td>
                              <td className="p-4 pr-6 text-right font-semibold">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedIncident(i)}
                                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-md transition-colors cursor-pointer"
                                    title="View Response Workspace"
                                  >
                                    View
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditIncident(i)}
                                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                                    title="Edit Incident Record"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteIncidentClick(i.id, i.project)}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                    title="Delete Incident Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Slide-out Panel Overlay Customization drawer for Policy Customization */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50">
          <div className="bg-white w-full max-w-2xl h-full flex flex-col justify-between shadow-2xl relative overflow-hidden animate-slide-left">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-800">Customize policy from template</h3>
                <p className="text-xs text-slate-400 mt-0.5">Edit requirements and tag attributes before saving.</p>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Policy Title input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">Policy title *</label>
                <input
                  type="text"
                  value={customPolicyTitle}
                  onChange={(e) => setCustomPolicyTitle(e.target.value)}
                  className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none"
                />
              </div>

              {/* Tag choice */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Tag category</label>
                <select
                  value={customPolicyTag}
                  onChange={(e) => setCustomPolicyTag(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2 outline-none"
                >
                  <option value="Governance">Governance</option>
                  <option value="Compliance">Compliance</option>
                  <option value="AI Ethics">AI Ethics</option>
                  <option value="Fairness">Fairness</option>
                  <option value="Privacy">Privacy</option>
                </select>
              </div>

              {/* Rich-text content textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">Document content *</label>
                <textarea
                  rows={14}
                  value={customPolicyContent}
                  onChange={(e) => setCustomPolicyContent(e.target.value)}
                  className="w-full text-xs font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-4 outline-none focus:bg-white leading-relaxed"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePolicyFromTemplate}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                id="btn-publish-custom-policy"
              >
                Save in organizational policies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT VENDOR MODAL --- */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-sans">
                  {editingVendor ? `Edit Vendor: ${editingVendor.name}` : "Add new vendor"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingVendor
                    ? "Update vendor security attributes, review status, and assigned personnel."
                    : "Register an AI supplier or model provider in the workspace."}
                </p>
              </div>
              <button onClick={() => { setIsVendorModalOpen(false); setEditingVendor(null); }} className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateVendor} className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Vendor name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anthropic, OpenAI, Pinecone"
                    value={vName}
                    onChange={(e) => setVName(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Website URL</label>
                  <input
                    type="text"
                    placeholder="e.g. www.anthropic.com"
                    value={vUrl}
                    onChange={(e) => setVUrl(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Projects Handled</label>
                  <input
                    type="text"
                    placeholder="e.g. LLM integration, customer support, data vectorization"
                    value={vProjects}
                    onChange={(e) => setVProjects(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Review Status</label>
                    <select
                      value={vStatus}
                      onChange={(e) => setVStatus(e.target.value as any)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                    >
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Security Score</label>
                    <input
                      type="text"
                      placeholder="e.g. 94%, 88%, A+"
                      value={vScore}
                      onChange={(e) => setVScore(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Assignee</label>
                    <input
                      type="text"
                      placeholder="e.g. Demo Assessor"
                      value={vAssignee}
                      onChange={(e) => setVAssignee(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Review Date</label>
                    <input
                      type="date"
                      value={vReviewDate}
                      onChange={(e) => setVReviewDate(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                {editingVendor ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (editingVendor) {
                        handleDeleteVendorClick(editingVendor.id, editingVendor.name);
                        setIsVendorModalOpen(false);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                  >
                    Delete Vendor
                  </button>
                ) : <div />}
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsVendorModalOpen(false); setEditingVendor(null); }}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-md cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md cursor-pointer shadow-xs transition-colors"
                  >
                    {editingVendor ? "Save Changes" : "Create Vendor"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VENDOR DETAIL PROFILE MODAL --- */}
      {selectedVendorDetail && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedVendorDetail.name}</h3>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    selectedVendorDetail.reviewStatus === "Approved"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : selectedVendorDetail.reviewStatus === "Rejected"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {selectedVendorDetail.reviewStatus}
                  </span>
                </div>
                {selectedVendorDetail.website && (
                  <a
                    href={selectedVendorDetail.website.startsWith("http") ? selectedVendorDetail.website : `https://${selectedVendorDetail.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-600 hover:underline mt-1 inline-block"
                  >
                    {selectedVendorDetail.website}
                  </a>
                )}
              </div>
              <button
                onClick={() => setSelectedVendorDetail(null)}
                className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-5 text-xs text-slate-700">
              {/* Profile Meta Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Security Score</span>
                  <span className="text-sm font-bold text-slate-800 font-mono mt-1 block">{selectedVendorDetail.score}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Review Date</span>
                  <span className="text-xs font-semibold text-slate-700 mt-1 block">{selectedVendorDetail.reviewDate}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Assignee</span>
                  <span className="text-xs font-semibold text-slate-700 mt-1 block">{selectedVendorDetail.assignee}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">ID</span>
                  <span className="text-xs font-mono font-bold text-slate-500 mt-1 block">{selectedVendorDetail.id}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Associated AI Projects</h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium">
                  {selectedVendorDetail.projects}
                </div>
              </div>

              {/* Linked Vendor Risks */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Recorded Risks ({vendorRisks.filter(r => r.vendorId === selectedVendorDetail.id).length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setVrVendorId(selectedVendorDetail.id);
                      setIsVendorRiskModalOpen(true);
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    + Add Risk
                  </button>
                </div>
                {vendorRisks.filter(r => r.vendorId === selectedVendorDetail.id).length === 0 ? (
                  <p className="text-slate-400 italic text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                    No specific compliance or privacy risks recorded for this vendor.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {vendorRisks.filter(r => r.vendorId === selectedVendorDetail.id).map(r => (
                      <div key={r.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800 block text-xs">{r.riskName}</span>
                          <span className="text-[10px] text-slate-500">{r.description}</span>
                        </div>
                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded border ${
                          r.severity === "VERY HIGH"
                            ? "bg-rose-50 text-rose-700 border-rose-100"
                            : r.severity === "HIGH"
                            ? "bg-orange-50 text-orange-700 border-orange-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {r.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleDeleteVendorClick(selectedVendorDetail.id, selectedVendorDetail.name)}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
              >
                Delete Vendor
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedVendorDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEditVendor(selectedVendorDetail);
                    setSelectedVendorDetail(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Edit Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD VENDOR RISK MODAL --- */}
      {isVendorRiskModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-sans">Add vendor risk</h3>
                <p className="text-xs text-slate-400 mt-0.5">Record a compliance, data security, or model safety risk.</p>
              </div>
              <button onClick={() => setIsVendorRiskModalOpen(false)} className="text-slate-400 font-semibold">✕</button>
            </div>

            <form onSubmit={handleCreateVendorRisk} className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Risk Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Model safety alignment gap, Data policy mismatch"
                    value={vrName}
                    onChange={(e) => setVrName(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Associated Vendor *</label>
                  <select
                    required
                    value={vrVendorId}
                    onChange={(e) => setVrVendorId(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select a vendor</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Severity</label>
                    <select
                      value={vrSeverity}
                      onChange={(e) => setVrSeverity(e.target.value as any)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="VERY HIGH">VERY HIGH</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mitigation Status</label>
                    <select
                      value={vrMitigationStatus}
                      onChange={(e) => setVrMitigationStatus(e.target.value as any)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                    >
                      <option value="NOT STARTED">NOT STARTED</option>
                      <option value="IN PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Target Date</label>
                  <input
                    type="date"
                    value={vrTargetDate}
                    onChange={(e) => setVrTargetDate(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Risk Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the nature of the security or privacy risk..."
                    value={vrDescription}
                    onChange={(e) => setVrDescription(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVendorRiskModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md cursor-pointer"
                >
                  Add Risk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT TRAINING MODAL --- */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {editingTraining ? `Edit training record (${editingTraining.id})` : "New training record"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Log training certificates for staff literacy proof.</p>
              </div>
              <button onClick={() => { setIsTrainingModalOpen(false); setEditingTraining(null); }} className="text-slate-400 font-bold hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateTraining} className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Training name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI ethics foundation"
                    value={tName}
                    onChange={(e) => setTName(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 3 hours, 1 day"
                      value={tDur}
                      onChange={(e) => setTDur(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Number of people</label>
                    <input
                      type="number"
                      min={1}
                      value={tPeople}
                      onChange={(e) => setTPeople(parseInt(e.target.value) || 1)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Provider</label>
                    <input
                      type="text"
                      placeholder="e.g. AI Governance, NIST"
                      value={tProv}
                      onChange={(e) => setTProv(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Department</label>
                    <input
                      type="text"
                      placeholder="e.g. Engineering, Sales"
                      value={tDept}
                      onChange={(e) => setTDept(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Status</label>
                  <select
                    value={tStatus}
                    onChange={(e) => setTStatus(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="Planned">Planned</option>
                    <option value="In progress">In progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Syllabus / Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe syllabus outline, target learning outcomes, or compliance standard..."
                    value={tDesc}
                    onChange={(e) => setTDesc(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsTrainingModalOpen(false); setEditingTraining(null); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md cursor-pointer"
                >
                  {editingTraining ? "Save Changes" : "Log Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SELECTED TRAINING DETAIL MODAL --- */}
      {selectedTrainingDetail && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up text-left">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono">
                    {selectedTrainingDetail.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedTrainingDetail.status === "Completed"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : selectedTrainingDetail.status === "In progress"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  }`}>
                    {selectedTrainingDetail.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mt-1">{selectedTrainingDetail.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTrainingDetail(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Duration</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5 block">{selectedTrainingDetail.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Provider</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5 block">{selectedTrainingDetail.provider}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Department</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5 block">{selectedTrainingDetail.department}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Attendees</span>
                  <span className="text-xs font-extrabold text-indigo-600 mt-0.5 block">{selectedTrainingDetail.peopleCount} Staff</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Syllabus & Course Description</h4>
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans">
                  {selectedTrainingDetail.description || "No course syllabus notes logged."}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleDeleteTrainingClick(selectedTrainingDetail.id, selectedTrainingDetail.name)}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Record
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const trToEdit = selectedTrainingDetail;
                    setSelectedTrainingDetail(null);
                    handleOpenEditTraining(trToEdit);
                  }}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Edit Record
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTrainingDetail(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT INCIDENT MODAL --- */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {editingIncident ? `Edit Incident (${editingIncident.id})` : "Add New Incident Record"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Log or update unintended algorithmic outputs, model drift, or bias safety incidents.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsIncidentModalOpen(false);
                  setEditingIncident(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">AI Project Involved *</label>
                  <select
                    value={incProject}
                    onChange={(e) => setIncProject(e.target.value)}
                    required
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.title}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Incident Type *</label>
                  <select
                    value={incType}
                    onChange={(e) => setIncType(e.target.value)}
                    required
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="Bias & discrimination">Bias & discrimination</option>
                    <option value="Unintended output">Unintended output</option>
                    <option value="Data leakage">Data leakage</option>
                    <option value="System breakdown">System breakdown</option>
                    <option value="Model performance drift">Model performance drift</option>
                    <option value="Hallucination">Hallucination</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Severity</label>
                  <select
                    value={incSeverity}
                    onChange={(e) => setIncSeverity(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="MINOR">MINOR</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="SERIOUS">SERIOUS</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Status</label>
                  <select
                    value={incStatus}
                    onChange={(e) => setIncStatus(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="Open">Open</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Mitigated">Mitigated</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Occurred Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Jun 4, 2026"
                    value={incOccurred}
                    onChange={(e) => setIncOccurred(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Approved By / Lead Assessor</label>
                <input
                  type="text"
                  placeholder="e.g. Demo Assessor"
                  value={incApprovedBy}
                  onChange={(e) => setIncApprovedBy(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Incident Narrative & Impact Assessment</label>
                <textarea
                  rows={3}
                  placeholder="Describe the incident narrative, affected pipeline, and observed impact..."
                  value={incDescription}
                  onChange={(e) => setIncDescription(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Root Cause Analysis (RCA)</label>
                  <textarea
                    rows={2}
                    placeholder="Identified root cause..."
                    value={incRootCause}
                    onChange={(e) => setIncRootCause(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Compliance Impact</label>
                  <textarea
                    rows={2}
                    placeholder="ISO / EU AI Act regulatory impact..."
                    value={incImpact}
                    onChange={(e) => setIncImpact(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsIncidentModalOpen(false);
                    setEditingIncident(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-md cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md cursor-pointer"
                >
                  {editingIncident ? "Save Changes" : "Submit Incident Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT POLICY MODAL --- */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingPolicy ? "Edit Organizational Policy" : "Create New Organizational Policy"}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Define governance controls, operational standards, and risk policies for corporate AI adoption.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsPolicyModalOpen(false);
                  setEditingPolicy(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdatePolicy} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Policy Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Generative AI Code Safety & License Governance Policy"
                  value={polTitle}
                  onChange={(e) => setPolTitle(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category / Primary Domain</label>
                  <select
                    value={polCategory}
                    onChange={(e) => {
                      setPolCategory(e.target.value);
                      setPolTag(e.target.value);
                    }}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="Governance">Governance & Compliance</option>
                    <option value="Model Safety">Model Safety & Robustness</option>
                    <option value="Privacy">Data Privacy & Protection</option>
                    <option value="Security">Cybersecurity & Access Control</option>
                    <option value="Ethical AI">Ethical AI & Fairness</option>
                    <option value="Procurement">Third-Party Procurement</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Status</label>
                  <select
                    value={polStatus}
                    onChange={(e) => setPolStatus(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="Published">Published</option>
                    <option value="Under review">Under review</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                    <option value="Deprecated">Deprecated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Owner / Lead Assessor</label>
                  <input
                    type="text"
                    placeholder="e.g. Demo Assessor"
                    value={polOwner}
                    onChange={(e) => setPolOwner(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Active Members / Team</label>
                  <input
                    type="number"
                    min={1}
                    value={polTeamSize}
                    onChange={(e) => setPolTeamSize(Number(e.target.value))}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Next Review Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Dec 31, 2026"
                    value={polNextReview}
                    onChange={(e) => setPolNextReview(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Policy Statement & Regulatory Content
                </label>
                <textarea
                  rows={8}
                  placeholder="Enter policy narrative, operational rules, auditing requirements, and enforcement guidelines..."
                  value={polContent}
                  onChange={(e) => setPolContent(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-3 outline-none focus:border-indigo-500 font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsPolicyModalOpen(false);
                    setEditingPolicy(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-md cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md cursor-pointer"
                >
                  {editingPolicy ? "Save Policy Changes" : "Create Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DETAILED POLICY REVIEW DRAWER / MODAL --- */}
      {selectedPolicyDetail && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    selectedPolicyDetail.status === "Published"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : selectedPolicyDetail.status === "Under review"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}>
                    {selectedPolicyDetail.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedPolicyDetail.id}
                  </span>
                  {selectedPolicyDetail.category && (
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                      {selectedPolicyDetail.category}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedPolicyDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPolicyDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metadata Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 bg-slate-50/70 p-4 my-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Policy Owner</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{selectedPolicyDetail.owner || "Demo Assessor"}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Team</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">{selectedPolicyDetail.teamSize || 1} members</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Last Updated</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block font-mono">{selectedPolicyDetail.lastUpdated}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Next Scheduled Review</span>
                <span className="text-xs font-bold text-indigo-700 mt-0.5 block font-mono">{selectedPolicyDetail.nextReview}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs leading-relaxed border border-slate-800">
              <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800 pb-2 mb-2">
                <span>POLICY STATEMENT & REGULATORY CONTENT</span>
                <span>MD / TEXT FORMAT</span>
              </div>
              <p className="whitespace-pre-wrap">
                {selectedPolicyDetail.content || "Draft policy content outlines continuous compliance audits, model risk validation, and user role entitlements."}
              </p>
            </div>

            {/* Footer Toolbar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPolicyDetail.content || selectedPolicyDetail.title);
                    showGovToast("Policy text copied to clipboard!");
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
                >
                  Copy Text
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([selectedPolicyDetail.content || selectedPolicyDetail.title], { type: "text/plain;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${selectedPolicyDetail.title.replace(/\s+/g, "_")}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download TXT
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const pToEdit = selectedPolicyDetail;
                    setSelectedPolicyDetail(null);
                    handleOpenEditPolicy(pToEdit);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Policy
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePolicyClick(selectedPolicyDetail.id, selectedPolicyDetail.title)}
                  className="px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPolicyDetail(null)}
                  className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- DETAILED INCIDENT RESPONSE PLAYBOOK DRAWER --- */}
      {selectedIncident && (() => {
        const details = getIncidentDetails(selectedIncident.type, selectedIncident.id);
        const notes = incidentNotes[selectedIncident.id] || [];

        const description = selectedIncident.description || details.description;
        const rootCause = selectedIncident.rootCause || details.rootCause;
        const impact = selectedIncident.impact || details.impact;

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50 animate-fade-in text-left">
            <div className="bg-white w-full max-w-3xl h-full flex flex-col justify-between shadow-2xl relative overflow-hidden animate-slide-left">
              
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                      {selectedIncident.id}
                    </span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                      selectedIncident.severity === "CRITICAL"
                        ? "bg-rose-50 text-rose-700 border-rose-100"
                        : selectedIncident.severity === "SERIOUS"
                        ? "bg-red-50 text-red-700 border-red-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                      {selectedIncident.severity} SEVERITY
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800 mt-2">
                    Incident Response Hub
                  </h3>
                  <p className="text-xs text-slate-500">
                    Active response playbook, security assessments, and mitigation controls.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Visual Lifecycle Stepper */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
                    Response Progress Lifecycle
                  </span>
                  <div className="grid grid-cols-4 gap-2 relative">
                    {/* Stepper line */}
                    <div className="absolute top-4 left-[12%] right-[12%] h-[2px] bg-slate-200 -z-0" />
                    
                    {/* Step 1: Open */}
                    <div className="flex flex-col items-center text-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        ["Open", "Investigating", "Mitigated", "Closed"].includes(selectedIncident.status)
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "bg-white border-slate-200 text-slate-400"
                      }`}>
                        ✓
                      </div>
                      <span className="text-[10px] font-bold mt-2 text-slate-700">Reported</span>
                      <span className="text-[8px] text-slate-400 font-mono mt-0.5">{selectedIncident.occurred}</span>
                    </div>

                    {/* Step 2: Investigating */}
                    <div className="flex flex-col items-center text-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        ["Investigating", "Mitigated", "Closed"].includes(selectedIncident.status)
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : selectedIncident.status === "Open"
                          ? "bg-amber-500 border-amber-500 text-white animate-pulse"
                          : "bg-white border-slate-200 text-slate-400"
                      }`}>
                        {["Investigating", "Mitigated", "Closed"].includes(selectedIncident.status) ? "✓" : "2"}
                      </div>
                      <span className="text-[10px] font-bold mt-2 text-slate-700">Triage & Investigation</span>
                      <span className="text-[8px] text-slate-400 mt-0.5">
                        {selectedIncident.status === "Open" ? "Awaiting triage" : "Active"}
                      </span>
                    </div>

                    {/* Step 3: Mitigated */}
                    <div className="flex flex-col items-center text-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        ["Mitigated", "Closed"].includes(selectedIncident.status)
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : selectedIncident.status === "Investigating"
                          ? "bg-amber-500 border-amber-500 text-white animate-pulse"
                          : "bg-white border-slate-200 text-slate-400"
                      }`}>
                        {["Mitigated", "Closed"].includes(selectedIncident.status) ? "✓" : "3"}
                      </div>
                      <span className="text-[10px] font-bold mt-2 text-slate-700">Mitigation</span>
                      <span className="text-[8px] text-slate-400 mt-0.5">
                        {["Mitigated", "Closed"].includes(selectedIncident.status) ? "Mitigated" : "Pending"}
                      </span>
                    </div>

                    {/* Step 4: Closed */}
                    <div className="flex flex-col items-center text-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        selectedIncident.status === "Closed"
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "bg-white border-slate-200 text-slate-400"
                      }`}>
                        {selectedIncident.status === "Closed" ? "✓" : "4"}
                      </div>
                      <span className="text-[10px] font-bold mt-2 text-slate-700">Resolved</span>
                      <span className="text-[8px] text-slate-400 mt-0.5">
                        {selectedIncident.status === "Closed" ? "Closed" : "Pending Approval"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Incident Profiles Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Involved AI Project</span>
                    <span className="text-xs font-bold text-slate-800 block">{selectedIncident.project}</span>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Incident Classification Type</span>
                    <span className="text-xs font-bold text-slate-800 block">{selectedIncident.type}</span>
                  </div>
                </div>

                {/* Incident Narrative details */}
                <div className="space-y-3 bg-slate-50/20 p-5 rounded-xl border border-slate-150">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                    <FileCheck2 className="w-4 h-4" />
                    <span>Incident Narrative & Impact Assessment</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Root Cause Analysis (RCA)</span>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {rootCause}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Compliance Impact</span>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {impact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Safety Remediation Playbook Steps */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    AI safety remediation playbook steps
                  </span>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                    {details.playbookSteps.map((step, idx) => (
                      <div key={idx} className="p-4 flex gap-3 hover:bg-slate-50/30 transition-colors">
                        <div className="pt-0.5">
                          {step.status === "Completed" ? (
                            <div className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-[10px]">
                              ✓
                            </div>
                          ) : step.status === "In Progress" ? (
                            <div className="w-4 h-4 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-[9px] animate-pulse">
                              ⏳
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-[9px]">
                              ○
                            </div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 block">{step.name}</span>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Incident Activity Feed */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Response updates & activity logs
                  </span>
                  
                  {/* Notes Timeline list */}
                  <div className="space-y-3.5 pl-2">
                    {notes.length === 0 ? (
                      <div className="text-slate-400 text-xs italic pl-2">
                        No custom response notes logged yet. Use the action input below to update.
                      </div>
                    ) : (
                      <div className="space-y-3 border-l border-slate-200 pl-4 ml-2">
                        {notes.map((note, nIdx) => (
                          <div key={nIdx} className="relative space-y-1 text-left">
                            {/* Dot */}
                            <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-slate-400 border border-white" />
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-extrabold text-slate-700">{note.author}</span>
                              <span className="text-slate-400 font-mono font-bold">{note.date}</span>
                            </div>
                            <p className="text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                              {note.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add action input */}
                  <div className="flex gap-2.5 pt-2">
                    <input
                      type="text"
                      placeholder="Add an investigation update, playbook logs, or mitigation notes..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddIncidentNote(selectedIncident.id);
                        }
                      }}
                      className="flex-1 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-3 py-2 outline-none focus:bg-white focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddIncidentNote(selectedIncident.id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      Post update
                    </button>
                  </div>
                </div>

              </div>

              {/* Footer Controls */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Update status:</span>
                  <div className="flex gap-1">
                    {["Open", "Investigating", "Mitigated", "Closed"].map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => {
                          if (onUpdateIncidentStatus) {
                            onUpdateIncidentStatus(selectedIncident.id, st as any);
                          } else {
                            onToggleIncidentStatus(selectedIncident.id);
                          }
                          setSelectedIncident((prev) => prev ? { ...prev, status: st as any } : null);
                        }}
                        className={`px-2 py-1 text-[9px] font-extrabold rounded-md border transition-all cursor-pointer ${
                          selectedIncident.status === st
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs animate-none"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {st.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteIncidentClick(selectedIncident.id, selectedIncident.project)}
                    className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const incToEdit = selectedIncident;
                      handleOpenEditIncident(incToEdit);
                    }}
                    className="px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Record
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIncident(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                  >
                    Close Workspace
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Floating Action Toast Notification */}
      {governanceToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-scale-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{governanceToast}</span>
        </div>
      )}

    </div>
  );
}
