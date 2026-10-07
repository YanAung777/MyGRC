import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Info,
  UserCheck,
  Compass,
  Wrench,
  Link as LinkIcon,
  FileText,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  ExternalLink
} from "lucide-react";
import { ControlMatrixItem, ControlEvidenceArtifact } from "../types";

export const DEFAULT_CONTROL_MATRIX_ITEMS: ControlMatrixItem[] = [
  {
    id: "C01.SEC",
    controlNumber: "C01.SEC",
    title: "Information Security Policy Framework",
    description: "Management has established and approved an information security policy framework to guide organizational security practices, regulatory compliance, and data protection.",
    objective: "To ensure that executive management provides clear direction and organizational support for information security in accordance with business requirements and regulatory standards.",
    tsc: "CC1.1",
    owner: "Security Team",
    effectiveness: "EFFECTIVE",
    implementationDetails: "Information security policies are reviewed annually by CISO and approved by executive leadership. All policies are published on internal corporate intranet portal.",
    evidenceArtifacts: [
      { id: "ea-1", type: "link", title: "Enterprise Security Policy & Governance Framework", url: "https://docs.google.com/document/d/policy-doc" },
      { id: "ea-2", type: "file", title: "InfoSec_Policy_Signed_2026.pdf" }
    ],
    remediationActivity: "No remediation required. Policy annual review on schedule for Q3.",
    responsibleManager: "Chief Information Security Officer",
    agreedImplementationDate: "2026-06-30",
    mappedRisks: ["SR01", "SR02"]
  },
  {
    id: "C02.API",
    controlNumber: "C02",
    title: "API Security & Threat Protection Standard",
    description: "All internal and external API endpoints must adhere to secure-by-design standards with automated threat detection, rate limiting, and OWASP Top 10 mitigation.",
    objective: "To ensure that API gateway services are configured securely by default and protect customer data from unauthorized exposure.",
    tsc: "CC1.2",
    owner: "Engineering",
    effectiveness: "INEFFECTIVE",
    implementationDetails: "Approved API standards dictate that all REST and GraphQL endpoints implement shift-left security testing, OAuth2 bearer authentication, and OWASP Top 10 threat detection at the API Gateway level. Security controls require automated disabling of legacy endpoints.",
    evidenceArtifacts: [
      { id: "ea-3", type: "link", title: "API Gateway Architecture & Design Standard", url: "https://docs.google.com/document/d/api-standards" },
      { id: "ea-4", type: "file", title: "API_Management_Detailed_Design.docx" },
      { id: "ea-5", type: "file", title: "Security_Remediation_Low_Level_Evidence_Phase2.pdf" }
    ],
    remediationActivity: "Enterprise API DevSecOps transformation project currently underway:\n1. Integrate interactive static & dynamic Application Security Testing (SAST/DAST) into CI/CD pipelines.\n2. Enforce Shift-Left vulnerability remediation protocols before major production deployments.",
    responsibleManager: "Director of Technology Services",
    agreedImplementationDate: "2026-09-30",
    mappedRisks: ["SR02", "SR03", "SR04", "SR05", "SR08"]
  },
  {
    id: "C03.ACC",
    controlNumber: "C03.ACC",
    title: "Logical Access Revocation & Deprovisioning",
    description: "Access to production systems, code repositories, databases, and sensitive customer data environments is revoked within 24 hours of employee or contractor termination.",
    objective: "To prevent unauthorized system access post-employment and mitigate insider threat risks.",
    tsc: "CC6.2",
    owner: "IT Operations",
    effectiveness: "NOT ASSESSED",
    implementationDetails: "Automated IdP lifecycle management integration triggers automated user account deprovisioning immediately upon HRIS status modification.",
    evidenceArtifacts: [
      { id: "ea-6", type: "file", title: "Identity_Deprovisioning_Log_Q2.xlsx" }
    ],
    remediationActivity: "Awaiting formal Q3 auditor sampling verification and automated access termination audit trail review.",
    responsibleManager: "IT Infrastructure Manager",
    agreedImplementationDate: "2026-10-15",
    mappedRisks: ["SR03", "SR06"]
  },
  {
    id: "C04.VULN",
    controlNumber: "C04.VULN",
    title: "Vulnerability Scanning & Patch Management",
    description: "Automated vulnerability scans are performed weekly across all production container images, serverless clusters, API endpoints, and cloud infrastructure.",
    objective: "To identify, analyze, and remediate technical software vulnerabilities in a timely and proactive manner.",
    tsc: "CC7.1",
    owner: "Engineering",
    effectiveness: "EFFECTIVE",
    implementationDetails: "Wiz security agent and GitHub CodeQL vulnerability scanners run on every pull request and weekly across production clusters.",
    evidenceArtifacts: [
      { id: "ea-7", type: "file", title: "Wiz_Vulnerability_Scan_Report.pdf" }
    ],
    remediationActivity: "Continuous automated scanning and 14-day SLA patch enforcement active.",
    responsibleManager: "VP of Engineering",
    agreedImplementationDate: "2026-12-31",
    mappedRisks: ["SR04", "SR07"]
  }
];

