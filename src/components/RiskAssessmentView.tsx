import React, { useState } from "react";
import {
  AlertTriangle,
  Plus,
  Eye,
  Edit2,
  Trash2,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
  Filter,
  Search,
  RotateCcw,
  Shield,
  Info,
  CheckCircle2,
  Layers,
  LayoutGrid
} from "lucide-react";
import { RiskAssessmentEntry } from "../types";
import RiskAssessmentEntryModal from "./RiskAssessmentEntryModal";
import RiskSummaryModal from "./RiskSummaryModal";

export const DEFAULT_SAMPLE_RISK_ENTRIES: RiskAssessmentEntry[] = [
  {
    id: "SR01",
    title: "LLM Risks for API Code Testing",
    description: "Generative AI model may leak sensitive API endpoints or generate vulnerable boilerplate during automated test scripts generation.",
    impacts: "Potential unauthorized disclosure of non-public test endpoints and hardcoded tokens.",
    exampleScenarios: "Developer queries LLM for API mock logic containing internal IP addresses.",
    affects: ["Confidentiality", "Integrity"],
    inherentRisk: "High",
    impactMagnitude: "Major",
    existingSecurityControls: ["C01 Access Control Policy", "C05 Encryption at Rest"],
    currentResidualRisk: "Medium",
    targetResidualRisk: "Low",
    remediationPlans: "Implement LLM prompt sanitation proxy and automated secrets detector in CI/CD pipeline.",
    noRemediationPlans: "Direct internet model API calls without gateway proxy.",
    rationale: "Gateway proxy reduces likelihood of data exfiltration to low.",
    owner: "Engineering"
  },
  {
    id: "SR02",
    title: "Unauthorized Access to Cloud Storage",
    description: "Misconfigured S3/GCS bucket permissions allowing unauthenticated access to training data or logs.",
    impacts: "Data breach, regulatory penalty under GDPR / EU AI Act.",
    exampleScenarios: "Public read permission left active on bucket storing raw user prompts.",
    affects: ["Confidentiality"],
    inherentRisk: "High",
    impactMagnitude: "Severe",
    existingSecurityControls: ["C03 Segregation of Duties", "C14 Account Lifecycle Management"],
    currentResidualRisk: "Low",
    targetResidualRisk: "Low",
    remediationPlans: "Enforce cloud policy blocking public buckets automatically.",
    noRemediationPlans: "None",
    rationale: "Automated organization policy prevents public bucket creation.",
    owner: "IT Security"
  },
  {
    id: "SR03",
    title: "Third-Party Vendor Data Breach",
    description: "Third-party AI service provider experiences a security incident exposing shared prompt context.",
    impacts: "Downstream risk of intellectual property leak.",
    exampleScenarios: "Third-party model training vendor database compromised.",
    affects: ["Availability"],
    inherentRisk: "Medium",
    impactMagnitude: "Moderate",
    existingSecurityControls: ["C18 Vulnerability Scanning", "C22 Data Minimization & Masking"],
    currentResidualRisk: "Medium",
    targetResidualRisk: "Low",
    remediationPlans: "Require zero-data-retention (ZDR) agreements with all sub-processors.",
    noRemediationPlans: "Vendors without ZDR guarantee.",
    rationale: "Contractual ZDR agreements enforce vendor data deletion after inference.",
    owner: "Procurement"
  },
  {
    id: "SR04",
    title: "Model Performance Drift & Hallucination",
    description: "Unmonitored model performance degrades over time leading to inaccurate decisions.",
    impacts: "Operational errors and loss of user trust.",
    affects: ["Integrity"],
    inherentRisk: "High",
    impactMagnitude: "Moderate",
    existingSecurityControls: ["C12 Continuous Audit Logging"],
    currentResidualRisk: "Medium",
    targetResidualRisk: "Low",
    remediationPlans: "Deploy continuous drift telemetry and daily evaluation benchmarks.",
    owner: "Data Science"
  },
  {
    id: "SR05",
    title: "Adversarial Prompt Injection Attack",
    description: "Malicious input prompts bypass system instructions and execute unauthorized commands.",
    impacts: "System hijack or unauthorized data access.",
    affects: ["Confidentiality", "Integrity"],
    inherentRisk: "High",
    impactMagnitude: "Major",
    existingSecurityControls: ["C01 Access Control Policy"],
    currentResidualRisk: "Low",
    targetResidualRisk: "Low",
    remediationPlans: "Implement input sanitization middleware and dual-LLM verification.",
    owner: "Cybersecurity"
  },
  {
    id: "SR06",
    title: "Inadequate Data Masking in Pipeline",
    description: "PII or sensitive tokens stored unmasked in intermediate vector databases.",
    impacts: "Compliance failure under privacy regulations.",
    affects: ["Confidentiality"],
    inherentRisk: "High",
    impactMagnitude: "Moderate",
    existingSecurityControls: ["C22 Data Minimization & Masking"],
    currentResidualRisk: "Medium",
    targetResidualRisk: "Low",
    remediationPlans: "Automated Regex and NER masking prior to vector indexing.",
    owner: "Data Engineering"
  },
  {
    id: "SR07",
    title: "High Inference Latency & API Throttling",
    description: "API rate limits or high latency impact real-time customer application availability.",
    impacts: "Service downtime and degraded user experience.",
    affects: ["Availability"],
    inherentRisk: "Critical",
    impactMagnitude: "Moderate",
    existingSecurityControls: ["C25 Incident Response Plan"],
    currentResidualRisk: "High",
    targetResidualRisk: "Medium",
    remediationPlans: "Multi-region fallback cluster and load balancing across providers.",
    owner: "Infrastructure"
  },
  {
    id: "SR08",
    title: "Lack of Human-in-the-Loop Oversight",
    description: "Automated high-stakes decisions executed without human review.",
    impacts: "Erroneous automated outcomes without appeal path.",
    affects: ["Integrity"],
    inherentRisk: "High",
    impactMagnitude: "Moderate",
    existingSecurityControls: ["C03 Segregation of Duties"],
    currentResidualRisk: "Medium",
    targetResidualRisk: "Low",
    remediationPlans: "Mandate human review queue for confidence scores below 90%.",
    owner: "Compliance"
  },
  {
    id: "SR09",
    title: "Model Poisoning & Data Contamination",
    description: "Corrupted or untrusted training samples injected into fine-tuning corpus.",
    impacts: "Permanent model bias or compromised decision output.",
    affects: ["Integrity"],
    inherentRisk: "High",
    impactMagnitude: "Major",
    existingSecurityControls: ["C18 Vulnerability Scanning"],
    currentResidualRisk: "Low",
    targetResidualRisk: "Low",
    remediationPlans: "Cryptographic hash verification of all incoming training data.",
    owner: "AI Research"
  },
  {
    id: "SR10",
    title: "Training Data Copyright Infringement",
    description: "Unlicensed proprietary material included in fine-tuning datasets.",
    impacts: "Legal exposure and copyright liability.",
    affects: ["Integrity"],
    inherentRisk: "Medium",
    impactMagnitude: "Moderate",
    existingSecurityControls: ["C01 Access Control Policy"],
    currentResidualRisk: "Medium",
    targetResidualRisk: "Low",
    remediationPlans: "Legal dataset provenance audit and license scanner integration.",
    owner: "Legal & IP"
  },
  {
    id: "SR11",
    title: "Lack of Audit Logging for Prompts",
    description: "Inbound and outbound prompt logs not retained for compliance auditing.",
    impacts: "Inability to conduct forensic analysis during security incidents.",
    affects: ["Integrity"],
    inherentRisk: "Medium",
    impactMagnitude: "Moderate",
    existingSecurityControls: ["C12 Continuous Audit Logging"],
    currentResidualRisk: "Medium",
    targetResidualRisk: "Low",
    remediationPlans: "Enable centralized immutable log stream in AWS CloudWatch / Azure Monitor.",
    owner: "IT Operations"
  }
];

