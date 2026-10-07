import React, { useState, useEffect, useMemo } from "react";
import {
  Layers,
  LayoutDashboard,
  ClipboardList,
  FolderOpen,
  FolderKanban,
  FileCheck,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  Users,
  CreditCard,
  Search,
  Bell,
  HelpCircle,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  X,
  Check,
  Info,
  FileCheck2,
  FileText,
  UserPlus,
  ArrowRight,
  Briefcase,
  BookOpen,
  Award,
  Palette,
  Zap,
  Stamp,
  Building2,
  Cloud,
  CheckSquare
} from "lucide-react";

// Import types & seed data
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
  OrganizationalPolicy,
  IncidentRecord,
  TeamMember,
  FrameworkClause,
  ControlRequirement
} from "./types";

import {
  INITIAL_WORKSPACES,
  INITIAL_TEAM,
  INITIAL_FOLDERS,
  INITIAL_EVIDENCE,
  INITIAL_PROJECTS,
  INITIAL_MODELS,
  INITIAL_RISKS,
  INITIAL_REPORTS,
  INITIAL_VENDORS,
  INITIAL_TRAININGS,
  INITIAL_POLICIES,
  INITIAL_INCIDENTS,
  ISO_42001_CLAUSES,
  ISO_27001_CLAUSES,
  NIST_AI_RMF_CATEGORIES,
  SOC_2_CLAUSES
} from "./data";

import {
  getProjectChangePayload,
  getModelChangePayload,
  getEvidenceFileChangePayload,
  getRiskChangePayload,
  getVendorChangePayload,
  getPolicyChangePayload,
  getIncidentChangePayload
} from "./utils/auditDiffHelper";

// Import components
import DashboardView from "./components/DashboardView";
import FrameworksView from "./components/FrameworksView";
import InventoryView from "./components/InventoryView";
import RiskAssuranceView from "./components/RiskAssuranceView";
import GovernanceView from "./components/GovernanceView";
import SettingsView from "./components/SettingsView";
import ModelRegistryView from "./components/ModelRegistryView";
import EvidenceFilePreviewModal from "./components/EvidenceFilePreviewModal";
import CertificationSummaryView from "./components/CertificationSummaryView";
import AuditLogsView from "./components/AuditLogsView";
import AuditorPortalView from "./components/AuditorPortalView";
import IntegrationsHubView from "./components/IntegrationsHubView";
import AIComplianceAssessmentModal from "./components/AIComplianceAssessmentModal";
import AIEvidenceAnalyzerModal from "./components/AIEvidenceAnalyzerModal";
import BusinessUnitsView from "./components/BusinessUnitsView";
import AutomatedEvidenceConnectorsView from "./components/AutomatedEvidenceConnectorsView";
import RegulatoryDossierExportModal from "./components/RegulatoryDossierExportModal";
import AboutModal from "./components/AboutModal";
import PersonaSwitcher from "./components/PersonaSwitcher";
import { PersonaType } from "./components/WhatToDoNextBanner";
import ThemeSelectorModal from "./components/ThemeSelectorModal";
import MfaStepUpModal from "./components/MfaStepUpModal";
import SSOAuthModal from "./components/SSOAuthModal";
import UserProfileModal from "./components/UserProfileModal";
import { useAuth } from "./context/AuthContext";
import { dbApi } from "./services/api";
import { applyTheme, getStoredThemeId } from "./utils/theme";
import { sendAuditLog } from "./services/auditLoggerService";

