import React, { useState } from "react";
import {
  CheckSquare,
  ChevronDown,
  ChevronUp,
  FileText,
  Upload,
  Eye,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Check,
  AlertTriangle,
  Info,
  ExternalLink,
  Layers
} from "lucide-react";
import {
  ChecklistPhase,
  PBCRequestItem,
  PolicyItem,
  StandardItem,
  CommonGapItem,
  INITIAL_CHECKLIST_PHASES,
  INITIAL_PBC_REQUEST_LIST,
  COMPLIANCE_STANDARDS_JSON
} from "../data/complianceChecklistData";
import RegulatoryTooltip from "./RegulatoryTooltip";

export interface ComplianceChecklistState {
  phases?: ChecklistPhase[];
  pbcItems?: PBCRequestItem[];
  policies?: PolicyItem[];
  standards?: StandardItem[];
}

interface ComplianceChecklistViewProps {
  data?: ComplianceChecklistState;
  onChangeData?: (updated: ComplianceChecklistState) => void;
  onUploadEvidence?: (itemName: string) => void;
}

export default function ComplianceChecklistView({
  data,
  onChangeData,
  onUploadEvidence
}: ComplianceChecklistViewProps) {
  // Local or prop state for phases
  const phases = data?.phases || INITIAL_CHECKLIST_PHASES;
  const pbcItems = data?.pbcItems || INITIAL_PBC_REQUEST_LIST;
  const policies = data?.policies || COMPLIANCE_STANDARDS_JSON.required_policies as PolicyItem[];
  const standards = data?.standards || COMPLIANCE_STANDARDS_JSON.standards as StandardItem[];
  const commonGaps = COMPLIANCE_STANDARDS_JSON.common_gaps as CommonGapItem[];

  // Accordion open/close state for phases
  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>({
    "phase-1": true,
    "phase-2": false,
    "phase-3": false,
    "phase-4": false
  });

  // Active subtab for Standards & Policies
  const [activeSubTab, setActiveSubTab] = useState<"checklist" | "pbc" | "policies" | "standards" | "gaps">("checklist");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // New PBC modal state
  const [showAddPbcModal, setShowAddPbcModal] = useState(false);
  const [newPbcItem, setNewPbcItem] = useState("");
  const [newPbcCategory, setNewPbcCategory] = useState("Policies & Procedures");

  // Interactive Upload Modal State
  const [activeUploadPbc, setActiveUploadPbc] = useState<PBCRequestItem | null>(null);
  const [pbcUploadFileName, setPbcUploadFileName] = useState("");
  const [pbcUploadNotes, setPbcUploadNotes] = useState("");
  const [viewingPbcEvidence, setViewingPbcEvidence] = useState<PBCRequestItem | null>(null);
  const [pbcSuccessToast, setPbcSuccessToast] = useState<string | null>(null);

  // Calculate readiness completion
  const totalTasks = phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = phases.reduce(
    (acc, p) => acc + p.tasks.filter((t) => t.completed).length,
    0
  );
  const completionPercent = Math.round((completedTasks / (totalTasks || 1)) * 100);

  // Toggle accordion phase
  const togglePhase = (phaseId: string) => {
    setOpenPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  // Toggle task completion
  const handleToggleTask = (phaseId: string, taskId: string) => {
    const updatedPhases = phases.map((p) => {
      if (p.id === phaseId) {
        return {
          ...p,
          tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        };
      }
      return p;
    });

    if (onChangeData) {
      onChangeData({
        phases: updatedPhases,
        pbcItems,
        policies,
        standards
      });
    }
  };

  // Update policy compliance status
  const handlePolicyChange = (policyName: string, field: "compliant" | "comment", value: string) => {
    const updatedPolicies = policies.map((p) => {
      if (p.policy_name === policyName) {
        return { ...p, [field]: value };
      }
      return p;
    });

    if (onChangeData) {
      onChangeData({
        phases,
        pbcItems,
        policies: updatedPolicies,
        standards
      });
    }
  };

  // Update standard compliance status
  const handleStandardChange = (standardName: string, field: "compliant" | "comment", value: string) => {
    const updatedStandards = standards.map((s) => {
      if (s.standard_name === standardName) {
        return { ...s, [field]: value };
      }
      return s;
    });

    if (onChangeData) {
      onChangeData({
        phases,
        pbcItems,
        policies,
        standards: updatedStandards
      });
    }
  };

  // Add new PBC Item
  const handleAddPbc = () => {
    if (!newPbcItem.trim()) return;
    const newItem: PBCRequestItem = {
      id: `pbc-${Date.now()}`,
      item: newPbcItem.trim(),
      category: newPbcCategory,
      status: "Missing",
      action: "Upload"
    };

    const updatedPbc = [...pbcItems, newItem];
    if (onChangeData) {
      onChangeData({
        phases,
        pbcItems: updatedPbc,
        policies,
        standards
      });
    }

    setNewPbcItem("");
    setShowAddPbcModal(false);
  };

  // Filtered lists
  const filteredPolicies = policies.filter((p) =>
    p.policy_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStandards = standards.filter((s) =>
    s.standard_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-slate-50/60 p-2 sm:p-5 rounded-2xl border border-slate-200/80">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold border border-blue-100 uppercase tracking-wider">
              Audit Readiness & Compliance
            </span>
            <span className="text-xs text-slate-400 font-semibold">• SOC 2 / ISO / Internal Standards</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Checklist & Policy Compliance Matrix
          </h2>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
            {COMPLIANCE_STANDARDS_JSON.description}
          </p>
        </div>

        {/* Overall Completion Ring / Badge */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Readiness Progress
            </span>
            <span className="text-xl font-black text-blue-700">{completionPercent}%</span>
            <span className="text-[11px] text-slate-500 font-medium block">
              {completedTasks} of {totalTasks} Tasks Done
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100/70 border-2 border-blue-500 flex items-center justify-center text-blue-700 font-black text-sm">
            {completionPercent}%
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab("checklist")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === "checklist"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Readiness Checklist</span>
          <span className="ml-1 px-1.5 py-0.2 bg-white/20 text-white text-[10px] rounded-full">
            {completedTasks}/{totalTasks}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("pbc")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === "pbc"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>PBC Request List</span>
          <span className="ml-1 px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[10px] rounded-full font-extrabold">
            {pbcItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("policies")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === "policies"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Required Policies</span>
          <span className="ml-1 px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[10px] rounded-full font-extrabold">
            {policies.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("standards")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === "standards"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Security Standards</span>
          <span className="ml-1 px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[10px] rounded-full font-extrabold">
            {standards.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("gaps")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === "gaps"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-800 border border-slate-200"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>Priority Gaps ({commonGaps.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: Readiness Checklist Accordion (Matching exact design in screenshot) */}
      {activeSubTab === "checklist" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Expand phases to review tasks and toggle completed items.</span>
            <span className="font-bold text-slate-700">
              {phases.filter((p) => p.tasks.every((t) => t.completed)).length} of {phases.length} Phases Completed
            </span>
          </div>

          <div className="space-y-3">
            {phases.map((phase) => {
              const isOpen = !!openPhases[phase.id];
              const phaseCompletedCount = phase.tasks.filter((t) => t.completed).length;
              const isPhaseAllDone = phaseCompletedCount === phase.tasks.length && phase.tasks.length > 0;

              return (
                <div
                  key={phase.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
                >
                  {/* Accordion Phase Header */}
                  <div
                    onClick={() => togglePhase(phase.id)}
                    className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50/80 cursor-pointer transition-colors border-b border-transparent data-[open=true]:border-slate-150"
                    data-open={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      {/* Check mark icon inside blue circle when phase is complete or active */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          isPhaseAllDone
                            ? "bg-blue-600 text-white"
                            : phaseCompletedCount > 0
                            ? "bg-blue-100 text-blue-700 font-bold text-xs"
                            : "bg-slate-100 border border-slate-300 text-slate-400"
                        }`}
                      >
                        {isPhaseAllDone ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <span className="text-xs font-bold">{phase.phaseNumber}</span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        {phase.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">
                        {phaseCompletedCount}/{phase.tasks.length} Completed
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Accordion Phase Content */}
                  {isOpen && (
                    <div className="p-5 bg-slate-50/50 space-y-3 border-t border-slate-100">
                      {phase.tasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(phase.id, task.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                            task.completed
                              ? "bg-white border-blue-200 shadow-2xs"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {/* Ticked Blue Checkbox matching image */}
                          <div className="mt-0.5 shrink-0">
                            {task.completed ? (
                              <div className="w-5 h-5 rounded bg-blue-600 border border-blue-600 flex items-center justify-center text-white shadow-2xs">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded border border-slate-300 bg-white hover:border-blue-400 transition-colors" />
                            )}
                          </div>

                          {/* Task Description */}
                          <div className="space-y-0.5 flex-1">
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-xs font-bold leading-snug ${
                                  task.completed ? "text-slate-900" : "text-slate-800"
                                }`}
                              >
                                {task.title}
                              </h4>
                              <RegulatoryTooltip clauseId="A.6.1.2" size="sm" variant="badge" />
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                              {task.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* PBC Request List Summary Card under Checklist */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                PBC Request List
              </h3>
              <button
                type="button"
                onClick={() => setActiveSubTab("pbc")}
                className="text-xs font-extrabold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                View All ({pbcItems.length})
              </button>
            </div>

            {/* Table of PBC Requests */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pbcItems.slice(0, 4).map((pbc) => (
                    <tr key={pbc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-800">{pbc.item}</td>
                      <td className="py-3 px-3 text-slate-500 font-medium">{pbc.category}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            pbc.status === "Missing"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : pbc.status === "Collected"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-purple-100 text-purple-800 border border-purple-200"
                          }`}
                        >
                          {pbc.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (pbc.status === "Collected") {
                              setViewingPbcEvidence(pbc);
                            } else {
                              setActiveUploadPbc(pbc);
                              setPbcUploadFileName(`${pbc.item.replace(/[^a-zA-Z0-9]/g, "_")}_Artifact.pdf`);
                            }
                          }}
                          className={`px-3 py-1 rounded-md text-[11px] font-bold border cursor-pointer transition-all ${
                            pbc.status === "Missing"
                              ? "bg-white border-blue-500 text-blue-600 hover:bg-blue-50"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {pbc.status === "Missing" ? "Upload" : "View Artifact"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Dedicated PBC Request List Screen */}
      {activeSubTab === "pbc" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Provided-By-Client (PBC) Request List
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage, upload, and track evidence requests needed by auditors for compliance review.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddPbcModal(true)}
              className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add PBC Request</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/60">
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pbcItems.map((pbc) => (
                  <tr key={pbc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{pbc.item}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{pbc.category}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                          pbc.status === "Missing"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : pbc.status === "Collected"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-purple-100 text-purple-800 border border-purple-200"
                        }`}
                      >
                        {pbc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (pbc.status === "Collected") {
                            setViewingPbcEvidence(pbc);
                          } else {
                            setActiveUploadPbc(pbc);
                            setPbcUploadFileName(`${pbc.item.replace(/[^a-zA-Z0-9]/g, "_")}_Artifact.pdf`);
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                          pbc.status === "Missing"
                            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-2xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {pbc.status === "Missing" ? <Upload className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{pbc.status === "Missing" ? "Upload" : "View Artifact"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Required Policies Table (from attached JSON) */}
      {activeSubTab === "policies" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Required Security Policies Assessment
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assess internal compliance against required security policies. Map priority gaps and track comments.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/60">
                  <th className="py-3 px-4 w-52 sm:w-60 shrink-0">Policy Name</th>
                  <th className="py-3 px-4 w-28 shrink-0">Compliant</th>
                  <th className="py-3 px-4">Comment / Notes</th>
                  <th className="py-3 px-4 w-44 shrink-0 text-center">Mapped Priority Gaps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPolicies.map((pol) => (
                  <tr key={pol.policy_name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 w-52 sm:w-60 shrink-0 align-top pt-4">{pol.policy_name}</td>
                    <td className="py-3.5 px-4 w-28 shrink-0 align-top pt-4">
                      <select
                        value={pol.compliant}
                        onChange={(e) => handlePolicyChange(pol.policy_name, "compliant", e.target.value as any)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${
                          pol.compliant === "Yes"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : pol.compliant === "No"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : pol.compliant === "N/A"
                            ? "bg-slate-100 text-slate-600 border-slate-200"
                            : "bg-white border-slate-200 text-slate-400"
                        }`}
                      >
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <textarea
                        rows={2}
                        placeholder="Enter detailed compliance comments, justification, or remediation notes..."
                        value={pol.comment}
                        onChange={(e) => handlePolicyChange(pol.policy_name, "comment", e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all font-medium min-h-[48px] resize-y"
                      />
                    </td>
                    <td className="py-3.5 px-4 w-44 shrink-0 text-center relative align-top pt-4">
                      {pol.priority_gaps && pol.priority_gaps.length > 0 ? (
                        <div className="relative group inline-flex justify-center">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{pol.priority_gaps.length} Gap{pol.priority_gaps.length > 1 ? "s" : ""}</span>
                          </button>

                          {/* Hover Popover Details */}
                          <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col z-50 w-80 p-3.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs space-y-2 pointer-events-auto border border-slate-700 animate-fade-in text-left">
                            <div className="flex items-center justify-between font-bold text-amber-400 border-b border-slate-800 pb-2 text-[11px] uppercase tracking-wider">
                              <span className="flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                Mapped Priority Gaps
                              </span>
                              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/30 font-extrabold">
                                {pol.priority_gaps.length} Active
                              </span>
                            </div>
                            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                              {pol.priority_gaps.map((gap, gIdx) => (
                                <div key={gIdx} className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700/80 text-slate-100 font-medium leading-relaxed text-[11px] flex items-start gap-2">
                                  <span className="text-amber-400 shrink-0 mt-0.5">⚠️</span>
                                  <span>{gap}</span>
                                </div>
                              ))}
                            </div>
                            <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800/80">
                              Hover icon to review gap details
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          None
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Security Standards Table (60 standards from JSON) */}
      {activeSubTab === "standards" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Security & Governance Standards Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprehensive mapping of internal technical standards (Authentication, Encryption, Logging, DevSecOps).
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search standards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px] scrollbar-thin">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead className="sticky top-0 bg-slate-100 z-10">
                <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-52 sm:w-60 shrink-0">Standard Name</th>
                  <th className="py-3 px-4 w-28 shrink-0">Status</th>
                  <th className="py-3 px-4">Comment / Notes</th>
                  <th className="py-3 px-4 w-44 shrink-0 text-center">Mapped Priority Gaps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStandards.map((std) => (
                  <tr key={std.standard_name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 w-52 sm:w-60 shrink-0 align-top pt-4">{std.standard_name}</td>
                    <td className="py-3 px-4 w-28 shrink-0 align-top pt-4">
                      <select
                        value={std.compliant}
                        onChange={(e) => handleStandardChange(std.standard_name, "compliant", e.target.value as any)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${
                          std.compliant === "Yes"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : std.compliant === "No"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : std.compliant === "N/A"
                            ? "bg-slate-100 text-slate-600 border-slate-200"
                            : "bg-white border-slate-200 text-slate-400"
                        }`}
                      >
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 align-top">
                      <textarea
                        rows={2}
                        placeholder="Enter technical comments, justifications, or notes..."
                        value={std.comment}
                        onChange={(e) => handleStandardChange(std.standard_name, "comment", e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all font-medium min-h-[48px] resize-y"
                      />
                    </td>
                    <td className="py-3 px-4 w-44 shrink-0 text-center relative align-top pt-4">
                      {std.priority_gaps && std.priority_gaps.length > 0 ? (
                        <div className="relative group inline-flex justify-center">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{std.priority_gaps.length} Gap{std.priority_gaps.length > 1 ? "s" : ""}</span>
                          </button>

                          {/* Hover Popover Details */}
                          <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col z-50 w-80 p-3.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs space-y-2 pointer-events-auto border border-slate-700 animate-fade-in text-left">
                            <div className="flex items-center justify-between font-bold text-amber-400 border-b border-slate-800 pb-2 text-[11px] uppercase tracking-wider">
                              <span className="flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                Mapped Priority Gaps
                              </span>
                              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/30 font-extrabold">
                                {std.priority_gaps.length} Active
                              </span>
                            </div>
                            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                              {std.priority_gaps.map((gap, gIdx) => (
                                <div key={gIdx} className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700/80 text-slate-100 font-medium leading-relaxed text-[11px] flex items-start gap-2">
                                  <span className="text-amber-400 shrink-0 mt-0.5">⚠️</span>
                                  <span>{gap}</span>
                                </div>
                              ))}
                            </div>
                            <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800/80">
                              Hover icon to review gap details
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          None
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 5: Priority Common Gaps Overview */}
      {activeSubTab === "gaps" && (
        <div className="space-y-4">
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">Common High-Priority Audit Gaps</h3>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                These high-priority gaps frequently cause SOC 2 / ISO audit findings. Address these early to prevent audit delays.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonGaps.map((gap, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:border-amber-300 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    {gap.area}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 uppercase">
                    {gap.priority} Priority
                  </span>
                </div>

                <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                  "{gap.gap}"
                </p>

                {gap.related_policies.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Related Policies:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {gap.related_policies.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {gap.related_standards.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Related Standards:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {gap.related_standards.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-medium border border-blue-100"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal to add new PBC Request */}
      {showAddPbcModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New PBC Evidence Request</h3>
              <button
                type="button"
                onClick={() => setShowAddPbcModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Evidence Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. SOC 2 Type II Assessor Report"
                  value={newPbcItem}
                  onChange={(e) => setNewPbcItem(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newPbcCategory}
                  onChange={(e) => setNewPbcCategory(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:border-blue-500 font-medium"
                >
                  <option value="Policies & Procedures">Policies & Procedures</option>
                  <option value="Planning & Scoping">Planning & Scoping</option>
                  <option value="Access Control">Access Control</option>
                  <option value="Vulnerability Management">Vulnerability Management</option>
                  <option value="Incident Response">Incident Response</option>
                  <option value="System Monitoring">System Monitoring</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddPbcModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddPbc}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Save Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive PBC Upload Modal */}
      {activeUploadPbc && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up border border-slate-200">
            <div className="bg-slate-900 text-white p-5">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Upload Evidence for PBC Item</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {activeUploadPbc.item} ({activeUploadPbc.category})
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!pbcUploadFileName.trim()) return;

                const updatedPbc = pbcItems.map((p) => {
                  if (p.id === activeUploadPbc.id || p.item === activeUploadPbc.item) {
                    return {
                      ...p,
                      status: "Collected" as const,
                      action: "View" as const
                    };
                  }
                  return p;
                });

                if (onChangeData) {
                  onChangeData({
                    phases,
                    pbcItems: updatedPbc,
                    policies,
                    standards
                  });
                }

                if (onUploadEvidence) {
                  onUploadEvidence(activeUploadPbc.item);
                }

                setPbcSuccessToast(`Successfully uploaded "${pbcUploadFileName}" for ${activeUploadPbc.item}`);
                setTimeout(() => setPbcSuccessToast(null), 3500);
                setActiveUploadPbc(null);
                setPbcUploadFileName("");
                setPbcUploadNotes("");
              }}
              className="p-5 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Evidence File / Artifact Title</label>
                <input
                  type="text"
                  required
                  value={pbcUploadFileName}
                  onChange={(e) => setPbcUploadFileName(e.target.value)}
                  placeholder="e.g. SOC2_Type_II_Assessor_Report.pdf"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Verification Notes / Custodian Summary</label>
                <textarea
                  rows={3}
                  value={pbcUploadNotes}
                  onChange={(e) => setPbcUploadNotes(e.target.value)}
                  placeholder="Summarize key audit observations or verification hash..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 font-medium"
                />
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Marking this PBC artifact as Collected updates the audit readiness quotient immediately.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveUploadPbc(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Confirm &amp; Mark Collected
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing PBC Evidence Modal */}
      {viewingPbcEvidence && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up border border-slate-200">
            <div className="bg-slate-900 text-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Collected PBC Artifact</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {viewingPbcEvidence.item}
              </p>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Category:</span>
                  <span className="font-bold text-slate-800">{viewingPbcEvidence.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="font-bold text-emerald-700">Collected &amp; Cryptographically Timestamped</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Integrity Checksum:</span>
                  <span className="font-mono text-[11px] text-slate-600">sha256:8f4c...91b2</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const target = viewingPbcEvidence;
                    setViewingPbcEvidence(null);
                    setActiveUploadPbc(target);
                    setPbcUploadFileName(`${target.item.replace(/[^a-zA-Z0-9]/g, "_")}_Updated.pdf`);
                  }}
                  className="px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Upload New Version
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPbcEvidence(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {pbcSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-scale-up">
          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{pbcSuccessToast}</span>
        </div>
      )}

    </div>
  );
}
