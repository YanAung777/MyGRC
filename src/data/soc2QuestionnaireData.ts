export interface SOC2Question {
  question: string;
  sample_answers: string[];
  evidence_examples: string[];
}

export interface SOC2Control {
  id: string;
  criterion: string;
  summary: string;
  questions: SOC2Question[];
}

export interface SOC2QuestionnaireData {
  title: string;
  version: string;
  description: string;
  controls: SOC2Control[];
}

export const SOC2_QUESTIONNAIRE_DATA: SOC2QuestionnaireData = {
  title: "SOC 2 Application Checklist – Full Questionnaire Automation",
  version: "2.0",
  description: "Select a sample answer and edit it to match your environment. Attach the suggested evidence for each response. Designed for external auditor / assessor use and internal readiness.",
  controls: [
    {
      id: "CC1.1",
      criterion: "Integrity & Ethical Values",
      summary: "Code of Conduct, acknowledgments, whistleblower channel, and background checks",
      questions: [
        {
          question: "Do you have a written Code of Conduct or Acceptable Use Policy that covers ethics, conflicts of interest, data handling, and reporting of violations?",
          sample_answers: [
            "Yes, we maintain a formal Code of Conduct / Acceptable Use Policy that covers ethics, conflicts of interest, data handling, acceptable use of systems, and how to report violations. The policy is reviewed and approved at least annually.",
            "Yes, a Code of Conduct exists and is published in our employee handbook and policy portal. It is reviewed by management on an annual basis.",
            "No, we do not currently have a formal Code of Conduct."
          ],
          evidence_examples: ["Current Code of Conduct / AUP with approval date", "Policy review records"]
        },
        {
          question: "Are all employees and contractors required to acknowledge the Code of Conduct at hire and at least annually?",
          sample_answers: [
            "Yes, all employees and contractors must acknowledge the Code of Conduct during onboarding and again annually. Acknowledgments are tracked in our HR / LMS system and followed up if incomplete.",
            "Yes, electronic acknowledgment is required at hire and on an annual cycle. Completion rates are monitored by HR.",
            "No, acknowledgments are only collected at the time of hire."
          ],
          evidence_examples: ["LMS or policy-tool acknowledgment reports for the period", "Sample acknowledgment records"]
        },
        {
          question: "Do you provide an anonymous or confidential channel for reporting violations or concerns?",
          sample_answers: [
            "Yes, we maintain an anonymous whistleblower / ethics reporting channel available to all employees and contractors. Reports are reviewed by a designated team and investigated as appropriate.",
            "Yes, employees can report concerns confidentially through a third-party hotline or internal secure form. The process is described in the Code of Conduct.",
            "No, we do not currently offer an anonymous reporting channel."
          ],
          evidence_examples: ["Whistleblower policy", "Description or screenshot of the reporting channel", "Investigation logs (if any)"]
        },
        {
          question: "Are employees in sensitive or privileged roles subject to background checks?",
          sample_answers: [
            "Yes, all new hires in sensitive or privileged roles must complete a thorough background check (criminal and employment verification) before access is granted. Checks are performed by a third-party provider and records are retained by HR.",
            "Yes, background checks are required for employees with access to production systems, customer data, or administrative privileges.",
            "No, background checks are not currently performed."
          ],
          evidence_examples: ["Background check policy", "Sample third-party background check reports", "HR records showing checks completed before access provisioning"]
        }
      ]
    },
    {
      id: "CC1.2",
      criterion: "Board Oversight",
      summary: "Board or advisory board oversight of security and compliance",
      questions: [
        {
          question: "Does your board or advisory board have formal oversight responsibility for security and compliance?",
          sample_answers: [
            "Yes, the board / advisory board charter explicitly includes oversight of the information security and compliance program. Security and compliance status is reviewed at least quarterly.",
            "Yes, security and compliance topics are standing agenda items. An independent review of the security program is performed at least annually.",
            "No, formal board-level oversight of security is not currently documented."
          ],
          evidence_examples: ["Board / advisory board charter", "Meeting minutes with security discussions", "Quarterly security status presentations"]
        }
      ]
    },
    {
      id: "CC1.3",
      criterion: "Structures, Reporting Lines & Authorities",
      summary: "Organizational structure, control ownership, and job descriptions",
      questions: [
        {
          question: "Do you maintain a current organizational chart and documented control ownership?",
          sample_answers: [
            "Yes, we maintain a current organizational chart showing security, compliance, engineering, and operations reporting lines. Control ownership is documented in a RACI or control matrix and kept up to date.",
            "Yes, reporting lines and control owners are clearly defined. Job descriptions for relevant roles include security responsibilities.",
            "No, a formal control ownership matrix is not currently maintained."
          ],
          evidence_examples: ["Organizational chart", "RACI / control ownership matrix", "Sample job descriptions with security responsibilities"]
        }
      ]
    },
    {
      id: "CC1.4",
      criterion: "Competence",
      summary: "Security awareness and role-based training",
      questions: [
        {
          question: "Are employees required to complete security awareness training?",
          sample_answers: [
            "Yes, all employees and contractors must complete security awareness training during onboarding and annually thereafter. Completion is tracked in our learning management system and non-completion is followed up.",
            "Yes, security awareness training is mandatory and covers phishing, data handling, password hygiene, incident reporting, and acceptable use.",
            "No, security awareness training is not currently mandatory for all staff."
          ],
          evidence_examples: ["LMS completion reports for the examination period", "Training curriculum / content outline"]
        },
        {
          question: "Is additional role-based or technical training provided for employees with privileged access?",
          sample_answers: [
            "Yes, engineers, administrators, and other users with privileged access receive additional role-based security and technical training relevant to their responsibilities.",
            "Yes, privileged users complete specialized training on secure coding, access management, and incident response in addition to general awareness training.",
            "No, only general security awareness training is provided."
          ],
          evidence_examples: ["Role-based training records", "Training materials for privileged roles"]
        }
      ]
    },
    {
      id: "CC1.5",
      criterion: "Accountability",
      summary: "Control ownership and accountability for control failures",
      questions: [
        {
          question: "Are individuals held accountable for their internal control responsibilities?",
          sample_answers: [
            "Yes, control owners are formally assigned and documented. Management reviews control failures and tracks corrective actions. Security metrics are included in relevant performance goals.",
            "Yes, accountability is enforced through documented ownership, periodic management review of deficiencies, and inclusion of security responsibilities in performance evaluations.",
            "No, formal accountability mechanisms for control responsibilities are not currently in place."
          ],
          evidence_examples: ["Control ownership register", "Remediation tickets and management review records", "Performance goals containing security metrics"]
        }
      ]
    },
    {
      id: "CC2.1",
      criterion: "Quality Information",
      summary: "Logging, dashboards, and quality of monitoring information",
      questions: [
        {
          question: "Do you generate and use relevant, quality information to support internal controls (logging, dashboards, etc.)?",
          sample_answers: [
            "Yes, we maintain centralized logging of security-relevant events and dashboards for control status, vulnerabilities, and incidents. Log retention and access are defined, and data quality standards exist for compliance evidence.",
            "Yes, security events are logged centrally (SIEM or equivalent) and management reviews dashboards on a defined cadence. Retention periods and access controls are documented.",
            "No, centralized logging and quality monitoring information are not fully implemented."
          ],
          evidence_examples: ["Log retention configuration", "Sample dashboard exports", "SIEM rule documentation", "Evidence collection procedures"]
        }
      ]
    },
    {
      id: "CC2.2",
      criterion: "Internal Communication",
      summary: "Policy distribution, security updates, and incident reporting channels",
      questions: [
        {
          question: "How do you communicate security policies, responsibilities, and updates to employees?",
          sample_answers: [
            "Yes, security policies are distributed via a policy management tool or company wiki with acknowledgment tracking. Regular security updates are provided through newsletters, all-hands, or internal channels. Incident reporting channels and escalation paths are documented and communicated. New hires receive security orientation.",
            "Yes, policies are published and acknowledged, security communications occur regularly, and clear channels exist for reporting incidents.",
            "No, formal internal communication of security policies and responsibilities is limited."
          ],
          evidence_examples: ["Policy distribution and acknowledgment logs", "Sample internal security communications", "Incident reporting procedure", "Onboarding checklists"]
        }
      ]
    },
    {
      id: "CC2.3",
      criterion: "External Communication",
      summary: "Trust Center, customer notifications, and vendor communication",
      questions: [
        {
          question: "Do you communicate relevant security information to external parties (customers, vendors, public)?",
          sample_answers: [
            "Yes, we maintain a public Trust Center or security page that accurately describes our system and controls. A documented customer incident notification procedure with timelines exists. Security requirements and issues are communicated to vendors. A status page is used for availability incidents when applicable.",
            "Yes, external communications include a Trust Center, defined customer notification processes, and vendor security communications.",
            "No, formal external security communication processes are not fully established."
          ],
          evidence_examples: ["Trust Center / security page content", "Customer notification templates and sample notifications", "Vendor communication records", "Status page history"]
        }
      ]
    },
    {
      id: "CC3.1",
      criterion: "Specifies Suitable Objectives",
      summary: "Documented security objectives aligned to TSC and commitments",
      questions: [
        {
          question: "Have you defined clear security objectives aligned to the Trust Services Criteria and your service commitments?",
          sample_answers: [
            "Yes, security objectives are documented in our security or risk management policy and are aligned to the in-scope Trust Services Criteria and customer commitments / SLAs. Objectives are reviewed periodically.",
            "Yes, we have defined measurable security objectives that support risk identification and are mapped to our SOC 2 scope.",
            "No, formal security objectives aligned to the TSC are not currently documented."
          ],
          evidence_examples: ["Security / risk management policy stating objectives", "Mapping of objectives to TSC and SLAs"]
        }
      ]
    },
    {
      id: "CC3.2",
      criterion: "Identifies and Analyzes Risks",
      summary: "Formal risk assessment and living risk register",
      questions: [
        {
          question: "Do you perform regular risk assessments covering people, process, technology, and third parties?",
          sample_answers: [
            "Yes, we use a formal risk assessment methodology (likelihood × impact). Assessments are performed at least annually and cover people, process, technology, and third parties. A living risk register with owners and treatment plans is maintained, supported by an asset inventory.",
            "Yes, risk assessments are conducted on a defined cadence and results are recorded in a risk register that is kept current.",
            "No, formal risk assessments are not performed regularly."
          ],
          evidence_examples: ["Risk assessment methodology", "Latest risk assessment report", "Living risk register", "Asset inventory"]
        }
      ]
    },
    {
      id: "CC3.3",
      criterion: "Assesses Fraud Risk",
      summary: "Explicit consideration of fraud scenarios",
      questions: [
        {
          question: "Do you explicitly consider fraud risks (including insider threat and privilege abuse) in your risk assessment?",
          sample_answers: [
            "Yes, fraud risks such as insider threat, privilege abuse, data manipulation, and social engineering are explicitly evaluated in our risk assessment. Segregation-of-duties analysis is performed for critical processes.",
            "Yes, fraud scenarios are included in the risk assessment and reviewed when significant changes occur.",
            "No, fraud risks are not specifically assessed."
          ],
          evidence_examples: ["Fraud risk section of the risk assessment", "Segregation-of-duties matrix"]
        }
      ]
    },
    {
      id: "CC3.4",
      criterion: "Identifies and Assesses Significant Changes",
      summary: "Change impact assessment on the control environment",
      questions: [
        {
          question: "Do you assess the impact of significant changes (technology, personnel, vendors, regulations) on your controls?",
          sample_answers: [
            "Yes, we have a defined process to evaluate the control impact of significant technology, personnel, vendor, or regulatory changes. Material events trigger a risk re-assessment and updates to the risk register.",
            "Yes, change impact assessments are performed for significant changes and documented in change tickets or the risk register.",
            "No, formal change impact assessments on controls are not consistently performed."
          ],
          evidence_examples: ["Change impact assessment procedure", "Change tickets with risk impact notes", "Updated risk register entries"]
        }
      ]
    },
    {
      id: "CC4.1",
      criterion: "Ongoing and/or Separate Evaluations",
      summary: "Continuous monitoring, internal evaluations, and penetration testing",
      questions: [
        {
          question: "Do you perform continuous monitoring and periodic evaluations of controls?",
          sample_answers: [
            "Yes, we use continuous monitoring (SIEM alerts, vulnerability scanning, control health dashboards). Periodic internal control self-assessments or internal audits are performed, and penetration testing or red-team exercises are conducted at least annually.",
            "Yes, monitoring tools generate alerts that are triaged, and independent evaluations (internal audit or pen-tests) are performed on a defined schedule.",
            "No, continuous monitoring and periodic independent evaluations are not fully implemented."
          ],
          evidence_examples: ["Alert triage tickets", "Internal audit / self-assessment reports", "Penetration test reports", "Dashboard exports"]
        }
      ]
    },
    {
      id: "CC4.2",
      criterion: "Evaluates and Communicates Deficiencies",
      summary: "Deficiency tracking, escalation, and reporting",
      questions: [
        {
          question: "Do you have a process to identify, track, escalate, and report control deficiencies?",
          sample_answers: [
            "Yes, we maintain a defined process and severity matrix for reporting control deficiencies. Issues are tracked to remediation with management escalation, and status is reported regularly to senior management and the board.",
            "Yes, deficiencies are logged, assigned owners, tracked to closure, and summarized in management reporting.",
            "No, a formal deficiency management process is not in place."
          ],
          evidence_examples: ["Deficiency log", "Remediation tickets", "Management / board reports", "Severity matrix"]
        }
      ]
    },
    {
      id: "CC5.1",
      criterion: "Selects and Develops Control Activities",
      summary: "Controls mapped to risks",
      questions: [
        {
          question: "Are your controls mapped to the risks identified in the risk assessment?",
          sample_answers: [
            "Yes, controls are formally mapped to risks in the risk register. We maintain a mix of preventive and detective controls and review the mapping when risks or systems change.",
            "Yes, a risk-to-control matrix is maintained and kept current.",
            "No, formal mapping of controls to risks is not currently maintained."
          ],
          evidence_examples: ["Risk-to-control mapping matrix"]
        }
      ]
    },
    {
      id: "CC5.2",
      criterion: "Technology General Controls",
      summary: "Baselines, encryption, network segmentation, secure coding",
      questions: [
        {
          question: "Have you defined and implemented technology general controls (baselines, encryption, segmentation, secure coding)?",
          sample_answers: [
            "Yes, we maintain hardened configuration baselines, encryption standards for data at rest and in transit, network segmentation, logging standards, and secure coding requirements. Compliance with baselines is monitored.",
            "Yes, technology general controls covering configuration, encryption, network architecture, and secure development are documented and enforced.",
            "No, comprehensive technology general controls are not fully defined."
          ],
          evidence_examples: ["Configuration baselines", "Encryption policy and configurations", "Network diagrams", "Secure SDLC / secure coding policy"]
        }
      ]
    },
    {
      id: "CC5.3",
      criterion: "Policies and Procedures",
      summary: "Written policies reviewed periodically and supporting procedures",
      questions: [
        {
          question: "Do you maintain written security policies that are reviewed at least annually, with supporting procedures?",
          sample_answers: [
            "Yes, we maintain a suite of written security policies (Access Control, Change Management, Incident Response, Vendor Management, Data Classification, etc.) that are reviewed and approved at least annually. Supporting procedures operationalize the policies, and a documented exception process exists.",
            "Yes, key security policies are documented, reviewed annually, and supported by procedures. Exceptions require approval.",
            "No, policies are incomplete or not reviewed on a regular cadence."
          ],
          evidence_examples: ["Policy documents with review/approval dates", "Procedure documents", "Exception logs"]
        }
      ]
    },
    {
      id: "CC6.1",
      criterion: "Logical Access Security",
      summary: "SSO, MFA, RBAC, encryption, network segmentation",
      questions: [
        {
          question: "Is multi-factor authentication (MFA) enforced for production systems and administrative access?",
          sample_answers: [
            "Yes, multi-factor authentication is enforced for all production systems and administrative access via our identity provider (SSO + MFA). Exceptions are rare, documented, and require approval.",
            "Yes, MFA is required for all users accessing the application, cloud consoles, and privileged accounts. Enforcement is configured at the identity provider level.",
            "No, MFA is not consistently enforced for production or administrative access."
          ],
          evidence_examples: ["Identity provider MFA configuration", "MFA enrollment / compliance reports"]
        },
        {
          question: "Do you encrypt data at rest and in transit?",
          sample_answers: [
            "Yes, data at rest is encrypted using AES-256 (or equivalent) and data in transit is protected using TLS 1.2 or higher. Encryption is applied to databases, object storage, and service communications.",
            "Yes, we enforce encryption at rest for sensitive data stores and require TLS 1.2+ for communications.",
            "No, encryption is not consistently applied."
          ],
          evidence_examples: ["Encryption configurations (KMS, database, storage)", "TLS configuration evidence"]
        },
        {
          question: "Do you use role-based access control (RBAC) and network segmentation?",
          sample_answers: [
            "Yes, role-based access control is implemented and network segmentation / security groups are used to restrict traffic between components according to least privilege.",
            "Yes, access is granted based on defined roles and network controls limit lateral movement.",
            "No, RBAC and/or network segmentation are not fully implemented."
          ],
          evidence_examples: ["RBAC role definitions", "Network architecture diagrams and security-group rules"]
        }
      ]
    },
    {
      id: "CC6.2",
      criterion: "User Registration & Authorization",
      summary: "Formal access request and approval workflow",
      questions: [
        {
          question: "Is there a formal access request and approval process before granting system access?",
          sample_answers: [
            "Yes, all access requests are submitted through a formal workflow (ticketing or IAM system). Access is approved by an authorized manager or system owner before provisioning, and the requester cannot approve their own access. Least privilege is applied.",
            "Yes, we use a documented access request process that enforces segregation of duties and least privilege. Approvals are retained.",
            "No, access is sometimes granted without a formal approval workflow."
          ],
          evidence_examples: ["Access request tickets with approvals", "Provisioning logs", "Access request workflow documentation"]
        }
      ]
    },
    {
      id: "CC6.3",
      criterion: "Access Modification & Removal",
      summary: "Timely de-provisioning and periodic access reviews",
      questions: [
        {
          question: "Is access removed in a timely manner when an employee is terminated or changes roles?",
          sample_answers: [
            "Yes, access is revoked on the same day or next business day of termination or role change. Offboarding checklists are used and removal is verified, with additional focus on privileged accounts.",
            "Yes, de-provisioning is triggered by HR events (automated or semi-automated) and manually verified for high-risk accounts.",
            "No, access removal timelines are not consistently enforced."
          ],
          evidence_examples: ["Offboarding checklists", "Access removal records with timestamps", "Sample termination tickets"]
        },
        {
          question: "Do you perform periodic access reviews, especially for privileged accounts?",
          sample_answers: [
            "Yes, access reviews are performed at least quarterly for privileged accounts and at least annually for standard accounts. Reviewers confirm continued business need and excess access is removed and evidenced.",
            "Yes, periodic access certifications are conducted with reviewer sign-off. Findings are tracked to remediation.",
            "No, formal periodic access reviews are not currently performed."
          ],
          evidence_examples: ["Access review reports with sign-off", "Remediation evidence for excess access", "PAM or just-in-time access logs (if used)"]
        }
      ]
    },
    {
      id: "CC6.4",
      criterion: "Physical Access",
      summary: "Physical controls for offices and reliance on cloud provider controls",
      questions: [
        {
          question: "Do you restrict physical access to facilities and rely appropriately on cloud provider controls?",
          sample_answers: [
            "Yes, physical access to offices is controlled via badge systems and visitor logging. For cloud environments we rely on the provider’s SOC 2 / ISO report and have documented complementary user entity controls.",
            "Yes, physical security controls are in place for any company-controlled facilities, and cloud physical security is addressed through provider attestations plus our CUECs.",
            "No, physical access controls or cloud reliance documentation are incomplete."
          ],
          evidence_examples: ["Badge access logs", "Visitor logs", "Cloud provider SOC 2 / ISO report", "Documented complementary user entity controls"]
        }
      ]
    },
    {
      id: "CC6.5",
      criterion: "Asset Disposal",
      summary: "Secure disposal of media and devices",
      questions: [
        {
          question: "Do you securely wipe or destroy media and devices before disposal or reuse?",
          sample_answers: [
            "Yes, we follow secure wipe or certified destruction procedures for media and devices before disposal or reuse. Assets are tracked through their lifecycle and disposal evidence is retained.",
            "Yes, secure disposal procedures are documented and applied; certificates of destruction or wipe logs are kept.",
            "No, formal secure disposal procedures are not consistently followed."
          ],
          evidence_examples: ["Disposal certificates or wipe logs", "Asset inventory status records", "Secure disposal procedure"]
        }
      ]
    },
    {
      id: "CC6.6",
      criterion: "Boundary Protection",
      summary: "Perimeter controls, WAF, DDoS, IDS/IPS",
      questions: [
        {
          question: "Do you implement boundary protection against external threats?",
          sample_answers: [
            "Yes, we use perimeter firewalls / security groups, WAF, DDoS protection, and intrusion detection/prevention where appropriate. Administrative access from the internet is restricted.",
            "Yes, network boundary controls are in place and reviewed periodically. Alerts from IDS/IPS or equivalent are monitored.",
            "No, comprehensive boundary protection is not fully implemented."
          ],
          evidence_examples: ["Firewall / security-group rulesets", "WAF configuration", "IDS/IPS alert samples or configuration"]
        }
      ]
    },
    {
      id: "CC6.7",
      criterion: "Transmission and Movement of Information",
      summary: "DLP, encrypted channels, controls on removable media and downloads",
      questions: [
        {
          question: "Do you protect information during transmission, movement, and removal?",
          sample_answers: [
            "Yes, we apply DLP controls or data classification labels, require encrypted channels for data movement, and restrict removable media and sensitive downloads according to policy.",
            "Yes, sensitive data in transit is encrypted and controls exist to prevent unauthorized movement or exfiltration.",
            "No, controls over transmission and movement of sensitive information are limited."
          ],
          evidence_examples: ["DLP policies and configurations", "Encryption settings for data in transit", "Download restriction or logging configurations"]
        }
      ]
    },
    {
      id: "CC6.8",
      criterion: "Malware Prevention",
      summary: "EDR / antivirus and related controls",
      questions: [
        {
          question: "Do you protect endpoints and servers against malware?",
          sample_answers: [
            "Yes, endpoint detection and response (EDR) or antivirus is deployed on endpoints and servers. Signatures or behavior models are kept current, and detections are responded to according to defined procedures. Application allow-listing is used where appropriate.",
            "Yes, malware protection is deployed with high coverage and monitoring of detections.",
            "No, malware protection coverage or response processes are incomplete."
          ],
          evidence_examples: ["EDR / antivirus coverage reports", "Malware detection and response tickets", "Allow-listing configuration (if used)"]
        }
      ]
    },
    {
      id: "CC7.1",
      criterion: "Vulnerability Management",
      summary: "Scanning, patching, and configuration monitoring",
      questions: [
        {
          question: "Do you perform regular vulnerability scanning and remediate findings according to defined SLAs?",
          sample_answers: [
            "Yes, we perform regular (preferably authenticated) vulnerability scanning of in-scope systems. Critical and high findings are remediated according to defined SLAs by severity. Configuration drift is also monitored.",
            "Yes, vulnerability scans run on a defined cadence and findings are prioritized and tracked to closure within agreed timelines. Exceptions are documented.",
            "No, regular vulnerability scanning and SLA-based remediation are not fully in place."
          ],
          evidence_examples: ["Vulnerability scan reports", "Patch / remediation tickets with timelines", "Configuration drift alerts"]
        }
      ]
    },
    {
      id: "CC7.2",
      criterion: "Security Monitoring",
      summary: "Centralized logging and alerting on anomalous activity",
      questions: [
        {
          question: "Do you monitor systems for anomalous activity and have defined coverage?",
          sample_answers: [
            "Yes, we maintain centralized logging and alerting on anomalous activity (failed logins, privilege escalation, unusual data access, etc.). Monitoring coverage (including on-call arrangements) is defined and alerts are triaged within expected timeframes.",
            "Yes, security monitoring is in place with defined rules, coverage hours, and response expectations.",
            "No, continuous security monitoring is limited."
          ],
          evidence_examples: ["SIEM / monitoring rules", "Sample alerts and triage records", "On-call schedules"]
        }
      ]
    },
    {
      id: "CC7.3",
      criterion: "Security Event Evaluation",
      summary: "Process to determine whether events are incidents",
      questions: [
        {
          question: "Do you have a defined process to evaluate security events and determine if they are incidents?",
          sample_answers: [
            "Yes, we have a documented process and severity classification for evaluating alerts and promoting them to security incidents when appropriate. Escalation criteria are defined.",
            "Yes, alerts are triaged according to defined criteria and escalated to incident status based on potential impact.",
            "No, a formal event evaluation process is not documented."
          ],
          evidence_examples: ["Alert triage tickets", "Incident classification criteria"]
        }
      ]
    },
    {
      id: "CC7.4",
      criterion: "Incident Response",
      summary: "Incident Response Plan, tabletop exercises, and post-incident reviews",
      questions: [
        {
          question: "Do you maintain a documented Incident Response Plan and test it periodically?",
          sample_answers: [
            "Yes, we maintain a documented Incident Response Plan that defines roles, communication procedures, containment, eradication, and recovery steps. The plan is tested via tabletop exercises at least annually and actual incidents follow the plan with post-incident reviews.",
            "Yes, an Incident Response Plan exists, is reviewed regularly, and is tested through tabletop exercises. Lessons learned are incorporated.",
            "No, a formal Incident Response Plan is not maintained or tested."
          ],
          evidence_examples: ["Current Incident Response Plan", "Tabletop exercise reports", "Incident tickets and post-mortem reports"]
        }
      ]
    },
    {
      id: "CC7.5",
      criterion: "Incident Recovery",
      summary: "Recovery procedures and lessons learned",
      questions: [
        {
          question: "Do you have recovery procedures integrated with the Incident Response Plan and a lessons-learned process?",
          sample_answers: [
            "Yes, recovery procedures are documented and integrated with the Incident Response Plan. Post-incident lessons-learned reviews are performed and findings are used to improve controls.",
            "Yes, recovery runbooks exist and incidents drive control improvements through a formal lessons-learned process.",
            "No, recovery procedures or lessons-learned processes are incomplete."
          ],
          evidence_examples: ["Recovery runbooks", "Closed post-incident action items"]
        }
      ]
    },
    {
      id: "CC8.1",
      criterion: "Change Management",
      summary: "Formal change process with separation of duties, testing, and emergency procedures",
      questions: [
        {
          question: "Do you have a formal change management process that includes approval, testing, and separation of duties?",
          sample_answers: [
            "Yes, all changes to production systems and the application follow a formal change management process that includes request, approval, testing, and peer review. Developers cannot promote changes to production alone. CI/CD pipelines enforce automated checks. Emergency changes have a documented retrospective review process and rollback capability exists.",
            "Yes, we enforce separation of duties, require pull-request reviews, automated testing, and have a controlled emergency change process.",
            "No, changes are sometimes made without formal approval, testing, or separation of duties."
          ],
          evidence_examples: ["Change tickets with approvals", "Pull request / code review records", "CI/CD pipeline configurations", "Emergency change logs with retrospective reviews"]
        }
      ]
    },
    {
      id: "CC9.1",
      criterion: "Business Disruption / BCDR",
      summary: "Business Continuity / Disaster Recovery plan and tested backups",
      questions: [
        {
          question: "Do you maintain a Business Continuity / Disaster Recovery plan with defined RTO/RPO and tested backups?",
          sample_answers: [
            "Yes, we maintain a BC/DR plan with defined Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO). Backups are performed regularly, success is monitored, and restoration has been tested.",
            "Yes, a BC/DR plan exists, backups are automated with defined retention, and recovery testing is performed.",
            "No, a formal BC/DR plan or tested recovery capability is not in place."
          ],
          evidence_examples: ["BC/DR plan with RTO/RPO", "Backup success logs and retention settings", "Restoration test reports"]
        }
      ]
    },
    {
      id: "CC9.2",
      criterion: "Vendor Risk Management",
      summary: "Vendor inventory, assessments, contracts, and re-assessments",
      questions: [
        {
          question: "Do you assess and monitor the security posture of critical vendors?",
          sample_answers: [
            "Yes, we maintain a vendor inventory with criticality tiering. Critical vendors are assessed via security questionnaires or review of their SOC 2 / ISO reports. Contracts include security and incident notification requirements, and re-assessments are performed on a defined schedule.",
            "Yes, critical vendors undergo security due diligence before onboarding and are re-evaluated periodically. Security requirements are included in contracts.",
            "No, formal vendor security assessments are not consistently performed."
          ],
          evidence_examples: ["Vendor inventory with criticality ratings", "Vendor security assessment reports or SOC 2 reviews", "Contracts containing security clauses", "Vendor re-assessment schedule and results"]
        }
      ]
    },
    {
      id: "A1.1",
      criterion: "Availability – Capacity Management",
      summary: "Capacity monitoring, planning, and auto-scaling",
      questions: [
        {
          question: "Do you monitor capacity and plan for demand?",
          sample_answers: [
            "Yes, we monitor capacity metrics (CPU, memory, storage, network, etc.) with alerting thresholds. Capacity planning is linked to growth forecasts and auto-scaling is used where appropriate.",
            "Yes, capacity is actively monitored and planning is performed to ensure availability commitments can be met.",
            "No, formal capacity monitoring and planning are limited."
          ],
          evidence_examples: ["Capacity monitoring dashboards", "Capacity planning documents", "Scaling event logs"]
        }
      ]
    },
    {
      id: "A1.2",
      criterion: "Availability – Environmental Protections & Recovery Infrastructure",
      summary: "Redundancy, automated backups, environmental monitoring",
      questions: [
        {
          question: "Do you maintain redundant architecture and automated backups?",
          sample_answers: [
            "Yes, the application architecture includes redundancy (multi-AZ or multi-region as needed). Backups are automated with a defined retention policy and success is monitored. Environmental monitoring is applied for any on-premises components.",
            "Yes, redundancy and automated backups with retention are in place to support availability objectives.",
            "No, redundancy or backup processes are incomplete."
          ],
          evidence_examples: ["Architecture diagrams showing redundancy", "Backup job success rates and retention settings"]
        }
      ]
    },
    {
      id: "A1.3",
      criterion: "Availability – Recovery Testing",
      summary: "Testing of recovery / failover procedures",
      questions: [
        {
          question: "Do you test your disaster recovery or failover procedures?",
          sample_answers: [
            "Yes, we perform disaster recovery / failover testing at least annually. Test results, including issues and remediation actions, are documented and findings are tracked to closure.",
            "Yes, recovery procedures are tested on a defined schedule and results are reviewed by management.",
            "No, formal recovery testing is not currently performed."
          ],
          evidence_examples: ["DR / failover test reports", "Issues log and remediation evidence"]
        }
      ]
    },
    {
      id: "C1.1",
      criterion: "Confidentiality – Identify & Maintain",
      summary: "Data classification and protection of confidential information",
      questions: [
        {
          question: "Do you define data classification and protect confidential information?",
          sample_answers: [
            "Yes, data is classified by type and sensitivity (including a Confidential category) with controls aligned to each level. Confidential data is labeled or tagged, access is restricted, encryption is applied, and contractual confidentiality clauses (NDAs) are used where appropriate.",
            "Yes, a data classification scheme exists and confidential information is protected through access controls, encryption, and contractual measures.",
            "No, a formal data classification scheme or specific confidential data protections are not in place."
          ],
          evidence_examples: ["Data classification policy", "Sample labeled data", "Access control lists and encryption settings for confidential data", "NDAs or contractual confidentiality clauses"]
        }
      ]
    },
    {
      id: "C1.2",
      criterion: "Confidentiality – Disposal",
      summary: "Secure disposal of confidential information",
      questions: [
        {
          question: "Do you securely dispose of confidential information when it is no longer needed?",
          sample_answers: [
            "Yes, we follow secure disposal procedures (crypto-shredding or certified destruction) for confidential data and media. A retention schedule triggers disposal when data is no longer required.",
            "Yes, confidential information is disposed of securely according to a defined retention schedule and disposal evidence is retained.",
            "No, formal secure disposal procedures for confidential information are not consistently applied."
          ],
          evidence_examples: ["Disposal certificates or crypto-shredding logs", "Retention and disposal logs"]
        }
      ]
    },
    {
      id: "P-Notice",
      criterion: "Privacy – Notice",
      summary: "Published privacy notice and change notification",
      questions: [
        {
          question: "Do you publish an accurate privacy notice and notify data subjects of material changes?",
          sample_answers: [
            "Yes, we publish a privacy notice that accurately describes our privacy practices. A process exists to update the notice and notify data subjects of material changes.",
            "Yes, a current privacy notice is maintained and material changes are communicated to data subjects.",
            "No, a formal privacy notice or change notification process is not in place."
          ],
          evidence_examples: ["Current privacy notice", "Change history and notification records"]
        }
      ]
    },
    {
      id: "P-Choice",
      criterion: "Privacy – Choice / Consent",
      summary: "Consent and preference management",
      questions: [
        {
          question: "Do you provide mechanisms for consent or opt-out and respect user preferences?",
          sample_answers: [
            "Yes, we provide mechanisms to obtain and record consent or opt-out preferences and enforce those preferences across systems.",
            "Yes, consent and preference management is implemented and user choices are respected.",
            "No, formal consent or preference management mechanisms are limited."
          ],
          evidence_examples: ["Consent / preference management records"]
        }
      ]
    },
    {
      id: "P-Collection",
      criterion: "Privacy – Collection Limitation",
      summary: "Purpose limitation for collection of personal data",
      questions: [
        {
          question: "Do you limit collection of personal information to stated purposes?",
          sample_answers: [
            "Yes, personal information is collected only for identified purposes and purpose limitation is documented and enforced.",
            "Yes, collection practices are limited to stated purposes in our privacy notice and internal procedures.",
            "No, formal purpose limitation controls are not documented."
          ],
          evidence_examples: ["Purpose limitation documentation", "Collection procedures"]
        }
      ]
    },
    {
      id: "P-Retention",
      criterion: "Privacy – Use, Retention & Disposal",
      summary: "Retention schedule and secure deletion of personal data",
      questions: [
        {
          question: "Do you have a retention schedule and securely delete personal data when no longer needed?",
          sample_answers: [
            "Yes, we maintain a retention schedule for personal data. When data is no longer needed it is securely deleted and purpose limitation is enforced during use and retention.",
            "Yes, retention and secure deletion processes for personal data are defined and followed.",
            "No, formal retention and deletion processes for personal data are incomplete."
          ],
          evidence_examples: ["Retention schedule", "Deletion logs"]
        }
      ]
    },
    {
      id: "P-Access",
      criterion: "Privacy – Data Subject Access (DSAR)",
      summary: "Process for access, correction, and deletion requests",
      questions: [
        {
          question: "Do you have a process for individuals to request access, correction, or deletion of their personal data?",
          sample_answers: [
            "Yes, we maintain a Data Subject Access Request (DSAR) process with defined SLAs. Requests are tracked and fulfilled, and evidence of completion is retained.",
            "Yes, a DSAR process exists with clear timelines and fulfillment records are kept.",
            "No, a formal DSAR process is not in place."
          ],
          evidence_examples: ["DSAR procedure", "Request logs and sample fulfilled requests"]
        }
      ]
    },
    {
      id: "P-Disclosure",
      criterion: "Privacy – Disclosure to Third Parties",
      summary: "Inventory, contracts, and transfer assessments",
      questions: [
        {
          question: "Do you control disclosure of personal data to third parties?",
          sample_answers: [
            "Yes, we maintain an inventory of third parties that receive personal data. Contracts include privacy and security requirements, and transfer impact assessments are performed where required.",
            "Yes, third-party disclosures are controlled through inventory, contractual clauses, and assessments as needed.",
            "No, formal controls over third-party disclosures of personal data are limited."
          ],
          evidence_examples: ["Third-party inventory", "Contracts with privacy clauses", "Transfer impact assessments"]
        }
      ]
    },
    {
      id: "P-Security",
      criterion: "Privacy – Security for Privacy",
      summary: "Technical and organizational measures protecting personal data",
      questions: [
        {
          question: "Do you apply technical and organizational measures to protect personal data?",
          sample_answers: [
            "Yes, personal data is protected by technical and organizational measures that align with and, where needed, extend our Security (CC6/CC7) controls.",
            "Yes, appropriate security measures are applied specifically to personal data in addition to general security controls.",
            "No, privacy-specific security measures are not clearly defined."
          ],
          evidence_examples: ["Relevant CC6/CC7 evidence", "Privacy-specific technical configurations"]
        }
      ]
    },
    {
      id: "P-Quality",
      criterion: "Privacy – Data Quality",
      summary: "Maintaining accuracy of personal data",
      questions: [
        {
          question: "Do you have procedures to maintain the accuracy of personal data?",
          sample_answers: [
            "Yes, procedures exist to maintain the accuracy of personal data and to handle corrections.",
            "Yes, data quality processes support the accuracy of personal information we hold.",
            "No, formal data quality procedures for personal data are limited."
          ],
          evidence_examples: ["Data quality procedures", "Correction logs"]
        }
      ]
    },
    {
      id: "P-Monitoring",
      criterion: "Privacy – Monitoring & Enforcement",
      summary: "Privacy impact assessments, complaint handling, and compliance reviews",
      questions: [
        {
          question: "Do you monitor privacy compliance and handle privacy-related complaints?",
          sample_answers: [
            "Yes, we perform privacy impact assessments where appropriate, maintain a complaint-handling process, and conduct periodic privacy compliance reviews.",
            "Yes, privacy monitoring, complaint handling, and periodic reviews are in place.",
            "No, formal privacy monitoring and enforcement processes are incomplete."
          ],
          evidence_examples: ["Privacy impact assessment reports", "Complaint logs", "Privacy compliance review reports"]
        }
      ]
    }
  ]
};