export default function App() {
  const { user, isAuthenticated } = useAuth();
  const [isSSOModalOpen, setIsSSOModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDbSynced, setIsDbSynced] = useState(true);

  // --- MFA Step-Up Security Modal State ---
  const [mfaModalState, setMfaModalState] = useState<{
    isOpen: boolean;
    actionTitle: string;
    onSuccess: () => void;
  }>({
    isOpen: false,
    actionTitle: "",
    onSuccess: () => {}
  });

  const handleOpenMfaStepUp = (actionTitle: string, onSuccess: () => void) => {
    setMfaModalState({
      isOpen: true,
      actionTitle,
      onSuccess
    });
  };
  // --- Color Theme State ---
  const [currentThemeId, setCurrentThemeId] = useState<string>(getStoredThemeId());
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Apply theme on initial load
  useEffect(() => {
    applyTheme(currentThemeId);
  }, []);

  const handleSelectTheme = (themeId: string) => {
    setCurrentThemeId(themeId);
    applyTheme(themeId);
  };

  // Fetch Initial Data from PostgreSQL & Cloud SQL Backend
  useEffect(() => {
    async function loadCloudDbData() {
      try {
        const [cloudProjects, cloudModels, cloudRisks, cloudIncidents, cloudEvidence] = await Promise.allSettled([
          dbApi.getProjects(),
          dbApi.getModels(),
          dbApi.getRisks(),
          dbApi.getIncidents(),
          dbApi.getEvidenceFiles(),
        ]);

        if (cloudProjects.status === "fulfilled" && cloudProjects.value.length > 0) {
          setProjects(cloudProjects.value);
        }
        if (cloudModels.status === "fulfilled" && cloudModels.value.length > 0) {
          setModels(cloudModels.value);
        }
        if (cloudRisks.status === "fulfilled" && cloudRisks.value.length > 0) {
          setRisks(cloudRisks.value);
        }
        if (cloudIncidents.status === "fulfilled" && cloudIncidents.value.length > 0) {
          setIncidents(cloudIncidents.value);
        }
        if (cloudEvidence.status === "fulfilled" && cloudEvidence.value.length > 0) {
          setEvidenceFiles(cloudEvidence.value);
        }
        setIsDbSynced(true);
      } catch (err) {
        console.error("Cloud SQL sync notice:", err);
      }
    }
    loadCloudDbData();
  }, []);

  // --- Persona View State ---
  const [activePersona, setActivePersona] = useState<PersonaType>("CISO");

  // --- About Modal State ---
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // --- AI Assessment & Evidence Audit Modal States ---
  const [selectedAssessmentProject, setSelectedAssessmentProject] = useState<AIProject | null>(null);
  const [selectedAuditEvidenceFile, setSelectedAuditEvidenceFile] = useState<EvidenceFile | null>(null);
  const [isDossierExportModalOpen, setIsDossierExportModalOpen] = useState(false);
  const [appToast, setAppToast] = useState<string | null>(null);

  const showAppToast = (msg: string) => {
    setAppToast(msg);
    setTimeout(() => setAppToast(null), 3500);
  };

  // --- Workspace states ---
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(INITIAL_WORKSPACES[0]);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  // --- Main Navigation Page Selection ---
  // Options: "dashboard" | "frameworks" | "projects" | "models" | "risks" | "evidence" | "reports" | "vendors" | "trainings" | "policies" | "incidents" | "team" | "billing"
  const [activePage, setActivePage] = useState<string>("dashboard");

  // --- Global entities states ---
  const [projects, setProjects] = useState<AIProject[]>(INITIAL_PROJECTS);
  const [models, setModels] = useState<ModelRecord[]>(INITIAL_MODELS);
  const [risks, setRisks] = useState<RiskRecord[]>(INITIAL_RISKS);
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>(INITIAL_EVIDENCE);
  const [reports, setReports] = useState<ComplianceReport[]>(INITIAL_REPORTS);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [trainings, setTrainings] = useState<TrainingRecord[]>(INITIAL_TRAININGS);
  const [policies, setPolicies] = useState<OrganizationalPolicy[]>(INITIAL_POLICIES);
  const [incidents, setIncidents] = useState<IncidentRecord[]>(INITIAL_INCIDENTS);
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);

  // Computed workspace-isolated filtered datasets
  const activeProjects = useMemo(() => projects.filter(p => (p.workspaceId || "ws-1") === activeWorkspace.id), [projects, activeWorkspace.id]);
  const activeModels = useMemo(() => models.filter(m => (m.workspaceId || "ws-1") === activeWorkspace.id), [models, activeWorkspace.id]);
  const activeRisks = useMemo(() => risks.filter(r => (r.workspaceId || "ws-1") === activeWorkspace.id), [risks, activeWorkspace.id]);
  const activeEvidenceFiles = useMemo(() => evidenceFiles.filter(e => (e.workspaceId || "ws-1") === activeWorkspace.id), [evidenceFiles, activeWorkspace.id]);
  const activeFolders = useMemo(() => folders.filter(f => (f.workspaceId || "ws-1") === activeWorkspace.id || f.id.startsWith("fld-")), [folders, activeWorkspace.id]);
  const activeReports = useMemo(() => reports.filter(r => (r.workspaceId || "ws-1") === activeWorkspace.id), [reports, activeWorkspace.id]);
  const activeVendors = useMemo(() => vendors.filter(v => (v.workspaceId || "ws-1") === activeWorkspace.id), [vendors, activeWorkspace.id]);
  const activeTrainings = useMemo(() => trainings.filter(t => (t.workspaceId || "ws-1") === activeWorkspace.id), [trainings, activeWorkspace.id]);
  const activePolicies = useMemo(() => policies.filter(p => (p.workspaceId || "ws-1") === activeWorkspace.id), [policies, activeWorkspace.id]);
  const activeIncidents = useMemo(() => incidents.filter(i => (i.workspaceId || "ws-1") === activeWorkspace.id), [incidents, activeWorkspace.id]);
  const activeTeam = useMemo(() => team.filter(t => (t.workspaceId || "ws-1") === activeWorkspace.id), [team, activeWorkspace.id]);

  // Framework clauses local states (to calculate progress dynamically!)
  const [iso42001Clauses, setIso42001Clauses] = useState<FrameworkClause[]>(ISO_42001_CLAUSES);
  const [iso27001Clauses, setIso27001Clauses] = useState<FrameworkClause[]>(ISO_27001_CLAUSES);
  const [nistCategories, setNistCategories] = useState<FrameworkClause[]>(NIST_AI_RMF_CATEGORIES);
  const [soc2Clauses, setSoc2Clauses] = useState<FrameworkClause[]>(SOC_2_CLAUSES);

  // --- UI Elements ---
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isAmbassadorBannerVisible, setIsAmbassadorBannerVisible] = useState(true);
  const [previewEvidenceFile, setPreviewEvidenceFile] = useState<EvidenceFile | null>(null);

  // --- Compliance Notifications State & Calculations ---
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [dismissedNotifIds, setDismissedNotifIds] = useState<string[]>([]);
  const [readNotifIds, setReadNotifIds] = useState<string[]>([]);

  const notifications = useMemo(() => {
    const list: Array<{
      id: string;
      type: "incident" | "risk" | "model" | "policy" | "system";
      title: string;
      message: string;
      timestamp: string;
      severity: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
      targetPage: string;
    }> = [];

    // 1. Incidents
    activeIncidents.filter(i => i.status !== "Closed").forEach(inc => {
      list.push({
        id: `notif-inc-${inc.id}`,
        type: "incident",
        title: `Open Incident: ${inc.type}`,
        message: `Incident logged for "${inc.project}". Status: ${inc.status}`,
        timestamp: inc.occurred || "Recently",
        severity: inc.severity === "SERIOUS" || inc.severity === "CRITICAL" ? "CRITICAL" : "HIGH",
        targetPage: "incidents"
      });
    });

    // 2. Pending models
    activeModels.filter(m => m.status === "Pending").forEach(m => {
      list.push({
        id: `notif-mod-${m.id}`,
        type: "model",
        title: `Model Review Required`,
        message: `${m.provider} ${m.name} v${m.version} is pending security review.`,
        timestamp: m.statusDate || "Recently",
        severity: "MEDIUM",
        targetPage: "models"
      });
    });

    // 3. High risks
    activeRisks.filter(r => r.severity === "HIGH" || r.severity === "VERY HIGH" || r.severity === "MAJOR").forEach(r => {
      list.push({
        id: `notif-risk-${r.id}`,
        type: "risk",
        title: `${r.severity} Risk Alert`,
        message: `${r.name} — ${r.mitigationStatus}`,
        timestamp: "Active",
        severity: "HIGH",
        targetPage: "risks"
      });
    });

    // 4. System / Audit status
    list.push({
      id: `notif-sys-${activeWorkspace.id}`,
      type: "system",
      title: `ISO 27001 SIEM Active`,
      message: `Audit log hashing is active for ${activeWorkspace.name}.`,
      timestamp: "Live",
      severity: "INFO",
      targetPage: "audit_logs"
    });

    return list.filter(n => !dismissedNotifIds.includes(n.id));
  }, [activeIncidents, activeModels, activeRisks, activeWorkspace, dismissedNotifIds]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readNotifIds.includes(n.id)).length;
  }, [notifications, readNotifIds]);

  // Helper formula to compute progress rating based on status of clauses
  const calculateProgressRating = (clauses: FrameworkClause[]) => {
    let total = 0;
    let completed = 0;
    clauses.forEach((c) => {
      c.requirements.forEach((r) => {
        total++;
        if (r.status === "Implemented") completed++;
        else if (r.status === "In progress") completed += 0.5;
      });
    });
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const iso42001Progress = calculateProgressRating(iso42001Clauses);
  const iso27001Progress = calculateProgressRating(iso27001Clauses);
  const nistProgress = calculateProgressRating(nistCategories);
  const soc2Progress = calculateProgressRating(soc2Clauses);

  // Update requirement inside a framework clause dynamically
  const handleSaveRequirement = (
    frameworkId: "iso-27001" | "iso-42001" | "nist-ai-rmf" | "soc-2",
    clauseId: string,
    reqId: string,
    updated: Partial<ControlRequirement>
  ) => {
    const updateClauseInArray = (arr: FrameworkClause[]) => {
      return arr.map((clause) => {
        if (clause.id !== clauseId) return clause;
        return {
          ...clause,
          requirements: clause.requirements.map((req) => {
            if (req.id !== reqId) return req;
            return {
              ...req,
              ...updated
            };
          })
        };
      });
    };

    if (frameworkId === "iso-42001") {
      setIso42001Clauses(prev => updateClauseInArray(prev));
    } else if (frameworkId === "iso-27001") {
      setIso27001Clauses(prev => updateClauseInArray(prev));
    } else if (frameworkId === "soc-2") {
      setSoc2Clauses(prev => updateClauseInArray(prev));
    } else {
      setNistCategories(prev => updateClauseInArray(prev));
    }

    sendAuditLog({
      action: "FRAMEWORK_REQUIREMENT_UPDATED",
      isoControl: "A.18.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "FRAMEWORK_REQUIREMENT", id: reqId, name: `${frameworkId.toUpperCase()} Clause ${clauseId} (${reqId})` },
      details: {
        section: "Framework Compliance Matrix",
        framework: frameworkId,
        clauseId,
        requirementId: reqId,
        updatedFields: updated
      }
    });
  };

  // State Modifiers
  const handleAddProject = (p: AIProject) => {
    setProjects(prev => [p, ...prev]);
    dbApi.saveProject(p).catch(err => console.error("Cloud DB save error:", err));
    sendAuditLog({
      action: "PROJECT_CREATED",
      isoControl: "A.8.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "PROJECT", id: p.id, name: p.title },
      details: {
        section: "AI Projects Register",
        project: p.title,
        projectId: p.id,
        owner: p.owner,
        geography: p.geography,
        status: p.status,
        riskClassification: p.riskClassification,
        framework: p.framework,
        goal: p.goal,
        targetIndustry: p.targetIndustry
      }
    });
  };

  const handleUpdateProject = (updated: AIProject) => {
    const existing = projects.find(p => p.id === updated.id);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    dbApi.saveProject(updated).catch(err => console.error("Cloud DB update error:", err));
    const details = getProjectChangePayload(updated, existing);
    sendAuditLog({
      action: details.hasApprovalChange ? "PROJECT_APPROVAL_SECTION_UPDATED" : "PROJECT_UPDATED",
      isoControl: details.hasApprovalChange ? "A.18.1.1" : "A.12.1.2",
      category: "GOVERNANCE",
      targetResource: { type: "PROJECT", id: updated.id, name: updated.title },
      details
    });
  };

  const handleDeleteProject = (id: string) => {
    const proj = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    dbApi.deleteProject(id).catch(err => console.error("Cloud DB delete error:", err));
    sendAuditLog({
      action: "PROJECT_DELETED",
      isoControl: "A.8.1.1",
      category: "GOVERNANCE",
      severity: "WARN",
      targetResource: { type: "PROJECT", id, name: proj?.title || id },
      details: {
        section: "AI Projects Register",
        project: proj?.title || id,
        projectId: id,
        deletedBy: "CISO"
      }
    });
  };

  const handleAddModel = (m: ModelRecord) => {
    setModels(prev => [m, ...prev]);
    dbApi.saveModel(m).catch(err => console.error("Cloud DB save model error:", err));
    sendAuditLog({
      action: "MODEL_REGISTERED",
      isoControl: "A.8.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "MODEL", id: m.id, name: m.name },
      details: {
        section: "Model Registry",
        modelName: m.name,
        modelId: m.id,
        version: m.version,
        provider: m.provider,
        status: m.status,
        approver: m.approver,
        useCasesCount: m.useCasesCount
      }
    });
  };

  const handleBatchAddModels = (newModels: ModelRecord[], mode: "merge" | "overwrite" | "append" = "merge") => {
    setModels(prev => {
      if (mode === "overwrite") {
        return newModels;
      }
      if (mode === "append") {
        return [...newModels, ...prev];
      }
      // merge mode
      const updated = [...prev];
      for (const nm of newModels) {
        const idx = updated.findIndex(m => m.id === nm.id || (m.name.toLowerCase() === nm.name.toLowerCase() && m.provider.toLowerCase() === nm.provider.toLowerCase()));
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], ...nm };
        } else {
          updated.unshift(nm);
        }
      }
      return updated;
    });

    dbApi.batchImportModels(newModels, mode).catch(err => console.error("Cloud DB batch models error:", err));

    sendAuditLog({
      action: "MODELS_BATCH_IMPORTED",
      isoControl: "A.8.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "MODEL", id: "batch", name: `${newModels.length} Market Models` },
      details: {
        importedCount: newModels.length,
        mode,
        source: "Continuous GRC Market Scanner"
      }
    });
    showAppToast(`Batch synchronized ${newModels.length} models into registry`);
  };

  const handleUpdateModel = (updated: ModelRecord) => {
    const existing = models.find(m => m.id === updated.id);
    setModels(prev => prev.map(m => m.id === updated.id ? updated : m));
    dbApi.saveModel(updated).catch(err => console.error("Cloud DB update model error:", err));
    const details = getModelChangePayload(updated, existing);
    sendAuditLog({
      action: details.hasApprovalChange ? "MODEL_APPROVAL_UPDATED" : "MODEL_REGISTRY_UPDATED",
      isoControl: "A.12.1.2",
      category: "GOVERNANCE",
      targetResource: { type: "MODEL", id: updated.id, name: updated.name },
      details
    });
  };

  const handleDeleteModel = (id: string) => {
    const mod = models.find(m => m.id === id);
    setModels(prev => prev.filter(m => m.id !== id));
    dbApi.deleteModel(id).catch(err => console.error("Cloud DB delete model error:", err));
    sendAuditLog({
      action: "MODEL_DELETED",
      isoControl: "A.8.1.1",
      category: "GOVERNANCE",
      severity: "WARN",
      targetResource: { type: "MODEL", id, name: mod?.name || id },
      details: {
        section: "Model Registry",
        modelName: mod?.name || id,
        modelId: id
      }
    });
  };

  const handleAddRisk = (r: RiskRecord) => {
    setRisks(prev => [r, ...prev]);
    dbApi.saveRisk(r).catch(err => console.error("Cloud DB save risk error:", err));
    sendAuditLog({
      action: "RISK_ENTRY_CREATED",
      isoControl: "A.12.1.2",
      category: "RISK_MGMT",
      severity: "WARN",
      targetResource: { type: "RISK", id: r.id, name: r.name },
      details: {
        section: "Risk Register",
        riskName: r.name,
        riskId: r.id,
        severity: r.severity,
        riskLevel: r.riskLevel,
        mitigationStatus: r.mitigationStatus,
        owner: r.owner,
        targetDate: r.targetDate
      }
    });
  };

  const handleUpdateRisk = (updated: RiskRecord) => {
    const existing = risks.find(r => r.id === updated.id);
    setRisks(prev => prev.map(r => r.id === updated.id ? updated : r));
    dbApi.saveRisk(updated).catch(err => console.error("Cloud DB update risk error:", err));
    const details = getRiskChangePayload(updated, existing);
    sendAuditLog({
      action: details.hasApprovalChange ? "RISK_APPROVAL_UPDATED" : "RISK_ENTRY_UPDATED",
      isoControl: "A.12.1.2",
      category: "RISK_MGMT",
      severity: "WARN",
      targetResource: { type: "RISK", id: updated.id, name: updated.name },
      details
    });
  };

  const handleDeleteRisk = (id: string) => {
    const rsk = risks.find(r => r.id === id);
    setRisks(prev => prev.filter(r => r.id !== id));
    dbApi.deleteRisk(id).catch(err => console.error("Cloud DB delete risk error:", err));
    sendAuditLog({
      action: "RISK_ENTRY_DELETED",
      isoControl: "A.12.1.2",
      category: "RISK_MGMT",
      severity: "WARN",
      targetResource: { type: "RISK", id, name: rsk?.name || id },
      details: {
        section: "Risk Register",
        riskName: rsk?.name || id,
        riskId: id
      }
    });
  };

  const handleAddEvidenceFile = (f: EvidenceFile) => {
    setEvidenceFiles(prev => [f, ...prev]);
    dbApi.saveEvidenceFile(f).catch(err => console.error("Cloud DB save evidence error:", err));
    sendAuditLog({
      action: "EVIDENCE_FILE_UPLOADED",
      isoControl: "A.18.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "EVIDENCE_FILE", id: f.id, name: f.name },
      details: {
        section: "Evidence Repository",
        fileName: f.name,
        fileId: f.id,
        uploader: f.uploader,
        uploadDate: f.uploadDate,
        status: f.status,
        folderId: f.folderId
      }
    });
  };

  const handleUpdateEvidenceFile = (updated: EvidenceFile) => {
    const existing = evidenceFiles.find(f => f.id === updated.id);
    setEvidenceFiles(prev => prev.map(f => f.id === updated.id ? updated : f));
    dbApi.saveEvidenceFile(updated).catch(err => console.error("Cloud DB update evidence error:", err));
    const details = getEvidenceFileChangePayload(updated, existing);
    sendAuditLog({
      action: details.hasApprovalChange ? "EVIDENCE_APPROVAL_UPDATED" : "EVIDENCE_FILE_UPDATED",
      isoControl: "A.18.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "EVIDENCE_FILE", id: updated.id, name: updated.name },
      details
    });
  };

  const handleUpdateEvidenceFileStatus = (fileId: string, status: "Draft" | "Approved" | "Under Review") => {
    setEvidenceFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        const updated = { ...f, status };
        dbApi.saveEvidenceFile(updated).catch(err => console.error("Cloud DB status error:", err));
        return updated;
      }
      return f;
    }));
    if (previewEvidenceFile?.id === fileId) {
      setPreviewEvidenceFile(prev => prev ? { ...prev, status } : null);
    }
    const file = evidenceFiles.find(f => f.id === fileId);
    sendAuditLog({
      action: "EVIDENCE_STATUS_CHANGED",
      isoControl: "A.18.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "EVIDENCE_FILE", id: fileId, name: file?.name || fileId },
      details: {
        section: "Evidence Repository",
        fileName: file?.name || fileId,
        fileId,
        newStatus: status
      }
    });
  };

  const handleDeleteEvidenceFile = (id: string) => {
    const file = evidenceFiles.find(f => f.id === id);
    setEvidenceFiles(prev => prev.filter(f => f.id !== id));
    dbApi.deleteEvidenceFile(id).catch(err => console.error("Cloud DB delete evidence error:", err));
    sendAuditLog({
      action: "EVIDENCE_FILE_DELETED",
      isoControl: "A.18.1.1",
      category: "GOVERNANCE",
      severity: "WARN",
      targetResource: { type: "EVIDENCE_FILE", id, name: file?.name || id },
      details: {
        section: "Evidence Repository",
        fileName: file?.name || id,
        fileId: id
      }
    });
  };
  
  const handleAddFolder = (fld: Folder) => {
    setFolders(prev => [...prev, fld]);
    sendAuditLog({
      action: "EVIDENCE_FOLDER_CREATED",
      isoControl: "A.18.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "FOLDER", id: fld.id, name: fld.name },
      details: {
        section: "Evidence Repository",
        folderName: fld.name,
        folderId: fld.id
      }
    });
  };

  const handleDeleteFolder = (id: string) => {
    const fld = folders.find(f => f.id === id);
    setFolders(prev => prev.filter(f => f.id !== id));
    sendAuditLog({
      action: "EVIDENCE_FOLDER_DELETED",
      isoControl: "A.18.1.1",
      category: "GOVERNANCE",
      severity: "WARN",
      targetResource: { type: "FOLDER", id, name: fld?.name || id },
      details: {
        section: "Evidence Repository",
        folderName: fld?.name || id,
        folderId: id
      }
    });
  };
  
  const handleGenerateReport = (rep: ComplianceReport) => {
    setReports(prev => [rep, ...prev]);
    sendAuditLog({
      action: "COMPLIANCE_REPORT_GENERATED",
      isoControl: "A.18.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "REPORT", id: rep.id, name: rep.title },
      details: {
        section: "Compliance Reports & Certification",
        reportTitle: rep.title,
        reportId: rep.id,
        program: rep.program,
        reportType: rep.type,
        format: rep.format,
        created: rep.created
      }
    });
  };

  const handleAddVendor = (v: Vendor) => {
    setVendors(prev => [v, ...prev]);
    sendAuditLog({
      action: "VENDOR_CREATED",
      isoControl: "A.15.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "VENDOR", id: v.id, name: v.name },
      details: {
        section: "Vendor Risk Assessment",
        vendorName: v.name,
        vendorId: v.id,
        website: v.website,
        projects: v.projects,
        reviewStatus: v.reviewStatus,
        score: v.score,
        assignee: v.assignee,
        reviewDate: v.reviewDate
      }
    });
  };

  const handleUpdateVendor = (updated: Vendor) => {
    const existing = vendors.find(v => v.id === updated.id);
    setVendors(prev => prev.map(v => v.id === updated.id ? updated : v));
    const details = getVendorChangePayload(updated, existing);
    sendAuditLog({
      action: details.hasApprovalChange ? "VENDOR_APPROVAL_UPDATED" : "VENDOR_UPDATED",
      isoControl: "A.15.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "VENDOR", id: updated.id, name: updated.name },
      details
    });
  };

  const handleDeleteVendor = (id: string) => {
    const v = vendors.find(item => item.id === id);
    setVendors(prev => prev.filter(item => item.id !== id));
    sendAuditLog({
      action: "VENDOR_DELETED",
      isoControl: "A.15.1.1",
      category: "GOVERNANCE",
      severity: "WARN",
      targetResource: { type: "VENDOR", id, name: v?.name || id },
      details: {
        section: "Vendor Risk Assessment",
        vendorName: v?.name || id,
        vendorId: id
      }
    });
  };

  const handleAddTraining = (t: TrainingRecord) => {
    setTrainings(prev => [t, ...prev]);
    sendAuditLog({
      action: "TRAINING_RECORD_ADDED",
      isoControl: "A.7.2.2",
      category: "GOVERNANCE",
      targetResource: { type: "TRAINING", id: t.id, name: t.name },
      details: {
        section: "Training & Awareness",
        moduleName: t.name,
        trainingId: t.id,
        duration: t.duration,
        provider: t.provider,
        department: t.department,
        status: t.status,
        peopleCount: t.peopleCount
      }
    });
  };

  const handleUpdateTraining = (updated: TrainingRecord) => {
    setTrainings(prev => prev.map(t => t.id === updated.id ? updated : t));
    sendAuditLog({
      action: "TRAINING_RECORD_UPDATED",
      isoControl: "A.7.2.2",
      category: "GOVERNANCE",
      targetResource: { type: "TRAINING", id: updated.id, name: updated.name },
      details: {
        section: "Training & Awareness",
        moduleName: updated.name,
        trainingId: updated.id,
        duration: updated.duration,
        provider: updated.provider,
        department: updated.department,
        status: updated.status,
        peopleCount: updated.peopleCount
      }
    });
  };

  const handleDeleteTraining = (id: string) => {
    const t = trainings.find(item => item.id === id);
    setTrainings(prev => prev.filter(item => item.id !== id));
    sendAuditLog({
      action: "TRAINING_RECORD_DELETED",
      isoControl: "A.7.2.2",
      category: "GOVERNANCE",
      severity: "WARN",
      targetResource: { type: "TRAINING", id, name: t?.name || id },
      details: {
        section: "Training & Awareness",
        moduleName: t?.name || id,
        trainingId: id
      }
    });
  };
  
  const handleAddPolicy = (p: OrganizationalPolicy) => {
    setPolicies(prev => [p, ...prev]);
    sendAuditLog({
      action: "POLICY_CREATED",
      isoControl: "A.5.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "POLICY", id: p.id, name: p.title },
      details: {
        section: "Policy Governance",
        policyTitle: p.title,
        policyId: p.id,
        category: p.category,
        owner: p.owner,
        status: p.status,
        lastUpdated: p.lastUpdated,
        nextReview: p.nextReview
      }
    });
  };

  const handleUpdatePolicy = (updated: OrganizationalPolicy) => {
    const existing = policies.find(p => p.id === updated.id);
    setPolicies(prev => prev.map(p => p.id === updated.id ? updated : p));
    const details = getPolicyChangePayload(updated, existing);
    sendAuditLog({
      action: details.hasApprovalChange ? "POLICY_APPROVAL_UPDATED" : "POLICY_UPDATED",
      isoControl: "A.5.1.1",
      category: "GOVERNANCE",
      targetResource: { type: "POLICY", id: updated.id, name: updated.title },
      details
    });
  };

  const handleDeletePolicy = (id: string) => {
    const p = policies.find(item => item.id === id);
    setPolicies(prev => prev.filter(item => item.id !== id));
    sendAuditLog({
      action: "POLICY_DELETED",
      isoControl: "A.5.1.1",
      category: "GOVERNANCE",
      severity: "WARN",
      targetResource: { type: "POLICY", id, name: p?.title || id },
      details: {
        section: "Policy Governance",
        policyTitle: p?.title || id,
        policyId: id
      }
    });
  };

  const handleAddIncident = (inc: IncidentRecord) => {
    setIncidents(prev => [inc, ...prev]);
    sendAuditLog({
      action: "INCIDENT_REPORTED",
      isoControl: "A.16.1.1",
      category: "SECURITY",
      severity: inc.severity === "CRITICAL" ? "CRITICAL" : inc.severity === "SERIOUS" ? "ERROR" : "WARN",
      targetResource: { type: "INCIDENT", id: inc.id, name: `${inc.type} - ${inc.project}` },
      details: {
        section: "Incident Response",
        project: inc.project,
        incidentId: inc.id,
        type: inc.type,
        severity: inc.severity,
        status: inc.status,
        occurred: inc.occurred,
        approvedBy: inc.approvedBy
      }
    });
  };

  const handleToggleIncidentStatus = (id: string) => {
    let newStatus = "";
    setIncidents(prev => prev.map((inc) => {
      if (inc.id !== id) return inc;
      newStatus = inc.status === "Closed" ? "Open" : "Closed";
      return {
        ...inc,
        status: newStatus as any
      };
    }));
    const inc = incidents.find(item => item.id === id);
    sendAuditLog({
      action: "INCIDENT_STATUS_TOGGLED",
      isoControl: "A.16.1.1",
      category: "SECURITY",
      severity: "WARN",
      targetResource: { type: "INCIDENT", id, name: inc ? `${inc.type} - ${inc.project}` : id },
      details: {
        section: "Incident Response",
        project: inc?.project || "General",
        incidentId: id,
        type: inc?.type,
        newStatus
      }
    });
  };

  const handleUpdateIncidentStatus = (id: string, status: "Open" | "Investigating" | "Mitigated" | "Closed") => {
    setIncidents(prev => prev.map((inc) => {
      if (inc.id !== id) return inc;
      return {
        ...inc,
        status
      };
    }));
    const inc = incidents.find(item => item.id === id);
    sendAuditLog({
      action: "INCIDENT_STATUS_UPDATED",
      isoControl: "A.16.1.1",
      category: "SECURITY",
      severity: status === "Closed" ? "INFO" : "WARN",
      targetResource: { type: "INCIDENT", id, name: inc ? `${inc.type} - ${inc.project}` : id },
      details: {
        section: "Incident Response",
        project: inc?.project || "General",
        incidentId: id,
        type: inc?.type,
        newStatus: status
      }
    });
  };

  const handleUpdateIncident = (updated: IncidentRecord) => {
    const existing = incidents.find(inc => inc.id === updated.id);
    setIncidents(prev => prev.map(inc => inc.id === updated.id ? updated : inc));
    const details = getIncidentChangePayload(updated, existing);
    sendAuditLog({
      action: details.hasApprovalChange ? "INCIDENT_APPROVAL_UPDATED" : "INCIDENT_UPDATED",
      isoControl: "A.16.1.1",
      category: "SECURITY",
      targetResource: { type: "INCIDENT", id: updated.id, name: `${updated.type} - ${updated.project}` },
      details
    });
  };

  const handleDeleteIncident = (id: string) => {
    const inc = incidents.find(item => item.id === id);
    setIncidents(prev => prev.filter(inc => inc.id !== id));
    sendAuditLog({
      action: "INCIDENT_DELETED",
      isoControl: "A.16.1.1",
      category: "SECURITY",
      severity: "WARN",
      targetResource: { type: "INCIDENT", id, name: inc ? `${inc.type} - ${inc.project}` : id },
      details: {
        section: "Incident Response",
        project: inc?.project || "General",
        incidentId: id,
        type: inc?.type
      }
    });
  };

  const handleAddMember = (m: TeamMember) => {
    setTeam(prev => [...prev, m]);
    sendAuditLog({
      action: "USER_ACCESS_GRANTED",
      isoControl: "A.9.2.2",
      category: "ACCESS_CONTROL",
      targetResource: { type: "USER", id: m.id, name: m.name },
      details: {
        section: "Team Access Control",
        memberName: m.name,
        memberId: m.id,
        email: m.email,
        role: m.role,
        joinedDate: m.joinedDate
      }
    });
  };

  const handleRemoveMember = (id: string) => {
    const m = team.find(item => item.id === id);
    setTeam(prev => prev.filter(t => t.id !== id));
    sendAuditLog({
      action: "USER_ACCESS_REVOKED",
      isoControl: "A.9.2.6",
      category: "ACCESS_CONTROL",
      severity: "WARN",
      targetResource: { type: "USER", id, name: m?.name || id },
      details: {
        section: "Team Access Control",
        memberName: m?.name || id,
        memberId: id,
        email: m?.email
      }
    });
  };

  const handleUpdateMemberRole = (id: string, newRole: "Admin" | "Editor" | "Reviewer" | "Auditor") => {
    const m = team.find(item => item.id === id);
    setTeam(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    sendAuditLog({
      action: "USER_ROLE_CHANGED",
      isoControl: "A.9.2.3",
      category: "ACCESS_CONTROL",
      severity: "WARN",
      targetResource: { type: "USER", id, name: m?.name || id },
      details: {
        section: "Team Access Control",
        memberName: m?.name || id,
        memberId: id,
        previousRole: m?.role,
        newRole
      }
    });
  };

  const handleUpdateMember = (updated: TeamMember) => {
    setTeam(prev => prev.map(m => m.id === updated.id ? updated : m));
    sendAuditLog({
      action: "USER_PROFILE_UPDATED",
      isoControl: "A.9.2.1",
      category: "ACCESS_CONTROL",
      targetResource: { type: "USER", id: updated.id, name: updated.name },
      details: {
        section: "Team Access Control",
        memberName: updated.name,
        memberId: updated.id,
        email: updated.email,
        role: updated.role,
        joinedDate: updated.joinedDate
      }
    });
  };

  // Switch Active Workspace
  const handleSelectWorkspace = (ws: Workspace) => {
    setActiveWorkspace(ws);
    setIsWorkspaceMenuOpen(false);
    sendAuditLog({
      action: "WORKSPACE_SWITCHED",
      isoControl: "A.9.1.2",
      category: "ACCESS_CONTROL",
      targetResource: { type: "WORKSPACE", id: ws.id, name: ws.name },
      details: {
        section: "Workspaces Management",
        workspaceName: ws.name,
        workspaceId: ws.id,
        role: ws.role
      }
    });
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName) return;

    const newWS: Workspace = {
      id: `ws-${workspaces.length + 1}`,
      name: newWorkspaceName,
      role: "Admin",
      email: "assessor@demo.com"
    };

    // Seed initial starter datasets for the new workspace so it's fully functional out of the box
    const starterProject: AIProject = {
      id: `UC-${newWS.id}-1`,
      workspaceId: newWS.id,
      title: `${newWS.name} Core AI Initiative`,
      owner: "Demo Assessor",
      status: "In progress",
      geography: "Global",
      riskClassification: "Limited",
      roleType: "Provider",
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      framework: "ISO 42001",
      teamMembers: ["Demo Assessor"],
      goal: `Implement responsible AI controls for ${newWS.name}`,
      targetIndustry: "Enterprise Software",
      description: `Primary compliance workspace project for ${newWS.name}.`
    };

    const starterModel: ModelRecord = {
      id: `mod-${newWS.id}-1`,
      workspaceId: newWS.id,
      provider: "Google",
      name: "Gemini 1.5 Pro",
      version: "v1.5",
      status: "Approved",
      approver: "Demo Assessor",
      statusDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      useCasesCount: 1
    };

    const starterPolicy: OrganizationalPolicy = {
      id: `pol-${newWS.id}-1`,
      workspaceId: newWS.id,
      title: `${newWS.name} Responsible AI Governance Policy`,
      status: "Published",
      tags: ["Governance", "Compliance"],
      teamSize: 1,
      nextReview: "31 Dec 2026",
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      content: "Core policy outlining data isolation, audit logging, and risk management standards."
    };

    const starterMember: TeamMember = {
      id: `tm-${newWS.id}-1`,
      workspaceId: newWS.id,
      name: "Demo Assessor",
      email: newWS.email,
      role: "Admin",
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      isYou: true
    };

    setProjects(prev => [starterProject, ...prev]);
    setModels(prev => [starterModel, ...prev]);
    setPolicies(prev => [starterPolicy, ...prev]);
    setTeam(prev => [...prev, starterMember]);

    setWorkspaces([...workspaces, newWS]);
    setActiveWorkspace(newWS);
    setIsNewWorkspaceModalOpen(false);
    setNewWorkspaceName("");
    sendAuditLog({
      action: "WORKSPACE_CREATED",
      isoControl: "A.9.1.2",
      category: "GOVERNANCE",
      targetResource: { type: "WORKSPACE", id: newWS.id, name: newWS.name },
      details: {
        section: "Workspaces Management",
        workspaceName: newWS.name,
        workspaceId: newWS.id,
        role: newWS.role,
        createdBy: newWS.email
      }
    });
  };

  // Get Page Breadcrumbs based on active tab
  const getBreadcrumbs = () => {
    switch (activePage) {
      case "dashboard":
        return ["Workspace", "Dashboard"];
      case "frameworks":
        return ["Workspace", "Frameworks", "Organizational frameworks"];
      case "projects":
        return ["Inventory", "AI Projects Register"];
      case "models":
        return ["Inventory", "Model Registry"];
      case "risks":
        return ["Risk & Assurance", "Risk Register"];
      case "evidence":
        return ["Risk & Assurance", "Evidence & Documents"];
      case "reports":
        return ["Risk & Assurance", "Reporting Hub"];
      case "ca_matrix":
        return ["Risk & Assurance", "C&A Sign-Off Matrix"];
      case "vendors":
        return ["Governance", "Vendor Management"];
      case "trainings":
        return ["Governance", "Training Registry"];
      case "policies":
        return ["Governance", "Policy Center"];
      case "incidents":
        return ["Governance", "Incident Response"];
      case "team":
        return ["Settings", "Team Management"];
      case "billing":
        return ["Settings", "Plan & Billing"];
      case "sso":
      case "security":
        return ["Settings", "Enterprise SSO & SCIM"];
      case "audit_logs":
      case "siem":
        return ["Settings", "Audit Logs & SIEM"];
      case "themes":
      case "appearance":
        return ["Settings", "Appearance & Color Themes"];
      default:
        return ["Workspace"];
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* Main Core GRC Portal Wrapper */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* SIDEBAR NAVIGATION PANEL (Styled in the Light Professional Polish Theme) */}
        <aside className={`${isSidebarCollapsed ? "w-16" : "w-64"} bg-slate-50 text-slate-600 flex flex-col justify-between select-none border-r border-slate-200 flex-shrink-0 z-30 transition-all duration-300`}>
          
          <div className={`flex flex-col overflow-y-auto max-h-[85vh] py-5 ${isSidebarCollapsed ? "px-2 space-y-4" : "px-4 space-y-6"}`}>
            
            {/* Top Workspace Selector Dropdown Widget */}
            <div className="relative">
              {isSidebarCollapsed ? (
                <div className="flex flex-col items-center gap-2">
                  <div
                    onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                    className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center font-bold text-white text-xs cursor-pointer transition-all shadow-xs"
                    title={`${activeWorkspace.name} (${activeWorkspace.role})`}
                    id="btn-workspace-switcher-collapsed"
                  >
                    G3
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                    title="Expand sidebar"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div
                    onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                    className="flex-1 flex justify-between items-center bg-white hover:bg-slate-100/80 border border-slate-200 p-2.5 rounded-xl cursor-pointer transition-all shadow-xs min-w-0"
                    id="btn-workspace-switcher"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                        G3
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-extrabold text-xs text-slate-900 block truncate leading-snug">
                          {activeWorkspace.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wide mt-0.5">
                          {activeWorkspace.role}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Collapse sidebar"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Workspace dropmenu overlay */}
              {isWorkspaceMenuOpen && (
                <div className={`absolute ${isSidebarCollapsed ? "left-12 top-0 w-52" : "left-0 right-0 mt-2"} bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2 divide-y divide-slate-100 animate-scale-up`}>
                  <div className="px-3 py-1.5 text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                    Your Workspaces
                  </div>
                  <div className="py-1">
                    {workspaces.map((ws) => (
                      <div
                        key={ws.id}
                        onClick={() => handleSelectWorkspace(ws)}
                        className={`px-3 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 cursor-pointer flex items-center justify-between ${
                          activeWorkspace.id === ws.id ? "text-indigo-650 bg-indigo-50/70" : "text-slate-600"
                        }`}
                      >
                        <span className="truncate">{ws.name}</span>
                        {activeWorkspace.id === ws.id && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 px-2">
                    <button
                      onClick={() => {
                        setIsWorkspaceMenuOpen(false);
                        setIsNewWorkspaceModalOpen(true);
                      }}
                      className="w-full text-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                    >
                      + Create new workspace
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Nav Group 1: General */}
            <div className="space-y-1.5">
              {!isSidebarCollapsed ? (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3">General</span>
              ) : (
                <div className="h-px bg-slate-200/80 mx-1 my-1" />
              )}
              <nav className="space-y-0.5">
                <button
                  onClick={() => setActivePage("dashboard")}
                  title="Dashboard"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "dashboard"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-dashboard"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Dashboard</span>}
                </button>
                <button
                  onClick={() => setActivePage("frameworks")}
                  title="Frameworks (4)"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0 relative" : "justify-between px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "frameworks"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-frameworks"
                >
                  <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"}`}>
                    <ClipboardList className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span>Frameworks</span>}
                  </div>
                  {!isSidebarCollapsed ? (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      activePage === "frameworks" ? "bg-indigo-700 text-indigo-100" : "bg-slate-200 text-slate-600"
                    }`}>
                      4
                    </span>
                  ) : (
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
                  )}
                </button>
              </nav>
            </div>

            {/* Nav Group 2: Inventory */}
            <div className="space-y-1.5">
              {!isSidebarCollapsed ? (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3">Inventory</span>
              ) : (
                <div className="h-px bg-slate-200/80 mx-1 my-1" />
              )}
              <nav className="space-y-0.5">
                <button
                  onClick={() => setActivePage("projects")}
                  title="AI Projects"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "projects"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-projects"
                >
                  <FolderKanban className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>AI Projects</span>}
                </button>
                <button
                  onClick={() => setActivePage("models")}
                  title="Model Registry"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "models"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-models"
                >
                  <FileCheck2 className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Model Registry</span>}
                </button>
              </nav>
            </div>

            {/* Nav Group 3: Risk & Assurance */}
            <div className="space-y-1.5">
              {!isSidebarCollapsed ? (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3">Risk & Assurance</span>
              ) : (
                <div className="h-px bg-slate-200/80 mx-1 my-1" />
              )}
              <nav className="space-y-0.5">
                <button
                  onClick={() => setActivePage("risks")}
                  title="Risk Register"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "risks"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-risks"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Risk Register</span>}
                </button>
                <button
                  onClick={() => setActivePage("evidence")}
                  title="Evidence & Documents"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "evidence"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-evidence"
                >
                  <FolderOpen className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Evidence & Documents</span>}
                </button>
                <button
                  onClick={() => setActivePage("connectors")}
                  title="Automated Evidence Connectors"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "connectors"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-connectors"
                >
                  <Cloud className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Evidence Connectors</span>}
                </button>
                <button
                  onClick={() => setActivePage("reports")}
                  title="Reporting Hub"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "reports"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-reports"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Reporting Hub</span>}
                </button>
                <button
                  onClick={() => setActivePage("ca_matrix")}
                  title="C&A Sign-Off Matrix"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "ca_matrix"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-ca-matrix"
                >
                  <Award className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>C&A Sign-Off Matrix</span>}
                </button>
              </nav>
            </div>

            {/* Nav Group 4: Governance */}
            <div className="space-y-1.5">
              {!isSidebarCollapsed ? (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3">Governance</span>
              ) : (
                <div className="h-px bg-slate-200/80 mx-1 my-1" />
              )}
              <nav className="space-y-0.5">
                <button
                  onClick={() => setActivePage("business_units")}
                  title="Business Units & Org Partitioning"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "business_units"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-business-units"
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Business Units &amp; Org</span>}
                </button>
                <button
                  onClick={() => setActivePage("vendors")}
                  title="Vendor Management"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "vendors"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-vendors"
                >
                  <Briefcase className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Vendor Management</span>}
                </button>
                <button
                  onClick={() => setActivePage("trainings")}
                  title="Training Registry"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "trainings"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-trainings"
                >
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Training Registry</span>}
                </button>
                <button
                  onClick={() => setActivePage("policies")}
                  title="Policy Center"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "policies"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-policies"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Policy Center</span>}
                </button>
                <button
                  onClick={() => setActivePage("incidents")}
                  title="Incident Response"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0 relative" : "justify-between px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "incidents"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-incidents"
                >
                  <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"}`}>
                    <AlertOctagon className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span>Incident Response</span>}
                  </div>
                  {!isSidebarCollapsed ? (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      activePage === "incidents" ? "bg-indigo-750 text-indigo-100" : "bg-indigo-100 text-indigo-700"
                    }`}>
                      {incidents.filter(i => i.status === "Open" || i.status === "Investigating").length}
                    </span>
                  ) : (
                    incidents.filter(i => i.status === "Open" || i.status === "Investigating").length > 0 && (
                      <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full" />
                    )
                  )}
                </button>
              </nav>
            </div>

            {/* Nav Group 5: Settings */}
            <div className="space-y-1.5">
              {!isSidebarCollapsed ? (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3">Settings</span>
              ) : (
                <div className="h-px bg-slate-200/80 mx-1 my-1" />
              )}
              <nav className="space-y-0.5">
                <button
                  onClick={() => setActivePage("team")}
                  title="Team Management"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "team"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-team"
                >
                  <Users className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Team Management</span>}
                </button>
                <button
                  onClick={() => setActivePage("billing")}
                  title="Plan & Billing"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "billing"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-billing"
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Plan & Billing</span>}
                </button>
                <button
                  onClick={() => setActivePage("sso")}
                  title="Enterprise SSO & SCIM"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "sso" || activePage === "security"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-sso"
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Enterprise SSO &amp; SCIM</span>}
                </button>
                <button
                  onClick={() => setActivePage("auditor_portal")}
                  title="External Auditor Portal & Guest Access"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "auditor_portal"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-auditor-portal"
                >
                  <Stamp className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Auditor Portal</span>}
                </button>
                <button
                  onClick={() => setActivePage("integrations")}
                  title="CI/CD & Model Registry Integrations"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "integrations"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-integrations"
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>CI/CD &amp; Telemetry Hub</span>}
                </button>
                <button
                  onClick={() => setActivePage("audit_logs")}
                  title="ISO 27001 Audit Logs & SIEM Export"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "audit_logs" || activePage === "siem"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-audit-logs"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Audit Logs &amp; SIEM</span>}
                </button>
                <button
                  onClick={() => setActivePage("themes")}
                  title="Appearance & Color Themes"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePage === "themes" || activePage === "appearance"
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-650/10"
                      : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }`}
                  id="nav-themes"
                >
                  <Palette className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Appearance & Themes</span>}
                </button>
              </nav>
            </div>

            {/* Nav Group 6: Marketing */}
            <div className="space-y-1.5">
              {!isSidebarCollapsed ? (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3">Resources</span>
              ) : (
                <div className="h-px bg-slate-200/80 mx-1 my-1" />
              )}
              <nav className="space-y-0.5">
                <a
                  href="/marketing.html"
                  target="_blank"
                  rel="noreferrer"
                  title="Marketing Page HTML"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg text-xs font-semibold text-indigo-750 hover:bg-indigo-50/70 transition-all cursor-pointer`}
                  id="nav-marketing"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                  {!isSidebarCollapsed && (
                    <span>Marketing Page <span className="text-[9px] font-extrabold bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded shrink-0">HTML</span></span>
                  )}
                </a>
              </nav>
            </div>

          </div>

          {/* Sidebar Footer User Info Indicator */}
          <div className="p-3 border-t border-slate-200 bg-slate-100/60">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} hover:bg-slate-200/60 p-1.5 rounded-xl transition-all text-left cursor-pointer group`}
              title={`${user?.displayName || "Yan Aung"} (${user?.email || "yan.aung@gmail.com"}) - Click to view profile & RBAC`}
              id="btn-sidebar-user-profile"
            >
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-300 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                  {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : "YA"}
                </div>
              )}
              {!isSidebarCollapsed && (
                <div className="overflow-hidden flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {user?.displayName || "Yan Aung"}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {user?.role || "Compliance Lead"}
                  </span>
                </div>
              )}
            </button>
          </div>

        </aside>

        {/* MAIN BODY WRAPPER: TOP HEADER + VIEW SCREEN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Top Global Header (Breadcrumbs, search, notification alerts, feature requests button) */}
          <header className="h-16 bg-white border-b border-slate-150 px-6 flex items-center justify-between gap-6 flex-shrink-0 z-20">
            {/* Left: Sidebar Toggle + Breadcrumbs trail */}
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer"
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                id="btn-toggle-sidebar-header"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
              
              <div className="h-4 w-px bg-slate-200 shrink-0" />

              <div className="flex items-center gap-2 overflow-hidden">
                {getBreadcrumbs().map((b, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-slate-300">/</span>}
                    <span className={idx === getBreadcrumbs().length - 1 ? "text-slate-700 font-bold truncate" : "truncate hidden sm:inline"}>
                      {b}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right Group controls */}
            <div className="flex items-center gap-3">
              
              {/* Persona Switcher Buttons (CISO / Developer / Auditor) */}
              <PersonaSwitcher
                activePersona={activePersona}
                onChangePersona={setActivePersona}
                compact
              />

              {/* Universal Search */}
              <div className="relative hidden xl:block w-52">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Universal search..."
                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              {/* Compliance Notifications Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`p-2 rounded-lg transition-all relative cursor-pointer ${
                    isNotificationsOpen ? "bg-slate-100 text-indigo-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  }`}
                  title="Compliance Notifications"
                  id="btn-notifications-toggle"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 ? (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                      {unreadCount}
                    </span>
                  ) : notifications.length > 0 ? (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-slate-300 rounded-full"></span>
                  ) : null}
                </button>

                {/* Notifications Dropdown Panel */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 animate-scale-up">
                    {/* Header */}
                    <div className="px-4 py-3 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-xs text-slate-800">Compliance Alerts</span>
                        {unreadCount > 0 && (
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={() => setReadNotifIds(notifications.map(n => n.id))}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Body List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400">
                          <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                          <p className="text-xs font-semibold text-slate-600">All compliance controls clear!</p>
                          <p className="text-[10px] text-slate-400 mt-1">No unhandled alerts or pending items for {activeWorkspace.name}.</p>
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const isRead = readNotifIds.includes(notif.id);
                          return (
                            <div
                              key={notif.id}
                              onClick={() => {
                                setReadNotifIds(prev => [...new Set([...prev, notif.id])]);
                                setActivePage(notif.targetPage);
                                setIsNotificationsOpen(false);
                              }}
                              className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                                !isRead ? "bg-indigo-50/30" : ""
                              }`}
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                                  notif.severity === "CRITICAL" ? "bg-rose-100 text-rose-600" :
                                  notif.severity === "HIGH" ? "bg-amber-100 text-amber-600" :
                                  notif.severity === "MEDIUM" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                                }`}>
                                  {notif.type === "incident" && <AlertOctagon className="w-3.5 h-3.5" />}
                                  {notif.type === "risk" && <ShieldAlert className="w-3.5 h-3.5" />}
                                  {notif.type === "model" && <FileCheck2 className="w-3.5 h-3.5" />}
                                  {notif.type === "system" && <ShieldCheck className="w-3.5 h-3.5" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-xs font-bold truncate ${!isRead ? "text-slate-900" : "text-slate-700"}`}>
                                      {notif.title}
                                    </span>
                                    {!isRead && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />}
                                  </div>
                                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                                    {notif.message}
                                  </p>
                                  <span className="text-[9px] font-semibold text-slate-400 mt-1 block">
                                    {notif.timestamp} • Click to review
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDismissedNotifIds(prev => [...prev, notif.id]);
                                }}
                                className="text-slate-300 hover:text-slate-500 p-1 rounded hover:bg-slate-200/50 transition-colors cursor-pointer shrink-0"
                                title="Dismiss notification"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-2 bg-slate-50 flex items-center justify-between border-t border-slate-100 text-[10px] font-semibold text-slate-500 px-3">
                      <button
                        onClick={() => {
                          setActivePage("audit_logs");
                          setIsNotificationsOpen(false);
                        }}
                        className="text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        Audit Trail &amp; SIEM
                      </button>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => setDismissedNotifIds(notifications.map(n => n.id))}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Export Regulatory Dossier Button */}
              <button
                onClick={() => setIsDossierExportModalOpen(true)}
                className="p-2 text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-bold text-xs shadow-2xs"
                title="Export Certification-Grade Regulatory Dossier Package (EU AI Act, NIST AI RMF, ISO 42001)"
                id="btn-export-dossier"
              >
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Export Dossier</span>
              </button>

              {/* AI Compliance Assessment Engine Button */}
              <button
                onClick={() => {
                  const targetProj = activeProjects[0] || INITIAL_PROJECTS[0];
                  setSelectedAssessmentProject(targetProj);
                }}
                className="p-2 text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-bold text-xs shadow-2xs"
                title="Run Instant Gemini AI Compliance & Risk Assessment"
                id="btn-ai-assessment"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">AI Compliance Scorer</span>
              </button>

              {/* Enterprise SSO / User Profile Button */}
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 rounded-lg transition-all cursor-pointer flex items-center gap-2 font-semibold text-xs bg-white shadow-2xs"
                title="Enterprise SSO & Authentication Profile"
                id="btn-header-sso-profile"
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.displayName}
                    className="w-5 h-5 rounded-full object-cover border border-indigo-200"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                    {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : "YA"}
                  </div>
                )}
                <span className="hidden md:inline font-bold text-slate-800">{user?.displayName || "Yan Aung"}</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full hidden lg:inline">
                  SSO
                </span>
              </button>

              {/* Theme Selector Button */}
              <button
                onClick={() => setIsThemeModalOpen(true)}
                className="p-2 text-slate-500 hover:text-pink-600 hover:bg-pink-50 border border-slate-200/80 hover:border-pink-200 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-semibold text-xs bg-white shadow-2xs"
                title="Change Color Theme & Workspace Appearance"
                id="btn-theme-selector"
              >
                <Palette className="w-4 h-4 text-pink-500" />
                <span className="hidden sm:inline">Theme</span>
              </button>

              {/* About Panel Button */}
              <button
                onClick={() => setIsAboutModalOpen(true)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-semibold text-xs bg-white shadow-2xs"
                title="About Software & System Information"
                id="btn-about-software"
              >
                <Info className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">About</span>
              </button>

            </div>
          </header>

          {/* VIEW WORKSPACE STAGED AREA */}
          <div className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
            
            {activePage === "dashboard" && (
              <DashboardView
                projects={activeProjects}
                risks={activeRisks}
                incidents={activeIncidents}
                policies={activePolicies}
                onNavigateToTab={(tab) => setActivePage(tab)}
                iso42001Progress={iso42001Progress}
                iso27001Progress={iso27001Progress}
                nistProgress={nistProgress}
                soc2Progress={soc2Progress}
                activePersona={activePersona}
                onResetLayout={() => {
                  setProjects(INITIAL_PROJECTS);
                  setRisks(INITIAL_RISKS);
                  setIncidents(INITIAL_INCIDENTS);
                  setPolicies(INITIAL_POLICIES);
                  showAppToast("Dashboard layout and default sample entities successfully restored.");
                }}
              />
            )}

             {activePage === "frameworks" && (
              <FrameworksView
                iso42001Clauses={iso42001Clauses}
                iso27001Clauses={iso27001Clauses}
                nistCategories={nistCategories}
                soc2Clauses={soc2Clauses}
                onSaveRequirement={handleSaveRequirement}
                evidenceFiles={activeEvidenceFiles}
                risks={activeRisks}
                team={activeTeam}
                projects={activeProjects}
                models={activeModels}
                onAddEvidenceFile={handleAddEvidenceFile}
                onPreviewFile={setPreviewEvidenceFile}
                onOpenMfaStepUp={handleOpenMfaStepUp}
              />
            )}

            {activePage === "projects" && (
              <InventoryView
                projects={activeProjects}
                models={activeModels}
                initialTab="projects"
                onAddProject={handleAddProject}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
                onAddModel={handleAddModel}
                team={activeTeam}
                evidenceFiles={activeEvidenceFiles}
                onAddEvidenceFile={handleAddEvidenceFile}
                onUpdateEvidenceFile={handleUpdateEvidenceFile}
                folders={activeFolders}
                onPreviewFile={setPreviewEvidenceFile}
                onNavigateToPage={setActivePage}
              />
            )}

            {activePage === "models" && (
              <ModelRegistryView
                models={activeModels}
                onAddModel={handleAddModel}
                onBatchImportModels={handleBatchAddModels}
                onUpdateModel={handleUpdateModel}
                onDeleteModel={handleDeleteModel}
                team={activeTeam}
                workspaceId={activeWorkspace.id}
                onNavigateToPage={setActivePage}
              />
            )}

            {(activePage === "risks" || activePage === "evidence" || activePage === "reports") && (
              <RiskAssuranceView
                activePage={activePage}
                risks={activeRisks}
                onAddRisk={handleAddRisk}
                onUpdateRisk={handleUpdateRisk}
                onDeleteRisk={handleDeleteRisk}
                evidenceFiles={activeEvidenceFiles}
                onAddEvidenceFile={handleAddEvidenceFile}
                folders={activeFolders}
                onAddFolder={handleAddFolder}
                onDeleteFolder={handleDeleteFolder}
                reports={activeReports}
                onGenerateReport={handleGenerateReport}
                projects={activeProjects}
                team={activeTeam}
                models={activeModels}
                policies={activePolicies}
                incidents={activeIncidents}
                vendors={activeVendors}
                onPreviewFile={setPreviewEvidenceFile}
                onDeleteEvidenceFile={handleDeleteEvidenceFile}
              />
            )}

            {activePage === "ca_matrix" && (
              <CertificationSummaryView
                projects={activeProjects}
                onUpdateProject={handleUpdateProject}
                onNavigateToProject={(projId) => {
                  setActivePage("projects");
                }}
              />
            )}

            {(activePage === "vendors" || activePage === "trainings" || activePage === "policies" || activePage === "incidents") && (
              <GovernanceView
                activePage={activePage}
                vendors={activeVendors}
                onAddVendor={handleAddVendor}
                onUpdateVendor={handleUpdateVendor}
                onDeleteVendor={handleDeleteVendor}
                trainings={activeTrainings}
                onAddTraining={handleAddTraining}
                onUpdateTraining={handleUpdateTraining}
                onDeleteTraining={handleDeleteTraining}
                policies={activePolicies}
                onAddPolicy={handleAddPolicy}
                onUpdatePolicy={handleUpdatePolicy}
                onDeletePolicy={handleDeletePolicy}
                incidents={activeIncidents}
                onAddIncident={handleAddIncident}
                onUpdateIncident={handleUpdateIncident}
                onDeleteIncident={handleDeleteIncident}
                onToggleIncidentStatus={handleToggleIncidentStatus}
                onUpdateIncidentStatus={handleUpdateIncidentStatus}
                team={activeTeam}
                projects={activeProjects}
              />
            )}

            {activePage === "connectors" && (
              <AutomatedEvidenceConnectorsView
                onAddEvidenceFile={handleAddEvidenceFile}
                onSendAuditLog={sendAuditLog}
              />
            )}

            {activePage === "business_units" && (
              <BusinessUnitsView
                onSendAuditLog={sendAuditLog}
              />
            )}

            {activePage === "auditor_portal" && (
              <AuditorPortalView
                projects={activeProjects}
                evidenceFiles={activeEvidenceFiles}
                risks={activeRisks}
                activeWorkspaceId={activeWorkspace.id}
              />
            )}

            {activePage === "integrations" && (
              <IntegrationsHubView
                activeWorkspaceId={activeWorkspace.id}
              />
            )}

            {(activePage === "team" || activePage === "billing" || activePage === "themes" || activePage === "appearance" || activePage === "sso" || activePage === "security" || activePage === "audit_logs" || activePage === "siem") && (
              <SettingsView
                team={activeTeam}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                onUpdateMemberRole={handleUpdateMemberRole}
                onUpdateMember={handleUpdateMember}
                activePage={activePage}
                onNavigateToTab={(tab) => setActivePage(tab)}
                currentThemeId={currentThemeId}
                onSelectTheme={handleSelectTheme}
                onOpenMfaStepUp={handleOpenMfaStepUp}
                onSendAuditLog={sendAuditLog}
              />
            )}

          </div>

        </main>
      </div>

      {/* Workspace Creation Dialog Modal (Operational switchers) */}
      {isNewWorkspaceModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-slate-100 font-bold text-xs text-slate-800 bg-slate-50/50">
              Create new workspace
            </div>
            <form onSubmit={handleCreateWorkspace} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Workspace Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme AI Division"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewWorkspaceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                  id="btn-confirm-create-workspace"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewEvidenceFile && (
        <EvidenceFilePreviewModal
          file={previewEvidenceFile}
          folders={folders}
          onClose={() => setPreviewEvidenceFile(null)}
          onUpdateStatus={handleUpdateEvidenceFileStatus}
        />
      )}

      {/* AI Compliance Assessment Modal */}
      {selectedAssessmentProject && (
        <AIComplianceAssessmentModal
          isOpen={!!selectedAssessmentProject}
          onClose={() => setSelectedAssessmentProject(null)}
          project={selectedAssessmentProject}
          onSaveAssessment={(assessment) => {
            handleUpdateProject({
              ...selectedAssessmentProject,
              riskClassification: assessment.overallRiskTier as any
            });
          }}
        />
      )}

      {/* AI Evidence Integrity Analyzer Modal */}
      {selectedAuditEvidenceFile && (
        <AIEvidenceAnalyzerModal
          isOpen={!!selectedAuditEvidenceFile}
          onClose={() => setSelectedAuditEvidenceFile(null)}
          evidence={selectedAuditEvidenceFile}
          onAttachAddenda={(addendaText) => {
            handleUpdateEvidenceFileStatus(selectedAuditEvidenceFile.id, "Approved");
          }}
        />
      )}

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeId={currentThemeId}
        onSelectTheme={handleSelectTheme}
      />

      {/* About System & Software Information Panel */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* MFA Step-Up Security Modal */}
      <MfaStepUpModal
        isOpen={mfaModalState.isOpen}
        onClose={() => setMfaModalState((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={mfaModalState.onSuccess}
        actionTitle={mfaModalState.actionTitle}
      />

      {/* Enterprise SSO & Identity Modal */}
      <SSOAuthModal
        isOpen={isSSOModalOpen}
        onClose={() => setIsSSOModalOpen(false)}
      />

      {/* User Profile & RBAC Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenSSOModal={() => setIsSSOModalOpen(true)}
      />

      {/* Regulatory Export Dossier Package Modal */}
      <RegulatoryDossierExportModal
        isOpen={isDossierExportModalOpen}
        onClose={() => setIsDossierExportModalOpen(false)}
        projects={activeProjects}
        models={activeModels}
        risks={activeRisks}
        evidenceFiles={activeEvidenceFiles}
      />

      {/* Global Application Toast */}
      {appToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-scale-up">
          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{appToast}</span>
        </div>
      )}

    </div>
  );
}
