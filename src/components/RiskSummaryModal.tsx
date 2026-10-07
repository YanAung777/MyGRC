import React, { useState } from "react";
import {
  X,
  Shield,
  Layers,
  Info,
  Download,
  Printer,
  Filter,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { RiskAssessmentEntry } from "../types";

interface RiskSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: RiskAssessmentEntry[];
}

export type LikelihoodLevel = "Almost Certain" | "Likely" | "Possible" | "Unlikely" | "Rare";
export type ConsequenceLevel = "Routine" | "Minor" | "Moderate" | "Major" | "Severe";

export const LIKELIHOOD_LEVELS: LikelihoodLevel[] = [
  "Almost Certain",
  "Likely",
  "Possible",
  "Unlikely",
  "Rare"
];

export const CONSEQUENCE_LEVELS: ConsequenceLevel[] = [
  "Routine",
  "Minor",
  "Moderate",
  "Major",
  "Severe"
];

// Default position mappings for sample risks if explicit likelihood/consequence aren't set
const DEFAULT_RISK_POSITIONS: Record<string, {
  currentLikelihood: LikelihoodLevel;
  currentConsequence: ConsequenceLevel;
  targetLikelihood: LikelihoodLevel;
  targetConsequence: ConsequenceLevel;
}> = {
  SR01: {
    currentLikelihood: "Unlikely",
    currentConsequence: "Moderate",
    targetLikelihood: "Unlikely",
    targetConsequence: "Minor"
  },
  SR02: {
    currentLikelihood: "Possible",
    currentConsequence: "Minor",
    targetLikelihood: "Possible",
    targetConsequence: "Routine"
  },
  SR03: {
    currentLikelihood: "Possible",
    currentConsequence: "Minor",
    targetLikelihood: "Possible",
    targetConsequence: "Routine"
  },
  SR04: {
    currentLikelihood: "Possible",
    currentConsequence: "Moderate",
    targetLikelihood: "Possible",
    targetConsequence: "Minor"
  },
  SR05: {
    currentLikelihood: "Unlikely",
    currentConsequence: "Minor",
    targetLikelihood: "Unlikely",
    targetConsequence: "Routine"
  },
  SR06: {
    currentLikelihood: "Unlikely",
    currentConsequence: "Moderate",
    targetLikelihood: "Unlikely",
    targetConsequence: "Minor"
  },
  SR07: {
    currentLikelihood: "Almost Certain",
    currentConsequence: "Moderate",
    targetLikelihood: "Likely",
    targetConsequence: "Minor"
  },
  SR08: {
    currentLikelihood: "Possible",
    currentConsequence: "Moderate",
    targetLikelihood: "Possible",
    targetConsequence: "Routine"
  },
  SR09: {
    currentLikelihood: "Unlikely",
    currentConsequence: "Minor",
    targetLikelihood: "Unlikely",
    targetConsequence: "Routine"
  },
  SR10: {
    currentLikelihood: "Possible",
    currentConsequence: "Moderate",
    targetLikelihood: "Unlikely",
    targetConsequence: "Minor"
  },
  SR11: {
    currentLikelihood: "Possible",
    currentConsequence: "Moderate",
    targetLikelihood: "Unlikely",
    targetConsequence: "Minor"
  }
};

// Heatmap cell background colors based on Likelihood (row) and Consequence (col)
const getMatrixCellBg = (l: LikelihoodLevel, c: ConsequenceLevel): string => {
  if (l === "Almost Certain") {
    if (c === "Routine" || c === "Minor") return "bg-amber-400 text-slate-900 border-amber-500";
    if (c === "Moderate") return "bg-orange-500 text-white border-orange-600";
    return "bg-red-600 text-white border-red-700"; // Major, Severe
  }
  if (l === "Likely") {
    if (c === "Routine") return "bg-lime-500 text-slate-900 border-lime-600";
    if (c === "Minor" || c === "Moderate") return "bg-amber-400 text-slate-900 border-amber-500";
    if (c === "Major") return "bg-orange-500 text-white border-orange-600";
    return "bg-red-600 text-white border-red-700"; // Severe
  }
  if (l === "Possible") {
    if (c === "Routine" || c === "Minor") return "bg-lime-500 text-slate-900 border-lime-600";
    if (c === "Moderate") return "bg-amber-400 text-slate-900 border-amber-500";
    return "bg-orange-500 text-white border-orange-600"; // Major, Severe
  }
  if (l === "Unlikely") {
    if (c === "Routine") return "bg-emerald-700 text-white border-emerald-800";
    if (c === "Minor") return "bg-lime-500 text-slate-900 border-lime-600";
    if (c === "Moderate" || c === "Major") return "bg-amber-400 text-slate-900 border-amber-500";
    return "bg-orange-500 text-white border-orange-600"; // Severe
  }
  // Rare
  if (c === "Routine" || c === "Minor") return "bg-emerald-700 text-white border-emerald-800";
  if (c === "Moderate") return "bg-lime-500 text-slate-900 border-lime-600";
  return "bg-amber-400 text-slate-900 border-amber-500"; // Major, Severe
};

