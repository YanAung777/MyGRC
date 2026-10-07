import React, { useState, useRef, useEffect } from "react";
import {
  List,
  Grid,
  Search,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  BrainCircuit,
  Globe,
  Briefcase,
  Layers,
  Sparkles,
  Calendar,
  X,
  FileCheck,
  Trash2,
  Users,
  Info,
  CheckCircle2,
  Activity,
  FileText,
  UploadCloud,
  Paperclip,
  Eye,
  Server,
  Workflow,
  CheckSquare,
  FileCheck2,
  AlertTriangle,
  Edit3,
  Award,
  ShieldCheck,
  Clock,
  XCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
  ChevronRight,
  ClipboardCheck,
  Printer,
  Image as ImageIcon
} from "lucide-react";
import { AIProject, ModelRecord, TeamMember, EvidenceFile, Folder } from "../types";
import ProjectFormModal, { SECTION_TABS } from "./ProjectFormModal";
import ControlQuestionnairesView from "./ControlQuestionnairesView";
import ComplianceChecklistView from "./ComplianceChecklistView";
import RemediationPlanView from "./RemediationPlanView";
import CertificationSignOffView from "./CertificationSignOffView";
import RiskAssessmentView from "./RiskAssessmentView";
import ControlMatrixView from "./ControlMatrixView";
import ProjectPdfReportModal from "./ProjectPdfReportModal";
import GuidedOnboardingWizardModal from "./GuidedOnboardingWizardModal";
import StepProgressTracker from "./StepProgressTracker";
import CopilotGapDetectionWidget from "./CopilotGapDetectionWidget";
import AIComplianceAssessmentModal from "./AIComplianceAssessmentModal";

interface InventoryViewProps {
  projects: AIProject[];
  models: ModelRecord[];
  onAddProject: (proj: AIProject) => void;
  onUpdateProject: (proj: AIProject) => void;
  onDeleteProject?: (id: string) => void;
  onAddModel: (mod: ModelRecord) => void;
  team: TeamMember[];
  evidenceFiles: EvidenceFile[];
  onAddEvidenceFile: (file: EvidenceFile) => void;
  onUpdateEvidenceFile: (file: EvidenceFile) => void;
  folders: Folder[];
  onPreviewFile?: (file: EvidenceFile) => void;
  onNavigateToPage?: (page: string) => void;
  initialTab?: "projects" | "models";
}

