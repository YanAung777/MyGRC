import React, { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  PenTool,
  CheckSquare,
  FileCheck2,
  Lock,
  Eraser,
  Printer,
  Sparkles,
  Award,
  Calendar,
  UserCheck
} from "lucide-react";
import {
  ProjectCASignOff,
  CertificationLevel,
  AccreditationLevel,
  CertificationSignOff,
  AccreditationSignOff
} from "../types";

export const DEFAULT_SAMPLE_CA_SIGNOFF: ProjectCASignOff = {
  certification: {
    level: "Qualified Certification",
    comments:
      "Enterprise AI model integration ensures all prompt inputs and outputs are securely logged. The core infrastructure is certified, and downstream API integrations require completion of scheduled remediations per agreed milestone dates.",
    declarationConfirmed: true,
    signatory: {
      name: "Sarah Jenkins",
      title: "Chief Information Security Officer / Chief Privacy Officer",
      date: "2026-02-15",
      signature: "Sarah Jenkins, CISO",
      confirmed: true
    }
  },
  accreditation: {
    level: "Qualified Accreditation",
    comments:
      "I accept the residual risk profile subject to quarterly governance reviews and completion of post-go-live remediation actions as tracked in the project risk register.",
    declarationConfirmed: true,
    signatory: {
      name: "Marcus Vance",
      title: "Executive Sponsor / Deputy Chief Executive",
      date: "2026-02-18",
      signature: "Marcus Vance",
      confirmed: true
    }
  }
};

interface CertificationSignOffViewProps {
  data?: ProjectCASignOff;
  onChangeData?: (updated: ProjectCASignOff) => void;
  readOnly?: boolean;
  projectTitle?: string;
}