export default function RiskSummaryModal({
  isOpen,
  onClose,
  entries
}: RiskSummaryModalProps) {
  const [selectedRisk, setSelectedRisk] = useState<RiskAssessmentEntry | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  if (!isOpen) return null;

  // Filter entries if category selected
  const filteredEntries = entries.filter((e) => {
    if (filterCategory === "ALL") return true;
    if (filterCategory === "SR") return e.id.startsWith("SR");
    if (filterCategory === "PR") return e.id.startsWith("PR");
    if (filterCategory === "HR") return e.id.startsWith("HR");
    if (filterCategory === "ER") return e.id.startsWith("ER");
    if (filterCategory === "IMR") return e.id.startsWith("IMR");
    return true;
  });

  // Calculate items for each cell (row=likelihood, col=consequence)
  const getCellItems = (likelihood: LikelihoodLevel, consequence: ConsequenceLevel) => {
    const targetItems: RiskAssessmentEntry[] = [];
    const currentItems: RiskAssessmentEntry[] = [];
    const bothItems: RiskAssessmentEntry[] = [];

    filteredEntries.forEach((entry) => {
      const pos = DEFAULT_RISK_POSITIONS[entry.id] || {
        currentLikelihood: (entry.inherentRisk === "High" || entry.inherentRisk === "Critical" ? "Possible" : "Unlikely") as LikelihoodLevel,
        currentConsequence: (entry.impactMagnitude || "Moderate") as ConsequenceLevel,
        targetLikelihood: "Unlikely" as LikelihoodLevel,
        targetConsequence: "Minor" as ConsequenceLevel
      };

      const isCurrent = pos.currentLikelihood === likelihood && pos.currentConsequence === consequence;
      const isTarget = pos.targetLikelihood === likelihood && pos.targetConsequence === consequence;

      if (isCurrent && isTarget) {
        bothItems.push(entry);
      } else if (isTarget) {
        targetItems.push(entry);
      } else if (isCurrent) {
        currentItems.push(entry);
      }
    });

    return { targetItems, currentItems, bothItems };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-scale-in my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                Risk Summary: Likelihood & Consequence Matrix Map
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                5x5 Risk Matrix reflecting target and current residual risk positions across identified project risks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer hidden sm:flex items-center gap-1 text-xs font-semibold"
              title="Print Risk Matrix"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          
          {/* Top Controls & Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Risk Filter:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: "ALL", label: "All Risks" },
                  { id: "SR", label: "Security (SR)" },
                  { id: "PR", label: "Privacy (PR)" },
                  { id: "HR", label: "Human Rights (HR)" },
                  { id: "ER", label: "Ethics (ER)" },
                  { id: "IMR", label: "Info Mgmt (IMR)" }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterCategory(f.id)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                      filterCategory === f.id
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-semibold text-slate-500">
              Total Risks Displayed: <span className="font-extrabold text-slate-900">{filteredEntries.length}</span>
            </div>
          </div>

          {/* 5x5 Likelihood and Consequence Matrix Table */}
          <div className="bg-white rounded-xl border-2 border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs font-sans border-spacing-0">
                <thead>
                  {/* CONSEQUENCE Header Row */}
                  <tr>
                    <th colSpan={2} rowSpan={2} className="bg-white border-b-2 border-r-2 border-slate-800 p-2 text-center align-middle bg-slate-100">
                      <span className="font-mono text-[10px] text-slate-400 font-normal block">MATRIX</span>
                    </th>
                    <th
                      colSpan={5}
                      className="bg-white border-b border-slate-800 py-1.5 px-3 text-center font-black uppercase tracking-wider text-slate-900 text-xs"
                    >
                      CONSEQUENCE
                    </th>
                  </tr>
                  <tr>
                    {CONSEQUENCE_LEVELS.map((c) => (
                      <th
                        key={c}
                        className="bg-white border-b-2 border-r border-slate-800 py-2 px-2 text-center font-bold text-slate-800 text-[11px] w-1/5"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LIKELIHOOD_LEVELS.map((l, rIdx) => (
                    <tr key={l}>
                      {/* LIKELIHOOD Vertical Header */}
                      {rIdx === 0 && (
                        <th
                          rowSpan={5}
                          className="bg-white border-r-2 border-b-2 border-slate-800 p-2 text-center font-black uppercase tracking-wider text-slate-900 text-xs [writing-mode:vertical-lr] rotate-180"
                        >
                          LIKELIHOOD
                        </th>
                      )}
                      {/* Likelihood Row Label */}
                      <th className="bg-white border-r-2 border-b border-slate-800 py-3 px-2.5 text-left font-bold text-slate-800 text-[11px] whitespace-nowrap min-w-[110px]">
                        {l}
                      </th>

                      {/* Matrix Cells */}
                      {CONSEQUENCE_LEVELS.map((c, cIdx) => {
                        const cellBg = getMatrixCellBg(l, c);
                        const { targetItems, currentItems, bothItems } = getCellItems(l, c);
                        const isRightmost = cIdx === CONSEQUENCE_LEVELS.length - 1;
                        const isBottommost = rIdx === LIKELIHOOD_LEVELS.length - 1;

                        return (
                          <td
                            key={c}
                            className={`p-2 font-mono align-top text-xs min-h-[75px] h-[75px] w-1/5 border-b border-r ${
                              isRightmost ? "border-r-0" : "border-r-slate-800"
                            } ${isBottommost ? "border-b-2 border-b-slate-800" : "border-b-slate-800"} ${cellBg}`}
                          >
                            <div className="flex flex-wrap gap-1.5 items-start justify-start content-start h-full">
                              {/* Target Residual Risk = Current Residual Risk (Dark Blue) */}
                              {bothItems.map((item) => (
                                <button
                                  key={`both-${item.id}`}
                                  onClick={() => setSelectedRisk(item)}
                                  className="font-extrabold text-[#002060] bg-white/90 hover:bg-white px-1.5 py-0.5 rounded shadow-2xs border border-[#002060]/30 hover:scale-105 transition-all cursor-pointer text-[11px]"
                                  title={`${item.id}: ${item.title} (Target = Current)`}
                                >
                                  {item.id}
                                </button>
                              ))}

                              {/* Target Residual Risk Only (Light Blue) */}
                              {targetItems.map((item) => (
                                <button
                                  key={`target-${item.id}`}
                                  onClick={() => setSelectedRisk(item)}
                                  className="font-bold text-[#0070C0] bg-white/90 hover:bg-white px-1.5 py-0.5 rounded shadow-2xs border border-[#0070C0]/30 hover:scale-105 transition-all cursor-pointer text-[11px]"
                                  title={`${item.id}: ${item.title} (Target Residual Risk)`}
                                >
                                  {item.id}
                                </button>
                              ))}

                              {/* Current Residual Risk Only (Black) */}
                              {currentItems.map((item) => (
                                <button
                                  key={`current-${item.id}`}
                                  onClick={() => setSelectedRisk(item)}
                                  className="font-bold text-slate-950 bg-white/90 hover:bg-white px-1.5 py-0.5 rounded shadow-2xs border border-slate-900/30 hover:scale-105 transition-all cursor-pointer text-[11px]"
                                  title={`${item.id}: ${item.title} (Current Residual Risk)`}
                                >
                                  {item.id}
                                </button>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* KEY / LEGEND Banner */}
            <div className="border-t-2 border-slate-800 bg-white text-xs text-slate-900 divide-y divide-slate-800">
              {/* Row 1: Target vs Current Legend */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800 font-bold">
                <div className="p-2.5 flex items-center gap-2">
                  <span className="font-mono text-slate-700">KEY:</span>
                  <span className="text-[11px]">
                    Target Residual Risk: <span className="text-[#0070C0] font-extrabold font-mono">R##</span>
                  </span>
                </div>
                <div className="p-2.5 flex items-center gap-2">
                  <span className="text-[11px]">
                    Current Residual Risk: <span className="text-slate-950 font-extrabold font-mono">R##</span>
                  </span>
                </div>
                <div className="p-2.5 flex items-center gap-2">
                  <span className="text-[11px]">
                    Target Residual Risk = Current Residual Risk: <span className="text-[#002060] font-extrabold font-mono">R##</span>
                  </span>
                </div>
              </div>

              {/* Row 2: Prefix Definitions */}
              <div className="p-2.5 bg-slate-50 flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4 text-[11px] text-slate-700 font-medium">
                <div>Security Risks: <span className="font-mono font-bold text-slate-900">SR##</span></div>
                <div>Privacy Risks: <span className="font-mono font-bold text-slate-900">PR##</span></div>
                <div>Human Rights Risks: <span className="font-mono font-bold text-slate-900">HR##</span></div>
                <div>Ethics Risks: <span className="font-mono font-bold text-slate-900">ER##</span></div>
                <div>Information Management Risks: <span className="font-mono font-bold text-slate-900">IMR##</span></div>
              </div>
            </div>
          </div>

          {/* Selected Risk Detail Drawer / Banner */}
          {selectedRisk && (
            <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-4 animate-fade-in relative">
              <button
                onClick={() => setSelectedRisk(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-start gap-3">
                <div className="px-2 py-1 bg-indigo-600 text-white font-mono font-black text-xs rounded">
                  {selectedRisk.id}
                </div>
                <div className="space-y-1 pr-6">
                  <h4 className="text-xs font-extrabold text-slate-900">{selectedRisk.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{selectedRisk.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold pt-1 text-slate-700">
                    <span>Inherent: <strong className="text-slate-900">{selectedRisk.inherentRisk}</strong></span>
                    <span>Current Residual: <strong className="text-amber-700">{selectedRisk.currentResidualRisk}</strong></span>
                    <span>Target Residual: <strong className="text-emerald-700">{selectedRisk.targetResidualRisk}</strong></span>
                    <span>Owner: <strong className="text-slate-900">{selectedRisk.owner || "Engineering"}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            Click any Risk ID tag inside the 5x5 heatmap to inspect details and remediation status.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close Summary
          </button>
        </div>

      </div>
    </div>
  );
}
