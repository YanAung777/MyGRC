import React, { useState } from "react";
import {
  Play,
  Clock,
  ShieldCheck,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Shield
} from "lucide-react";
import {
  ProjectRemediationPlan,
  PrePostRemediationItem,
  AcceptedRiskItem
} from "../types";

export const DEFAULT_SAMPLE_REMEDIATION_PLAN: ProjectRemediationPlan = {
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
};

interface RemediationPlanViewProps {
  data?: ProjectRemediationPlan;
  onChangeData?: (updated: ProjectRemediationPlan) => void;
  readOnly?: boolean;
}

type ModalCategory = "preGoLive" | "postGoLive" | "acceptedRisks" | null;

export default function RemediationPlanView({
  data,
  onChangeData,
  readOnly = false
}: RemediationPlanViewProps) {
  // Current remediation state
  const currentPlan: ProjectRemediationPlan = {
    preGoLive: data?.preGoLive ?? DEFAULT_SAMPLE_REMEDIATION_PLAN.preGoLive,
    postGoLive: data?.postGoLive ?? DEFAULT_SAMPLE_REMEDIATION_PLAN.postGoLive,
    acceptedRisks: data?.acceptedRisks ?? DEFAULT_SAMPLE_REMEDIATION_PLAN.acceptedRisks
  };

  // Entry modal states
  const [activeModalCat, setActiveModalCat] = useState<ModalCategory>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form fields for Pre/Post Go Live
  const [controlNo, setControlNo] = useState("");
  const [controlName, setControlName] = useState("");
  const [remediationDescription, setRemediationDescription] = useState("");
  const [risks, setRisks] = useState<"High" | "Medium" | "Low">("Medium");
  const [manager, setManager] = useState("");
  const [targetDate, setTargetDate] = useState("");

  // Form fields for Accepted Risk
  const [justification, setJustification] = useState("");
  const [residualRisk, setResidualRisk] = useState<"High" | "Medium" | "Low">("Medium");
  const [approver, setApprover] = useState("");
  const [reviewDate, setReviewDate] = useState("");

  // View Details Modal
  const [viewingItem, setViewingItem] = useState<{
    type: "prePost" | "accepted";
    item: PrePostRemediationItem | AcceptedRiskItem;
    categoryTitle: string;
  } | null>(null);

  const handleLoadSampleData = () => {
    if (onChangeData) {
      onChangeData(DEFAULT_SAMPLE_REMEDIATION_PLAN);
    }
  };

  const openNewEntryModal = (cat: ModalCategory) => {
    setActiveModalCat(cat);
    setEditingItemId(null);
    setControlNo("");
    setControlName("");
    setRemediationDescription("");
    setRisks("Medium");
    setManager("");
    setTargetDate(new Date().toISOString().split("T")[0]);
    setJustification("");
    setResidualRisk("Medium");
    setApprover("");
    setReviewDate(new Date().toISOString().split("T")[0]);
  };

  const openEditModal = (cat: ModalCategory, item: PrePostRemediationItem | AcceptedRiskItem) => {
    setActiveModalCat(cat);
    setEditingItemId(item.id);
    setControlNo(item.controlNo);
    setControlName(item.controlName);

    if (cat === "acceptedRisks") {
      const acc = item as AcceptedRiskItem;
      setJustification(acc.justification);
      setResidualRisk(acc.residualRisk);
      setApprover(acc.approver);
      setReviewDate(acc.reviewDate);
    } else {
      const prePost = item as PrePostRemediationItem;
      setRemediationDescription(prePost.remediationDescription);
      setRisks(prePost.risks);
      setManager(prePost.manager);
      setTargetDate(prePost.targetDate);
    }
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalCat || !onChangeData) return;

    if (activeModalCat === "acceptedRisks") {
      const newItem: AcceptedRiskItem = {
        id: editingItemId || `rem-acc-${Date.now()}`,
        controlNo: controlNo || "CC-X.X",
        controlName: controlName || "Control Requirement",
        justification: justification || "Risk accepted.",
        residualRisk,
        approver: approver || "Risk Approver",
        reviewDate: reviewDate || new Date().toISOString().split("T")[0]
      };

      const existing = currentPlan.acceptedRisks || [];
      const updatedList = editingItemId
        ? existing.map(i => i.id === editingItemId ? newItem : i)
        : [...existing, newItem];

      onChangeData({
        ...currentPlan,
        acceptedRisks: updatedList
      });
    } else {
      const newItem: PrePostRemediationItem = {
        id: editingItemId || `rem-${activeModalCat}-${Date.now()}`,
        controlNo: controlNo || "CC-X.X",
        controlName: controlName || "Control Requirement",
        remediationDescription: remediationDescription || "Planned remediation activity.",
        risks,
        manager: manager || "Remediation Lead",
        targetDate: targetDate || new Date().toISOString().split("T")[0]
      };

      const existing = currentPlan[activeModalCat] || [];
      const updatedList = editingItemId
        ? existing.map(i => i.id === editingItemId ? newItem : i)
        : [...existing, newItem];

      onChangeData({
        ...currentPlan,
        [activeModalCat]: updatedList
      });
    }

    setActiveModalCat(null);
  };

  const handleDeleteItem = (cat: ModalCategory, itemId: string) => {
    if (!cat || !onChangeData) return;
    if (confirm("Are you sure you want to delete this remediation entry?")) {
      const existing = currentPlan[cat] || [];
      const updatedList = (existing as any[]).filter((i: any) => i.id !== itemId);
      onChangeData({
        ...currentPlan,
        [cat]: updatedList
      });
    }
  };

  const getRiskBadge = (level?: "High" | "Medium" | "Low") => {
    switch (level) {
      case "High":
        return <span className="inline-block bg-rose-100/90 text-rose-800 font-bold px-2.5 py-0.5 rounded text-[11px] border border-rose-200/80">High</span>;
      case "Medium":
        return <span className="inline-block bg-amber-100/90 text-amber-800 font-bold px-2.5 py-0.5 rounded text-[11px] border border-amber-200/80">Medium</span>;
      case "Low":
        return <span className="inline-block bg-emerald-100/90 text-emerald-800 font-bold px-2.5 py-0.5 rounded text-[11px] border border-emerald-200/80">Low</span>;
      default:
        return <span className="inline-block bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded text-[11px] border border-slate-200">Medium</span>;
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Remediation Plan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Manage and track identified control deficiencies and their planned remediation activities to ensure a robust compliance posture.
          </p>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={handleLoadSampleData}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            title="Reset or load sample remediation data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Load Sample Data</span>
          </button>
        )}
      </div>

      {/* 1. Pre-Go-Live Remediation */}
      <div className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              </span>
              <h4 className="text-base font-bold text-slate-900">Pre-Go-Live Remediation</h4>
            </div>
            <p className="text-xs text-slate-500 pl-6">
              Agreed activities to be completed before the system goes live.
            </p>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={() => openNewEntryModal("preGoLive")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Entry</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                <th className="py-3 px-4 w-28">CONTROL NO.</th>
                <th className="py-3 px-4 w-40">CONTROL NAME</th>
                <th className="py-3 px-4">REMEDIATION DESCRIPTION</th>
                <th className="py-3 px-4 w-24">RISKS</th>
                <th className="py-3 px-4 w-32">MANAGER</th>
                <th className="py-3 px-4 w-28">TARGET DATE</th>
                <th className="py-3 px-4 w-28 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!currentPlan.preGoLive || currentPlan.preGoLive.length === 0) ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400 italic font-medium">
                    No pre-go-live remediation entries recorded.
                  </td>
                </tr>
              ) : (
                currentPlan.preGoLive.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">{item.controlNo}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.controlName}</td>
                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed">{item.remediationDescription}</td>
                    <td className="py-3.5 px-4">{getRiskBadge(item.risks)}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{item.manager}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">{item.targetDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingItem({ type: "prePost", item, categoryTitle: "Pre-Go-Live Remediation" })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View entry details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {!readOnly && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditModal("preGoLive", item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                              title="Edit entry"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem("preGoLive", item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Post-Go-Live Remediation */}
      <div className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Clock className="w-2.5 h-2.5" />
              </span>
              <h4 className="text-base font-bold text-slate-900">Post-Go-Live Remediation</h4>
            </div>
            <p className="text-xs text-slate-500 pl-6">
              Controls that are ineffective now but will be remediated after go-live.
            </p>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={() => openNewEntryModal("postGoLive")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-indigo-700 border border-slate-300 transition-all cursor-pointer shadow-2xs whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Entry</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                <th className="py-3 px-4 w-28">CONTROL NO.</th>
                <th className="py-3 px-4 w-40">CONTROL NAME</th>
                <th className="py-3 px-4">REMEDIATION DESCRIPTION</th>
                <th className="py-3 px-4 w-24">RISKS</th>
                <th className="py-3 px-4 w-32">MANAGER</th>
                <th className="py-3 px-4 w-28">TARGET DATE</th>
                <th className="py-3 px-4 w-28 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!currentPlan.postGoLive || currentPlan.postGoLive.length === 0) ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400 italic font-medium">
                    No post-go-live remediation entries recorded.
                  </td>
                </tr>
              ) : (
                currentPlan.postGoLive.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">{item.controlNo}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.controlName}</td>
                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed">{item.remediationDescription}</td>
                    <td className="py-3.5 px-4">{getRiskBadge(item.risks)}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{item.manager}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">{item.targetDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingItem({ type: "prePost", item, categoryTitle: "Post-Go-Live Remediation" })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View entry details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {!readOnly && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditModal("postGoLive", item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                              title="Edit entry"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem("postGoLive", item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Accepted Risks / No Remediation */}
      <div className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-slate-700 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-2.5 h-2.5" />
              </span>
              <h4 className="text-base font-bold text-slate-900">Accepted Risks / No Remediation</h4>
            </div>
            <p className="text-xs text-slate-500 pl-6">
              Controls that are ineffective with no current plans to remediate, typically due to risk acceptance.
            </p>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={() => openNewEntryModal("acceptedRisks")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition-all cursor-pointer shadow-2xs whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Entry</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/80">
                <th className="py-3 px-4 w-28">CONTROL NO.</th>
                <th className="py-3 px-4 w-40">CONTROL NAME</th>
                <th className="py-3 px-4">JUSTIFICATION</th>
                <th className="py-3 px-4 w-28">RESIDUAL RISK</th>
                <th className="py-3 px-4 w-32">APPROVER</th>
                <th className="py-3 px-4 w-28">REVIEW DATE</th>
                <th className="py-3 px-4 w-28 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!currentPlan.acceptedRisks || currentPlan.acceptedRisks.length === 0) ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400 italic font-medium">
                    No accepted risk entries recorded.
                  </td>
                </tr>
              ) : (
                currentPlan.acceptedRisks.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">{item.controlNo}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.controlName}</td>
                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed">{item.justification}</td>
                    <td className="py-3.5 px-4">{getRiskBadge(item.residualRisk)}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{item.approver}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">{item.reviewDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingItem({ type: "accepted", item, categoryTitle: "Accepted Risks / No Remediation" })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View entry details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {!readOnly && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditModal("acceptedRisks", item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                              title="Edit entry"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem("acceptedRisks", item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {activeModalCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center">
                  <Shield className="w-3 h-3" />
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {editingItemId ? "Edit Remediation Entry" : "New Remediation Entry"}
                  <span className="text-xs text-slate-500 font-normal ml-2">
                    ({activeModalCat === "preGoLive" ? "Pre-Go-Live" : activeModalCat === "postGoLive" ? "Post-Go-Live" : "Accepted Risk"})
                  </span>
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalCat(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Control No.
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CC-2.1"
                    value={controlNo}
                    onChange={(e) => setControlNo(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Control Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Encryption at Rest"
                    value={controlName}
                    onChange={(e) => setControlName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 font-medium"
                  />
                </div>
              </div>

              {activeModalCat === "acceptedRisks" ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Risk Acceptance Justification
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Detail why remediation is deferred or risk accepted..."
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 font-medium min-h-[70px]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Residual Risk
                      </label>
                      <select
                        value={residualRisk}
                        onChange={(e) => setResidualRisk(e.target.value as any)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:bg-white focus:border-indigo-600"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Approver
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. R. Taylor (CTO)"
                        value={approver}
                        onChange={(e) => setApprover(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Review Date
                      </label>
                      <input
                        type="date"
                        required
                        value={reviewDate}
                        onChange={(e) => setReviewDate(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 outline-none focus:bg-white focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Remediation Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Detail planned remediation steps..."
                      value={remediationDescription}
                      onChange={(e) => setRemediationDescription(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 font-medium min-h-[70px]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Risks Level
                      </label>
                      <select
                        value={risks}
                        onChange={(e) => setRisks(e.target.value as any)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:bg-white focus:border-indigo-600"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Manager / Lead
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. M. Chen (Eng)"
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Target Date
                      </label>
                      <input
                        type="date"
                        required
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 outline-none focus:bg-white focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-slate-150 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalCat(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{editingItemId ? "Save Changes" : "Add Entry"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Overlay Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center">
                  <Eye className="w-3 h-3" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Remediation Entry Details</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{viewingItem.categoryTitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Control Number</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{viewingItem.item.controlNo}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Risk Rating</span>
                  <div className="mt-0.5">
                    {getRiskBadge(viewingItem.type === "accepted" ? (viewingItem.item as AcceptedRiskItem).residualRisk : (viewingItem.item as PrePostRemediationItem).risks)}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Control Name</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{viewingItem.item.controlName}</p>
              </div>

              {viewingItem.type === "accepted" ? (
                <>
                  <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Risk Acceptance Justification</span>
                    <p className="text-slate-800 leading-relaxed font-medium">{(viewingItem.item as AcceptedRiskItem).justification}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approver</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{(viewingItem.item as AcceptedRiskItem).approver}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Review Date</span>
                      <p className="font-mono text-slate-700 mt-0.5">{(viewingItem.item as AcceptedRiskItem).reviewDate}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Remediation Description</span>
                    <p className="text-slate-800 leading-relaxed font-medium">{(viewingItem.item as PrePostRemediationItem).remediationDescription}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Manager / Lead</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{(viewingItem.item as PrePostRemediationItem).manager}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Date</span>
                      <p className="font-mono text-slate-700 mt-0.5">{(viewingItem.item as PrePostRemediationItem).targetDate}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-150 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
