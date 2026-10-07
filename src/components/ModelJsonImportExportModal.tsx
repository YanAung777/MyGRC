import React, { useState, useMemo } from "react";
import {
  X,
  Upload,
  Download,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Database,
  RefreshCw,
  Sliders,
  Filter
} from "lucide-react";
import { ModelRecord } from "../types";
import { INITIAL_MARKET_MODELS, convertMarketModelToRecord } from "../data/marketModelsData";

interface ModelJsonImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: ModelRecord[];
  onImportModels: (importedModels: ModelRecord[], mode: "merge" | "overwrite" | "append") => void;
  workspaceId?: string;
}

export default function ModelJsonImportExportModal({
  isOpen,
  onClose,
  models,
  onImportModels,
  workspaceId = "ws-1",
}: ModelJsonImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");

  // Import State
  const [importJsonText, setImportJsonText] = useState("");
  const [importMode, setImportMode] = useState<"merge" | "overwrite" | "append">("merge");
  const [fileName, setFileName] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Export State
  const [exportFilter, setExportFilter] = useState<"ALL" | "Approved" | "Restricted" | "Pending">("ALL");
  const [exportFormat, setExportFormat] = useState<"full_grc" | "gateway_whitelist">("full_grc");

  // Parse and validate imported JSON
  const parsedImportData = useMemo(() => {
    setImportError(null);
    if (!importJsonText.trim()) return null;

    try {
      const parsed = JSON.parse(importJsonText);
      let list: any[] = [];
      if (Array.isArray(parsed)) {
        list = parsed;
      } else if (parsed && Array.isArray(parsed.models)) {
        list = parsed.models;
      } else if (parsed && typeof parsed === "object") {
        list = [parsed];
      }

      if (list.length === 0) {
        setImportError("No model objects found in the provided JSON.");
        return null;
      }

      // Validate & normalize each item into ModelRecord
      const validRecords: ModelRecord[] = [];
      const invalidIndices: number[] = [];

      list.forEach((item, idx) => {
        if (!item.name || !item.provider) {
          invalidIndices.push(idx + 1);
          return;
        }

        const validStatus: ModelRecord["status"] =
          item.status === "Approved" || item.status === "Restricted" || item.status === "Blocked"
            ? item.status
            : "Pending";

        validRecords.push({
          id: item.id || `mod-import-${Date.now()}-${idx}`,
          workspaceId: item.workspaceId || workspaceId,
          provider: String(item.provider),
          name: String(item.name),
          version: String(item.version || "1.0"),
          status: validStatus,
          approver: String(item.approver || "Security Architect"),
          statusDate: String(
            item.statusDate ||
              new Date()
                .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
                .replace(/\//g, "-")
          ),
          useCasesCount: Number(item.useCasesCount) || 0,
          securityScore: item.securityScore !== undefined ? Number(item.securityScore) : undefined,
          zeroDataRetention: item.zeroDataRetention !== undefined ? Boolean(item.zeroDataRetention) : undefined,
          trainingOptOut: item.trainingOptOut !== undefined ? Boolean(item.trainingOptOut) : undefined,
          soc2Certified: item.soc2Certified !== undefined ? Boolean(item.soc2Certified) : undefined,
          iso27001Certified: item.iso27001Certified !== undefined ? Boolean(item.iso27001Certified) : undefined,
          hipaaCompliant: item.hipaaCompliant !== undefined ? Boolean(item.hipaaCompliant) : undefined,
          euAiActTier: item.euAiActTier,
          dataResidency: item.dataResidency,
          assessmentDate: item.assessmentDate,
          recommendedStatus: item.recommendedStatus,
          riskLevel: item.riskLevel,
          notes: item.notes,
          sourceUrl: item.sourceUrl,
          scannerFeed: item.scannerFeed || "JSON Import",
        });
      });

      return {
        totalParsed: list.length,
        validRecords,
        invalidCount: invalidIndices.length,
        invalidIndices,
      };
    } catch (err: any) {
      setImportError(`Invalid JSON Syntax: ${err.message}`);
      return null;
    }
  }, [importJsonText, workspaceId]);

  // Handle file drop / upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportJsonText(text);
    };
    reader.readAsText(file);
  };

  // Sample templates loader
  const handleLoadSampleTemplate = (type: "full_market" | "whitelist") => {
    if (type === "full_market") {
      const sample = INITIAL_MARKET_MODELS.map((m) => convertMarketModelToRecord(m, workspaceId));
      const payload = {
        metadata: {
          feedName: "Weekly GRC Market LLM Assessment Feed",
          assessmentCycle: "2026-W41",
          generatedAt: new Date().toISOString(),
          complianceStandard: "ISO 42001 & NIST AI RMF",
          cisoApproved: true,
        },
        models: sample,
      };
      setImportJsonText(JSON.stringify(payload, null, 2));
      setFileName("weekly_market_assessment_feed.json");
    } else {
      const whitelistSample = INITIAL_MARKET_MODELS.filter((m) => m.recommendedStatus === "Approved").map((m) => ({
        provider: m.provider,
        name: m.name,
        version: m.version,
        status: "Approved",
        approver: "Lead Security Architect",
        securityScore: m.securityScore,
        zeroDataRetention: m.zeroDataRetention,
        soc2Certified: m.soc2Certified,
        dataResidency: m.dataResidency,
      }));
      setImportJsonText(JSON.stringify(whitelistSample, null, 2));
      setFileName("approved_llm_whitelist.json");
    }
  };

  // Execute import
  const handleExecuteImport = () => {
    if (!parsedImportData || parsedImportData.validRecords.length === 0) return;
    onImportModels(parsedImportData.validRecords, importMode);
    onClose();
  };

  // Prepare Export Payload
  const exportPayload = useMemo(() => {
    let filtered = models;
    if (exportFilter !== "ALL") {
      filtered = models.filter((m) => m.status === exportFilter);
    }

    if (exportFormat === "gateway_whitelist") {
      return {
        gatewayConfig: {
          policy: "ENFORCE_APPROVED_ONLY",
          updatedAt: new Date().toISOString(),
          complianceRule: "ISO 42001 / SOC 2 Type II",
          allowedModelsCount: filtered.filter((m) => m.status === "Approved").length,
        },
        allowedModels: filtered
          .filter((m) => m.status === "Approved")
          .map((m) => ({
            provider: m.provider,
            model: m.name,
            version: m.version,
            zeroDataRetention: m.zeroDataRetention ?? true,
            securityScore: m.securityScore ?? 90,
            approvedBy: m.approver,
            approvalDate: m.statusDate,
          })),
      };
    }

    return {
      metadata: {
        exportedAt: new Date().toISOString(),
        workspaceId,
        totalModels: filtered.length,
        schemaVersion: "2.4.0",
        governanceStandard: "ISO 42001 / NIST AI RMF / EU AI Act",
      },
      models: filtered,
    };
  }, [models, exportFilter, exportFormat, workspaceId]);

  const exportJsonString = useMemo(() => {
    return JSON.stringify(exportPayload, null, 2);
  }, [exportPayload]);

  const handleCopyExportJson = () => {
    navigator.clipboard.writeText(exportJsonString);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handleDownloadExportJson = () => {
    const blob = new Blob([exportJsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      exportFormat === "gateway_whitelist"
        ? `approved-llm-whitelist-${new Date().toISOString().split("T")[0]}.json`
        : `grc-model-inventory-${exportFilter.toLowerCase()}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-xs">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Model Registry — JSON Import & Export Hub
              </h3>
              <p className="text-xs text-slate-500">
                Continuous GRC integration for market LLM assessments, automated scanner feeds & gateway whitelists.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-white gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("import")}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "import"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Import Models (JSON Feed)</span>
            {parsedImportData && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold">
                {parsedImportData.validRecords.length} Ready
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("export")}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "export"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Registry & Whitelist</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold">
              {models.length} Records
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === "import" ? (
            <div className="space-y-5">
              {/* Preset template loaders */}
              <div className="bg-indigo-50/50 border border-indigo-150 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-indigo-900">
                      Need pre-formatted sample feeds?
                    </span>
                    <p className="text-[11px] text-indigo-700/80">
                      Load certified market assessments or an enterprise approved whitelist template.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleLoadSampleTemplate("full_market")}
                    className="px-3 py-1.5 text-[11px] font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Load Market Feed (12 Models)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSampleTemplate("whitelist")}
                    className="px-3 py-1.5 text-[11px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Load Approved Whitelist
                  </button>
                </div>
              </div>

              {/* Drag and drop or paste */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    1. Upload JSON File
                  </label>
                  <label className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors h-36">
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-700">
                      {fileName ? fileName : "Click to browse or drop .json here"}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Accepts standard GRC schema or array of models
                    </span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Import Strategy Options */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    2. Ingestion Strategy & Conflict Resolution
                  </label>
                  <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-white h-36 flex flex-col justify-center">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        value="merge"
                        checked={importMode === "merge"}
                        onChange={() => setImportMode("merge")}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">Merge & Update (Recommended)</div>
                        <div className="text-[10px] text-slate-500">
                          Updates existing model attributes by provider/name match; appends new models.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        value="append"
                        checked={importMode === "append"}
                        onChange={() => setImportMode("append")}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">Append Only</div>
                        <div className="text-[10px] text-slate-500">
                          Adds all imported items as new registered models without overwriting.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        value="overwrite"
                        checked={importMode === "overwrite"}
                        onChange={() => setImportMode("overwrite")}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-rose-700">Overwrite All in Workspace</div>
                        <div className="text-[10px] text-slate-500">
                          Clears current registry models in workspace and replaces with imported list.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* JSON Textarea Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Or Paste / Edit Raw JSON Payload</span>
                  </label>

                  {importJsonText && (
                    <button
                      type="button"
                      onClick={() => {
                        setImportJsonText("");
                        setFileName(null);
                      }}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      Clear Content
                    </button>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    rows={7}
                    placeholder={`{\n  "models": [\n    {\n      "provider": "Anthropic",\n      "name": "Claude 3.5 Sonnet",\n      "version": "20241022",\n      "status": "Approved",\n      "securityScore": 96,\n      "zeroDataRetention": true,\n      "soc2Certified": true,\n      "dataResidency": "US, EU"\n    }\n  ]\n}`}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    className="w-full text-xs font-mono text-slate-800 bg-slate-900 text-slate-100 p-3.5 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Validation Status Banner */}
              {importError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {parsedImportData && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-800 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold">
                        Schema Validated: {parsedImportData.validRecords.length} models ready to import.
                      </span>
                    </div>
                    {parsedImportData.invalidCount > 0 && (
                      <span className="text-[11px] text-amber-700 font-semibold">
                        ({parsedImportData.invalidCount} malformed entries skipped)
                      </span>
                    )}
                  </div>

                  {/* Preview Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-[11px] font-bold text-slate-600 flex items-center justify-between">
                      <span>Preview of Parsed Models ({parsedImportData.validRecords.length})</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        Mode: {importMode.toUpperCase()}
                      </span>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                          <tr>
                            <th className="p-2.5 pl-4">Provider</th>
                            <th className="p-2.5">Model</th>
                            <th className="p-2.5">Version</th>
                            <th className="p-2.5">Status</th>
                            <th className="p-2.5">Security Score</th>
                            <th className="p-2.5 pr-4">Zero Retention</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {parsedImportData.validRecords.map((m, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-2.5 pl-4 font-medium text-slate-600">{m.provider}</td>
                              <td className="p-2.5 font-bold text-slate-800">{m.name}</td>
                              <td className="p-2.5 font-mono text-[11px] text-slate-500">{m.version}</td>
                              <td className="p-2.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    m.status === "Approved"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : m.status === "Restricted"
                                      ? "bg-amber-100 text-amber-700"
                                      : m.status === "Blocked"
                                      ? "bg-rose-100 text-rose-700"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {m.status}
                                </span>
                              </td>
                              <td className="p-2.5 font-bold text-indigo-700">
                                {m.securityScore !== undefined ? `${m.securityScore}/100` : "—"}
                              </td>
                              <td className="p-2.5 pr-4">
                                {m.zeroDataRetention ? (
                                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                                    ZDR Verified
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">Standard</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* EXPORT TAB */
            <div className="space-y-5">
              {/* Filter and Format Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 border border-slate-200 p-4 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Filter by Status</span>
                  </label>
                  <select
                    value={exportFilter}
                    onChange={(e) => setExportFilter(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">All Models ({models.length})</option>
                    <option value="Approved">
                      Approved Whitelist Only ({models.filter((m) => m.status === "Approved").length})
                    </option>
                    <option value="Restricted">
                      Restricted Models ({models.filter((m) => m.status === "Restricted").length})
                    </option>
                    <option value="Pending">
                      Pending Review ({models.filter((m) => m.status === "Pending").length})
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Output Schema Structure</span>
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                  >
                    <option value="full_grc">Full GRC Registry Schema (ISO 42001 & NIST AI RMF)</option>
                    <option value="gateway_whitelist">
                      Gateway Enforcement Whitelist (LiteLLM / Portkey Proxy JSON)
                    </option>
                  </select>
                </div>
              </div>

              {/* JSON Code Preview block */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Generated JSON Payload Preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyExportJson}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadExportJson}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .json</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <pre className="max-h-80 overflow-y-auto text-xs font-mono text-emerald-400 bg-slate-900 p-4 rounded-xl border border-slate-700">
                    {exportJsonString}
                  </pre>
                </div>
              </div>

              {/* Integration snippet hint */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>How to use this export in production:</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Feed this JSON file into internal LLM gateways (such as LiteLLM proxy, Portkey, or AWS API Gateway Authorizer) to automatically restrict engineering teams from querying unapproved models.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {activeTab === "import" ? (
              parsedImportData ? (
                <span className="text-emerald-700 font-semibold">
                  Ready to ingest {parsedImportData.validRecords.length} models into {workspaceId}.
                </span>
              ) : (
                "Paste or upload JSON above to validate and import."
              )
            ) : (
              <span>
                Exporting {exportFilter === "ALL" ? models.length : models.filter((m) => m.status === exportFilter).length} models in {exportFormat} format.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>

            {activeTab === "import" && (
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={!parsedImportData || parsedImportData.validRecords.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <span>Import {parsedImportData?.validRecords.length || 0} Models</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {activeTab === "export" && (
              <button
                type="button"
                onClick={handleDownloadExportJson}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download JSON File</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
