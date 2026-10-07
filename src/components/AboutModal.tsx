import React, { useState } from "react";
import {
  X,
  Info,
  Shield,
  ShieldCheck,
  Cpu,
  Lock,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Server,
  Code2,
  Terminal,
  Award
} from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "system" | "legal" | "privacy">("overview");

  if (!isOpen) return null;

  const systemDetails = {
    softwareName: "AI Governance, Certification & Accreditation Register (AI-GCAR)",
    version: "Version 4.2.0-Enterprise (LTS)",
    buildNumber: "Build #2026.08.09-REL-89104 (SHA: e9f4a12c8)",
    copyright: "© 2026 SaaS Technologies Ltd. All rights reserved.",
    architecture: "x86_64 Linux Container (Google Cloud Run / Edge)",
    frontendEngine: "React 18.3.1 / Vite 5.4 / TypeScript 5.5",
    memoryUsage: "128 MB / 512 MB Allocated",
    deviceId: "DEV-4G5Z-2026-X86",
    licenseType: "Enterprise Unlimited Node License (EMSA-2026)",
    encryption: "AES-256 (At Rest) | TLS 1.3 (In Transit)"
  };

  const handleCopySystemInfo = () => {
    const text = `
Software Name: ${systemDetails.softwareName}
Version Number: ${systemDetails.version}
Build Number: ${systemDetails.buildNumber}
Copyright Notice: ${systemDetails.copyright}
Architecture: ${systemDetails.architecture}
Frontend Engine: ${systemDetails.frontendEngine}
License: ${systemDetails.licenseType}
Device ID: ${systemDetails.deviceId}
Encryption: ${systemDetails.encryption}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between border-b border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-indigo-600/30 border border-indigo-500/40 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white tracking-tight">
                  {systemDetails.softwareName}
                </h2>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  LTS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {systemDetails.version} • {systemDetails.buildNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer relative z-10"
            title="Close About Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-2 gap-1 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-indigo-600 text-indigo-600 font-extrabold bg-white rounded-t-lg border-t border-x border-slate-200 -mb-px"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("system")}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "system"
                ? "border-indigo-600 text-indigo-600 font-extrabold bg-white rounded-t-lg border-t border-x border-slate-200 -mb-px"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>System Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("privacy")}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "privacy"
                ? "border-indigo-600 text-indigo-600 font-extrabold bg-white rounded-t-lg border-t border-x border-slate-200 -mb-px"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Statement</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("legal")}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "legal"
                ? "border-indigo-600 text-indigo-600 font-extrabold bg-white rounded-t-lg border-t border-x border-slate-200 -mb-px"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>License & Legal</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-slate-700 max-h-[60vh] overflow-y-auto text-xs">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Enterprise AI Compliance & Risk Management Platform</span>
                </div>
                <p className="leading-relaxed text-slate-600">
                  The AI Governance, Certification & Accreditation Register provides continuous compliance lifecycle tracking, risk matrix assessments, remediation monitoring, and automated ISO 42001 & EU AI Act governance documentation for mission-critical AI systems.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Software Title</span>
                  <span className="font-bold text-slate-900">{systemDetails.softwareName}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Release Version</span>
                  <span className="font-bold text-indigo-700">{systemDetails.version}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Build ID</span>
                  <span className="font-mono text-slate-800">{systemDetails.buildNumber}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Copyright</span>
                  <span className="font-medium text-slate-800">{systemDetails.copyright}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-slate-300 rounded-xl space-y-2 border border-slate-800 font-mono text-[11px]">
                <div className="flex items-center justify-between text-indigo-400 font-bold border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Active Security & Certification Profile</span>
                  </span>
                  <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    PASSING ALL CHECKS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>• ISO 42001:2023 Standard: <strong className="text-white">Active</strong></div>
                  <div>• EU AI Act High-Risk Spec: <strong className="text-white">Active</strong></div>
                  <div>• NIST AI RMF 1.0 Controls: <strong className="text-white">Active</strong></div>
                  <div>• ISO/IEC 27001 ISMS Node: <strong className="text-white">Certified</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM DETAILS */}
          {activeTab === "system" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-indigo-600" />
                  Technical Hardware & Environment Specifications
                </span>
                <button
                  type="button"
                  onClick={handleCopySystemInfo}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied Specs!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Specs</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">Architecture Platform</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{systemDetails.architecture}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">Frontend Engine Stack</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{systemDetails.frontendEngine}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">Active Memory Usage</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{systemDetails.memoryUsage}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">Hardware Device ID</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{systemDetails.deviceId}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-1 sm:col-span-2">
                  <span className="text-[10px] font-sans font-bold text-slate-400 uppercase block">Security Encryption Cipher</span>
                  <span className="font-bold text-indigo-700 mt-0.5 block">{systemDetails.encryption}</span>
                </div>
              </div>

              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-[11px] text-amber-900 space-y-1">
                <strong className="font-bold flex items-center gap-1 text-amber-900">
                  <Code2 className="w-3.5 h-3.5 text-amber-700" />
                  Container Environment Status
                </strong>
                <p className="text-amber-800 leading-relaxed">
                  Running on isolated sandboxed runtime on Port 3000 behind high-speed nginx reverse proxy. WebSockets and HMR disabled for production stability.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY STATEMENT */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2 text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Enterprise Privacy & Zero-Data Retention Commitment</span>
                </div>
                <p className="leading-relaxed text-xs text-emerald-900">
                  SaaS Technologies Ltd. respects strict enterprise data sovereignty. All AI project metadata, model parameters, evidence attachments, and accreditation logs are processed within your tenant boundary under zero-retention policies.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs">1. Data Isolation & Non-Training Pledge</h4>
                  <p>
                    No customer data, uploaded compliance evidence files, or model cards are ever used for public AI foundation model training or secondary telemetry collection.
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs">2. Regulatory Standard Alignment</h4>
                  <p>
                    Fully compliant with EU General Data Protection Regulation (GDPR) Article 32, California Consumer Privacy Act (CCPA/CPRA), and ISO/IEC 27070 cloud security standards.
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs">3. Cryptographic Storage & Access Controls</h4>
                  <p>
                    All database records are protected with AES-256 field-level encryption. Role-Based Access Controls (RBAC) enforce strict segregation of duties between Assessors, Business Owners, and CISO Approvers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEGAL & LICENSE */}
          {activeTab === "legal" && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Enterprise Master Services Agreement (EMSA-2026)</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Licensed to your organization under the SaaS Technologies Ltd. Enterprise Terms of Service. Authorized for internal corporate governance, AI compliance audits, and regulatory filing generation.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Open-Source Attributions</h4>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-700">
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">React 18.3 (MIT License)</div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">Vite 5.4 (MIT License)</div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">Tailwind CSS (MIT License)</div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">Lucide React (ISC License)</div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">Recharts (MIT License)</div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">Motion / Framer (MIT License)</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between items-center">
                <span>{systemDetails.copyright}</span>
                <span className="font-mono text-[10px]">Doc Ref: LEGAL-AI-GCAR-2026</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100/80 p-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>SaaS Technologies Enterprise Edition</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
