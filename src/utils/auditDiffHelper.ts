import {
  AIProject,
  ModelRecord,
  EvidenceFile,
  RiskRecord,
  Vendor,
  OrganizationalPolicy,
  IncidentRecord,
  TeamMember,
  ProjectCASignOff
} from "../types";

export interface FieldDiff {
  field: string;
  section: string;
  previousValue: any;
  newValue: any;
}

export interface DetailedAuditChangePayload {
  section: string;
  hasApprovalChange: boolean;
  summaryOfChanges: string;
  fieldDiffs: FieldDiff[];
  approvalSection?: Record<string, any>;
  [key: string]: any;
}

/**
 * Computes deep differences and approval section details for AI Projects
 */
export function getProjectChangePayload(
  updated: AIProject,
  existing?: AIProject
): DetailedAuditChangePayload {
  const diffs: FieldDiff[] = [];
  let isCaSignOffChanged = false;

  if (existing) {
    // Check C&A Sign-off certification level & details
    const oldCert = existing.caSignOff?.certification;
    const newCert = updated.caSignOff?.certification;

    if (oldCert?.level !== newCert?.level) {
      isCaSignOffChanged = true;
      diffs.push({
        field: "Certification Level",
        section: "Approval & Certification Sign-Off",
        previousValue: oldCert?.level || "Pending Assessment",
        newValue: newCert?.level || "Pending Assessment"
      });
    }

    if (oldCert?.declarationConfirmed !== newCert?.declarationConfirmed) {
      isCaSignOffChanged = true;
      diffs.push({
        field: "CISO Declaration Confirmed",
        section: "Approval & Certification Sign-Off",
        previousValue: oldCert?.declarationConfirmed ?? false,
        newValue: newCert?.declarationConfirmed ?? false
      });
    }

    if (oldCert?.signatory?.confirmed !== newCert?.signatory?.confirmed) {
      isCaSignOffChanged = true;
      diffs.push({
        field: "CISO Signatory Confirmation",
        section: "Approval & Certification Sign-Off",
        previousValue: oldCert?.signatory?.confirmed ?? false,
        newValue: newCert?.signatory?.confirmed ?? false
      });
    }

    if (oldCert?.signatory?.name !== newCert?.signatory?.name) {
      isCaSignOffChanged = true;
      diffs.push({
        field: "CISO Signatory Name",
        section: "Approval & Certification Sign-Off",
        previousValue: oldCert?.signatory?.name || "",
        newValue: newCert?.signatory?.name || ""
      });
    }

    if (oldCert?.comments !== newCert?.comments) {
      isCaSignOffChanged = true;
      diffs.push({
        field: "Certification Comments",
        section: "Approval & Certification Sign-Off",
        previousValue: oldCert?.comments || "",
        newValue: newCert?.comments || ""
      });
    }

    // Check C&A Sign-off accreditation level & details
    const oldAcc = existing.caSignOff?.accreditation;
    const newAcc = updated.caSignOff?.accreditation;

    if (oldAcc?.level !== newAcc?.level) {
      isCaSignOffChanged = true;
      diffs.push({
        field: "Accreditation Level",
        section: "Approval & Accreditation Sign-Off",
        previousValue: oldAcc?.level || "Pending Assessment",
        newValue: newAcc?.level || "Pending Assessment"
      });
    }

    if (oldAcc?.declarationConfirmed !== newAcc?.declarationConfirmed) {
      isCaSignOffChanged = true;
      diffs.push({
        field: "Executive Declaration Confirmed",
        section: "Approval & Accreditation Sign-Off",
        previousValue: oldAcc?.declarationConfirmed ?? false,
        newValue: newAcc?.declarationConfirmed ?? false
      });
    }

    if (oldAcc?.signatory?.confirmed !== newAcc?.signatory?.confirmed) {
      isCaSignOffChanged = true;
      diffs.push({
        field: "Executive Signatory Confirmation",
        section: "Approval & Accreditation Sign-Off",
        previousValue: oldAcc?.signatory?.confirmed ?? false,
        newValue: newAcc?.signatory?.confirmed ?? false
      });
    }

    if (oldAcc?.signatory?.name !== newAcc?.signatory?.name) {
      isCaSignOffChanged = true;
      diffs.push({
        field: "Executive Signatory Name",
        section: "Approval & Accreditation Sign-Off",
        previousValue: oldAcc?.signatory?.name || "",
        newValue: newAcc?.signatory?.name || ""
      });
    }

    if (oldAcc?.comments !== newAcc?.comments) {
      isCaSignOffChanged = true;
      diffs.push({
        field: "Accreditation Comments",
        section: "Approval & Accreditation Sign-Off",
        previousValue: oldAcc?.comments || "",
        newValue: newAcc?.comments || ""
      });
    }

    // Other project metadata fields
    if (existing.title !== updated.title) {
      diffs.push({ field: "Project Title", section: "AI Projects Register", previousValue: existing.title, newValue: updated.title });
    }
    if (existing.status !== updated.status) {
      diffs.push({ field: "Project Status", section: "AI Projects Register", previousValue: existing.status, newValue: updated.status });
    }
    if (existing.riskClassification !== updated.riskClassification) {
      diffs.push({ field: "Risk Classification", section: "AI Projects Register", previousValue: existing.riskClassification, newValue: updated.riskClassification });
    }
    if (existing.owner !== updated.owner) {
      diffs.push({ field: "Project Owner", section: "AI Projects Register", previousValue: existing.owner, newValue: updated.owner });
    }
    if (existing.geography !== updated.geography) {
      diffs.push({ field: "Geography", section: "AI Projects Register", previousValue: existing.geography, newValue: updated.geography });
    }
  }

  const approvalSection = {
    certification: {
      level: updated.caSignOff?.certification?.level || "Pending Assessment",
      declarationConfirmed: updated.caSignOff?.certification?.declarationConfirmed ?? false,
      comments: updated.caSignOff?.certification?.comments || "",
      signatory: {
        name: updated.caSignOff?.certification?.signatory?.name || "",
        title: updated.caSignOff?.certification?.signatory?.title || "",
        date: updated.caSignOff?.certification?.signatory?.date || "",
        confirmed: updated.caSignOff?.certification?.signatory?.confirmed ?? false,
        hasSignatureData: Boolean(updated.caSignOff?.certification?.signatory?.signature)
      }
    },
    accreditation: {
      level: updated.caSignOff?.accreditation?.level || "Pending Assessment",
      declarationConfirmed: updated.caSignOff?.accreditation?.declarationConfirmed ?? false,
      comments: updated.caSignOff?.accreditation?.comments || "",
      signatory: {
        name: updated.caSignOff?.accreditation?.signatory?.name || "",
        title: updated.caSignOff?.accreditation?.signatory?.title || "",
        date: updated.caSignOff?.accreditation?.signatory?.date || "",
        confirmed: updated.caSignOff?.accreditation?.signatory?.confirmed ?? false,
        hasSignatureData: Boolean(updated.caSignOff?.accreditation?.signatory?.signature)
      }
    }
  };

  const summary = diffs.length > 0
    ? `Updated fields: ${diffs.map(d => `${d.field} ('${d.previousValue}' → '${d.newValue}')`).join("; ")}`
    : `Project '${updated.title}' updated with current sign-off configuration.`;

  return {
    section: isCaSignOffChanged ? "Approval & Certification Sign-Off" : "AI Projects Register",
    hasApprovalChange: isCaSignOffChanged,
    summaryOfChanges: summary,
    project: updated.title,
    projectId: updated.id,
    owner: updated.owner,
    status: updated.status,
    riskClassification: updated.riskClassification,
    framework: updated.framework,
    approvalSection,
    fieldDiffs: diffs
  };
}

