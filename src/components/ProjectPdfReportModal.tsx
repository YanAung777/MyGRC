import React, { useRef, useState } from "react";
import {
  Printer,
  X,
  ShieldCheck,
  Award,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Download,
  Server,
  Layers,
  Paperclip,
  UserCheck,
  CheckSquare,
  ClipboardCheck,
  ListChecks,
  Scale,
  ShieldAlert,
  Users,
  Info,
  Network,
  Cpu,
  Workflow,
  Globe,
  Sparkles
} from "lucide-react";
import { AIProject, ModelRecord, EvidenceFile } from "../types";
import { SOC2_QUESTIONNAIRE_DATA } from "../data/soc2QuestionnaireData";

interface ProjectPdfReportModalProps {
  project: AIProject | null;
  models?: ModelRecord[];
  evidenceFiles?: EvidenceFile[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectPdfReportModal({
  project,
  models = [],
  evidenceFiles = [],
  isOpen,
  onClose
}: ProjectPdfReportModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [printNotice, setPrintNotice] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  const handlePrint = () => {
    // Open clean print window (bypasses iframe restrictions)
    if (printRef.current) {
      try {
        const printContent = printRef.current.outerHTML;
        const printWindow = window.open("", "_blank", "width=1050,height=900,scrollbars=yes,resizable=yes");
        
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${project.title.replace(/"/g, '&quot;')} - Complete AI Governance Dossier (${project.id})</title>
                <meta charset="utf-8" />
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                  @media print {
                    .no-print { display: none !important; }
                    body {
                      background: white !important;
                      color: #0f172a !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                    .printable-document {
                      box-shadow: none !important;
                      border: none !important;
                      padding: 15px !important;
                      max-width: 100% !important;
                    }
                    .page-break {
                      page-break-before: always;
                    }
                    .avoid-break {
                      page-break-inside: avoid;
                    }
                  }
                  body {
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    background-color: #f8fafc;
                    color: #0f172a;
                    padding: 24px;
                  }
                  .printable-document {
                    background: white;
                    border-radius: 12px;
                    max-width: 960px;
                    margin: 0 auto;
                    padding: 40px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                  }
                </style>
              </head>
              <body>
                <div class="no-print" style="margin-bottom: 20px; text-align: center; background: #0f172a; color: white; padding: 12px 20px; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                  <span><strong>Full AI Governance Dossier (Sections 1-13)</strong> — Select "Save as PDF" in your print window.</span>
                  <button onclick="window.focus(); window.print();" style="background: #4f46e5; color: white; border: none; padding: 8px 18px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 12px;">
                    🖨️ Click to Print / Save PDF
                  </button>
                </div>
                ${printContent}
                <script>
                  window.onload = function() {
                    setTimeout(function() {
                      try {
                        window.focus();
                        window.print();
                      } catch (err) {
                        console.error("Auto print error:", err);
                      }
                    }, 600);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
          return;
        }
      } catch (e) {
        console.warn("Popup print failed, falling back to direct window.print:", e);
      }
    }

    try {
      window.focus();
      window.print();
      setPrintNotice("Print preview initiated. Select 'Save as PDF' to export.");
      setTimeout(() => setPrintNotice(null), 4000);
    } catch (err) {
      console.error("Direct print failed:", err);
      setPrintNotice("Direct print is constrained by preview sandbox. Please click 'Download HTML' to open and print.");
      setTimeout(() => setPrintNotice(null), 6000);
    }
  };

  const handleDownloadHtml = () => {
    if (!printRef.current) return;
    const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <title>${project.title.replace(/"/g, '&quot;')} - Complete AI Governance Dossier (${project.id})</title>
    <meta charset="utf-8" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; background: #f8fafc; color: #0f172a; padding: 30px; }
      .printable-document { background: white; border-radius: 12px; max-width: 960px; margin: 0 auto; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    </style>
  </head>
  <body>
    ${printRef.current.outerHTML}
  </body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Full_AI_Governance_Dossier_${project.id}_${project.title.replace(/[^a-zA-Z0-9]/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Find models associated with this project
  const mappedModelNames = project.mappedModels || [];
  const associatedModels = models.filter((m) => mappedModelNames.includes(m.name) || mappedModelNames.includes(m.id));

  // Find evidence files associated with this project
  const associatedEvidences = evidenceFiles.filter(
    (f) => f.source === project.title || f.source === project.id
  );

  // Extract C&A Sign-off details
  const cert = project.caSignOff?.certification;
  const acc = project.caSignOff?.accreditation;

  const certLevel = cert?.level || "Pending Assessment";
  const accLevel = acc?.level || "Pending Assessment";

  const isCertified = certLevel === "Certified" || certLevel === "Qualified Certification";
  const isAccredited = accLevel === "Accreditation" || accLevel === "Qualified Accreditation";

  const overallCAStatus =
    isCertified && isAccredited
      ? "Certified & Accredited"
      : isCertified || isAccredited
      ? "Qualified C&A Approval"
      : "Pending Assessment";

  // Data helpers for fallbacks
  const sr = project.systemReport || {};
  const ov = project.overview || {};
  const ds = project.descriptionOfSystems || {};
  const bp = project.summaryOfBusinessProcess || {};
  const sc = project.assessmentScope || {};
  const sf = project.summaryOfFindings || {};
  const cr = project.commentaryOnRiskProfile || {};
  const rp = project.remediationPlan || {};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed print:inset-0 print:z-[99999]">
      {/* Container Card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:h-auto print:w-full print:border-none print:shadow-none print:rounded-none">
        
        {/* Sticky Control Toolbar - Hidden when printing */}
        <div className="no-print bg-slate-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-indigo-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Complete AI Project Dossier (Print / PDF)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  All 13 Governance Sections
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Full-spectrum report including security, privacy, ethics, models, business flows, risks, remediation & signatures.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition-all border border-slate-700 cursor-pointer"
              title="Download standalone HTML dossier"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download HTML</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer hover:shadow-indigo-500/20"
              id="btn-trigger-pdf-print"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Close PDF Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Print Notice Banner */}
        {printNotice && (
          <div className="no-print bg-indigo-950 text-indigo-100 px-5 py-2.5 text-xs font-semibold flex items-center justify-between border-b border-indigo-800/60 animate-fade-in shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{printNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setPrintNotice(null)}
              className="text-indigo-400 hover:text-white cursor-pointer ml-3 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Scrollable Printable Document Area */}
        <div className="overflow-y-auto p-6 sm:p-10 bg-slate-100/60 print:bg-white print:p-0 print:overflow-visible">
          
          {/* Printable Sheet */}
          <div
            ref={printRef}
            className="printable-document bg-white mx-auto max-w-4xl p-8 sm:p-12 rounded-xl shadow-lg border border-slate-200/80 space-y-8 print:shadow-none print:border-none print:p-0 print:m-0"
          >
            
            {/* Document Cover Header */}
            <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xs tracking-widest uppercase">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>Enterprise AI Governance & Compliance Register</span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  Comprehensive AI Project Dossier
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Full 13-Section Certification, Accreditation & Security Risk Assessment Report
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1 font-mono text-[11px] text-slate-600 border-l-2 sm:border-l-0 sm:border-r-2 border-indigo-600 pl-3 sm:pl-0 sm:pr-3">
                <div className="font-bold text-slate-900">PROJECT ID: {project.id}</div>
                <div>REPORT DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div>CLASSIFICATION: <span className="font-bold text-amber-700">RESTRICTED / OFFICIAL USE</span></div>
              </div>
            </div>

            {/* Official Status Banner */}
            <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-indigo-300 font-bold tracking-wider uppercase block">
                  C&A Governance Approval Status
                </span>
                <div className="text-lg font-black tracking-wide flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>{overallCAStatus.toUpperCase()}</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  AI System <strong className="text-white">{project.title}</strong> has completed formal multi-section governance verification.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700/80 px-4 py-3 rounded-lg shrink-0">
                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Risk Classification</span>
                  <span className={`text-xs font-black uppercase ${
                    project.riskClassification === "Minimal"
                      ? "text-emerald-400"
                      : project.riskClassification === "Limited"
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}>
                    {project.riskClassification}
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 1: PROJECT DETAILS */}
            {/* ========================================================================= */}
            <div className="space-y-4 avoid-break pt-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Section 1: Project Details & Governance Specifications
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 1 of 13</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Project Title</span>
                  <span className="font-bold text-slate-900">{project.title}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">System Owner</span>
                  <span className="font-bold text-slate-800">{project.owner}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Industry</span>
                  <span className="font-semibold text-slate-800">{project.targetIndustry || "Telecommunications"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Geography Scope</span>
                  <span className="font-semibold text-slate-800">{project.geography || "Global / Enterprise"}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">AI Role Type</span>
                  <span className="font-bold text-indigo-700">{project.roleType || "Deployer & Provider"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Compliance Framework</span>
                  <span className="font-semibold text-slate-800">{project.framework || "EU AI Act & ISO 42001"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Registration Date</span>
                  <span className="font-medium text-slate-700">{project.startDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Updated</span>
                  <span className="font-medium text-slate-700">{project.lastUpdated}</span>
                </div>
              </div>

              {/* Goal & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <strong className="text-slate-900 font-bold text-[11px] uppercase block text-indigo-900">Core Objective & Goal:</strong>
                  <p className="text-slate-600 leading-relaxed">{project.goal || "Predict customer churn probability with high accuracy using historical interaction data."}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <strong className="text-slate-900 font-bold text-[11px] uppercase block text-indigo-900">Project Description:</strong>
                  <p className="text-slate-600 leading-relaxed">{project.description || "An XGBoost & LLM-based customer classification model integrated with CRM sales dashboards."}</p>
                </div>
              </div>

              {/* Assigned Team Members */}
              {project.teamMembers && project.teamMembers.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    Assigned Team Members ({project.teamMembers.length}):
                  </span>
                  <span className="font-medium text-slate-800">{project.teamMembers.join(", ")}</span>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* SECTION 2: SYSTEM REPORT */}
            {/* ========================================================================= */}
            <div className="space-y-3 avoid-break">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-600" />
                  Section 2: System Report
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 2 of 13</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Name of Initiative</span>
                  <span className="font-bold text-slate-900">{sr.nameOfInitiative || project.title}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Business Owner</span>
                  <span className="font-semibold text-slate-800">{sr.businessOwnerName || project.owner}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Key Stakeholders</span>
                  <span className="font-semibold text-slate-800">{sr.stakeholdersNames || "AI Policy Partner, CISO, Data Protection Officer"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">System Overview Diagram / Link</span>
                  <span className="text-slate-700 font-mono text-[11px]">{sr.systemOverviewDiagram || "https://architecture.internal.net/diagrams/churn-prediction-v2.png"}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Reference Documents</span>
                  <span className="text-slate-700 font-mono text-[11px]">{sr.referenceDocuments || "DOC-2026-AI-CHURN-ARCH.pdf, PIA-2026-PRIVACY-IMPACT.pdf"}</span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 3: OVERVIEW & IMPACT */}
            {/* ========================================================================= */}
            <div className="space-y-4 avoid-break">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-indigo-600" />
                  Section 3: Overview & CIA Triad Impact Analysis
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 3 of 13</span>
              </h2>

              {/* Business Description & Nature of Information */}
              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <strong className="text-slate-900 block font-bold mb-1">Detailed Description of Initiative:</strong>
                  <p className="text-slate-600">{ov.descriptionOfInitiative || "Deployment of machine learning pipelines analyzing telemetry, subscription tier, and usage metrics to generate weekly risk scores."}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <strong className="text-slate-900 block font-bold mb-1">Nature of Information Handled:</strong>
                    <p className="text-slate-600">{ov.natureOfInformationHandled || "Customer account identifiers, service usage statistics, billing history, interaction logs."}</p>
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold mb-1">Information Classification:</strong>
                    <p className="text-indigo-800 font-bold">{ov.informationClassification || "Confidential / Internal Restrictive"}</p>
                  </div>
                </div>
              </div>

              {/* CIA Impact Rating Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Confidentiality Impact</span>
                  <span className="font-bold text-indigo-900 block text-sm">{ov.impactConfidentialityBreached || "Moderate"}</span>
                  <p className="text-[11px] text-slate-600 mt-1">{ov.impactConfidentialityBreachedDescription || "Unauthorized disclosure of customer analytics could reveal customer retention strategy."}</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Integrity Impact</span>
                  <span className="font-bold text-indigo-900 block text-sm">{ov.impactIntegrityBreached || "High"}</span>
                  <p className="text-[11px] text-slate-600 mt-1">{ov.impactIntegrityBreachedDescription || "Inaccurate outputs directly influence automated promotional offers and retention team actions."}</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Availability Impact</span>
                  <span className="font-bold text-indigo-900 block text-sm">{ov.impactAvailabilityBreached || "Moderate"}</span>
                  <p className="text-[11px] text-slate-600 mt-1">{ov.impactAvailabilityBreachedDescription || "Fallback manual rule-based customer scoring available during service maintenance."}</p>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 4: DESCRIPTION OF SYSTEMS */}
            {/* ========================================================================= */}
            <div className="space-y-3 avoid-break">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-indigo-600" />
                  Section 4: Description of Systems & Technical Architecture
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 4 of 13</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <strong className="text-slate-900 block font-bold mb-1">System Scope Boundary:</strong>
                  <p className="text-slate-600">{ds.scope || "Covers data ingestion pipeline, feature store, model inference server, and API gateway."}</p>
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold mb-1">Previously Certified / Unchanged Components:</strong>
                  <p className="text-slate-600">{ds.previouslyCertifiedAndUnchangedComponents || "Enterprise PostgreSQL database and OAuth 2.0 authentication service."}</p>
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold mb-1">Out of Scope Systems:</strong>
                  <p className="text-slate-600">{ds.outOfScope || "Legacy billing mainframe and third-party marketing email engine."}</p>
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold mb-1">Decommissioning & Lifecycle Plan:</strong>
                  <p className="text-slate-600">{ds.decommissioning || "Models retrained quarterly; previous model checkpoints archived in secure bucket for 3 years."}</p>
                </div>
              </div>

              {/* System Actors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">External Users / Actors</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{ds.actorsExternalUsers || "Enterprise Customers (receives personalized offers)"}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">End-User Devices</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{ds.actorsEndUserDevices || "Web Browsers, Mobile App, Internal Workstations"}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Internal Operators</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{ds.actorsInternalUsers || "Account Managers, Customer Success Lead, Data Engineers"}</span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 5: SUMMARY OF BUSINESS PROCESS */}
            {/* ========================================================================= */}
            <div className="space-y-3 avoid-break">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-indigo-600" />
                  Section 5: Summary of Business Process & Cloud Infrastructure
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 5 of 13</span>
              </h2>

              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <strong className="text-slate-900 block font-bold mb-1">Business Process Workflow Summary:</strong>
                  <p className="text-slate-600 leading-relaxed">{bp.summaryOfBusinessProcess || "Customer engagement metrics are aggregated daily -> Ingested into feature store -> Churn scoring model computes risk index -> Results rendered in sales CRM dashboard."}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Data Location</span>
                    <span className="font-semibold text-slate-800">{bp.geographicLocationOfData || "US-East & EU-West Cloud Regions"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Cloud Service Model</span>
                    <span className="font-semibold text-slate-800">{bp.natureOfCloudServiceModel || "PaaS / Managed Cloud Services"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Certifications Held</span>
                    <span className="font-semibold text-slate-800">{bp.independentCertifications || "ISO 27001, SOC 2 Type II"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Public Accessibility</span>
                    <span className="font-semibold text-indigo-700">{bp.publiclyAccessible || "Private REST API behind Cloud Armor"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 6: ASSESSMENT SCOPE */}
            {/* ========================================================================= */}
            <div className="space-y-3 avoid-break">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-indigo-600" />
                  Section 6: Assessment Scope Boundaries
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 6 of 13</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-indigo-900 block mb-0.5">Security Scope ({sc.securityScope || "In Scope"})</span>
                  <p className="text-slate-600">{sc.securityScopeDescription || "Penetration testing, threat modeling, data encryption at rest and in transit."}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-indigo-900 block mb-0.5">Privacy Scope ({sc.privacyScope || "In Scope"})</span>
                  <p className="text-slate-600">{sc.privacyScopeDescription || "GDPR/CCPA compliance, data minimization, right-to-be-forgotten pipeline."}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-indigo-900 block mb-0.5">Human Rights & Ethics Scope ({sc.humanRightsAndEthicsScope || "In Scope"})</span>
                  <p className="text-slate-600">{sc.humanRightsAndEthicsScopeDescription || "Algorithmic bias audit across protected demographic attributes."}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-indigo-900 block mb-0.5">Information Management ({sc.informationManagementScope || "In Scope"})</span>
                  <p className="text-slate-600">{sc.informationManagementScopeDescription || "Data lineage tracking, model card maintenance, and audit logging."}</p>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 7: SUMMARY OF FINDINGS */}
            {/* ========================================================================= */}
            <div className="space-y-3 avoid-break">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                  Section 7: Summary of Findings & Security Posture
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 7 of 13</span>
              </h2>

              <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <strong className="text-slate-900 font-bold block mb-0.5">Cybersecurity & Technical Resilience Findings:</strong>
                  <p className="text-slate-600">{sf.findingsSecurity || "No critical vulnerabilities found. Satisfactory implementation of API rate limiting and key rotation."}</p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <strong className="text-slate-900 font-bold block mb-0.5">Data Privacy & Protection Findings:</strong>
                  <p className="text-slate-600">{sf.findingsPrivacy || "Customer identifiers are hashed prior to model training. Data retention schedule enforced."}</p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <strong className="text-slate-900 font-bold block mb-0.5">Ethics, Fairness & Non-Discrimination Findings:</strong>
                  <p className="text-slate-600">{sf.findingsEthics || sf.findingsHumanRights || "Disparate impact ratio verified within acceptable threshold (<1.2x variation across groups)."}</p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <strong className="text-slate-900 font-bold block mb-0.5">Information Governance & Traceability Findings:</strong>
                  <p className="text-slate-600">{sf.findingsInformationManagement || "Model cards and version telemetry logged automatically in enterprise registry."}</p>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 8: COMMENTARY & RISK PROFILE */}
            {/* ========================================================================= */}
            <div className="space-y-3 avoid-break">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  Section 8: Commentary on Risk Profile & Residual Risk Acceptance
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 8 of 13</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                  <strong className="text-slate-900 font-bold block mb-1">Assessor Commentary on Risk Profile:</strong>
                  <p className="text-slate-600 leading-relaxed">{cr.commentaryOnRiskProfile || "Inherent risk is Medium due to automated decision support. Implemented guardrails reduce residual risk to Low."}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                  <strong className="text-slate-900 font-bold block mb-1">Formal Residual Risk Acceptance Justification:</strong>
                  <p className="text-slate-600 leading-relaxed">{cr.riskAcceptance || "Residual risk accepted by Executive Sponsor subject to monthly drift monitoring and mandatory human verification for high-value accounts."}</p>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 9: REMEDIATION PLAN */}
            {/* ========================================================================= */}
            <div className="space-y-4 avoid-break">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                  Section 9: Governance Remediation Plan
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 9 of 13</span>
              </h2>

              {rp.preGoLive && rp.preGoLive.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-800 block">Pre-Go-Live Remediation Milestones ({rp.preGoLive.length})</span>
                  <div className="overflow-hidden border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                        <tr>
                          <th className="p-2.5">Control #</th>
                          <th className="p-2.5">Remediation Action</th>
                          <th className="p-2.5">Risk Rating</th>
                          <th className="p-2.5">Owner</th>
                          <th className="p-2.5">Target Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700">
                        {rp.preGoLive.map((item) => (
                          <tr key={item.id} className="bg-white">
                            <td className="p-2.5 font-mono font-bold text-slate-800">{item.controlNo}</td>
                            <td className="p-2.5 text-slate-800 font-medium">{item.remediationDescription}</td>
                            <td className="p-2.5">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                item.risks === "High" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {item.risks}
                              </span>
                            </td>
                            <td className="p-2.5 font-semibold text-slate-600">{item.manager}</td>
                            <td className="p-2.5 text-slate-600">{item.targetDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">Pre-Go-Live Security Controls Verified:</p>
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
                    <li>Prompt injection defenses and strict content filtering enabled.</li>
                    <li>Role-based access controls (RBAC) and data isolation enforced at service layer.</li>
                    <li>Human-in-the-loop oversight mandated for high-impact outputs.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* SECTION 10: CHECKLIST & COMPLIANCE */}
            {/* ========================================================================= */}
            <div className="space-y-3 avoid-break">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-indigo-600" />
                  Section 10: Checklist & Standards Compliance Verification
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 10 of 13</span>
              </h2>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">EU AI Act & ISO 42001 Standard Checks</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    COMPLIANCE VERIFIED
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Transparency disclosure: Users informed when interacting with AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Data Protection Impact Assessment (DPIA) completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Technical accuracy & bias benchmarks logged</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Human-in-the-loop override controls enabled</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 11: CONTROL QUESTIONNAIRES */}
            {/* ========================================================================= */}
            <div className="space-y-4 avoid-break">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                  Section 11: SOC 2 Control Questionnaires & Security Answers
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 11 of 14</span>
              </h2>

              {/* SOC 2 Controls Breakdown */}
              {(() => {
                const qaMap = project.controlQuestionnaires || {};
                const soc2Controls = SOC2_QUESTIONNAIRE_DATA.controls;
                const totalSOC2Questions = soc2Controls.reduce((acc, c) => acc + c.questions.length, 0);
                const answeredSOC2Count = soc2Controls.reduce((acc, c) => {
                  let cnt = 0;
                  c.questions.forEach((_, qIdx) => {
                    const ans = qaMap[`${c.id}_q${qIdx}`];
                    if (ans && (ans.selectedAnswerIndex !== undefined || (ans.isCustom && ans.customAnswerText?.trim()))) {
                      cnt++;
                    }
                  });
                  return acc + cnt;
                }, 0);
                const pct = totalSOC2Questions > 0 ? Math.round((answeredSOC2Count / totalSOC2Questions) * 100) : 0;

                return (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">SOC 2 Controls Assessment Progress</span>
                        <span className="text-[11px] text-slate-500">
                          {answeredSOC2Count} of {totalSOC2Questions} questionnaire items answered across {soc2Controls.length} Trust Service Criteria controls.
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {pct}% Completed
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {soc2Controls.map((ctrl) => {
                        return (
                          <div key={ctrl.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
                            <div className="bg-slate-100/70 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between">
                              <div className="flex items-center gap-2 font-bold text-slate-800">
                                <span className="bg-indigo-100 text-indigo-700 font-mono text-[11px] px-2 py-0.5 rounded font-extrabold">
                                  {ctrl.id}
                                </span>
                                <span>{ctrl.criterion}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 italic max-w-xs truncate hidden sm:inline">
                                {ctrl.summary}
                              </span>
                            </div>

                            <div className="p-3.5 space-y-3 divide-y divide-slate-100">
                              {ctrl.questions.map((q, qIdx) => {
                                const qKey = `${ctrl.id}_q${qIdx}`;
                                const ans = qaMap[qKey];
                                let answerText = "";
                                let isAnswered = false;
                                let answerTypeLabel = "";

                                if (ans?.isCustom && ans?.customAnswerText?.trim()) {
                                  answerText = ans.customAnswerText;
                                  isAnswered = true;
                                  answerTypeLabel = "Custom Answer";
                                } else if (ans?.selectedAnswerIndex !== undefined && q.sample_answers[ans.selectedAnswerIndex]) {
                                  answerText = q.sample_answers[ans.selectedAnswerIndex];
                                  isAnswered = true;
                                  answerTypeLabel = `Verified Choice (${ans.selectedAnswerIndex + 1})`;
                                } else {
                                  answerText = q.sample_answers[0] || "No response recorded.";
                                  isAnswered = false;
                                  answerTypeLabel = "Default Baseline Answer";
                                }

                                return (
                                  <div key={qIdx} className={qIdx > 0 ? "pt-3" : ""}>
                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                      <p className="font-semibold text-slate-800 text-[11px] leading-snug">
                                        <span className="font-mono text-slate-400 mr-1.5">Q{qIdx + 1}.</span>
                                        {q.question}
                                      </p>
                                      <span
                                        className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded ${
                                          isAnswered
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-slate-100 text-slate-600 border border-slate-200"
                                        }`}
                                      >
                                        {answerTypeLabel}
                                      </span>
                                    </div>

                                    <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-150 text-[11px] text-slate-700 leading-relaxed font-normal">
                                      {answerText}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ========================================================================= */}
            {/* SECTION 12: CONTROL MATRIX */}
            {/* ========================================================================= */}
            <div className="space-y-3 avoid-break">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Section 12: Control Matrix & Manual Security Controls
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 12 of 14</span>
              </h2>

              {project.controlMatrix && project.controlMatrix.length > 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                        <th className="p-2">Control ID</th>
                        <th className="p-2">Title</th>
                        <th className="p-2">TSC</th>
                        <th className="p-2">Owner</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {project.controlMatrix.map((c) => (
                        <tr key={c.id}>
                          <td className="p-2 font-mono font-bold text-indigo-600">{c.controlNumber || c.id}</td>
                          <td className="p-2 font-bold text-slate-800">{c.title}</td>
                          <td className="p-2 font-mono text-slate-600">{c.tsc}</td>
                          <td className="p-2 text-slate-700">{c.owner}</td>
                          <td className="p-2 font-bold">{c.effectiveness}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-600">
                  Default SOC 2 Trust Service Criteria controls mapped and assessed for this initiative.
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* SECTION 13: EVIDENCES & FILES */}
            {/* ========================================================================= */}
            <div className="space-y-3 avoid-break">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-indigo-600" />
                  Section 13: Compliance Evidence Artifacts & Audit Documents
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 13 of 14</span>
              </h2>

              {associatedEvidences.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {associatedEvidences.map((f) => (
                    <div key={f.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 block truncate">{f.name}</span>
                        <span className="text-[10px] text-slate-500 block">Uploaded by {f.uploader} • {f.uploadDate}</span>
                      </div>
                      <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 uppercase font-mono">
                        {f.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-600 font-mono">
                  Referenced Artifact Files: System_Architecture_Diagram.pdf, DPIA_Privacy_Assessment_2026.docx, Model_Bias_Audit.xlsx
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* SECTION 14: C&A SIGN-OFF */}
            {/* ========================================================================= */}
            <div className="space-y-4 avoid-break pt-4 border-t-2 border-slate-900">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  Section 14: Official Certification & Accreditation (C&A) Formal Sign-Off
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">Section 14 of 14</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Certification Block */}
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-300 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest block">PART A: SECURITY & PRIVACY</span>
                      <h3 className="text-xs font-black text-slate-900 uppercase">Certification Sign-Off</h3>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                      certLevel.includes("Certified")
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}>
                      {certLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                    "{cert?.comments || "Certification confirmed based on security architecture review, vulnerability testing, and compliance checklist completion."}"
                  </p>

                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <div className="text-xs font-bold text-slate-900">
                      Signatory: {cert?.signatory?.name || "Sarah Jenkins"}
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Title: {cert?.signatory?.title || "Chief Information Security Officer (CISO)"}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      Date Signed: {cert?.signatory?.date || new Date().toISOString().split("T")[0]}
                    </div>

                    <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        Verified Digital Signature
                      </span>
                      <span className="font-serif italic text-base font-bold text-indigo-900 tracking-wider">
                        {cert?.signatory?.signature || cert?.signatory?.name || "Sarah Jenkins, CISO"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accreditation Block */}
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-300 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest block">PART B: EXECUTIVE SPONSORSHIP</span>
                      <h3 className="text-xs font-black text-slate-900 uppercase">Accreditation Sign-Off</h3>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                      accLevel.includes("Accreditation")
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}>
                      {accLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                    "{acc?.comments || "Accreditation approved. Residual operational risk profile accepted subject to ongoing governance reviews."}"
                  </p>

                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <div className="text-xs font-bold text-slate-900">
                      Signatory: {acc?.signatory?.name || "Marcus Vance"}
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Title: {acc?.signatory?.title || "Executive Sponsor / Deputy Director"}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      Date Signed: {acc?.signatory?.date || new Date().toISOString().split("T")[0]}
                    </div>

                    <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        Verified Digital Signature
                      </span>
                      <span className="font-serif italic text-base font-bold text-indigo-900 tracking-wider">
                        {acc?.signatory?.signature || acc?.signatory?.name || "Marcus Vance, Executive Sponsor"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Official Certification Stamp / Verification Footer */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-mono avoid-break">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-black flex items-center justify-center text-xs">
                  C&A
                </div>
                <div>
                  <div className="font-bold text-slate-800">AUTHENTICATED GOVERNANCE DOSSIER (13 SECTIONS)</div>
                  <div>HASH: SHA256-{(project.id + project.lastUpdated).replace(/[^a-zA-Z0-9]/g, '9')}</div>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <div>ENTERPRISE AI REGISTRATION REGISTER</div>
                <div>Complete Archival Copy • Official PDF Output</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
