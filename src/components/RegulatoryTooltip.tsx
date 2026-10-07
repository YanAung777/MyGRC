import React, { useState } from "react";
import { Info, HelpCircle, X, CheckCircle2, ShieldCheck, FileText, Sparkles, AlertCircle } from "lucide-react";

export interface PlainEnglishClauseInfo {
  code: string;
  title: string;
  plainEnglishSummary: string;
  whyAuditorsCare: string;
  acceptableEvidence: string[];
  engineerTranslation: string;
  framework: "ISO 42001" | "NIST AI RMF" | "ISO 27001" | "EU AI Act" | "SOC 2";
}

// Regulatory Glossary & Clause Knowledgebase
export const REGULATORY_CLAUSE_DICTIONARY: Record<string, PlainEnglishClauseInfo> = {
  "4.1": {
    code: "ISO 42001 - 4.1",
    title: "Understanding Organization and Context",
    plainEnglishSummary: "Define why your company builds or uses AI and identify external/internal factors that impact its safe operation.",
    whyAuditorsCare: "Auditors need to confirm that AI initiatives align with company policies and aren't operating in a regulatory vacuum.",
    acceptableEvidence: [
      "AI Strategic Scope Document",
      "Executive AI Policy Charter",
      "Stakeholder Analysis Matrix"
    ],
    engineerTranslation: "Define what business problem this AI system solves and who is responsible when it makes a mistake.",
    framework: "ISO 42001"
  },
  "4.2": {
    code: "ISO 42001 - 4.2",
    title: "Interested Parties & Expectations",
    plainEnglishSummary: "Map out everyone impacted by your AI (users, employees, regulators) and document what they expect regarding safety and privacy.",
    whyAuditorsCare: "Ensures user rights and regulatory mandates are considered before training or deploying models.",
    acceptableEvidence: [
      "User Privacy Impact Assessment",
      "Customer Data Handling Policy",
      "Regulatory Mapping Matrix"
    ],
    engineerTranslation: "List the groups of people affected by model outputs (e.g., job applicants, loan customers) and their legal protections.",
    framework: "ISO 42001"
  },
  "5.1": {
    code: "ISO 42001 - 5.1",
    title: "Leadership & Commitment",
    plainEnglishSummary: "Senior management must actively oversee AI governance, allocate budget, and endorse ethics policies.",
    whyAuditorsCare: "Compliance cannot be delegated entirely to junior engineers; C-level accountability is legally required.",
    acceptableEvidence: [
      "Signed CISO AI Policy Charter",
      "Board Minutes on AI Governance",
      "AI Budget & Resource Allocation Log"
    ],
    engineerTranslation: "Get executive sign-off approving model deployment guidelines and risk tolerance thresholds.",
    framework: "ISO 42001"
  },
  "6.1": {
    code: "ISO 42001 - 6.1",
    title: "Actions to Address AI Risks & Opportunities",
    plainEnglishSummary: "Identify potential AI failures (hallucination, data leakage, bias) and create explicit mitigation steps.",
    whyAuditorsCare: "Demonstrates proactive risk management rather than reactive firefighting after an incident.",
    acceptableEvidence: [
      "AI Risk Register with Residual Risk Scores",
      "Model Impact Assessment Report",
      "Mitigation Implementation Plan"
    ],
    engineerTranslation: "Fill out the Risk Register with failure scenarios (e.g. LLM prompt injection) and your code-level guardrails.",
    framework: "ISO 42001"
  },
  "A.6.1.2": {
    code: "ISO 42001 - Annex A.6.1.2",
    title: "Assessment of Impact of AI Systems",
    plainEnglishSummary: "Systematically analyze unintended consequences of AI predictions on safety, fairness, and human rights.",
    whyAuditorsCare: "Mandatory requirement under ISO 42001 and EU AI Act for any model interacting with public or sensitive data.",
    acceptableEvidence: [
      "Data Protection & AI Impact Assessment (DPIA)",
      "Fairness & Demographic Bias Testing Log",
      "Human-in-the-Loop Override Policy"
    ],
    engineerTranslation: "Run bias evaluation benchmarks on training data and document fallback mechanisms when model confidence is low.",
    framework: "ISO 42001"
  },
  "A.7.2": {
    code: "ISO 42001 - Annex A.7.2",
    title: "Data Quality for AI Systems",
    plainEnglishSummary: "Ensure training and validation datasets are accurate, representative, free of bias, and legally sourced.",
    whyAuditorsCare: "Poor data quality directly causes unsafe AI predictions and discriminatory outcomes.",
    acceptableEvidence: [
      "Dataset Provenance & Lineage Record",
      "Data Anonymization Protocol",
      "Data Quality Verification Benchmark"
    ],
    engineerTranslation: "Keep a record of where training data came from, how duplicates/nulls were cleaned, and how privacy was preserved.",
    framework: "ISO 42001"
  },
  "A.8.1": {
    code: "ISO 42001 - Annex A.8.1",
    title: "AI System Life Cycle Management",
    plainEnglishSummary: "Track AI models from ideation through development, testing, staging, deployment, and decommissioning.",
    whyAuditorsCare: "Prevents unvetted or legacy experimental models from running silently in production environments.",
    acceptableEvidence: [
      "Model Registry Record",
      "CI/CD Model Gating Configuration",
      "Decommissioning & Model Deprecation Plan"
    ],
    engineerTranslation: "Register every model version in the Model Registry and require formal approval before deploying to prod.",
    framework: "ISO 42001"
  },
  "GOVERN-1.1": {
    code: "NIST AI RMF - GOVERN 1.1",
    title: "Legal & Ethical Standards Alignment",
    plainEnglishSummary: "Align AI development with organizational values, human rights principles, and applicable laws.",
    whyAuditorsCare: "Establishes baseline organizational guardrails for trustworthy AI deployment.",
    acceptableEvidence: [
      "Code of AI Ethics Document",
      "Legal Compliance Mapping Report",
      "Employee AI Acceptable Use Policy"
    ],
    engineerTranslation: "Follow the company AI principles during model selection and prompt engineering.",
    framework: "NIST AI RMF"
  },
  "MEASURE-2.1": {
    code: "NIST AI RMF - MEASURE 2.1",
    title: "AI System Evaluation Metrics",
    plainEnglishSummary: "Quantify model performance, accuracy, robustness, and drift using standardized test metrics.",
    whyAuditorsCare: "Verifies that AI system claims are backed by objective empirical measurements.",
    acceptableEvidence: [
      "Model Card Technical Specification",
      "Confusion Matrix & F1 Performance Benchmark",
      "Adversarial Robustness Test Log"
    ],
    engineerTranslation: "Publish benchmark metrics (accuracy, precision, latency) in the model card before release.",
    framework: "NIST AI RMF"
  }
};

