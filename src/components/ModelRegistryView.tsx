import React, { useState, useRef } from "react";
import {
  Plus,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  BrainCircuit,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Ban,
  Clock,
  ExternalLink,
  Upload,
  FileText,
  Download,
  Eye,
  Edit3,
  Trash2,
  Paperclip,
  FileUp,
  Globe,
  Terminal,
  FileCode,
  Award
} from "lucide-react";
import { ModelRecord, TeamMember } from "../types";
import ModelJsonImportExportModal from "./ModelJsonImportExportModal";
import MarketAssessmentScanner from "./MarketAssessmentScanner";
import WeeklyAutomationGuideView from "./WeeklyAutomationGuideView";

export interface ModelRiskItem {
  id: string;
  name: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "ON HOLD";
  model: string;
  owner: string;
  description?: string;
  mitigationPlan?: string;
}

export interface EvidenceItem {
  id: string;
  docName: string;
  type: string;
  date: string;
  uploader: string;
  size: string;
  model?: string;
  notes?: string;
  fileDataUrl?: string;
  fileName?: string;
}

interface ModelRegistryViewProps {
  models: ModelRecord[];
  onAddModel: (mod: ModelRecord) => void;
  onBatchImportModels?: (models: ModelRecord[], mode: "merge" | "overwrite" | "append") => void;
  onUpdateModel?: (mod: ModelRecord) => void;
  onDeleteModel?: (id: string) => void;
  team: TeamMember[];
  workspaceId?: string;
  onNavigateToPage?: (page: string) => void;
}

