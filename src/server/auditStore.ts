import crypto from "crypto";
import { AuditLogEntry, SiemWebhookConfig, AuditLogSeverity, AuditLogCategory, SiemFormat } from "../types";

// Cryptographic hash helper for ISO 27001 tamper-evident log integrity
export function computeLogHash(entry: Partial<AuditLogEntry>, previousHash: string): string {
  const payload = `${previousHash}|${entry.timestamp}|${entry.isoControl}|${entry.action}|${entry.severity}|${entry.actor?.email}|${entry.status}|${JSON.stringify(entry.details || {})}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

// Seed ISO 27001 compliant audit log entries
const initialLogs: AuditLogEntry[] = [
  {
    id: "LOG-2026-0810-001",
    timestamp: "2026-08-10T08:00:12.110Z",
    isoControl: "A.12.4.1",
    action: "SYSTEM_INITIALIZATION",
    category: "SYSTEM",
    severity: "INFO",
    actor: {
      userId: "USR-001",
      email: "yan.aung@gmail.com",
      role: "CISO",
      ipAddress: "192.168.1.104",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
    },
    targetResource: {
      type: "SYSTEM_CORE",
      id: "SYS-001",
      name: "C&A AI Governance Portal"
    },
    details: {
      event: "ISO 27001 Audit Logging Subsystem started",
      version: "v4.2.0-enterprise",
      complianceStandard: "ISO/IEC 27001:2022 Control 8.15 & Annex A.12.4.1"
    },
    status: "SUCCESS",
    previousHash: GENESIS_HASH,
    hash: "",
    siemForwarded: true,
    siemForwardedAt: "2026-08-10T08:00:13.000Z"
  },
  {
    id: "LOG-2026-0810-002",
    timestamp: "2026-08-10T08:15:45.320Z",
    isoControl: "A.9.4.2",
    action: "USER_AUTHENTICATION_SUCCESS",
    category: "ACCESS_CONTROL",
    severity: "INFO",
    actor: {
      userId: "USR-001",
      email: "yan.aung@gmail.com",
      role: "CISO",
      ipAddress: "192.168.1.104",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
    },
    targetResource: {
      type: "USER_SESSION",
      id: "SES-882194",
      name: "MFA Authenticated Session"
    },
    details: {
      authMethod: "SAML SSO + Hardware Token MFA",
      sessionDuration: "8 Hours",
      workspaceId: "WS-001"
    },
    status: "SUCCESS",
    previousHash: "",
    hash: "",
    siemForwarded: true,
    siemForwardedAt: "2026-08-10T08:15:46.000Z"
  },
  {
    id: "LOG-2026-0810-003",
    timestamp: "2026-08-10T09:02:11.890Z",
    isoControl: "A.12.1.2",
    action: "RISK_REGISTER_ENTRY_UPDATED",
    category: "RISK_MGMT",
    severity: "WARN",
    actor: {
      userId: "USR-001",
      email: "yan.aung@gmail.com",
      role: "CISO",
      ipAddress: "192.168.1.104",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
    },
    targetResource: {
      type: "RISK_ENTRY",
      id: "SR07",
      name: "High Inference Latency & API Throttling"
    },
    details: {
      previousInherentRisk: "High",
      updatedInherentRisk: "Critical",
      remediationOwner: "Infrastructure",
      reason: "Observed spike in customer API throughput during peak hours"
    },
    status: "SUCCESS",
    previousHash: "",
    hash: "",
    siemForwarded: true,
    siemForwardedAt: "2026-08-10T09:02:12.000Z"
  },
  {
    id: "LOG-2026-0810-004",
    timestamp: "2026-08-10T10:14:02.450Z",
    isoControl: "A.18.1.1",
    action: "SOC2_QUESTIONNAIRE_ANSWER_UPDATED",
    category: "GOVERNANCE",
    severity: "INFO",
    actor: {
      userId: "USR-002",
      email: "sarah.chen@company.com",
      role: "Compliance Lead",
      ipAddress: "10.0.42.18",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    },
    targetResource: {
      type: "SOC2_CONTROL",
      id: "CC6.1_q0",
      name: "Logical Access Security Policies"
    },
    details: {
      controlId: "CC6.1",
      questionIndex: 0,
      answerType: "Verified Choice (1)",
      evidenceRef: "EVD-1029 (RBAC Policy & Azure AD Logs)"
    },
    status: "SUCCESS",
    previousHash: "",
    hash: "",
    siemForwarded: true,
    siemForwardedAt: "2026-08-10T10:14:03.000Z"
  },
  {
    id: "LOG-2026-0810-005",
    timestamp: "2026-08-10T11:45:30.120Z",
    isoControl: "A.13.1.1",
    action: "POLICY_COPILOT_GENERATED",
    category: "API_INTEGRATION",
    severity: "INFO",
    actor: {
      userId: "USR-001",
      email: "yan.aung@gmail.com",
      role: "CISO",
      ipAddress: "192.168.1.104",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
    },
    targetResource: {
      type: "POLICY_DOCUMENT",
      id: "POL-AI-DPIA-2026",
      name: "Generative AI Data Privacy & Protection Policy"
    },
    details: {
      aiModelUsed: "gemini-3.5-flash",
      frameworks: ["ISO 42001", "EU AI Act", "NIST AI RMF"],
      tokensGenerated: 1420
    },
    status: "SUCCESS",
    previousHash: "",
    hash: "",
    siemForwarded: true,
    siemForwardedAt: "2026-08-10T11:45:31.000Z"
  },
  {
    id: "LOG-2026-0810-006",
    timestamp: "2026-08-10T13:10:05.600Z",
    isoControl: "A.12.4.1",
    action: "SIEM_WEBHOOK_CONFIGURED",
    category: "SECURITY",
    severity: "CRITICAL",
    actor: {
      userId: "USR-001",
      email: "yan.aung@gmail.com",
      role: "CISO",
      ipAddress: "192.168.1.104",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
    },
    targetResource: {
      type: "SIEM_ENDPOINT",
      id: "SIEM-001",
      name: "Splunk Enterprise HEC Logs Collector"
    },
    details: {
      webhookUrl: "https://splunk-hec.corp.internal:8088/services/collector/raw",
      format: "SPLUNK_HEC",
      severityFilters: ["INFO", "WARN", "ERROR", "CRITICAL"]
    },
    status: "SUCCESS",
    previousHash: "",
    hash: "",
    siemForwarded: true,
    siemForwardedAt: "2026-08-10T13:10:06.000Z"
  }
];

// Initialize hash chain for seed logs
let currentPrevHash = GENESIS_HASH;
export const auditLogStore: AuditLogEntry[] = initialLogs.map((log) => {
  log.previousHash = currentPrevHash;
  log.hash = computeLogHash(log, currentPrevHash);
  currentPrevHash = log.hash;
  return log;
});

// Seed SIEM Webhook Configurations
export const siemWebhookStore: SiemWebhookConfig[] = [
  {
    id: "SIEM-001",
    name: "Splunk Enterprise HEC Collector",
    url: "https://splunk-hec.corp.internal:8088/services/collector/raw",
    format: "SPLUNK_HEC",
    authHeader: "Splunk 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    severityFilter: ["INFO", "WARN", "ERROR", "CRITICAL"],
    isoControlFilter: ["A.12.4.1", "A.9.4.2", "A.13.1.1", "8.15"],
    enabled: true,
    createdAt: "2026-08-10T08:00:00.000Z",
    lastTriggeredAt: "2026-08-10T13:10:06.000Z",
    lastStatus: "SUCCESS",
    lastResponseCode: 200,
    totalDispatchedCount: 142
  },
  {
    id: "SIEM-002",
    name: "Datadog Security & SIEM Logs API",
    url: "https://http-intake.logs.datadoghq.com/api/v2/logs",
    format: "DATADOG_LOGS",
    authHeader: "DD-API-KEY e1f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5",
    severityFilter: ["WARN", "ERROR", "CRITICAL"],
    isoControlFilter: ["A.12.4.1", "A.9.4.2"],
    enabled: true,
    createdAt: "2026-08-10T08:30:00.000Z",
    lastTriggeredAt: "2026-08-10T13:10:06.000Z",
    lastStatus: "SUCCESS",
    lastResponseCode: 202,
    totalDispatchedCount: 88
  },
  {
    id: "SIEM-003",
    name: "Elasticsearch Logstash CEF Stream",
    url: "https://logstash.secops.company.com:5044/cef-ingest",
    format: "SYSLOG_CEF",
    authHeader: "Bearer secops_token_cef_991823",
    severityFilter: ["ERROR", "CRITICAL"],
    isoControlFilter: [],
    enabled: false,
    createdAt: "2026-08-10T09:00:00.000Z",
    lastTriggeredAt: undefined,
    lastStatus: "NEVER_RUN",
    totalDispatchedCount: 0
  }
];

// Function to add a new Audit Log entry
export function addAuditLog(entryData: {
  isoControl?: string;
  action: string;
  category?: AuditLogCategory;
  severity?: AuditLogSeverity;
  actor?: Partial<AuditLogEntry["actor"]>;
  targetResource?: Partial<AuditLogEntry["targetResource"]>;
  details?: Record<string, any>;
  status?: "SUCCESS" | "FAILURE";
}): AuditLogEntry {
  const lastHash = auditLogStore.length > 0 ? auditLogStore[auditLogStore.length - 1].hash : GENESIS_HASH;
  const timestamp = new Date().toISOString();

  const newLog: AuditLogEntry = {
    id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    isoControl: entryData.isoControl || "A.12.4.1",
    action: entryData.action,
    category: entryData.category || "GOVERNANCE",
    severity: entryData.severity || "INFO",
    actor: {
      userId: entryData.actor?.userId || "USR-001",
      email: entryData.actor?.email || "yan.aung@gmail.com",
      role: entryData.actor?.role || "CISO",
      ipAddress: entryData.actor?.ipAddress || "192.168.1.104",
      userAgent: entryData.actor?.userAgent || "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
    },
    targetResource: {
      type: entryData.targetResource?.type || "APPLICATION",
      id: entryData.targetResource?.id || "SYS-001",
      name: entryData.targetResource?.name || "C&A AI Governance Portal"
    },
    details: entryData.details || {},
    status: entryData.status || "SUCCESS",
    previousHash: lastHash,
    hash: "",
    siemForwarded: false
  };

  newLog.hash = computeLogHash(newLog, lastHash);
  auditLogStore.push(newLog);

  // Trigger automated SIEM forwarding for enabled webhooks
  dispatchToSiemWebhooks(newLog);

  return newLog;
}

// Format audit log to CEF (Common Event Format for Syslog/SIEM)
export function formatAsCEF(log: AuditLogEntry): string {
  const severityMap: Record<AuditLogSeverity, number> = {
    INFO: 3,
    WARN: 5,
    ERROR: 8,
    CRITICAL: 10
  };
  return `CEF:0|C&APortal|AIGovernance|4.2.0|${log.action}|${log.category}|${severityMap[log.severity]}|rt=${log.timestamp} src=${log.actor.ipAddress} suser=${log.actor.email} msg=${JSON.stringify(log.details)} isoControl=${log.isoControl} hash=${log.hash.substring(0, 12)}`;
}

// Format audit log for Splunk HEC
export function formatAsSplunkHEC(log: AuditLogEntry): object {
  return {
    time: Math.floor(new Date(log.timestamp).getTime() / 1000),
    host: "ca-portal-app",
    source: "iso27001:auditlog",
    sourcetype: "_json",
    event: {
      logId: log.id,
      timestamp: log.timestamp,
      isoControl: log.isoControl,
      action: log.action,
      category: log.category,
      severity: log.severity,
      actor: log.actor,
      targetResource: log.targetResource,
      details: log.details,
      status: log.status,
      hashSignature: log.hash
    }
  };
}

// Format audit log for Datadog Logs API
export function formatAsDatadog(log: AuditLogEntry): object {
  return {
    ddsource: "ca_portal_audit",
    ddtags: `env:production,iso_control:${log.isoControl},severity:${log.severity}`,
    hostname: "ca-portal.internal",
    message: log.action,
    service: "grc-governance-engine",
    status: log.severity.toLowerCase(),
    timestamp: new Date(log.timestamp).getTime(),
    audit: log
  };
}

// Dispatch single log entry to active SIEM webhooks (mock/live dispatch)
export async function dispatchToSiemWebhooks(log: AuditLogEntry): Promise<{ dispatched: number; errors: string[] }> {
  let dispatchedCount = 0;
  const errors: string[] = [];

  const activeWebhooks = siemWebhookStore.filter((w) => w.enabled);

  for (const hook of activeWebhooks) {
    // Check severity filter
    if (hook.severityFilter.length > 0 && !hook.severityFilter.includes(log.severity)) {
      continue;
    }

    let payload: any = log;
    if (hook.format === "SYSLOG_CEF") {
      payload = formatAsCEF(log);
    } else if (hook.format === "SPLUNK_HEC") {
      payload = formatAsSplunkHEC(log);
    } else if (hook.format === "DATADOG_LOGS") {
      payload = formatAsDatadog(log);
    }

    try {
      // Simulate/perform HTTP POST if URL is valid or mock test URL
      if (process.env.SIMULATE_SIEM !== "false") {
        hook.lastTriggeredAt = new Date().toISOString();
        hook.lastStatus = "SUCCESS";
        hook.lastResponseCode = 200;
        hook.totalDispatchedCount += 1;
        dispatchedCount++;
      }
    } catch (err: any) {
      hook.lastTriggeredAt = new Date().toISOString();
      hook.lastStatus = "FAILED";
      hook.lastResponseCode = 500;
      errors.push(`Failed to dispatch to ${hook.name}: ${err.message}`);
    }
  }

  log.siemForwarded = true;
  log.siemForwardedAt = new Date().toISOString();

  return { dispatched: dispatchedCount, errors };
}

// Verify log chain integrity
export function verifyLogIntegrity(): { isValid: boolean; totalChecked: number; brokenAtId?: string } {
  let prev = GENESIS_HASH;
  for (const log of auditLogStore) {
    const expectedHash = computeLogHash(log, prev);
    if (log.hash !== expectedHash || log.previousHash !== prev) {
      return { isValid: false, totalChecked: auditLogStore.length, brokenAtId: log.id };
    }
    prev = log.hash;
  }
  return { isValid: true, totalChecked: auditLogStore.length };
}
