import React, { useState } from "react";
import {
  X,
  FileText,
  Download,
  Printer,
  Calendar,
  User,
  Folder,
  Tag,
  Lock,
  ShieldCheck,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  FileSpreadsheet,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  History,
  Eye,
  Settings,
  ShieldAlert
} from "lucide-react";
import { EvidenceFile, Folder as FolderType } from "../types";
import { downloadEvidenceFile, printEvidenceFile } from "../utils/reportExporter";
import AIEvidenceAnalyzerModal from "./AIEvidenceAnalyzerModal";

interface EvidenceFilePreviewModalProps {
  file: EvidenceFile;
  folders: FolderType[];
  onClose: () => void;
  onUpdateStatus?: (fileId: string, status: "Draft" | "Approved" | "Under Review") => void;
}

export default function EvidenceFilePreviewModal({
  file,
  folders,
  onClose,
  onUpdateStatus
}: EvidenceFilePreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"document" | "ai_insights" | "audit_trail">("document");
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAiAuditOpen, setIsAiAuditOpen] = useState(false);

  const folderName = folders.find((f) => f.id === file.folderId)?.name || "Uncategorized";

  // Mock file dimensions / details based on file name
  const isImage = file.name.endsWith(".png") || file.name.endsWith(".jpg") || file.name.endsWith(".jpeg");
  const isExcel = file.name.toLowerCase().includes("xls") || file.name.toLowerCase().includes("sheet") || file.name.toLowerCase().includes("csv");
  
  const getFileSize = () => {
    if (isImage) return "2.4 MB";
    if (isExcel) return "420 KB";
    if (file.name.includes("Audit") || file.name.includes("Assessment")) return "1.2 MB";
    return "650 KB";
  };

  const getDocType = () => {
    if (isImage) return "Image/JPEG Resource";
    if (isExcel) return "Microsoft Excel Spreadsheet";
    return "Adobe PDF Document";
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(`SHA-256: 7f8c9d01a2b3c4d5e6f7${file.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status badge style helper
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Under Review":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`bg-white rounded-2xl w-full ${isFullscreen ? "max-w-7xl h-[92vh]" : "max-w-5xl h-[85vh]"} shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-scale-up`}>
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-xl ${isImage ? "bg-indigo-50 text-indigo-600" : isExcel ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              {isImage ? <ImageIcon className="w-5 h-5" /> : isExcel ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight truncate max-w-md" title={file.name}>
                  {file.name}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeClass(file.status)}`}>
                  {file.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                {getDocType()} • {getFileSize()} • Version {file.version}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAiAuditOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
              title="Run AI Evidence Integrity & Defensibility Audit"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Evidence Audit</span>
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-slate-100 bg-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Content (Split Screen) */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Viewer & Interactive Content */}
          <div className="flex-1 bg-slate-100 flex flex-col overflow-hidden border-r border-slate-200">
            {/* Tab selector for Left panel */}
            <div className="bg-white border-b border-slate-200 px-5 py-1.5 flex justify-between items-center shrink-0">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("document")}
                  className={`py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "document"
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Document Render
                </button>
                <button
                  onClick={() => setActiveTab("ai_insights")}
                  className={`py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "ai_insights"
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  AI Insights &amp; Tagging
                </button>
                <button
                  onClick={() => setActiveTab("audit_trail")}
                  className={`py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "audit_trail"
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  Audit Access Logs
                </button>
              </div>

              {activeTab === "document" && (
                <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 text-xs text-slate-500 shrink-0 scale-95 origin-right">
                  <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-0.5 hover:bg-slate-200 rounded cursor-pointer">
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono min-w-10 text-center font-bold">{zoom}%</span>
                  <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-0.5 hover:bg-slate-200 rounded cursor-pointer">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Viewer Stage Area */}
            <div className="flex-1 overflow-auto p-6 flex justify-center items-start">
              
              {activeTab === "document" && (
                <div
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
                  className="bg-white w-full max-w-2xl rounded-xl shadow-md border border-slate-200/80 p-8 text-left space-y-6 relative transition-transform"
                >
                  {/* Watermark badge */}
                  <div className="absolute top-8 right-8 flex flex-col items-end scale-90">
                    <span className="text-[8px] font-mono text-slate-400 tracking-wider">SECURE AUDIT BluePrint</span>
                    <span className="text-[9px] font-bold text-indigo-600 mt-1 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      C&amp;A PORTAL CERTIFIED
                    </span>
                  </div>

                  {/* Header info */}
                  <div className="border-b border-slate-200 pb-4">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block">Governance Evidence Artifact</span>
                    <h1 className="text-base font-extrabold text-slate-900 mt-1">{file.name}</h1>
                    <p className="text-[10px] text-slate-400 mt-1">Source Workspace Project: <strong className="text-slate-600">{file.source}</strong></p>
                  </div>

                  {/* Dynamic Document Content Simulator based on File Category */}
                  {isImage ? (
                    <div className="py-6 flex flex-col items-center justify-center space-y-4">
                      {/* Stylized vector representation of image since we don't have real file upload */}
                      <div className="w-full h-64 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none"></div>
                        <ImageIcon className="w-12 h-12 text-indigo-400 mb-2 animate-pulse" />
                        <span className="text-xs font-bold text-slate-700">ISO 42001 System Visual Artifact</span>
                        <p className="text-[10px] text-slate-400 text-center max-w-sm mt-1 leading-relaxed">
                          This image contains verified evidence screenshots, model architecture layout flow, or visual proof uploaded directly from local assessor storage.
                        </p>
                        
                        {/* Stylized mockup flow chart inside */}
                        <div className="w-full max-w-xs mt-4 bg-white border border-slate-200 p-2.5 rounded shadow-xs flex justify-between items-center text-[9px] font-mono text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span>Model Weights</span>
                          </div>
                          <div className="w-8 border-t border-slate-300 border-dashed"></div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                            <span>Aegis Guardrails</span>
                          </div>
                          <div className="w-8 border-t border-slate-300 border-dashed"></div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                            <span>Secure API</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : isExcel ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        <span>Interactive Auditor Spreadsheet View</span>
                      </div>
                      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white text-[10px] font-mono">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                              <th className="p-2 border-r border-slate-200">ID</th>
                              <th className="p-2 border-r border-slate-200">Compliance Code</th>
                              <th className="p-2 border-r border-slate-200">Mapped Controls</th>
                              <th className="p-2">Assessor Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-600">
                            <tr>
                              <td className="p-2 border-r border-slate-200 font-bold text-slate-800">CMP-01</td>
                              <td className="p-2 border-r border-slate-200">ISO 42001:2023 A.7.2</td>
                              <td className="p-2 border-r border-slate-200 text-slate-500">AI System Life-Cycle Security</td>
                              <td className="p-2 text-emerald-600 font-bold bg-emerald-50/50">COMPLIANT</td>
                            </tr>
                            <tr>
                              <td className="p-2 border-r border-slate-200 font-bold text-slate-800">CMP-02</td>
                              <td className="p-2 border-r border-slate-200">NIST MAP-1.1</td>
                              <td className="p-2 border-r border-slate-200 text-slate-500">System Context Identification</td>
                              <td className="p-2 text-emerald-600 font-bold bg-emerald-50/50">COMPLIANT</td>
                            </tr>
                            <tr>
                              <td className="p-2 border-r border-slate-200 font-bold text-slate-800">CMP-03</td>
                              <td className="p-2 border-r border-slate-200">ISO 42001:2023 A.8.1</td>
                              <td className="p-2 border-r border-slate-200 text-slate-500">AI Impact Assessments</td>
                              <td className="p-2 text-amber-600 font-bold bg-amber-50/50">UNDER AUDIT</td>
                            </tr>
                            <tr>
                              <td className="p-2 border-r border-slate-200 font-bold text-slate-800">CMP-04</td>
                              <td className="p-2 border-r border-slate-200">ISO 27001 A.12.6.1</td>
                              <td className="p-2 border-r border-slate-200 text-slate-500">Vulnerability Management</td>
                              <td className="p-2 text-emerald-600 font-bold bg-emerald-50/50">COMPLIANT</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">Total mapped rows: 24 active audit vectors verified.</p>
                    </div>
                  ) : (
                    // Default PDF Standard Policy Render
                    <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">1. Purpose &amp; Scope</h4>
                        <p>
                          This document forms official compliance evidence establishing governance loops, model parameters, and algorithmic integrity checks for the <strong>{file.source}</strong> ecosystem. These processes comply with ISO 42001 Management System standards and NIST Risk Management Framework principles.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">2. Model Specifications &amp; Parameters</h4>
                        <p>
                          Algorithmic models associated are locked under versioning control v1.0. Direct evaluation has been conducted across training loops, biased outcome logs, and system latency matrices. Automated continuous training loops remain deactivated in order to satisfy statutory non-repudiation mandates.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">3. Operational Control Verifications</h4>
                        <ul className="list-disc pl-5 space-y-1 text-slate-500">
                          <li>Continuous telemetry audit log enabled across client ingress endpoints.</li>
                          <li>Human-in-the-loop (HITL) overrides established for high-impact decision-making branches.</li>
                          <li>Input token anonymization pipelines verified under ISO 27701 privacy rules.</li>
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-400">
                        <span>CLASSIFICATION: CONFIDENTIAL</span>
                        <span>DRAFT VERSION: 1.0.0-SECURE</span>
                        <span>PAGE 1 OF 1</span>
                      </div>
                    </div>
                  )}

                  {/* Document Footer Verification Seal */}
                  <div className="border-t border-slate-200 pt-5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-1 text-slate-500 font-bold">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>SECURED BY C&amp;A PORTAL AIMS ENGINE</span>
                    </div>
                    <span>{file.uploadDate}</span>
                  </div>
                </div>
              )}

              {activeTab === "ai_insights" && (
                <div className="bg-white w-full max-w-2xl rounded-xl shadow-md border border-slate-200/80 p-8 text-left space-y-6">
                  <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm border-b border-indigo-100 pb-3">
                    <Sparkles className="w-5 h-5" />
                    <span>Copilot AI Document Analysis</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/60">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Compliance Health</span>
                      <span className="text-2xl font-black text-indigo-900 block mt-1">94%</span>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        Meets essential documentation criteria with minor verification tags pending.
                      </p>
                    </div>

                    <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/60">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Security Level</span>
                      <span className="text-sm font-bold text-emerald-900 block mt-1.5 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        Confidential
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        Authorized to internal compliance officers, risk managers, and certified external assessors.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Auto-Mapped Framework Clauses</span>
                    <div className="space-y-2">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-slate-700">ISO 42001:2023 A.7.1</span>
                          <span className="text-[10px] text-slate-400">Resources for AI system governance</span>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          Mapped Proof
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-slate-700">NIST AI RMF Map-1.1</span>
                          <span className="text-[10px] text-slate-400">Contextual risks of AI usage documented</span>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          Mapped Proof
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AI Key Summary &amp; Recommendations</span>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
                      <p>
                        <strong>Executive Summary:</strong> This file represents a highly compliant operational record. The file has been successfully scanned for malware and sensitive PII leaks, passing all local GRC security guidelines.
                      </p>
                      <p className="font-bold text-indigo-700">
                        💡 Copilot Actionable Suggestion:
                      </p>
                      <p className="text-[11px]">
                        We recommend mapping this evidence to the <strong>Incident Response Plan</strong> template in Governance to ensure complete coverage of Clause A.9 (Incident Management).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "audit_trail" && (
                <div className="bg-white w-full max-w-2xl rounded-xl shadow-md border border-slate-200/80 p-8 text-left space-y-6">
                  <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm border-b border-slate-100 pb-3">
                    <History className="w-5 h-5 text-indigo-600" />
                    <span>Cryptographic Audit Trail Logs</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This GRC workspace maintains an immutable log of access and verification operations. These records satisfy standard logging requirements for auditing.
                  </p>

                  <div className="space-y-3.5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    <div className="flex gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 z-10">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="text-xs text-left">
                        <span className="font-bold text-slate-800 block">Access Trace Generated</span>
                        <span className="text-slate-500">You opened this file for secure verification review.</span>
                        <span className="text-[10px] text-slate-400 block mt-1">Just now • IP Hash: 127.0.0.1</span>
                      </div>
                    </div>

                    <div className="flex gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 z-10">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="text-xs text-left">
                        <span className="font-bold text-slate-800 block">Malware &amp; PII Scan Passed</span>
                        <span className="text-slate-500">Copilot Antivirus scanned the binary contents. No threats identified.</span>
                        <span className="text-[10px] text-slate-400 block mt-1">{file.uploadDate} • Scan Code: 994a2b</span>
                      </div>
                    </div>

                    <div className="flex gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 z-10">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs text-left">
                        <span className="font-bold text-slate-800 block">File Uploaded &amp; Registered</span>
                        <span className="text-slate-500">Uploaded by <strong>{file.uploader}</strong> in folder <strong>{folderName}</strong>.</span>
                        <span className="text-[10px] text-slate-400 block mt-1">{file.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Panel: Metadata & Actions Sidebar */}
          <div className="w-80 p-6 bg-slate-50 overflow-y-auto flex flex-col justify-between shrink-0">
            <div className="space-y-6">
              {/* Info Block */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Evidence Properties</span>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-xs space-y-3 text-xs text-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Unique ID:</span>
                    <span className="font-mono text-slate-800 font-bold">{file.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Uploader:</span>
                    <span className="font-semibold text-slate-800">{file.uploader}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Uploaded on:</span>
                    <span className="font-semibold text-slate-600">{file.uploadDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Active Folder:</span>
                    <span className="font-semibold text-indigo-700 flex items-center gap-1">
                      <Folder className="w-3.5 h-3.5" />
                      {folderName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Version tag:</span>
                    <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">{file.version}</span>
                  </div>
                </div>
              </div>

              {/* Secure Fingerprint block */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">SHA-256 Fingerprint</span>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs text-xs">
                  <div className="font-mono text-[10px] text-slate-500 break-all bg-slate-50 p-2 rounded border border-slate-100">
                    7f8c9d01a2b3c4d5e6f7{file.id}7291a27e
                  </div>
                  <button
                    onClick={handleCopyHash}
                    className="w-full mt-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 font-bold rounded text-[10px] transition-colors cursor-pointer border border-slate-200/50"
                  >
                    {copied ? "Copied Fingerprint!" : "Copy cryptographic hash"}
                  </button>
                </div>
              </div>

              {/* Action: Update Compliance Review Status */}
              {onUpdateStatus && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">GRC Audit Decision</span>
                  <div className="space-y-2">
                    <button
                      onClick={() => onUpdateStatus(file.id, "Approved")}
                      disabled={file.status === "Approved"}
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500/40 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve Compliance Evidence
                    </button>
                    <button
                      onClick={() => onUpdateStatus(file.id, "Under Review")}
                      disabled={file.status === "Under Review"}
                      className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/40 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Mark Under Review
                    </button>
                    <button
                      onClick={() => onUpdateStatus(file.id, "Draft")}
                      disabled={file.status === "Draft"}
                      className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-100/55 text-slate-700 font-semibold rounded-lg text-xs border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Revert to Draft Status
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Download/Print buttons */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => downloadEvidenceFile(file, folderName)}
                className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                id="btn-modal-download-evidence"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                type="button"
                onClick={() => printEvidenceFile(file, folderName)}
                className="py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-250 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                id="btn-modal-print-evidence"
              >
                <Printer className="w-4 h-4" />
                Print File
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* AI Evidence Gap & Integrity Analyzer Modal */}
      {isAiAuditOpen && (
        <AIEvidenceAnalyzerModal
          isOpen={isAiAuditOpen}
          onClose={() => setIsAiAuditOpen(false)}
          evidence={file}
          onAttachAddenda={(addendaText) => {
            if (onUpdateStatus) {
              onUpdateStatus(file.id, "Approved");
            }
          }}
        />
      )}
    </div>
  );
}
