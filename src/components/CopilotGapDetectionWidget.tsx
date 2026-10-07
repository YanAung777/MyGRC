import React, { useState } from "react";
import {
  Sparkles,
  ShieldAlert,
  Search,
  FileCheck2,
  FileText,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";
import { AIProject, EvidenceFile } from "../types";

interface CopilotGapDetectionWidgetProps {
  project?: AIProject;
  projects?: AIProject[];
  evidenceFiles?: EvidenceFile[];
  onAddEvidenceFile?: (file: EvidenceFile) => void;
}

export default function CopilotGapDetectionWidget({
  project,
  projects = [],
  evidenceFiles = [],
  onAddEvidenceFile
}: CopilotGapDetectionWidgetProps) {
  // Combine single project and projects array into unique set
  const allProjectsList = projects.length > 0 ? projects : project ? [project] : [];
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    project?.id || allProjectsList[0]?.id || ""
  );
  
  const activeTargetProject = allProjectsList.find(p => p.id === selectedProjectId) || project || allProjectsList[0];

  const [selectedScan, setSelectedScan] = useState<string>("Scan for Missing DPIA Evidence");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const presetPrompts = [
    {
      id: "dpia",
      label: "Scan for Missing DPIA Evidence",
      icon: ShieldAlert,
      scanType: "Missing DPIA & High-Risk Evidence Scan",
      desc: "Checks for required Data Protection Impact Assessments under GDPR & EU AI Act"
    },
    {
      id: "dpia-draft",
      label: "Auto-Generate DPIA Draft",
      icon: FileText,
      scanType: "Auto-Generate DPIA Draft Template",
      desc: "Generates a complete, tailored DPIA document for this use case"
    },
    {
      id: "model-card",
      label: "Auto-Summarize Model Card & Dataset Lineage",
      icon: FileCheck2,
      scanType: "Model Card & Data Lineage Audit",
      desc: "Extracts training source, licensing, and model accuracy benchmarks"
    },
    {
      id: "eu-act",
      label: "Audit High-Risk EU AI Act Gaps",
      icon: AlertTriangle,
      scanType: "EU AI Act High-Risk Compliance Audit",
      desc: "Evaluates Annex III requirements, human oversight, and continuous logging"
    }
  ];

  const handleRunScan = async (promptLabel: string, scanType: string) => {
    setSelectedScan(promptLabel);
    setIsScanning(true);
    setErrorMsg("");
    setScanResult("");

    try {
      const response = await fetch("/api/copilot/gap-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scanType: scanType,
          projectTitle: activeTargetProject?.title || "Enterprise Generative AI Assistant",
          riskClassification: activeTargetProject?.riskClassification || "High Risk",
          framework: activeTargetProject?.framework || "ISO 42001 & EU AI Act",
          existingEvidence: evidenceFiles.map((e) => e.name)
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok && !data.analysis) {
        let msg = data.error || "Failed to execute gap detection scan";
        try {
          if (typeof msg === "string" && msg.startsWith("{")) {
            const parsed = JSON.parse(msg);
            msg = parsed.error?.message || parsed.message || msg;
          }
        } catch {}
        throw new Error(msg);
      }

      if (data.analysis) {
        setScanResult(data.analysis);
      }
    } catch (err: any) {
      console.error(err);
      let friendlyError = err.message || "An error occurred during scan execution.";
      try {
        if (typeof friendlyError === "string" && friendlyError.startsWith("{")) {
          const parsed = JSON.parse(friendlyError);
          friendlyError = parsed.error?.message || parsed.message || friendlyError;
        }
      } catch {}
      setErrorMsg(friendlyError);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopy = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-indigo-900/60 space-y-5">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-indigo-800/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">
                Gemini Copilot Gap Detection
              </h3>
              <span className="text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded border border-indigo-400/30">
                Automated Audit
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              Instant AI scans to detect missing DPIAs, unfulfilled ISO 42001 controls, and regulatory risks.
            </p>
          </div>
        </div>

        {/* Interactive Target Project Selector */}
        <div className="flex items-center gap-2 bg-indigo-900/80 p-1.5 px-3 rounded-xl border border-indigo-700/60 text-xs font-mono font-bold text-indigo-200 shadow-inner">
          <span className="text-indigo-400 uppercase text-[10px] tracking-wider">Target:</span>
          {allProjectsList.length > 0 ? (
            <select
              value={activeTargetProject?.id || selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-slate-900/90 text-white font-sans font-bold text-xs rounded-lg px-2 py-1 outline-none border border-indigo-600/60 cursor-pointer hover:border-indigo-400 transition-colors"
            >
              {allProjectsList.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white font-sans font-medium">
                  {p.title} ({p.riskClassification})
                </option>
              ))}
            </select>
          ) : (
            <span className="text-white">
              {activeTargetProject?.title || "Default AI Project"} ({activeTargetProject?.riskClassification || "High Risk"})
            </span>
          )}
        </div>
      </div>

      {/* Preset Automated Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {presetPrompts.map((p) => {
          const IconComp = p.icon;
          const isSelected = selectedScan === p.label && isScanning;

          return (
            <button
              key={p.id}
              type="button"
              disabled={isScanning}
              onClick={() => handleRunScan(p.label, p.scanType)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? "bg-indigo-600 border-indigo-400 shadow-lg text-white"
                  : "bg-slate-900/90 hover:bg-indigo-900/40 border-indigo-800/50 hover:border-indigo-500 text-indigo-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                  <IconComp className="w-4 h-4" />
                </div>
                {isScanning && selectedScan === p.label ? (
                  <Loader2 className="w-4 h-4 text-indigo-200 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-indigo-400 opacity-60 group-hover:opacity-100" />
                )}
              </div>

              <div>
                <span className="text-xs font-bold block text-white leading-snug">
                  {p.label}
                </span>
                <p className="text-[10px] text-indigo-200/70 mt-1 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Scan Results Output Workspace */}
      {(isScanning || scanResult || errorMsg) && (
        <div className="bg-slate-900/90 rounded-xl border border-indigo-800/60 p-4 space-y-3 animate-fade-in">
          <div className="flex justify-between items-center border-b border-indigo-800/40 pb-2 text-xs">
            <span className="font-bold text-indigo-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Copilot Gap Scan Findings: {selectedScan}
            </span>

            {scanResult && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-white bg-indigo-800/40 px-2.5 py-1 rounded-md border border-indigo-700/50 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Report</span>
                  </>
                )}
              </button>
            )}
          </div>

          {isScanning ? (
            <div className="p-8 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <p className="text-xs text-indigo-200 font-semibold">
                Gemini Copilot scanning system architecture & regulatory clauses...
              </p>
            </div>
          ) : errorMsg ? (
            <div className="p-4 bg-rose-900/30 border border-rose-800 text-rose-200 text-xs rounded-lg">
              {errorMsg}
            </div>
          ) : (
            <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-96 overflow-y-auto pr-2">
              {scanResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
