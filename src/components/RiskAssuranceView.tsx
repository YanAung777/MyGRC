import React, { useState, useEffect, useRef } from "react";
import {
  ShieldAlert,
  FolderOpen,
  FileText,
  Plus,
  Trash2,
  Paperclip,
  Check,
  Search,
  UploadCloud,
  FileDown,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  X,
  Printer,
  FileCode
} from "lucide-react";
import {
  RiskRecord,
  EvidenceFile,
  Folder,
  ComplianceReport,
  AIProject,
  TeamMember,
  ModelRecord,
  OrganizationalPolicy,
  IncidentRecord,
  Vendor,
  Framework
} from "../types";
import {
  downloadReportAsHtml,
  downloadReportAsPdf,
  printReport
} from "../utils/reportExporter";

interface RiskAssuranceViewProps {
  activePage?: string;
  risks: RiskRecord[];
  onAddRisk: (risk: RiskRecord) => void;
  onUpdateRisk?: (risk: RiskRecord) => void;
  onDeleteRisk?: (id: string) => void;
  evidenceFiles: EvidenceFile[];
  onAddEvidenceFile: (file: EvidenceFile) => void;
  folders: Folder[];
  onAddFolder: (fld: Folder) => void;
  onDeleteFolder: (fldId: string) => void;
  reports: ComplianceReport[];
  onGenerateReport: (rep: ComplianceReport) => void;
  projects: AIProject[];
  team: TeamMember[];
  models?: ModelRecord[];
  policies?: OrganizationalPolicy[];
  incidents?: IncidentRecord[];
  vendors?: Vendor[];
  frameworks?: Framework[];
  onPreviewFile?: (file: EvidenceFile) => void;
  onDeleteEvidenceFile?: (fileId: string) => void;
}

