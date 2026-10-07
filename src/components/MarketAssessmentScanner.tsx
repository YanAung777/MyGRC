import React, { useState, useMemo } from "react";
import {
  BrainCircuit,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Ban,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Download,
  Upload,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  Server,
  Terminal,
  ArrowRight,
  Plus,
  Info,
  Check,
  Globe,
  Flame,
  Award
} from "lucide-react";
import { ModelRecord } from "../types";
import {
  MarketModelAssessment,
  INITIAL_MARKET_MODELS,
  convertMarketModelToRecord
} from "../data/marketModelsData";

interface MarketAssessmentScannerProps {
  onIngestModel: (model: ModelRecord) => void;
  onBatchIngestModels: (models: ModelRecord[]) => void;
  existingModels: ModelRecord[];
  workspaceId?: string;
  onNavigateToWeeklyGuide?: () => void;
}

export default function MarketAssessmentScanner({
  onIngestModel,
  onBatchIngestModels,
  existingModels,
  workspaceId = "ws-1",
  onNavigateToWeeklyGuide
}: MarketAssessmentScannerProps) {
  const [marketModels, setMarketModels] = useState<MarketModelAssessment[]>(INITIAL_MARKET_MODELS);
  const [selectedProvider, setSelectedProvider] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModelForModal, setSelectedModelForModal] = useState<MarketModelAssessment | null>(null);

  // Live URL Scanner State
  const [scanUrl, setScanUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepMessage, setScanStepMessage] = useState("");
  const [scanResult, setScanResult] = useState<MarketModelAssessment | null>(null);
  const [scanLogHistory, setScanLogHistory] = useState<string[]>([]);

  // Rubric Drawer State
  const [isRubricOpen, setIsRubricOpen] = useState(false);

  // Success toast
  const [ingestSuccessMessage, setIngestSuccessMessage] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setIngestSuccessMessage(msg);
    setTimeout(() => setIngestSuccessMessage(null), 3500);
  };

  // Filtered list
  const filteredModels = useMemo(() => {
    return marketModels.filter((m) => {
      const matchProvider = selectedProvider === "ALL" || m.provider.toLowerCase() === selectedProvider.toLowerCase();
      const matchStatus = selectedStatus === "ALL" || m.recommendedStatus === selectedStatus;
      const matchQuery =
        !searchQuery.trim() ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.notes.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProvider && matchStatus && matchQuery;
    });
  }, [marketModels, selectedProvider, selectedStatus, searchQuery]);

  // Providers list
  const providersList = useMemo(() => {
    const set = new Set(marketModels.map((m) => m.provider));
    return ["ALL", ...Array.from(set)];
  }, [marketModels]);

  // Quick stats
  const stats = useMemo(() => {
    const total = marketModels.length;
    const approved = marketModels.filter((m) => m.recommendedStatus === "Approved").length;
    const restricted = marketModels.filter((m) => m.recommendedStatus === "Restricted").length;
    const pending = marketModels.filter((m) => m.recommendedStatus === "Pending").length;
    const blocked = marketModels.filter((m) => m.recommendedStatus === "Blocked").length;
    return { total, approved, restricted, pending, blocked };
  }, [marketModels]);

  // Check if a market model is already in existing models
  const isModelAlreadyIngested = (m: MarketModelAssessment) => {
    return existingModels.some(
      (em) =>
        em.name.toLowerCase().includes(m.name.toLowerCase()) ||
        m.name.toLowerCase().includes(em.name.toLowerCase())
    );
  };

  // Handle single model ingestion
  const handleIngestSingle = (m: MarketModelAssessment, overrideStatus?: ModelRecord["status"]) => {
    const rec = convertMarketModelToRecord(m, workspaceId, "Security Architect (Scanner)");
    if (overrideStatus) {
      rec.status = overrideStatus;
    }
    onIngestModel(rec);
    showSuccess(`Successfully added "${m.name}" to Model Registry (${rec.status})!`);
  };

  // Handle batch ingestion of all approved models
  const handleBatchIngestApproved = () => {
    const approvedList = marketModels
      .filter((m) => m.recommendedStatus === "Approved")
      .map((m) => convertMarketModelToRecord(m, workspaceId, "Security Architect (Batch Scanner)"));
    onBatchIngestModels(approvedList);
    showSuccess(`Batch ingested ${approvedList.length} approved models into Model Registry!`);
  };

  // Run simulated deep live web-scanner
  const handleRunLiveScan = () => {
    if (!scanUrl.trim()) return;
    setIsScanning(true);
    setScanProgress(5);
    setScanLogHistory([`[INIT] Commencing automated GRC assessment for target: ${scanUrl}`]);
    setScanResult(null);

    const steps = [
      { p: 20, log: "[CRAWL] Fetching Provider Terms of Service, Enterprise DPA & Privacy Policy..." },
      { p: 40, log: "[ZDR-CHECK] Validating Zero Data Retention (ZDR) guarantee & prompt training opt-out..." },
      { p: 60, log: "[CERT-AUDIT] Verifying SOC 2 Type II, ISO 27001, and HIPAA BAA artifacts..." },
      { p: 80, log: "[EU-AI-ACT] Benchmarking compute FLOPs & Article 51/52 Systemic Risk thresholds..." },
      { p: 95, log: "[SECURITY] Evaluating Prompt Injection resilience, CVEs, and jailbreak safeguards..." },
      { p: 100, log: "[COMPLETE] Weighted GRC security scoring completed. Recommendation synthesized." },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const item = steps[currentStep];
        setScanProgress(item.p);
        setScanStepMessage(item.log.replace(/\[\w+\]\s*/, ""));
        setScanLogHistory((prev) => [...prev, item.log]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsScanning(false);

        // Synthesize dynamic result based on target input
        const lower = scanUrl.toLowerCase();
        let targetAssessment: MarketModelAssessment;

        if (lower.includes("deepseek") || lower.includes("r1")) {
          targetAssessment = {
            id: `mkt-custom-deepseek-${Date.now()}`,
            provider: "DeepSeek",
            name: "DeepSeek-R1 (Live Scanned)",
            version: "v1.1",
            releaseDate: new Date().toISOString().split("T")[0],
            recommendedStatus: "Restricted",
            securityScore: 71,
            zeroDataRetention: false,
            trainingOptOut: false,
            soc2Certified: false,
            iso27001Certified: false,
            hipaaCompliant: false,
            euAiActTier: "GPAI with Systemic Risk",
            dataResidency: "Non-US (PRC cloud API) / Internal VPC if self-hosted",
            contextWindow: "64k tokens",
            hostingOptions: ["Self-Hosted VPC", "AWS Bedrock"],
            cveVulnerabilities: 1,
            jailbreakRobustness: "Moderate",
            contentModerationApi: false,
            notes: "CRAWL VERDICT: Scanned public API privacy policy does not provide enterprise Zero Data Retention. Recommended restricted status: permitted for internal self-hosted GPU clusters only; public cloud API blocked for corporate confidential data.",
            privacyPolicyUrl: scanUrl,
            modelCardUrl: "https://huggingface.co/deepseek-ai/DeepSeek-R1",
            lastScannedAt: new Date().toISOString(),
          };
        } else if (lower.includes("mistral") || lower.includes("large")) {
          targetAssessment = {
            id: `mkt-custom-mistral-${Date.now()}`,
            provider: "Mistral AI",
            name: "Mistral Large 2 (Live Scanned)",
            version: "2411",
            releaseDate: new Date().toISOString().split("T")[0],
            recommendedStatus: "Approved",
            securityScore: 94,
            zeroDataRetention: true,
            trainingOptOut: true,
            soc2Certified: true,
            iso27001Certified: true,
            hipaaCompliant: true,
            euAiActTier: "GPAI with Systemic Risk",
            dataResidency: "EU Sovereign Cloud (Paris/Frankfurt)",
            contextWindow: "128k tokens",
            hostingOptions: ["Proprietary Cloud API", "AWS Bedrock", "GCP Vertex AI", "Self-Hosted VPC"],
            cveVulnerabilities: 0,
            jailbreakRobustness: "Good",
            contentModerationApi: true,
            notes: "CRAWL VERDICT: Strong EU AI Act alignment. Commercial DPA explicitly guarantees customer prompts are never retained or used for training. Approved for enterprise deployment.",
            privacyPolicyUrl: scanUrl,
            modelCardUrl: "https://mistral.ai",
            lastScannedAt: new Date().toISOString(),
          };
        } else {
          targetAssessment = {
            id: `mkt-custom-scan-${Date.now()}`,
            provider: lower.includes("anthropic") ? "Anthropic" : lower.includes("openai") ? "OpenAI" : lower.includes("google") ? "Google Cloud" : "Enterprise Foundation AI",
            name: scanUrl.replace(/^https?:\/\//, "").split("/")[0] || "Custom Foundation Model",
            version: "2026.1",
            releaseDate: new Date().toISOString().split("T")[0],
            recommendedStatus: "Approved",
            securityScore: 92,
            zeroDataRetention: true,
            trainingOptOut: true,
            soc2Certified: true,
            iso27001Certified: true,
            hipaaCompliant: true,
            euAiActTier: "GPAI with Systemic Risk",
            dataResidency: "US & EU Multi-Region",
            contextWindow: "128k tokens",
            hostingOptions: ["Proprietary Cloud API", "AWS Bedrock", "Azure OpenAI"],
            cveVulnerabilities: 0,
            jailbreakRobustness: "Excellent",
            contentModerationApi: true,
            notes: "CRAWL VERDICT: Scanned vendor privacy addendum meets ISO 42001 Section 8.4 and NIST AI RMF standards. Enterprise Zero Data Retention and SOC 2 Type II certified.",
            privacyPolicyUrl: scanUrl,
            modelCardUrl: scanUrl,
            lastScannedAt: new Date().toISOString(),
          };
        }

        setScanResult(targetAssessment);
        // Add to market list if not present
        setMarketModels((prev) => [targetAssessment, ...prev.filter((m) => m.name !== targetAssessment.name)]);
      }
    }, 450);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast */}
      {ingestSuccessMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{ingestSuccessMessage}</span>
        </div>
      )}

      {/* Main Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Continuous GRC Security Architect Scanner — ISO 42001 & NIST AI RMF</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Market Auto-Assessment & Approved LLM Intelligence
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Continuously crawls and security-evaluates emerging foundation models across 7 core GRC pillars (Zero Data Retention, SOC 2, EU AI Act, Data Residency, and Prompt Training Opt-Out). Ingest approved models directly into your enterprise whitelist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleBatchIngestApproved}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Ingest All Approved ({stats.approved})</span>
            </button>

            {onNavigateToWeeklyGuide && (
              <button
                type="button"
                onClick={onNavigateToWeeklyGuide}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-indigo-300" />
                <span>Weekly Runbook & CLI</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI Stat Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Models Audited</div>
            <div className="text-xl font-black text-white mt-0.5">{stats.total}</div>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3">
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Approved Whitelist</div>
            <div className="text-xl font-black text-emerald-300 mt-0.5 flex items-center gap-1.5">
              <span>{stats.approved}</span>
              <span className="text-[10px] font-normal text-emerald-400">Ready</span>
            </div>
          </div>

          <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-3">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Restricted (Caveats)</div>
            <div className="text-xl font-black text-amber-300 mt-0.5">{stats.restricted}</div>
          </div>

          <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-3">
            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Pending DPA Review</div>
            <div className="text-xl font-black text-blue-300 mt-0.5">{stats.pending}</div>
          </div>

          <div className="bg-rose-950/40 border border-rose-800/40 rounded-xl p-3">
            <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Blocked / Violations</div>
            <div className="text-xl font-black text-rose-300 mt-0.5">{stats.blocked}</div>
          </div>
        </div>
      </div>

      {/* Live External URL / Model Assessment Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Live External Website & Model Scanner</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Enter a model vendor privacy URL, Hugging Face model card, or release documentation to run a simulated automated GRC audit.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsRubricOpen(!isRubricOpen)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>{isRubricOpen ? "Hide" : "View"} 7-Pillar GRC Rubric</span>
            {isRubricOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 7-Pillar Rubric Explainer (Collapsible) */}
        {isRubricOpen && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3 animate-fade-in">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>The 7 GRC Security Architecture Evaluation Pillars:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="font-bold text-indigo-900">1. Zero Data Retention (25 pts)</div>
                <p className="text-slate-500 mt-0.5">Enterprise contract ensures prompts and outputs are discarded immediately post-inference.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="font-bold text-indigo-900">2. Training Opt-Out (20 pts)</div>
                <p className="text-slate-500 mt-0.5">Binding legal commitment that customer API payload data is never used to train foundation models.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="font-bold text-indigo-900">3. Certifications (15 pts)</div>
                <p className="text-slate-500 mt-0.5">Independent third-party audits: SOC 2 Type II, ISO 27001, and HIPAA BAA availability.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="font-bold text-indigo-900">4. EU AI Act Tiering (15 pts)</div>
                <p className="text-slate-500 mt-0.5">Classification under EU AI Act: GPAI with Systemic Risk (&gt;10^25 FLOPs) vs Minimal/Specific Risk.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="font-bold text-indigo-900">5. Data Residency (10 pts)</div>
                <p className="text-slate-500 mt-0.5">Regional sovereign boundary isolation (US, EU sovereign cloud, or customer-hosted VPC).</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="font-bold text-indigo-900">6. Jailbreak Robustness (10 pts)</div>
                <p className="text-slate-500 mt-0.5">Track record against prompt injection, jailbreak benchmarks, and published red-team reports.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="font-bold text-indigo-900">7. Content Moderation (5 pts)</div>
                <p className="text-slate-500 mt-0.5">Integrated safety filters and guaranteed inference availability under enterprise SLA.</p>
              </div>
              <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-100 flex items-center justify-center text-center">
                <div className="text-[11px] text-indigo-800 font-semibold">
                  Total Security Score: <span className="font-black text-sm">100 / 100</span>
                  <div className="text-[10px] text-indigo-600 mt-0.5">&ge;85: Approved | 65-84: Restricted</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. https://openai.com/enterprise-privacy/ or https://huggingface.co/deepseek-ai/DeepSeek-R1 or model name..."
              value={scanUrl}
              onChange={(e) => setScanUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isScanning) handleRunLiveScan();
              }}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRunLiveScan}
              disabled={isScanning || !scanUrl.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Assessing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run GRC Web Scan</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setScanUrl("https://openai.com/enterprise-privacy/");
              }}
              className="px-2.5 py-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer hidden md:block"
            >
              Try OpenAI
            </button>
            <button
              type="button"
              onClick={() => {
                setScanUrl("https://huggingface.co/deepseek-ai/DeepSeek-R1");
              }}
              className="px-2.5 py-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer hidden md:block"
            >
              Try DeepSeek-R1
            </button>
          </div>
        </div>

        {/* Progress & Live Terminal Output */}
        {isScanning && (
          <div className="bg-slate-900 rounded-xl p-4 text-slate-200 text-xs font-mono space-y-2 border border-slate-800 animate-fade-in">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Executing Automated Assessment Engine...</span>
              </span>
              <span>{scanProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="text-emerald-400 text-[11px] pt-1">
              {scanStepMessage || "Scanning..."}
            </div>
          </div>
        )}

        {/* Live Scan Result Card */}
        {scanResult && !isScanning && (
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 animate-scale-up space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shadow-xs ${
                    scanResult.securityScore >= 85
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : scanResult.securityScore >= 65
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  {scanResult.securityScore}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{scanResult.name}</span>
                    <span className="text-xs text-slate-500">by {scanResult.provider}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        scanResult.recommendedStatus === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : scanResult.recommendedStatus === "Restricted"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {scanResult.recommendedStatus} Recommendation
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Residency: <span className="font-medium text-slate-800">{scanResult.dataResidency}</span> &bull; EU AI Act: <span className="font-medium text-slate-800">{scanResult.euAiActTier}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleIngestSingle(scanResult, scanResult.recommendedStatus)}
                  className="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ingest to Registry ({scanResult.recommendedStatus})</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-indigo-150 leading-relaxed">
              {scanResult.notes}
            </p>
          </div>
        )}
      </div>

      {/* Filter and Search Bar for Market Feed */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter market models by name, provider, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 outline-none focus:bg-white focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-2 outline-none cursor-pointer"
            >
              {providersList.map((p) => (
                <option key={p} value={p}>
                  {p === "ALL" ? "All Providers" : p}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-2 outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Approved">Approved Only</option>
              <option value="Restricted">Restricted Only</option>
              <option value="Pending">Pending Only</option>
              <option value="Blocked">Blocked Only</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 text-right shrink-0">
          Showing <span className="font-bold text-slate-800">{filteredModels.length}</span> of {marketModels.length} models
        </div>
      </div>

      {/* Market Models Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((m) => {
          const alreadyIngested = isModelAlreadyIngested(m);

          return (
            <div
              key={m.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Card Top */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      {m.provider}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                      {m.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ver {m.version} &bull; {m.contextWindow}
                    </span>
                  </div>

                  {/* Security Score Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                      m.securityScore >= 85
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : m.securityScore >= 65
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                  >
                    <span className="text-xs font-black leading-none">{m.securityScore}</span>
                    <span className="text-[8px] font-bold uppercase mt-0.5">/ 100</span>
                  </div>
                </div>

                {/* Status and Compliance Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      m.recommendedStatus === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : m.recommendedStatus === "Restricted"
                        ? "bg-amber-100 text-amber-800"
                        : m.recommendedStatus === "Blocked"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {m.recommendedStatus}
                  </span>

                  {m.zeroDataRetention && (
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[9px] font-bold">
                      Zero Retention (ZDR)
                    </span>
                  )}

                  {m.soc2Certified && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-bold">
                      SOC 2
                    </span>
                  )}

                  {m.iso27001Certified && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-bold">
                      ISO 27001
                    </span>
                  )}
                </div>

                {/* Notes Snippet */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {m.notes}
                </p>

                {/* Key Meta */}
                <div className="pt-2 border-t border-slate-100 text-[10px] space-y-1 text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Data Residency:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[170px]">
                      {m.dataResidency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>EU AI Act Tier:</span>
                    <span className="font-semibold text-slate-700">{m.euAiActTier}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModelForModal(m)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  View Details &rarr;
                </button>

                {alreadyIngested ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    In Registry
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleIngestSingle(m, m.recommendedStatus)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs ${
                      m.recommendedStatus === "Approved"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : m.recommendedStatus === "Restricted"
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-slate-700 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ingest Model</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedModelForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scale-up max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase">
                  {selectedModelForModal.provider}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedModelForModal.name} — GRC Security Card
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModelForModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Recommended Status</span>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">
                    {selectedModelForModal.recommendedStatus}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Security Score</span>
                  <div className="text-sm font-black text-indigo-700 mt-0.5">
                    {selectedModelForModal.securityScore} / 100
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">EU AI Act Classification</span>
                  <div className="text-xs font-semibold text-slate-800 mt-0.5">
                    {selectedModelForModal.euAiActTier}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Data Residency Boundary</span>
                  <div className="text-xs font-semibold text-slate-800 mt-0.5">
                    {selectedModelForModal.dataResidency}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Compliance Criteria Checklist:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    {selectedModelForModal.zeroDataRetention ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span>Zero Data Retention (ZDR)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    {selectedModelForModal.trainingOptOut ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span>Training Opt-Out Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    {selectedModelForModal.soc2Certified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span>SOC 2 Type II Certified</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    {selectedModelForModal.iso27001Certified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span>ISO 27001 Certified</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Architect Security Commentary:</h4>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedModelForModal.notes}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Supported Hosting Enclaves:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModelForModal.hostingOptions.map((h, i) => (
                    <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-lg text-[10px]">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <a
                href={selectedModelForModal.privacyPolicyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Vendor Legal DPA</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModelForModal(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleIngestSingle(selectedModelForModal, selectedModelForModal.recommendedStatus);
                    setSelectedModelForModal(null);
                  }}
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer"
                >
                  Ingest to Registry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