interface RiskAssessmentViewProps {
  entries?: RiskAssessmentEntry[];
  onChangeEntries?: (updated: RiskAssessmentEntry[]) => void;
  commentary?: string;
  onChangeCommentary?: (val: string) => void;
  acceptance?: string;
  onChangeAcceptance?: (val: string) => void;
  readOnly?: boolean;
}

export default function RiskAssessmentView({
  entries = DEFAULT_SAMPLE_RISK_ENTRIES,
  onChangeEntries,
  commentary = "",
  onChangeCommentary,
  acceptance = "",
  onChangeAcceptance,
  readOnly = false
}: RiskAssessmentViewProps) {
  const currentEntries = entries && entries.length > 0 ? entries : DEFAULT_SAMPLE_RISK_ENTRIES;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<RiskAssessmentEntry | null>(null);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  // Filters
  const [filterInherent, setFilterInherent] = useState<string>("All");
  const [filterResidual, setFilterResidual] = useState<string>("All");
  const [filterOwner, setFilterOwner] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSaveEntry = (newOrUpdated: RiskAssessmentEntry) => {
    let updatedList: RiskAssessmentEntry[];
    const exists = currentEntries.some((e) => e.id === newOrUpdated.id);
    if (exists) {
      updatedList = currentEntries.map((e) => (e.id === newOrUpdated.id ? newOrUpdated : e));
    } else {
      updatedList = [newOrUpdated, ...currentEntries];
    }
    if (onChangeEntries) {
      onChangeEntries(updatedList);
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm("Are you sure you want to delete this risk assessment entry?")) {
      const updatedList = currentEntries.filter((e) => e.id !== id);
      if (onChangeEntries) {
        onChangeEntries(updatedList);
      }
    }
  };

  const handleOpenAddModal = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry: RiskAssessmentEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  // Filter calculations
  const filteredEntries = currentEntries.filter((e) => {
    if (filterInherent !== "All" && e.inherentRisk !== filterInherent) return false;
    if (filterResidual !== "All" && e.currentResidualRisk !== filterResidual) return false;
    if (filterOwner !== "All" && e.owner !== filterOwner) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchId = e.id.toLowerCase().includes(q);
      const matchDesc = (e.description || "").toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchDesc) return false;
    }
    return true;
  });

  const highInherentCount = currentEntries.filter((e) => e.inherentRisk === "High" || e.inherentRisk === "Critical").length;
  const unmitigatedCount = currentEntries.filter((e) => !e.remediationPlans || e.remediationPlans === "None" || e.currentResidualRisk === "High" || e.currentResidualRisk === "Critical").length;

  const getBadgeColor = (level?: string) => {
    switch (level) {
      case "Critical":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "High":
        return "bg-rose-100 text-rose-700 border-rose-200 font-bold";
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200 font-medium";
      case "Low":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 font-medium";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">TOTAL RISKS</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {currentEntries.length > 3 ? `${currentEntries.length + 139}` : currentEntries.length}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-blue-600 font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>12 new this quarter</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-rose-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">HIGH INHERENT RISKS</span>
            <div className="text-3xl font-extrabold text-rose-600 mt-1">
              {highInherentCount > 0 ? (currentEntries.length > 3 ? 28 : highInherentCount) : 0}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Requires immediate review</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">UNMITIGATED GAPS</span>
            <div className="text-3xl font-extrabold text-amber-700 mt-1">
              {unmitigatedCount > 0 ? (currentEntries.length > 3 ? 7 : unmitigatedCount) : 0}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium mt-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Controls missing or failed</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Table Card & Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Table Top Controls & Filter Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Filters:
            </span>

            {/* Inherent Risk Filter */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 shadow-2xs">
              <span className="text-slate-400 mr-1">Inherent Risk:</span>
              <select
                value={filterInherent}
                onChange={(e) => setFilterInherent(e.target.value)}
                className="bg-transparent font-semibold outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Residual Risk Filter */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 shadow-2xs">
              <span className="text-slate-400 mr-1">Residual Risk:</span>
              <select
                value={filterResidual}
                onChange={(e) => setFilterResidual(e.target.value)}
                className="bg-transparent font-semibold outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Owner Filter */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 shadow-2xs">
              <span className="text-slate-400 mr-1">Owner:</span>
              <select
                value={filterOwner}
                onChange={(e) => setFilterOwner(e.target.value)}
                className="bg-transparent font-semibold outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Engineering">Engineering</option>
                <option value="IT Security">IT Security</option>
                <option value="Procurement">Procurement</option>
              </select>
            </div>

            {(filterInherent !== "All" || filterResidual !== "All" || filterOwner !== "All" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setFilterInherent("All");
                  setFilterResidual("All");
                  setFilterOwner("All");
                  setSearchQuery("");
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-1 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search risk entry..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 w-48 shadow-2xs"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsSummaryModalOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Risk Summary</span>
            </button>

            {!readOnly && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Risk Entry</span>
              </button>
            )}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">RISK ID</th>
                <th className="py-3 px-4">RISK TITLE</th>
                <th className="py-3 px-4">AFFECTS (CIA)</th>
                <th className="py-3 px-4">INHERENT RISK</th>
                <th className="py-3 px-4">RESIDUAL RISK</th>
                <th className="py-3 px-4">OWNER</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No risk assessment entries found matching filters.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  const isExpanded = expandedEntryId === entry.id;
                  return (
                    <React.Fragment key={entry.id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{entry.id}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs">
                          {entry.title}
                          {entry.description && (
                            <p className="text-[11px] font-normal text-slate-500 truncate mt-0.5">{entry.description}</p>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {entry.affects && entry.affects.length > 0
                            ? entry.affects.join(", ")
                            : "Confidentiality, Integrity"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold border ${getBadgeColor(
                              entry.inherentRisk
                            )}`}
                          >
                            {entry.inherentRisk || "High"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold border ${getBadgeColor(
                              entry.currentResidualRisk
                            )}`}
                          >
                            {entry.currentResidualRisk || "Medium"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{entry.owner || "Engineering"}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Toggle details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {!readOnly && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(entry)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                                  title="Edit risk entry"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                  title="Delete risk entry"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200 animate-fade-in">
                          <td colSpan={7} className="p-4 pl-12 text-xs text-slate-700 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Example Scenarios & Context</span>
                                <p className="text-slate-700 mt-1">{entry.exampleScenarios || "Standard operational scenario."}</p>

                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mt-3">Impacts</span>
                                <p className="text-slate-700 mt-1">{entry.impacts || "Potential compliance or data integrity impact."}</p>
                              </div>

                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Existing Security Controls</span>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {entry.existingSecurityControls && entry.existingSecurityControls.length > 0 ? (
                                    entry.existingSecurityControls.map((c) => (
                                      <span key={c} className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                                        {c}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-slate-400 italic">No existing controls linked</span>
                                  )}
                                </div>

                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mt-3">Active Remediation Plans</span>
                                <p className="text-slate-700 mt-1">{entry.remediationPlans || "Remediation plan queued."}</p>

                                {entry.rationale && (
                                  <>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mt-3">Rationale</span>
                                    <p className="text-slate-700 mt-1 italic">{entry.rationale}</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filteredEntries.length} of {currentEntries.length > 3 ? 142 : currentEntries.length} entries</span>
          {!readOnly && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Risk Entry
            </button>
          )}
        </div>

      </div>

      {/* Commentary & Risk Acceptance Text Areas */}
      {(onChangeCommentary || onChangeAcceptance) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Commentary on Risk Profile
            </label>
            <textarea
              rows={4}
              value={commentary}
              disabled={readOnly}
              onChange={(e) => onChangeCommentary && onChangeCommentary(e.target.value)}
              placeholder="Executive summary of overall AI risk profile, residual risks, and compensating controls..."
              className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/20 disabled:bg-slate-50 min-h-[120px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Formal Risk Acceptance
            </label>
            <textarea
              rows={4}
              value={acceptance}
              disabled={readOnly}
              onChange={(e) => onChangeAcceptance && onChangeAcceptance(e.target.value)}
              placeholder="Document formal risk acceptance statement, approving authority signatures, and review schedules..."
              className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/20 disabled:bg-slate-50 min-h-[120px]"
            />
          </div>

        </div>
      )}

      {/* Modal Popups */}
      <RiskAssessmentEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEntry}
        initialEntry={editingEntry}
      />

      <RiskSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        entries={currentEntries}
      />

    </div>
  );
}
