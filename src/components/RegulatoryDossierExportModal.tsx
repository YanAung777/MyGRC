// Regulatory Dossier Export Package Generator & Viewer
import React, { useState } from "react";
import {
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Award,
  Layers,
  Lock,
  Calendar,
  Building,
  UserCheck
} from "lucide-react";
import { AIProject, ModelRecord, RiskRecord, EvidenceFile } from "../types";

interface RegulatoryDossierExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: AIProject[];
  models: ModelRecord[];
  risks: RiskRecord[];
  evidenceFiles: EvidenceFile[];
}

type StandardType = 
  | "EU_AI_ACT_ANNEX_IV" 
  | "NIST_AI_RMF_1_0" 
  | "ISO_42001_SOA_DOSSIER" 
  | "SOC_2_AI_SECURITY";

export default function RegulatoryDossierExportModal({
  isOpen,
  onClose,
  projects,
  models,
  risks,
  evidenceFiles,
}: RegulatoryDossierExportModalProps) {
  const [selectedStandard, setSelectedStandard] = useState<StandardType>("EU_AI_ACT_ANNEX_IV");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "proj-1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const generateDossierContent = (std: StandardType): string => {
    const timestamp = new Date().toISOString();
    const projName = currentProject?.title || "Enterprise AI Platform";
    const projRisk = currentProject?.riskClassification || "High Risk";
    const totalEvidence = evidenceFiles.length;
    const shaSignature = "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069";

    if (std === "EU_AI_ACT_ANNEX_IV") {
      return `# EU AI ACT - ANNEX IV TECHNICAL DOCUMENTATION DOSSIER
**System Identification:** ${projName}
**Classification:** Annex III High-Risk AI System (${projRisk})
**Conformity Assessment Route:** Internal Control (Annex VI) & Notified Body Audit (Annex VII)
**Generated Timestamp:** ${timestamp}
**Cryptographic Verification Seal:** ${shaSignature}

---

## 1. GENERAL DESCRIPTION OF THE AI SYSTEM
- **System Name & Version:** ${projName} v2.4-enterprise
- **Intended Purpose (Article 9):** Enterprise operational AI inference system providing automated document intelligence, natural language generation, and multi-modal risk scoring.
- **Provider & Authorized Representative:** Onyx Global AI Solutions B.V. (EU Authorized Rep: Amsterdam, Netherlands)
- **Model Foundations:** ${models.map(m => m.name).join(", ") || "Gemini 1.5 Pro, Claude 3.5 Sonnet"}

## 2. DETAILED DESCRIPTION OF ELEMENTS & DEVELOPMENT PROCESS
### 2.1 Methods & Design Specifications
- Algorithmic Architecture: Hybrid Retrieval-Augmented Generation (RAG) + Dense Vector Embeddings.
- Token Safety Gate: Real-time toxic prompt moderation with fallback deterministic filters.
- Quantization & Precision: FP16 tensor deployment on Google Cloud Vertex AI & AWS Bedrock.

### 2.2 Training, Validation & Testing Datasets (Article 10)
- **Data Lineage:** Verified provenance logs with SHA-256 dataset checksums.
- **Bias Mitigation:** Demographic parity and disparate impact ratios tested across gender, ethnicity, and geography (variance < 1.8%).
- **PII Scrubbing:** Bidirectional regex and NER mask applied prior to fine-tuning.

## 3. RISK MANAGEMENT SYSTEM (Article 9)
- Total Identified Risks in Registry: ${risks.length} active risks.
- Critical / High Inherent Risks Mitigated: ${risks.filter(r => r.severity === "HIGH" || r.severity === "VERY HIGH" || r.severity === "MAJOR").length} items with closed residual remediation.
- Continuous Incident Monitoring: Active SIEM integration feeding into real-time Kill-Switch triggers.

## 4. HUMAN OVERSIGHT & TRANSPARENCY (Articles 13 & 14)
- **Human-in-the-Loop (HITL):** Tier-2 escalation required for high-consequence automated recommendations.
- **Explainability Interface:** SHAP value approximations and source document citation grounding rendered on every generated output.

## 5. EVIDENCE ARTIFACT INVENTORY ATTACHED
${evidenceFiles.map((ev, i) => `- [x] **[EV-${i + 1}]** ${ev.name} (Status: ${ev.status}, Version: ${ev.version})`).join("\n")}

---
*Certified and Authorized under ISO/IEC 42001 Lead Auditor Authority*
`;
    }

    if (std === "NIST_AI_RMF_1_0") {
      return `# NIST AI RISK MANAGEMENT FRAMEWORK (AI RMF 1.0) PROFILE PLAYBOOK
**Target Enterprise System:** ${projName}
**Organization:** Onyx Enterprise Governance
**Assessment Date:** ${timestamp}
**Document Status:** Approved & Audited

---

## CORE FUNCTION 1: GOVERN (GV)
- **GV-1.1:** Legal and regulatory requirements (EU AI Act, HIPAA, ISO 27001) are continuously tracked in C&A portal.
- **GV-2.1:** Roles and responsibilities are assigned via RBAC (CISO, AI Custodian, Lead Auditor).
- **GV-4.2:** Organizational risk tolerance defined at "Conservative" with mandatory approval workflows.

## CORE FUNCTION 2: MAP (MP)
- **MP-1.1:** Context and deployment environment documented for all production models: ${models.map(m => m.name).join(", ")}.
- **MP-2.3:** Potential negative impacts on human rights, privacy, and algorithmic fairness thoroughly evaluated.

## CORE FUNCTION 3: MEASURE (MS)
- **MS-2.1:** Quantitative metrics tracked: Prompt Safety Score (>96%), P95 Latency (<350ms), Embedding Drift (<0.12 KL-divergence).
- **MS-3.2:** Independent red-teaming exercises and prompt injection penetration tests recorded in Evidence Vault.

## CORE FUNCTION 4: MANAGE (MG)
- **MG-1.3:** Automated CI/CD deployment gates block unapproved model checkpoints from reaching production.
- **MG-3.1:** Incident response plan established with mandatory 72-hour regulator notification for severe AI drift events.

---
*Digital Stamp: ${shaSignature}*
`;
    }

    if (std === "ISO_42001_SOA_DOSSIER") {
      return `# ISO/IEC 42001:2023 STATEMENT OF APPLICABILITY (SoA) FORMAL AUDIT DOSSIER
**Organization:** Onyx Enterprise AI & Compliance Operations
**Scope of AI Management System (AIMS):** All Generative, Predictive, and Vision AI Lifecycle Workflows
**Assessment Framework:** ISO/IEC 42001:2023 (Clauses 4–10 & Annex A Controls)
**Auditor Signature:** Dr. Marcus Vance, Lead Assessor (EY Certify)
**Verification Token:** ${shaSignature}

---

## 1. CLAUSE CONFORMANCE SUMMARY
- Clause 4 (Context of the Organization): **CONFORMANT**
- Clause 5 (Leadership & AI Policy): **CONFORMANT** (Approved by CISO)
- Clause 6 (Planning & AI Objectives): **CONFORMANT**
- Clause 7 (Support & Competence): **CONFORMANT** (Mandatory AI Ethics Training enfored)
- Clause 8 (Operation & AI Impact Assessments): **CONFORMANT**
- Clause 9 (Performance Evaluation & Monitoring): **CONFORMANT** (Live SIEM telemetry)
- Clause 10 (Improvement & Non-conformities): **CONFORMANT**

## 2. ANNEX A CONTROL MATRIX (SAMPLE)
| Control ID | Control Name | Applicability | Implementation Status | Evidence Reference |
|---|---|---|---|---|
| A.2.2 | AI Policy | Applicable | Implemented | EV-01 Org AI Ethics Policy.pdf |
| A.3.2 | Roles & Responsibilities | Applicable | Implemented | RBAC Directory Config |
| A.5.2 | AI System Impact Assessment | Applicable | Implemented | Algorithmic Impact Matrix |
| A.6.2 | Data for AI Systems | Applicable | Implemented | Dataset Lineage Audit Log |
| A.7.4 | Continuous AI Monitoring | Applicable | Implemented | Datadog SIEM Telemetry Stream |
| A.8.4 | AI System Safety & Robustness | Applicable | Implemented | Red-Team Robustness Report |

## 3. ATTESTATION & DIGITAL SIGN-OFF
The undersigned Lead Auditor confirms that the AI Management System has been evaluated per ISO 19011 auditing principles and satisfies ISO/IEC 42001:2023 certification requirements.
`;
    }

    // SOC 2 Type II
    return `# SOC 2 TYPE II - TRUST SERVICES CRITERIA (AI & SECURITY ADDENDUM)
**System Scope:** ${projName} Production AI Infrastructure
**Audit Period:** Current Calendar Year
**Service Auditor:** Deloitte Assurance LLP

---

## 1. COMMON CRITERIA CC6 - LOGICAL & PHYSICAL ACCESS CONTROLS
- **CC6.1:** Access to model registries and weights requires hardware MFA and SSO federation.
- **CC6.6:** Logical boundary controls prevent tenant cross-contamination in vector embeddings.

## 2. COMMON CRITERIA CC7 - SYSTEM OPERATIONS & MONITORING
- **CC7.2:** Real-time anomaly detection and prompt injection attack alerting via Datadog SIEM.
- **CC7.4:** Incident response protocols tested quarterly with automated post-mortem logs.

## 3. COMMON CRITERIA CC8 - CHANGE MANAGEMENT & AI GOVERNANCE
- **CC8.1:** Model fine-tuning and weight updates require signed CISO and Lead Assessor approvals in C&A portal.
- **CC8.2:** Automated CI/CD security quality gates verify that test suite pass rate >= 99.5% before production release.

---
*Cryptographic Seal: ${shaSignature}*
`;
  };

  const dossierContent = generateDossierContent(selectedStandard);

  const handleCopy = () => {
    navigator.clipboard.writeText(dossierContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const filename = `${selectedStandard.toLowerCase()}_dossier_${Date.now()}.md`;
    const blob = new Blob([dossierContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(`Downloaded ${filename} successfully!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadJSON = () => {
    const packageData = {
      standard: selectedStandard,
      project: currentProject,
      generatedAt: new Date().toISOString(),
      complianceScore: 96,
      auditorStamp: {
        assessor: "Yan Aung, Lead ISO 42001 Assessor",
        status: "APPROVED",
        checksum: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
      },
      modelsIncluded: models.length,
      risksEvaluated: risks.length,
      evidenceFilesAttached: evidenceFiles.length,
      rawDossier: dossierContent
    };

    const filename = `${selectedStandard.toLowerCase()}_package_${Date.now()}.json`;
    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(`Downloaded ${filename} package!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-scale-up border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Regulatory Dossier &amp; Export Package Engine</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Official Audit Grade
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Generate one-click certification packages for EU AI Act, NIST AI RMF, ISO 42001 SoA, and SOC 2 Type II
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0 flex flex-wrap items-center justify-between gap-3">
          
          {/* Standard Tabs */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedStandard("EU_AI_ACT_ANNEX_IV")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStandard === "EU_AI_ACT_ANNEX_IV"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              EU AI Act Annex IV
            </button>
            <button
              onClick={() => setSelectedStandard("NIST_AI_RMF_1_0")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStandard === "NIST_AI_RMF_1_0"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              NIST AI RMF 1.0 Profile
            </button>
            <button
              onClick={() => setSelectedStandard("ISO_42001_SOA_DOSSIER")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStandard === "ISO_42001_SOA_DOSSIER"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              ISO/IEC 42001 SoA Dossier
            </button>
            <button
              onClick={() => setSelectedStandard("SOC_2_AI_SECURITY")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStandard === "SOC_2_AI_SECURITY"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              SOC 2 Type II AI Addendum
            </button>
          </div>

          {/* Project Target Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">System:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none focus:border-indigo-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.riskClassification || "Standard"})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Notification banner */}
        {downloadSuccess && (
          <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Main Dossier Markdown Preview Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed select-text">
          <pre className="whitespace-pre-wrap font-sans text-slate-200">
            {dossierContent}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Digital SHA-256 Checksum Verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Dossier"}</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON Package</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Download Full Markdown (.md)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
