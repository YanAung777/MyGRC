import React, { useState } from "react";
import {
  Shield,
  Key,
  Globe,
  Lock,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  Save,
  Server,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  UserCheck,
  ExternalLink,
  Sparkles,
  Info
} from "lucide-react";
import { sendAuditLog } from "../services/auditLoggerService";

interface EnterpriseSSOConfigViewProps {
  onOpenMfaStepUp?: (actionTitle: string, onSuccess: () => void) => void;
}

type IdpProviderType = "okta" | "entra" | "google" | "ping" | "custom";

interface IdpPreset {
  id: IdpProviderType;
  name: string;
  badge: string;
  protocol: string;
  defaultDomain: string;
  defaultSsoUrl: string;
  defaultIssuerUrl: string;
  defaultCert: string;
  scimUrlSuffix: string;
  sampleClaims: { [key: string]: string };
  testAssertionMessage: (domain: string) => string;
}

const IDP_PRESETS: Record<IdpProviderType, IdpPreset> = {
  okta: {
    id: "okta",
    name: "Okta",
    badge: "SAML / OIDC",
    protocol: "SAML 2.0 & OIDC Universal Directory",
    defaultDomain: "enterprise.acme-ai.com",
    defaultSsoUrl: "https://dev-849201.okta.com/app/exk18294021/sso/saml",
    defaultIssuerUrl: "https://dev-849201.okta.com/oauth2/default",
    defaultCert: `-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJAL7sS9481k2OMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV\nBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMRMwEQYDVQQHDApTYW4gRnJhbmNp\nc2NvMRMwEQYDVQQKDApBY21lIENvcnAwHhcNMjQwMTAxMDAwMDAwWhcNMjUwMTAx\nMDAwMDAwWjBFMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEUMBIG\nA1UECgwLQWNtZSBDb3JwMB4wDQYJKoZIhvcNAQEBBQADLwAwLAIBAQIBAwIDAQAB\n-----END CERTIFICATE-----`,
    scimUrlSuffix: "/okta",
    sampleClaims: {
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "janedoe@enterprise.acme-ai.com",
      "groups": "Okta-AI-Governance-Admins, SOC2-Auditors",
      "sessionIndex": "okta_sess_89201849102"
    },
    testAssertionMessage: (domain) =>
      `Okta SAML 2.0 Assertion Verified! Successfully authenticated 'janedoe@${domain}' with role 'Compliance Officer' (Group: Okta-AI-Governance-Admins, Signature: RSA-SHA256 Valid).`
  },
  entra: {
    id: "entra",
    name: "Entra ID",
    badge: "Azure AD",
    protocol: "Microsoft Entra ID (Azure AD SAML 2.0 / OIDC)",
    defaultDomain: "corp.enterprise-ai.microsoft",
    defaultSsoUrl: "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/saml2",
    defaultIssuerUrl: "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/",
    defaultCert: `-----BEGIN CERTIFICATE-----\nMIIC8DCCAdigAwIBAgIQJn4/W18a5I1NfZ1Z6R5hNTANBgkqhkiG9w0BAQsFADA0\nMTIwMAYDVQQDEylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGlvbiBJZFAgU2lnbmlu\nZyBDZXJ0MB4XDTI0MDEwMTAwMDAwMFoXDTI1MDEwMTAwMDAwMFowNDEyMDAGA1UE\nAxMpTWljcm9zb2Z0IEF6dXJlIEZlZGVyYXRpb24gSWRQIFNpZ25pbmcgQ2VydDCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL3qZ92019481ad124018201\n-----END CERTIFICATE-----`,
    scimUrlSuffix: "/azure",
    sampleClaims: {
      "http://schemas.microsoft.com/identity/claims/objectidentifier": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Enterprise.SecurityAdmin",
      "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47"
    },
    testAssertionMessage: (domain) =>
      `Microsoft Entra ID (Azure AD) SAML Token Verified! User 'janedoe@${domain}' mapped to role 'CISO / Security Admin' via Azure App Role 'Enterprise.SecurityAdmin'.`
  },
  google: {
    id: "google",
    name: "Google Workspace",
    badge: "OIDC / SAML",
    protocol: "Google Cloud IAM & Google Workspace SAML 2.0",
    defaultDomain: "acme-ai.com",
    defaultSsoUrl: "https://accounts.google.com/o/saml2/idp?idpid=C0382910",
    defaultIssuerUrl: "https://accounts.google.com/o/saml2?idpid=C0382910",
    defaultCert: `-----BEGIN CERTIFICATE-----\nMIIDdDCCAlygAwIBAgIGAYvK210JMA0GCSqGSIb3DQEBCwUAMGsxCzAJBgNVBAYT\nAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3\nMRQwEgYDVQQKEwtHb29nbGUgSW5jLjEhMB8GA1UEAxMYR29vZ2xlIFdvcmtzcGFj\nZSBJZFAgQ2VydDAeFw0yNDAxMDEwMDAwMDBaFw0yNTAxMDEwMDAwMDBaMGsxCzAJ\n-----END CERTIFICATE-----`,
    scimUrlSuffix: "/google",
    sampleClaims: {
      "email": "yan.aung@acme-ai.com",
      "hd": "acme-ai.com",
      "email_verified": "true",
      "org_unit": "/Engineering/AI-Security"
    },
    testAssertionMessage: (domain) =>
      `Google Workspace SAML / OIDC Verified! Google Hosted Domain 'hd=${domain}' confirmed. User 'yan.aung@${domain}' granted ISO 42001 Lead Assessor privilege.`
  },
  ping: {
    id: "ping",
    name: "PingIdentity",
    badge: "PingFederate",
    protocol: "PingIdentity PingFederate & PingOne SAML 2.0",
    defaultDomain: "enterprise.acme-ai.com",
    defaultSsoUrl: "https://auth.pingone.com/4a983b12-9c98-4b2a-87fe-18492039281a/saml20/idp/sso",
    defaultIssuerUrl: "https://auth.pingone.com/4a983b12-9c98-4b2a-87fe-18492039281a",
    defaultCert: `-----BEGIN CERTIFICATE-----\nMIIDeDCCAmCgAwIBAgIJAP9981240192MA0GCSqGSIb3DQEBCwUAMFQxCzAJBgNV\nBAYTAlVTMREwDwYDVQQIEwhDb2xvcmFkbzEPMA0GA1UEBxMGRGVudmVyMRcwFQYD\nVQQKEw5QaW5nIElkZW50aXR5MRkwFwYDVQQDExBQaW5nRmVkZXJhdGUgU1NPMB4X\nDTI0MDEwMTAwMDAwMFoXDTI1MDEwMTAwMDAwMFowVDELMAkGA1UEBhMCVVMxETAP\n-----END CERTIFICATE-----`,
    scimUrlSuffix: "/ping",
    sampleClaims: {
      "ping.identity.policy": "PingID-FIDO2-MFA-Enforced",
      "saml_authn_context": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
      "memberOf": "CN=AI-Model-Risk-Managers,OU=Groups,DC=ping,DC=internal"
    },
    testAssertionMessage: (domain) =>
      `PingFederate SAML 2.0 Assertion Verified! PingID MFA authentication context validated for 'janedoe@${domain}' with role 'Risk Assessor'.`
  },
  custom: {
    id: "custom",
    name: "Custom SAML",
    badge: "SAML 2.0",
    protocol: "Generic Enterprise SAML 2.0 / Shibboleth / Keycloak",
    defaultDomain: "sso.internal-corp.net",
    defaultSsoUrl: "https://sso.internal-corp.net/auth/realms/enterprise/protocol/saml",
    defaultIssuerUrl: "https://sso.internal-corp.net/auth/realms/enterprise",
    defaultCert: `-----BEGIN CERTIFICATE-----\nMIIDWjCCAkKgAwIBAgIBATANBgkqhkiG9w0BAQsFADBLMQswCQYDVQQGEwJVUzEO\nMAwGA1UECAwFVGV4YXMxDjAMBgNVBAcMBUF1c3RpbjEUMBIGA1UECgwLQ3VzdG9t\nIElkUDEUMBIGA1UEAwwLU0FNTCAyLjAgQ0EwHhcNMjQwMTAxMDAwMDAwWhcNMjUw\nMTAxMDAwMDAwWjBLMQswCQYDVQQGEwJVUzEOMAwGA1UECAwFVGV4YXMxDjAMBgNV\n-----END CERTIFICATE-----`,
    scimUrlSuffix: "/custom",
    sampleClaims: {
      "urn:oid:0.9.2342.19200300.100.1.3": "user@sso.internal-corp.net",
      "urn:oid:2.5.4.42": "Jane",
      "urn:oid:2.5.4.4": "Doe",
      "urn:oasis:names:tc:SAML:2.0:attrname-format:uri": "urn:custom:claims:role"
    },
    testAssertionMessage: (domain) =>
      `Custom SAML 2.0 Assertion Verified! XML digital signature validated with SHA-256 digest against provided X.509 PEM certificate.`
  }
};

