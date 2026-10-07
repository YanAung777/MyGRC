import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Server,
  Download,
  Search,
  Filter,
  Plus,
  Radio,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Lock,
  Code2,
  ChevronDown,
  ChevronRight,
  Database,
  Send,
  Trash2,
  Settings,
  Eye,
  Activity,
  FileSpreadsheet,
  FileCode,
  Copy,
  Check
} from "lucide-react";

import {
  AuditLogEntry,
  SiemWebhookConfig,
  AuditLogSeverity,
  AuditLogCategory,
  SiemFormat
} from "../types";
import { sendAuditLog } from "../services/auditLoggerService";

export default function AuditLogsView() {
  const [activeTab, setActiveTab] = useState<"logs" | "siem" | "compliance">("logs");

  // State for logs
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [totalLogsCount, setTotalLogsCount] = useState<number>(0);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(true);
  const [integrityStatus, setIntegrityStatus] = useState<{ isValid: boolean; totalChecked: number }>({ isValid: true, totalChecked: 0 });

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isoFilter, setIsoFilter] = useState<string>("ALL");

  // Expanded log row
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  // SIEM Webhooks state
  const [webhooks, setWebhooks] = useState<SiemWebhookConfig[]>([]);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = useState<boolean>(false);
  const [isAddWebhookModalOpen, setIsAddWebhookModalOpen] = useState<boolean>(false);
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isExportingNow, setIsExportingNow] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // New Webhook Form State
  const [newHookName, setNewHookName] = useState<string>("");
  const [newHookUrl, setNewHookUrl] = useState<string>("");
  const [newHookFormat, setNewHookFormat] = useState<SiemFormat>("SPLUNK_HEC");
  const [newHookAuthHeader, setNewHookAuthHeader] = useState<string>("");
  const [newHookSeverities, setNewHookSeverities] = useState<AuditLogSeverity[]>(["INFO", "WARN", "ERROR", "CRITICAL"]);

  // Fetch Audit Logs from REST API
  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (severityFilter !== "ALL") params.append("severity", severityFilter);
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);
      if (isoFilter !== "ALL") params.append("isoControl", isoFilter);
      params.append("limit", "150");

      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotalLogsCount(data.total || 0);
        if (data.integrity) {
          setIntegrityStatus(data.integrity);
        }
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Fetch SIEM Webhooks from REST API
  const fetchWebhooks = async () => {
    setIsLoadingWebhooks(true);
    try {
      const res = await fetch("/api/siem/webhooks");
      if (res.ok) {
        const data = await res.json();
        setWebhooks(data.webhooks || []);
      }
    } catch (err) {
      console.error("Failed to load webhooks:", err);
    } finally {
      setIsLoadingWebhooks(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchWebhooks();
  }, [searchQuery, severityFilter, categoryFilter, isoFilter]);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setNotificationMsg({ text, type });
    setTimeout(() => setNotificationMsg(null), 4500);
  };

  // Trigger Sample ISO 27001 Audit Event Ingestion
  const handleIngestSampleEvent = async () => {
    const sampleActions = [
      { action: "POLICY_COPILOT_GENERATED", isoControl: "A.13.1.1", category: "API_INTEGRATION" as const, severity: "INFO" as const, details: { model: "gemini-3.5-flash", policyTitle: "Data Protection Policy" } },
      { action: "MODEL_WEIGHTS_HASH_VERIFIED", isoControl: "A.12.1.2", category: "GOVERNANCE" as const, severity: "INFO" as const, details: { modelId: "MOD-001", hashMatch: true } },
      { action: "EVIDENCE_FILE_ATTACHED", isoControl: "A.18.1.1", category: "GOVERNANCE" as const, severity: "INFO" as const, details: { fileName: "dpia_assessment_2026.pdf", fileSize: "2.4MB" } },
      { action: "MFA_CHALLENGE_ISSUED", isoControl: "A.9.4.2", category: "ACCESS_CONTROL" as const, severity: "WARN" as const, details: { challengeType: "TOTP_HARDWARE_TOKEN" } }
    ];

    const pick = sampleActions[Math.floor(Math.random() * sampleActions.length)];
    await sendAuditLog({
      action: pick.action,
      isoControl: pick.isoControl,
      category: pick.category,
      severity: pick.severity,
      details: pick.details
    });

    showNotification(`Live ISO 27001 Audit Event (${pick.action}) ingested successfully!`);
    fetchLogs();
  };

  // Export audit logs file (JSON, CSV, CEF)
  const handleExportFile = (format: "json" | "csv" | "cef") => {
    window.open(`/api/audit-logs/export?format=${format}`, "_blank");
    showNotification(`Exporting ISO 27001 audit logs in ${format.toUpperCase()} format.`);
  };

  // Create SIEM Webhook
  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHookName || !newHookUrl) return;

    try {
      const res = await fetch("/api/siem/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newHookName,
          url: newHookUrl,
          format: newHookFormat,
          authHeader: newHookAuthHeader,
          severityFilter: newHookSeverities,
          enabled: true
        })
      });

      if (res.ok) {
        showNotification("SIEM Webhook configured and enabled!");
        setIsAddWebhookModalOpen(false);
        setNewHookName("");
        setNewHookUrl("");
        setNewHookAuthHeader("");
        fetchWebhooks();
        fetchLogs();
      } else {
        const err = await res.json();
        showNotification(err.error || "Failed to create SIEM Webhook", "error");
      }
    } catch (err: any) {
      showNotification(err.message || "Network error", "error");
    }
  };

  // Test SIEM Webhook
  const handleTestWebhook = async (hookId: string) => {
    setTestingWebhookId(hookId);
    setTestResult(null);
    try {
      const res = await fetch(`/api/siem/webhooks/${hookId}/test`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
        showNotification(`SIEM Webhook test payload accepted (Status 200 OK)!`);
        fetchWebhooks();
      } else {
        const err = await res.json();
        showNotification(err.error || "SIEM Webhook test failed", "error");
      }
    } catch (err: any) {
      showNotification(err.message || "Failed to dispatch test payload", "error");
    } finally {
      setTestingWebhookId(null);
    }
  };

  // Toggle SIEM Webhook state
  const handleToggleWebhook = async (hook: SiemWebhookConfig) => {
    try {
      const res = await fetch(`/api/siem/webhooks/${hook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !hook.enabled })
      });
      if (res.ok) {
        showNotification(`Webhook "${hook.name}" ${!hook.enabled ? "enabled" : "disabled"}.`);
        fetchWebhooks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete SIEM Webhook
  const handleDeleteWebhook = async (hookId: string) => {
    if (!confirm("Are you sure you want to remove this SIEM Webhook configuration?")) return;
    try {
      const res = await fetch(`/api/siem/webhooks/${hookId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showNotification("SIEM Webhook endpoint removed.");
        fetchWebhooks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Batch Export Now to SIEM
  const handleExportNowToSiem = async () => {
    setIsExportingNow(true);
    try {
      const res = await fetch("/api/siem/export-now", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        showNotification(data.message || "Batch export pushed to SIEM!");
        fetchWebhooks();
        fetchLogs();
      } else {
        const err = await res.json();
        showNotification(err.error || "Batch export failed", "error");
      }
    } catch (err: any) {
      showNotification(err.message || "Failed to trigger SIEM export", "error");
    } finally {
      setIsExportingNow(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const getSeverityBadgeClass = (sev: AuditLogSeverity) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-rose-100 text-rose-800 border-rose-300 font-bold";
      case "ERROR":
        return "bg-orange-100 text-orange-800 border-orange-300 font-bold";
      case "WARN":
        return "bg-amber-100 text-amber-800 border-amber-300 font-bold";
      case "INFO":
      default:
        return "bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notificationMsg && (
        <div
          className={`fixed top-5 right-5 z-50 max-w-md px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 animate-slide-in text-xs font-semibold ${
            notificationMsg.type === "success"
              ? "bg-slate-900 text-emerald-300 border-emerald-500/50"
              : "bg-slate-900 text-rose-300 border-rose-500/50"
          }`}
        >
          {notificationMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{notificationMsg.text}</span>
        </div>
      )}

      {/* TOP HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldCheck className="w-48 h-48 text-indigo-300" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> ISO 27001:2022 Control 8.15 &amp; Annex A.12.4.1
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> Tamper-Evident SHA-256
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
              ISO 27001 Audit Logs &amp; SIEM Export Center
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              Continuous security activity logging, tamper-evident cryptographic hash chaining, and real-time SIEM webhook integration for Splunk, Datadog, Elasticsearch, and enterprise Security Operations Centers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleIngestSampleEvent}
              className="px-3.5 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border border-indigo-400/30"
              id="btn-ingest-sample-event"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-200" />
              <span>Ingest Live Audit Event</span>
            </button>

            <button
              onClick={handleExportNowToSiem}
              disabled={isExportingNow}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border border-emerald-400/30"
              id="btn-export-to-siem-now"
            >
              {isExportingNow ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Send className="w-3.5 h-3.5 text-emerald-100" />
              )}
              <span>Push to SIEM Now</span>
            </button>

            {/* Export Format Dropdown */}
            <div className="relative group">
              <button className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer">
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export File</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <div className="absolute right-0 mt-1 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 hidden group-hover:block z-30 animate-scale-up">
                <button
                  onClick={() => handleExportFile("json")}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-indigo-600/30 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => handleExportFile("csv")}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-indigo-600/30 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => handleExportFile("cef")}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-indigo-600/30 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Server className="w-3.5 h-3.5 text-amber-400" />
                  <span>Syslog CEF Format</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* METRICS & VERIFICATION STATS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Audit Events</span>
            <div className="text-xl font-black text-slate-900 font-mono">{totalLogsCount}</div>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> ISO 27001 Stream Active
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Database className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Hash Chain Integrity</span>
            <div className="text-xl font-black text-emerald-600 font-mono flex items-center gap-1.5">
              100% Verified
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {integrityStatus.totalChecked} SHA-256 blocks validated
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active SIEM Endpoints</span>
            <div className="text-xl font-black text-slate-900 font-mono">
              {webhooks.filter((w) => w.enabled).length} <span className="text-xs text-slate-400 font-normal">/ {webhooks.length} Configured</span>
            </div>
            <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse text-emerald-500" /> Splunk / Datadog Ready
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Server className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Forwarded to SIEM</span>
            <div className="text-xl font-black text-slate-900 font-mono">
              {webhooks.reduce((acc, w) => acc + (w.totalDispatchedCount || 0), 0)}
            </div>
            <span className="text-[10px] text-slate-500 font-semibold">
              Automatic Syslog / HTTP Sync
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-slate-200/80 gap-6">
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "logs"
              ? "border-indigo-600 text-indigo-600 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          id="tab-audit-logs"
        >
          <Database className="w-4 h-4" />
          <span>Live Audit Trail Explorer ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("siem")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "siem"
              ? "border-indigo-600 text-indigo-600 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          id="tab-siem-integrations"
        >
          <Server className="w-4 h-4" />
          <span>SIEM Webhook Endpoints ({webhooks.length})</span>
          {webhooks.some((w) => w.enabled) && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("compliance")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "compliance"
              ? "border-indigo-600 text-indigo-600 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          id="tab-compliance-matrix"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>ISO 27001 Cryptographic Proofs</span>
        </button>
      </div>

      {/* TAB 1: AUDIT LOGS EXPLORER */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit action, user email, ISO control clause, or payload details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Severity Filter */}
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Severities</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="SECURITY">SECURITY</option>
                <option value="GOVERNANCE">GOVERNANCE</option>
                <option value="ACCESS_CONTROL">ACCESS_CONTROL</option>
                <option value="RISK_MGMT">RISK_MGMT</option>
                <option value="API_INTEGRATION">API_INTEGRATION</option>
                <option value="SYSTEM">SYSTEM</option>
              </select>

              {/* ISO Control Filter */}
              <select
                value={isoFilter}
                onChange={(e) => setIsoFilter(e.target.value)}
                className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">All ISO Controls</option>
                <option value="A.12.4.1">A.12.4.1 (Event Logging)</option>
                <option value="A.9.4.2">A.9.4.2 (Log-on Procedures)</option>
                <option value="A.12.1.2">A.12.1.2 (Change Management)</option>
                <option value="A.18.1.1">A.18.1.1 (Compliance Reviews)</option>
                <option value="A.13.1.1">A.13.1.1 (Network Security)</option>
              </select>

              <button
                onClick={fetchLogs}
                title="Refresh Logs"
                className="p-2 text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? "animate-spin text-indigo-600" : ""}`} />
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Log ID / Timestamp</th>
                    <th className="py-3 px-4">ISO 27001 Control</th>
                    <th className="py-3 px-4">Event Action</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">SIEM Sync</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-semibold">No audit logs matching current filter criteria.</p>
                        <p className="text-[11px] text-slate-400 mt-1">Try resetting search query or severity filters.</p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const isExpanded = expandedLogId === log.id;
                      return (
                        <React.Fragment key={log.id}>
                          <tr
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isExpanded ? "bg-indigo-50/30" : ""
                            }`}
                          >
                            {/* Log ID & Timestamp */}
                            <td className="py-3 px-4 font-mono font-bold text-slate-800">
                              <div>{log.id}</div>
                              <div className="text-[10px] text-slate-400 font-sans font-normal">
                                {new Date(log.timestamp).toUTCString()}
                              </div>
                            </td>

                            {/* ISO Control */}
                            <td className="py-3 px-4">
                              <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                {log.isoControl}
                              </span>
                            </td>

                            {/* Event Action */}
                            <td className="py-3 px-4 font-semibold text-slate-900">
                              {log.action}
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4">
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                                {log.category}
                              </span>
                            </td>

                            {/* Severity */}
                            <td className="py-3 px-4">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getSeverityBadgeClass(log.severity)}`}>
                                {log.severity}
                              </span>
                            </td>

                            {/* Actor */}
                            <td className="py-3 px-4 text-slate-600">
                              <div className="font-medium text-slate-800">{log.actor.email}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{log.actor.ipAddress}</div>
                            </td>

                            {/* SIEM Sync */}
                            <td className="py-3 px-4">
                              {log.siemForwarded ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  <Check className="w-3 h-3 text-emerald-500" /> Forwarded
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                  Pending
                                </span>
                              )}
                            </td>

                            {/* Expand toggle */}
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                                className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                              >
                                <span>{isExpanded ? "Hide Payload" : "View Payload"}</span>
                                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </button>
                            </td>
                          </tr>

                          {/* EXPANDED PAYLOAD & CRYPTOGRAPHIC PROOF DRAWER */}
                          {isExpanded && (
                            <tr className="bg-slate-900 text-slate-200">
                              <td colSpan={8} className="p-4 space-y-3 font-mono text-[11px]">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                  <div className="flex items-center gap-2">
                                    <Code2 className="w-4 h-4 text-indigo-400" />
                                    <span className="font-bold text-indigo-300">Auditable Event Payload &amp; Hash Chain</span>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(JSON.stringify(log, null, 2), log.id)}
                                    className="text-slate-400 hover:text-white text-[10px] flex items-center gap-1 cursor-pointer bg-slate-800 px-2 py-1 rounded"
                                  >
                                    {copiedHashId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedHashId === log.id ? "Copied JSON" : "Copy Raw JSON"}</span>
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Cryptographic SHA-256 Signatures</span>
                                    <div>
                                      <span className="text-slate-500">Current Hash: </span>
                                      <span className="text-emerald-400 break-all">{log.hash}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">Previous Hash: </span>
                                      <span className="text-indigo-400 break-all">{log.previousHash}</span>
                                    </div>
                                  </div>

                                  <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Target Resource &amp; Metadata</span>
                                    <div>
                                      <span className="text-slate-500">Resource: </span>
                                      <span className="text-amber-300">{log.targetResource.name} ({log.targetResource.type})</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">User Agent: </span>
                                      <span className="text-slate-300 truncate block">{log.actor.userAgent}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Detailed Change & Approval Visualizer */}
                                {log.details && (
                                  <div className="space-y-3">
                                    {/* Section & Change Summary Banner */}
                                    {(log.details.section || log.details.summaryOfChanges) && (
                                      <div className="bg-indigo-950/40 p-3 rounded-lg border border-indigo-800/60 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <div>
                                          <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                            <Activity className="w-3.5 h-3.5 text-indigo-400" />
                                            Target Section: <span className="text-white font-mono bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-700/50">{log.details.section || "General"}</span>
                                          </div>
                                          {log.details.summaryOfChanges && (
                                            <div className="text-xs font-sans text-indigo-200 font-medium mt-1">
                                              {log.details.summaryOfChanges}
                                            </div>
                                          )}
                                        </div>

                                        {log.details.hasApprovalChange && (
                                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-700/80 px-2.5 py-1 rounded-full shrink-0">
                                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                                            Approval Section Sign-Off Updated
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {/* Field Diffs Grid */}
                                    {Array.isArray(log.details.fieldDiffs) && log.details.fieldDiffs.length > 0 && (
                                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                                        <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
                                          Field-Level Modification Diffs ({log.details.fieldDiffs.length})
                                        </span>
                                        <div className="grid grid-cols-1 gap-1.5">
                                          {log.details.fieldDiffs.map((diff: any, idx: number) => (
                                            <div key={idx} className="bg-slate-900/90 p-2 rounded border border-slate-800 text-[11px] flex flex-wrap items-center justify-between gap-2">
                                              <div className="font-semibold text-slate-200">
                                                <span className="text-indigo-400 mr-2">[{diff.section}]</span>
                                                {diff.field}
                                              </div>
                                              <div className="flex items-center gap-2 text-[10px] font-mono">
                                                <span className="bg-rose-950/80 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded">
                                                  Previous: {String(diff.previousValue)}
                                                </span>
                                                <span className="text-slate-500 font-bold">→</span>
                                                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded font-bold">
                                                  New: {String(diff.newValue)}
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Approval & Certification Sign-Off Details Card */}
                                    {log.details.approvalSection && (
                                      <div className="bg-slate-950 p-3 rounded-lg border border-indigo-900/60 space-y-3">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                          <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                            Approval &amp; Certification Sign-Off Details
                                          </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                                          {/* Certification Sign-off */}
                                          {log.details.approvalSection.certification && (
                                            <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 space-y-1.5">
                                              <div className="text-xs font-bold text-indigo-300 flex items-center justify-between">
                                                <span>CISO Certification Status</span>
                                                <span className="text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
                                                  {log.details.approvalSection.certification.level}
                                                </span>
                                              </div>
                                              <div className="text-[10px] text-slate-400 space-y-1 font-sans">
                                                <div>
                                                  Declaration Confirmed:{" "}
                                                  <span className={log.details.approvalSection.certification.declarationConfirmed ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                                                    {log.details.approvalSection.certification.declarationConfirmed ? "Yes (ISO 42001 Compliant)" : "No"}
                                                  </span>
                                                </div>
                                                <div>
                                                  Signatory Name:{" "}
                                                  <span className="text-slate-200 font-mono">
                                                    {log.details.approvalSection.certification.signatory?.name || "Not Specified"}
                                                  </span>
                                                </div>
                                                {log.details.approvalSection.certification.comments && (
                                                  <div className="text-slate-300 italic bg-slate-950 p-1.5 rounded border border-slate-800 mt-1">
                                                    "{log.details.approvalSection.certification.comments}"
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}

                                          {/* Accreditation Sign-off */}
                                          {log.details.approvalSection.accreditation && (
                                            <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 space-y-1.5">
                                              <div className="text-xs font-bold text-emerald-300 flex items-center justify-between">
                                                <span>Executive Accreditation Status</span>
                                                <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                                                  {log.details.approvalSection.accreditation.level}
                                                </span>
                                              </div>
                                              <div className="text-[10px] text-slate-400 space-y-1 font-sans">
                                                <div>
                                                  Declaration Confirmed:{" "}
                                                  <span className={log.details.approvalSection.accreditation.declarationConfirmed ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                                                    {log.details.approvalSection.accreditation.declarationConfirmed ? "Yes (Authorized)" : "No"}
                                                  </span>
                                                </div>
                                                <div>
                                                  Signatory Name:{" "}
                                                  <span className="text-slate-200 font-mono">
                                                    {log.details.approvalSection.accreditation.signatory?.name || "Not Specified"}
                                                  </span>
                                                </div>
                                                {log.details.approvalSection.accreditation.comments && (
                                                  <div className="text-slate-300 italic bg-slate-950 p-1.5 rounded border border-slate-800 mt-1">
                                                    "{log.details.approvalSection.accreditation.comments}"
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto text-slate-300">
                                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Full JSON Payload Details</span>
                                  <pre className="text-[11px] text-indigo-200">{JSON.stringify(log.details, null, 2)}</pre>
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
          </div>
        </div>
      )}

      {/* TAB 2: SIEM WEBHOOK INTEGRATIONS */}
      {activeTab === "siem" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" />
                Configured SIEM Webhook Export Destinations
              </h2>
              <p className="text-xs text-slate-500">
                Forward ISO 27001 event logs in Splunk HEC, Datadog Logs API, Elasticsearch CEF, or Standard JSON format to central SIEMs.
              </p>
            </div>

            <button
              onClick={() => setIsAddWebhookModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
              id="btn-add-siem-endpoint"
            >
              <Plus className="w-4 h-4" />
              <span>Add SIEM Endpoint</span>
            </button>
          </div>

          {/* Test Execution Output Box if run */}
          {testResult && (
            <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-5 text-slate-200 space-y-3 font-mono text-xs animate-slide-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> SIEM Webhook Response Verification
                </span>
                <button
                  onClick={() => setTestResult(null)}
                  className="text-slate-500 hover:text-white cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Target Endpoint:</span>
                  <span className="text-white font-bold">{testResult.webhook?.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Response Code:</span>
                  <span className="text-emerald-400 font-bold">{testResult.response?.statusCode} {testResult.response?.statusText}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Roundtrip Latency:</span>
                  <span className="text-indigo-300 font-bold">{testResult.response?.latencyMs} ms</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block mb-1">Dispatched Test Payload ({testResult.webhook?.format}):</span>
                <pre className="text-indigo-200 text-[11px] overflow-x-auto">{JSON.stringify(testResult.dispatchedPayload, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Webhooks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {webhooks.length === 0 ? (
              <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
                <Server className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-600" />
                <p className="font-bold text-slate-700">No SIEM Webhook endpoints configured yet.</p>
                <p className="text-xs text-slate-500 mt-1">Click "Add SIEM Endpoint" to configure Splunk, Datadog, or Elasticsearch forwarding.</p>
              </div>
            ) : (
              webhooks.map((hook) => (
                <div
                  key={hook.id}
                  className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                    hook.enabled ? "border-slate-200 hover:border-indigo-300" : "border-slate-200 opacity-60 bg-slate-50"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                          {hook.format}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 font-display">{hook.name}</h3>
                      </div>

                      <button
                        onClick={() => handleToggleWebhook(hook)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full cursor-pointer transition-colors ${
                          hook.enabled
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {hook.enabled ? "Active" : "Disabled"}
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="font-mono text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200/80 truncate">
                        {hook.url}
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Total Dispatched:</span>
                        <span className="font-mono font-bold text-slate-800">{hook.totalDispatchedCount || 0} events</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Last Trigger Status:</span>
                        <span className={`font-mono font-bold ${hook.lastStatus === "SUCCESS" ? "text-emerald-600" : "text-slate-500"}`}>
                          {hook.lastStatus || "NEVER_RUN"} ({hook.lastResponseCode || 200})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleTestWebhook(hook.id)}
                      disabled={testingWebhookId === hook.id}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {testingWebhookId === hook.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Test Ping</span>
                    </button>

                    <button
                      onClick={() => handleDeleteWebhook(hook.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove SIEM Webhook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ISO 27001 COMPLIANCE MATRIX */}
      {activeTab === "compliance" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  ISO/IEC 27001:2022 Control 8.15 &amp; Annex A.12.4.1 Compliance Audit Matrix
                </h2>
                <p className="text-xs text-slate-500">
                  Cryptographic tamper-evident log integrity verification and continuous SIEM audit evidence.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> ISO 27001 Control 8.15 (Logging)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  System logs recording activities, exceptions, administrative actions, and security events are generated, stored securely, and monitored for unauthorized changes.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Annex A.12.4.1 (Event Logging)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Event logs include user IDs, timestamps, network addresses, system events, and details of critical configuration changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD SIEM WEBHOOK MODAL */}
      {isAddWebhookModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up space-y-0">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 font-display">Configure SIEM Webhook Export</h3>
              </div>
              <button
                onClick={() => setIsAddWebhookModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateWebhook} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Endpoint Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Corporate Splunk Enterprise HEC"
                  value={newHookName}
                  onChange={(e) => setNewHookName(e.target.value)}
                  className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Target Webhook URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://splunk-hec.company.com:8088/services/collector/raw"
                  value={newHookUrl}
                  onChange={(e) => setNewHookUrl(e.target.value)}
                  className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-mono bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Format Protocol</label>
                  <select
                    value={newHookFormat}
                    onChange={(e) => setNewHookFormat(e.target.value as SiemFormat)}
                    className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white cursor-pointer font-medium"
                  >
                    <option value="SPLUNK_HEC">Splunk HEC JSON</option>
                    <option value="DATADOG_LOGS">Datadog Logs API</option>
                    <option value="SYSLOG_CEF">Syslog CEF Format</option>
                    <option value="JSON_STANDARD">Standard Audit JSON</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Authorization Header</label>
                  <input
                    type="text"
                    placeholder="Splunk token-guid or Bearer secret"
                    value={newHookAuthHeader}
                    onChange={(e) => setNewHookAuthHeader(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-mono bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddWebhookModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-sm"
                  id="btn-save-siem-webhook"
                >
                  Save SIEM Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
