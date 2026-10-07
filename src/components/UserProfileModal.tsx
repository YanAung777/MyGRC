// User Profile & RBAC Permission Inspector Modal
import React, { useState } from "react";
import {
  User,
  Shield,
  Key,
  CheckCircle,
  Clock,
  Building,
  Mail,
  X,
  Lock,
  LogOut,
  Sparkles,
  Award,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSSOModal: () => void;
}

export default function UserProfileModal({ isOpen, onClose, onOpenSSOModal }: UserProfileModalProps) {
  const { user, signOut, updateRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.role || "Compliance Lead");
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    updateRole(newRole);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case "Chief Information Security Officer (CISO)":
        return [
          "Full Workspace Administration (ISO 27001 Clause 5.1)",
          "Final C&A Sign-off Authority",
          "Risk Appetite Calibration & Approval",
          "SIEM Export & Secret Key Management",
          "External Auditor Clearance Granting",
        ];
      case "External ISO 42001 / SOC 2 Auditor":
        return [
          "Read-Only GRC Evidence Room Clearance",
          "Digital Audit Stamp Authority (ISO 19011)",
          "Auditor Query Log Annotation",
          "Certification Gap Sheet Export",
        ];
      case "AI/ML Engineer & Custodian":
        return [
          "Model Registry Telemetry Ingestion",
          "CI/CD Quality Gate Pipeline Testing",
          "Model Card & Dataset Lineage Upload",
          "Fairness & Drift Metric Submission",
        ];
      default:
        return [
          "ISO 42001 & 27001 Control Requirement Editing",
          "AI Project & Risk Assessment Registration",
          "Evidence Document Verification & Tagging",
          "Automated Copilot Gap Report Generation",
        ];
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <img
              src={user.photoUrl}
              alt={user.displayName}
              className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{user.displayName}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Verified
                </span>
              </div>
              <p className="text-xs text-indigo-200 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5" />
                {user.company}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Role and RBAC permissions updated successfully!</span>
            </div>
          )}

          {/* Role & Access Tier */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Assigned Governance Role (RBAC)
            </label>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            >
              <option value="Compliance Lead">Compliance Lead (ISO 42001 / SOC 2 Assessor)</option>
              <option value="Chief Information Security Officer (CISO)">Chief Information Security Officer (CISO)</option>
              <option value="External ISO 42001 / SOC 2 Auditor">External ISO 42001 / SOC 2 Auditor</option>
              <option value="AI/ML Engineer & Custodian">AI/ML Engineer &amp; Custodian</option>
            </select>
          </div>

          {/* Permission Entitlements */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Active Entitlements &amp; Authorities</span>
            </div>
            <ul className="space-y-1.5">
              {getRolePermissions(selectedRole).map((perm, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{perm}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & MFA Status */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>Security &amp; MFA Status</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                TOTP Hardware Active
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Session is bound to hardware-backed Step-Up authentication for sensitive changes (sign-offs, deletions, policy publishing).
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenSSOModal();
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            Switch SSO Account / IdP
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await signOut();
                onClose();
              }}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
