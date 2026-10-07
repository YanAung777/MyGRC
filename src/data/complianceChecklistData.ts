export interface PolicyItem {
  policy_name: string;
  compliant: "Yes" | "No" | "N/A" | "";
  comment: string;
  priority_gaps: string[];
}

export interface StandardItem {
  standard_name: string;
  compliant: "Yes" | "No" | "N/A" | "";
  comment: string;
  priority_gaps: string[];
}

export interface CommonGapItem {
  area: string;
  gap: string;
  priority: "High" | "Medium" | "Low";
  related_policies: string[];
  related_standards: string[];
}

export interface ChecklistTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface ChecklistPhase {
  id: string;
  phaseNumber: number;
  title: string;
  tasks: ChecklistTask[];
}

export interface PBCRequestItem {
  id: string;
  item: string;
  category: string;
  status: "Missing" | "Collected" | "In Review" | "Pending";
  action: "Upload" | "View";
}

export const INITIAL_CHECKLIST_PHASES: ChecklistPhase[] = [
  {
    id: "phase-1",
    phaseNumber: 1,
    title: "1. Scoping & Planning",
    tasks: [
      {
        id: "task-1-1",
        title: "Define Trust Services Criteria scope",
        description: "Select applicable TSCs (Security is mandatory).",
        completed: true
      },
      {
        id: "task-1-2",
        title: "Identify key systems and data flows",
        description: "Map out in-scope assets, cloud infrastructure, and data movement.",
        completed: false
      },
      {
        id: "task-1-3",
        title: "Confirm third-party vendors & subprocessors",
        description: "Document critical SaaS vendors and complementary user entity controls (CUECs).",
        completed: false
      }
    ]
  },
  {
    id: "phase-2",
    phaseNumber: 2,
    title: "2. Control Design & Implementation",
    tasks: [
      {
        id: "task-2-1",
        title: "Map internal technical controls to SOC 2 Criteria",
        description: "Ensure CC1 through CC9 controls have assigned internal owners.",
        completed: false
      },
      {
        id: "task-2-2",
        title: "Enforce MFA & SSO across production consoles",
        description: "Verify 100% MFA coverage for administrators and cloud accounts.",
        completed: false
      },
      {
        id: "task-2-3",
        title: "Draft and approve required security policies",
        description: "Annual review and signoff of InfoSec, Access Control, and IR policies.",
        completed: false
      }
    ]
  },
  {
    id: "phase-3",
    phaseNumber: 3,
    title: "3. Evidence Collection & Testing",
    tasks: [
      {
        id: "task-3-1",
        title: "Populate Provided-By-Client (PBC) request list",
        description: "Gather mandatory policy approvals, org charts, and system configs.",
        completed: false
      },
      {
        id: "task-3-2",
        title: "Collect automated SIEM and access audit logs",
        description: "Export full-period system-generated access and change logs.",
        completed: false
      },
      {
        id: "task-3-3",
        title: "Conduct annual employee security training",
        description: "Ensure all staff complete security awareness training in LMS.",
        completed: false
      }
    ]
  },
  {
    id: "phase-4",
    phaseNumber: 4,
    title: "4. Audit & Readiness Review",
    tasks: [
      {
        id: "task-4-1",
        title: "Conduct incident response tabletop exercise",
        description: "Execute mock security incident drill with key incident leads.",
        completed: false
      },
      {
        id: "task-4-2",
        title: "Remediate high-priority compliance gaps",
        description: "Address access review remediation and emergency change logs.",
        completed: false
      },
      {
        id: "task-4-3",
        title: "Finalize audit package for external assessor",
        description: "Share completed PBC list and evidence vault with external auditor.",
        completed: false
      }
    ]
  }
];