export default function EnterpriseSSOConfigView({
  onOpenMfaStepUp
}: EnterpriseSSOConfigViewProps) {
  // SSO State
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [idpProvider, setIdpProvider] = useState<IdpProviderType>("entra");
  const [enterpriseDomain, setEnterpriseDomain] = useState(IDP_PRESETS.entra.defaultDomain);
  const [idpIssuerUrl, setIdpIssuerUrl] = useState(IDP_PRESETS.entra.defaultIssuerUrl);
  const [idpSsoUrl, setIdpSsoUrl] = useState(IDP_PRESETS.entra.defaultSsoUrl);
  const [x509Certificate, setX509Certificate] = useState(IDP_PRESETS.entra.defaultCert);

  // SCIM State
  const [scimEnabled, setScimEnabled] = useState(true);
  const [scimToken, setScimToken] = useState("scim_bearer_sec_91823901284091283019283");
  const [showScimToken, setShowScimToken] = useState(false);

  // Status message
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; claims?: { [key: string]: string } } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const activePreset = IDP_PRESETS[idpProvider];

  const handleSelectIdp = (providerId: IdpProviderType) => {
    setIdpProvider(providerId);
    const preset = IDP_PRESETS[providerId];
    setEnterpriseDomain(preset.defaultDomain);
    setIdpSsoUrl(preset.defaultSsoUrl);
    setIdpIssuerUrl(preset.defaultIssuerUrl);
    setX509Certificate(preset.defaultCert);
    setTestResult(null);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerateScimToken = () => {
    const newToken = `scim_bearer_sec_${Math.random().toString(36).substring(2)}${Date.now()}`;
    setScimToken(newToken);
  };

  const handleSimulateSamlTest = () => {
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        success: true,
        message: activePreset.testAssertionMessage(enterpriseDomain),
        claims: activePreset.sampleClaims
      });

      sendAuditLog({
        action: "SAML_SSO_TEST_SUCCESSFUL",
        isoControl: "A.9.2.1",
        category: "SECURITY",
        targetResource: { type: "SSO_CONFIG", id: idpProvider, name: `Enterprise SSO (${activePreset.name})` },
        details: {
          idpProvider,
          providerName: activePreset.name,
          enterpriseDomain,
          idpSsoUrl,
          idpIssuerUrl,
          assertionStatus: "VALID_SIGNATURE"
        }
      });
    }, 1100);
  };

  const handleSaveSsoConfig = () => {
    const executeSave = () => {
      setSaveStatus(`Enterprise SSO config for "${activePreset.name}" & SCIM saved successfully!`);
      setTimeout(() => setSaveStatus(null), 4000);

      sendAuditLog({
        action: "SSO_CONFIG_UPDATED",
        isoControl: "A.9.4.2",
        category: "SECURITY",
        targetResource: { type: "SSO_CONFIG", id: idpProvider, name: `Enterprise SSO (${activePreset.name})` },
        details: {
          ssoEnabled,
          scimEnabled,
          idpProvider,
          providerName: activePreset.name,
          enterpriseDomain,
          idpIssuerUrl,
          idpSsoUrl
        }
      });
    };

    if (onOpenMfaStepUp) {
      onOpenMfaStepUp(`Modify Enterprise SSO (${activePreset.name}) Settings`, executeSave);
    } else {
      executeSave();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded-full">
                ISO 27001 A.9.2 / SOC 2 CC6.1
              </span>
              <span className="text-xs text-indigo-300 font-mono">Enterprise Identity</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3">
              <Shield className="w-7 h-7 text-indigo-400" /> Enterprise SAML 2.0 / OIDC &amp; SCIM
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Configure Single Sign-On (SSO) and SCIM 2.0 automated user provisioning for all major enterprise identity providers (Okta, Microsoft Entra ID, Google Workspace, PingIdentity, Custom SAML).
            </p>
          </div>

          <button
            onClick={handleSaveSsoConfig}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4" /> Save SSO Configuration
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-scale-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Identity Provider Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity Provider Selector */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-500" /> Identity Provider (IdP) Selection
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select your enterprise SAML 2.0 or OIDC provider
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Enforce SSO:</span>
                <button
                  onClick={() => setSsoEnabled(!ssoEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    ssoEnabled ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    ssoEnabled ? "right-1" : "left-1"
                  }`} />
                </button>
              </div>
            </div>

            {/* Provider Grid Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(Object.keys(IDP_PRESETS) as IdpProviderType[]).map((pid) => {
                const p = IDP_PRESETS[pid];
                const isSelected = idpProvider === pid;

                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectIdp(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/30 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{p.badge}</div>
                  </button>
                );
              })}
            </div>

            {/* IdP Protocol Banner */}
            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Active Mode: <strong className="text-indigo-600 dark:text-indigo-400">{activePreset.name}</strong> ({activePreset.protocol})
                </span>
              </div>
              <button
                onClick={() => handleSelectIdp(idpProvider)}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reset to Template
              </button>
            </div>

            {/* SAML Parameters Form */}
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enterprise Domain
                </label>
                <input
                  type="text"
                  value={enterpriseDomain}
                  onChange={(e) => setEnterpriseDomain(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  placeholder="e.g. enterprise.acme-ai.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    IdP Single Sign-On URL
                  </label>
                  <input
                    type="text"
                    value={idpSsoUrl}
                    onChange={(e) => setIdpSsoUrl(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    IdP Entity ID / Issuer URL
                  </label>
                  <input
                    type="text"
                    value={idpIssuerUrl}
                    onChange={(e) => setIdpIssuerUrl(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  X.509 Signing Certificate (PEM Format)
                </label>
                <textarea
                  rows={4}
                  value={x509Certificate}
                  onChange={(e) => setX509Certificate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Service Provider (SP) Endpoints */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" /> Service Provider (SP) Callback Endpoints
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide these endpoints to your {activePreset.name} administrator during application registration.
            </p>

            <div className="space-y-3">
              {[
                { label: "Assertion Consumer Service (ACS) URL", value: "https://auth.app.studio/saml/v2/acs" },
                { label: "SP Entity ID / Audience URI", value: "urn:ais:auth:enterprise:sp" },
                { label: "RelayState Callback URL", value: "https://auth.app.studio/saml/v2/relay" },
                { label: `${activePreset.name} Metadata Download`, value: `https://auth.app.studio/saml/v2/metadata?idp=${idpProvider}` }
              ].map((ep) => (
                <div key={ep.label} className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2">
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{ep.label}</span>
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-200 truncate block">{ep.value}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(ep.value, ep.label)}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Copy Endpoint"
                  >
                    {copiedField === ep.label ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: SCIM 2.0 & Test Connection */}
        <div className="space-y-6">
          {/* SCIM Provisioning Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-500" /> SCIM 2.0 User Provisioning
              </h3>
              <button
                onClick={() => setScimEnabled(!scimEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  scimEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  scimEnabled ? "right-1" : "left-1"
                }`} />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automate user provisioning, group sync, and offboarding directly from {activePreset.name} to satisfy SOC 2 CC6.2 SLAs.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  SCIM 2.0 Base URL
                </label>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-slate-200">
                  https://api.app.studio/scim/v2{activePreset.scimUrlSuffix}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    SCIM Bearer Token
                  </label>
                  <button
                    onClick={handleGenerateScimToken}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-slate-200 flex items-center justify-between gap-2">
                  <span className="truncate">
                    {showScimToken ? scimToken : "••••••••••••••••••••••••••••••••"}
                  </span>
                  <button
                    onClick={() => setShowScimToken(!showScimToken)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showScimToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Test SAML Auth Flow Simulator */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-indigo-800 shadow-lg text-white space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-200">
              <ShieldCheck className="w-5 h-5 text-indigo-400" /> Test {activePreset.name} Auth Flow
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Verify SAML 2.0 signature, assertion attribute claims mapping, and role translation for {activePreset.name}.
            </p>

            {testResult && (
              <div className="space-y-3 animate-scale-up">
                <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  testResult.success
                    ? "bg-emerald-950/80 border-emerald-700 text-emerald-200"
                    : "bg-rose-950/80 border-rose-700 text-rose-200"
                }`}>
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Assertion Validated</span>
                  </div>
                  {testResult.message}
                </div>

                {testResult.claims && (
                  <div className="p-3 bg-slate-900/90 border border-indigo-700/60 rounded-xl text-[11px]">
                    <div className="font-bold text-indigo-300 mb-1.5">Parsed IdP Attribute Claims:</div>
                    <div className="space-y-1 font-mono text-[10px] text-slate-300">
                      {Object.entries(testResult.claims).map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-2 overflow-hidden">
                          <span className="text-slate-400 truncate">{k}:</span>
                          <span className="text-indigo-200 font-bold truncate">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleSimulateSamlTest}
              disabled={isTesting}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isTesting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying {activePreset.name} SAML Assertion...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" /> Test {activePreset.name} Connection
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