export default function RiskAssuranceView({
  activePage,
  risks,
  onAddRisk,
  onUpdateRisk,
  onDeleteRisk,
  evidenceFiles,
  onAddEvidenceFile,
  folders,
  onAddFolder,
  onDeleteFolder,
  reports,
  onGenerateReport,
  projects,
  team,
  models = [],
  policies = [],
  incidents = [],
  vendors = [],
  frameworks = [],
  onPreviewFile,
  onDeleteEvidenceFile
}: RiskAssuranceViewProps) {
  // Tabs: "risk" | "evidence" | "reports"
  const [activeTab, setActiveTab] = useState<"risk" | "evidence" | "reports">("risk");

  useEffect(() => {
    if (activePage === "risks") setActiveTab("risk");
    else if (activePage === "evidence") setActiveTab("evidence");
    else if (activePage === "reports") setActiveTab("reports");
  }, [activePage]);
  
  // Search state
  const [riskQuery, setRiskQuery] = useState("");
  const [evidenceQuery, setEvidenceQuery] = useState("");

  // Modals state
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<RiskRecord | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedRiskDetails, setSelectedRiskDetails] = useState<RiskRecord | null>(null);

  // Active Selected Folder for evidence
  const [selectedFolderId, setSelectedFolderId] = useState<string>("fld-all");

  // --- Add Risk Modal Form States ---
  const [riskFormTab, setRiskFormTab] = useState<"risks" | "mitigation">("risks");
  const [riskName, setRiskName] = useState("");
  const [riskOwner, setRiskOwner] = useState("");
  const [riskDesc, setRiskDesc] = useState("");
  const [riskPhase, setRiskPhase] = useState("Operation & Deployment");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [riskCategories, setRiskCategories] = useState<string[]>([]);
  const [potentialImpact, setPotentialImpact] = useState("");
  const [likelihood, setLikelihood] = useState("3");
  const [severityCalc, setSeverityCalc] = useState("3");
  const [reviewNotes, setReviewNotes] = useState("");

  const [mitigationStatus, setMitigationStatus] = useState<"NOT STARTED" | "IN PROGRESS" | "COMPLETED">("NOT STARTED");
  const [deadline, setDeadline] = useState("");
  const [mitigationPlan, setMitigationPlan] = useState("");
  const [implementationStrategy, setImplementationStrategy] = useState("");
  const [resLikelihood, setResLikelihood] = useState("2");
  const [resSeverity, setResSeverity] = useState("2");
  const [approver, setApprover] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [assessmentDate, setAssessmentDate] = useState("");
  const [recommendations, setRecommendations] = useState("");

  // --- Add Folder Form State ---
  const [newFolderName, setNewFolderName] = useState("");

  // --- Upload File Form State ---
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileFolder, setUploadedFileFolder] = useState("fld-uncategorized");
  const [selectedDeviceFile, setSelectedDeviceFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Generate Report Form State ---
  const [reportTitle, setReportTitle] = useState("");
  const [reportProgram, setReportProgram] = useState("Certification and Accreditation");
  const [reportType, setReportType] = useState("Organizational report");
  const [reportFormat, setReportFormat] = useState<"PDF" | "DOCX">("PDF");
  const [selectedReportProject, setSelectedReportProject] = useState<string>("");
  const [workspaceType, setWorkspaceType] = useState<"organizational" | "project">("organizational");
  const [previewReport, setPreviewReport] = useState<ComplianceReport | null>(null);

  // --- Risk Calculations ---
  const getRiskLevelString = (l: string, s: string) => {
    const val = parseInt(l) * parseInt(s);
    if (val <= 4) return "LOW RISK";
    if (val <= 9) return "MEDIUM RISK";
    if (val <= 16) return "HIGH RISK";
    return "CRITICAL RISK";
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
      case "VERY HIGH":
      case "MAJOR":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "HIGH":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
  };

  const handleOpenAddRisk = () => {
    setEditingRisk(null);
    setRiskFormTab("risks");
    setRiskName("");
    setRiskOwner("");
    setRiskDesc("");
    setRiskPhase("Operation & Deployment");
    setSelectedProjects([]);
    setSelectedFrameworks([]);
    setRiskCategories([]);
    setPotentialImpact("");
    setLikelihood("3");
    setSeverityCalc("3");
    setReviewNotes("");
    setMitigationStatus("NOT STARTED");
    setDeadline("");
    setMitigationPlan("");
    setImplementationStrategy("");
    setResLikelihood("2");
    setResSeverity("2");
    setApprover("");
    setApprovalStatus("Pending");
    setAssessmentDate("");
    setRecommendations("");
    setIsRiskModalOpen(true);
  };

  const handleOpenEditRisk = (risk: RiskRecord) => {
    setEditingRisk(risk);
    setRiskFormTab("risks");
    setRiskName(risk.name || "");
    setRiskOwner(risk.owner || "");
    setRiskDesc(risk.description || "");
    setRiskPhase(risk.lifecyclePhase || "Operation & Deployment");
    setSelectedProjects(risk.applicableProjects || []);
    setSelectedFrameworks(risk.applicableFrameworks || []);
    setRiskCategories(risk.categories || []);
    setPotentialImpact(risk.potentialImpact || "");
    setLikelihood(risk.likelihood || "3");
    setSeverityCalc(risk.severityCalc || "3");
    setReviewNotes(risk.notes || "");
    setMitigationStatus(risk.mitigationStatus || "NOT STARTED");
    setDeadline(risk.targetDate || "");
    setMitigationPlan(risk.mitigationPlan || "");
    setImplementationStrategy(risk.implementationStrategy || "");
    setResLikelihood(risk.residualLikelihood || "2");
    setResSeverity(risk.residualSeverity || "2");
    setApprover(risk.approver || "");
    setApprovalStatus(risk.approvalStatus || "Pending");
    setAssessmentDate(risk.assessmentDate || "");
    setRecommendations(risk.recommendations || "");
    setIsRiskModalOpen(true);
  };

  const handleDeleteRiskClick = (riskId: string, name: string) => {
    if (confirm(`Are you sure you want to delete risk "${name}" (${riskId})?`)) {
      if (onDeleteRisk) {
        onDeleteRisk(riskId);
      }
      if (selectedRiskDetails?.id === riskId) {
        setSelectedRiskDetails(null);
      }
    }
  };

  const handleCreateRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskName) return;

    const riskVal = getRiskLevelString(likelihood, severityCalc);
    const score = parseInt(likelihood) * parseInt(severityCalc);
    const calculatedSeverity = (score > 16 ? "CRITICAL" : score > 12 ? "VERY HIGH" : score > 8 ? "HIGH" : score > 4 ? "MEDIUM" : "LOW") as any;

    if (editingRisk) {
      const updatedRisk: RiskRecord = {
        ...editingRisk,
        name: riskName,
        owner: riskOwner || "Demo Assessor",
        severity: calculatedSeverity,
        mitigationStatus: mitigationStatus,
        riskLevel: riskVal,
        targetDate: deadline || editingRisk.targetDate,
        description: riskDesc,
        applicableProjects: selectedProjects,
        applicableFrameworks: selectedFrameworks,
        lifecyclePhase: riskPhase,
        categories: riskCategories,
        potentialImpact: potentialImpact,
        likelihood: likelihood,
        severityCalc: severityCalc,
        notes: reviewNotes,
        mitigationPlan,
        implementationStrategy,
        residualLikelihood: resLikelihood,
        residualSeverity: resSeverity,
        residualRiskLevel: getRiskLevelString(resLikelihood, resSeverity),
        approver,
        approvalStatus,
        assessmentDate,
        recommendations
      };

      if (onUpdateRisk) {
        onUpdateRisk(updatedRisk);
      }
      if (selectedRiskDetails?.id === editingRisk.id) {
        setSelectedRiskDetails(updatedRisk);
      }
    } else {
      const newRisk: RiskRecord = {
        id: `RSK-0${risks.length + 3}`,
        name: riskName,
        owner: riskOwner || "Demo Assessor",
        severity: calculatedSeverity,
        mitigationStatus: mitigationStatus,
        riskLevel: riskVal,
        targetDate: deadline || "30-10-2026",
        description: riskDesc,
        applicableProjects: selectedProjects,
        applicableFrameworks: selectedFrameworks,
        lifecyclePhase: riskPhase,
        categories: riskCategories,
        potentialImpact: potentialImpact,
        likelihood: likelihood,
        severityCalc: severityCalc,
        notes: reviewNotes,
        mitigationPlan,
        implementationStrategy,
        residualLikelihood: resLikelihood,
        residualSeverity: resSeverity,
        residualRiskLevel: getRiskLevelString(resLikelihood, resSeverity),
        approver,
        approvalStatus,
        assessmentDate,
        recommendations
      };

      onAddRisk(newRisk);
    }

    setIsRiskModalOpen(false);
    setEditingRisk(null);

    // Reset Form
    setRiskFormTab("risks");
    setRiskName("");
    setRiskOwner("");
    setRiskDesc("");
    setRiskPhase("Operation & Deployment");
    setSelectedProjects([]);
    setSelectedFrameworks([]);
    setRiskCategories([]);
    setPotentialImpact("");
    setLikelihood("3");
    setSeverityCalc("3");
    setReviewNotes("");
    setMitigationStatus("NOT STARTED");
    setDeadline("");
    setMitigationPlan("");
    setImplementationStrategy("");
    setResLikelihood("2");
    setResSeverity("2");
    setApprover("");
    setApprovalStatus("Pending");
    setAssessmentDate("");
    setRecommendations("");
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName) return;

    const newFld: Folder = {
      id: `fld-${newFolderName.toLowerCase().replace(/\s+/g, "-")}`,
      name: newFolderName
    };

    onAddFolder(newFld);
    setNewFolderName("");
    setIsFolderModalOpen(false);
  };

  const handleUploadFileSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileName && !selectedDeviceFile) return;

    const nameToUse = uploadedFileName.trim() || (selectedDeviceFile ? selectedDeviceFile.name : "evidence-file.pdf");

    const newFile: EvidenceFile = {
      id: `ev-${evidenceFiles.length + 1}`,
      name: nameToUse,
      uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      uploader: "You",
      source: "Not linked",
      version: "v1.0",
      status: "Draft",
      folderId: uploadedFileFolder
    };

    onAddEvidenceFile(newFile);
    setUploadedFileName("");
    setSelectedDeviceFile(null);
    setIsUploadModalOpen(false);
  };

  const handleGenerateReportSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle) return;

    const formattedDate = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

    const newRep: ComplianceReport = {
      id: `rep-${reports.length + 1}`,
      title: reportTitle,
      program: reportType.includes("Project") && selectedReportProject ? selectedReportProject : reportProgram,
      type: reportType,
      format: reportFormat,
      created: formattedDate
    };

    onGenerateReport(newRep);
    setReportTitle("");
    setSelectedReportProject("");
    setIsReportModalOpen(false);
    setPreviewReport(newRep);
  };

  // Filters
  const filteredRisks = risks.filter(r =>
    r.name.toLowerCase().includes(riskQuery.toLowerCase()) ||
    r.owner.toLowerCase().includes(riskQuery.toLowerCase())
  );

  const filteredEvidence = evidenceFiles.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(evidenceQuery.toLowerCase());
    if (selectedFolderId === "fld-all") return matchesSearch;
    return matchesSearch && f.folderId === selectedFolderId;
  });

  // Risk counters
  const totalRisksCount = risks.length;
  const criticalRisksCount = risks.filter(r => r.riskLevel === "CRITICAL RISK" || r.severity === "VERY HIGH").length;
  const highRisksCount = risks.filter(r => r.riskLevel === "HIGH RISK").length;
  const lowRisksCount = risks.filter(r => r.riskLevel === "LOW RISK" || r.severity === "LOW").length;

  return (
    <div className="space-y-6">
      
      {/* Sub tabs header selector */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              {activeTab === "reports" ? "Reporting Hub" : "Risk & Assurance"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {activeTab === "reports"
                ? "Export high-fidelity legal PDF summaries of your framework implementations for board reviews or regulators."
                : "Identify algorithmic risks, track secure evidence, and generate PDF regulatory audits."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "reports" && (
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                id="btn-generate-report-header"
              >
                <FileDown className="w-4 h-4" />
                Generate report
              </button>
            )}

            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
              <button
                onClick={() => setActiveTab("risk")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "risk"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                id="subtab-risk-register"
              >
                Risk Register
              </button>
              <button
                onClick={() => setActiveTab("evidence")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "evidence"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                id="subtab-evidence-documents"
              >
                Evidence & Documents
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "reports"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                id="subtab-reporting-hub"
              >
                Reporting Hub
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Renders Tab Panels */}
      {activeTab === "risk" && (
        <div className="space-y-6 animate-fade-in">
          {/* Counters row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Risks</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{totalRisksCount}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-rose-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Very High</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{criticalRisksCount}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-orange-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">High</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{highRisksCount}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs border-l-4 border-l-emerald-500">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Low</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{lowRisksCount}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center justify-center bg-slate-50/50">
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">INTEGRITY PASS</span>
            </div>
          </div>

          {/* Controls bar */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search risk log..."
                value={riskQuery}
                onChange={(e) => setRiskQuery(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                id="search-risks"
              />
            </div>

            <button
              onClick={handleOpenAddRisk}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
              id="btn-add-risk"
            >
              <Plus className="w-4 h-4" />
              Add new risk
            </button>
          </div>

          {/* Risks Table */}
          {filteredRisks.length === 0 ? (
            <div className="bg-white p-12 text-center text-slate-400 text-xs rounded-xl border border-gray-100">
              No matching risks documented. Click "Add new risk" to write one.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6">Risk Name</th>
                      <th className="p-4">Owner</th>
                      <th className="p-4">Severity</th>
                      <th className="p-4">Mitigation Status</th>
                      <th className="p-4">Calculated Risk Level</th>
                      <th className="p-4">Target Date</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRisks.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors text-xs text-slate-700">
                        <td className="p-4 pl-6">
                          <div>
                            <span className="font-bold text-slate-800 block">{r.name}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block leading-relaxed max-w-[280px] truncate">{r.description}</span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-500">{r.owner}</td>
                        <td className="p-4">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${getSeverityBadgeColor(r.severity)}`}>
                            {r.severity}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase">
                            {r.mitigationStatus}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-800">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                              r.riskLevel === "CRITICAL RISK" || r.riskLevel === "HIGH RISK"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {r.riskLevel}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">{r.targetDate}</td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedRiskDetails(r)}
                              className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer text-xs"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleOpenEditRisk(r)}
                              className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer transition-colors"
                              title="Edit Risk"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRiskClick(r.id, r.name)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                              title="Delete Risk"
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
      )}

      {/* Evidence & Documents Tab Panel */}
      {activeTab === "evidence" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in" id="panel-evidence">
          
          {/* Folders List Sidebar */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs h-fit space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Folders</h3>
              <button
                onClick={() => setIsFolderModalOpen(true)}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
              >
                + New folder
              </button>
            </div>

            <div className="space-y-1">
              {folders.map((fld) => (
                <div
                  key={fld.id}
                  onClick={() => setSelectedFolderId(fld.id)}
                  className={`flex justify-between items-center p-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedFolderId === fld.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className={`w-4 h-4 ${selectedFolderId === fld.id ? "text-indigo-600" : "text-slate-400"}`} />
                    <span>{fld.name}</span>
                  </div>
                  {fld.id !== "fld-all" && fld.id !== "fld-uncategorized" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete folder ${fld.name}? Files won't be deleted.`)) {
                          onDeleteFolder(fld.id);
                          if (selectedFolderId === fld.id) setSelectedFolderId("fld-all");
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Files listing section */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search files in active directory..."
                  value={evidenceQuery}
                  onChange={(e) => setEvidenceQuery(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                  id="search-evidence"
                />
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                id="btn-upload-file"
              >
                <UploadCloud className="w-4 h-4" />
                Upload file
              </button>
            </div>

            {/* Files List Table */}
            {filteredEvidence.length === 0 ? (
              <div className="bg-white p-12 text-center text-slate-400 text-xs rounded-xl border border-gray-100">
                No compliance evidence uploaded in this directory. Click "Upload file" to add records.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="p-4 pl-6">File</th>
                        <th className="p-4">Upload Date</th>
                        <th className="p-4">Uploader</th>
                        <th className="p-4">Source</th>
                        <th className="p-4">Version</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEvidence.map((f) => (
                        <tr key={f.id} className="hover:bg-slate-50/50 transition-colors text-xs text-slate-700">
                          <td className="p-4 pl-6 font-bold text-slate-800">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-indigo-500" />
                              <span>{f.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-400">{f.uploadDate}</td>
                          <td className="p-4 font-semibold text-slate-500">{f.uploader}</td>
                          <td className="p-4 font-mono text-slate-400 text-[10px]">{f.source}</td>
                          <td className="p-4 font-mono font-medium text-slate-600">{f.version}</td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">
                              {f.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => onPreviewFile?.(f)}
                                className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
                              >
                                Open
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete the file "${f.name}"?`)) {
                                    onDeleteEvidenceFile?.(f.id);
                                  }
                                }}
                                className="text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
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

        </div>
      )}

      {/* Reporting Hub Tab Panel */}
      {activeTab === "reports" && (
        <div className="space-y-6 animate-fade-in" id="panel-reports">
          
          {/* EXPORT OVERVIEW CARDS */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-left">
              Export Overview
            </span>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white px-5 py-3 rounded-xl border border-slate-200/60 shadow-xs flex items-center gap-2.5 min-w-[130px]">
                <span className="text-xl font-black text-indigo-600">4</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left">Programs</span>
              </div>
              <div className="bg-white px-5 py-3 rounded-xl border border-slate-200/60 shadow-xs flex items-center gap-2.5 min-w-[130px]">
                <span className="text-xl font-black text-indigo-600">{projects.length}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left">Projects</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-left leading-relaxed mt-2">
              Each generated file appears as its own row; the title is the report name you enter in the wizard. Use <strong className="text-slate-600 font-semibold">Generate report</strong> to add another file.
            </p>
          </div>

          {/* TWO COLUMN WORKSPACE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            
            {/* Left Sidebar Pane: WORKSPACE */}
            <div className="lg:col-span-3 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-left">
                Workspace
              </span>
              
              <div className="bg-white border border-slate-200/60 rounded-xl p-2 space-y-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setWorkspaceType("organizational")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    workspaceType === "organizational"
                      ? "bg-indigo-50/70 text-indigo-700 border-l-4 border-l-indigo-600"
                      : "text-slate-600 hover:bg-slate-50/80"
                  }`}
                >
                  <span className="text-left">Organizational reports</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${
                    workspaceType === "organizational"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {reports.filter(r => r.type.toLowerCase().includes("organizational") || r.type.toLowerCase().includes("audit")).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkspaceType("project")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    workspaceType === "project"
                      ? "bg-indigo-50/70 text-indigo-700 border-l-4 border-l-indigo-600"
                      : "text-slate-600 hover:bg-slate-50/80"
                  }`}
                >
                  <span className="text-left">AI project reports</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${
                    workspaceType === "project"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {reports.filter(r => r.type.toLowerCase().includes("project")).length}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Pane: Table of Selected workspaceType reports */}
            <div className="lg:col-span-9 space-y-3">
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-850">
                  {workspaceType === "organizational" ? "Organizational reports" : "AI project reports"}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {workspaceType === "organizational"
                    ? "Files tied to a framework program (single-program export or organizational combined report)."
                    : "Files containing comprehensive audits of specific AI systems."}
                </p>
              </div>

              {/* Table of Reports */}
              {(() => {
                const currentReports = workspaceType === "organizational"
                  ? reports.filter(r => r.type.toLowerCase().includes("organizational") || r.type.toLowerCase().includes("audit"))
                  : reports.filter(r => r.type.toLowerCase().includes("project"));

                if (currentReports.length === 0) {
                  return (
                    <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
                      No exported files found in this category. Click "Generate report" to compile a compliance statement.
                    </div>
                  );
                }

                return (
                  <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200/55 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="p-3.5 pl-5">Report Title</th>
                            <th className="p-3.5">Program</th>
                            <th className="p-3.5">Type</th>
                            <th className="p-3.5">Format</th>
                            <th className="p-3.5">Created</th>
                            <th className="p-3.5 pr-5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150/70">
                          {currentReports.map((rep) => (
                            <tr key={rep.id} className="hover:bg-slate-50/40 transition-colors text-xs text-slate-700">
                              <td className="p-3.5 pl-5 font-bold text-slate-800">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-indigo-500" />
                                  <span>{rep.title}</span>
                                </div>
                              </td>
                              <td className="p-3.5 text-slate-600 font-semibold">{rep.program}</td>
                              <td className="p-3.5 text-slate-400 font-medium">{rep.type}</td>
                              <td className="p-3.5">
                                <span className="text-[10px] font-bold bg-indigo-55 text-indigo-700 border border-indigo-150 px-1.5 py-0.5 rounded uppercase font-mono">
                                  {rep.format}
                                </span>
                              </td>
                              <td className="p-3.5 text-slate-400 font-medium">{rep.created}</td>
                              <td className="p-3.5 pr-5 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setPreviewReport(rep)}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-250 shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                                    title="Open Preview"
                                  >
                                    <span>Preview</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => printReport(rep, { projects, models, risks, evidenceFiles, policies, incidents, vendors, frameworks })}
                                    className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1"
                                    title="Print / Save as PDF"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Print</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => downloadReportAsHtml(rep, { projects, models, risks, evidenceFiles, policies, incidents, vendors, frameworks })}
                                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                                    title="Download HTML Document"
                                  >
                                    <FileCode className="w-3.5 h-3.5" />
                                    <span>HTML</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

            </div>

          </div>

        </div>
      )}

      {/* Modals overlay */}
      {/* 1. Add New Risk Modal */}
      {isRiskModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-scale-up my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/55">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {editingRisk ? `Edit Risk: ${editingRisk.id}` : "Add new risk"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingRisk ? "Update risk findings, mitigation measures, and residual scores." : "Define potential operational threats and algorithmic pitfalls."}
                </p>
              </div>
              <button onClick={() => { setIsRiskModalOpen(false); setEditingRisk(null); }} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>

            {/* Tab links for form */}
            <div className="flex border-b border-slate-100 px-6 bg-white gap-4">
              <button
                type="button"
                onClick={() => setRiskFormTab("risks")}
                className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  riskFormTab === "risks" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"
                }`}
              >
                Risks
              </button>
              <button
                type="button"
                onClick={() => setRiskFormTab("mitigation")}
                className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  riskFormTab === "mitigation" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"
                }`}
              >
                Mitigation & Residuals
              </button>
            </div>

            <form onSubmit={handleCreateRisk} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              {riskFormTab === "risks" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Risk Name */}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Risk Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Algorithmic bias in scoring, Hallucination, Data leak"
                      value={riskName}
                      onChange={(e) => setRiskName(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none"
                    />
                  </div>

                  {/* Owner */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Action Owner</label>
                    <select
                      value={riskOwner}
                      onChange={(e) => setRiskOwner(e.target.value)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                    >
                      <option value="">Select owner</option>
                      {team.map(m => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* AI Lifecycle Phase */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">AI lifecycle phase</label>
                    <select
                      value={riskPhase}
                      onChange={(e) => setRiskPhase(e.target.value)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                    >
                      <option value="Design & Scoping">Design & Scoping</option>
                      <option value="Development & Testing">Development & Testing</option>
                      <option value="Operation & Deployment">Operation & Deployment</option>
                      <option value="Decommissioning">Decommissioning</option>
                    </select>
                  </div>

                  {/* Applicable Projects */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Applicable projects</label>
                    <select
                      multiple
                      value={selectedProjects}
                      onChange={(e) => {
                        const ops = Array.from((e.target as HTMLSelectElement).selectedOptions).map(o => o.value);
                        setSelectedProjects(ops);
                      }}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2 outline-none h-20"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.title}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Applicable Frameworks */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Applicable frameworks</label>
                    <select
                      multiple
                      value={selectedFrameworks}
                      onChange={(e) => {
                        const ops = Array.from((e.target as HTMLSelectElement).selectedOptions).map(o => o.value);
                        setSelectedFrameworks(ops);
                      }}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2 outline-none h-20"
                    >
                      <option value="ISO 42001">ISO 42001</option>
                      <option value="ISO 27001">ISO 27001</option>
                      <option value="NIST AI RMF">NIST AI RMF</option>
                      <option value="SOC 2">SOC 2</option>
                    </select>
                  </div>

                  {/* Categories */}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">Risk categories</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["Strategic", "Bias", "Operational", "Compliance", "Reputational", "Technical", "Financial"].map((cat) => (
                        <label key={cat} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100">
                          <input
                            type="checkbox"
                            checked={riskCategories.includes(cat)}
                            onChange={(e) => {
                              if (e.target.checked) setRiskCategories([...riskCategories, cat]);
                              else setRiskCategories(riskCategories.filter(x => x !== cat));
                            }}
                            className="rounded text-indigo-600"
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Risk Description */}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Risk Description</label>
                    <textarea
                      rows={2}
                      placeholder="Explain the technical or social threat..."
                      value={riskDesc}
                      onChange={(e) => setRiskDesc(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none"
                    />
                  </div>

                  {/* Potential Impact */}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Potential Impact Description</label>
                    <textarea
                      rows={2}
                      placeholder="Describe what occurs if this threat is realized..."
                      value={potentialImpact}
                      onChange={(e) => setPotentialImpact(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none"
                    />
                  </div>

                  {/* Inherent Score Likelihood & Impact */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Inherent Likelihood (1-5)</label>
                    <select
                      value={likelihood}
                      onChange={(e) => setLikelihood(e.target.value)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                    >
                      {["1", "2", "3", "4", "5"].map(n => (
                        <option key={n} value={n}>{n} - {n === "1" ? "Rare" : n === "3" ? "Moderate" : n === "5" ? "Almost Certain" : "Level " + n}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Inherent Severity Impact (1-5)</label>
                    <select
                      value={severityCalc}
                      onChange={(e) => setSeverityCalc(e.target.value)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                    >
                      {["1", "2", "3", "4", "5"].map(n => (
                        <option key={n} value={n}>{n} - {n === "1" ? "Negligible" : n === "3" ? "Moderate" : n === "5" ? "Catastrophic" : "Level " + n}</option>
                      ))}
                    </select>
                  </div>

                  {/* Auto calculated level */}
                  <div className="col-span-2 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 flex justify-between items-center text-xs">
                    <span className="font-semibold text-indigo-800">Inherent Risk Rating:</span>
                    <span className="font-extrabold text-indigo-900 bg-white px-2 py-1 rounded shadow-xs border border-indigo-200">
                      {getRiskLevelString(likelihood, severityCalc)} ({parseInt(likelihood) * parseInt(severityCalc)} pts)
                    </span>
                  </div>

                </div>
              ) : (
                /* Tab 2: Mitigation form */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mitigation status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mitigation status</label>
                    <select
                      value={mitigationStatus}
                      onChange={(e) => setMitigationStatus(e.target.value as any)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                    >
                      <option value="NOT STARTED">NOT STARTED</option>
                      <option value="IN PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>

                  {/* Target Deadline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Deadline</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2 outline-none"
                    />
                  </div>

                  {/* Mitigation Plan */}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mitigation Plan</label>
                    <textarea
                      rows={2}
                      placeholder="State the core control steps to reduce this risk..."
                      value={mitigationPlan}
                      onChange={(e) => setMitigationPlan(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none"
                    />
                  </div>

                  {/* Residual Score selectors */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Residual Likelihood (1-5)</label>
                    <select
                      value={resLikelihood}
                      onChange={(e) => setResLikelihood(e.target.value)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                    >
                      {["1", "2", "3", "4", "5"].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Residual Severity (1-5)</label>
                    <select
                      value={resSeverity}
                      onChange={(e) => setResSeverity(e.target.value)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                    >
                      {["1", "2", "3", "4", "5"].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  {/* Auto calculated residual level */}
                  <div className="col-span-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex justify-between items-center text-xs">
                    <span className="font-semibold text-emerald-800">Residual Risk Rating:</span>
                    <span className="font-extrabold text-emerald-950 bg-white px-2 py-1 rounded shadow-xs border border-emerald-200">
                      {getRiskLevelString(resLikelihood, resSeverity)} ({parseInt(resLikelihood) * parseInt(resSeverity)} pts)
                    </span>
                  </div>

                  {/* Risk Approval */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Approver</label>
                    <select
                      value={approver}
                      onChange={(e) => setApprover(e.target.value)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                    >
                      <option value="">Select approver</option>
                      {team.map(m => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Approval status</label>
                    <select
                      value={approvalStatus}
                      onChange={(e) => setApprovalStatus(e.target.value)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                </div>
              )}

              {/* Action Buttons footer */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                {riskFormTab === "risks" ? (
                  <>
                    <div></div>
                    <button
                      type="button"
                      onClick={() => setRiskFormTab("mitigation")}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      Mitigation details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setRiskFormTab("risks")}
                      className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold bg-white rounded-lg cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
                      id="btn-confirm-add-risk"
                    >
                      {editingRisk ? "Save Changes" : "Save Risk Register"}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl overflow-hidden animate-scale-up">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-700">
              Create New Folder
            </div>
            <form onSubmit={handleCreateFolder} className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Folder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audits, Certifications"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Upload File Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl overflow-hidden animate-scale-up">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-700">
              Upload compliance evidence
            </div>
            <form onSubmit={handleUploadFileSim} className="p-4 space-y-4">
              <div className="space-y-3">
                
                {/* Drag and Drop Zone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Select File from Device *</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setSelectedDeviceFile(file);
                        setUploadedFileName(file.name);
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
                        setSelectedDeviceFile(file);
                        setUploadedFileName(file.name);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      isDragging
                        ? "border-indigo-500 bg-indigo-50/50"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    {selectedDeviceFile ? (
                      <>
                        <FileText className="w-8 h-8 text-indigo-500 animate-pulse" />
                        <div className="text-xs font-bold text-slate-800 truncate max-w-full px-2">
                          {selectedDeviceFile.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {(selectedDeviceFile.size / 1024).toFixed(1)} KB — Click to change
                        </div>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-slate-400" />
                        <p className="text-xs font-semibold text-slate-600">
                          Drag & drop file or <span className="text-indigo-600 font-bold underline">browse</span>
                        </p>
                        <p className="text-[10px] text-slate-400">PDF, DOCX, XLSX, PNG up to 50MB</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">File Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ISO-42001-Board-Briefing"
                    value={uploadedFileName}
                    onChange={(e) => setUploadedFileName(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Target Folder</label>
                  <select
                    value={uploadedFileFolder}
                    onChange={(e) => setUploadedFileFolder(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2 outline-none cursor-pointer"
                  >
                    {folders.filter(f => f.id !== "fld-all").map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDeviceFile(null);
                    setUploadedFileName("");
                    setIsUploadModalOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedDeviceFile && !uploadedFileName}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50 cursor-pointer"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Generate Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Generate Compliance PDF</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Define metadata for the statutory export.</p>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleGenerateReportSim} className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Report Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ISO 42001 Compliance Statement"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => {
                      setReportType(e.target.value);
                      if (e.target.value.includes("Project")) {
                        setSelectedReportProject(projects[0]?.title || "");
                      } else {
                        setReportProgram("Certification and Accreditation");
                      }
                    }}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none cursor-pointer"
                  >
                    <option value="Organizational report">Organizational report</option>
                    <option value="AI Project Report">AI Project Report</option>
                    <option value="Audit Statement">Audit Statement</option>
                  </select>
                </div>

                {reportType.includes("Project") ? (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Target AI Project *</label>
                    <select
                      value={selectedReportProject}
                      onChange={(e) => setSelectedReportProject(e.target.value)}
                      required
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none cursor-pointer"
                    >
                      <option value="">-- Select AI Project --</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.title}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Program</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Certification and Accreditation"
                      value={reportProgram}
                      onChange={(e) => setReportProgram(e.target.value)}
                      className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-lg p-2.5 outline-none"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Format</label>
                  <select
                    value={reportFormat}
                    onChange={(e) => setReportFormat(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none cursor-pointer"
                  >
                    <option value="PDF">PDF Document (.pdf) / Print</option>
                    <option value="HTML">HTML Web Document (.html)</option>
                    <option value="DOCX">Microsoft Word (.docx)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md cursor-pointer"
                  id="btn-confirm-generate-report"
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. PDF Report Preview Overlay Modal */}
      {previewReport && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-scale-up my-8 border border-slate-100">
            {/* Modal Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-200/60 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                  <FileText className="w-5 h-5" />
                </span>
                <div className="text-left">
                  <h3 className="text-sm font-extrabold text-slate-800">Compliance Document Preview</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">High-fidelity export audit registry • Encrypted PDF artifact</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Body (Skeuomorphic PDF Page) */}
            <div className="p-8 bg-slate-100 max-h-[70vh] overflow-y-auto flex justify-center">
              <div className="bg-white w-full max-w-3xl rounded-lg shadow-md border border-slate-200/80 p-10 text-left space-y-8 font-sans relative">
                {/* PDF Stamp / Logo */}
                <div className="absolute top-10 right-10 flex flex-col items-end">
                  <span className="text-[9px] font-mono text-slate-400">STATUS: APPROVED FOR EXPORT</span>
                  <span className="text-[9px] font-mono text-slate-400">HASH: SHA-256: 8D3C...9B5A</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-150/80 uppercase tracking-wide mt-1.5 inline-block">
                    VERIFIED SECURE
                  </span>
                </div>

                {/* PDF Document Header */}
                <div className="border-b-2 border-slate-900 pb-5 pt-4">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">
                    C&A PORTAL COMPLIANCE REGISTRY
                  </span>
                  <h1 className="text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">
                    {previewReport.title}
                  </h1>
                  <p className="text-xs text-slate-500 mt-2">
                    Scope: <strong className="text-slate-800 font-bold">{previewReport.program}</strong> • Type: {previewReport.type}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Report Reference ID: {previewReport.id} • Generated: {previewReport.created} • Formatted as {previewReport.format}
                  </p>
                </div>

                {/* Section 1: Executive Overview */}
                <div className="space-y-2">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-150 pb-1">
                    <span className="text-indigo-600 font-bold">1.0</span> Executive Compliance Summary
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This statutory compliance report has been compiled automatically by the C&A Portal AIMS engine. It aggregates dynamic registry datasets including active risks, model benchmarking catalogs, and security controls mapped under the <strong className="text-slate-700 font-semibold">{previewReport.program}</strong> operational framework.
                  </p>
                </div>

                {/* Section 2: Linked AI System Inventory */}
                <div className="space-y-3">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-150 pb-1">
                    <span className="text-indigo-600 font-bold">2.0</span> System Inventory & Mapped Foundation Models
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The active system registry documents the following primary algorithmic systems and foundation models currently in operational scope:
                  </p>
                  <div className="space-y-2">
                    {projects.slice(0, 3).map((proj) => (
                      <div key={proj.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 flex flex-col md:flex-row justify-between md:items-center gap-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 block">{proj.title}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Classification: {proj.riskClassification} Risk • Status: {proj.status}</span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {proj.mappedModels?.length ? (
                            proj.mappedModels.map((m, idx) => (
                              <span key={idx} className="bg-indigo-50 text-indigo-700 text-[9px] font-bold border border-indigo-150 px-1.5 py-0.5 rounded uppercase font-mono">
                                {m}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[10px] font-mono">No models registered</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Risk Ledger & Mitigation Status */}
                <div className="space-y-3">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-150 pb-1">
                    <span className="text-indigo-600 font-bold">3.0</span> Algorithmic Risk Register
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dynamic risk evaluations mapped to governance logs reflect the following threats and mitigation status keys:
                  </p>
                  <div className="space-y-2">
                    {risks.slice(0, 3).map((risk) => (
                      <div key={risk.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-800">{risk.name}</span>
                          <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded ${getSeverityBadgeColor(risk.severity)}`}>
                            {risk.riskLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">"{risk.description}"</p>
                        <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                          <span>Owner: {risk.owner}</span>
                          <span>Mitigation: <strong className="text-slate-600 font-semibold">{risk.mitigationStatus}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Signed Evidence & Documentation Files */}
                <div className="space-y-3">
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-150 pb-1">
                    <span className="text-indigo-600 font-bold">4.0</span> Verified Evidence & Compliance Documents
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hashed audit-ready evidence artifacts successfully registered into the compliance store:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {evidenceFiles.slice(0, 4).map((file) => (
                      <div key={file.id} className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg flex items-center gap-2.5 text-xs">
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-slate-800 block truncate">{file.name}</span>
                          <span className="text-[9px] text-slate-400 block font-mono">Hashed • {file.uploadDate}</span>
                        </div>
                        <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-150 px-1 py-0.5 rounded uppercase font-mono">
                          {file.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 5: Legal Disclaimer & Cryptographic Seal */}
                <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-left">AUTHORIZED COMPLIANCE HEAD</h4>
                    <div className="mt-4 border-b border-slate-300 w-44"></div>
                    <span className="text-[10px] text-slate-600 block mt-1">Demo Assessor</span>
                    <span className="text-[9px] text-slate-400 block">AI Governance Lead</span>
                  </div>
                  <div className="flex flex-col items-end justify-end">
                    <div className="w-20 h-20 border border-indigo-200 rounded-lg bg-indigo-50/20 flex flex-col items-center justify-center p-2 text-center text-indigo-500 font-mono">
                      <span className="text-[8px] uppercase tracking-wider block font-bold">SECURE EXPORT</span>
                      <Sparkles className="w-5 h-5 text-indigo-500 mt-1" />
                      <span className="text-[7px] text-indigo-400 block mt-1 font-mono font-medium">No. 40851A</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs text-slate-400">
                Approved artifact SHA-256 verification hash confirmed on secure server.
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewReport(null)}
                  className="px-4 py-2 border border-slate-250 text-slate-600 text-xs font-bold bg-white rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => printReport(previewReport, { projects, models, risks, evidenceFiles, policies, incidents, vendors, frameworks })}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  id="btn-print-report-modal"
                >
                  <Printer className="w-4 h-4" />
                  Print Report
                </button>
                <button
                  type="button"
                  onClick={() => downloadReportAsHtml(previewReport, { projects, models, risks, evidenceFiles, policies, incidents, vendors, frameworks })}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  id="btn-download-html-modal"
                >
                  <FileCode className="w-4 h-4" />
                  Download HTML
                </button>
                <button
                  type="button"
                  onClick={() => downloadReportAsPdf(previewReport, { projects, models, risks, evidenceFiles, policies, incidents, vendors, frameworks })}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  id="btn-download-pdf-modal"
                >
                  <FileDown className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Risk Details Dialog Modal */}
      {selectedRiskDetails && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 animate-scale-up my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/55">
              <div className="space-y-1 pr-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
                    {selectedRiskDetails.id}
                  </span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${getSeverityBadgeColor(selectedRiskDetails.severity)}`}>
                    {selectedRiskDetails.severity} SEVERITY
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                      selectedRiskDetails.riskLevel === "CRITICAL RISK" || selectedRiskDetails.riskLevel === "HIGH RISK"
                        ? "bg-rose-100 text-rose-800 border-rose-200"
                        : "bg-emerald-100 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    {selectedRiskDetails.riskLevel}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-1 text-left">
                  {selectedRiskDetails.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRiskDetails(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-left">
              {/* Description & Impact Section */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Description</h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 text-left">
                    {selectedRiskDetails.description}
                  </p>
                </div>

                {selectedRiskDetails.potentialImpact && (
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Potential Impact</h4>
                    <p className="text-xs text-rose-700 bg-rose-50/50 border border-rose-100 p-3 rounded-lg leading-relaxed text-left">
                      {selectedRiskDetails.potentialImpact}
                    </p>
                  </div>
                )}
              </div>

              {/* Ownership & Schedule Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 rounded text-slate-500 font-bold text-[9px] w-12 text-center uppercase tracking-wider font-mono">
                      OWN
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider text-left">Risk Owner</span>
                      <span className="text-xs font-bold text-slate-800 block text-left">{selectedRiskDetails.owner}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 rounded text-slate-500 font-bold text-[9px] w-12 text-center uppercase tracking-wider font-mono">
                      STS
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider text-left">Mitigation Status</span>
                      <span className="text-xs font-bold text-slate-800 block text-left">{selectedRiskDetails.mitigationStatus}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 rounded text-slate-500 font-bold text-[9px] w-12 text-center uppercase tracking-wider font-mono">
                      TGT
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider text-left">Target Date</span>
                      <span className="text-xs font-bold text-slate-800 block text-left">{selectedRiskDetails.targetDate || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 rounded text-slate-500 font-bold text-[9px] w-12 text-center uppercase tracking-wider font-mono">
                      INHR
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider text-left">Inherent Score</span>
                      <span className="text-xs font-bold text-slate-800 block text-left">
                        {selectedRiskDetails.likelihood} Likelihood × {selectedRiskDetails.severityCalc} Severity = {parseInt(selectedRiskDetails.likelihood) * parseInt(selectedRiskDetails.severityCalc)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 rounded text-slate-500 font-bold text-[9px] w-12 text-center uppercase tracking-wider font-mono">
                      RESD
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider text-left">Residual Score</span>
                      <span className="text-xs font-bold text-slate-800 block text-left">
                        {selectedRiskDetails.residualLikelihood || "2"} Likelihood × {selectedRiskDetails.residualSeverity || "2"} Severity = {parseInt(selectedRiskDetails.residualLikelihood || "2") * parseInt(selectedRiskDetails.residualSeverity || "2")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 rounded text-slate-500 font-bold text-[9px] w-12 text-center uppercase tracking-wider font-mono">
                      APPV
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider text-left">Approval Status</span>
                      <span className="text-xs font-bold text-slate-800 block text-left">
                        {selectedRiskDetails.approver || "N/A"} ({selectedRiskDetails.approvalStatus || "Pending"})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mapped Frameworks & Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Applicable Projects</h4>
                  <div className="flex flex-wrap gap-1 text-left mt-1">
                    {selectedRiskDetails.applicableProjects && selectedRiskDetails.applicableProjects.length > 0 ? (
                      selectedRiskDetails.applicableProjects.map((p, idx) => (
                        <span key={idx} className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs italic text-left">None listed</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Applicable Frameworks</h4>
                  <div className="flex flex-wrap gap-1 text-left mt-1">
                    {selectedRiskDetails.applicableFrameworks && selectedRiskDetails.applicableFrameworks.length > 0 ? (
                      selectedRiskDetails.applicableFrameworks.map((fw, idx) => (
                        <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {fw}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs italic text-left">None listed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mitigation Strategy & Implementation Details */}
              {(selectedRiskDetails.mitigationPlan || selectedRiskDetails.implementationStrategy) && (
                <div className="space-y-3 border-t border-slate-100 pt-4 text-left">
                  {selectedRiskDetails.mitigationPlan && (
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Mitigation Plan</h4>
                      <p className="text-xs text-slate-600 leading-relaxed text-left bg-slate-50/50 p-2.5 rounded border border-slate-100">
                        {selectedRiskDetails.mitigationPlan}
                      </p>
                    </div>
                  )}

                  {selectedRiskDetails.implementationStrategy && (
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Implementation Strategy</h4>
                      <p className="text-xs text-slate-600 leading-relaxed text-left bg-slate-50/50 p-2.5 rounded border border-slate-100">
                        {selectedRiskDetails.implementationStrategy}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations & Notes */}
              {(selectedRiskDetails.recommendations || selectedRiskDetails.notes) && (
                <div className="space-y-3 border-t border-slate-100 pt-4 text-left">
                  {selectedRiskDetails.recommendations && (
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Auditor Recommendations</h4>
                      <p className="text-xs text-indigo-700 bg-indigo-50/40 p-2.5 rounded-lg border border-indigo-100/60 leading-relaxed text-left">
                        {selectedRiskDetails.recommendations}
                      </p>
                    </div>
                  )}

                  {selectedRiskDetails.notes && (
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Internal Assessment Notes</h4>
                      <p className="text-xs text-slate-600 bg-amber-50/40 p-2.5 rounded-lg border border-amber-100/60 leading-relaxed text-left">
                        {selectedRiskDetails.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleDeleteRiskClick(selectedRiskDetails.id, selectedRiskDetails.name)}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Risk
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const rToEdit = selectedRiskDetails;
                    setSelectedRiskDetails(null);
                    handleOpenEditRisk(rToEdit);
                  }}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Edit Risk
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRiskDetails(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
