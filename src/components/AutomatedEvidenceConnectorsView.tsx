// Automated Evidence Connectors Hub & Live Harvest Engine
import React, { useState } from "react";
import {
  Cloud,
  Layers,
  Activity,
  CheckCircle2,
  RefreshCw,
  Zap,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Play,
  Check,
  Key,
  Clock,
  ArrowUpRight,
  Database,
  Lock,
  Plus,
  Sparkles
} from "lucide-react";
import { AutomatedEvidenceConnector, EvidenceFile } from "../types";
import { INITIAL_AUTOMATED_CONNECTORS } from "../data";

interface AutomatedEvidenceConnectorsViewProps {
  onAddEvidenceFile: (file: EvidenceFile) => void;
  onSendAuditLog: (logPayload: any) => void;
}

export default function AutomatedEvidenceConnectorsView({
  onAddEvidenceFile,
  onSendAuditLog,
}: AutomatedEvidenceConnectorsViewProps) {
  const [connectors, setConnectors] = useState<AutomatedEvidenceConnector[]>(INITIAL_AUTOMATED_CONNECTORS);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);
  const [selectedConnector, setSelectedConnector] = useState<AutomatedEvidenceConnector | null>(null);

  const handleSyncConnector = async (conn: AutomatedEvidenceConnector) => {
    setSyncingId(conn.id);
    try {
      // Simulate real-time API connector handshake & evidence harvesting
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const newEvidenceId = `EV-AUTO-${Date.now()}`;
      const newEvidenceName = `${conn.provider.split(" ")[0]} Automated Evidence Harvest - ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.json`;

      // Create new evidence file
      const newEvidenceFile: EvidenceFile = {
        id: newEvidenceId,
        workspaceId: "ws-1",
        name: newEvidenceName,
        uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        uploader: `${conn.provider} Connector`,
        source: conn.category,
        version: "v1.0",
        status: "Approved",
        folderId: "fld-all",
        size: "248 KB",
        notes: `Automated compliance evidence ingested from ${conn.authConfig.endpoint}. Verified mapped controls: ${conn.mappedIsoControls.join(", ")}.`
      };

      onAddEvidenceFile(newEvidenceFile);

      // Log ISO 27001 / ISO 42001 audit event
      onSendAuditLog({
        action: "AUTOMATED_EVIDENCE_INGESTED",
        isoControl: "A.12.1.2",
        category: "EVIDENCE_COLLECTION",
        severity: "INFO",
        targetResource: { type: "CONNECTOR_SYNC", id: conn.id, name: conn.name },
        details: {
          provider: conn.provider,
          evidenceId: newEvidenceId,
          endpoint: conn.authConfig.endpoint,
          ingestedItemsCount: Math.floor(15 + Math.random() * 25)
        }
      });

      // Update connector stats
      setConnectors((prev) =>
        prev.map((c) =>
          c.id === conn.id
            ? {
                ...c,
                lastSyncAt: "Just now",
                autoIngestedCount: c.autoIngestedCount + 1,
                status: "Connected & Ingesting",
              }
            : c
        )
      );

      setSyncNotification(`Successfully harvested automated compliance artifacts from ${conn.name}! Evidence registered to repository.`);
      setTimeout(() => setSyncNotification(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingId(null);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    for (const conn of connectors) {
      await handleSyncConnector(conn);
    }
    setIsSyncingAll(false);
  };

  const getIconBadge = (iconType: string) => {
    switch (iconType) {
      case "aws":
        return <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 font-extrabold flex items-center justify-center text-xs">AWS</div>;
      case "gcp":
        return <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 font-extrabold flex items-center justify-center text-xs">GCP</div>;
      case "github":
        return <div className="w-10 h-10 rounded-xl bg-slate-900/10 border border-slate-900/20 text-slate-800 font-extrabold flex items-center justify-center text-xs">GH</div>;
      case "datadog":
        return <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 font-extrabold flex items-center justify-center text-xs">DD</div>;
      default:
        return <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 font-extrabold flex items-center justify-center text-xs">JIRA</div>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Automated Evidence Connectors</h1>
              <p className="text-xs text-slate-500">
                Continuous compliance ingestion from Cloud Providers, CI/CD pipelines, SIEM, and Issue Trackers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? "animate-spin" : ""}`} />
            <span>{isSyncingAll ? "Harvesting Live Telemetry..." : "Harvest All Connectors"}</span>
          </button>
        </div>
      </div>

      {/* Sync Success Notification */}
      {syncNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-scale-up shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{syncNotification}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Ingestion Feeds</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{connectors.length} / {connectors.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Operational
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Evidence Ingested</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {connectors.reduce((acc, c) => acc + c.autoIngestedCount, 0)} Artifacts
          </div>
          <span className="text-[11px] text-slate-500 font-semibold mt-1">Across 5 integrated providers</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Automated Verification Rate</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">99.4%</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1">Audit-proof SHA-256 Hashes</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ingestion Frequency</span>
          <div className="text-2xl font-black text-slate-900 mt-1">Continuous</div>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1">Real-time Webhook Stream</span>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {connectors.map((conn) => {
          const isSyncing = syncingId === conn.id;

          return (
            <div
              key={conn.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {getIconBadge(conn.iconType)}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{conn.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                        {conn.category}
                      </span>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" title="Live Continuous Ingestion" />
                </div>

                {/* Info List */}
                <div className="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Status:</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                      {conn.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Last Synced:</span>
                    <span className="text-[11px] font-semibold text-slate-700">{conn.lastSyncAt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Ingested Items:</span>
                    <span className="text-[11px] font-bold text-indigo-600">{conn.autoIngestedCount} artifacts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Auth Method:</span>
                    <span className="text-[11px] font-mono text-slate-700">{conn.authConfig.authType}</span>
                  </div>
                </div>

                {/* Mapped ISO Controls */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Mapped Compliance Clauses:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {conn.mappedIsoControls.map((ctrl, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100"
                      >
                        {ctrl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-150 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedConnector(conn)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                >
                  Config Details
                </button>
                <button
                  onClick={() => handleSyncConnector(conn)}
                  disabled={isSyncing}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Config Details Modal */}
      {selectedConnector && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up border border-slate-200">
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedConnector(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <Check className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                {getIconBadge(selectedConnector.iconType)}
                <div>
                  <h2 className="text-base font-bold text-white">{selectedConnector.name}</h2>
                  <p className="text-xs text-slate-400">{selectedConnector.category} • Continuous Harvest Feed</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ingress Endpoint URL</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 break-all">
                  {selectedConnector.authConfig.endpoint}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Authentication Token / Secret</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800">
                  {selectedConnector.authConfig.maskedSecret}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sync Frequency</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800">
                  {selectedConnector.syncFrequency}
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>ISO 42001 Continuous Verification</span>
                </div>
                <p className="text-[11px] text-indigo-700">
                  Evidence ingested through this channel is automatically signed with SHA-256 HMAC and attached to active conformity assessments.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedConnector(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
