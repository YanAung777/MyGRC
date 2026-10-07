import React, { useState } from "react";
import {
  Terminal,
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileCode,
  Layers,
  FileText,
  AlertTriangle
} from "lucide-react";

interface WeeklyAutomationGuideViewProps {
  onNavigateToScanner?: () => void;
  onNavigateToImport?: () => void;
}

export default function WeeklyAutomationGuideView({
  onNavigateToScanner,
  onNavigateToImport
}: WeeklyAutomationGuideViewProps) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold">
              <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
              <span>Security Architect Operational Runbook</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Weekly LLM Auto-Assessment Scanner & Ingestion Guide
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard operating procedure for continuous evaluation of newly released market models against ISO 42001 (Clauses 8.4 & 9.1), ISO 27001 (A.8.1.1), NIST AI RMF, and EU AI Act requirements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <a
              href="/weekly-scanner-instructions.html"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Standalone HTML Page</span>
            </a>

            <a
              href="/weekly_llm_scanner.py"
              download="weekly_llm_scanner.py"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Python Script</span>
            </a>
          </div>
        </div>

        {/* Operating Cadence Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Cadence</div>
            <div className="font-bold text-slate-100 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Every Monday 06:00 UTC</span>
            </div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase">SOP Owner</div>
            <div className="font-bold text-slate-100 mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lead Security Architect</span>
            </div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Approval Gate</div>
            <div className="font-bold text-slate-100 mt-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Score &ge; 85/100 + ZDR</span>
            </div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Gateway Target</div>
            <div className="font-bold text-slate-100 mt-0.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Portkey / LiteLLM Proxy</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP-BY-STEP PROCESS TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs">
            1
          </div>
          <h3 className="text-sm font-bold text-slate-900">Run Automated Scanner</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Execute the weekly Python script locally or via CI/CD. The script evaluates OpenAI, Anthropic, Google Cloud, Meta, Mistral, and DeepSeek model cards against our 7 GRC criteria.
          </p>

          <div className="pt-2">
            <div className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-2.5 rounded-lg flex items-center justify-between">
              <code>python3 weekly_llm_scanner.py</code>
              <button
                type="button"
                onClick={() => copyToClipboard("python3 scripts/weekly_llm_scanner.py --output market-models-feed.json", "cmd1")}
                className="text-slate-400 hover:text-white cursor-pointer ml-2"
              >
                {copiedCmd === "cmd1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-900">Sync with C&A Portal</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Load the resulting <code>market-models-feed.json</code> via either automated API endpoint push (<code>--upload-to-app</code>) or through the web UI JSON Import dialog.
          </p>

          <div className="pt-2">
            <div className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-2.5 rounded-lg flex items-center justify-between">
              <code>--upload-to-app --app-url :3000</code>
              <button
                type="button"
                onClick={() => copyToClipboard("python3 scripts/weekly_llm_scanner.py --upload-to-app --app-url http://localhost:3000", "cmd2")}
                className="text-slate-400 hover:text-white cursor-pointer ml-2"
              >
                {copiedCmd === "cmd2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs">
            3
          </div>
          <h3 className="text-sm font-bold text-slate-900">Enforce Gateway Whitelist</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Export the signed <code>approved-llm-whitelist.json</code> and feed it into your API gateways (LiteLLM, Portkey, Azure APIM) to block developers from querying unvetted models.
          </p>

          <div className="pt-2">
            {onNavigateToImport && (
              <button
                type="button"
                onClick={onNavigateToImport}
                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Open JSON Export Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CLI & CODE DETAILS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-600" />
          <span>Script Command Line Options & Automation Snippets</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <div className="font-semibold text-slate-700 mb-1">1. Generate Local Feed Only:</div>
            <div className="bg-slate-900 text-slate-200 font-mono p-3 rounded-xl flex items-center justify-between border border-slate-800">
              <code>python3 scripts/weekly_llm_scanner.py --output market-models-feed.json --verbose</code>
              <button
                type="button"
                onClick={() => copyToClipboard("python3 scripts/weekly_llm_scanner.py --output market-models-feed.json --verbose", "cli1")}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedCmd === "cli1" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <div className="font-semibold text-slate-700 mb-1">2. Run and Direct Push to Running Application API:</div>
            <div className="bg-slate-900 text-slate-200 font-mono p-3 rounded-xl flex items-center justify-between border border-slate-800">
              <code>python3 scripts/weekly_llm_scanner.py --upload-to-app --app-url http://localhost:3000</code>
              <button
                type="button"
                onClick={() => copyToClipboard("python3 scripts/weekly_llm_scanner.py --upload-to-app --app-url http://localhost:3000", "cli2")}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedCmd === "cli2" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <div className="font-semibold text-slate-700 mb-1">3. Automated Production Linux Crontab (Every Monday 06:00 UTC):</div>
            <div className="bg-slate-900 text-slate-200 font-mono p-3 rounded-xl flex items-center justify-between border border-slate-800">
              <code>0 6 * * 1 /usr/bin/python3 /opt/ca-portal/scripts/weekly_llm_scanner.py --upload-to-app --app-url http://localhost:3000 &gt;&gt; /var/log/llm-scanner.log 2&gt;&amp;1</code>
              <button
                type="button"
                onClick={() => copyToClipboard("0 6 * * 1 /usr/bin/python3 /opt/ca-portal/scripts/weekly_llm_scanner.py --upload-to-app --app-url http://localhost:3000 >> /var/log/llm-scanner.log 2>&1", "cli3")}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedCmd === "cli3" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* GitHub Actions Snippet */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span>GitHub Actions Workflow File (<code>.github/workflows/weekly-llm-scanner.yml</code>)</span>
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(`name: Weekly LLM Market GRC Assessment
on:
  schedule:
    - cron: '0 6 * * 1'
  workflow_dispatch:

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Run Market Scanner
        run: python scripts/weekly_llm_scanner.py --output market-models-feed.json
      - uses: actions/upload-artifact@v4
        with:
          name: market-models-feed
          path: market-models-feed.json`, "gha")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              {copiedCmd === "gha" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Workflow YAML</span>
            </button>
          </div>
          <pre className="bg-slate-900 text-slate-300 font-mono text-[11px] p-3.5 rounded-xl border border-slate-800 overflow-x-auto">
{`name: Weekly LLM Market GRC Assessment
on:
  schedule:
    - cron: '0 6 * * 1'
  workflow_dispatch:

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Run Market Scanner
        run: python scripts/weekly_llm_scanner.py --output market-models-feed.json
      - uses: actions/upload-artifact@v4
        with:
          name: market-models-feed
          path: market-models-feed.json`}
          </pre>
        </div>
      </div>
    </div>
  );
}