/**
 * Computes change payload for Model updates
 */
export function getModelChangePayload(
  updated: ModelRecord,
  existing?: ModelRecord
): DetailedAuditChangePayload {
  const diffs: FieldDiff[] = [];
  let isApprovalChange = false;

  if (existing) {
    if (existing.status !== updated.status) {
      isApprovalChange = true;
      diffs.push({
        field: "Approval Status",
        section: "Model Approval & Governance",
        previousValue: existing.status,
        newValue: updated.status
      });
    }
    if (existing.approver !== updated.approver) {
      isApprovalChange = true;
      diffs.push({
        field: "Designated Approver",
        section: "Model Approval & Governance",
        previousValue: existing.approver || "None",
        newValue: updated.approver || "None"
      });
    }
    if (existing.version !== updated.version) {
      diffs.push({ field: "Model Version", section: "Model Registry", previousValue: existing.version, newValue: updated.version });
    }
  }

  const approvalSection = {
    modelName: updated.name,
    approvalStatus: updated.status,
    approver: updated.approver || "Pending Assignment",
    provider: updated.provider,
    version: updated.version
  };

  const summary = diffs.length > 0
    ? `Model '${updated.name}' updated: ${diffs.map(d => `${d.field} ('${d.previousValue}' → '${d.newValue}')`).join("; ")}`
    : `Model '${updated.name}' updated.`;

  return {
    section: isApprovalChange ? "Model Approval & Governance" : "Model Registry",
    hasApprovalChange: isApprovalChange,
    summaryOfChanges: summary,
    modelName: updated.name,
    modelId: updated.id,
    version: updated.version,
    provider: updated.provider,
    status: updated.status,
    approver: updated.approver,
    approvalSection,
    fieldDiffs: diffs
  };
}

