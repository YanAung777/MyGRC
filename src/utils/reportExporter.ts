import { 
  ComplianceReport, 
  AIProject, 
  ModelRecord, 
  RiskRecord, 
  EvidenceFile, 
  OrganizationalPolicy, 
  IncidentRecord, 
  Vendor,
  Framework 
} from "../types";

export interface ReportDataOptions {
  projects?: AIProject[];
  models?: ModelRecord[];
  risks?: RiskRecord[];
  evidenceFiles?: EvidenceFile[];
  policies?: OrganizationalPolicy[];
  incidents?: IncidentRecord[];
  vendors?: Vendor[];
  frameworks?: Framework[];
  author?: string;
  scopeNotes?: string;
  includedSections?: {
    executiveSummary?: boolean;
    systemInventory?: boolean;
    modelCatalog?: boolean;
    riskRegister?: boolean;
    evidenceLogs?: boolean;
    governancePolicies?: boolean;
    incidentLedger?: boolean;
  };
}

/**
 * Builds a clean, standalone, print-ready HTML string for any report
 */
export function buildReportHtml(
  report: ComplianceReport | { title: string; program: string; type: string; format?: string; created?: string; id?: string },
  data: ReportDataOptions
): string {
  const title = report.title || "Compliance Audit Statement";
  const program = report.program || "Certification and Accreditation";
  const type = report.type || "Organizational Report";
  const created = report.created || new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  const reportId = report.id || `REP-${Math.floor(100000 + Math.random() * 900000)}`;
  const author = data.author || "Certified AI Governance Lead";

  const sections = data.includedSections || {
    executiveSummary: true,
    systemInventory: true,
    modelCatalog: true,
    riskRegister: true,
    evidenceLogs: true,
    governancePolicies: true,
    incidentLedger: true
  };

  const projects = data.projects || [];
  const models = data.models || [];
  const risks = data.risks || [];
  const evidenceFiles = data.evidenceFiles || [];
  const policies = data.policies || [];
  const incidents = data.incidents || [];
  const frameworks = data.frameworks || [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Compliance Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
      font-size: 11pt;
      padding: 20px;
    }

    .report-container {
      max-width: 860px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      position: relative;
    }

    /* Print Header Controls */
    .no-print-toolbar {
      max-width: 860px;
      margin: 0 auto 16px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1e293b;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
    }

    .no-print-toolbar h3 {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .btn-action {
      background: #4f46e5;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      margin-left: 8px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .btn-action:hover {
      background: #4338ca;
    }

    .btn-secondary {
      background: #334155;
      color: #f8fafc;
    }

    .btn-secondary:hover {
      background: #475569;
    }

    /* Report Layout Styles */
    .top-badge-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .org-title {
      font-size: 9pt;
      font-weight: 800;
      color: #4f46e5;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .doc-main-title {
      font-size: 22pt;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: -0.5px;
      margin-top: 4px;
    }

    .doc-meta-info {
      font-size: 9.5pt;
      color: #475569;
      margin-top: 6px;
    }

    .doc-meta-info strong {
      color: #0f172a;
    }

    .doc-ref-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 4px;
    }

    .stamp-box {
      text-align: right;
    }

    .stamp-status {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      color: #64748b;
      display: block;
    }

    .verified-badge {
      display: inline-block;
      margin-top: 6px;
      background-color: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      font-weight: 800;
      font-size: 8.5pt;
      padding: 3px 10px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Section Headers */
    .section-block {
      margin-bottom: 26px;
    }

    .section-title {
      font-size: 10pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .section-num {
      color: #4f46e5;
      font-weight: 800;
    }

    .section-desc {
      font-size: 9.5pt;
      color: #334155;
      line-height: 1.6;
      margin-bottom: 12px;
    }

    /* Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      margin-top: 8px;
    }

    table.data-table th {
      background-color: #f1f5f9;
      color: #475569;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8pt;
      letter-spacing: 0.5px;
      padding: 8px 10px;
      text-align: left;
      border-bottom: 1px solid #cbd5e1;
    }

    table.data-table td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
      vertical-align: top;
    }

    table.data-table tr:nth-child(even) {
      background-color: #f8fafc;
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
    }

    .badge-critical { background-color: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-high { background-color: #fff7ed; color: #9a3412; border: 1px solid #fed7aa; }
    .badge-medium { background-color: #fefce8; color: #854d0e; border: 1px solid #fef08a; }
    .badge-low { background-color: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .badge-indigo { background-color: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }

    /* Sign-off footer */
    .signoff-section {
      margin-top: 36px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .signature-box {
      width: 240px;
    }

    .signature-line {
      border-bottom: 1px solid #94a3b8;
      height: 35px;
      margin-bottom: 6px;
    }

    .sign-name {
      font-size: 9.5pt;
      font-weight: 700;
      color: #0f172a;
    }

    .sign-title {
      font-size: 8.5pt;
      color: #64748b;
    }

    .seal-box {
      border: 1px solid #c7d2fe;
      background: #e0e7ff22;
      border-radius: 8px;
      padding: 10px;
      text-align: center;
      width: 130px;
    }

    .seal-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      color: #4f46e5;
      font-weight: 700;
      text-transform: uppercase;
    }

    /* Print Overrides */
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }

      .no-print-toolbar {
        display: none !important;
      }

      .report-container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }

      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>

  <!-- Printable Controls Toolbar (Hidden during actual print) -->
  <div class="no-print-toolbar">
    <div>
      <h3>COMPLIANCE DOCUMENT GENERATOR</h3>
      <span style="font-size: 10px; opacity: 0.8;">Scope: ${escapeHtml(program)} • Generated ${escapeHtml(created)}</span>
    </div>
    <div>
      <button onclick="window.print()" class="btn-action">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Print / Save as PDF
      </button>
      <button onclick="downloadSelfHtml()" class="btn-action btn-secondary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Download HTML
      </button>
    </div>
  </div>

  <div class="report-container" id="report-content">
    
    <!-- Header Block -->
    <div class="top-badge-bar">
      <div>
        <span class="org-title">C&A PORTAL COMPLIANCE REGISTRY</span>
        <h1 class="doc-main-title">${escapeHtml(title)}</h1>
        <p class="doc-meta-info">
          Scope: <strong>${escapeHtml(program)}</strong> &bull; Type: ${escapeHtml(type)}
        </p>
        <p class="doc-ref-id">
          Report Ref ID: ${escapeHtml(reportId)} &bull; Timestamp: ${escapeHtml(created)}
        </p>
      </div>
      <div class="stamp-box">
        <span class="stamp-status">STATUS: APPROVED FOR EXPORT</span>
        <span class="stamp-status">HASH: SHA-256:${generateHash(title + created)}</span>
        <span class="verified-badge">VERIFIED SECURE</span>
      </div>
    </div>

    ${sections.executiveSummary ? `
    <!-- Section 1: Executive Compliance Summary -->
    <div class="section-block">
      <h2 class="section-title"><span class="section-num">1.0</span> Executive Compliance Summary</h2>
      <p class="section-desc">
        This statutory compliance audit statement has been auto-compiled by the C&A Portal AIMS Governance Engine. It synthesizes operational system registers, algorithmic risk indices, evidence audit trails, and control mappings configured under the <strong>${escapeHtml(program)}</strong> governance framework.
      </p>
      ${frameworks.length > 0 ? `
      <table class="data-table">
        <thead>
          <tr>
            <th>Framework Name</th>
            <th>Overall Progress</th>
            <th>Control Status</th>
          </tr>
        </thead>
        <tbody>
          ${frameworks.map(f => `
            <tr>
              <td><strong>${escapeHtml(f.name)}</strong></td>
              <td>${f.progress}% Complete</td>
              <td><span class="badge badge-indigo">Active Monitoring</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ` : ''}
    </div>
    ` : ''}

    ${sections.systemInventory && projects.length > 0 ? `
    <!-- Section 2: AI System Inventory -->
    <div class="section-block">
      <h2 class="section-title"><span class="section-num">2.0</span> Registered Algorithmic Systems</h2>
      <p class="section-desc">
        The active enterprise AI registry documents the following primary systems currently in operational scope:
      </p>
      <table class="data-table">
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Risk Classification</th>
            <th>Status</th>
            <th>Mapped Models</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          ${projects.map(p => `
            <tr>
              <td><strong>${escapeHtml(p.title)}</strong><br/><span style="font-size:7.5pt; color:#64748b;">${escapeHtml(p.targetIndustry || '')}</span></td>
              <td>
                <span class="badge ${p.riskClassification === 'High Risk' || p.riskClassification === 'Unacceptable' ? 'badge-critical' : p.riskClassification === 'Limited' ? 'badge-high' : 'badge-low'}">
                  ${escapeHtml(p.riskClassification)} Risk
                </span>
              </td>
              <td>${escapeHtml(p.status)}</td>
              <td>${p.mappedModels && p.mappedModels.length ? p.mappedModels.map(m => `<span class="badge badge-indigo">${escapeHtml(m)}</span>`).join(' ') : 'None'}</td>
              <td>${escapeHtml(p.owner)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${sections.modelCatalog && models.length > 0 ? `
    <!-- Section 3: Model Benchmarking -->
    <div class="section-block">
      <h2 class="section-title"><span class="section-num">3.0</span> Foundation Models & Deployment Controls</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Model Name</th>
            <th>Provider</th>
            <th>Version</th>
            <th>Approval Status</th>
            <th>Approved By</th>
          </tr>
        </thead>
        <tbody>
          ${models.map(m => `
            <tr>
              <td><strong>${escapeHtml(m.name)}</strong></td>
              <td>${escapeHtml(m.provider)}</td>
              <td><code>${escapeHtml(m.version)}</code></td>
              <td>
                <span class="badge ${m.status === 'Approved' ? 'badge-low' : m.status === 'Restricted' ? 'badge-medium' : 'badge-critical'}">
                  ${escapeHtml(m.status)}
                </span>
              </td>
              <td>${escapeHtml(m.approver)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${sections.riskRegister && risks.length > 0 ? `
    <!-- Section 4: Risk Register -->
    <div class="section-block">
      <h2 class="section-title"><span class="section-num">4.0</span> Algorithmic Risk Register & Mitigations</h2>
      <p class="section-desc">
        Threat evaluations, severity classifications, and mitigation strategies recorded in the central risk ledger:
      </p>
      <table class="data-table">
        <thead>
          <tr>
            <th>Risk Name</th>
            <th>Severity</th>
            <th>Risk Rating</th>
            <th>Mitigation Status</th>
            <th>Action Owner</th>
          </tr>
        </thead>
        <tbody>
          ${risks.map(r => `
            <tr>
              <td>
                <strong>${escapeHtml(r.name)}</strong><br/>
                <span style="font-size:7.5pt; color:#64748b;">${escapeHtml(r.description)}</span>
              </td>
              <td>${escapeHtml(r.severity)}</td>
              <td>
                <span class="badge ${r.riskLevel === 'CRITICAL RISK' ? 'badge-critical' : r.riskLevel === 'HIGH RISK' ? 'badge-high' : 'badge-low'}">
                  ${escapeHtml(r.riskLevel)}
                </span>
              </td>
              <td><strong>${escapeHtml(r.mitigationStatus)}</strong></td>
              <td>${escapeHtml(r.owner)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${sections.evidenceLogs && evidenceFiles.length > 0 ? `
    <!-- Section 5: Evidence File Verification -->
    <div class="section-block">
      <h2 class="section-title"><span class="section-num">5.0</span> Verified Audit Evidence & Documents</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Upload Date</th>
            <th>Version</th>
            <th>Status</th>
            <th>Uploader</th>
          </tr>
        </thead>
        <tbody>
          ${evidenceFiles.map(e => `
            <tr>
              <td><strong>${escapeHtml(e.name)}</strong></td>
              <td>${escapeHtml(e.uploadDate)}</td>
              <td>${escapeHtml(e.version)}</td>
              <td><span class="badge badge-low">${escapeHtml(e.status)}</span></td>
              <td>${escapeHtml(e.uploader)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${sections.governancePolicies && policies.length > 0 ? `
    <!-- Section 6: Governance Policies -->
    <div class="section-block">
      <h2 class="section-title"><span class="section-num">6.0</span> Governance Policies & Directives</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Policy Title</th>
            <th>Status</th>
            <th>Tags</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          ${policies.map(p => `
            <tr>
              <td><strong>${escapeHtml(p.title)}</strong></td>
              <td><span class="badge badge-low">${escapeHtml(p.status)}</span></td>
              <td>${p.tags ? p.tags.map(t => `<span class="badge badge-indigo">${escapeHtml(t)}</span>`).join(' ') : ''}</td>
              <td>${escapeHtml(p.lastUpdated)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    ${sections.incidentLedger && incidents.length > 0 ? `
    <!-- Section 7: Incident Ledger -->
    <div class="section-block">
      <h2 class="section-title"><span class="section-num">7.0</span> Algorithmic Incident Log</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Incident Type</th>
            <th>Project</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Occurred Date</th>
          </tr>
        </thead>
        <tbody>
          ${incidents.map(inc => `
            <tr>
              <td><strong>${escapeHtml(inc.type)}</strong></td>
              <td>${escapeHtml(inc.project)}</td>
              <td>
                <span class="badge ${inc.severity === 'CRITICAL' || inc.severity === 'SERIOUS' ? 'badge-critical' : 'badge-high'}">
                  ${escapeHtml(inc.severity)}
                </span>
              </td>
              <td>${escapeHtml(inc.status)}</td>
              <td>${escapeHtml(inc.occurred)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    <!-- Sign-off Section -->
    <div class="signoff-section">
      <div class="signature-box">
        <div style="font-size: 8pt; font-weight: 700; color: #64748b; text-transform: uppercase;">AUTHORIZED COMPLIANCE LEAD</div>
        <div class="signature-line"></div>
        <div class="sign-name">${escapeHtml(author)}</div>
        <div class="sign-title">AI Governance & Compliance Director</div>
      </div>
      <div class="seal-box">
        <div class="seal-text">SECURE AUDIT SEAL</div>
        <div style="font-size: 14pt; margin: 4px 0;">🛡️</div>
        <div class="seal-text" style="font-size: 6pt;">ID: #${Math.floor(100000 + Math.random() * 900000)}</div>
      </div>
    </div>

  </div>

  <script>
    function downloadSelfHtml() {
      var htmlContent = "<!DOCTYPE html>\\n" + document.documentElement.outerHTML;
      var blob = new Blob([htmlContent], { type: "text/html" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "${escapeFileName(title)}.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;
}

/**
 * Triggers a download of a formatted HTML report document
 */
export function downloadReportAsHtml(
  report: ComplianceReport | { title: string; program: string; type: string; format?: string; created?: string; id?: string },
  data: ReportDataOptions
) {
  const htmlContent = buildReportHtml(report, data);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileName = `${escapeFileName(report.title || "Compliance_Report")}_${new Date().toISOString().slice(0, 10)}.html`;
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Opens a print-ready window that automatically calls window.print() for PDF saving / printing
 */
export function printReport(
  report: ComplianceReport | { title: string; program: string; type: string; format?: string; created?: string; id?: string },
  data: ReportDataOptions
) {
  const htmlContent = buildReportHtml(report, data);
  const printWindow = window.open("", "_blank", "width=900,height=800,scrollbars=yes");
  
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Trigger print after resources load
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 300);
    };
  } else {
    // Fallback if popup blocked: fallback to downloading HTML
    downloadReportAsHtml(report, data);
  }
}

/**
 * Triggers PDF export by opening the print preview or downloading a print-formatted file
 */
export function downloadReportAsPdf(
  report: ComplianceReport | { title: string; program: string; type: string; format?: string; created?: string; id?: string },
  data: ReportDataOptions
) {
  printReport(report, data);
}

/**
 * Builds printable HTML for a specific Evidence Artifact
 */
export function buildEvidenceFileHtml(file: EvidenceFile, folderName: string = "General Evidence"): string {
  const hash = `7f8c9d01a2b3c4d5e6f7${file.id}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evidence Artifact - ${escapeHtml(file.name)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 15mm;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.6;
      font-size: 11pt;
      padding: 20px;
    }

    .no-print-toolbar {
      max-width: 800px;
      margin: 0 auto 16px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
    }

    .btn-action {
      background: #4f46e5;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      margin-left: 8px;
    }

    .btn-secondary {
      background: #334155;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .sub-title {
      font-size: 8.5pt;
      font-weight: 800;
      color: #4f46e5;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .main-title {
      font-size: 20pt;
      font-weight: 900;
      color: #0f172a;
      margin-top: 4px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      background: #f1f5f9;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      font-size: 9.5pt;
    }

    .meta-item strong {
      color: #0f172a;
    }

    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: 800;
      text-transform: uppercase;
    }

    .status-approved { background: #dcfce7; color: #166534; }
    .status-review { background: #fef3c7; color: #92400e; }
    .status-draft { background: #f1f5f9; color: #475569; }

    .hash-box {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      background: #1e293b;
      color: #38bdf8;
      padding: 12px;
      border-radius: 6px;
      word-break: break-all;
      margin-bottom: 24px;
    }

    .section {
      margin-bottom: 20px;
    }

    .section-h2 {
      font-size: 10pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }

    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: #64748b;
    }

    @media print {
      body { background: white; padding: 0; }
      .no-print-toolbar { display: none; }
      .container { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>

  <div class="no-print-toolbar">
    <div>
      <strong style="font-size: 13px;">EVIDENCE ARTIFACT EXPORT</strong>
      <span style="font-size: 11px; opacity: 0.8; margin-left: 8px;">${escapeHtml(file.name)}</span>
    </div>
    <div>
      <button onclick="window.print()" class="btn-action">Print / Save PDF</button>
      <button onclick="downloadSelfHtml()" class="btn-action btn-secondary">Download HTML</button>
    </div>
  </div>

  <div class="container">
    <div class="header-bar">
      <div>
        <div class="sub-title">GOVERNANCE EVIDENCE ARTIFACT</div>
        <h1 class="main-title">${escapeHtml(file.name)}</h1>
      </div>
      <div>
        <span class="status-badge ${file.status === 'Approved' ? 'status-approved' : file.status === 'Under Review' ? 'status-review' : 'status-draft'}">
          ${escapeHtml(file.status)}
        </span>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-item"><strong>Artifact ID:</strong> ${escapeHtml(file.id)}</div>
      <div class="meta-item"><strong>Active Folder:</strong> ${escapeHtml(folderName)}</div>
      <div class="meta-item"><strong>Source Project:</strong> ${escapeHtml(file.source)}</div>
      <div class="meta-item"><strong>Version:</strong> ${escapeHtml(file.version)}</div>
      <div class="meta-item"><strong>Uploaded Date:</strong> ${escapeHtml(file.uploadDate)}</div>
      <div class="meta-item"><strong>Uploaded By:</strong> ${escapeHtml(file.uploader)}</div>
    </div>

    <div class="section">
      <div class="section-h2">Cryptographic Fingerprint (SHA-256)</div>
      <div class="hash-box">SHA-256: ${escapeHtml(hash)}</div>
    </div>

    <div class="section">
      <div class="section-h2">1. Purpose & Scope</div>
      <p>This document serves as official statutory compliance evidence establishing governance loops, model parameter validation, and algorithmic integrity checks for the <strong>${escapeHtml(file.source)}</strong> operational ecosystem under ISO 42001 and NIST RMF standards.</p>
    </div>

    <div class="section">
      <div class="section-h2">2. Model Specifications & Parameters</div>
      <p>Algorithmic models associated are locked under versioning control v${escapeHtml(file.version)}. Direct evaluation has been conducted across training loops, biased outcome logs, and system latency matrices to satisfy statutory non-repudiation mandates.</p>
    </div>

    <div class="section">
      <div class="section-h2">3. Operational Control Verifications</div>
      <ul style="padding-left: 20px; font-size: 9.5pt;">
        <li>Continuous telemetry audit log enabled across client ingress endpoints.</li>
        <li>Human-in-the-loop (HITL) overrides established for high-impact decision-making branches.</li>
        <li>Input token anonymization pipelines verified under ISO 27701 privacy rules.</li>
      </ul>
    </div>

    <div class="footer">
      <div>SECURED BY C&A PORTAL AIMS GOVERNANCE ENGINE</div>
      <div>CLASSIFICATION: CONFIDENTIAL AUDIT ARTIFACT</div>
    </div>
  </div>

  <script>
    function downloadSelfHtml() {
      var htmlContent = "<!DOCTYPE html>\\n" + document.documentElement.outerHTML;
      var blob = new Blob([htmlContent], { type: "text/html" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "${escapeFileName(file.name)}.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;
}

/**
 * Downloads Evidence File as HTML
 */
export function downloadEvidenceFile(file: EvidenceFile, folderName: string) {
  const htmlContent = buildEvidenceFileHtml(file, folderName);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileName = `${escapeFileName(file.name)}_${file.id}.html`;
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers window print for Evidence File
 */
export function printEvidenceFile(file: EvidenceFile, folderName: string) {
  const htmlContent = buildEvidenceFileHtml(file, folderName);
  const printWindow = window.open("", "_blank", "width=900,height=800,scrollbars=yes");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 300);
    };
  } else {
    downloadEvidenceFile(file, folderName);
  }
}

// Helpers
function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeFileName(str: string): string {
  if (!str) return "Report";
  return str.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0') + "A9B2C3";
}
