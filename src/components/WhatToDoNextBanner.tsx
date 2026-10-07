import React, { useState } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Code, 
  ClipboardCheck,
  AlertTriangle,
  FileText,
  Upload
} from "lucide-react";
import { AIProject, RiskRecord, IncidentRecord } from "../types";

export type PersonaType = "CISO" | "DEVELOPER" | "AUDITOR";

interface ActionItem {
  id: string;
  title: string;
  description: string;
  targetTab: string;
  targetSubTab?: string;
  badgeText: string;
  badgeColor: string;
  iconType: "shield" | "code" | "file" | "alert" | "upload";
  completed: boolean;
}

interface WhatToDoNextBannerProps {
  activePersona: PersonaType;
  projects: AIProject[];
  risks: RiskRecord[];
  incidents: IncidentRecord[];
  iso42001Progress: number;
  onNavigateToTab: (tab: string, subTab?: string) => void;
}

export default function WhatToDoNextBanner({
  activePersona,
  projects,
  risks,
  incidents,
  iso42001Progress,
  onNavigateToTab
}: WhatToDoNextBannerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Generate Persona-Tailored Action Items
  const getActionItems = (): ActionItem[] => {
    if (activePersona === "CISO") {
      return [
        {
          id: "ciso-1",
          title: "Finalize C&A Executive Sign-Off Declaration",
          description: "Default GRC Node project requires final CISO certification sign-off before go-live.",
          targetTab: "projects",
          badgeText: "High Priority",
          badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
          iconType: "shield",
          completed: !!completedItems["ciso-1"]
        },
        {
          id: "ciso-2",
          title: "Approve Critical Risk Mitigation Plan",
          description: `${risks.filter(r => r.severity === "MAJOR" || r.severity === "VERY HIGH").length} critical risks identified in AI model inference pipeline awaiting executive review.`,
          targetTab: "risks",
          badgeText: "Risk Review",
          badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
          iconType: "alert",
          completed: !!completedItems["ciso-2"]
        },
        {
          id: "ciso-3",
          title: "Close ISO 42001 Gap to Reach 80% Certification Threshold",
          description: `Current ISO 42001 progress is ${iso42001Progress}%. Complete 4 remaining governance clauses.`,
          targetTab: "frameworks",
          badgeText: "ISO 42001",
          badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
          iconType: "file",
          completed: !!completedItems["ciso-3"]
        }
      ];
    }

    if (activePersona === "DEVELOPER") {
      return [
        {
          id: "dev-1",
          title: "Upload Data Protection & AI Impact Assessment (DPIA)",
          description: "Customer Churn LLM model is classified as High Risk. Attach technical DPIA file.",
          targetTab: "evidence",
          badgeText: "Evidence Missing",
          badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
          iconType: "upload",
          completed: !!completedItems["dev-1"]
        },
        {
          id: "dev-2",
          title: "Publish Model Specifications & Model Cards",
          description: "3 newly registered model versions require hyperparameters and dataset lineage entries.",
          targetTab: "models",
          badgeText: "Model Registry",
          badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
          iconType: "code",
          completed: !!completedItems["dev-2"]
        },
        {
          id: "dev-3",
          title: "Resolve Active LLM Output Incident",
          description: `${incidents.filter(i => i.status === "Open").length} open bias/hallucination incidents logged on production inference APIs.`,
          targetTab: "incidents",
          badgeText: "Incident Gate",
          badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
          iconType: "alert",
          completed: !!completedItems["dev-3"]
        }
      ];
    }

    // AUDITOR PERSONA
    return [
      {
        id: "aud-1",
        title: "Audit ISO 42001 Annex A.6.1.2 Unintended Impact Assessment",
        description: "Verify evidence files and fairness test benchmarks attached to clause A.6.1.2.",
        targetTab: "frameworks",
        badgeText: "Audit Mandatory",
        badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
        iconType: "file",
        completed: !!completedItems["aud-1"]
      },
      {
        id: "aud-2",
        title: "Review & Sign Off PBC Evidence Requests",
        description: "5 uploaded evidence items in PBC list pending auditor approval and verification.",
        targetTab: "evidence",
        badgeText: "PBC Verification",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        iconType: "file",
        completed: !!completedItems["aud-2"]
      },
      {
        id: "aud-3",
        title: "Export System Report PDF Package for Certifying Body",
        description: "Compile multi-section audit bundle with cryptographic verification hashes.",
        targetTab: "reports",
        badgeText: "PDF Export",
        badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
        iconType: "shield",
        completed: !!completedItems["aud-3"]
      }
    ];
  };

  const actionItems = getActionItems();
  const completedCount = actionItems.filter(i => i.completed).length;
  const totalCount = actionItems.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const toggleItemComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/60 relative overflow-hidden transition-all">
      {/* Background Subtle Accent Glow */}
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-indigo-800/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-tight">What To Do Next</h2>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                {activePersona} Copilot
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              Prioritized action items tailored for your <strong className="text-white">{activePersona}</strong> role workflow.
            </p>
          </div>
        </div>

        {/* Right Header Progress & Collapse Toggle */}
        <div className="flex items-center gap-4 self-end sm:self-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-200">
              {completedCount}/{totalCount} Completed
            </span>
            <div className="w-20 bg-indigo-900/80 rounded-full h-1.5 overflow-hidden border border-indigo-700/50">
              <div 
                className="bg-emerald-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-indigo-300 hover:text-white hover:bg-indigo-800/50 rounded-lg transition-colors cursor-pointer"
            title={isCollapsed ? "Expand action items" : "Collapse action items"}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body Items List */}
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {actionItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onNavigateToTab(item.targetTab, item.targetSubTab)}
              className={`group p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer relative ${
                item.completed
                  ? "bg-slate-900/50 border-slate-800/80 opacity-60"
                  : "bg-slate-900/80 hover:bg-slate-800 border-indigo-800/40 hover:border-indigo-500/60 shadow-md hover:shadow-indigo-950/50"
              }`}
            >
              <div className="space-y-2">
                {/* Top Badge & Number */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-extrabold text-indigo-400">
                    STEP 0{index + 1}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                    {item.badgeText}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-xs font-bold leading-snug transition-colors ${
                  item.completed ? "line-through text-slate-400" : "text-white group-hover:text-indigo-200"
                }`}>
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-indigo-200/70 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Action Button & Complete Toggle */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-indigo-900/40">
                <button
                  type="button"
                  onClick={(e) => toggleItemComplete(item.id, e)}
                  className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors cursor-pointer ${
                    item.completed ? "text-emerald-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${item.completed ? "text-emerald-400 fill-emerald-950" : ""}`} />
                  <span>{item.completed ? "Done" : "Mark Done"}</span>
                </button>

                <span className="text-xs font-bold text-indigo-400 group-hover:text-white inline-flex items-center gap-1 transition-colors">
                  Take Action <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