interface RegulatoryTooltipProps {
  clauseId?: string;
  clauseCode?: string;
  title?: string;
  customInfo?: Partial<PlainEnglishClauseInfo>;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "badge" | "button";
}

export default function RegulatoryTooltip({
  clauseId,
  clauseCode,
  title,
  customInfo,
  size = "sm",
  variant = "icon"
}: RegulatoryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Lookup in dictionary by clauseId or clauseCode
  const lookupKey = clauseId || clauseCode || "4.1";
  const info: PlainEnglishClauseInfo = {
    ...(REGULATORY_CLAUSE_DICTIONARY[lookupKey] || {
      code: clauseCode || `Clause ${clauseId || "4.1"}`,
      title: title || "ISO 42001 Governance Clause",
      plainEnglishSummary: "This requirement defines operational controls and documentation required to verify AI system safety, accountability, and fairness.",
      whyAuditorsCare: "Auditors inspect this requirement to verify compliance with ISO 42001 and ensure evidence files are cryptographically traceable.",
      acceptableEvidence: [
        "Signed Governance Policy PDF",
        "Technical Model Specification Card",
        "Verification Audit Sign-off Log"
      ],
      engineerTranslation: "Provide clear documentation and test logs showing how this requirement is implemented in your code/workflow.",
      framework: "ISO 42001"
    }),
    ...customInfo
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Trigger Button/Badge */}
      {variant === "icon" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`p-1 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-full transition-colors cursor-pointer ${
            size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6"
          }`}
          title="Explain in Plain English (Regulatory Helper)"
        >
          <HelpCircle className="w-full h-full" />
        </button>
      )}

      {variant === "badge" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="inline-flex items-center gap-1 text-[10px] font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-indigo-600" />
          <span>Plain English Guide</span>
        </button>
      )}

      {variant === "button" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-indigo-600" />
          <span>What does this clause mean?</span>
        </button>
      )}

      {/* Popover Card */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-indigo-100 shadow-2xl max-w-md w-full p-6 space-y-4 text-left animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3 text-indigo-600" />
                  {info.framework} Decoder
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 mt-1">{info.code}: {info.title}</h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Plain English Summary */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">In Plain English</span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {info.plainEnglishSummary}
              </p>
            </div>

            {/* Engineer Translation */}
            <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-100 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Explain Like I'm an Engineer</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                {info.engineerTranslation}
              </p>
            </div>

            {/* Why Auditors Care */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Why Auditors Inspect This</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {info.whyAuditorsCare}
              </p>
            </div>

            {/* Acceptable Evidence Examples */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Acceptable Evidence Examples</span>
              <div className="space-y-1.5">
                {info.acceptableEvidence.map((ev, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Close */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
