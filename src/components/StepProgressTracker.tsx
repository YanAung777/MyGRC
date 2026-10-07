import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  FileCheck2,
  BrainCircuit,
  Lock,
  Layers,
  Sparkles
} from "lucide-react";
import { AIProject } from "../types";

interface StepProgressTrackerProps {
  project: AIProject;
  activeSectionTab?: number;
  onTabChange?: (tabIndex: number) => void;
}

export interface StageDefinition {
  id: number;
  title: string;
  shortCode: string;
  description: string;
  tabIndex: number;
  status: "Completed" | "In Progress" | "Pending";
}

export default function StepProgressTracker({
  project,
  activeSectionTab = 0,
  onTabChange
}: StepProgressTrackerProps) {
  // Determine completion state based on project metadata
  const isCISOApproved = project.caSignOff?.certification?.level === "Certified";
  const isExecutiveAccredited = project.caSignOff?.accreditation?.level === "Accreditation";
  const completedTasksCount = project.completedComplianceTasks?.length || 0;

  const stages: StageDefinition[] = [
    {
      id: 1,
      title: "1. Intake & Scope",
      shortCode: "INTAKE",
      description: "Basics, Purpose & Role Type",
      tabIndex: 0,
      status: "Completed" // Baseline intake is created
    },
    {
      id: 2,
      title: "2. Risk Classification",
      shortCode: "RISK",
      description: `EU AI Act: ${project.riskClassification}`,
      tabIndex: 1,
      status: project.riskClassification ? "Completed" : "In Progress"
    },
    {
      id: 3,
      title: "3. Controls & Evidence",
      shortCode: "CONTROLS",
      description: `${completedTasksCount} compliance tasks verified`,
      tabIndex: 2,
      status: completedTasksCount > 0 ? "Completed" : "In Progress"
    },
    {
      id: 4,
      title: "4. Sign-Off & Lock",
      shortCode: "SIGN-OFF",
      description: isCISOApproved && isExecutiveAccredited ? "Certified & Accredited" : "Pending CISO Review",
      tabIndex: 4,
      status: isCISOApproved && isExecutiveAccredited ? "Completed" : "In Progress"
    }
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Governance Lifecycle Stage Tracker
            </h4>
            <p className="text-[11px] text-slate-500">
              Interactive progress pipeline for <strong className="text-slate-800">{project.title}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
            Lifecycle: {project.status || "In Progress"}
          </span>
        </div>
      </div>

      {/* Horizontal Stage Pipeline Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {stages.map((stg) => {
          const isCurrentTab = activeSectionTab === stg.tabIndex;

          return (
            <button
              key={stg.id}
              type="button"
              onClick={() => onTabChange && onTabChange(stg.tabIndex)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isCurrentTab
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-sm"
                  : stg.status === "Completed"
                  ? "bg-emerald-50/50 hover:bg-emerald-50 text-slate-800 border-emerald-200/80 hover:border-emerald-300"
                  : "bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200"
              }`}
            >
              <div className="flex justify-between items-start gap-1 mb-1">
                <span
                  className={`text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                    isCurrentTab
                      ? "bg-white/20 text-white"
                      : stg.status === "Completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {stg.shortCode}
                </span>

                {stg.status === "Completed" ? (
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      isCurrentTab ? "text-white" : "text-emerald-600"
                    }`}
                  />
                ) : (
                  <Clock
                    className={`w-4 h-4 ${
                      isCurrentTab ? "text-indigo-200" : "text-amber-500"
                    }`}
                  />
                )}
              </div>

              <span
                className={`text-xs font-extrabold block truncate leading-snug ${
                  isCurrentTab ? "text-white" : "text-slate-900"
                }`}
              >
                {stg.title}
              </span>

              <p
                className={`text-[10px] mt-0.5 truncate ${
                  isCurrentTab ? "text-indigo-100" : "text-slate-500"
                }`}
              >
                {stg.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