interface ControlMatrixViewProps {
  controls?: ControlMatrixItem[];
  onChangeControls: (updatedControls: ControlMatrixItem[]) => void;
  readOnly?: boolean;
}

export default function ControlMatrixView({
  controls = DEFAULT_CONTROL_MATRIX_ITEMS,
  onChangeControls,
  readOnly = false
}: ControlMatrixViewProps) {
  const activeControls = controls && controls.length > 0 ? controls : DEFAULT_CONTROL_MATRIX_ITEMS;

  // View Mode: "list" | "edit"
  const [viewMode, setViewMode] = useState<"list" | "edit">("list");
  const [editingControl, setEditingControl] = useState<ControlMatrixItem | null>(null);

  // Filters state
  const [selectedTSC, setSelectedTSC] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedOwner, setSelectedOwner] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals inside edit view for adding evidence or mapping risks
  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);
  const [newArtifactTitle, setNewArtifactTitle] = useState("");
  const [newArtifactUrl, setNewArtifactUrl] = useState("");
  const [newArtifactType, setNewArtifactType] = useState<"link" | "file">("link");

  const [isMapRiskModalOpen, setIsMapRiskModalOpen] = useState(false);
  const [newRiskTag, setNewRiskTag] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Calculate Stats
  const totalControlsCount = activeControls.length;
  const effectiveCount = activeControls.filter((c) => c.effectiveness === "EFFECTIVE").length;
  const gapsCount = activeControls.filter(
    (c) => c.effectiveness === "INEFFECTIVE" || c.effectiveness === "PARTIALLY EFFECTIVE"
  ).length;

  // Unique Owners list for filter
  const uniqueOwners = Array.from(new Set(activeControls.map((c) => c.owner))).filter(Boolean);

  // Filtered controls list
  const filteredControls = activeControls.filter((ctrl) => {
    if (selectedTSC !== "ALL" && !ctrl.tsc.toLowerCase().includes(selectedTSC.toLowerCase())) {
      return false;
    }
    if (selectedStatus !== "ALL" && ctrl.effectiveness !== selectedStatus) {
      return false;
    }
    if (selectedOwner !== "ALL" && ctrl.owner !== selectedOwner) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = ctrl.id.toLowerCase().includes(q) || ctrl.controlNumber.toLowerCase().includes(q);
      const matchTitle = ctrl.title.toLowerCase().includes(q);
      const matchDesc = ctrl.description.toLowerCase().includes(q);
      const matchOwner = ctrl.owner.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchDesc && !matchOwner) return false;
    }
    return true;
  });

  // Action: Open Edit view for an existing control or create new
  const handleStartEdit = (item: ControlMatrixItem) => {
    setEditingControl({ ...item });
    setViewMode("edit");
  };

  const handleStartCreateNew = () => {
    const nextNum = `C0${activeControls.length + 1}`;
    const newControl: ControlMatrixItem = {
      id: nextNum,
      controlNumber: nextNum,
      title: "",
      description: "",
      objective: "",
      tsc: "CC1.1",
      owner: "",
      effectiveness: "NOT ASSESSED",
      implementationDetails: "",
      evidenceArtifacts: [],
      remediationActivity: "",
      responsibleManager: "",
      agreedImplementationDate: "",
      mappedRisks: []
    };
    setEditingControl(newControl);
    setViewMode("edit");
  };

  const handleDeleteControl = (idToDelete: string) => {
    if (confirm("Are you sure you want to delete this control from the matrix?")) {
      const updated = activeControls.filter((c) => c.id !== idToDelete);
      onChangeControls(updated);
    }
  };

  const handleSaveEditingControl = () => {
    if (!editingControl) return;
    if (!editingControl.controlNumber.trim()) {
      setFormError("Control Number is mandatory. Please provide an identifier such as C01 or A.6.1.");
      return;
    }
    setFormError(null);

    const itemToSave = {
      ...editingControl,
      id: editingControl.id || editingControl.controlNumber
    };

    const existingIdx = activeControls.findIndex((c) => c.id === itemToSave.id || c.controlNumber === itemToSave.controlNumber);
    let updatedList: ControlMatrixItem[];
    if (existingIdx >= 0) {
      updatedList = [...activeControls];
      updatedList[existingIdx] = itemToSave;
    } else {
      updatedList = [...activeControls, itemToSave];
    }

    onChangeControls(updatedList);
    setViewMode("list");
    setEditingControl(null);
  };

  const handleAddEvidenceArtifact = () => {
    if (!editingControl || !newArtifactTitle.trim()) return;
    const newArtifact: ControlEvidenceArtifact = {
      id: `ea-${Date.now()}`,
      type: newArtifactType,
      title: newArtifactTitle.trim(),
      url: newArtifactUrl.trim() || undefined
    };
    setEditingControl({
      ...editingControl,
      evidenceArtifacts: [...(editingControl.evidenceArtifacts || []), newArtifact]
    });
    setNewArtifactTitle("");
    setNewArtifactUrl("");
    setIsAddEvidenceModalOpen(false);
  };

  const handleRemoveArtifact = (artId: string) => {
    if (!editingControl) return;
    setEditingControl({
      ...editingControl,
      evidenceArtifacts: (editingControl.evidenceArtifacts || []).filter((a) => a.id !== artId)
    });
  };

  const handleAddRiskTag = () => {
    if (!editingControl || !newRiskTag.trim()) return;
    const tagFormatted = newRiskTag.trim().toUpperCase();
    if ((editingControl.mappedRisks || []).includes(tagFormatted)) {
      setNewRiskTag("");
      setIsMapRiskModalOpen(false);
      return;
    }
    setEditingControl({
      ...editingControl,
      mappedRisks: [...(editingControl.mappedRisks || []), tagFormatted]
    });
    setNewRiskTag("");
    setIsMapRiskModalOpen(false);
  };

  const handleRemoveRiskTag = (tag: string) => {
    if (!editingControl) return;
    setEditingControl({
      ...editingControl,
      mappedRisks: (editingControl.mappedRisks || []).filter((t) => t !== tag)
    });
  };

  const handleExportCSV = () => {
    const headers = ["Control ID", "Title", "TSC", "Owner", "Status", "Description", "Objective"];
    const rows = activeControls.map((c) => [
      `"${c.controlNumber}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.tsc}"`,
      `"${c.owner.replace(/"/g, '""')}"`,
      `"${c.effectiveness}"`,
      `"${(c.description || "").replace(/"/g, '""')}"`,
      `"${(c.objective || "").replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Control_Matrix_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Badge Helper
  const renderStatusBadge = (status: ControlMatrixItem["effectiveness"]) => {
    switch (status) {
      case "EFFECTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            EFFECTIVE
          </span>
        );
      case "INEFFECTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            INEFFECTIVE
          </span>
        );
      case "PARTIALLY EFFECTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            PARTIALLY EFFECTIVE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            NOT ASSESSED
          </span>
        );
    }
  };

  // ==================== EDIT / FORM VIEW (SCREENSHOT 2) ====================
  if (viewMode === "edit" && editingControl) {
    return (
      <div className="space-y-6 animate-fade-in text-slate-900 pb-8">
        {/* Top Header & Breadcrumbs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="text-blue-600 hover:underline cursor-pointer font-semibold"
              >
                Control Matrix
              </button>
              <span>&gt;</span>
              <span className="text-slate-700 font-semibold">
                {editingControl.title ? `Edit Control` : `New Control`}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Control {editingControl.controlNumber || "New"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSaveEditingControl}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Control</span>
            </button>
          </div>
        </div>

        {/* Validation Error Banner */}
        {formError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-800 font-semibold animate-shake">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form Card 1: 1. Control Identification */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Info className="w-4 h-4 text-blue-600" />
            <span>1. Control Identification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Control Number *</label>
              <input
                type="text"
                placeholder="e.g. C02"
                value={editingControl.controlNumber}
                onChange={(e) =>
                  setEditingControl({ ...editingControl, controlNumber: e.target.value, id: e.target.value })
                }
                className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-600 bg-slate-50/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Control Title</label>
              <input
                type="text"
                placeholder="e.g. Information Security Governance"
                value={editingControl.title}
                onChange={(e) => setEditingControl({ ...editingControl, title: e.target.value })}
                className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-600 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Control Description</label>
              <textarea
                rows={4}
                placeholder="Describe the organizational security control in detail..."
                value={editingControl.description}
                onChange={(e) => setEditingControl({ ...editingControl, description: e.target.value })}
                className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-600 bg-white leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Control Objective</label>
              <textarea
                rows={4}
                placeholder="To demonstrate that the service is managed in accordance with standards..."
                value={editingControl.objective || ""}
                onChange={(e) => setEditingControl({ ...editingControl, objective: e.target.value })}
                className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-600 bg-white leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Form Card 2: 2. Management & Accountability */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>2. Management & Accountability</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Control Owner</label>
              <div className="relative">
                <UserCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. IT Governance & Compliance Lead"
                  value={editingControl.owner}
                  onChange={(e) => setEditingControl({ ...editingControl, owner: e.target.value })}
                  className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-blue-600 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Control Effectiveness</label>
              <select
                value={editingControl.effectiveness}
                onChange={(e) =>
                  setEditingControl({
                    ...editingControl,
                    effectiveness: e.target.value as ControlMatrixItem["effectiveness"]
                  })
                }
                className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-600 bg-white cursor-pointer font-semibold"
              >
                <option value="NOT ASSESSED">Not Yet Assessed</option>
                <option value="EFFECTIVE">Effective</option>
                <option value="INEFFECTIVE">Ineffective</option>
                <option value="PARTIALLY EFFECTIVE">Partially Effective</option>
              </select>
              <p className="text-[11px] text-slate-400 italic mt-0.5">
                (Evidence doesn't exist until after go-live)
              </p>
            </div>
          </div>
        </div>

        {/* Form Card 3: 3. Implementation & Evidence */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>3. Implementation & Evidence</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Control Implementation Details</label>
              <textarea
                rows={6}
                placeholder="Enterprise security standards dictate that all production endpoints will be secure by design..."
                value={editingControl.implementationDetails || ""}
                onChange={(e) => setEditingControl({ ...editingControl, implementationDetails: e.target.value })}
                className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-600 bg-white leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Evidence Links & Artifacts</label>
                <button
                  type="button"
                  onClick={() => setIsAddEvidenceModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>+ Add Link</span>
                </button>
              </div>

              <div className="space-y-2 border border-slate-150 bg-slate-50/50 rounded-xl p-3 min-h-[140px] max-h-[220px] overflow-y-auto">
                {(editingControl.evidenceArtifacts || []).length === 0 ? (
                  <div className="text-xs text-slate-400 text-center py-8 italic">
                    No evidence links or artifacts attached yet.
                  </div>
                ) : (
                  (editingControl.evidenceArtifacts || []).map((art) => (
                    <div
                      key={art.id}
                      className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2.5 text-xs shadow-2xs group"
                    >
                      <div className="flex items-center gap-2 text-slate-700 min-w-0 pr-2">
                        {art.type === "link" ? (
                          <LinkIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        )}
                        <span className="truncate font-medium text-slate-800">{art.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveArtifact(art.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer shrink-0"
                        title="Remove artifact"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Card 4: 4. Remediation & Mapping */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Wrench className="w-4 h-4 text-blue-600" />
            <span>4. Remediation & Mapping</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Remediation Activity (for ineffective / partially effective controls)
                </label>
                <textarea
                  rows={5}
                  placeholder="No immediate plans to remediate - Enterprise project underway..."
                  value={editingControl.remediationActivity || ""}
                  onChange={(e) => setEditingControl({ ...editingControl, remediationActivity: e.target.value })}
                  className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-600 bg-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Responsible Manager</label>
                  <input
                    type="text"
                    placeholder="e.g. Director of Technology Services"
                    value={editingControl.responsibleManager || ""}
                    onChange={(e) => setEditingControl({ ...editingControl, responsibleManager: e.target.value })}
                    className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-600 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Agreed Implementation Date</label>
                  <input
                    type="date"
                    value={editingControl.agreedImplementationDate || ""}
                    onChange={(e) =>
                      setEditingControl({ ...editingControl, agreedImplementationDate: e.target.value })
                    }
                    className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-600 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Mapped Risks</label>
                <button
                  type="button"
                  onClick={() => setIsMapRiskModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Map Risk</span>
                </button>
              </div>

              <div className="border border-slate-150 bg-slate-50/50 rounded-xl p-3 min-h-[140px] flex flex-col justify-between">
                <div className="flex flex-wrap gap-2">
                  {(editingControl.mappedRisks || []).length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No risks mapped to this control yet.</span>
                  ) : (
                    (editingControl.mappedRisks || []).map((riskTag) => (
                      <span
                        key={riskTag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300"
                      >
                        <span>{riskTag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRiskTag(riskTag)}
                          className="hover:text-rose-600 cursor-pointer"
                          title="Remove mapped risk"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <p className="text-[11px] text-slate-400 italic mt-3">
                  {(editingControl.mappedRisks || []).length} risks currently mapped to this control.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Primary Finalize & Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSaveEditingControl}
            className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finalize & Save Changes</span>
          </button>
        </div>

        {/* Add Evidence Modal */}
        {isAddEvidenceModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-5 space-y-4 animate-scale-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Add Evidence Artifact or Link</h3>
                <button
                  type="button"
                  onClick={() => setIsAddEvidenceModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Type</label>
                  <select
                    value={newArtifactType}
                    onChange={(e) => setNewArtifactType(e.target.value as "link" | "file")}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2"
                  >
                    <option value="link">Web / Google Drive Link</option>
                    <option value="file">Document File</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Title / File Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. IT Security strategies, policies, and guidance"
                    value={newArtifactTitle}
                    onChange={(e) => setNewArtifactTitle(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2"
                  />
                </div>

                {newArtifactType === "link" && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={newArtifactUrl}
                      onChange={(e) => setNewArtifactUrl(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEvidenceModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddEvidenceArtifact}
                  className="px-4 py-1.5 text-xs text-white bg-blue-600 rounded-lg font-bold"
                >
                  Add Artifact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Map Risk Modal */}
        {isMapRiskModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-5 space-y-4 animate-scale-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Map Risk Tag</h3>
                <button
                  type="button"
                  onClick={() => setIsMapRiskModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Risk Reference Code (e.g., SR02, SR03, SR05)</label>
                <input
                  type="text"
                  placeholder="e.g. SR02"
                  value={newRiskTag}
                  onChange={(e) => setNewRiskTag(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMapRiskModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddRiskTag}
                  className="px-4 py-1.5 text-xs text-white bg-blue-600 rounded-lg font-bold"
                >
                  Map Risk
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== LIST VIEW (SCREENSHOT 1) ====================
  return (
    <div className="space-y-6 animate-fade-in text-slate-900">
      {/* Top Title & Primary Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Control Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage and assess organizational controls against SOC 2 Trust Service Criteria.
          </p>
        </div>

        {!readOnly && (
          <button
            type="button"
            onClick={handleStartCreateNew}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Control</span>
          </button>
        )}
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: TOTAL CONTROLS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              TOTAL CONTROLS
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block tracking-tight">
              {totalControlsCount}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: EFFECTIVE CONTROLS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 border-l-4 border-l-blue-600 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              EFFECTIVE CONTROLS
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block tracking-tight">
              {effectiveCount}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: GAPS IDENTIFIED */}
        <div className="bg-white rounded-2xl border border-slate-200/90 border-l-4 border-l-rose-600 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              GAPS IDENTIFIED
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block tracking-tight">
              {gapsCount}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Export Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Trust Service Criteria Filter */}
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Trust Service Criteria
            </label>
            <select
              value={selectedTSC}
              onChange={(e) => setSelectedTSC(e.target.value)}
              className="text-xs font-medium text-slate-800 border border-slate-200 rounded-lg p-2 bg-slate-50/50 outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="ALL">All Criteria (Security, Avail...)</option>
              <option value="CC1.1">CC1.1 - Integrity & Ethics</option>
              <option value="CC1.2">CC1.2 - Board Oversight</option>
              <option value="CC6.2">CC6.2 - Access Control</option>
              <option value="CC7.1">CC7.1 - Vulnerability Mgmt</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1 min-w-[150px]">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-medium text-slate-800 border border-slate-200 rounded-lg p-2 bg-slate-50/50 outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="EFFECTIVE">Effective</option>
              <option value="INEFFECTIVE">Ineffective</option>
              <option value="NOT ASSESSED">Not Assessed</option>
              <option value="PARTIALLY EFFECTIVE">Partially Effective</option>
            </select>
          </div>

          {/* Owner Filter */}
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Owner</label>
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="text-xs font-medium text-slate-800 border border-slate-200 rounded-lg p-2 bg-slate-50/50 outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="ALL">All Owners</option>
              {uniqueOwners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters button */}
          {(selectedTSC !== "ALL" || selectedStatus !== "ALL" || selectedOwner !== "ALL" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedTSC("ALL");
                setSelectedStatus("ALL");
                setSelectedOwner("ALL");
                setSearchQuery("");
              }}
              className="mt-4 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search controls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs text-slate-800 border border-slate-200 rounded-lg pl-8 pr-3 py-2 bg-slate-50/50 outline-none focus:border-blue-600 w-40 sm:w-52"
            />
          </div>

          {/* Export CSV button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Export CSV Report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Control Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-28">Control ID</th>
                <th className="py-3 px-4">Control Title & Description</th>
                <th className="py-3 px-4 w-24">TSC</th>
                <th className="py-3 px-4 w-36">Owner</th>
                <th className="py-3 px-4 w-36">Status</th>
                {!readOnly && <th className="py-3 px-4 w-20 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredControls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs italic">
                    No controls found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredControls.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Control ID */}
                    <td className="py-3.5 px-4 font-mono font-extrabold text-blue-600 align-top">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="hover:underline text-left cursor-pointer"
                      >
                        {item.controlNumber || item.id}
                      </button>
                    </td>

                    {/* Title & Description */}
                    <td className="py-3.5 px-4 align-top space-y-1">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="font-bold text-slate-900 hover:text-blue-600 text-xs text-left cursor-pointer block"
                      >
                        {item.title || "Untitled Control"}
                      </button>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    </td>

                    {/* TSC Badge */}
                    <td className="py-3.5 px-4 align-top">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.tsc}
                      </span>
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-4 align-top font-medium text-slate-700">
                      {item.owner || "Unassigned"}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 align-top">{renderStatusBadge(item.effectiveness)}</td>

                    {/* Actions */}
                    {!readOnly && (
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Control Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteControl(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Control"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing 1 to {filteredControls.length} of {activeControls.length} controls
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled
              className="p-1 text-slate-300 cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700">Page 1 of 1</span>
            <button
              type="button"
              disabled
              className="p-1 text-slate-300 cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
