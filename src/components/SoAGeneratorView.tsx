import React, { useState } from "react";
import {
  FileCheck2,
  ShieldCheck,
  Filter,
  Search,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  Save,
  X,
  FileText,
  Info,
  Sparkles,
  Layers,
  ChevronRight,
  Plus
} from "lucide-react";
import { EvidenceFile } from "../types";
import { sendAuditLog } from "../services/auditLoggerService";

export interface SoAControl {
  id: string; // e.g. "A.5.1"
  code: string; // e.g. "A.5.1"
  domain: "A.5 Organizational" | "A.6 People" | "A.7 Physical" | "A.8 Technological";
  title: string;
  description: string;
  inScope: boolean;
  justification: string;
  implementationStatus: "Implemented" | "In Progress" | "Planned" | "Not Applicable";
  owner: string;
  linkedEvidenceIds: string[];
}

interface SoAGeneratorViewProps {
  evidenceFiles?: EvidenceFile[];
  onOpenMfaStepUp?: (actionTitle: string, onSuccess: () => void) => void;
}

const INITIAL_SOA_CONTROLS: SoAControl[] = [
  // A.5 Organizational Controls
  {
    id: "A.5.1",
    code: "A.5.1",
    domain: "A.5 Organizational",
    title: "Policies for information security",
    description: "Information security policy and topic-specific policies shall be defined, approved by management, published, and communicated to personnel.",
    inScope: true,
    justification: "Mandatory core governance control for organizational security management and ISO 27001 certification.",
    implementationStatus: "Implemented",
    owner: "CISO / Head of Security",
    linkedEvidenceIds: ["ev-1"]
  },
  {
    id: "A.5.19",
    code: "A.5.19",
    domain: "A.5 Organizational",
    title: "Information security in supplier relationships",
    description: "Processes and procedures shall be defined and implemented to manage information security risks associated with the use of supplier products or services.",
    inScope: true,
    justification: "Critical for third-party LLM providers, model vendors, and cloud infrastructure partners.",
    implementationStatus: "Implemented",
    owner: "Vendor Risk Manager",
    linkedEvidenceIds: ["ev-3"]
  },
  {
    id: "A.5.24",
    code: "A.5.24",
    domain: "A.5 Organizational",
    title: "Information security incident management planning and preparation",
    description: "The organization shall plan and prepare for managing information security incidents by defining, establishing and communicating procedures.",
    inScope: true,
    justification: "Ensures immediate incident response for model safety failures, data leakage, and algorithmic bias breaches.",
    implementationStatus: "Implemented",
    owner: "Incident Response Team Lead",
    linkedEvidenceIds: ["ev-5"]
  },
  {
    id: "A.5.29",
    code: "A.5.29",
    domain: "A.5 Organizational",
    title: "ICT readiness for business continuity",
    description: "ICT readiness shall be planned, implemented, maintained and tested based on business continuity objectives and ICT continuity requirements.",
    inScope: true,
    justification: "High-availability requirement for production AI services and governance registry databases.",
    implementationStatus: "In Progress",
    owner: "DevOps & Cloud Lead",
    linkedEvidenceIds: []
  },
  {
    id: "A.5.36",
    code: "A.5.36",
    domain: "A.5 Organizational",
    title: "Compliance with policies and standards for information security",
    description: "Compliance with the organization's information security policy and topic-specific policies shall be regularly reviewed.",
    inScope: true,
    justification: "Establishes formal internal and external audit schedules for ISO 27001 and SOC 2 Type II assurance.",
    implementationStatus: "Implemented",
    owner: "Lead Compliance Auditor",
    linkedEvidenceIds: ["ev-2"]
  },

  // A.6 People Controls
  {
    id: "A.6.1",
    code: "A.6.1",
    domain: "A.6 People",
    title: "Screening",
    description: "Background verification checks on all candidates for employment shall be carried out prior to joining.",
    inScope: true,
    justification: "Ensures trustworthy personnel handling confidential training datasets and AI model keys.",
    implementationStatus: "Implemented",
    owner: "Head of HR",
    linkedEvidenceIds: []
  },
  {
    id: "A.6.3",
    code: "A.6.3",
    domain: "A.6 People",
    title: "Information security awareness, education and training",
    description: "Personnel shall receive appropriate information security awareness and role-relevant AI security training.",
    inScope: true,
    justification: "Mandatory training program for secure AI development and privacy compliance.",
    implementationStatus: "Implemented",
    owner: "Security Awareness Lead",
    linkedEvidenceIds: ["ev-4"]
  },

  // A.7 Physical Controls
  {
    id: "A.7.1",
    code: "A.7.1",
    domain: "A.7 Physical",
    title: "Physical security perimeters",
    description: "Security perimeters shall be defined and used to protect areas containing information assets.",
    inScope: false,
    justification: "Excluded: Platform operates 100% on cloud infrastructure (GCP Cloud Run / Firebase). Physical data center security is delegated to GCP SOC 2 / ISO 27001 reports.",
    implementationStatus: "Not Applicable",
    owner: "Facility Manager (Cloud Provider)",
    linkedEvidenceIds: []
  },

  // A.8 Technological Controls
  {
    id: "A.8.7",
    code: "A.8.7",
    domain: "A.8 Technological",
    title: "Protection against malware",
    description: "Protection against malware shall be implemented and supported by appropriate security awareness.",
    inScope: true,
    justification: "Endpoint protection and container scanning to prevent malware injection into AI pipelines.",
    implementationStatus: "Implemented",
    owner: "SecOps Lead",
    linkedEvidenceIds: []
  },
  {
    id: "A.8.12",
    code: "A.8.12",
    domain: "A.8 Technological",
    title: "Data leakage prevention",
    description: "Data leakage prevention measures shall be applied to systems, networks and any other devices that process, store or transmit sensitive information.",
    inScope: true,
    justification: "Prevents exposure of sensitive PII or confidential prompts to public AI foundation models.",
    implementationStatus: "Implemented",
    owner: "Data Protection Officer",
    linkedEvidenceIds: ["ev-1"]
  },
  {
    id: "A.8.24",
    code: "A.8.24",
    domain: "A.8 Technological",
    title: "Use of cryptography",
    description: "Rules for the effective use of cryptography, including cryptographic key management, shall be defined and implemented.",
    inScope: true,
    justification: "Requires AES-256 encryption at rest, TLS 1.3 in transit, and SHA-256 tamper-evident hash chaining for audit logs.",
    implementationStatus: "Implemented",
    owner: "Lead Cryptography Architect",
    linkedEvidenceIds: ["ev-2"]
  },
  {
    id: "A.8.25",
    code: "A.8.25",
    domain: "A.8 Technological",
    title: "Secure development life cycle",
    description: "Rules for secure development of software and systems shall be established and applied.",
    inScope: true,
    justification: "Enforces peer code reviews, automated CI/CD security scanning, and dependency vulnerability audits.",
    implementationStatus: "Implemented",
    owner: "Head of Engineering",
    linkedEvidenceIds: []
  },
  {
    id: "A.8.28",
    code: "A.8.28",
    domain: "A.8 Technological",
    title: "Secure coding",
    description: "Secure coding principles shall be applied to software development.",
    inScope: true,
    justification: "Prevents OWASP Top 10 vulnerabilities and OWASP LLM Top 10 security risks.",
    implementationStatus: "Implemented",
    owner: "AppSec Lead",
    linkedEvidenceIds: []
  }
];

