import React, { useState, useRef } from "react";
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Paperclip,
  GitBranch,
  FileText,
  Save,
  Check,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  Eye,
  ShieldAlert,
  Cpu,
  Layers,
  FileCheck2
} from "lucide-react";
import { FrameworkClause, ControlRequirement, EvidenceFile, RiskRecord, TeamMember, AIProject, ModelRecord } from "../types";
import RegulatoryTooltip from "./RegulatoryTooltip";
import SoAGeneratorView from "./SoAGeneratorView";

interface FrameworksViewProps {
  iso42001Clauses: FrameworkClause[];
  iso27001Clauses: FrameworkClause[];
  nistCategories: FrameworkClause[];
  soc2Clauses: FrameworkClause[];
  onSaveRequirement: (
    frameworkId: "iso-27001" | "iso-42001" | "nist-ai-rmf" | "soc-2",
    clauseId: string,
    reqId: string,
    updated: Partial<ControlRequirement>
  ) => void;
  evidenceFiles: EvidenceFile[];
  risks: RiskRecord[];
  team: TeamMember[];
  projects?: AIProject[];
  models?: ModelRecord[];
  onAddEvidenceFile?: (file: EvidenceFile) => void;
  onPreviewFile?: (file: EvidenceFile) => void;
  onOpenMfaStepUp?: (actionTitle: string, onSuccess: () => void) => void;
}