/**
 * Computes change payload for Evidence File updates
 */
export function getEvidenceFileChangePayload(
  updated: EvidenceFile,
  existing?: EvidenceFile
): DetailedAuditChangePayload {
  const diffs: FieldDiff[] = [];
  let isApprovalChange = false;

  if (existing) {
    if (existing.status !== updated.status) {
      isApprovalChange = true;
      diffs.push({
        field: "Evidence Review Status",
        section: "Evidence Approval & Verification",
        previousValue: existing.status,
        newValue: updated.status
      });
    }
  }

  const approvalSection = {
    fileName: updated.name,
    approvalStatus: updated.status,
    uploader: updated.uploader,
    uploadDate: updated.uploadDate
  };

  const summary = diffs.length > 0
    ? `Evidence file '${updated.name}' status changed: ${diffs.map(d => `${d.field} ('${d.previousValue}' → '${d.newValue}')`).join("; ")}`
    : `Evidence file '${updated.name}' updated.`;

  return {
    section: isApprovalChange ? "Evidence Approval & Verification" : "Evidence Repository",
    hasApprovalChange: isApprovalChange,
    summaryOfChanges: summary,
    fileName: updated.name,
    fileId: updated.id,
    status: updated.status,
    uploader: updated.uploader,
    approvalSection,
    fieldDiffs: diffs
  };
}

/**
 * Computes change payload for Risk updates
 */
export function getRiskChangePayload(
  updated: RiskRecord,
  existing?: RiskRecord
): DetailedAuditChangePayload {
  const diffs: FieldDiff[] = [];
  let isApprovalChange = false;

  if (existing) {
    if (existing.mitigationStatus !== updated.mitigationStatus) {
      isApprovalChange = true;
      diffs.push({
        field: "Mitigation Approval Status",
        section: "Risk Mitigation & Sign-Off",
        previousValue: existing.mitigationStatus,
        newValue: updated.mitigationStatus
      });
    }
    if (existing.severity !== updated.severity) {
      diffs.push({ field: "Risk Severity", section: "Risk Register", previousValue: existing.severity, newValue: updated.severity });
    }
    if (existing.riskLevel !== updated.riskLevel) {
      diffs.push({ field: "Residual Risk Level", section: "Risk Register", previousValue: existing.riskLevel, newValue: updated.riskLevel });
    }
  }

  const approvalSection = {
    riskName: updated.name,
    mitigationStatus: updated.mitigationStatus,
    severity: updated.severity,
    riskLevel: updated.riskLevel,
    owner: updated.owner,
    targetDate: updated.targetDate
  };

  const summary = diffs.length > 0
    ? `Risk '${updated.name}' updated: ${diffs.map(d => `${d.field} ('${d.previousValue}' → '${d.newValue}')`).join("; ")}`
    : `Risk '${updated.name}' updated.`;

  return {
    section: isApprovalChange ? "Risk Mitigation & Sign-Off" : "Risk Register",
    hasApprovalChange: isApprovalChange,
    summaryOfChanges: summary,
    riskName: updated.name,
    riskId: updated.id,
    severity: updated.severity,
    riskLevel: updated.riskLevel,
    mitigationStatus: updated.mitigationStatus,
    owner: updated.owner,
    approvalSection,
    fieldDiffs: diffs
  };
}

/**
 * Computes change payload for Vendor updates
 */
