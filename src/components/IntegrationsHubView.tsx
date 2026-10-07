import React, { useState, useEffect } from "react";
import { 
  GitBranch, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  ExternalLink, 
  Terminal, 
  Send, 
  Layers, 
  ArrowUpRight,
  Clock,
  Sparkles,
  Lock,
  Play
} from "lucide-react";
import { ModelIntegrationTelemetry, CICDPipelineGateEvent, SiemWebhookConfig } from "../types";

interface IntegrationsHubViewProps {
  activeWorkspaceId: string;
}

export default function IntegrationsHubView({ activeWorkspaceId }: IntegrationsHubViewProps) {
  const [telemetry, setTelemetry] = useState<ModelIntegrationTelemetry[]>([]);
  const [cicdEvents, setCicdEvents] = useState<CICDPipelineGateEvent[]>([]);
  const [webhooks, setWebhooks] = useState<SiemWebhookConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    setIsLoading(true);
    try {
      const [resTel, resCicd, resSiem] = await Promise.all([
        fetch("/api/integrations/telemetry"),
        fetch("/api/integrations/github-events"),
        fetch("/api/siem/webhooks")
      ]);

      if (resTel.ok) {
        const d = await resTel.json();
        setTelemetry(d.telemetry || []);
      }
      if (resCicd.ok) {
        const d = await resCicd.json();
        setCicdEvents(d.events || []);
      }
      if (resSiem.ok) {
        const d = await resSiem.json();
        setWebhooks(d.webhooks || []);
      }
    } catch (err) {
      console.error("Failed to load integrations data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, [activeWorkspaceId]);

  const handleSimulateModelTelemetry = async () => {
    setIsSimulating(true);
    try {
      const randomSafety = (96 + Math.random() * 3.8).toFixed(1);
      const res = await fetch("/api/integrations/model-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: "mod-1",
          modelName: "Gemini 1.5 Pro",
          provider: "Google Cloud Vertex AI",
          promptSafetyScore: Number(randomSafety),
          driftStatus: "Optimal",
          p95LatencyMs: Math.floor(280 + Math.random() * 120),
          tokenUsage24h: 1850000,
          complianceState: "PASS",
          action: "Ingested live embedding drift & toxic output safety metrics"
        })
      });

      if (res.ok) {
        setSimulationSuccess("Model runtime telemetry successfully ingested and ISO 42001 audit logged!");
        fetchIntegrations();
        setTimeout(() => setSimulationSuccess(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateCICDGate = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/integrations/github-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repository: "github.com/enterprise/ai-customer-recommendation",
          branch: "feature/model-v2.1-upgrade",
          commitHash: Math.random().toString(36).substring(2, 9),
          triggeredBy: "github-actions[bot]",
          hasApprovedRiskReview: true
        })
      });

      if (res.ok) {
        setSimulationSuccess("CI/CD Pipeline Security Gate event received and verified!");
        fetchIntegrations();
        setTimeout(() => setSimulationSuccess(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">CI/CD &amp; Model Registry Telemetry Hub</h1>
              <p className="text-xs text-slate-500 font-medium">
                Automated compliance triggers, model runtime drift metrics, and continuous deployment security gates.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSimulateModelTelemetry}
            disabled={isSimulating}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Simulate Model Ping</span>
          </button>
          <button
            onClick={handleSimulateCICDGate}
            disabled={isSimulating}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <GitBranch className="w-4 h-4" />
            <span>Trigger CI/CD Gate Scan</span>
          </button>
        </div>
      </div>

      {simulationSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{simulationSuccess}</span>
        </div>
      )}

      {/* Grid: 3 Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pillar 1: Model Runtime Telemetry */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Live Model Registry Telemetry (ISO 42001 Annex A.6)
                </span>
              </div>
              <button 
                onClick={fetchIntegrations}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {telemetry.map((tel) => (
                <div key={tel.id} className="p-4 space-y-2 hover:bg-slate-50/50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-slate-900">{tel.modelName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {tel.provider}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {tel.complianceState}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Safety Rating</span>
                      <span className="font-bold text-slate-800">{tel.promptSafetyScore}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Drift Status</span>
                      <span className="font-bold text-emerald-600">{tel.driftStatus}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">P95 Latency</span>
                      <span className="font-bold text-slate-800">{tel.p95LatencyMs} ms</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{tel.lastLoggedAction}</span>
                    <span className="font-mono text-slate-400">{new Date(tel.timestamp).toLocaleTimeString()}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CI/CD Gate Events */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  CI/CD Pipeline Security Gates (ISO 27001 A.14.2.8)
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {cicdEvents.map((evt) => (
                <div key={evt.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900">{evt.repository}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {evt.branch} &bull; {evt.commitHash}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Triggered by: <strong>{evt.triggeredBy}</strong></span>
                      <span>&bull;</span>
                      <span>{evt.verifiedEvidenceCount} Compliance checks verified</span>
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shrink-0 ${
                    evt.scanResult === "GATE_PASSED" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}>
                    {evt.scanResult === "GATE_PASSED" ? "Gate: Passed" : "Gate: Blocked"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pillar 2: Integration Webhook Endpoint Specs */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Webhook Integration APIs</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-400 block mb-1">Model Telemetry Ingestion</span>
                <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto">
                  POST /api/integrations/model-sync
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-purple-400 block mb-1">CI/CD Gate Check Ingestion</span>
                <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto">
                  POST /api/integrations/github-webhook
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">SIEM Forwarder Dispatch</span>
                <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto">
                  POST /api/siem/export-now
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              Payloads automatically map to ISO 42001 and ISO 27001 tamper-evident log chains.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <span className="text-xs font-bold text-slate-800 block">Connected SIEM Destinations</span>
            <div className="space-y-2">
              {webhooks.map((wh) => (
                <div key={wh.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{wh.name}</span>
                    <span className="text-[10px] text-slate-400">{wh.format}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
