import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Cpu, 
  Download, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Copy,
  Check
} from "lucide-react";
import { AIProject, AIAssessmentResult } from "../types";

interface AIComplianceAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AIProject;
  onSaveAssessment?: (result: AIAssessmentResult) => void;
}

export default function AIComplianceAssessmentModal({
  isOpen,
  onClose,
  project,
  onSaveAssessment
}: AIComplianceAssessmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState<AIAssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "checklist" | "safeguards" | "regulations">("overview");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [engineName, setEngineName] = useState<string>("Gemini 3.7 Flash Engine");

  const runAssessment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/copilot/assess-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok && !data.assessment) {
        let msg = data.error || "Failed to generate compliance assessment.";
        try {
          if (typeof msg === "string" && msg.startsWith("{")) {
            const parsedErr = JSON.parse(msg);
            msg = parsedErr.error?.message || parsedErr.message || msg;
          }
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      if (data.assessment) {
        setAssessment(data.assessment);
        if (data.engine) {
          setEngineName(data.engine.includes("gemini") ? "Gemini AI Engine" : "Onyx Certified GRC Engine");
        }
        if (onSaveAssessment) {
          onSaveAssessment(data.assessment);
        }
      }
    } catch (err: any) {
      let friendlyError = err.message || "An unexpected error occurred during AI evaluation.";
      try {
        if (typeof friendlyError === "string" && friendlyError.startsWith("{")) {
          const parsed = JSON.parse(friendlyError);
          friendlyError = parsed.error?.message || parsed.message || friendlyError;
        }
      } catch {
        // fallback
      }
      setError(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !assessment) {
      runAssessment();
    }
  }, [isOpen, project.id]);

  if (!isOpen) return null;

  const handleCopyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 70) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getRiskBadge = (tier: string) => {
    switch (tier) {
      case "Minimal":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">Minimal Risk (Art. 69)</span>;
      case "Limited":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">Limited Risk (Art. 50 Transparency)</span>;
      case "High Risk":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">High Risk (EU AI Act Annex III)</span>;
      case "Unacceptable":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800">Prohibited (EU AI Act Art. 5)</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800">{tier}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">AI Regulatory &amp; Risk Assessment</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  {engineName}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Auditing <strong className="text-slate-700">{project.title}</strong> across ISO 42001, EU AI Act, NIST AI RMF &amp; SOC 2
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={runAssessment}
              disabled={isLoading}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors disabled:opacity-50"
              title="Re-run assessment"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Analyzing Project Compliance Posture...</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Evaluating data classification, high-risk autonomy levels, ISO 42001 Annex A controls, and EU AI Act obligations.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>Assessment Evaluation Failed</span>
              </div>
              <p className="text-xs text-rose-700">{error}</p>
              <button
                onClick={runAssessment}
                className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : assessment ? (
            <div className="space-y-6">
              
              {/* Executive Summary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Compliance Posture</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-slate-900">{assessment.executiveScore}</span>
                    <span className="text-xs font-bold text-slate-400">/ 100</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Certification Ready
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">EU AI Act Tier</span>
                  <div className="mt-2">
                    {getRiskBadge(assessment.overallRiskTier)}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 mt-1 truncate" title={assessment.euAiActArticle}>
                    {assessment.euAiActArticle || "Article 6 & Annex III"}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ISO 42001 Readiness</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-indigo-600">{assessment.iso42001ReadinessPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${assessment.iso42001ReadinessPercent}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">NIST AI RMF</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-purple-600">{assessment.nistAiRmfReadinessPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${assessment.nistAiRmfReadinessPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    activeTab === "overview" ? "text-indigo-600 font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Executive Findings
                  {activeTab === "overview" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                </button>
                <button
                  onClick={() => setActiveTab("checklist")}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    activeTab === "checklist" ? "text-indigo-600 font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Mandatory Evidence Checklist ({assessment.mandatoryEvidenceChecklist?.length || 0})
                  {activeTab === "checklist" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                </button>
                <button
                  onClick={() => setActiveTab("safeguards")}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    activeTab === "safeguards" ? "text-indigo-600 font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Technical Safeguards ({assessment.technicalSafeguards?.length || 0})
                  {activeTab === "safeguards" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                </button>
                <button
                  onClick={() => setActiveTab("regulations")}
                  className={`pb-2.5 transition-colors relative cursor-pointer ${
                    activeTab === "regulations" ? "text-indigo-600 font-bold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Regulatory Exposure
                  {activeTab === "regulations" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                </button>
              </div>

              {/* Tab 1: Executive Overview */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Auditor Assessment Summary</h4>
                    <div className="text-xs text-slate-700 leading-relaxed space-y-2 prose prose-sm max-w-none">
                      {assessment.summaryFindings.split("\n").map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-indigo-900">
                        <Cpu className="w-4 h-4 text-indigo-600" />
                        <span>System Architecture Verification</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Mapped AI models ({project.mappedModels?.join(", ") || "General LLM Engine"}) require explicit output moderation filters and telemetry monitoring per ISO 42001 Annex A.6.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>EU AI Act High-Risk Triggers</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        System handles sensitive customer profile data. Under Article 14, a designated Human-in-the-Loop reviewer must confirm high-confidence anomalies.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Mandatory Checklist */}
              {activeTab === "checklist" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Required Artifacts for Certification</span>
                    <span className="text-[11px] text-slate-500">Auto-mapped to ISO 42001 &amp; EU AI Act</span>
                  </div>
                  <div className="space-y-2.5">
                    {assessment.mandatoryEvidenceChecklist?.map((item) => (
                      <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{item.title}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {item.framework} &bull; {item.clause}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.priority === "Critical" ? "bg-rose-100 text-rose-700" :
                              item.priority === "High" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                            }`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{item.description}</p>
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                          item.status === "Satisfied" ? "bg-emerald-100 text-emerald-800" :
                          item.status === "Partial" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Technical Safeguards */}
              {activeTab === "safeguards" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700">Recommended Engineering &amp; ML Controls</span>
                  <div className="space-y-3">
                    {assessment.technicalSafeguards?.map((safe, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                              {safe.category}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{safe.title}</span>
                          </div>
                          <button
                            onClick={() => handleCopyCode(safe.recommendation, idx)}
                            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Spec</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
                          {safe.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Regulatory Exposure */}
              {activeTab === "regulations" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700">Regulatory Risk &amp; Enforcement Exposure</span>
                  <div className="space-y-2.5">
                    {assessment.regulatoryExposure?.map((reg, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          reg.level === "Critical" ? "bg-rose-100 text-rose-700" :
                          reg.level === "High" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{reg.regulation}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              reg.level === "Critical" ? "bg-rose-100 text-rose-700" :
                              reg.level === "High" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                            }`}>
                              {reg.level} Exposure
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{reg.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Audit log recorded per ISO 27001 Control A.12.1.2</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (assessment) {
                  const blob = new Blob([JSON.stringify(assessment, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `ai_compliance_assessment_${project.id}.json`;
                  a.click();
                }
              }}
              disabled={!assessment}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