export default function ModelRegistryView({
  models,
  onAddModel,
  onBatchImportModels,
  onUpdateModel,
  onDeleteModel,
  team,
  workspaceId = "ws-1",
  onNavigateToPage
}: ModelRegistryViewProps) {
  // Navigation within the Model Registry workspace: "models" | "scanner" | "weekly_guide" | "risks" | "evidence"
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"models" | "scanner" | "weekly_guide" | "risks" | "evidence">("models");
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

  const handleBatchImport = (importedModels: ModelRecord[], mode: "merge" | "overwrite" | "append") => {
    if (onBatchImportModels) {
      onBatchImportModels(importedModels, mode);
    } else {
      importedModels.forEach((m) => onAddModel(m));
    }
  };
  
  // Search query & Status Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [modelStatusFilter, setModelStatusFilter] = useState<string>("ALL");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Add / Edit Model Modal & Detail State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelRecord | null>(null);
  const [selectedModelDetail, setSelectedModelDetail] = useState<ModelRecord | null>(null);

  const [provider, setProvider] = useState("");
  const [modelName, setModelName] = useState("");
  const [version, setVersion] = useState("");
  const [status, setStatus] = useState<"Pending" | "Approved" | "Restricted" | "Blocked">("Pending");
  const [approver, setApprover] = useState("");
  const [useCasesCount, setUseCasesCount] = useState("1");
  const [statusDate, setStatusDate] = useState("");

  // Mocked Model Risks Data

  const [modelRisks, setModelRisks] = useState<ModelRiskItem[]>([
    { id: "RSK-M1", name: "Large Language Model Hallucination & Drift", severity: "HIGH", status: "IN PROGRESS", model: "GPT-4o", owner: "Demo Assessor", description: "Inaccurate factual generation and domain concept drift in automated output.", mitigationPlan: "Implement automated guardrails and human-in-the-loop validation." },
    { id: "RSK-M2", name: "Training Data Leakage / PII Exposure", severity: "CRITICAL", status: "NOT STARTED", model: "Claude Opus", owner: "Mark Taylor", description: "Unintended exposure of sensitive personal information in fine-tuned model prompts.", mitigationPlan: "Run PII anonymization pre-filters prior to model ingestion." },
    { id: "RSK-M3", name: "Prompt Injection & Jailbreaking Vulnerability", severity: "MEDIUM", status: "COMPLETED", model: "Gemini 3", owner: "Leo Vance", description: "Malicious user prompt manipulation bypassing system safety instructions.", mitigationPlan: "Deployed system instruction wrappers and input sanitization APIs." },
    { id: "RSK-M4", name: "Algorithmic Bias and Discrimination in Scores", severity: "HIGH", status: "IN PROGRESS", model: "Custom Churn XGBoost", owner: "Demo Assessor", description: "Disparate impact across protected demographic features in scoring models.", mitigationPlan: "Conduct fair learning re-weighting and demographic parity audits." }
  ]);

  // Model Risks Modal & Editing State
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<ModelRiskItem | null>(null);
  const [selectedRiskDetail, setSelectedRiskDetail] = useState<ModelRiskItem | null>(null);

  const [mrName, setMrName] = useState("");
  const [mrSeverity, setMrSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [mrStatus, setMrStatus] = useState<"NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "ON HOLD">("IN PROGRESS");
  const [mrModel, setMrModel] = useState("");
  const [mrOwner, setMrOwner] = useState("");
  const [mrDescription, setMrDescription] = useState("");
  const [mrMitigationPlan, setMrMitigationPlan] = useState("");

  // Filters for Model Risk Tab
  const [riskSearchQuery, setRiskSearchQuery] = useState("");
  const [riskSeverityFilter, setRiskSeverityFilter] = useState<string>("ALL");
  const [riskStatusFilter, setRiskStatusFilter] = useState<string>("ALL");

  const handleOpenAddRisk = () => {
    setEditingRisk(null);
    setMrName("");
    setMrSeverity("HIGH");
    setMrStatus("IN PROGRESS");
    setMrModel(models.length > 0 ? models[0].name : "GPT-4o");
    setMrOwner(team.length > 0 ? team[0].name : "Demo Assessor");
    setMrDescription("");
    setMrMitigationPlan("");
    setIsRiskModalOpen(true);
  };

  const handleOpenEditRisk = (r: ModelRiskItem) => {
    setEditingRisk(r);
    setMrName(r.name);
    setMrSeverity(r.severity);
    setMrStatus(r.status);
    setMrModel(r.model);
    setMrOwner(r.owner);
    setMrDescription(r.description || "");
    setMrMitigationPlan(r.mitigationPlan || "");
    setIsRiskModalOpen(true);
  };

  const handleDeleteRiskClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete model risk "${name}"?`)) {
      setModelRisks(prev => prev.filter(r => r.id !== id));
      if (selectedRiskDetail?.id === id) {
        setSelectedRiskDetail(null);
      }
    }
  };

  const handleQuickRiskSeverityChange = (r: ModelRiskItem, newSeverity: ModelRiskItem["severity"]) => {
    const updated = { ...r, severity: newSeverity };
    setModelRisks(prev => prev.map(item => item.id === r.id ? updated : item));
    if (selectedRiskDetail?.id === r.id) {
      setSelectedRiskDetail(updated);
    }
  };

  const handleQuickRiskStatusChange = (r: ModelRiskItem, newStatus: ModelRiskItem["status"]) => {
    const updated = { ...r, status: newStatus };
    setModelRisks(prev => prev.map(item => item.id === r.id ? updated : item));
    if (selectedRiskDetail?.id === r.id) {
      setSelectedRiskDetail(updated);
    }
  };

  const handleRiskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mrName) return;

    if (editingRisk) {
      const updated: ModelRiskItem = {
        ...editingRisk,
        name: mrName,
        severity: mrSeverity,
        status: mrStatus,
        model: mrModel || "GPT-4o",
        owner: mrOwner || "Demo Assessor",
        description: mrDescription,
        mitigationPlan: mrMitigationPlan
      };
      setModelRisks(prev => prev.map(item => item.id === editingRisk.id ? updated : item));
      if (selectedRiskDetail?.id === editingRisk.id) {
        setSelectedRiskDetail(updated);
      }
    } else {
      const newRisk: ModelRiskItem = {
        id: `RSK-M${modelRisks.length + 1}`,
        name: mrName,
        severity: mrSeverity,
        status: mrStatus,
        model: mrModel || "GPT-4o",
        owner: mrOwner || "Demo Assessor",
        description: mrDescription,
        mitigationPlan: mrMitigationPlan
      };
      setModelRisks(prev => [newRisk, ...prev]);
    }

    setIsRiskModalOpen(false);
    setEditingRisk(null);
  };

  const filteredModelRisks = modelRisks.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(riskSearchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(riskSearchQuery.toLowerCase()) ||
      r.model.toLowerCase().includes(riskSearchQuery.toLowerCase()) ||
      r.owner.toLowerCase().includes(riskSearchQuery.toLowerCase());

    const matchesSeverity = riskSeverityFilter === "ALL" || r.severity === riskSeverityFilter;
    const matchesStatus = riskStatusFilter === "ALL" || r.status === riskStatusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Mocked Evidence Hub Data
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([
    { id: "EVD-M1", docName: "Gemini 3 alignment red-teaming report.pdf", type: "Evaluation Log", date: "12-03-2026", uploader: "Demo Assessor", size: "2.4 MB", model: "Gemini 3", notes: "Red-teaming evaluation on model alignment and jailbreak resistance." },
    { id: "EVD-M2", docName: "GPT-4o RLHF safety assessment certificate.pdf", type: "Third-party Cert", date: "05-06-2026", uploader: "Leo Vance", size: "1.8 MB", model: "GPT-4o", notes: "External alignment assessment and safety policy certificate." },
    { id: "EVD-M3", docName: "Claude Opus boundary limit test results.docx", type: "Security Trace", date: "24-04-2026", uploader: "Mark Taylor", size: "3.1 MB", model: "Claude Opus", notes: "Adversarial prompt evaluation and boundary test traces." },
    { id: "EVD-M4", docName: "Enterprise LLM acceptable use agreement.pdf", type: "Policy", date: "15-05-2026", uploader: "Demo Assessor", size: "850 KB", model: "All Models", notes: "Corporate policy governing generative AI model usage across enterprise." }
  ]);

  // Evidence Hub Filters & Modals
  const [evidenceSearchQuery, setEvidenceSearchQuery] = useState("");
  const [evidenceTypeFilter, setEvidenceTypeFilter] = useState("ALL");

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<EvidenceItem | null>(null);
  const [selectedEvidenceDetail, setSelectedEvidenceDetail] = useState<EvidenceItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [evDocName, setEvDocName] = useState("");
  const [evType, setEvType] = useState("Evaluation Log");
  const [evUploader, setEvUploader] = useState("Demo Assessor");
  const [evModel, setEvModel] = useState("All Models");
  const [evNotes, setEvNotes] = useState("");
  const [evSize, setEvSize] = useState("");
  const [evFileDataUrl, setEvFileDataUrl] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleOpenAddEvidence = () => {
    setEditingEvidence(null);
    setEvDocName("");
    setEvType("Evaluation Log");
    setEvUploader(team.length > 0 ? team[0].name : "Demo Assessor");
    setEvModel(models.length > 0 ? models[0].name : "All Models");
    setEvNotes("");
    setEvSize("");
    setEvFileDataUrl(undefined);
    setSelectedFile(null);
    setIsEvidenceModalOpen(true);
  };

  const handleOpenEditEvidence = (ev: EvidenceItem) => {
    setEditingEvidence(ev);
    setEvDocName(ev.docName);
    setEvType(ev.type);
    setEvUploader(ev.uploader);
    setEvModel(ev.model || "All Models");
    setEvNotes(ev.notes || "");
    setEvSize(ev.size);
    setEvFileDataUrl(ev.fileDataUrl);
    setSelectedFile(null);
    setIsEvidenceModalOpen(true);
  };

  const handleDeleteEvidenceClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete evidence document "${name}"?`)) {
      setEvidenceItems(prev => prev.filter(e => e.id !== id));
      if (selectedEvidenceDetail?.id === id) {
        setSelectedEvidenceDetail(null);
      }
    }
  };

  const processFileSelection = (file: File) => {
    setSelectedFile(file);
    let formattedSize = "1.0 MB";
    if (file.size < 1024 * 1024) {
      formattedSize = Math.max(1, Math.round(file.size / 1024)) + " KB";
    } else {
      formattedSize = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    }
    setEvSize(formattedSize);
    if (!evDocName) {
      setEvDocName(file.name);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setEvFileDataUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFileSelection(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evDocName) return;

    const todayStr = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

    if (editingEvidence) {
      const updated: EvidenceItem = {
        ...editingEvidence,
        docName: evDocName,
        type: evType,
        uploader: evUploader || "Demo Assessor",
        model: evModel || "All Models",
        notes: evNotes,
        size: evSize || editingEvidence.size,
        fileDataUrl: evFileDataUrl || editingEvidence.fileDataUrl,
        fileName: selectedFile?.name || editingEvidence.fileName || evDocName
      };
      setEvidenceItems(prev => prev.map(item => item.id === editingEvidence.id ? updated : item));
      if (selectedEvidenceDetail?.id === editingEvidence.id) {
        setSelectedEvidenceDetail(updated);
      }
    } else {
      const newEv: EvidenceItem = {
        id: `EVD-M${evidenceItems.length + 1}`,
        docName: evDocName,
        type: evType,
        date: todayStr,
        uploader: evUploader || "Demo Assessor",
        size: evSize || "1.2 MB",
        model: evModel || "All Models",
        notes: evNotes,
        fileDataUrl: evFileDataUrl,
        fileName: selectedFile?.name || evDocName
      };
      setEvidenceItems(prev => [newEv, ...prev]);
    }

    setIsEvidenceModalOpen(false);
    setEditingEvidence(null);
  };

  const handleDownloadEvidence = (ev: EvidenceItem) => {
    if (ev.fileDataUrl) {
      const a = document.createElement("a");
      a.href = ev.fileDataUrl;
      a.download = ev.fileName || ev.docName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const blob = new Blob(
        [`EVIDENCE DOCUMENT RECORD\nDocument: ${ev.docName}\nType: ${ev.type}\nModel: ${ev.model || "N/A"}\nUploaded By: ${ev.uploader}\nDate: ${ev.date}\nNotes: ${ev.notes || "N/A"}`],
        { type: "text/plain" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = ev.docName.endsWith(".pdf") || ev.docName.endsWith(".docx") ? ev.docName : `${ev.docName}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const filteredEvidenceItems = evidenceItems.filter(e => {
    const matchesSearch =
      e.docName.toLowerCase().includes(evidenceSearchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(evidenceSearchQuery.toLowerCase()) ||
      e.uploader.toLowerCase().includes(evidenceSearchQuery.toLowerCase()) ||
      (e.model && e.model.toLowerCase().includes(evidenceSearchQuery.toLowerCase())) ||
      (e.notes && e.notes.toLowerCase().includes(evidenceSearchQuery.toLowerCase()));

    const matchesType = evidenceTypeFilter === "ALL" || e.type === evidenceTypeFilter;

    return matchesSearch && matchesType;
  });

  const handleOpenAddModel = () => {
    setEditingModel(null);
    setProvider("");
    setModelName("");
    setVersion("");
    setStatus("Pending");
    setApprover("");
    setUseCasesCount("1");
    setStatusDate("");
    setIsModalOpen(true);
  };

  const handleOpenEditModel = (model: ModelRecord) => {
    setEditingModel(model);
    setProvider(model.provider);
    setModelName(model.name);
    setVersion(model.version);
    setStatus(model.status);
    setApprover(model.approver);
    setUseCasesCount((model.useCasesCount || 0).toString());
    setStatusDate(model.statusDate || "");
    setIsModalOpen(true);
  };

  const handleDeleteModelClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove model "${name}" from the registry?`)) {
      if (onDeleteModel) {
        onDeleteModel(id);
      }
      if (selectedModelDetail?.id === id) {
        setSelectedModelDetail(null);
      }
    }
  };

  const handleQuickStatusChange = (m: ModelRecord, newStatus: ModelRecord["status"]) => {
    const updated: ModelRecord = {
      ...m,
      status: newStatus,
      statusDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-")
    };
    if (onUpdateModel) {
      onUpdateModel(updated);
    }
    if (selectedModelDetail?.id === m.id) {
      setSelectedModelDetail(updated);
    }
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !modelName) return;

    const formattedStatusDate = statusDate || (editingModel?.statusDate || new Date().toLocaleDateString("en-GB").replace(/\//g, "-"));

    if (editingModel) {
      const updatedModel: ModelRecord = {
        ...editingModel,
        provider,
        name: modelName,
        version: version || "1.0",
        status,
        approver: approver || "Demo Assessor",
        statusDate: formattedStatusDate,
        useCasesCount: parseInt(useCasesCount) || 0
      };
      if (onUpdateModel) {
        onUpdateModel(updatedModel);
      }
      if (selectedModelDetail?.id === editingModel.id) {
        setSelectedModelDetail(updatedModel);
      }
    } else {
      const newModel: ModelRecord = {
        id: `mod-${models.length + 1}`,
        provider,
        name: modelName,
        version: version || "1.0",
        status,
        approver: approver || "Demo Assessor",
        statusDate: formattedStatusDate,
        useCasesCount: parseInt(useCasesCount) || 0
      };
      onAddModel(newModel);
    }

    setIsModalOpen(false);
    setEditingModel(null);

    // Reset Form
    setProvider("");
    setModelName("");
    setVersion("");
    setStatus("Pending");
    setApprover("");
    setUseCasesCount("1");
    setStatusDate("");
  };

  // Metrics calculation
  const totalCount = models.length;
  const approvedCount = models.filter((m) => m.status === "Approved").length;
  const restrictedCount = models.filter((m) => m.status === "Restricted").length;
  const pendingCount = models.filter((m) => m.status === "Pending").length;
  const blockedCount = models.filter((m) => m.status === "Blocked").length;

  // Filter models based on search query and status filter
  const filteredModels = models.filter((m) => {
    const term = searchQuery.toLowerCase();
    const matchesQuery =
      m.name.toLowerCase().includes(term) ||
      m.provider.toLowerCase().includes(term) ||
      m.status.toLowerCase().includes(term) ||
      m.approver.toLowerCase().includes(term) ||
      m.version.toLowerCase().includes(term);
    const matchesStatus = modelStatusFilter === "ALL" || m.status === modelStatusFilter;
    return matchesQuery && matchesStatus;
  });

  // Paginated Models
  const totalPages = Math.ceil(filteredModels.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedModels = filteredModels.slice(startIndex, startIndex + itemsPerPage);

  // Status Badge Class Generator
  const getStatusBadgeClass = (statusStr: string) => {
    switch (statusStr) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Blocked":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      case "Restricted":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header with Title & Inventory Toggle */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight" id="title-model-registry">
            Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized register of authorized foundation models, LLMs, and customized algorithms.
          </p>
        </div>
        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
          <button
            type="button"
            onClick={() => onNavigateToPage?.("projects")}
            className="px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-slate-500 hover:text-slate-900"
            id="tab-projects-register"
          >
            AI Projects Register
          </button>
          <button
            type="button"
            onClick={() => onNavigateToPage?.("models")}
            className="px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer bg-white text-slate-900 shadow-sm border border-slate-200/50"
            id="tab-model-registry"
          >
            Model Registry
          </button>
        </div>
      </div>

      {/* 2. REGISTRY OVERVIEW Metrics Grid (Matches visual from screenshot) */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
          Registry Overview
        </span>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Total */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{totalCount}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total</span>
            </div>
            <BrainCircuit className="w-5 h-5 text-indigo-500/80" />
          </div>

          {/* Approved */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-600">{approvedCount}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Approved</span>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-500/80" />
          </div>

          {/* Restricted */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-purple-600">{restrictedCount}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Restricted</span>
            </div>
            <HelpCircle className="w-5 h-5 text-purple-500/80" />
          </div>

          {/* Pending */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-500">{pendingCount}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pending</span>
            </div>
            <Clock className="w-5 h-5 text-amber-500/80" />
          </div>

          {/* Blocked */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-rose-600">{blockedCount}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Blocked</span>
            </div>
            <Ban className="w-5 h-5 text-rose-500/80" />
          </div>
        </div>
      </div>

      {/* 3. Workspace Split Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        
        {/* Left Column: WORKSPACE NAVIGATION */}
        <div className="lg:col-span-3 border-r border-slate-200 p-5 bg-slate-50/40">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
            Workspace
          </span>
          
          <nav className="space-y-1.5">
            {/* Models Link */}
            <button
              onClick={() => {
                setActiveWorkspaceTab("models");
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeWorkspaceTab === "models"
                  ? "bg-white text-indigo-650 border border-slate-200 shadow-sm font-bold"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BrainCircuit className={`w-4 h-4 ${activeWorkspaceTab === "models" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>Models</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                activeWorkspaceTab === "models" ? "bg-indigo-100 text-indigo-750" : "bg-slate-200 text-slate-500"
              }`}>
                {totalCount}
              </span>
            </button>

            {/* Market Assessment Scanner Link */}
            <button
              onClick={() => {
                setActiveWorkspaceTab("scanner");
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeWorkspaceTab === "scanner"
                  ? "bg-white text-indigo-650 border border-slate-200 shadow-sm font-bold"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className={`w-4 h-4 ${activeWorkspaceTab === "scanner" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>Market scanner</span>
              </div>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-md">
                Live
              </span>
            </button>

            {/* Weekly Runbook & CLI Link */}
            <button
              onClick={() => {
                setActiveWorkspaceTab("weekly_guide");
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeWorkspaceTab === "weekly_guide"
                  ? "bg-white text-indigo-650 border border-slate-200 shadow-sm font-bold"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Terminal className={`w-4 h-4 ${activeWorkspaceTab === "weekly_guide" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>Weekly runbook & CLI</span>
              </div>
              <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded-md">
                SOP
              </span>
            </button>

            {/* Model Risks Link */}
            <button
              onClick={() => {
                setActiveWorkspaceTab("risks");
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeWorkspaceTab === "risks"
                  ? "bg-white text-indigo-650 border border-slate-200 shadow-sm font-bold"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className={`w-4 h-4 ${activeWorkspaceTab === "risks" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>Model risks</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">
                {modelRisks.length}
              </span>
            </button>

            {/* Evidence Hub Link */}
            <button
              onClick={() => {
                setActiveWorkspaceTab("evidence");
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeWorkspaceTab === "evidence"
                  ? "bg-white text-indigo-650 border border-slate-200 shadow-sm font-bold"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className={`w-4 h-4 ${activeWorkspaceTab === "evidence" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>Evidence hub</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">
                {evidenceItems.length}
              </span>
            </button>
          </nav>

          {/* Prompt/Help card in sidebar */}
          <div className="mt-8 bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-750 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>EU AI Act Alignment</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              High-risk models must undergo comprehensive algorithmic impact assessments. Maintain up-to-date compliance traces in the Evidence Hub.
            </p>
          </div>
        </div>

        {/* Right Column: CONTENT SPACE */}
        <div className="lg:col-span-9 p-6 space-y-6">
          
          {/* TAB 1: Models Listing */}
          {activeWorkspaceTab === "models" && (
            <div className="space-y-5 animate-fade-in">
              {/* Internal View Title & Button Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Models</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    AI/LLM registry — search, add, edit, and continuous market security review.
                  </p>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsImportExportModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                    id="btn-import-export-models"
                    title="Import JSON feed or export approved whitelist"
                  >
                    <FileCode className="w-4 h-4 text-indigo-600" />
                    <span>Import / Export JSON</span>
                  </button>

                  <button
                    onClick={() => setActiveWorkspaceTab("scanner")}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-750 border border-indigo-200 text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                    id="btn-open-market-scanner"
                    title="Continuous review & auto-assessment of emerging LLMs on the market"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Market Scanner</span>
                  </button>

                  <button
                    onClick={handleOpenAddModel}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                    id="btn-add-model"
                  >
                    <Plus className="w-4 h-4" />
                    Add new model
                  </button>
                </div>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search models by name, provider, approver, version..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 transition-all text-left"
                    id="search-models-input"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 overflow-x-auto">
                  {(["ALL", "Approved", "Pending", "Restricted", "Blocked"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setModelStatusFilter(st);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        modelStatusFilter === st
                          ? "bg-white text-indigo-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {st === "ALL" ? "All Statuses" : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Models Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="p-4 pl-5">Provider</th>
                        <th className="p-4">Model</th>
                        <th className="p-4">Version</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">GRC Score</th>
                        <th className="p-4">Approver</th>
                        <th className="p-4">Status Date</th>
                        <th className="p-4">Use Cases</th>
                        <th className="p-4 pr-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedModels.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-xs text-slate-400">
                            No matching registered models found.
                          </td>
                        </tr>
                      ) : (
                        paginatedModels.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50/50 transition-colors text-xs text-slate-700">
                            <td className="p-4 pl-5 font-medium text-slate-500">{m.provider}</td>
                            <td className="p-4">
                              <button
                                type="button"
                                onClick={() => setSelectedModelDetail(m)}
                                className="font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer text-left"
                              >
                                {m.name}
                              </button>
                            </td>
                            <td className="p-4 font-mono text-slate-500">{m.version}</td>
                            <td className="p-4">
                              <select
                                value={m.status}
                                onChange={(e) => handleQuickStatusChange(m, e.target.value as any)}
                                className={`text-[10px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer transition-all ${getStatusBadgeClass(m.status)}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Restricted">Restricted</option>
                                <option value="Blocked">Blocked</option>
                              </select>
                            </td>
                            <td className="p-4">
                              {m.securityScore !== undefined ? (
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                      m.securityScore >= 85
                                        ? "bg-emerald-100 text-emerald-800"
                                        : m.securityScore >= 65
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-rose-100 text-rose-800"
                                    }`}
                                  >
                                    {m.securityScore}/100
                                  </span>
                                  {m.zeroDataRetention && (
                                    <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-1 py-0.5 rounded border border-blue-200">
                                      ZDR
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400">Manual</span>
                              )}
                            </td>
                            <td className="p-4 font-medium text-slate-700">{m.approver}</td>
                            <td className="p-4 text-slate-500 font-mono">{m.statusDate}</td>
                            <td className="p-4 font-bold text-slate-800 font-mono pl-8">{m.useCasesCount}</td>
                            <td className="p-4 pr-5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setSelectedModelDetail(m)}
                                  className="px-2 py-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer transition-colors"
                                  title="View details"
                                >
                                  View
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModel(m)}
                                  className="px-2 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded text-xs font-semibold cursor-pointer transition-colors"
                                  title="Edit model"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteModelClick(m.id, m.name)}
                                  className="px-2 py-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded text-xs font-semibold cursor-pointer transition-colors"
                                  title="Delete model"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls Footer */}
                <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 select-none">
                  <span>
                    Showing {filteredModels.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + itemsPerPage, filteredModels.length)} of {filteredModels.length} models
                  </span>
                  
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ChevronsLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    
                    <span className="font-medium text-slate-700 px-2">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ChevronsRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Market Auto-Assessment Scanner */}
          {activeWorkspaceTab === "scanner" && (
            <MarketAssessmentScanner
              onIngestModel={(model) => onAddModel(model)}
              onBatchIngestModels={(batch) => handleBatchImport(batch, "merge")}
              existingModels={models}
              workspaceId={workspaceId}
              onNavigateToWeeklyGuide={() => setActiveWorkspaceTab("weekly_guide")}
            />
          )}

          {/* TAB: Weekly Runbook & CLI Ingestion Guide */}
          {activeWorkspaceTab === "weekly_guide" && (
            <WeeklyAutomationGuideView
              onNavigateToScanner={() => setActiveWorkspaceTab("scanner")}
              onNavigateToImport={() => setIsImportExportModalOpen(true)}
            />
          )}

          {/* TAB 2: Model Risks */}
          {activeWorkspaceTab === "risks" && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Model Risks</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Algorithm-specific vulnerabilities, drift risks, and safety mitigation plans.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddRisk}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                  id="btn-add-model-risk"
                >
                  <Plus className="w-4 h-4" /> Add Model Risk
                </button>
              </div>

              {/* Search & Severity Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search model risks by description, model, owner, risk ID..."
                    value={riskSearchQuery}
                    onChange={(e) => setRiskSearchQuery(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 transition-all text-left"
                    id="search-model-risks-input"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 overflow-x-auto">
                  {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setRiskSeverityFilter(sev)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        riskSeverityFilter === sev
                          ? "bg-white text-indigo-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {sev === "ALL" ? "All Severities" : sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Risks Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="p-4 pl-5">Risk ID</th>
                        <th className="p-4">Risk Description</th>
                        <th className="p-4">Severity</th>
                        <th className="p-4">Mitigation Status</th>
                        <th className="p-4">Mapped Model</th>
                        <th className="p-4">Owner</th>
                        <th className="p-4 pr-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredModelRisks.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-xs text-slate-400">
                            No model risks matching current search or filters.
                          </td>
                        </tr>
                      ) : (
                        filteredModelRisks.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 pl-5 font-mono font-bold text-slate-400">{r.id}</td>
                            <td className="p-4">
                              <button
                                type="button"
                                onClick={() => setSelectedRiskDetail(r)}
                                className="font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer text-left"
                              >
                                {r.name}
                              </button>
                            </td>
                            <td className="p-4">
                              <select
                                value={r.severity}
                                onChange={(e) => handleQuickRiskSeverityChange(r, e.target.value as any)}
                                className={`text-[10px] font-extrabold px-2 py-1 rounded-lg border outline-none cursor-pointer transition-all ${
                                  r.severity === "CRITICAL"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : r.severity === "HIGH"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : r.severity === "MEDIUM"
                                    ? "bg-slate-100 text-slate-700 border-slate-200"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                }`}
                              >
                                <option value="CRITICAL">CRITICAL</option>
                                <option value="HIGH">HIGH</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="LOW">LOW</option>
                              </select>
                            </td>
                            <td className="p-4">
                              <select
                                value={r.status}
                                onChange={(e) => handleQuickRiskStatusChange(r, e.target.value as any)}
                                className={`text-[10px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer transition-all ${
                                  r.status === "COMPLETED"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : r.status === "IN PROGRESS"
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                    : r.status === "NOT STARTED"
                                    ? "bg-slate-100 text-slate-600 border-slate-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                <option value="IN PROGRESS">IN PROGRESS</option>
                                <option value="NOT STARTED">NOT STARTED</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="ON HOLD">ON HOLD</option>
                              </select>
                            </td>
                            <td className="p-4 font-medium text-slate-600">{r.model}</td>
                            <td className="p-4 text-slate-700 font-medium">{r.owner}</td>
                            <td className="p-4 pr-5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRiskDetail(r)}
                                  className="px-2 py-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer transition-colors"
                                  title="View details"
                                >
                                  View
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditRisk(r)}
                                  className="px-2 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded text-xs font-semibold cursor-pointer transition-colors"
                                  title="Edit risk"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRiskClick(r.id, r.name)}
                                  className="px-2 py-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded text-xs font-semibold cursor-pointer transition-colors"
                                  title="Delete risk"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Evidence Hub */}
          {activeWorkspaceTab === "evidence" && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Evidence Hub</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Alignment proofs, evaluation logs, red-teaming reports, and certifications for registered AI models.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddEvidence}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                  id="btn-upload-evidence-doc"
                >
                  <Upload className="w-4 h-4" /> Upload Document
                </button>
              </div>

              {/* Quick Drop Area / Banner */}
              <div
                onClick={handleOpenAddEvidence}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                  handleDrop(e);
                  handleOpenAddEvidence();
                }}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50/60 scale-[1.01]"
                    : "border-slate-200 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-300"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600">
                  <FileUp className="w-4 h-4 text-indigo-600" />
                  <span>
                    Drag & drop evidence files here or <span className="text-indigo-600 font-bold underline">browse to upload</span>
                  </span>
                </div>
              </div>

              {/* Search & Type Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search evidence documents by title, model, uploader, notes..."
                    value={evidenceSearchQuery}
                    onChange={(e) => setEvidenceSearchQuery(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 transition-all text-left"
                    id="search-evidence-input"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 overflow-x-auto">
                  {(["ALL", "Evaluation Log", "Third-party Cert", "Security Trace", "Policy", "Red-Teaming Report"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEvidenceTypeFilter(t)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        evidenceTypeFilter === t
                          ? "bg-white text-indigo-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {t === "ALL" ? "All Types" : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Evidence Cards */}
              {filteredEvidenceItems.length === 0 ? (
                <div className="p-12 text-center border border-slate-200 rounded-2xl bg-white">
                  <FileCheck2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No evidence documents found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 mb-4">
                    Try adjusting your search query or upload a new compliance document.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAddEvidence}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Upload First Document
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEvidenceItems.map((e) => (
                    <div
                      key={e.id}
                      className="bg-white p-4.5 rounded-xl border border-slate-200/70 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <FileCheck2 className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-extrabold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                  {e.type}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">
                                  {e.size}
                                </span>
                                {e.model && (
                                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                    {e.model}
                                  </span>
                                )}
                              </div>
                              <h4
                                onClick={() => setSelectedEvidenceDetail(e)}
                                className="text-xs font-bold text-slate-900 mt-1.5 block hover:text-indigo-600 transition-colors cursor-pointer leading-snug"
                                title={e.docName}
                              >
                                {e.docName}
                              </h4>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] font-bold text-slate-300">
                            {e.id}
                          </span>
                        </div>

                        {e.notes && (
                          <p className="text-[11px] text-slate-500 mt-2.5 line-clamp-2 leading-relaxed bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                            {e.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-slate-100 text-[11px] text-slate-400">
                        <span>
                          Uploaded by <strong className="text-slate-700">{e.uploader}</strong> on {e.date}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedEvidenceDetail(e)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                            title="Inspect metadata"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadEvidence(e)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer transition-colors"
                            title="Download document"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditEvidence(e)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer transition-colors"
                            title="Edit details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvidenceClick(e.id, e.docName)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                            title="Delete document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 4. ADD / EDIT MODEL DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-sans">
                  {editingModel ? `Edit Model: ${editingModel.name}` : "Add new model"}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {editingModel
                    ? "Update model attributes, versioning, approval status, and assignment."
                    : "Register an AI/LLM model in the compliance directory."}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingModel(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-3.5">
                {/* Provider */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Provider *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Anthropic, OpenAI, Meta"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Model Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gemini, Opus, GPT-4o"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Version */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Version</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.5 Pro, 3.5 Sonnet, 4.0"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Approval Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Restricted">Restricted</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                {/* Approver */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Approver</label>
                  <select
                    value={approver}
                    onChange={(e) => setApprover(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select approver</option>
                    {team.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Date */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Status Date</label>
                  <input
                    type="text"
                    placeholder="e.g. DD-MM-YYYY (or leave blank for today)"
                    value={statusDate}
                    onChange={(e) => setStatusDate(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                {/* Linked Use Cases */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Linked Use Cases Count</label>
                  <input
                    type="number"
                    min="0"
                    value={useCasesCount}
                    onChange={(e) => setUseCasesCount(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none font-mono focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                {editingModel ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (editingModel) {
                        handleDeleteModelClick(editingModel.id, editingModel.name);
                        setIsModalOpen(false);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                  >
                    Delete Model
                  </button>
                ) : <div />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingModel(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer transition-all"
                    id="btn-confirm-add-model"
                  >
                    {editingModel ? "Save Changes" : "Add Model"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODEL DETAIL / PROFILE MODAL */}
      {selectedModelDetail && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {selectedModelDetail.provider} Model Card
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-base font-bold text-slate-900">{selectedModelDetail.name}</h3>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${getStatusBadgeClass(selectedModelDetail.status)}`}>
                    {selectedModelDetail.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedModelDetail(null)}
                className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-5 text-xs text-slate-700">
              {/* Profile Meta Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Version</span>
                  <span className="text-xs font-mono font-bold text-slate-800 mt-1 block">{selectedModelDetail.version}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Approver</span>
                  <span className="text-xs font-semibold text-slate-700 mt-1 block">{selectedModelDetail.approver}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Status Date</span>
                  <span className="text-xs font-mono font-semibold text-slate-700 mt-1 block">{selectedModelDetail.statusDate}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Use Cases</span>
                  <span className="text-xs font-mono font-bold text-slate-900 mt-1 block">{selectedModelDetail.useCasesCount}</span>
                </div>
              </div>

              {/* Quick Status Control */}
              <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-900 block">Change Approval Status</span>
                  <span className="text-[10px] text-indigo-700">Update deployment authorization state instantly.</span>
                </div>
                <select
                  value={selectedModelDetail.status}
                  onChange={(e) => handleQuickStatusChange(selectedModelDetail, e.target.value as any)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${getStatusBadgeClass(selectedModelDetail.status)}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Restricted">Restricted</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              {/* GRC Security Architecture Scorecard (if available) */}
              {selectedModelDetail.securityScore !== undefined && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>GRC Security Architect Scorecard</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                      Score: {selectedModelDetail.securityScore} / 100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-150">
                      <span className="text-slate-500">Zero Retention (ZDR):</span>
                      <span className="font-bold text-slate-800">
                        {selectedModelDetail.zeroDataRetention ? "Verified (Yes)" : "Standard (No)"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-150">
                      <span className="text-slate-500">Training Opt-Out:</span>
                      <span className="font-bold text-slate-800">
                        {selectedModelDetail.trainingOptOut ? "Guaranteed" : "Opt-In Needed"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-150">
                      <span className="text-slate-500">SOC 2 / ISO 27001:</span>
                      <span className="font-bold text-slate-800">
                        {selectedModelDetail.soc2Certified ? "Certified" : "Pending"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-150">
                      <span className="text-slate-500">EU AI Act Tier:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[110px]" title={selectedModelDetail.euAiActTier}>
                        {selectedModelDetail.euAiActTier || "General"}
                      </span>
                    </div>
                  </div>

                  {selectedModelDetail.dataResidency && (
                    <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-150">
                      <span className="font-semibold text-slate-700">Data Residency: </span>
                      {selectedModelDetail.dataResidency}
                    </div>
                  )}

                  {selectedModelDetail.notes && (
                    <p className="text-[11px] text-slate-600 bg-indigo-50/40 p-2.5 rounded-lg border border-indigo-100 italic leading-relaxed">
                      {selectedModelDetail.notes}
                    </p>
                  )}
                </div>
              )}

              {/* Associated Risks */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Associated Model Risks ({modelRisks.filter(r => r.model.toLowerCase().includes(selectedModelDetail.name.toLowerCase())).length})
                </h4>
                {modelRisks.filter(r => r.model.toLowerCase().includes(selectedModelDetail.name.toLowerCase())).length === 0 ? (
                  <p className="text-slate-400 italic text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                    No active risks directly linked to this model.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {modelRisks.filter(r => r.model.toLowerCase().includes(selectedModelDetail.name.toLowerCase())).map(r => (
                      <div key={r.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800 block text-xs">{r.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{r.id} • Owner: {r.owner}</span>
                        </div>
                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded border ${
                          r.severity === "CRITICAL"
                            ? "bg-rose-50 text-rose-700 border-rose-100"
                            : r.severity === "HIGH"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-slate-100 text-slate-700"
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
                onClick={() => handleDeleteModelClick(selectedModelDetail.id, selectedModelDetail.name)}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
              >
                Delete Model
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModelDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEditModel(selectedModelDetail);
                    setSelectedModelDetail(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Edit Model
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. ADD / EDIT MODEL RISK MODAL */}
      {isRiskModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingRisk ? `Edit Model Risk: ${editingRisk.id}` : "Register New Model Risk"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingRisk
                    ? "Update vulnerability parameters, mitigation status, and assigned owner."
                    : "Define a new model-specific risk, mitigation plan, and owner."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRiskModalOpen(false);
                  setEditingRisk(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRiskSubmit} className="p-5 space-y-4">
              {/* Risk Description / Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Risk Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Large Language Model Hallucination & Drift"
                  value={mrName}
                  onChange={(e) => setMrName(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  id="input-risk-description"
                />
              </div>

              {/* Severity & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Severity</label>
                  <select
                    value={mrSeverity}
                    onChange={(e) => setMrSeverity(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Mitigation Status</label>
                  <select
                    value={mrStatus}
                    onChange={(e) => setMrStatus(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold"
                  >
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="NOT STARTED">NOT STARTED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ON HOLD">ON HOLD</option>
                  </select>
                </div>
              </div>

              {/* Mapped Model & Owner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Mapped Model</label>
                  <select
                    value={mrModel}
                    onChange={(e) => setMrModel(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.provider})
                      </option>
                    ))}
                    <option value="Custom Model">Custom Model</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Assigned Owner</label>
                  <select
                    value={mrOwner}
                    onChange={(e) => setMrOwner(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    {team.map((mem) => (
                      <option key={mem.id} value={mem.name}>
                        {mem.name}
                      </option>
                    ))}
                    <option value="Demo Assessor">Demo Assessor</option>
                  </select>
                </div>
              </div>

              {/* Extended Risk Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Risk Details</label>
                <textarea
                  rows={2}
                  placeholder="Describe the technical risk mechanism or failure mode..."
                  value={mrDescription}
                  onChange={(e) => setMrDescription(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Mitigation Plan */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Mitigation Plan</label>
                <textarea
                  rows={2}
                  placeholder="Steps taken or required to address this risk..."
                  value={mrMitigationPlan}
                  onChange={(e) => setMrMitigationPlan(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                {editingRisk ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (editingRisk) {
                        handleDeleteRiskClick(editingRisk.id, editingRisk.name);
                        setIsRiskModalOpen(false);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                  >
                    Delete Risk
                  </button>
                ) : <div />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRiskModalOpen(false);
                      setEditingRisk(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer transition-all"
                    id="btn-confirm-save-model-risk"
                  >
                    {editingRisk ? "Save Changes" : "Create Model Risk"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODEL RISK DETAIL MODAL */}
      {selectedRiskDetail && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  {selectedRiskDetail.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedRiskDetail.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRiskDetail(null)}
                className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Severity</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded inline-block mt-1 ${
                    selectedRiskDetail.severity === "CRITICAL"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : selectedRiskDetail.severity === "HIGH"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : selectedRiskDetail.severity === "MEDIUM"
                      ? "bg-slate-100 text-slate-700 border border-slate-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    {selectedRiskDetail.severity}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Mitigation Status</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block mt-1 ${
                    selectedRiskDetail.status === "COMPLETED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : selectedRiskDetail.status === "IN PROGRESS"
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : selectedRiskDetail.status === "NOT STARTED"
                      ? "bg-slate-100 text-slate-600 border border-slate-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {selectedRiskDetail.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Mapped Model</span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 block">{selectedRiskDetail.model}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Owner</span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 block">{selectedRiskDetail.owner}</span>
                </div>
              </div>

              {/* Description */}
              {selectedRiskDetail.description && (
                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Risk Description</span>
                  <p className="text-slate-700 leading-relaxed text-xs">{selectedRiskDetail.description}</p>
                </div>
              )}

              {/* Mitigation Plan */}
              {selectedRiskDetail.mitigationPlan && (
                <div className="space-y-1 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100">
                  <span className="text-[10px] uppercase tracking-wider text-indigo-700 font-bold block">Mitigation Plan</span>
                  <p className="text-indigo-950 leading-relaxed text-xs">{selectedRiskDetail.mitigationPlan}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleDeleteRiskClick(selectedRiskDetail.id, selectedRiskDetail.name)}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
              >
                Delete Risk
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRiskDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEditRisk(selectedRiskDetail);
                    setSelectedRiskDetail(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Edit Risk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. UPLOAD / EDIT EVIDENCE MODAL */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingEvidence ? `Edit Evidence: ${editingEvidence.id}` : "Upload New Evidence Document"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingEvidence
                    ? "Update metadata, assigned model, or notes for this evidence."
                    : "Attach evaluation logs, safety certificates, or boundary reports."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEvidenceModalOpen(false);
                  setEditingEvidence(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEvidenceSubmit} className="p-5 space-y-4">
              {/* Dropzone for File Upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Attachment / File Upload <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx,.doc,.txt,.csv,.json,.xlsx,.zip"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50"
                      : selectedFile || evDocName
                      ? "border-emerald-300 bg-emerald-50/40"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
                  }`}
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Paperclip className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</p>
                          <p className="text-[10px] font-bold text-emerald-700">{evSize}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded shrink-0">
                        Change File
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs font-bold text-slate-700">
                        Click to select file or drag & drop here
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Supports PDF, DOCX, TXT, CSV, JSON (max 50MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Title / Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gemini 3 alignment red-teaming report.pdf"
                  value={evDocName}
                  onChange={(e) => setEvDocName(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  id="input-evidence-title"
                />
              </div>

              {/* Type & Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Evidence Type</label>
                  <select
                    value={evType}
                    onChange={(e) => setEvType(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold"
                  >
                    <option value="Evaluation Log">Evaluation Log</option>
                    <option value="Third-party Cert">Third-party Cert</option>
                    <option value="Security Trace">Security Trace</option>
                    <option value="Policy">Policy</option>
                    <option value="Red-Teaming Report">Red-Teaming Report</option>
                    <option value="Compliance Audit">Compliance Audit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Associated Model</label>
                  <select
                    value={evModel}
                    onChange={(e) => setEvModel(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="All Models">All Models</option>
                    {models.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.provider})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Uploader & Size override */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Assigned Uploader</label>
                  <select
                    value={evUploader}
                    onChange={(e) => setEvUploader(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    {team.map((mem) => (
                      <option key={mem.id} value={mem.name}>
                        {mem.name}
                      </option>
                    ))}
                    <option value="Demo Assessor">Demo Assessor</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">File Size Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 2.4 MB"
                    value={evSize}
                    onChange={(e) => setEvSize(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Notes / Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Notes & Summary</label>
                <textarea
                  rows={2.5}
                  placeholder="Summary of evaluation findings, safety thresholds, or audit context..."
                  value={evNotes}
                  onChange={(e) => setEvNotes(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                {editingEvidence ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (editingEvidence) {
                        handleDeleteEvidenceClick(editingEvidence.id, editingEvidence.docName);
                        setIsEvidenceModalOpen(false);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                  >
                    Delete Document
                  </button>
                ) : <div />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEvidenceModalOpen(false);
                      setEditingEvidence(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer transition-all"
                    id="btn-confirm-upload-evidence"
                  >
                    {editingEvidence ? "Save Changes" : "Upload Document"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. EVIDENCE DETAIL / INSPECT MODAL */}
      {selectedEvidenceDetail && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up text-left">
            <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  {selectedEvidenceDetail.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedEvidenceDetail.docName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvidenceDetail(null)}
                className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Type</span>
                  <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded inline-block mt-1">
                    {selectedEvidenceDetail.type}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">File Size</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">{selectedEvidenceDetail.size}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Mapped Model</span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 block">{selectedEvidenceDetail.model || "All Models"}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Uploaded By / Date</span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 block">{selectedEvidenceDetail.uploader} ({selectedEvidenceDetail.date})</span>
                </div>
              </div>

              {/* Notes */}
              {selectedEvidenceDetail.notes && (
                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Notes & Findings</span>
                  <p className="text-slate-700 leading-relaxed text-xs">{selectedEvidenceDetail.notes}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleDeleteEvidenceClick(selectedEvidenceDetail.id, selectedEvidenceDetail.docName)}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
              >
                Delete Document
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadEvidence(selectedEvidenceDetail)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEditEvidence(selectedEvidenceDetail);
                    setSelectedEvidenceDetail(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Edit Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSON Import & Export Hub Modal */}
      <ModelJsonImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        models={models}
        onImportModels={handleBatchImport}
        workspaceId={workspaceId}
      />

    </div>
  );
}
