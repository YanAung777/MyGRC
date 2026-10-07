import React from "react";
import {
  ShieldAlert,
  FolderKanban,
  FileCheck,
  AlertOctagon,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  Code,
  ClipboardCheck
} from "lucide-react";
import { AIProject, RiskRecord, IncidentRecord, OrganizationalPolicy } from "../types";
import WhatToDoNextBanner, { PersonaType } from "./WhatToDoNextBanner";
import RegulatoryTooltip from "./RegulatoryTooltip";

interface DashboardViewProps {
  projects: AIProject[];
  risks: RiskRecord[];
  incidents: IncidentRecord[];
  policies: OrganizationalPolicy[];
  onNavigateToTab: (tab: string, subTab?: string) => void;
  iso42001Progress: number;
  iso27001Progress: number;
  nistProgress: number;
  soc2Progress?: number;
  onResetLayout?: () => void;
  activePersona?: PersonaType;
}

export default function DashboardView({
  projects,
  risks,
  incidents,
  policies,
  onNavigateToTab,
  iso42001Progress,
  iso27001Progress,
  nistProgress,
  soc2Progress = 0,
  onResetLayout,
  activePersona = "CISO"
}: DashboardViewProps) {
  const activeIncidents = incidents.filter((i) => i.status === "Open" || i.status === "Investigating");
  const criticalRisksCount = risks.filter((r) => r.severity === "MAJOR" || r.severity === "VERY HIGH").length;
  
  // Calculate aggregate program health
  const averageProgress = Math.round((iso42001Progress + iso27001Progress + nistProgress + soc2Progress) / 4);

  // Hardcoded or dynamically appended activities
  const defaultActivities = [
    { id: "act-1", text: 'Policy "AI Risk Assessment Policy" created', time: "4h ago", user: "Demo Assessor" },
    { id: "act-2", text: 'Policy "AI Continuous Monitoring Policy" created', time: "1d ago", user: "Demo Assessor" },
    { id: "act-3", text: 'Risk "Hallucination" identified and classified as HIGH RISK', time: "2d ago", user: "Leo Vance" },
    { id: "act-4", text: 'Vendor "Anthropic" compliance status set to Approved', time: "5d ago", user: "Demo Assessor" }
  ];

  return (
    <div className="space-y-6">
      {/* 1. What To Do Next Banner (Priority Action Items Copilot) */}
      <WhatToDoNextBanner
        activePersona={activePersona}
        projects={projects}
        risks={risks}
        incidents={incidents}
        iso42001Progress={iso42001Progress}
        onNavigateToTab={onNavigateToTab}
      />

      {/* Top Welcome Title Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard</h1>
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1">
              {activePersona === "CISO" && <ShieldCheck className="w-3.5 h-3.5" />}
              {activePersona === "DEVELOPER" && <Code className="w-3.5 h-3.5" />}
              {activePersona === "AUDITOR" && <ClipboardCheck className="w-3.5 h-3.5" />}
              {activePersona} View Active
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {activePersona === "CISO" && "Executive risk overview, C&A sign-off declarations, and ISO 42001 program health."}
            {activePersona === "DEVELOPER" && "Model registry specifications, technical safety gates, and DPIA evidence uploads."}
            {activePersona === "AUDITOR" && "Clause-by-clause audit verification matrix, PBC evidence logs, and report exports."}
          </p>
        </div>
        <button
          onClick={onResetLayout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          id="btn-reset-layout"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Layout
        </button>
      </div>

      {/* Bento Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Program Health Circular Gauge */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between" id="card-program-health">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Program Health</h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Auto</span>
          </div>

          <div className="py-6 flex flex-col items-center justify-center relative">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#f1f5f9"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * averageProgress) / 100}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-800">{averageProgress}%</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Health</span>
              </div>
            </div>
            
            <div className="mt-5 text-center">
              <p className="text-sm font-semibold text-slate-700">Across 4 frameworks</p>
              <p className="text-xs text-slate-400 mt-1">
                Controls in progress: <strong className="text-slate-600">22 / 708</strong> • 11 fully implemented
              </p>
            </div>
          </div>

          <button 
            onClick={() => onNavigateToTab("frameworks")}
            className="w-full flex items-center justify-between text-xs font-medium text-indigo-600 hover:text-indigo-800 pt-4 border-t border-slate-50 transition-colors group cursor-pointer"
          >
            <span>Manage frameworks</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Column 2: Secondary Metric Bento Cards */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Projects Metric */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex-1 flex flex-col justify-between" id="card-total-projects">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Projects</span>
                <span className="text-4xl font-extrabold text-slate-800 mt-2 block">{projects.length}</span>
              </div>
              <div className="bg-sky-50 p-2.5 rounded-lg">
                <FolderKanban className="w-5 h-5 text-sky-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">0 in production</span>
              <button
                onClick={() => onNavigateToTab("projects")}
                className="text-xs text-slate-500 hover:text-indigo-600 font-medium inline-flex items-center gap-0.5 cursor-pointer"
              >
                Go to Projects <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Risks Metric */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex-1 flex flex-col justify-between" id="card-total-risks">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Risks</span>
                <span className="text-4xl font-extrabold text-slate-800 mt-2 block">{risks.length}</span>
              </div>
              <div className="bg-rose-50 p-2.5 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-rose-600 font-medium">{criticalRisksCount} critical</span>
              <button
                onClick={() => onNavigateToTab("risks")}
                className="text-xs text-slate-500 hover:text-indigo-600 font-medium inline-flex items-center gap-0.5 cursor-pointer"
              >
                Go to Risk Register <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Approvals Metric */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex-1 flex flex-col justify-between" id="card-total-approvals">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Approvals</span>
                <span className="text-4xl font-extrabold text-slate-800 mt-2 block">0</span>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-lg">
                <FileCheck className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">Pending review</span>
              <span className="text-[10px] font-mono text-slate-400">Up to date</span>
            </div>
          </div>
        </div>

        {/* Card 3: Incident Response List Panel */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between" id="card-incident-response">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Incident Response</h3>
                <span className="text-slate-200">|</span>
                <span className="text-xs font-semibold text-slate-500">Live tracker</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-3xl font-extrabold text-slate-800">{activeIncidents.length}</span>
                <span className="text-xs text-slate-400 font-medium">OPEN</span>
              </div>
            </div>
            <div className="bg-indigo-50 p-2.5 rounded-lg">
              <AlertOctagon className="w-5 h-5 text-indigo-600" />
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-4">Open cases need tracking and resolution.</p>

          <div className="space-y-3 overflow-y-auto max-h-[190px] pr-1 flex-1">
            {activeIncidents.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">No active incidents logged. All clear!</div>
            ) : (
              activeIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-center gap-2 mb-1.5">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                        inc.severity === "CRITICAL" || inc.severity === "SERIOUS"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">ID: {inc.id}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-700 line-clamp-2 leading-relaxed">
                    {inc.type === "Bias" 
                      ? `Bias mismatch on ${inc.project}` 
                      : `Unintended output identified on ${inc.project}`}
                  </h4>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200/50">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {inc.occurred}
                    </span>
                    <span className="text-[9px] bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded-full font-medium capitalize">
                      {inc.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => onNavigateToTab("incidents")}
            className="w-full flex items-center justify-between text-xs font-medium text-indigo-600 hover:text-indigo-800 pt-4 mt-4 border-t border-slate-50 transition-colors group cursor-pointer"
          >
            <span>View incident log</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>

      {/* Secondary Row: Framework Compliance Progress & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Framework Compliance Progress Bars */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs lg:col-span-2 flex flex-col justify-between" id="card-frameworks-progress">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Framework Progress</h3>
            
            <div className="space-y-6">
              {/* ISO 42001 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-sm font-semibold text-slate-700">ISO/IEC 42001 (AI Management System)</span>
                    <RegulatoryTooltip clauseId="4.1" size="sm" variant="badge" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">{iso42001Progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${iso42001Progress}%` }}
                  ></div>
                </div>
              </div>

              {/* ISO 27001 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    <span className="text-sm font-semibold text-slate-700">ISO/IEC 27001 (Information Security)</span>
                    <RegulatoryTooltip clauseId="5.1" size="sm" variant="icon" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">{iso27001Progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${iso27001Progress}%` }}
                  ></div>
                </div>
              </div>

              {/* NIST AI RMF */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    <span className="text-sm font-semibold text-slate-700">NIST AI Risk Management Framework</span>
                    <RegulatoryTooltip clauseId="GOVERN-1.1" size="sm" variant="badge" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">{nistProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${nistProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* SOC 2 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <span className="text-sm font-semibold text-slate-700">SOC 2 (Trust Services Criteria)</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{soc2Progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${soc2Progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Implementing frameworks automatically compiles evidence logs.
            </span>
            <button
              onClick={() => onNavigateToTab("frameworks")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-0.5 cursor-pointer"
            >
              Configure compliance mapping <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Governance Activity Timeline */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between" id="card-activity-feed">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Governance Feed</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="relative border-l-2 border-indigo-50/80 pl-4 ml-2 space-y-5">
              {defaultActivities.map((act, index) => (
                <div key={act.id} className="relative group">
                  {/* Pin Dot */}
                  <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-200 border-2 border-white group-hover:bg-indigo-500 transition-colors"></div>
                  
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase block">{act.time}</span>
                    <h4 className="text-xs font-bold text-slate-700 mt-0.5 leading-relaxed">{act.text}</h4>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">By {act.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-50 text-center">
            <span className="text-[10px] font-mono text-slate-400">SYSTEM FEED INTEGRITY OK</span>
          </div>
        </div>

      </div>
    </div>
  );
}
