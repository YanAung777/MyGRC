import React from "react";
import { ShieldCheck, Code, ClipboardCheck, Sparkles } from "lucide-react";
import { PersonaType } from "./WhatToDoNextBanner";

interface PersonaSwitcherProps {
  activePersona: PersonaType;
  onChangePersona: (persona: PersonaType) => void;
  compact?: boolean;
}

export default function PersonaSwitcher({
  activePersona,
  onChangePersona,
  compact = false
}: PersonaSwitcherProps) {
  const personas: { id: PersonaType; label: string; shortLabel: string; icon: React.ReactNode; color: string; desc: string }[] = [
    {
      id: "CISO",
      label: "CISO / Chief Risk Officer",
      shortLabel: "CISO View",
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      color: "bg-indigo-600 text-white shadow-xs",
      desc: "Executive risk radar, ISO 42001 readiness %, & sign-off declarations"
    },
    {
      id: "DEVELOPER",
      label: "AI Engineer / Product Lead",
      shortLabel: "Developer View",
      icon: <Code className="w-3.5 h-3.5" />,
      color: "bg-sky-600 text-white shadow-xs",
      desc: "Model registry specs, DPIA technical evidence, & incident gating"
    },
    {
      id: "AUDITOR",
      label: "Auditor / Certifier",
      shortLabel: "Auditor View",
      icon: <ClipboardCheck className="w-3.5 h-3.5" />,
      color: "bg-emerald-600 text-white shadow-xs",
      desc: "Clause-by-clause audit matrix, PBC verification, & PDF package export"
    }
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 hidden sm:inline">Role:</span>
        {personas.map((p) => {
          const isActive = activePersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChangePersona(p.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? p.color
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
              title={p.desc}
            >
              {p.icon}
              <span className="truncate">{p.shortLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Role Persona Perspective</h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Tailors view density & priority actions</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {personas.map((p) => {
          const isActive = activePersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChangePersona(p.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? "border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`p-1.5 rounded-lg ${isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {p.icon}
                </div>
                <span className="text-xs font-bold text-slate-900">{p.label}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug mt-1">
                {p.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