export function getVendorChangePayload(
  updated: Vendor,
  existing?: Vendor
): DetailedAuditChangePayload {
  const diffs: FieldDiff[] = [];
  let isApprovalChange = false;

  if (existing) {
    if (existing.reviewStatus !== updated.reviewStatus) {
      isApprovalChange = true;
      diffs.push({
        field: "Vendor Review Approval Status",
        section: "Vendor Risk Review & Approval",
        previousValue: existing.reviewStatus,
        newValue: updated.reviewStatus
      });
    }
    if (existing.score !== updated.score) {
      diffs.push({ field: "Vendor Security Score", section: "Vendor Risk Assessment", previousValue: existing.score, newValue: updated.score });
    }
  }

  const approvalSection = {
    vendorName: updated.name,
    reviewStatus: updated.reviewStatus,
    score: updated.score,
    assignee: updated.assignee,
    reviewDate: updated.reviewDate
  };

  const summary = diffs.length > 0
    ? `Vendor '${updated.name}' updated: ${diffs.map(d => `${d.field} ('${d.previousValue}' → '${d.newValue}')`).join("; ")}`
    : `Vendor '${updated.name}' updated.`;

  return {
    section: isApprovalChange ? "Vendor Risk Review & Approval" : "Vendor Risk Assessment",
    hasApprovalChange: isApprovalChange,
    summaryOfChanges: summary,
    vendorName: updated.name,
    vendorId: updated.id,
    reviewStatus: updated.reviewStatus,
    score: updated.score,
    assignee: updated.assignee,
    approvalSection,
    fieldDiffs: diffs
  };
}

/**
 * Computes change payload for Policy updates
 */
export function getPolicyChangePayload(
  updated: OrganizationalPolicy,
  existing?: OrganizationalPolicy
): DetailedAuditChangePayload {
  const diffs: FieldDiff[] = [];
  let isApprovalChange = false;

  if (existing) {
    if (existing.status !== updated.status) {
      isApprovalChange = true;
      diffs.push({
        field: "Policy Publication & Approval Status",
        section: "Policy Governance & Approval",
        previousValue: existing.status,
        newValue: updated.status
      });
    }
  }

  const approvalSection = {
    policyTitle: updated.title,
    approvalStatus: updated.status,
    owner: updated.owner,
    lastUpdated: updated.lastUpdated
  };

  const summary = diffs.length > 0
    ? `Policy '${updated.title}' updated: ${diffs.map(d => `${d.field} ('${d.previousValue}' → '${d.newValue}')`).join("; ")}`
    : `Policy '${updated.title}' updated.`;

  return {
    section: isApprovalChange ? "Policy Governance & Approval" : "Policy Governance",
    hasApprovalChange: isApprovalChange,
    summaryOfChanges: summary,
    policyTitle: updated.title,
    policyId: updated.id,
    status: updated.status,
    owner: updated.owner,
    approvalSection,
    fieldDiffs: diffs
  };
}

/**
 * Computes change payload for Incident updates
 */
export function getIncidentChangePayload(
  updated: IncidentRecord,
  existing?: IncidentRecord
): DetailedAuditChangePayload {
  const diffs: FieldDiff[] = [];
  let isApprovalChange = false;

  if (existing) {
    if (existing.status !== updated.status) {
      isApprovalChange = true;
      diffs.push({
        field: "Incident Closure & Approval Status",
        section: "Incident Sign-Off & Status",
        previousValue: existing.status,
        newValue: updated.status
      });
    }
  }

  const approvalSection = {
    incidentTitle: `${updated.type} - ${updated.project}`,
    status: updated.status,
    approvedBy: updated.approvedBy
  };

  const summary = diffs.length > 0
    ? `Incident '${updated.type} - ${updated.project}' status updated: ${diffs.map(d => `${d.field} ('${d.previousValue}' → '${d.newValue}')`).join("; ")}`
    : `Incident '${updated.type} - ${updated.project}' updated.`;

  return {
    section: isApprovalChange ? "Incident Sign-Off & Status" : "Incident Response",
    hasApprovalChange: isApprovalChange,
    summaryOfChanges: summary,
    project: updated.project,
    type: updated.type,
    incidentId: updated.id,
    status: updated.status,
    approvedBy: updated.approvedBy,
    approvalSection,
    fieldDiffs: diffs
  };
}