export default function InventoryView({
  projects,
  models,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddModel,
  team,
  evidenceFiles,
  onAddEvidenceFile,
  onUpdateEvidenceFile,
  folders,
  onPreviewFile,
  onNavigateToPage,
  initialTab = "projects"
}: InventoryViewProps) {
  // Tabs: "projects" | "models"
  const [activeTab, setActiveTab] = useState<"projects" | "models">(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Projects display state: "list" | "grid"
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [projectQuery, setProjectQuery] = useState("");
  const [modelQuery, setModelQuery] = useState("");

  // Modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isGuidedWizardOpen, setIsGuidedWizardOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<AIProject | null>(null);
  const [newModelToMap, setNewModelToMap] = useState<string>("");

  // PDF Export Modal State
  const [pdfReportProject, setPdfReportProject] = useState<AIProject | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Model Audit Logs Modal State
  const [selectedModelForLogs, setSelectedModelForLogs] = useState<ModelRecord | null>(null);

  // AI Compliance Audit Engine Modal State
  const [isAiAuditOpen, setIsAiAuditOpen] = useState(false);
  const [aiAuditProject, setAiAuditProject] = useState<AIProject | null>(null);

  const handleOpenAiAudit = (proj: AIProject) => {
    setAiAuditProject(proj);
    setIsAiAuditOpen(true);
  };

  const handleOpenPdfReport = (proj: AIProject) => {
    setPdfReportProject(proj);
    setIsPdfModalOpen(true);
  };

  // Evidence / Documents mapping state
  const [newEvidenceName, setNewEvidenceName] = useState("");
  const [newEvidenceFolder, setNewEvidenceFolder] = useState("fld-uncategorized");
  const [linkExistingFileId, setLinkExistingFileId] = useState("");
  const [inventoryUploadFile, setInventoryUploadFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLinkEvidenceFile = (fileId: string) => {
    if (!selectedProject || !fileId) return;
    const file = evidenceFiles.find(f => f.id === fileId);
    if (file) {
      onUpdateEvidenceFile({
        ...file,
        source: selectedProject.title
      });
      setLinkExistingFileId("");
    }
  };

  const handleUnlinkEvidenceFile = (fileId: string) => {
    if (!selectedProject || !fileId) return;
    const file = evidenceFiles.find(f => f.id === fileId);
    if (file) {
      onUpdateEvidenceFile({
        ...file,
        source: "Not linked"
      });
    }
  };

  const handleAddNewEvidenceFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || (!newEvidenceName.trim() && !inventoryUploadFile)) return;

    const nameToUse = newEvidenceName.trim() || (inventoryUploadFile ? inventoryUploadFile.name : "evidence-document.pdf");

    const newFile: EvidenceFile = {
      id: `EVI-${Date.now()}`,
      name: nameToUse,
      uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      uploader: team[0]?.name || "Demo Assessor",
      source: selectedProject.title,
      version: "v1.0",
      status: "Draft",
      folderId: newEvidenceFolder || "fld-uncategorized"
    };

    onAddEvidenceFile(newFile);
    setNewEvidenceName("");
    setInventoryUploadFile(null);
    setNewEvidenceFolder("fld-uncategorized");
  };

  // Helpers & Handlers for Project Details Modal
  const getInitials = (name: string) => {
    if (!name) return "AI";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const getCASignOffStatusBadge = (p: AIProject) => {
    const cLevel = p.caSignOff?.certification?.level || "Pending Assessment";
    const aLevel = p.caSignOff?.accreditation?.level || "Pending Assessment";

    if (cLevel === "Certified" && aLevel === "Accreditation") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200" title="CISO Certified & Executive Accredited">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Certified & Accredited</span>
        </span>
      );
    }
    if (cLevel === "Not Certified" || aLevel === "Not Accredited") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-800 border border-rose-200" title="Certification or Accreditation Rejected">
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Not Approved</span>
        </span>
      );
    }
    if (cLevel === "Pending Assessment" || aLevel === "Pending Assessment") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200" title="Pending CISO or Executive Sign-Off">
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Pending Sign-Off</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200" title="Qualified C&A with remediation conditions">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Qualified C&A</span>
      </span>
    );
  };

  const getComplianceTasks = (riskClassification: string) => {
    switch (riskClassification) {
      case "Minimal":
        return [
          "Verify alignment with General AI Acceptable Use Policy",
          "Complete baseline risk self-assessment checklist"
        ];
      case "Limited":
        return [
          "Transparency disclosure: inform users they are interacting with AI",
          "Perform lightweight data protection impact verification",
          "Review model accuracy metrics with technical lead"
        ];
      case "High Risk":
        return [
          "Register use case in national or EU AI Act central database",
          "Conduct comprehensive Algorithmic Impact Assessment (AIA)",
          "Establish active post-market continuous monitoring logs",
          "Ensure human-in-the-loop overrides are configured and verified",
          "Perform external bias and transparency third-party audit"
        ];
      case "Unacceptable":
        return [
          "CRITICAL: Immediate deployment freeze — Prohibited application"
        ];
      default:
        return [
          "General GRC review of the algorithm's lifecycle phase"
        ];
    }
  };

  const handleToggleTask = (task: string) => {
    if (!selectedProject) return;
    const currentTasks = selectedProject.completedComplianceTasks || [];
    const updatedTasks = currentTasks.includes(task)
      ? currentTasks.filter(t => t !== task)
      : [...currentTasks, task];
    
    const updatedProject = {
      ...selectedProject,
      completedComplianceTasks: updatedTasks
    };
    
    setSelectedProject(updatedProject);
    onUpdateProject(updatedProject);
  };

  const handleMapModel = (modelFullName: string) => {
    if (!selectedProject || !modelFullName) return;
    const currentModels = selectedProject.mappedModels || [];
    if (currentModels.includes(modelFullName)) return;
    
    const updatedProject = {
      ...selectedProject,
      mappedModels: [...currentModels, modelFullName]
    };
    
    setSelectedProject(updatedProject);
    onUpdateProject(updatedProject);
    setNewModelToMap("");
  };

  const handleUnmapModel = (modelFullName: string) => {
    if (!selectedProject) return;
    const currentModels = selectedProject.mappedModels || [];
    const updatedProject = {
      ...selectedProject,
      mappedModels: currentModels.filter(m => m !== modelFullName)
    };
    
    setSelectedProject(updatedProject);
    onUpdateProject(updatedProject);
  };

  // New / Edit Project Form State
  const [editingProject, setEditingProject] = useState<AIProject | null>(null);
  const [selectedProjectTab, setSelectedProjectTab] = useState<number>(0);
  const [detailIsCollapsed, setDetailIsCollapsed] = useState(false);
  const [detailModalSize, setDetailModalSize] = useState<"standard" | "wide" | "fullscreen" | "custom">("standard");
  const [detailCustomDimensions, setDetailCustomDimensions] = useState<{ width: number; height: number }>({
    width: 1100,
    height: 780
  });

  const startResizingDetailModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = detailCustomDimensions.width || 1100;
    const startH = detailCustomDimensions.height || 780;

    setDetailModalSize("custom");

    const onMouseMove = (moveEvt: MouseEvent) => {
      const deltaX = (moveEvt.clientX - startX) * 2;
      const deltaY = (moveEvt.clientY - startY) * 2;

      const newWidth = Math.max(680, Math.min(window.innerWidth - 24, startW + deltaX));
      const newHeight = Math.max(480, Math.min(window.innerHeight - 24, startH + deltaY));

      setDetailCustomDimensions({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const getDetailContainerStyle = (): React.CSSProperties => {
    if (detailModalSize === "fullscreen") {
      return {
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        borderRadius: 0
      };
    }
    if (detailModalSize === "custom") {
      return {
        width: `${detailCustomDimensions.width}px`,
        height: `${detailCustomDimensions.height}px`,
        maxWidth: "98vw",
        maxHeight: "98vh"
      };
    }
    if (detailModalSize === "wide") {
      return {
        width: "100%",
        maxWidth: "88rem",
        height: "94vh",
        maxHeight: "94vh"
      };
    }
    return {
      width: "100%",
      maxWidth: "68rem",
      height: "88vh",
      maxHeight: "88vh"
    };
  };

  // New Model Form State
  const [mProvider, setMProvider] = useState("");
  const [mName, setMName] = useState("");
  const [mVer, setMVer] = useState("");
  const [mStatus, setMStatus] = useState<"Pending" | "Approved" | "Restricted" | "Blocked">("Pending");
  const [mApprover, setMApprover] = useState("");

  const handleOpenCreateProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: AIProject) => {
    setEditingProject(proj);
    setIsProjectModalOpen(true);
  };

  const handleDeleteProjectClick = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete AI project "${title}"?`)) {
      if (onDeleteProject) {
        onDeleteProject(id);
      }
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
    }
  };

  const handleSaveProject = (proj: AIProject) => {
    if (editingProject) {
      onUpdateProject(proj);
      if (selectedProject?.id === proj.id) {
        setSelectedProject(proj);
      }
    } else {
      onAddProject(proj);
    }
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleCreateModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName) return;

    const newMod: ModelRecord = {
      id: `mod-${models.length + 1}`,
      provider: mProvider || "Google",
      name: mName,
      version: mVer || "1.0",
      status: mStatus,
      approver: mApprover || "Demo Assessor",
      statusDate: "04-06-2026",
      useCasesCount: 0
    };

    onAddModel(newMod);
    setIsModelModalOpen(false);

    // Clear Form
    setMProvider("");
    setMName("");
    setMVer("");
    setMStatus("Pending");
    setMApprover("");
  };

  // Stats Counters
  // Projects
  const totalProjects = projects.length;
  const minimalProjects = projects.filter(p => p.riskClassification === "Minimal").length;
  const limitedProjects = projects.filter(p => p.riskClassification === "Limited").length;
  const highRiskProjects = projects.filter(p => p.riskClassification === "High Risk").length;
  const unacceptableProjects = projects.filter(p => p.riskClassification === "Unacceptable").length;

  // Models
  const totalModels = models.length;
  const approvedModels = models.filter(m => m.status === "Approved").length;
  const restrictedModels = models.filter(m => m.status === "Restricted").length;
  const pendingModels = models.filter(m => m.status === "Pending").length;
  const blockedModels = models.filter(m => m.status === "Blocked").length;

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(projectQuery.toLowerCase()) ||
    p.owner.toLowerCase().includes(projectQuery.toLowerCase()) ||
    p.riskClassification.toLowerCase().includes(projectQuery.toLowerCase())
  );

  const filteredModels = models.filter(m =>
    m.name.toLowerCase().includes(modelQuery.toLowerCase()) ||
    m.provider.toLowerCase().includes(modelQuery.toLowerCase()) ||
    m.status.toLowerCase().includes(modelQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Navigation & Standard Options Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Inventory</h1>
            <p className="text-sm text-slate-500 mt-1">Manage AI assets, map risk classifications, and maintain the model registry.</p>
          </div>
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
            <button
              onClick={() => {
                setActiveTab("projects");
                if (onNavigateToPage) onNavigateToPage("projects");
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "projects"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              id="tab-projects-register"
            >
              AI Projects Register
            </button>
            <button
              onClick={() => {
                setActiveTab("models");
                if (onNavigateToPage) onNavigateToPage("models");
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "models"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              id="tab-model-registry"
            >
              Model Registry
            </button>
          </div>
        </div>
      </div>

      {/* Main Container based on selected sub-tab */}
      {activeTab === "projects" ? (
        <div className="space-y-6 animate-fade-in">
          
          {/* Projects Metrics Overview Counters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Projects</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{totalProjects}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-emerald-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Minimal</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{minimalProjects}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-amber-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Limited</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{limitedProjects}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-orange-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">High Risk</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{highRiskProjects}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-rose-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Unacceptable</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{unacceptableProjects}</span>
            </div>
          </div>

          {/* Search, view switcher and create controls */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={projectQuery}
                onChange={(e) => setProjectQuery(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                id="search-projects"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "list" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "grid" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setIsGuidedWizardOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-extrabold rounded-lg shadow-sm transition-all cursor-pointer border border-indigo-500/30"
                id="btn-guided-wizard"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Guided Intake Wizard</span>
              </button>

              <button
                onClick={handleOpenCreateProject}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                id="btn-add-project"
              >
                <Plus className="w-4 h-4 text-slate-500" />
                <span>Quick Add</span>
              </button>
            </div>
          </div>

          {/* List or Grid representation of filtered projects */}
          {filteredProjects.length === 0 ? (
            <div className="bg-white p-12 text-center text-slate-400 text-xs rounded-xl border border-gray-100">
              No matching AI projects registered. Click "New project" to get started.
            </div>
          ) : viewMode === "list" ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6">Use Case ID</th>
                      <th className="p-4">Use Case Title</th>
                      <th className="p-4">AI Risk Level</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">C&A Sign-Off Status</th>
                      <th className="p-4">Start Date</th>
                      <th className="p-4">Last Updated</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors text-xs text-slate-700">
                        <td className="p-4 pl-6 font-mono font-bold text-slate-400">{p.id}</td>
                        <td className="p-4 font-bold text-slate-800">
                          <button
                            type="button"
                            onClick={() => setSelectedProject(p)}
                            className="text-left font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            {p.title}
                            <span className="block text-[10px] font-medium text-slate-400 mt-0.5">{p.targetIndustry} • Owner: {p.owner}</span>
                          </button>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                              p.riskClassification === "Minimal"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : p.riskClassification === "Limited"
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}
                          >
                            {p.riskClassification}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-500">{p.roleType}</td>
                        <td className="p-4">
                          {getCASignOffStatusBadge(p)}
                        </td>
                        <td className="p-4 text-slate-400">{p.startDate}</td>
                        <td className="p-4 text-slate-400">{p.lastUpdated}</td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenAiAudit(p)}
                              className="px-2 py-1 text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 hover:text-indigo-800 rounded text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 border border-indigo-200"
                              title="Run Gemini AI Regulatory & Compliance Assessment"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                              <span>AI Audit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenPdfReport(p)}
                              className="px-2 py-1 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/80 rounded text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 border border-transparent hover:border-indigo-200"
                              title="Print project dossier to PDF"
                            >
                              <Printer className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Print PDF</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedProject(p)}
                              className="px-2 py-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer transition-colors"
                              title="View details"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditProject(p)}
                              className="px-2 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded text-xs font-semibold cursor-pointer transition-colors"
                              title="Edit project"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProjectClick(p.id, p.title)}
                              className="px-2 py-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded text-xs font-semibold cursor-pointer transition-colors"
                              title="Delete project"
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{p.id}</span>
                      <span
                        className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                          p.riskClassification === "Minimal"
                            ? "bg-emerald-50 text-emerald-700"
                            : p.riskClassification === "Limited"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {p.riskClassification}
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedProject(p)}
                      className="text-xs font-bold text-slate-800 leading-snug hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {p.goal || "No specific goal mapped for this experimental use case."}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-500">
                      <div>
                        <span className="text-slate-400 block uppercase font-bold tracking-wider text-[8px]">Owner</span>
                        <span className="font-semibold">{p.owner.split(" ")[0]}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase font-bold tracking-wider text-[8px]">Industry</span>
                        <span className="font-semibold">{p.targetIndustry}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-400 block uppercase font-bold tracking-wider text-[8px]">C&A Status</span>
                      <div>{getCASignOffStatusBadge(p)}</div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                      {p.roleType}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenPdfReport(p)}
                        className="text-[10px] font-bold text-slate-700 hover:text-indigo-700 cursor-pointer px-1.5 py-0.5 rounded hover:bg-indigo-50 flex items-center gap-0.5"
                        title="Print project dossier to PDF"
                      >
                        <Printer className="w-3 h-3 text-indigo-600" />
                        <span>Print PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedProject(p)}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer px-1.5 py-0.5 rounded hover:bg-indigo-50"
                      >
                        Inspect <ArrowUpRight className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditProject(p)}
                        className="text-[10px] font-bold text-slate-600 hover:text-indigo-600 cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProjectClick(p.id, p.title)}
                        className="text-[10px] font-bold text-rose-600 hover:text-rose-800 cursor-pointer px-1.5 py-0.5 rounded hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      ) : (
        /* Model Registry display section */
        <div className="space-y-6 animate-fade-in">
          
          {/* Models metrics counters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Models</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{totalModels}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-emerald-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Approved</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{approvedModels}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-amber-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Restricted</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{restrictedModels}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-indigo-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pending</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{pendingModels}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-rose-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Blocked</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{blockedModels}</span>
            </div>
          </div>

          {/* Search models controls bar */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search models..."
                value={modelQuery}
                onChange={(e) => setModelQuery(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                id="search-models"
              />
            </div>

            <button
              onClick={() => setIsModelModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
              id="btn-add-model"
            >
              <Plus className="w-4 h-4" />
              Add new model
            </button>
          </div>

          {/* Models Table */}
          {filteredModels.length === 0 ? (
            <div className="bg-white p-12 text-center text-slate-400 text-xs rounded-xl border border-gray-100">
              No matching AI models found. Register a new model to start.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6">Provider</th>
                      <th className="p-4">Model Name</th>
                      <th className="p-4">Version</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Approver</th>
                      <th className="p-4">Status Date</th>
                      <th className="p-4">Use Cases Linked</th>
                      <th className="p-4 pr-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredModels.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors text-xs text-slate-700">
                        <td className="p-4 pl-6 font-bold text-slate-800">{m.provider}</td>
                        <td className="p-4 font-semibold text-slate-700">{m.name}</td>
                        <td className="p-4 font-mono text-slate-400">{m.version}</td>
                        <td className="p-4">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              m.status === "Approved"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : m.status === "Pending"
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : m.status === "Blocked"
                                ? "bg-rose-50 text-rose-700 border border-rose-100"
                                : "bg-purple-50 text-purple-700 border border-purple-100"
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-medium">{m.approver}</td>
                        <td className="p-4 text-slate-400">{m.statusDate}</td>
                        <td className="p-4 font-mono font-bold text-slate-600 pl-8">{m.useCasesCount}</td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => setSelectedModelForLogs(m)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Audit Log</span>
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

      {/* Modal overlays */}
      {/* 0. Guided AI System Intake Wizard Modal */}
      <GuidedOnboardingWizardModal
        isOpen={isGuidedWizardOpen}
        onClose={() => setIsGuidedWizardOpen(false)}
        onAddProject={(proj) => {
          onAddProject(proj);
          setSelectedProject(proj);
        }}
        models={models}
        team={team}
        existingProjectsCount={projects.length}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />

      {/* 1. Multi-Tab Create / Edit Project Modal */}
      <ProjectFormModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        editingProject={editingProject}
        onSaveProject={handleSaveProject}
        team={team}
        existingProjectsCount={projects.length}
      />

      {/* 2. Add Model Registry Modal */}
      {isModelModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-800">Add new model</h3>
                <p className="text-xs text-slate-400 mt-0.5">Register a model in the compliance directory.</p>
              </div>
              <button
                onClick={() => setIsModelModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateModel} className="p-6 space-y-4">
              <div className="space-y-3">
                {/* Provider */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Provider *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, OpenAI, Anthropic"
                    value={mProvider}
                    onChange={(e) => setMProvider(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none"
                  />
                </div>

                {/* Model Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Model name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gemini, GPT-4o, Claude Opus"
                    value={mName}
                    onChange={(e) => setMName(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none"
                  />
                </div>

                {/* Version */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Version</label>
                  <input
                    type="text"
                    placeholder="e.g. 4o, 1.5 Pro, 3.5 Sonnet"
                    value={mVer}
                    onChange={(e) => setMVer(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Approval Status</label>
                  <select
                    value={mStatus}
                    onChange={(e) => setMStatus(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Restricted">Restricted</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                {/* Approver */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Approver</label>
                  <select
                    value={mApprover}
                    onChange={(e) => setMApprover(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                  >
                    <option value="">Select approver</option>
                    {team.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModelModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 bg-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all cursor-pointer"
                  id="btn-confirm-create-model"
                >
                  Add Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. AI Project Details Modal */}
      {selectedProject && (
        <div className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 ${
          detailModalSize === "fullscreen" ? "p-0" : "p-2 sm:p-4 md:p-6"
        }`}>
          <div 
            style={getDetailContainerStyle()}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col relative transition-all duration-200 ease-out animate-scale-up"
          >
            
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-3.5 border-b border-slate-200/60 flex justify-between items-center bg-slate-50/90 shrink-0 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setDetailIsCollapsed(!detailIsCollapsed)}
                  className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer shrink-0"
                  title={detailIsCollapsed ? "Expand side panel" : "Collapse side panel to get more viewing space"}
                >
                  {detailIsCollapsed ? <PanelLeftOpen className="w-4 h-4 sm:w-5 sm:h-5" /> : <PanelLeftClose className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {selectedProject.id}
                    </span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      selectedProject.riskClassification === "Minimal"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : selectedProject.riskClassification === "Limited"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {selectedProject.riskClassification} Risk
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {selectedProject.status}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1 leading-tight truncate">
                    {selectedProject.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Registered on {selectedProject.startDate} • Last updated {selectedProject.lastUpdated}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenAiAudit(selectedProject)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                  title="Run Gemini AI Regulatory & Compliance Assessment on this project"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Assessment</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenPdfReport(selectedProject)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all cursor-pointer shadow-2xs hover:border-slate-400"
                  title="Print or export project governance dossier to PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Print to PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const proj = selectedProject;
                    setSelectedProject(null);
                    handleOpenEditProject(proj);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Project</span>
                </button>

                {/* Window Sizing Presets */}
                <div className="hidden md:flex items-center bg-slate-200/70 p-1 rounded-xl text-xs font-semibold text-slate-600 gap-1">
                  <button
                    type="button"
                    onClick={() => setDetailModalSize("standard")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                      detailModalSize === "standard"
                        ? "bg-white text-indigo-700 shadow-2xs font-bold"
                        : "hover:text-slate-900"
                    }`}
                    title="Standard window size"
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailModalSize("wide")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                      detailModalSize === "wide"
                        ? "bg-white text-indigo-700 shadow-2xs font-bold"
                        : "hover:text-slate-900"
                    }`}
                    title="Wide window size"
                  >
                    Wide
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailModalSize("fullscreen")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                      detailModalSize === "fullscreen"
                        ? "bg-white text-indigo-700 shadow-2xs font-bold"
                        : "hover:text-slate-900"
                    }`}
                    title="Full screen view"
                  >
                    Full Screen
                  </button>
                </div>

                {/* Collapse Side Panel Pill */}
                <button
                  type="button"
                  onClick={() => setDetailIsCollapsed(!detailIsCollapsed)}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200/90 rounded-xl transition-all cursor-pointer shadow-2xs"
                  title={detailIsCollapsed ? "Expand side panel" : "Collapse side panel"}
                >
                  {detailIsCollapsed ? (
                    <>
                      <PanelLeftOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Expand Side</span>
                    </>
                  ) : (
                    <>
                      <PanelLeftClose className="w-3.5 h-3.5 text-slate-500" />
                      <span>Collapse Side</span>
                    </>
                  )}
                </button>

                {/* Fullscreen Toggle Icon */}
                <button
                  type="button"
                  onClick={() => setDetailModalSize(detailModalSize === "fullscreen" ? "standard" : "fullscreen")}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title={detailModalSize === "fullscreen" ? "Exit full screen" : "Maximize to full screen"}
                >
                  {detailModalSize === "fullscreen" ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setNewModelToMap("");
                  }}
                  className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Body with Side Panel and Section Content */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Side Panel Navigation */}
              <aside className={`bg-slate-50/90 border-r border-slate-200/80 flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-y-auto ${
                detailIsCollapsed ? "w-16 p-2 items-center" : "w-60 sm:w-68 p-3.5 sm:p-4"
              }`}>
                <div className={`w-full flex items-center mb-2.5 px-1 ${detailIsCollapsed ? "justify-center" : "justify-between"}`}>
                  {!detailIsCollapsed && (
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sections</span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-mono text-[10px]">
                      {detailIsCollapsed ? `${selectedProjectTab + 1}/${SECTION_TABS.length}` : `${selectedProjectTab + 1} / ${SECTION_TABS.length}`}
                    </span>
                    {!detailIsCollapsed && (
                      <button
                        type="button"
                        onClick={() => setDetailIsCollapsed(true)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                        title="Collapse side panel"
                      >
                        <PanelLeftClose className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <nav className="space-y-1.5 flex-1 w-full">
                  {SECTION_TABS.map((tab, idx) => {
                    const Icon = tab.icon;
                    const isActive = selectedProjectTab === idx;

                    if (detailIsCollapsed) {
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setSelectedProjectTab(idx)}
                          title={`Section ${idx + 1}: ${tab.label}`}
                          className={`w-full flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all cursor-pointer relative group ${
                            isActive
                              ? "bg-indigo-600 text-white font-bold shadow-xs"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 font-medium"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-800"}`} />
                          <span className={`text-[10px] font-mono font-bold mt-0.5 ${isActive ? "text-white/90" : "text-slate-500"}`}>
                            {idx + 1}
                          </span>
                        </button>
                      );
                    }

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedProjectTab(idx)}
                        className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          isActive
                            ? "bg-indigo-600 text-white font-bold shadow-xs"
                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-5 h-5 rounded-lg text-[10px] flex items-center justify-center font-mono font-bold shrink-0 ${
                            isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                          }`}>
                            {idx + 1}
                          </span>
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                          <span className="truncate">{tab.label}</span>
                        </div>
                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-white/80" />
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Section Navigation Progress Card */}
                {detailIsCollapsed ? (
                  <div 
                    className="mt-3 pt-2 border-t border-slate-200/80 flex flex-col items-center w-full"
                    title={`Viewing Section: ${selectedProjectTab + 1} of ${SECTION_TABS.length}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-bold text-indigo-700 font-mono">
                        {Math.round(((selectedProjectTab + 1) / SECTION_TABS.length) * 100)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100/80 text-indigo-900 shrink-0">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-900 mb-2">
                      <span>Section Progress</span>
                      <span className="font-bold text-indigo-700">{Math.round(((selectedProjectTab + 1) / SECTION_TABS.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-indigo-200/60 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${((selectedProjectTab + 1) / SECTION_TABS.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-indigo-600 mt-2 font-medium truncate">
                      Section {selectedProjectTab + 1}: {SECTION_TABS[selectedProjectTab].label}
                    </p>
                  </div>
                )}
              </aside>

              {/* Content Panel Area */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Step Progress Lifecycle Tracker */}
              <StepProgressTracker
                project={selectedProject}
                activeSectionTab={selectedProjectTab}
                onTabChange={(tabIdx) => setSelectedProjectTab(tabIdx)}
              />

              {/* Tab 0: Core Overview & Compliance */}
              {selectedProjectTab === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                
                {/* Left Column: Objectives, Compliance Tasks & Model Mapping */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Goal Section */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      Core Objective & Goal
                    </span>
                    <div className="bg-slate-50/70 border border-slate-200/60 p-4 rounded-xl text-xs font-medium italic text-slate-700 leading-relaxed">
                      "{selectedProject.goal || "No project goal specified yet."}"
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      Detailed Context Description
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                      {selectedProject.description || "No full description mapped for this experimental use case."}
                    </p>
                  </div>

                  {/* GRC Compliance Checklist Section */}
                  <div className="space-y-3 bg-slate-50/30 border border-slate-200/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        GRC Compliance Checklist
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {selectedProject.completedComplianceTasks?.length || 0} / {getComplianceTasks(selectedProject.riskClassification).length} Completed
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {getComplianceTasks(selectedProject.riskClassification).map((task) => {
                        const isCompleted = (selectedProject.completedComplianceTasks || []).includes(task);
                        return (
                          <label
                            key={task}
                            className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                              isCompleted
                                ? "bg-emerald-50/30 border-emerald-100 text-emerald-800 font-medium"
                                : "bg-white border-slate-200/60 hover:border-slate-300 text-slate-700"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => handleToggleTask(task)}
                              className="mt-0.5 accent-indigo-650 h-3.5 w-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className={isCompleted ? "line-through text-slate-400" : ""}>
                              {task}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Model Mapping Section */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />
                      Mapped Foundation Models / LLMs
                    </span>

                    {/* Mapped Models List */}
                    <div className="space-y-2">
                      {(!selectedProject.mappedModels || selectedProject.mappedModels.length === 0) ? (
                        <p className="text-xs text-slate-400 bg-slate-50 border border-dashed border-slate-200 p-4 rounded-xl text-center">
                          No models linked to this use case yet. Add one below to maintain alignment.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedProject.mappedModels.map((mName) => (
                            <div key={mName} className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs flex items-center justify-between animate-fade-in">
                              <div className="flex items-center gap-2.5">
                                <BrainCircuit className="w-4 h-4 text-indigo-500/80" />
                                <span className="text-xs font-semibold text-slate-800">{mName}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleUnmapModel(mName)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Unlink model"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Map Model Selector Form */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex-1 w-full">
                        <select
                          value={newModelToMap}
                          onChange={(e) => setNewModelToMap(e.target.value)}
                          className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2 outline-none cursor-pointer"
                        >
                          <option value="">-- Link Model from Registry --</option>
                          {models
                            .filter((m) => !(selectedProject.mappedModels || []).includes(`${m.provider} ${m.name}`))
                            .map((m) => {
                              const fullName = `${m.provider} ${m.name}`;
                              return (
                                <option key={m.id} value={fullName}>
                                  {m.provider} • {m.name} ({m.status})
                                </option>
                              );
                            })}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleMapModel(newModelToMap)}
                        disabled={!newModelToMap}
                        className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Link Model
                      </button>
                    </div>
                  </div>

                  {/* Evidence & Documents Section */}
                  <div className="space-y-4 border-t border-slate-150 pt-5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                      Evidence & Compliance Documents
                    </span>

                    {/* Associated files */}
                    <div className="space-y-2">
                      {evidenceFiles.filter(f => f.source === selectedProject.title).length === 0 ? (
                        <p className="text-xs text-slate-400 bg-slate-50 border border-dashed border-slate-200 p-4 rounded-xl text-center">
                          No evidence files linked. Link existing ones or upload below to verify compliance.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {evidenceFiles
                            .filter(f => f.source === selectedProject.title)
                            .map((file) => (
                              <div key={file.id} className="bg-slate-50/50 hover:bg-slate-50 p-3 rounded-xl border border-slate-200/60 shadow-xs flex items-center justify-between transition-colors">
                                <div className="flex items-center gap-2.5">
                                  <FileText className="w-4 h-4 text-indigo-500" />
                                  <div className="text-left">
                                    <span className="text-xs font-semibold text-slate-800 block">{file.name}</span>
                                    <span className="text-[9px] text-slate-400 block mt-0.5">
                                      Uploaded by {file.uploader} • {file.uploadDate} • Folder: {folders.find(fd => fd.id === file.folderId)?.name || "Uncategorized"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150 px-1.5 py-0.5 rounded uppercase font-mono">
                                    {file.status}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => onPreviewFile?.(file)}
                                    className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer flex items-center justify-center"
                                    title="Open file preview"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUnlinkEvidenceFile(file.id)}
                                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer flex items-center justify-center"
                                    title="Unlink file from project"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Actions: Link Existing OR Upload New */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Subpanel 1: Link Existing File */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200/60 flex flex-col justify-between space-y-3 shadow-xs">
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 text-left">Link Existing File</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 text-left leading-relaxed">Attach documents already uploaded in the workspace registry.</p>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={linkExistingFileId}
                            onChange={(e) => setLinkExistingFileId(e.target.value)}
                            className="flex-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2 outline-none cursor-pointer min-w-0"
                          >
                            <option value="">-- Choose document --</option>
                            {evidenceFiles
                              .filter(f => f.source !== selectedProject.title)
                              .map(f => (
                                <option key={f.id} value={f.id}>
                                  {f.name} ({f.source !== "Not linked" ? `Linked: ${f.source}` : "Available"})
                                </option>
                              ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleLinkEvidenceFile(linkExistingFileId)}
                            disabled={!linkExistingFileId}
                            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Link
                          </button>
                        </div>
                      </div>

                      {/* Subpanel 2: Upload / Write New File directly */}
                      <form onSubmit={handleAddNewEvidenceFile} className="bg-white p-4 rounded-xl border border-slate-200/60 flex flex-col justify-between space-y-3 shadow-xs">
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 text-left">Upload New Document</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 text-left leading-relaxed">Register a brand-new file and tie it instantly to this project.</p>
                        </div>
                        <div className="space-y-2">
                          {/* File input */}
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setInventoryUploadFile(file);
                                setNewEvidenceName(file.name);
                              }
                            }}
                          />
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragging(false);
                              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                const file = e.dataTransfer.files[0];
                                setInventoryUploadFile(file);
                                setNewEvidenceName(file.name);
                              }
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                              isDragging
                                ? "border-indigo-500 bg-indigo-50/50"
                                : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                            }`}
                          >
                            {inventoryUploadFile ? (
                              <>
                                <FileText className="w-6 h-6 text-indigo-500 animate-pulse" />
                                <div className="text-[11px] font-bold text-slate-800 truncate max-w-full px-1">
                                  {inventoryUploadFile.name}
                                </div>
                                <div className="text-[9px] text-slate-400">
                                  {(inventoryUploadFile.size / 1024).toFixed(1)} KB — Click to change
                                </div>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-6 h-6 text-slate-400" />
                                <p className="text-[11px] font-semibold text-slate-600">
                                  Drag & drop file or <span className="text-indigo-600 font-bold underline">browse</span>
                                </p>
                              </>
                            )}
                          </div>

                          <input
                            type="text"
                            placeholder="File name"
                            value={newEvidenceName}
                            onChange={(e) => setNewEvidenceName(e.target.value)}
                            className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                            required
                          />
                          <div className="flex gap-2">
                            <select
                              value={newEvidenceFolder}
                              onChange={(e) => setNewEvidenceFolder(e.target.value)}
                              className="flex-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2 outline-none cursor-pointer min-w-0"
                            >
                              {folders
                                .filter(f => f.id !== "fld-all")
                                .map(f => (
                                  <option key={f.id} value={f.id}>
                                    Folder: {f.name}
                                  </option>
                                ))}
                            </select>
                            <button
                              type="submit"
                              disabled={!newEvidenceName.trim() && !inventoryUploadFile}
                              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              Upload
                            </button>
                          </div>
                        </div>
                      </form>

                    </div>
                  </div>

                </div>

                {/* Right Column: Metadata Cards & Team Members */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Metadata Grid Panel */}
                  <div className="bg-slate-50/60 border border-slate-200/50 rounded-xl p-5 space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Governance Specs
                    </span>
                    
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <span className="text-slate-400 block uppercase font-bold tracking-wider text-[8px]">Owner</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-6 bg-slate-200 text-slate-600 font-bold rounded-full flex items-center justify-center text-[10px]">
                            {getInitials(selectedProject.owner)}
                          </div>
                          <span className="font-semibold text-slate-700">{selectedProject.owner}</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-150 pt-3">
                        <span className="text-slate-400 block uppercase font-bold tracking-wider text-[8px]">Target Industry</span>
                        <span className="font-semibold text-slate-700 mt-0.5 block">{selectedProject.targetIndustry || "Not Specified"}</span>
                      </div>

                      <div className="border-t border-slate-150 pt-3">
                        <span className="text-slate-400 block uppercase font-bold tracking-wider text-[8px]">Geography Scope</span>
                        <span className="font-semibold text-slate-700 mt-0.5 block">{selectedProject.geography || "Not Specified"}</span>
                      </div>

                      <div className="border-t border-slate-150 pt-3">
                        <span className="text-slate-400 block uppercase font-bold tracking-wider text-[8px]">Compliance Framework</span>
                        <span className="font-semibold text-indigo-650 mt-0.5 block">{selectedProject.framework || "None"}</span>
                      </div>

                      <div className="border-t border-slate-150 pt-3">
                        <span className="text-slate-400 block uppercase font-bold tracking-wider text-[8px]">High Risk Role Type</span>
                        <span className="font-semibold text-slate-700 mt-0.5 block">{selectedProject.roleType || "Not Specified"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Team Members Panel */}
                  <div className="bg-white border border-slate-200/60 shadow-xs rounded-xl p-5 space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      Team Members ({selectedProject.teamMembers?.length || 0})
                    </span>

                    <div className="space-y-3">
                      {(selectedProject.teamMembers || []).map((member) => (
                        <div key={member} className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold rounded-full flex items-center justify-center text-[10px]">
                            {getInitials(member)}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-800 block">{member}</span>
                            <span className="text-[9px] text-slate-400 block">AI Policy Partner</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
              )}

              {/* Tab 1: System Report */}
              {selectedProjectTab === 1 && (
                <div className="bg-slate-50/70 border border-slate-200/60 p-5 rounded-xl space-y-4 animate-fade-in">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Section 2: System Report Specifications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Name of Initiative</span>
                      <span className="text-slate-800 font-medium mt-1 block">{selectedProject.systemReport?.nameOfInitiative || selectedProject.title || "Not specified"}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Business Owner Name</span>
                      <span className="text-slate-800 font-medium mt-1 block">{selectedProject.systemReport?.businessOwnerName || selectedProject.owner || "Not specified"}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stakeholder(s) Names</span>
                      <span className="text-slate-800 font-medium mt-1 block">{selectedProject.systemReport?.stakeholdersNames || (selectedProject.teamMembers || []).join(", ") || "Not specified"}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 md:col-span-2 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                          System Overview Diagram
                        </span>
                        {(selectedProject.systemReport?.systemOverviewDiagram || selectedProject.systemReport?.referenceDocuments) && (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Diagram Attached
                          </span>
                        )}
                      </div>
                      {(selectedProject.systemReport?.systemOverviewDiagram || (selectedProject.systemReport?.referenceDocuments && selectedProject.systemReport.referenceDocuments.startsWith("data:image"))) ? (
                        <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-900/5 max-h-[380px] flex items-center justify-center p-3">
                          <img
                            src={selectedProject.systemReport.systemOverviewDiagram || selectedProject.systemReport.referenceDocuments}
                            alt="System Overview Diagram"
                            className="max-h-[350px] w-auto max-w-full object-contain rounded-lg shadow-xs"
                          />
                        </div>
                      ) : (
                        <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
                          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-500 font-medium">No System Overview Diagram uploaded for this project.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject(selectedProject);
                              setIsProjectModalOpen(true);
                            }}
                            className="mt-3 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                          >
                            Upload Diagram in Edit Project
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Overview & Confidentiality Impact */}
              {selectedProjectTab === 2 && (
                <div className="bg-slate-50/70 border border-slate-200/60 p-5 rounded-xl space-y-4 animate-fade-in">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-indigo-600" />
                    Section 3: Overview & Breach Impact Analysis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description of Initiative</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.overview?.descriptionOfInitiative || selectedProject.description || "Not specified"}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nature of Information Handled</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.overview?.natureOfInformationHandled || "Not specified"}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Information Classification</span>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {selectedProject.overview?.informationClassification || "SENSITIVE"}
                      </span>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confidentiality Breach Impact</span>
                      <span className="text-rose-700 font-bold mt-1 block">{selectedProject.overview?.impactConfidentialityBreached || "Major"}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confidentiality Impact Description</span>
                      <p className="text-slate-700 mt-1">{selectedProject.overview?.impactConfidentialityBreachedDescription || "No specific details provided."}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Integrity Breach Impact</span>
                      <span className="text-amber-700 font-bold mt-1 block">{selectedProject.overview?.impactIntegrityBreached || "Major"}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Integrity Impact Description</span>
                      <p className="text-slate-700 mt-1">{selectedProject.overview?.impactIntegrityBreachedDescription || "No specific details provided."}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Availability Breach Impact</span>
                      <span className="text-slate-800 font-bold mt-1 block">{selectedProject.overview?.impactAvailabilityBreached || "Major"}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Availability Impact Description</span>
                      <p className="text-slate-700 mt-1">{selectedProject.overview?.impactAvailabilityBreachedDescription || "No specific details provided."}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Description of Systems */}
              {selectedProjectTab === 3 && (
                <div className="bg-slate-50/70 border border-slate-200/60 p-5 rounded-xl space-y-4 animate-fade-in">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Server className="w-4 h-4 text-indigo-600" />
                    Section 4: Description of Systems & Boundaries
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scope</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.descriptionOfSystems?.scope || "Not specified"}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Previously Certified & Unchanged Components</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.descriptionOfSystems?.previouslyCertifiedAndUnchangedComponents || "None listed"}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Out of Scope</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.descriptionOfSystems?.outOfScope || "Not specified"}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Decommissioning Plan</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.descriptionOfSystems?.decommissioning || "Not specified"}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Integrated Subsystems or Services</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.descriptionOfSystems?.integratedSubsystemOrServices || "None specified"}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Actors - External Users</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.descriptionOfSystems?.actorsExternalUsers || "Not specified"}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Actors - End User Devices</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.descriptionOfSystems?.actorsEndUserDevices || "Not specified"}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Actors - Internal Users</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.descriptionOfSystems?.actorsInternalUsers || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Business Process & Information Flows */}
              {selectedProjectTab === 4 && (
                <div className="bg-slate-50/70 border border-slate-200/60 p-5 rounded-xl space-y-4 animate-fade-in">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-indigo-600" />
                    Section 5: Summary of Business Process & Information Flows
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Summary of Business Process / Flows</span>
                      <p className="text-slate-800 font-medium mt-1 whitespace-pre-wrap">{selectedProject.summaryOfBusinessProcess?.summaryOfBusinessProcess || "Not specified"}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Geographic Location of Data</span>
                      <span className="text-slate-800 font-medium mt-1 block">{selectedProject.summaryOfBusinessProcess?.geographicLocationOfData || selectedProject.geography || "Not specified"}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cloud Service Model</span>
                      <span className="text-indigo-700 font-bold mt-1 block">{selectedProject.summaryOfBusinessProcess?.natureOfCloudServiceModel || "PaaS"}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Independent Certifications</span>
                      <span className="text-slate-800 font-medium mt-1 block">{selectedProject.summaryOfBusinessProcess?.independentCertifications || selectedProject.framework || "None"}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cloud Platform Services</span>
                      <span className="text-slate-800 font-medium mt-1 block">{selectedProject.summaryOfBusinessProcess?.cloudPlatformServices || "Not specified"}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Publicly Accessible</span>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedProject.summaryOfBusinessProcess?.publiclyAccessible === "Yes"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {selectedProject.summaryOfBusinessProcess?.publiclyAccessible || "No"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Assessment Scope */}
              {selectedProjectTab === 5 && (
                <div className="bg-slate-50/70 border border-slate-200/60 p-5 rounded-xl space-y-4 animate-fade-in">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                    Section 6: Scope Boundaries Evaluation
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Scope</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150">
                          {selectedProject.assessmentScope?.securityScope || "Full Scope"}
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs mt-1">{selectedProject.assessmentScope?.securityScopeDescription || "Full security controls in scope."}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Privacy Scope</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150">
                          {selectedProject.assessmentScope?.privacyScope || "Limited Scope"}
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs mt-1">{selectedProject.assessmentScope?.privacyScopeDescription || "Targeted privacy impact assessment."}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Human Rights & Ethics Scope</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150">
                          {selectedProject.assessmentScope?.humanRightsAndEthicsScope || "Limited Scope"}
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs mt-1">{selectedProject.assessmentScope?.humanRightsAndEthicsScopeDescription || "Algorithmic fairness evaluation."}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Information Management Scope</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150">
                          {selectedProject.assessmentScope?.informationManagementScope || "Limited Scope"}
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs mt-1">{selectedProject.assessmentScope?.informationManagementScopeDescription || "Data lifecycle & retention rules."}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: Summary of Findings */}
              {selectedProjectTab === 6 && (
                <div className="bg-slate-50/70 border border-slate-200/60 p-5 rounded-xl space-y-4 animate-fade-in">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-indigo-600" />
                    Section 7: Assessment Findings & Verification
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Findings</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.summaryOfFindings?.findingsSecurity || "No negative security findings reported."}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Privacy Findings</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.summaryOfFindings?.findingsPrivacy || "Anonymization & data minimization verified."}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Human Rights Findings</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.summaryOfFindings?.findingsHumanRights || "Low discrimination risk verified."}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ethics Findings</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.summaryOfFindings?.findingsEthics || "Explainability requirements met."}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/60 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Information Management Findings</span>
                      <p className="text-slate-800 font-medium mt-1">{selectedProject.summaryOfFindings?.findingsInformationManagement || "Audit logging & cache purges configured."}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 7: Commentary & Risk Profile */}
              {selectedProjectTab === 7 && (
                <div className="bg-slate-50/70 border border-slate-200/60 p-5 rounded-xl space-y-4 animate-fade-in">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-indigo-600" />
                    Section 8: Commentary on Risk Profile & Formal Risk Acceptance
                  </h4>
                  
                  <RiskAssessmentView
                    entries={selectedProject.commentaryOnRiskProfile?.riskEntries}
                    onChangeEntries={(updated) => {
                      const updatedProj: AIProject = {
                        ...selectedProject,
                        commentaryOnRiskProfile: {
                          ...selectedProject.commentaryOnRiskProfile,
                          riskEntries: updated
                        }
                      };
                      setSelectedProject(updatedProj);
                      onUpdateProject(updatedProj);
                    }}
                    commentary={selectedProject.commentaryOnRiskProfile?.commentaryOnRiskProfile || ""}
                    onChangeCommentary={(val) => {
                      const updatedProj: AIProject = {
                        ...selectedProject,
                        commentaryOnRiskProfile: {
                          ...selectedProject.commentaryOnRiskProfile,
                          commentaryOnRiskProfile: val
                        }
                      };
                      setSelectedProject(updatedProj);
                      onUpdateProject(updatedProj);
                    }}
                    acceptance={selectedProject.commentaryOnRiskProfile?.riskAcceptance || ""}
                    onChangeAcceptance={(val) => {
                      const updatedProj: AIProject = {
                        ...selectedProject,
                        commentaryOnRiskProfile: {
                          ...selectedProject.commentaryOnRiskProfile,
                          riskAcceptance: val
                        }
                      };
                      setSelectedProject(updatedProj);
                      onUpdateProject(updatedProj);
                    }}
                  />
                </div>
              )}

              {/* Tab 8: Remediation Plan */}
              {selectedProjectTab === 8 && (
                <div className="space-y-4 animate-fade-in">
                  <RemediationPlanView
                    data={selectedProject.remediationPlan}
                    onChangeData={(updated) => {
                      const updatedProj: AIProject = {
                        ...selectedProject,
                        remediationPlan: updated
                      };
                      setSelectedProject(updatedProj);
                      onUpdateProject(updatedProj);
                    }}
                  />
                </div>
              )}

              {/* Tab 9: Checklist & Standards Compliance */}
              {selectedProjectTab === 9 && (
                <div className="space-y-4 animate-fade-in">
                  <ComplianceChecklistView
                    data={selectedProject.complianceChecklist || {}}
                    onChangeData={(updated) => {
                      const updatedProj: AIProject = {
                        ...selectedProject,
                        complianceChecklist: updated
                      };
                      setSelectedProject(updatedProj);
                      onUpdateProject(updatedProj);
                    }}
                    onUploadEvidence={(itemName) => {
                      setNewEvidenceName(`Evidence - ${itemName}`);
                      setSelectedProjectTab(12);
                    }}
                  />
                </div>
              )}

              {/* Tab 10: Control Questionnaires */}
              {selectedProjectTab === 10 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border-b border-slate-200/80 pb-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                      Section 11: SOC 2 Controls Questionnaire
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review and complete the control questionnaires for this AI project to ensure evidence readiness.
                    </p>
                  </div>

                  <ControlQuestionnairesView
                    answers={selectedProject.controlQuestionnaires || {}}
                    onUpdateAnswer={(qKey, ans) => {
                      const updatedProj: AIProject = {
                        ...selectedProject,
                        controlQuestionnaires: {
                          ...(selectedProject.controlQuestionnaires || {}),
                          [qKey]: ans
                        }
                      };
                      setSelectedProject(updatedProj);
                      onUpdateProject(updatedProj);
                    }}
                    onUploadEvidence={(controlId, evidenceName) => {
                      setNewEvidenceName(`${controlId} Evidence - ${evidenceName}`);
                      setSelectedProjectTab(12);
                    }}
                  />
                </div>
              )}

              {/* Tab 11: Control Matrix */}
              {selectedProjectTab === 11 && (
                <div className="space-y-4 animate-fade-in">
                  <ControlMatrixView
                    controls={selectedProject.controlMatrix}
                    onChangeControls={(updatedControls) => {
                      const updatedProj: AIProject = {
                        ...selectedProject,
                        controlMatrix: updatedControls
                      };
                      setSelectedProject(updatedProj);
                      onUpdateProject(updatedProj);
                    }}
                  />
                </div>
              )}

              {/* Tab 12: Evidence & Compliance Documents */}
              {selectedProjectTab === 12 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-200/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-indigo-600" />
                        Section 13: Evidence & Compliance Documents
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Load, attach, manage, and upload evidence files linked to this AI project.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full font-mono">
                        {evidenceFiles.filter(f => f.source === selectedProject.title).length} File(s) Linked
                      </span>
                    </div>
                  </div>

                  {/* Associated files list */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-indigo-500" />
                      Loaded Evidence Documents ({evidenceFiles.filter(f => f.source === selectedProject.title).length})
                    </span>

                    {evidenceFiles.filter(f => f.source === selectedProject.title).length === 0 ? (
                      <div className="text-xs text-slate-400 bg-slate-50 border border-dashed border-slate-200/80 p-6 rounded-2xl text-center space-y-1">
                        <Paperclip className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                        <p className="font-semibold text-slate-600">No evidence files linked to this project yet.</p>
                        <p className="text-[11px] text-slate-400">Select an existing document from the workspace registry or upload a new file below.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {evidenceFiles
                          .filter(f => f.source === selectedProject.title)
                          .map((file) => (
                            <div key={file.id} className="bg-white hover:bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 shadow-xs flex items-center justify-between transition-all">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="text-left min-w-0">
                                  <span className="text-xs font-bold text-slate-800 block truncate">{file.name}</span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                                    Uploaded by <strong className="text-slate-600">{file.uploader}</strong> • {file.uploadDate} • Folder: <strong className="text-slate-600">{folders.find(fd => fd.id === file.folderId)?.name || "Uncategorized"}</strong>
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-3">
                                <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150 px-2 py-0.5 rounded uppercase font-mono">
                                  {file.status}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onPreviewFile?.(file)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                                  title="Open file preview"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUnlinkEvidenceFile(file.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Unlink file from project"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Actions: Link Existing OR Upload New */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Subpanel 1: Link Existing File */}
                    <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/70 flex flex-col justify-between space-y-3.5 shadow-xs">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 text-left flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                          Link Existing File
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 text-left leading-relaxed">
                          Attach documents already uploaded in the workspace registry.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={linkExistingFileId}
                          onChange={(e) => setLinkExistingFileId(e.target.value)}
                          className="flex-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 outline-none cursor-pointer min-w-0 focus:border-indigo-500"
                        >
                          <option value="">-- Choose document --</option>
                          {evidenceFiles
                            .filter(f => f.source !== selectedProject.title)
                            .map(f => (
                              <option key={f.id} value={f.id}>
                                {f.name} ({f.source !== "Not linked" ? `Linked: ${f.source}` : "Available"})
                              </option>
                            ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleLinkEvidenceFile(linkExistingFileId)}
                          disabled={!linkExistingFileId}
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                        >
                          Link
                        </button>
                      </div>
                    </div>

                    {/* Subpanel 2: Upload / Write New File directly */}
                    <form onSubmit={handleAddNewEvidenceFile} className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/70 flex flex-col justify-between space-y-3.5 shadow-xs">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 text-left flex items-center gap-1.5">
                          <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
                          Upload New Document
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 text-left leading-relaxed">
                          Register a brand-new file and tie it instantly to this project.
                        </p>
                      </div>
                      <div className="space-y-2.5">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setInventoryUploadFile(file);
                              setNewEvidenceName(file.name);
                            }
                          }}
                        />
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              const file = e.dataTransfer.files[0];
                              setInventoryUploadFile(file);
                              setNewEvidenceName(file.name);
                            }
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          className={`p-3 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                            isDragging
                              ? "border-indigo-600 bg-indigo-50/80"
                              : inventoryUploadFile
                              ? "border-indigo-300 bg-indigo-50/30"
                              : "border-slate-200 hover:border-indigo-400 bg-white"
                          }`}
                        >
                          {inventoryUploadFile ? (
                            <div className="flex items-center justify-center gap-2 text-indigo-700 text-xs font-semibold">
                              <FileText className="w-4 h-4 text-indigo-600" />
                              <span className="truncate max-w-[200px]">{inventoryUploadFile.name}</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs">
                              <UploadCloud className="w-4 h-4 text-slate-400" />
                              <span>Drag & drop file or <strong className="text-indigo-600 underline">browse</strong></span>
                            </div>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="File name"
                          value={newEvidenceName}
                          onChange={(e) => setNewEvidenceName(e.target.value)}
                          className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-500 transition-all"
                          required
                        />
                        <div className="flex gap-2">
                          <select
                            value={newEvidenceFolder}
                            onChange={(e) => setNewEvidenceFolder(e.target.value)}
                            className="flex-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 outline-none cursor-pointer min-w-0"
                          >
                            {folders
                              .filter(f => f.id !== "fld-all")
                              .map(f => (
                                <option key={f.id} value={f.id}>
                                  Folder: {f.name}
                                </option>
                              ))}
                          </select>
                          <button
                            type="submit"
                            disabled={!newEvidenceName.trim() && !inventoryUploadFile}
                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-2xs"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            Upload
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Tab 13: C&A Sign-Off */}
              {selectedProjectTab === 13 && (
                <div className="space-y-4 animate-fade-in">
                  <CertificationSignOffView
                    data={selectedProject.caSignOff}
                    projectTitle={selectedProject.title}
                    onChangeData={(updated) => {
                      const updatedProj: AIProject = {
                        ...selectedProject,
                        caSignOff: updated
                      };
                      setSelectedProject(updatedProj);
                      onUpdateProject(updatedProj);
                    }}
                  />
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-150 bg-slate-50 flex justify-between items-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  handleDeleteProjectClick(selectedProject.id, selectedProject.title);
                }}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
              >
                Delete Project
              </button>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenPdfReport(selectedProject)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Print or export project governance report to PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Print to PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const proj = selectedProject;
                    setSelectedProject(null);
                    handleOpenEditProject(proj);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Project</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProject(null);
                    setNewModelToMap("");
                  }}
                  className="px-5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Interactive Corner Drag Resizer */}
        {detailModalSize !== "fullscreen" && (
          <div
            onMouseDown={startResizingDetailModal}
            className="absolute bottom-0 right-0 w-7 h-7 cursor-se-resize flex items-end justify-end p-1 z-30 group"
            title="Click and drag corner to custom resize window (Width & Height)"
          >
            <div className="w-3.5 h-3.5 border-r-2 border-b-2 border-slate-400 group-hover:border-indigo-600 transition-colors" />
          </div>
        )}

      </div>
    </div>
  )}

  {/* PDF Governance Dossier Report Modal */}
  <ProjectPdfReportModal
    project={pdfReportProject}
    models={models}
    evidenceFiles={evidenceFiles}
    isOpen={isPdfModalOpen}
    onClose={() => setIsPdfModalOpen(false)}
  />

  {/* AI Regulatory & Risk Compliance Assessment Modal */}
  {aiAuditProject && (
    <AIComplianceAssessmentModal
      isOpen={isAiAuditOpen}
      onClose={() => {
        setIsAiAuditOpen(false);
        setAiAuditProject(null);
      }}
      project={aiAuditProject}
      onSaveAssessment={(assessment) => {
        onUpdateProject({
          ...aiAuditProject,
          governanceTier: assessment.overallRiskTier as any
        });
      }}
    />
  )}

  {/* Model Governance Audit Trail & Verification Logs Modal */}
  {selectedModelForLogs && (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-up border border-slate-200">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{selectedModelForLogs.provider} {selectedModelForLogs.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  v{selectedModelForLogs.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Model Safety, Alignment &amp; Verification Audit Trail
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedModelForLogs(null)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto bg-slate-50/50">
          {/* Key Metric Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Governance State</span>
              <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                selectedModelForLogs.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                selectedModelForLogs.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                "bg-rose-50 text-rose-700 border border-rose-200"
              }`}>
                {selectedModelForLogs.status}
              </span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Security Score</span>
              <span className="text-sm font-black text-emerald-600 mt-1 block">98 / 100</span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Active Systems</span>
              <span className="text-sm font-black text-slate-800 mt-1 block">{selectedModelForLogs.useCasesCount} Projects</span>
            </div>
          </div>

          {/* Verification Checks */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Automated Pre-Deployment Safety Suite</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Prompt Injection &amp; Jailbreak Resistance (OWASP LLM01)</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">PASSED (0.01% Leak)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">PII &amp; Sensitive Data Redaction Filter (GDPR / CCPA)</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">ACTIVE (100% Guarded)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Sandboxed Runtime Execution Trace &amp; Latency</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">VERIFIED (214ms)</span>
              </div>
            </div>
          </div>

          {/* Audit History Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Governance Approval History</h4>
            <div className="border-l-2 border-slate-200 ml-2 space-y-4 pl-4 text-xs">
              <div className="relative">
                <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                <p className="font-bold text-slate-800">Model Approved for Production Deployment</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Approved by {selectedModelForLogs.approver} on {selectedModelForLogs.statusDate}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-white" />
                <p className="font-bold text-slate-800">ISO/IEC 42001 &amp; NIST AI RMF Evaluation Completed</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Automated benchmark verified zero high-severity vulnerabilities</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                <p className="font-bold text-slate-800">Initial Model Registry Intake</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Provider: {selectedModelForLogs.provider}, Version: {selectedModelForLogs.version}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            SHA-256 Checksum: 88f2a1...39e7
          </span>
          <button
            onClick={() => setSelectedModelForLogs(null)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer transition"
          >
            Close Audit Log
          </button>
        </div>
      </div>
    </div>
  )}

    </div>
  );
}
