// Enterprise SSO & Authentication Modal
import React, { useState } from "react";
import {
  Shield,
  Lock,
  Globe,
  Key,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Fingerprint,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface SSOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SSOAuthModal({ isOpen, onClose }: SSOAuthModalProps) {
  const { user, signInWithGoogle, signInWithSSO, signInAsDemoPersona, signOut, isLoading } = useAuth();
  const [ssoDomain, setSsoDomain] = useState("onyx-ai.com");
  const [selectedProvider, setSelectedProvider] = useState<"google" | "azure" | "okta" | "ping">("google");
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      setAuthSuccessMsg("Successfully authenticated with Google Workspace SSO");
      setTimeout(() => {
        setAuthSuccessMsg(null);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnterpriseSSO = async (provider: string) => {
    try {
      await signInWithSSO(provider, `user@${ssoDomain}`);
      setAuthSuccessMsg(`Successfully authenticated via ${provider} SAML 2.0 Identity Provider`);
      setTimeout(() => {
        setAuthSuccessMsg(null);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  const demoPersonas = [
    {
      name: "Yan Aung",
      email: "yan.aung@gmail.com",
      role: "Compliance Lead",
      badge: "ISO 42001 Lead Assessor",
      company: "Onyx Enterprise AI",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    {
      name: "Elena Rostova",
      email: "ciso@onyx-ai.security",
      role: "Chief Information Security Officer (CISO)",
      badge: "Executive Admin",
      company: "Onyx Enterprise AI",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    {
      name: "Marcus Vance",
      email: "auditor@deloitte-external.com",
      role: "External ISO 42001 / SOC 2 Auditor",
      badge: "Auditor Access",
      company: "Deloitte Assurance",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    {
      name: "Alex Chen",
      email: "alex.chen@onyx-ai.internal",
      role: "AI/ML Engineer & Custodian",
      badge: "Developer / MLOps",
      company: "Onyx Enterprise AI",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-up border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Enterprise Identity &amp; SSO</h2>
              <p className="text-xs text-slate-400">
                SAML 2.0 • OpenID Connect • Firebase Auth • RBAC Provisioning
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {authSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {/* Active Session Card */}
          {user && (
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.photoUrl}
                  alt={user.displayName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{user.displayName}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                  <div className="text-[10px] text-slate-400">{user.role} • {user.company}</div>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Primary SSO Login Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Enterprise Identity Providers (IdP)
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">5 Providers Active</span>
            </div>

            {/* Corporate Domain Input for SAML Initiation */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Corporate Email Domain (SP-Initiated SSO)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">user@</span>
                  <input
                    type="text"
                    value={ssoDomain}
                    onChange={(e) => setSsoDomain(e.target.value)}
                    className="w-full pl-14 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono text-slate-900 focus:outline-indigo-500"
                    placeholder="enterprise.acme-ai.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Google Workspace */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="flex items-center gap-3 p-3 border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 rounded-xl transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                  G
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Google Workspace</div>
                  <div className="text-[10px] text-slate-500">OAuth 2.0 &amp; G-Suite SAML</div>
                </div>
              </button>

              {/* Microsoft Azure AD / Entra ID */}
              <button
                onClick={() => handleEnterpriseSSO("Microsoft Entra ID")}
                disabled={isLoading}
                className="flex items-center gap-3 p-3 border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 rounded-xl transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                  M
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Microsoft Entra ID</div>
                  <div className="text-[10px] text-slate-500">Azure AD SAML 2.0 / OIDC</div>
                </div>
              </button>

              {/* Okta SAML */}
              <button
                onClick={() => handleEnterpriseSSO("Okta Workforce Identity")}
                disabled={isLoading}
                className="flex items-center gap-3 p-3 border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 rounded-xl transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                  O
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Okta SAML 2.0</div>
                  <div className="text-[10px] text-slate-500">Universal Directory &amp; SCIM</div>
                </div>
              </button>

              {/* Ping Identity / SAML Federation */}
              <button
                onClick={() => handleEnterpriseSSO("PingIdentity (PingFederate)")}
                disabled={isLoading}
                className="flex items-center gap-3 p-3 border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 rounded-xl transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                  P
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">PingIdentity</div>
                  <div className="text-[10px] text-slate-500">PingFederate / PingOne</div>
                </div>
              </button>

              {/* Custom SAML 2.0 */}
              <button
                onClick={() => handleEnterpriseSSO("Custom SAML 2.0")}
                disabled={isLoading}
                className="sm:col-span-2 flex items-center gap-3 p-3 border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 rounded-xl transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Custom SAML 2.0 / Shibboleth</div>
                  <div className="text-[10px] text-slate-500">Standard XML Assertions &amp; Custom Federation</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick RBAC Persona Sign-In for instant simulation */}
          <div className="space-y-3 pt-4 border-t border-slate-150">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Role-Based Quick Access (RBAC)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Instant Persona Switch</span>
            </div>

            <div className="space-y-2">
              {demoPersonas.map((persona) => (
                <button
                  key={persona.email}
                  onClick={async () => {
                    await signInAsDemoPersona(persona);
                    setAuthSuccessMsg(`Switched session to ${persona.name} (${persona.role})`);
                    setTimeout(() => {
                      setAuthSuccessMsg(null);
                      onClose();
                    }, 900);
                  }}
                  className="w-full flex items-center justify-between p-2.5 border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 rounded-xl transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={persona.photoUrl}
                      alt={persona.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {persona.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{persona.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 rounded-md transition-colors">
                    {persona.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Fingerprint className="w-4 h-4 text-emerald-600" />
            <span>Encrypted with Cloud SQL PostgreSQL &amp; Firebase</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