export const INITIAL_PBC_REQUEST_LIST: PBCRequestItem[] = [
  {
    id: "pbc-1",
    item: "Information Security Policy",
    category: "Policies & Procedures",
    status: "Missing",
    action: "Upload"
  },
  {
    id: "pbc-2",
    item: "Organization Chart",
    category: "Planning & Scoping",
    status: "Collected",
    action: "View"
  },
  {
    id: "pbc-3",
    item: "Quarterly Access Review Evidence",
    category: "Access Control",
    status: "In Review",
    action: "View"
  },
  {
    id: "pbc-4",
    item: "Penetration Test Report",
    category: "Vulnerability Management",
    status: "Collected",
    action: "View"
  },
  {
    id: "pbc-5",
    item: "Incident Response Tabletop Drill Log",
    category: "Incident Response",
    status: "Missing",
    action: "Upload"
  }
];

export const COMPLIANCE_STANDARDS_JSON = {
  title: "Compliance to Standards & Policies",
  description: "Assessment of compliance against internal security standards and required policies. Comments and a link to the remediation plan are required where status is No. Common high-priority gaps are mapped to the relevant items.",
  required_policies: [
    {
      policy_name: "Information Security Policy",
      compliant: "Yes",
      comment: "Annual policy review completed on schedule.",
      priority_gaps: []
    },
    {
      policy_name: "Acceptable Use Policy / Code of Conduct",
      compliant: "Yes",
      comment: "Signed by all new hires upon onboarding.",
      priority_gaps: []
    },
    {
      policy_name: "Access Control Policy",
      compliant: "No",
      comment: "Quarterly reviews performed but missing excess access remediation evidence.",
      priority_gaps: [
        "Access Reviews - Reviews performed but no evidence of remediation of excess access",
        "De-provisioning - Access not removed within defined timeline (same day / next business day)"
      ]
    },
    {
      policy_name: "Password / Authentication Policy",
      compliant: "Yes",
      comment: "MFA enforced at IdP level.",
      priority_gaps: []
    },
    {
      policy_name: "Change Management Policy",
      compliant: "No",
      comment: "Emergency hotfix logged without retrospective review.",
      priority_gaps: [
        "Change Management - Emergency changes lack retrospective review or documentation"
      ]
    },
    {
      policy_name: "Incident Response Plan",
      compliant: "No",
      comment: "Plan exists but tabletop drill is overdue.",
      priority_gaps: [
        "Incident Response - Plan exists but no tabletop exercise performed during the period"
      ]
    },
    {
      policy_name: "Business Continuity / Disaster Recovery Plan",
      compliant: "Yes",
      comment: "Annual failover drill completed successfully.",
      priority_gaps: []
    },
    {
      policy_name: "Vendor / Third-Party Risk Management Policy",
      compliant: "No",
      comment: "Vendor tiering matrix needs updating.",
      priority_gaps: [
        "Vendor Management - No criticality tiering or missing security clauses in contracts"
      ]
    },
    {
      policy_name: "Data Classification Policy",
      compliant: "Yes",
      comment: "Data labels implemented in cloud storage.",
      priority_gaps: []
    },
    {
      policy_name: "Data Retention and Disposal Policy",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      policy_name: "Risk Management Policy",
      compliant: "No",
      comment: "Fraud scenarios to be incorporated into risk matrix.",
      priority_gaps: [
        "Risk Assessment - Not updated after significant changes; fraud risks not explicitly considered"
      ]
    },
    {
      policy_name: "Secure Development / SDLC Policy",
      compliant: "Yes",
      comment: "Branching and SAST rules enforced in GitHub actions.",
      priority_gaps: []
    },
    {
      policy_name: "Encryption Policy",
      compliant: "Yes",
      comment: "AES-256 for data at rest, TLS 1.3 in transit.",
      priority_gaps: []
    },
    {
      policy_name: "Physical Security Policy (if applicable)",
      compliant: "N/A",
      comment: "Fully remote cloud organization.",
      priority_gaps: []
    },
    {
      policy_name: "Privacy Policy / Notice (if Privacy in scope)",
      compliant: "Yes",
      comment: "Published on public Trust Center.",
      priority_gaps: []
    },
    {
      policy_name: "Remote Work / BYOD Policy (if applicable)",
      compliant: "Yes",
      comment: "MDM agent installed on all devices.",
      priority_gaps: []
    }
  ],
  standards: [
    {
      standard_name: "Information Classification Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Data Jurisdiction Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Privileged Access Management Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: [
        "Access Reviews - Reviews performed but no evidence of remediation of excess access",
        "De-provisioning - Access not removed within defined timeline (same day / next business day)"
      ]
    },
    {
      standard_name: "Third Party Assurance Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: [
        "Vendor Management - No criticality tiering or missing security clauses in contracts"
      ]
    },
    {
      standard_name: "Identity Governance Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: [
        "Access Reviews - Reviews performed but no evidence of remediation of excess access",
        "De-provisioning - Access not removed within defined timeline (same day / next business day)"
      ]
    },
    {
      standard_name: "Automated Decision-Making Standard",
      compliant: "N/A",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Information Retention and Disposal Standard",
      compliant: "No",
      comment: "Comments and link to remediation plan required",
      priority_gaps: []
    },
    {
      standard_name: "Minimum Metadata Capture Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Authentication Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "LDAP Directory Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Encryption Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Key Management Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Patch Management Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Vulnerability Management Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Service Security Baseline Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Remote Access Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Password Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Integration Standards",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Software Development Standards",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Release Deployment and Automation Standards",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "SAST and DAST Code & Security Review Standards",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Code Branching Standards",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Logging and Monitoring Standard",
      compliant: "No",
      comment: "Partial coverage on log retention",
      priority_gaps: [
        "Evidence - Screenshots instead of system-generated logs; evidence only covers part of the period"
      ]
    },
    {
      standard_name: "Security Logging Standard",
      compliant: "No",
      comment: "System logs require SIEM centralization",
      priority_gaps: [
        "Evidence - Screenshots instead of system-generated logs; evidence only covers part of the period"
      ]
    },
    {
      standard_name: "Incident Response Standard",
      compliant: "No",
      comment: "Drill pending",
      priority_gaps: [
        "Incident Response - Plan exists but no tabletop exercise performed during the period"
      ]
    },
    {
      standard_name: "Configuration Management Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Secure Configuration Baseline Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Network Security Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Malware Protection Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Endpoint Protection Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Backup and Recovery Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Cryptography Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Acceptable Use Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Mobile Device Security Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Endpoint Security Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Cloud Security Standard",
      compliant: "No",
      comment: "CUEC documentation needed",
      priority_gaps: [
        "Cloud Shared Responsibility - No documented complementary user entity controls (CUECs)"
      ]
    },
    {
      standard_name: "Cloud Shared Responsibility Standard",
      compliant: "No",
      comment: "CUEC matrix missing",
      priority_gaps: [
        "Cloud Shared Responsibility - No documented complementary user entity controls (CUECs)"
      ]
    },
    {
      standard_name: "Access Control Standard",
      compliant: "No",
      comment: "Deprovisioning latency found",
      priority_gaps: [
        "Access Reviews - Reviews performed but no evidence of remediation of excess access",
        "De-provisioning - Access not removed within defined timeline (same day / next business day)"
      ]
    },
    {
      standard_name: "Multi-Factor Authentication (MFA) Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Session Management Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Service Account / Non-Human Identity Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Change Management Standard",
      compliant: "No",
      comment: "Emergency review process missing",
      priority_gaps: [
        "Change Management - Emergency changes lack retrospective review or documentation"
      ]
    },
    {
      standard_name: "Secure Coding Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "API Security Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Container Security Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Kubernetes Security Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Infrastructure as Code (IaC) Security Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Data Loss Prevention (DLP) Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Privacy / Personal Data Protection Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Data Masking / Anonymisation Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Media Sanitisation / Secure Disposal Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Physical Security Standard",
      compliant: "N/A",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Remote Working / Hybrid Working Security Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Third-Party / Supplier Security Standard",
      compliant: "No",
      comment: "Missing clauses in sub-processor contract",
      priority_gaps: [
        "Vendor Management - No criticality tiering or missing security clauses in contracts"
      ]
    },
    {
      standard_name: "Security Awareness and Training Standard",
      compliant: "No",
      comment: "Contractors missing LMS logs",
      priority_gaps: [
        "Training - Contractors or privileged users missing required training"
      ]
    },
    {
      standard_name: "Risk Management Standard",
      compliant: "No",
      comment: "Fraud scenarios pending",
      priority_gaps: [
        "Risk Assessment - Not updated after significant changes; fraud risks not explicitly considered"
      ]
    },
    {
      standard_name: "Business Continuity / Disaster Recovery Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Asset Management Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Threat Intelligence Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    },
    {
      standard_name: "Vulnerability Disclosure Standard",
      compliant: "Yes",
      comment: "",
      priority_gaps: []
    }
  ],
  common_gaps: [
    {
      area: "Access Reviews",
      gap: "Reviews performed but no evidence of remediation of excess access",
      priority: "High",
      related_policies: ["Access Control Policy"],
      related_standards: [
        "Privileged Access Management Standard",
        "Identity Governance Standard",
        "Access Control Standard"
      ]
    },
    {
      area: "De-provisioning",
      gap: "Access not removed within defined timeline (same day / next business day)",
      priority: "High",
      related_policies: ["Access Control Policy"],
      related_standards: [
        "Privileged Access Management Standard",
        "Identity Governance Standard",
        "Access Control Standard"
      ]
    },
    {
      area: "Change Management",
      gap: "Emergency changes lack retrospective review or documentation",
      priority: "High",
      related_policies: ["Change Management Policy"],
      related_standards: ["Change Management Standard"]
    },
    {
      area: "Vendor Management",
      gap: "No criticality tiering or missing security clauses in contracts",
      priority: "High",
      related_policies: ["Vendor / Third-Party Risk Management Policy"],
      related_standards: [
        "Third Party Assurance Standard",
        "Third-Party / Supplier Security Standard"
      ]
    },
    {
      area: "Risk Assessment",
      gap: "Not updated after significant changes; fraud risks not explicitly considered",
      priority: "High",
      related_policies: ["Risk Management Policy"],
      related_standards: ["Risk Management Standard"]
    },
    {
      area: "Evidence",
      gap: "Screenshots instead of system-generated logs; evidence only covers part of the period",
      priority: "High",
      related_policies: [],
      related_standards: [
        "Logging and Monitoring Standard",
        "Security Logging Standard"
      ]
    },
    {
      area: "Policies",
      gap: "Policies exist but have not been reviewed/approved in the last 12 months",
      priority: "High",
      related_policies: [
        "Information Security Policy",
        "Acceptable Use Policy / Code of Conduct",
        "Access Control Policy",
        "Password / Authentication Policy",
        "Change Management Policy",
        "Incident Response Plan",
        "Business Continuity / Disaster Recovery Plan",
        "Vendor / Third-Party Risk Management Policy",
        "Data Classification Policy",
        "Data Retention and Disposal Policy",
        "Risk Management Policy",
        "Secure Development / SDLC Policy",
        "Encryption Policy"
      ],
      related_standards: []
    },
    {
      area: "Training",
      gap: "Contractors or privileged users missing required training",
      priority: "High",
      related_policies: [],
      related_standards: ["Security Awareness and Training Standard"]
    },
    {
      area: "Incident Response",
      gap: "Plan exists but no tabletop exercise performed during the period",
      priority: "High",
      related_policies: ["Incident Response Plan"],
      related_standards: ["Incident Response Standard"]
    },
    {
      area: "Cloud Shared Responsibility",
      gap: "No documented complementary user entity controls (CUECs)",
      priority: "High",
      related_policies: [],
      related_standards: [
        "Cloud Security Standard",
        "Cloud Shared Responsibility Standard"
      ]
    }
  ]
};
