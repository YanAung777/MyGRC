import React, { useState } from "react";
import {
  ShieldCheck,
  Key,
  Smartphone,
  Lock,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Fingerprint
} from "lucide-react";
import { sendAuditLog } from "../services/auditLoggerService";

interface MfaStepUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionTitle?: string;
  actionDescription?: string;
  userEmail?: string;
}

export default function MfaStepUpModal({
  isOpen,
  onClose,
  onSuccess,
  actionTitle = "Privileged Action Step-Up Authentication Required",
  actionDescription = "Per ISO 27001 A.9.4 & SOC 2 CC6.1 controls, high-impact compliance approvals require step-up MFA verification.",
  userEmail = "yan.aung@gmail.com"
}: MfaStepUpModalProps) {
  const [mfaMethod, setMfaMethod] = useState<"totp" | "webauthn">("totp");
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isWebAuthnActive, setIsWebAuthnActive] = useState(false);

  if (!isOpen) return null;

  const handleVerifyTotp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (totpCode.trim().length !== 6 || !/^\d{6}$/.test(totpCode.trim())) {
      setError("Invalid 6-digit TOTP code. Please enter the code from Google Authenticator or Duo.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      sendAuditLog({
        action: "MFA_STEP_UP_VERIFIED",
        isoControl: "A.9.4.2",
        category: "SECURITY",
        targetResource: { type: "MFA_STEP_UP", id: "mfa-totp", name: actionTitle },
        details: {
          method: "TOTP_AUTHENTICATOR",
          userEmail,
          actionTitle,
          verificationResult: "SUCCESS"
        }
      });
      onSuccess();
      onClose();
    }, 600);
  };

  const handleSimulateWebAuthn = () => {
    setError(null);
    setIsWebAuthnActive(true);
    setTimeout(() => {
      setIsWebAuthnActive(false);
      sendAuditLog({
        action: "MFA_STEP_UP_VERIFIED",
        isoControl: "A.9.4.2",
        category: "SECURITY",
        targetResource: { type: "MFA_STEP_UP", id: "mfa-webauthn", name: actionTitle },
        details: {
          method: "WEBAUTHN_FIDO2_PASSKEY",
          userEmail,
          actionTitle,
          verificationResult: "SUCCESS"
        }
      });
      onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-indigo-300">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-700/80 px-2 py-0.5 rounded">
                  ISO 27001 / SOC 2
                </span>
                <span className="text-[10px] font-mono text-indigo-300">MFA Step-Up</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">Verification Required</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">{actionTitle}</span>
            <p className="leading-relaxed text-slate-500 dark:text-slate-400">{actionDescription}</p>
            <div className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Identity: {userEmail}
            </div>
          </div>

          {/* MFA Method Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMfaMethod("totp")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                mfaMethod === "totp"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-4 h-4" /> Authenticator App
            </button>
            <button
              onClick={() => setMfaMethod("webauthn")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                mfaMethod === "webauthn"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Fingerprint className="w-4 h-4" /> WebAuthn / Passkey
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mfaMethod === "totp" ? (
            <form onSubmit={handleVerifyTotp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-9 pr-4 py-2.5 text-center font-mono text-lg tracking-[0.3em] font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter the current code from your TOTP app (e.g. Google Authenticator, Duo). Demo code: <span className="font-mono text-indigo-500 font-bold">123456</span> or any 6 digits.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying || totpCode.length !== 6}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying Code...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Verify &amp; Proceed
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center py-2">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 inline-block">
                <Fingerprint className={`w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto ${isWebAuthnActive ? "animate-pulse" : ""}`} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">WebAuthn / FIDO2 Security Key</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Touch your YubiKey or authenticate with Touch ID / Face ID to verify identity.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSimulateWebAuthn}
                  disabled={isWebAuthnActive}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center gap-2"
                >
                  {isWebAuthnActive ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating Biometrics...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Touch Security Key
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