export default function CertificationSignOffView({
  data,
  onChangeData,
  readOnly = false,
  projectTitle = "AI Project"
}: CertificationSignOffViewProps) {
  // Local state initialized with props or default
  const certData: CertificationSignOff = {
    level: data?.certification?.level || "Pending Assessment",
    comments: data?.certification?.comments || "",
    declarationConfirmed: data?.certification?.declarationConfirmed ?? false,
    signatory: {
      name: data?.certification?.signatory?.name || "Sarah Jenkins",
      title: data?.certification?.signatory?.title || "Chief Information Security Officer / Chief Privacy Officer",
      date: data?.certification?.signatory?.date || new Date().toISOString().split("T")[0],
      signature: data?.certification?.signatory?.signature || "",
      confirmed: data?.certification?.signatory?.confirmed ?? false
    }
  };

  const accData: AccreditationSignOff = {
    level: data?.accreditation?.level || "Pending Assessment",
    comments: data?.accreditation?.comments || "",
    declarationConfirmed: data?.accreditation?.declarationConfirmed ?? false,
    signatory: {
      name: data?.accreditation?.signatory?.name || "Marcus Vance",
      title: data?.accreditation?.signatory?.title || "Executive Sponsor / Deputy Chief Executive",
      date: data?.accreditation?.signatory?.date || new Date().toISOString().split("T")[0],
      signature: data?.accreditation?.signatory?.signature || "",
      confirmed: data?.accreditation?.signatory?.confirmed ?? false
    }
  };

  // Canvas drawing references for digital signatures
  const certCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const accCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingCert, setIsDrawingCert] = useState(false);
  const [isDrawingAcc, setIsDrawingAcc] = useState(false);

  // Mode toggles: "draw" vs "type"
  const [certSigMode, setCertSigMode] = useState<"type" | "draw">("type");
  const [accSigMode, setAccSigMode] = useState<"type" | "draw">("type");

  const updateCert = (field: keyof CertificationSignOff, val: any) => {
    if (readOnly || !onChangeData) return;
    const updated: ProjectCASignOff = {
      certification: {
        ...certData,
        [field]: val
      },
      accreditation: accData
    };
    onChangeData(updated);
  };

  const updateCertSignatory = (field: string, val: any) => {
    if (readOnly || !onChangeData) return;
    const updated: ProjectCASignOff = {
      certification: {
        ...certData,
        signatory: {
          ...certData.signatory,
          [field]: val
        }
      },
      accreditation: accData
    };
    onChangeData(updated);
  };

  const updateAcc = (field: keyof AccreditationSignOff, val: any) => {
    if (readOnly || !onChangeData) return;
    const updated: ProjectCASignOff = {
      certification: certData,
      accreditation: {
        ...accData,
        [field]: val
      }
    };
    onChangeData(updated);
  };

  const updateAccSignatory = (field: string, val: any) => {
    if (readOnly || !onChangeData) return;
    const updated: ProjectCASignOff = {
      certification: certData,
      accreditation: {
        ...accData,
        signatory: {
          ...accData.signatory,
          [field]: val
        }
      }
    };
    onChangeData(updated);
  };

  const handleLoadSample = () => {
    if (onChangeData) {
      onChangeData(DEFAULT_SAMPLE_CA_SIGNOFF);
    }
  };

  // Canvas mouse handlers for Certification signature
  const startCertDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    const canvas = certCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawingCert(true);
  };

  const drawCert = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingCert || readOnly) return;
    const canvas = certCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#1e1b4b";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopCertDrawing = () => {
    if (!isDrawingCert) return;
    setIsDrawingCert(false);
    const canvas = certCanvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      updateCertSignatory("signature", dataUrl);
    }
  };

  const clearCertCanvas = () => {
    const canvas = certCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    updateCertSignatory("signature", "");
  };

  // Canvas mouse handlers for Accreditation signature
  const startAccDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    const canvas = accCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawingAcc(true);
  };

  const drawAcc = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingAcc || readOnly) return;
    const canvas = accCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopAccDrawing = () => {
    if (!isDrawingAcc) return;
    setIsDrawingAcc(false);
    const canvas = accCanvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      updateAccSignatory("signature", dataUrl);
    }
  };

  const clearAccCanvas = () => {
    const canvas = accCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    updateAccSignatory("signature", "");
  };

  const getBadgeStyle = (status: CertificationLevel | AccreditationLevel) => {
    switch (status) {
      case "Certified":
      case "Accreditation":
        return "bg-emerald-100/90 text-emerald-800 border-emerald-300";
      case "Qualified Certification":
      case "Qualified Accreditation":
        return "bg-amber-100/90 text-amber-800 border-amber-300";
      case "Not Certified":
      case "Not Accredited":
        return "bg-rose-100/90 text-rose-800 border-rose-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Certification & Accreditation Sign-Off
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Formal governance sign-off awarded by the Chief Information Security Officer (CISO) and Executive Sponsor for{" "}
            <span className="font-bold text-slate-700">{projectTitle}</span>.
          </p>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
              <span>Load Sample Sign-Off</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print / Export</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Approvals Section */}
      <div className="space-y-6">
        {/* ================= 1. CERTIFICATION SECTION ================= */}
        <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-sm bg-white">
          {/* Section Header Bar */}
          <div className="bg-slate-800 px-5 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-bold tracking-wide uppercase">Certification</h4>
            </div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(certData.level)}`}>
              {certData.level}
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Row 1: Awarded Certification Level */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider md:col-span-1">
                Level of Certification awarded
              </label>
              <div className="md:col-span-3">
                {readOnly ? (
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getBadgeStyle(certData.level)}`}>
                    {certData.level}
                  </span>
                ) : (
                  <select
                    value={certData.level}
                    onChange={(e) => updateCert("level", e.target.value as CertificationLevel)}
                    className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15"
                  >
                    <option value="Certified">Certified</option>
                    <option value="Qualified Certification">Qualified Certification</option>
                    <option value="Not Certified">Not Certified</option>
                    <option value="Pending Assessment">Pending Assessment</option>
                  </select>
                )}
              </div>
            </div>

            {/* Row 2: Comments */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Comments & Justification
              </label>
              {readOnly ? (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs leading-relaxed text-slate-700 font-medium">
                  {certData.comments || "No comments provided."}
                </div>
              ) : (
                <textarea
                  rows={3}
                  value={certData.comments}
                  onChange={(e) => updateCert("comments", e.target.value)}
                  placeholder="Enter certification assessment comments, scope conditions, or remediation constraints..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 font-medium leading-relaxed"
                />
              )}
            </div>

            {/* Row 3: Declaration Confirmation Text */}
            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-150 flex items-start gap-3">
              <input
                type="checkbox"
                id="cert-declaration-check"
                checked={certData.declarationConfirmed}
                disabled={readOnly}
                onChange={(e) => updateCert("declarationConfirmed", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
              />
              <label htmlFor="cert-declaration-check" className="text-xs italic text-slate-700 leading-relaxed font-medium cursor-pointer">
                I confirm that this report accurately represents the security and privacy risks associated with the identified scope and that the controls relied upon in this assessment are in place and operating at the time this certification was provided.
              </label>
            </div>

            {/* Row 4: Signatory Details & Digital Signature */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-150">
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Chief Information Security Officer / Chief Privacy Officer
                  </label>
                  {readOnly ? (
                    <div className="font-bold text-slate-900 text-xs mt-1">
                      {certData.signatory.name}, {certData.signatory.title}
                    </div>
                  ) : (
                    <div className="space-y-2 mt-1">
                      <input
                        type="text"
                        value={certData.signatory.name}
                        onChange={(e) => updateCertSignatory("name", e.target.value)}
                        placeholder="Signatory Name"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-semibold"
                      />
                      <input
                        type="text"
                        value={certData.signatory.title}
                        onChange={(e) => updateCertSignatory("title", e.target.value)}
                        placeholder="Official Title"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 font-medium"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Date of Certification
                  </label>
                  {readOnly ? (
                    <div className="font-mono text-slate-800 text-xs font-semibold mt-1">
                      {certData.signatory.date}
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={certData.signatory.date}
                      onChange={(e) => updateCertSignatory("date", e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono mt-1"
                    />
                  )}
                </div>
              </div>

              {/* Signature Capture Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    CISO Signature
                  </label>
                  {!readOnly && (
                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setCertSigMode("type")}
                        className={`px-2 py-0.5 rounded font-bold transition-colors ${certSigMode === "type" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      >
                        Typed
                      </button>
                      <button
                        type="button"
                        onClick={() => setCertSigMode("draw")}
                        className={`px-2 py-0.5 rounded font-bold transition-colors ${certSigMode === "draw" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      >
                        Draw
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-h-[90px] flex flex-col justify-center relative">
                  {certSigMode === "type" || readOnly ? (
                    <div className="space-y-1">
                      {readOnly ? (
                        certData.signatory.signature ? (
                          certData.signatory.signature.startsWith("data:image") ? (
                            <img src={certData.signatory.signature} alt="CISO Signature" className="h-10 object-contain" />
                          ) : (
                            <div className="font-serif italic text-lg text-indigo-950 tracking-wider font-semibold border-b border-dashed border-indigo-300 pb-1 inline-block">
                              {certData.signatory.signature}
                            </div>
                          )
                        ) : (
                          <span className="text-slate-400 italic text-xs">Unsigned</span>
                        )
                      ) : (
                        <input
                          type="text"
                          value={certData.signatory.signature}
                          onChange={(e) => updateCertSignatory("signature", e.target.value)}
                          placeholder="Type CISO Full Signature (e.g. Sarah Jenkins, CISO)"
                          className="w-full text-xs font-serif italic text-indigo-950 bg-white border border-slate-300 rounded-lg p-2 outline-none focus:border-indigo-600"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <canvas
                        ref={certCanvasRef}
                        width={300}
                        height={60}
                        onMouseDown={startCertDrawing}
                        onMouseMove={drawCert}
                        onMouseUp={stopCertDrawing}
                        onMouseLeave={stopCertDrawing}
                        className="bg-white border border-slate-300 rounded-lg cursor-crosshair w-full"
                      />
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Draw signature above</span>
                        <button
                          type="button"
                          onClick={clearCertCanvas}
                          className="text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <Eraser className="w-3 h-3" /> Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2. ACCREDITATION SECTION ================= */}
        <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-sm bg-white">
          {/* Section Header Bar */}
          <div className="bg-slate-800 px-5 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold tracking-wide uppercase">Accreditation</h4>
            </div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(accData.level)}`}>
              {accData.level}
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Row 1: Awarded Accreditation Level */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider md:col-span-1">
                Level of Accreditation awarded
              </label>
              <div className="md:col-span-3">
                {readOnly ? (
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getBadgeStyle(accData.level)}`}>
                    {accData.level}
                  </span>
                ) : (
                  <select
                    value={accData.level}
                    onChange={(e) => updateAcc("level", e.target.value as AccreditationLevel)}
                    className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15"
                  >
                    <option value="Accreditation">Accreditation</option>
                    <option value="Qualified Accreditation">Qualified Accreditation</option>
                    <option value="Not Accredited">Not Accredited</option>
                    <option value="Pending Assessment">Pending Assessment</option>
                  </select>
                )}
              </div>
            </div>

            {/* Row 2: Comments */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Comments & Executive Authorization Notes
              </label>
              {readOnly ? (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs leading-relaxed text-slate-700 font-medium">
                  {accData.comments || "No comments provided."}
                </div>
              ) : (
                <textarea
                  rows={3}
                  value={accData.comments}
                  onChange={(e) => updateAcc("comments", e.target.value)}
                  placeholder="Enter accreditation comments, organizational risk tolerance conditions, or executive notes..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 font-medium leading-relaxed"
                />
              )}
            </div>

            {/* Row 3: Declaration Confirmation Text */}
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-150 flex items-start gap-3">
              <input
                type="checkbox"
                id="acc-declaration-check"
                checked={accData.declarationConfirmed}
                disabled={readOnly}
                onChange={(e) => updateAcc("declarationConfirmed", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
              <label htmlFor="acc-declaration-check" className="text-xs italic text-slate-700 leading-relaxed font-medium cursor-pointer">
                I accept the current residual risks as outlined in this report and I confirm that the remediation plan (if any) will be implemented within the indicated timeframes.
              </label>
            </div>

            {/* Row 4: Signatory Details & Digital Signature */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-150">
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Executive Sponsor / Deputy Chief Executive
                  </label>
                  {readOnly ? (
                    <div className="font-bold text-slate-900 text-xs mt-1">
                      {accData.signatory.name}, {accData.signatory.title}
                    </div>
                  ) : (
                    <div className="space-y-2 mt-1">
                      <input
                        type="text"
                        value={accData.signatory.name}
                        onChange={(e) => updateAccSignatory("name", e.target.value)}
                        placeholder="Signatory Name"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-semibold"
                      />
                      <input
                        type="text"
                        value={accData.signatory.title}
                        onChange={(e) => updateAccSignatory("title", e.target.value)}
                        placeholder="Official Title"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 font-medium"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Date of Accreditation
                  </label>
                  {readOnly ? (
                    <div className="font-mono text-slate-800 text-xs font-semibold mt-1">
                      {accData.signatory.date}
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={accData.signatory.date}
                      onChange={(e) => updateAccSignatory("date", e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono mt-1"
                    />
                  )}
                </div>
              </div>

              {/* Signature Capture Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Executive Signature
                  </label>
                  {!readOnly && (
                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setAccSigMode("type")}
                        className={`px-2 py-0.5 rounded font-bold transition-colors ${accSigMode === "type" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      >
                        Typed
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccSigMode("draw")}
                        className={`px-2 py-0.5 rounded font-bold transition-colors ${accSigMode === "draw" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      >
                        Draw
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-h-[90px] flex flex-col justify-center relative">
                  {accSigMode === "type" || readOnly ? (
                    <div className="space-y-1">
                      {readOnly ? (
                        accData.signatory.signature ? (
                          accData.signatory.signature.startsWith("data:image") ? (
                            <img src={accData.signatory.signature} alt="Executive Signature" className="h-10 object-contain" />
                          ) : (
                            <div className="font-serif italic text-lg text-emerald-950 tracking-wider font-semibold border-b border-dashed border-emerald-300 pb-1 inline-block">
                              {accData.signatory.signature}
                            </div>
                          )
                        ) : (
                          <span className="text-slate-400 italic text-xs">Unsigned</span>
                        )
                      ) : (
                        <input
                          type="text"
                          value={accData.signatory.signature}
                          onChange={(e) => updateAccSignatory("signature", e.target.value)}
                          placeholder="Type Executive Signature (e.g. Marcus Vance)"
                          className="w-full text-xs font-serif italic text-emerald-950 bg-white border border-slate-300 rounded-lg p-2 outline-none focus:border-emerald-600"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <canvas
                        ref={accCanvasRef}
                        width={300}
                        height={60}
                        onMouseDown={startAccDrawing}
                        onMouseMove={drawAcc}
                        onMouseUp={stopAccDrawing}
                        onMouseLeave={stopAccDrawing}
                        className="bg-white border border-slate-300 rounded-lg cursor-crosshair w-full"
                      />
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Draw signature above</span>
                        <button
                          type="button"
                          onClick={clearAccCanvas}
                          className="text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <Eraser className="w-3 h-3" /> Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
