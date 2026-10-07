import React, { useState, useEffect } from "react";
import {
  X,
  Shield,
  AlertTriangle,
  Info,
  Save,
  Plus,
  List,
  Bold,
  FileText
} from "lucide-react";
import { RiskAssessmentEntry } from "../types";

interface RiskAssessmentEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: RiskAssessmentEntry) => void;
  initialEntry?: RiskAssessmentEntry | null;
}

const CONTROL_SUGGESTIONS = [
  "C01 Access Control Policy",
  "C03 Segregation of Duties",
  "C05 Encryption at Rest",
  "C08 Multi-Factor Authentication",
  "C12 Continuous Audit Logging",
  "C14 Account Lifecycle Management",
  "C18 Vulnerability Scanning",
  "C22 Data Minimization & Masking",
  "C25 Incident Response Plan"
];

export default function RiskAssessmentEntryModal({
  isOpen,
  onClose,
  onSave,
  initialEntry
}: RiskAssessmentEntryModalProps) {
  const [riskId, setRiskId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [impacts, setImpacts] = useState("");
  const [exampleScenarios, setExampleScenarios] = useState("");
  const [affects, setAffects] = useState<("Confidentiality" | "Integrity" | "Availability")[]>([]);
  const [inherentRisk, setInherentRisk] = useState<"Critical" | "High" | "Medium" | "Low" | "">("");
  const [impactMagnitude, setImpactMagnitude] = useState<"Minor" | "Moderate" | "Major" | "Severe" | "Critical" | "">("");
  const [existingSecurityControls, setExistingSecurityControls] = useState<string[]>([]);
  const [controlInput, setControlInput] = useState("");
  const [currentResidualRisk, setCurrentResidualRisk] = useState<"Critical" | "High" | "Medium" | "Low" | "">("");
  const [targetResidualRisk, setTargetResidualRisk] = useState<"Critical" | "High" | "Medium" | "Low" | "">("");
  const [remediationPlans, setRemediationPlans] = useState("");
  const [noRemediationPlans, setNoRemediationPlans] = useState("");
  const [rationale, setRationale] = useState("");

  useEffect(() => {
    if (initialEntry) {
      setRiskId(initialEntry.id || "");
      setTitle(initialEntry.title || "");
      setDescription(initialEntry.description || "");
      setImpacts(initialEntry.impacts || "");
      setExampleScenarios(initialEntry.exampleScenarios || "");
      setAffects(initialEntry.affects || []);
      setInherentRisk(initialEntry.inherentRisk || "");
      setImpactMagnitude(initialEntry.impactMagnitude || "");
      setExistingSecurityControls(initialEntry.existingSecurityControls || []);
      setCurrentResidualRisk(initialEntry.currentResidualRisk || "");
      setTargetResidualRisk(initialEntry.targetResidualRisk || "");
      setRemediationPlans(initialEntry.remediationPlans || "");
      setNoRemediationPlans(initialEntry.noRemediationPlans || "");
      setRationale(initialEntry.rationale || "");
    } else {
      setRiskId(`SR${Math.floor(Math.random() * 90 + 10)}`);
      setTitle("");
      setDescription("");
      setImpacts("");
      setExampleScenarios("");
      setAffects(["Confidentiality", "Integrity"]);
      setInherentRisk("High");
      setImpactMagnitude("Major");
      setExistingSecurityControls(["C03 Segregation of Duties", "C14 Account Lifecycle Management"]);
      setCurrentResidualRisk("Medium");
      setTargetResidualRisk("Low");
      setRemediationPlans("");
      setNoRemediationPlans("");
      setRationale("");
    }
  }, [initialEntry, isOpen]);

  if (!isOpen) return null;

  const toggleAffect = (val: "Confidentiality" | "Integrity" | "Availability") => {
    if (affects.includes(val)) {
      setAffects(affects.filter((a) => a !== val));
    } else {
      setAffects([...affects, val]);
    }
  };

  const handleAddControl = (ctrl: string) => {
    const trimmed = ctrl.trim();
    if (trimmed && !existingSecurityControls.includes(trimmed)) {
      setExistingSecurityControls([...existingSecurityControls, trimmed]);
      setControlInput("");
    }
  };

  const handleRemoveControl = (ctrl: string) => {
    setExistingSecurityControls(existingSecurityControls.filter((c) => c !== ctrl));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEntry: RiskAssessmentEntry = {
      id: riskId.trim() || `SR${Math.floor(Math.random() * 90 + 10)}`,
      title: title.trim(),
      description,
      impacts,
      exampleScenarios,
      affects,
      inherentRisk: inherentRisk || "Medium",
      impactMagnitude: impactMagnitude || "Moderate",
      existingSecurityControls,
      currentResidualRisk: currentResidualRisk || "Medium",
      targetResidualRisk: targetResidualRisk || "Low",
      remediationPlans,
      noRemediationPlans,
      rationale,
      owner: "Engineering"
    };

    onSave(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-in my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {initialEntry ? "Edit Security Risk Assessment Entry" : "New Security Risk Assessment Entry"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Document a new security risk for assessment and remediation planning.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleFormSubmit}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Entry
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-6">
            
            {/* Section 1: Risk Identification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm border-b border-slate-100 pb-2">
                <div className="p-1 bg-blue-50 text-blue-600 rounded-md">
                  <Info className="w-4 h-4" />
                </div>
                <span>Risk Identification</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Risk ID</label>
                  <input
                    type="text"
                    value={riskId}
                    onChange={(e) => setRiskId(e.target.value)}
                    placeholder="e.g., SR02"
                    className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div className="md:col-span-8 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Risk Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Short descriptive title"
                    className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Risk Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the risk..."
                  className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">This may result in (Impacts)</label>
                <div className="border border-slate-300 rounded-lg bg-white overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-500/20">
                  <div className="bg-slate-100/70 px-3 py-1.5 border-b border-slate-200 flex items-center gap-2">
                    <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600">
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600 font-bold text-xs">
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={impacts}
                    onChange={(e) => setImpacts(e.target.value)}
                    placeholder="List potential outcomes..."
                    className="w-full text-xs text-slate-800 p-3 outline-none border-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Context & Impact */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm border-b border-slate-100 pb-2">
                <div className="p-1 bg-blue-50 text-blue-600 rounded-md">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span>Context & Impact</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Example Scenarios</label>
                <textarea
                  rows={3}
                  value={exampleScenarios}
                  onChange={(e) => setExampleScenarios(e.target.value)}
                  placeholder="Describe scenarios where this risk manifests..."
                  className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Affects</label>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-700 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={affects.includes("Confidentiality")}
                        onChange={() => toggleAffect("Confidentiality")}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>Confidentiality</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={affects.includes("Integrity")}
                        onChange={() => toggleAffect("Integrity")}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>Integrity</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={affects.includes("Availability")}
                        onChange={() => toggleAffect("Availability")}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>Availability</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-3 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Inherent Risk</label>
                  <select
                    value={inherentRisk}
                    onChange={(e) => setInherentRisk(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="">Select level</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Impact Magnitude</label>
                  <select
                    value={impactMagnitude}
                    onChange={(e) => setImpactMagnitude(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="">Select magnitude</option>
                    <option value="Minor">Minor</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Major">Major</option>
                    <option value="Severe">Severe</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Controls & Remediation */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm border-b border-slate-100 pb-2">
                <div className="p-1 bg-blue-50 text-blue-600 rounded-md">
                  <Shield className="w-4 h-4" />
                </div>
                <span>Controls & Remediation</span>
              </div>

              {/* Existing Security Controls */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Existing Security Controls</label>
                <div className="border border-slate-300 rounded-lg p-2 bg-white flex flex-wrap items-center gap-2 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-500/20">
                  {existingSecurityControls.map((ctrl) => (
                    <span
                      key={ctrl}
                      className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-200"
                    >
                      <span>{ctrl}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveControl(ctrl)}
                        className="text-emerald-700 hover:text-emerald-950 rounded-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={controlInput}
                    onChange={(e) => setControlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddControl(controlInput);
                      }
                    }}
                    placeholder="Type to search and add controls..."
                    className="flex-1 text-xs text-slate-800 outline-none p-1 min-w-[200px]"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Select from existing control library or type new control.</p>
              </div>

              {/* Residual Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Current Residual Risk</label>
                  <select
                    value={currentResidualRisk}
                    onChange={(e) => setCurrentResidualRisk(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="">Select level</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Target Residual Risk</label>
                  <select
                    value={targetResidualRisk}
                    onChange={(e) => setTargetResidualRisk(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="">Select level</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Plans in place & No Plans */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Plans in place to remediate</label>
                  <textarea
                    rows={3}
                    value={remediationPlans}
                    onChange={(e) => setRemediationPlans(e.target.value)}
                    placeholder="Outline active remediation plans..."
                    className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">No Plans to Remediate</label>
                  <textarea
                    rows={3}
                    value={noRemediationPlans}
                    onChange={(e) => setNoRemediationPlans(e.target.value)}
                    placeholder="List controls with no agreed remediation..."
                    className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Rationale */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Rationale</label>
                <div className="border border-slate-300 rounded-lg bg-white overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-500/20">
                  <div className="bg-slate-100/70 px-3 py-1.5 border-b border-slate-200 flex items-center gap-2">
                    <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600">
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="Provide justification for current and target risk levels..."
                    className="w-full text-xs text-slate-800 p-3 outline-none border-none"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save Risk Entry
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