export default function SoAGeneratorView({
  evidenceFiles = [],
  onOpenMfaStepUp
}: SoAGeneratorViewProps) {
  const [controls, setControls] = useState<SoAControl[]>(INITIAL_SOA_CONTROLS);
  const [domainFilter, setDomainFilter] = useState<string>("ALL");
  const [scopeFilter, setScopeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingControlId, setEditingControlId] = useState<string | null>(null);

  // Form edit states
  const [editInScope, setEditInScope] = useState<boolean>(true);
  const [editJustification, setEditJustification] = useState<string>("");
  const [editStatus, setEditStatus] = useState<"Implemented" | "In Progress" | "Planned" | "Not Applicable">("Implemented");
  const [editOwner, setEditOwner] = useState<string>("");

  // Metrics
  const totalControls = controls.length;
  const inScopeCount = controls.filter(c => c.inScope).length;
  const excludedCount = controls.filter(c => !c.inScope).length;
  const implementedCount = controls.filter(c => c.inScope && c.implementationStatus === "Implemented").length;
  const implementationPercentage = inScopeCount > 0 ? Math.round((implementedCount / inScopeCount) * 100) : 0;

  // Filtered controls
  const filteredControls = controls.filter(c => {
    const matchesDomain = domainFilter === "ALL" || c.domain === domainFilter;
    const matchesScope = scopeFilter === "ALL" ||
      (scopeFilter === "IN_SCOPE" && c.inScope) ||
      (scopeFilter === "EXCLUDED" && !c.inScope);
    const matchesQuery = c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.justification.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDomain && matchesScope && matchesQuery;
  });

  const handleStartEdit = (ctrl: SoAControl) => {
    setEditingControlId(ctrl.id);
    setEditInScope(ctrl.inScope);
    setEditJustification(ctrl.justification);
    setEditStatus(ctrl.implementationStatus);
    setEditOwner(ctrl.owner);
  };

  const handleSaveEdit = (ctrlId: string) => {
    setControls(prev => prev.map(c => {
      if (c.id === ctrlId) {
        const updated = {
          ...c,
          inScope: editInScope,
          justification: editJustification,
          implementationStatus: editInScope && editStatus === "Not Applicable" ? "In Progress" : editStatus,
          owner: editOwner
        };

        sendAuditLog({
          action: "SOA_CONTROL_UPDATED",
          isoControl: c.code,
          category: "GOVERNANCE",
          targetResource: { type: "SOA_CONTROL", id: c.code, name: c.title },
          details: {
            controlCode: c.code,
            title: c.title,
            previousScope: c.inScope ? "In Scope" : "Excluded",
            newScope: updated.inScope ? "In Scope" : "Excluded",
            justification: updated.justification,
            implementationStatus: updated.implementationStatus,
            owner: updated.owner
          }
        });

        return updated;
      }
      return c;
    }));

    setEditingControlId(null);
  };

  const handleExportSoA = () => {
    const executeExport = () => {
      const exportData = {
        documentTitle: "ISO/IEC 27001:2022 Statement of Applicability (SoA)",
        version: "2.4.0",
        exportTimestamp: new Date().toISOString(),
        auditorSignOff: "CISO / Lead Auditor Certified",
        metrics: {
          totalAnnexAControls: totalControls,
          inScope: inScopeCount,
          excluded: excludedCount,
          implementationProgress: `${implementationPercentage}%`
        },
        controls: controls.map(c => ({
          code: c.code,
          domain: c.domain,
          title: c.title,
          inScope: c.inScope ? "Yes" : "No",
          justification: c.justification,
          status: c.implementationStatus,
          owner: c.owner
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ISO27001_Statement_of_Applicability_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      sendAuditLog({
        action: "SOA_DOCUMENT_EXPORTED",
        isoControl: "A.5.36",
        category: "GOVERNANCE",
        targetResource: { type: "SOA_DOCUMENT", id: "soa-v2.4", name: "ISO 27001 Statement of Applicability" },
        details: {
          inScopeCount,
          excludedCount,
          implementationPercentage
        }
      });
    };

    if (onOpenMfaStepUp) {
      onOpenMfaStepUp("Export Signed Statement of Applicability (SoA)", executeExport);
    } else {
      executeExport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                ISO/IEC 27001:2022 Clause 6.1.3
              </span>
              <span className="text-xs text-indigo-300 font-mono">Annex A Governance</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <FileCheck2 className="w-7 h-7 text-indigo-400" /> Statement of Applicability (SoA)
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Formal ISO 27001 Annex A controls matrix documenting scope determinations, inclusion/exclusion justifications, implementation statuses, and evidence linkages for audit verification.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-400" /> Print Summary
            </button>
            <button
              onClick={handleExportSoA}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export Signed SoA Package
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Controls</span>
            <div className="text-xl font-extrabold text-white mt-0.5 font-mono">{totalControls}</div>
            <span className="text-[10px] text-slate-400">Annex A Catalog</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">In Scope Controls</span>
            <div className="text-xl font-extrabold text-emerald-300 mt-0.5 font-mono">{inScopeCount}</div>
            <span className="text-[10px] text-slate-400">Applicable to AI Platform</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase text-rose-400 tracking-wider">Excluded Controls</span>
            <div className="text-xl font-extrabold text-rose-300 mt-0.5 font-mono">{excludedCount}</div>
            <span className="text-[10px] text-slate-400">Justified Exclusions</span>
          </div>

          <div className="bg-indigo-950/80 p-3 rounded-xl border border-indigo-800/80">
            <span className="text-[10px] font-bold uppercase text-indigo-300 tracking-wider">Implementation Status</span>
            <div className="text-xl font-extrabold text-indigo-200 mt-0.5 font-mono">{implementationPercentage}%</div>
            <div className="w-full bg-indigo-900/80 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full transition-all duration-500" style={{ width: `${implementationPercentage}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search code, title, or justification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Domain:</span>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="ALL">All Domains</option>
              <option value="A.5 Organizational">A.5 Organizational</option>
              <option value="A.6 People">A.6 People</option>
              <option value="A.7 Physical">A.7 Physical</option>
              <option value="A.8 Technological">A.8 Technological</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Scope:</span>
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="ALL">All Controls</option>
              <option value="IN_SCOPE">In Scope Only</option>
              <option value="EXCLUDED">Excluded Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Controls Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-3.5 pl-4 w-28">Control Code</th>
                <th className="p-3.5 w-64">Control Title &amp; Description</th>
                <th className="p-3.5 w-28 text-center">Applicability</th>
                <th className="p-3.5">Justification &amp; Implementation Details</th>
                <th className="p-3.5 w-36">Status &amp; Owner</th>
                <th className="p-3.5 pr-4 w-20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {filteredControls.map((ctrl) => {
                const isEditing = editingControlId === ctrl.id;

                return (
                  <tr key={ctrl.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Code & Domain */}
                    <td className="p-3.5 pl-4 align-top">
                      <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-xs block">
                        {ctrl.code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {ctrl.domain}
                      </span>
                    </td>

                    {/* Title & Description */}
                    <td className="p-3.5 align-top space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white leading-snug">
                        {ctrl.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {ctrl.description}
                      </div>
                    </td>

                    {/* Applicability */}
                    <td className="p-3.5 align-top text-center">
                      {isEditing ? (
                        <div className="flex flex-col gap-1 items-center">
                          <label className="text-[10px] font-bold text-slate-500">In Scope?</label>
                          <input
                            type="checkbox"
                            checked={editInScope}
                            onChange={(e) => setEditInScope(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                          />
                        </div>
                      ) : ctrl.inScope ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> In Scope
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                          <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Excluded
                        </span>
                      )}
                    </td>

                    {/* Justification */}
                    <td className="p-3.5 align-top">
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={editJustification}
                            onChange={(e) => setEditJustification(e.target.value)}
                            className="w-full p-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                            placeholder="Enter justification for inclusion or exclusion..."
                          />
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 italic leading-relaxed bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80">
                            "{ctrl.justification}"
                          </p>
                          {ctrl.linkedEvidenceIds.length > 0 && (
                            <div className="flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                              <FileText className="w-3 h-3" /> Linked Evidence: {ctrl.linkedEvidenceIds.length} document(s)
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Status & Owner */}
                    <td className="p-3.5 align-top space-y-1.5">
                      {isEditing ? (
                        <div className="space-y-2">
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="w-full text-xs p-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
                          >
                            <option value="Implemented">Implemented</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Planned">Planned</option>
                            <option value="Not Applicable">Not Applicable</option>
                          </select>
                          <input
                            type="text"
                            value={editOwner}
                            onChange={(e) => setEditOwner(e.target.value)}
                            placeholder="Owner"
                            className="w-full text-xs p-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="mb-1">
                            {ctrl.implementationStatus === "Implemented" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                Implemented
                              </span>
                            )}
                            {ctrl.implementationStatus === "In Progress" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                In Progress
                              </span>
                            )}
                            {ctrl.implementationStatus === "Planned" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                                Planned
                              </span>
                            )}
                            {ctrl.implementationStatus === "Not Applicable" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                                N/A
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">
                            Owner: {ctrl.owner}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-4 align-top text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSaveEdit(ctrl.id)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                            title="Save changes"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingControlId(null)}
                            className="p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(ctrl)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Edit control applicability or justification"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