export default function FrameworksView({
  iso42001Clauses,
  iso27001Clauses,
  nistCategories,
  soc2Clauses,
  onSaveRequirement,
  evidenceFiles,
  risks,
  team,
  projects = [],
  models = [],
  onAddEvidenceFile,
  onPreviewFile,
  onOpenMfaStepUp
}: FrameworksViewProps) {
  // Device uploading state for requirements detail evidence tab
  const [deviceUploadFile, setDeviceUploadFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeviceUpload = (file: File) => {
    if (!onAddEvidenceFile || !selectedReq) return;
    
    setIsUploading(true);
    
    // Simulate a brief upload delay for pristine UX
    setTimeout(() => {
      const newFileId = `ev-${Date.now()}`;
      const newFile: EvidenceFile = {
        id: newFileId,
        name: file.name,
        uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        uploader: team[0]?.name || "Demo Assessor",
        source: selectedReq.requirement.title || "Framework Requirement",
        version: "v1.0",
        status: "Draft",
        folderId: "fld-uncategorized"
      };
      
      onAddEvidenceFile(newFile);
      setLinkedEvidenceIds((prev) => [...prev, newFileId]);
      setDeviceUploadFile(null);
      setIsUploading(false);
    }, 600);
  };
  // Tabs: Regulation standard selected
  const [activeReg, setActiveReg] = useState<"iso-27001" | "iso-42001" | "nist-ai-rmf" | "soc-2">("iso-42001");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({ "4": true });

  // Detail Modal State
  const [selectedReq, setSelectedReq] = useState<{
    clauseId: string;
    requirement: ControlRequirement;
  } | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"details" | "evidence" | "cross" | "notes">("details");

  // Form states for active requirement in edit
  const [implementationDesc, setImplementationDesc] = useState("");
  const [status, setStatus] = useState<"Implemented" | "In progress" | "Not started">("Not started");
  const [owner, setOwner] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [approver, setApprover] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [auditorFeedback, setAuditorFeedback] = useState("");
  const [notesText, setNotesText] = useState("");
  const [isNoteSavedBanner, setIsNoteSavedBanner] = useState(false);

  // Linked evidence ids state, linked risks ids state (temporary for current edit requirement)
  const [linkedEvidenceIds, setLinkedEvidenceIds] = useState<string[]>([]);
  const [linkedRiskIds, setLinkedRiskIds] = useState<string[]>([]);

  const handleOpenReqDetails = (clauseId: string, req: ControlRequirement) => {
    setSelectedReq({ clauseId, requirement: req });
    setActiveModalTab("details");
    
    // Set form fields
    setImplementationDesc(req.implementationDescription || "");
    setStatus(req.status || "Not started");
    setOwner(req.owner || "");
    setReviewer(req.reviewer || "");
    setApprover(req.approver || "");
    setDueDate(req.dueDate || "");
    setAuditorFeedback(req.auditorFeedback || "");
    setNotesText(req.notes || "");
    setIsNoteSavedBanner(false);

    // Mock link some records based on name/id for demo flow
    setLinkedEvidenceIds([]);
    setLinkedRiskIds([]);
  };

  const handleSaveNoteDirectly = () => {
    if (!selectedReq) return;
    
    onSaveRequirement(activeReg, selectedReq.clauseId, selectedReq.requirement.id, {
      implementationDescription: implementationDesc,
      status: status,
      owner,
      reviewer,
      approver,
      dueDate,
      auditorFeedback,
      notes: notesText
    });

    setSelectedReq(prev => prev ? {
      ...prev,
      requirement: {
        ...prev.requirement,
        notes: notesText
      }
    } : null);

    setIsNoteSavedBanner(true);
    setTimeout(() => {
      setIsNoteSavedBanner(false);
    }, 3500);
  };

  const handleSaveReqDetails = () => {
    if (!selectedReq) return;
    
    onSaveRequirement(activeReg, selectedReq.clauseId, selectedReq.requirement.id, {
      implementationDescription: implementationDesc,
      status: status,
      owner,
      reviewer,
      approver,
      dueDate,
      auditorFeedback,
      notes: notesText
    });

    // Close Modal/Panel
    setSelectedReq(null);
  };

  const toggleClauseExpanded = (clauseId: string) => {
    setExpandedClauses(prev => ({
      ...prev,
      [clauseId]: !prev[clauseId]
    }));
  };

  const getActiveClauses = () => {
    if (activeReg === "iso-42001") return iso42001Clauses;
    if (activeReg === "iso-27001") return iso27001Clauses;
    if (activeReg === "soc-2") return soc2Clauses;
    return nistCategories;
  };

  const activeClauses = getActiveClauses();

  // Filter clauses based on query
  const filteredClauses = activeClauses.map(clause => {
    const matchedReqs = clause.requirements.filter(req => 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      req.summary.toLowerCase().includes(searchQuery.toLowerCase()) || 
      clause.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...clause,
      requirements: matchedReqs
    };
  }).filter(clause => clause.requirements.length > 0);

  // Stats calculation
  const totalRequirementsCount = activeClauses.reduce((sum, c) => sum + c.requirements.length, 0);
  const implementedRequirementsCount = activeClauses.reduce((sum, c) => 
    sum + c.requirements.filter(r => r.status === "Implemented").length, 0
  );
  const inProgressRequirementsCount = activeClauses.reduce((sum, c) => 
    sum + c.requirements.filter(r => r.status === "In progress").length, 0
  );

  // Workspace Sub-Tabs state
  const [workspaceTab, setWorkspaceTab] = useState<"controls" | "risks" | "models" | "soa">("controls");

  const getRegName = (reg: "iso-27001" | "iso-42001" | "nist-ai-rmf" | "soc-2") => {
    switch (reg) {
      case "iso-42001": return "ISO 42001";
      case "iso-27001": return "ISO 27001";
      case "nist-ai-rmf": return "NIST AI RMF";
      case "soc-2": return "SOC 2";
    }
  };

  const activeRegName = getRegName(activeReg);

  // Filter risks matching active standard
  const filteredFrameworkRisks = risks.filter((r) => {
    if (!r.applicableFrameworks || r.applicableFrameworks.length === 0) return true;
    return r.applicableFrameworks.some((f) =>
      f.toLowerCase().includes(activeRegName.toLowerCase()) ||
      activeRegName.toLowerCase().includes(f.toLowerCase())
    );
  });
  const displayRisks = filteredFrameworkRisks.length > 0 ? filteredFrameworkRisks : risks;

  // Filter AI Projects / systems matching active standard
  const filteredLinkedProjects = (projects || []).filter((p) => {
    if (!p.framework) return true;
    return (
      p.framework.toLowerCase().includes(activeRegName.toLowerCase()) ||
      activeRegName.toLowerCase().includes(p.framework.toLowerCase())
    );
  });
  const displayProjects = filteredLinkedProjects.length > 0 ? filteredLinkedProjects : (projects || []);

  return (
    <div className="space-y-6">
      {/* Header section with Workspace menu */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Organizational frameworks</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track implementation progress for each regulation in this framework program — ISO clauses and annexes, or NIST AI RMF functions.
        </p>

        {/* Framework Tabs Selectors */}
        <div className="flex flex-wrap gap-2 mt-6 border-b border-slate-100 pb-4">
          <button
            onClick={() => { setActiveReg("iso-27001"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeReg === "iso-27001"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
            id="tab-iso27001"
          >
            ISO 27001
          </button>
          <button
            onClick={() => { setActiveReg("iso-42001"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeReg === "iso-42001"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
            id="tab-iso42001"
          >
            ISO 42001
          </button>
          <button
            onClick={() => { setActiveReg("nist-ai-rmf"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeReg === "nist-ai-rmf"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
            id="tab-nistairmf"
          >
            NIST AI RMF
          </button>
          <button
            onClick={() => { setActiveReg("soc-2"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeReg === "soc-2"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
            id="tab-soc2"
          >
            SOC 2
          </button>
        </div>

        {/* Workspace Mini Sub-Tabs inside current standard */}
        <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Workspace</span>
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
              <button
                onClick={() => setWorkspaceTab("controls")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  workspaceTab === "controls"
                    ? "bg-white text-slate-800 shadow-xs border border-slate-200/50 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                id="subtab-controls"
              >
                Controls & Requirements
              </button>
              <button
                onClick={() => setWorkspaceTab("risks")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  workspaceTab === "risks"
                    ? "bg-white text-slate-800 shadow-xs border border-slate-200/50 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                id="subtab-risks"
              >
                Framework risks
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  workspaceTab === "risks" ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-600"
                }`}>
                  {displayRisks.length}
                </span>
              </button>
              <button
                onClick={() => setWorkspaceTab("models")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  workspaceTab === "models"
                    ? "bg-white text-slate-800 shadow-xs border border-slate-200/50 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                id="subtab-models"
              >
                Linked models
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  workspaceTab === "models" ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-600"
                }`}>
                  {displayProjects.length}
                </span>
              </button>
              <button
                onClick={() => setWorkspaceTab("soa")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  workspaceTab === "soa"
                    ? "bg-indigo-600 text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                id="subtab-soa"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Statement of Applicability (SoA)</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Header */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 bg-slate-50/50 px-4 py-2 rounded-lg border border-slate-100/50">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Implemented: <span className="font-bold text-slate-800">{implementedRequirementsCount} / {totalRequirementsCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              In Progress: <span className="font-bold text-slate-800">{inProgressRequirementsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Display area based on active Workspace Sub-Tab */}
      {workspaceTab === "controls" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        
        {/* Search controls bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/40">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code, requirement title, summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white text-slate-800 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 transition-colors"
              id="search-framework-clauses"
            />
          </div>

          <span className="text-xs font-medium text-slate-400">
            Showing {filteredClauses.length} clause blocks in active standard
          </span>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-slate-100">
          {filteredClauses.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No matching requirements found in active standard. Try a different query.
            </div>
          ) : (
            filteredClauses.map((clause) => {
              const isExpanded = expandedClauses[clause.id] !== false;
              const totalReqsInClause = clause.requirements.length;
              const implementedInClause = clause.requirements.filter(r => r.status === "Implemented").length;
              
              return (
                <div key={clause.id} className="bg-white">
                  {/* Clause Header Row */}
                  <div
                    onClick={() => toggleClauseExpanded(clause.id)}
                    className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{clause.title}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {totalReqsInClause} requirements mapped in this module
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Progress ratios */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-bold text-slate-700">
                          {implementedInClause} / {totalReqsInClause}
                        </span>
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${(implementedInClause / totalReqsInClause) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Requirements List (Nested inside Clause) */}
                  {isExpanded && (
                    <div className="bg-slate-50/30 divide-y divide-slate-100/60 border-t border-slate-100 px-5">
                      {clause.requirements.map((req) => (
                        <div
                          key={req.id}
                          onClick={() => handleOpenReqDetails(clause.id, req)}
                          className="py-4 hover:bg-slate-100/40 transition-colors cursor-pointer group flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 max-w-[80%]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-slate-400">{req.id}</span>
                              <h4 className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                {req.title}
                              </h4>
                              <RegulatoryTooltip clauseId={req.id} size="sm" variant="icon" />
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pl-6">
                              {req.summary}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Status label */}
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                req.status === "Implemented"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : req.status === "In progress"
                                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      )}

      {/* Framework Risks View */}
      {workspaceTab === "risks" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                Risks Mapped to {activeRegName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Identified operational, technical, and regulatory risks linked to {activeRegName} compliance requirements.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
              {displayRisks.length} Mapped Risks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayRisks.map((risk) => {
              const severityColor =
                risk.severity === "MAJOR" || risk.severity === "VERY HIGH" || risk.severity === "HIGH"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : risk.severity === "MEDIUM"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200";

              return (
                <div key={risk.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-white hover:border-indigo-200 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{risk.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityColor}`}>
                          {risk.severity} SEVERITY
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mt-1">{risk.name}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      risk.mitigationStatus === "COMPLETED" ? "bg-emerald-100 text-emerald-800" :
                      risk.mitigationStatus === "IN PROGRESS" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-700"
                    }`}>
                      {risk.mitigationStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{risk.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {risk.categories?.map((cat) => (
                      <span key={cat} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                    <span>Owner: <strong className="text-slate-700">{risk.owner}</strong></span>
                    <span>Target: <strong className="text-slate-700">{risk.targetDate}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Statement of Applicability (SoA) View */}
      {workspaceTab === "soa" && (
        <div className="animate-fade-in" id="panel-soa-generator">
          <SoAGeneratorView evidenceFiles={evidenceFiles} onOpenMfaStepUp={onOpenMfaStepUp} />
        </div>
      )}

      {/* Linked Models View */}
      {workspaceTab === "models" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                AI Systems & Models Linked to {activeRegName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Registered AI models, systems, and deployment pipelines governed by {activeRegName} control requirements.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
              {displayProjects.length} Systems
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayProjects.map((proj) => {
              const riskBadgeColor =
                proj.riskClassification === "High Risk" || proj.riskClassification === "Unacceptable"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : proj.riskClassification === "Limited"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200";

              return (
                <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-white hover:border-indigo-200 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskBadgeColor}`}>
                        {proj.riskClassification || "Standard Risk"}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-1.5">{proj.title}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {proj.status || "Active"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>

                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>Role: <strong className="text-slate-700">{proj.roleType || "System Pipeline"}</strong></span>
                    </div>
                    {proj.mappedModels && proj.mappedModels.length > 0 && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Models: <strong className="text-slate-700">{proj.mappedModels.join(", ")}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                    <span>Owner: <strong className="text-slate-700">{proj.owner}</strong></span>
                    <span>Geography: <strong className="text-slate-700">{proj.geography || "Global"}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Statement of Applicability (SoA) View */}
      {workspaceTab === "soa" && (
        <div className="animate-fade-in" id="panel-soa-generator">
          <SoAGeneratorView evidenceFiles={evidenceFiles} onOpenMfaStepUp={onOpenMfaStepUp} />
        </div>
      )}

      {/* Expanded Clause Requirement detailed panel overlay modal */}
      {selectedReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50 animate-fade-in" id="modal-requirement-details">
          <div className="bg-white w-full max-w-3xl h-full flex flex-col justify-between shadow-2xl relative animate-slide-left overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/60 flex justify-between items-start">
              <div className="space-y-1 pr-6">
                <span className="text-xs font-mono font-extrabold text-indigo-600">{selectedReq.requirement.id}</span>
                <h2 className="text-lg font-bold text-slate-800 leading-snug">{selectedReq.requirement.title}</h2>
                <p className="text-xs text-slate-400">Review implementation, evidence, mappings, and notes.</p>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-100 px-6 bg-white gap-4">
              <button
                onClick={() => setActiveModalTab("details")}
                className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeModalTab === "details"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveModalTab("evidence")}
                className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeModalTab === "evidence"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Evidence ({linkedEvidenceIds.length})
              </button>
              <button
                onClick={() => setActiveModalTab("cross")}
                className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeModalTab === "cross"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Cross mappings
              </button>
              <button
                onClick={() => setActiveModalTab("notes")}
                className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeModalTab === "notes"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Notes
              </button>
            </div>

            {/* Scrollable Content Pane */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 space-y-6">
              
              {/* Tab 1: Details and configuration */}
              {activeModalTab === "details" && (
                <div className="space-y-6">
                  
                  {/* Summary / Guideline */}
                  <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100/50 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Summary</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        {selectedReq.requirement.summary}
                      </p>
                    </div>

                    {selectedReq.requirement.implementationGuidance && (
                      <div className="pt-3 border-t border-indigo-100/40">
                        <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Implementation Guidance & Strategic Actions</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mt-1">
                          {selectedReq.requirement.implementationGuidance}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-indigo-100/40">
                      <div>
                        <h5 className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Key Questions</h5>
                        <ul className="list-disc list-inside space-y-1 text-slate-500 mt-1">
                          {selectedReq.requirement.keyQuestions?.map((q, idx) => (
                            <li key={idx} className="text-[11px] leading-relaxed">{q}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Evidence Examples</h5>
                        <ul className="list-disc list-inside space-y-1 text-slate-500 mt-1">
                          {selectedReq.requirement.evidenceExamples?.map((ev, idx) => (
                            <li key={idx} className="text-[11px] leading-relaxed">{ev}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Implementation Description Text area */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                      Implementation Description *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe how this requirement is implemented inside your workflows..."
                      value={implementationDesc}
                      onChange={(e) => setImplementationDesc(e.target.value)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-3 outline-none focus:border-indigo-500 leading-relaxed"
                    />
                  </div>

                  {/* Status, Owners, review group details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Status selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                      >
                        <option value="Not started">Not started</option>
                        <option value="In progress">In progress</option>
                        <option value="Implemented">Implemented</option>
                      </select>
                    </div>

                    {/* Due Date picker */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                      />
                    </div>

                    {/* Owner selection dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                        Owner
                      </label>
                      <select
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                      >
                        <option value="">Select owner</option>
                        {team.map(m => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Reviewer selection dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                        Reviewer
                      </label>
                      <select
                        value={reviewer}
                        onChange={(e) => setReviewer(e.target.value)}
                        className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none"
                      >
                        <option value="">Select reviewer</option>
                        {team.map(m => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Approver selection dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                        Approver
                      </label>
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

                  </div>

                  {/* Auditor Feedback field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                      Auditor Feedback
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter audit feedback or remarks left by reviewer/auditor..."
                      value={auditorFeedback}
                      onChange={(e) => setAuditorFeedback(e.target.value)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-3 outline-none focus:border-indigo-500 leading-relaxed"
                    />
                  </div>

                </div>
              )}

              {/* Tab 2: Evidence attachment mapping */}
              {activeModalTab === "evidence" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200/60">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Evidence Files Linked</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Link corporate documents to prove compliance during audits.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Sim link a file for demo flow
                          const firstUnlinked = evidenceFiles.find(f => !linkedEvidenceIds.includes(f.id));
                          if (firstUnlinked) {
                            setLinkedEvidenceIds([...linkedEvidenceIds, firstUnlinked.id]);
                          }
                        }}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-all cursor-pointer"
                      >
                        Select existing
                      </button>
                    </div>
                  </div>

                  {linkedEvidenceIds.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-200 p-8">
                      <Paperclip className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-xs font-bold text-slate-500">No evidence linked yet</p>
                      <p className="text-[11px] text-slate-400 mt-1">Select from existing files or upload a new file below.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {linkedEvidenceIds.map((id) => {
                        const file = evidenceFiles.find((f) => f.id === id);
                        if (!file) return null;
                        return (
                          <div key={file.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-indigo-500" />
                              <div>
                                <span className="text-xs font-bold text-slate-700">{file.name}</span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  Uploaded: {file.uploadDate} by {file.uploader}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => onPreviewFile?.(file)}
                                className="text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                                title="Open file preview"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setLinkedEvidenceIds(linkedEvidenceIds.filter((x) => x !== file.id))}
                                className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                title="Unlink file"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Real Device File Upload Dropzone */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload New System Evidence</h5>
                      {deviceUploadFile && (
                        <button
                          onClick={() => setDeviceUploadFile(null)}
                          className="text-[10px] font-semibold text-rose-500 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setDeviceUploadFile(file);
                          handleDeviceUpload(file);
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
                          setDeviceUploadFile(file);
                          handleDeviceUpload(file);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        isDragging
                          ? "border-indigo-500 bg-indigo-50/40"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          <p className="text-xs font-semibold text-slate-600">Uploading {deviceUploadFile?.name}...</p>
                        </>
                      ) : deviceUploadFile ? (
                        <>
                          <Check className="w-8 h-8 text-emerald-500 animate-bounce" />
                          <p className="text-xs font-semibold text-slate-700 truncate max-w-full px-4">
                            Uploaded: {deviceUploadFile.name}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-bold">Instantly registered & linked!</p>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-slate-400" />
                          <p className="text-xs font-semibold text-slate-600">
                            Drag & drop device files or <span className="text-indigo-600 font-bold underline">browse</span>
                          </p>
                          <p className="text-[10px] text-slate-400">PDF, DOC, XLSX, CSV, JPG up to 50MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Cross mappings (linking risks) */}
              {activeModalTab === "cross" && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200/60">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Linked risks</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Link risks from your risk database to track which risks are being addressed by this implementation.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Risk Database Options</span>
                      <button
                        onClick={() => {
                          // Quick link risk for demonstration
                          const firstUnlinkedRisk = risks.find(r => !linkedRiskIds.includes(r.id));
                          if (firstUnlinkedRisk) {
                            setLinkedRiskIds([...linkedRiskIds, firstUnlinkedRisk.id]);
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200 cursor-pointer"
                      >
                        + Add/remove risks
                      </button>
                    </div>

                    {linkedRiskIds.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-200">
                        <GitBranch className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-xs font-bold text-slate-500">No risks linked yet</p>
                        <p className="text-[11px] text-slate-400 mt-1">Click '+ Add/remove risks' to link risks from your risk database.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {linkedRiskIds.map((id) => {
                          const r = risks.find((x) => x.id === id);
                          if (!r) return null;
                          return (
                            <div key={r.id} className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center">
                              <div>
                                <span className="text-xs font-bold text-slate-700 block">{r.name}</span>
                                <span className="text-[10px] text-slate-400 mt-0.5 block leading-relaxed">{r.description}</span>
                                <span className="inline-block mt-2 text-[9px] font-extrabold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-sm">
                                  {r.severity}
                                </span>
                              </div>
                              <button
                                onClick={() => setLinkedRiskIds(linkedRiskIds.filter((x) => x !== r.id))}
                                className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-md"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Control specific local notes */}
              {activeModalTab === "notes" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                        Internal Notes
                      </label>
                      {isNoteSavedBanner && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-fade-in">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Note saved successfully!</span>
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={8}
                      placeholder="Add personal notes, meeting decisions, or research remarks specific to this control..."
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-3 outline-none focus:border-indigo-500 leading-relaxed font-sans"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <p className="text-[11px] text-slate-400">
                      Notes are stored directly on the requirement record.
                    </p>
                    <button
                      type="button"
                      onClick={handleSaveNoteDirectly}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save note
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Bottom Sticky Save Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors bg-white border border-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReqDetails}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg flex items-center gap-1.5 cursor-pointer"
                id="btn-save-requirement-changes"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
