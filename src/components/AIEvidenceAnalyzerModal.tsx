import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Download, 
  RefreshCw, 
  Copy, 
  Check,
  ChevronRight
} from "lucide-react";
import { EvidenceFile, EvidenceAnalysisResult } from "../types";

interface AIEvidenceAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceFile;
  onAttachAddenda?: (addendaText: string) => void;
}

export default function AIEvidenceAnalyzerModal({
  isOpen,
  onClose,
  evidence,
  onAttachAddenda
}: AIEvidenceAnalyzerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EvidenceAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const runEvidenceAudit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/copilot/analyze-evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: evidence.id,
          fileName: evidence.name,
          source: evidence.source,
          targetClause: "ISO 42001 Annex A.6 Data Quality & Bias",
          fileSummary: `Evidence record ${evidence.name} uploaded by ${evidence.uploader} with current status ${evidence.status}.`
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok && !data.analysis) {
        let msg = data.error || "Failed to audit evidence artifact.";
        try {
          if (typeof msg === "string" && msg.startsWith("{")) {
            const parsed = JSON.parse(msg);
            msg = parsed.error?.message || parsed.message || msg;
          }
        } catch {}
        throw new Error(msg);
      }

      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err: any) {
      let friendlyError = err.message || "An unexpected error occurred during evidence audit.";
      try {
        if (typeof friendlyError === "string" && friendlyError.startsWith("{")) {
          const parsed = JSON.parse(friendlyError);
          friendlyError = parsed.error?.message || parsed.message || friendlyError;
        }
      } catch {}
      setError(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !analysis) {
      runEvidenceAudit();
    }
  }, [isOpen, evidence.id]);

  if (!isOpen) return null;

  const handleCopyAddenda = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.recommendedAddenda);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">AI Evidence Integrity Audit</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  ISO 42001 Auditor Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Auditing artifact: <strong className="text-slate-700">{evidence.name}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={runEvidenceAudit}
              disabled={isLoading}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-purple-600" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-700">Testing evidence completeness &amp; regulatory defensibility...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Audit Failed</span>
              </div>
              <p>{error}</p>
            </div>
          ) : analysis ? (
            <div className="space-y-5">
              
              {/* Score card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Audit Validity Score</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900">{analysis.validityScore}</span>
                    <span className="text-xs font-bold text-slate-400">/ 100</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 mt-1 block">
                    Mapped Clause: <span className="font-mono text-purple-700 font-bold">{analysis.mappedClause}</span>
                  </span>
                </div>
                <div className="text-right space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Certification Status</span>
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                    analysis.auditStatus === "Compliant" ? "bg-emerald-100 text-emerald-800" :
                    analysis.auditStatus === "Needs Remediation" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                  }`}>
                    {analysis.auditStatus}
                  </span>
                </div>
              </div>

              {/* Strengths & Deficiencies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Key Regulatory Strengths
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                    {analysis.keyStrengths?.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 space-y-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Auditor Deficiencies / Gaps
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                    {analysis.deficiencies?.map((def, idx) => (
                      <li key={idx}>{def}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Addenda */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Recommended Remediation Addenda
                  </span>
                  <button
                    onClick={handleCopyAddenda}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Appendix</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed font-mono">
                  {analysis.recommendedAddenda}
                </div>
              </div>

            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">ISO 27001 Annex A.12.4.1 Audit Event Logged</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
            {onAttachAddenda && analysis && (
              <button
                onClick={() => {
                  onAttachAddenda(analysis.recommendedAddenda);
                  onClose();
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Attach Addenda to Evidence Record
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
