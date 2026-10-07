import { AuditLogEntry, AuditLogCategory, AuditLogSeverity } from "../types";

export interface LogEventParams {
  action: string;
  isoControl?: string; // Default: A.12.4.1
  category?: AuditLogCategory;
  severity?: AuditLogSeverity;
  targetResource?: {
    type: string;
    id: string;
    name: string;
  };
  details?: Record<string, any>;
  status?: "SUCCESS" | "FAILURE";
}

/**
 * Sends an ISO 27001 compliant audit log entry to the backend REST API
 */
export async function sendAuditLog(params: LogEventParams): Promise<AuditLogEntry | null> {
  try {
    const res = await fetch("/api/audit-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "USR-001",
        "x-user-email": "yan.aung@gmail.com"
      },
      body: JSON.stringify({
        action: params.action,
        isoControl: params.isoControl || "A.12.4.1",
        category: params.category || "GOVERNANCE",
        severity: params.severity || "INFO",
        actor: {
          userId: "USR-001",
          email: "yan.aung@gmail.com",
          role: "CISO",
          ipAddress: "192.168.1.104",
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "C&A Browser Client"
        },
        targetResource: params.targetResource || {
          type: "APPLICATION",
          id: "SYS-001",
          name: "C&A Portal"
        },
        details: params.details || {},
        status: params.status || "SUCCESS"
      })
    });

    if (!res.ok) {
      console.warn("Audit log server response non-OK:", res.statusText);
      return null;
    }

    const data = await res.json();
    return data.log;
  } catch (err) {
    console.error("Failed to send client audit log:", err);
    return null;
  }
}
