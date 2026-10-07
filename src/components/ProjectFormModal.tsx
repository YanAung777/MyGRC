import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FolderPlus,
  FileText,
  Layers,
  ShieldAlert,
  Server,
  Workflow,
  CheckSquare,
  FileCheck2,
  AlertTriangle,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
  Scaling,
  Paperclip,
  UploadCloud,
  ClipboardCheck,
  ListChecks,
  Image as ImageIcon,
  Trash2,
  ShieldCheck,
  Award
} from "lucide-react";
import { AIProject, TeamMember, ProjectRemediationPlan, ProjectCASignOff, RiskAssessmentEntry, ControlMatrixItem } from "../types";
import ControlQuestionnairesView, { QuestionnaireAnswersState } from "./ControlQuestionnairesView";
import ComplianceChecklistView, { ComplianceChecklistState } from "./ComplianceChecklistView";
import RemediationPlanView, { DEFAULT_SAMPLE_REMEDIATION_PLAN } from "./RemediationPlanView";
import CertificationSignOffView, { DEFAULT_SAMPLE_CA_SIGNOFF } from "./CertificationSignOffView";
import RiskAssessmentView, { DEFAULT_SAMPLE_RISK_ENTRIES } from "./RiskAssessmentView";
import ControlMatrixView, { DEFAULT_CONTROL_MATRIX_ITEMS } from "./ControlMatrixView";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProject: AIProject | null;
  onSaveProject: (proj: AIProject) => void;
  team: TeamMember[];
  existingProjectsCount: number;
}

export const SECTION_TABS = [
  { id: "project_details", label: "Project Details", icon: Layers },
  { id: "system_report", label: "System Report", icon: FileText },
  { id: "overview", label: "Overview & Impact", icon: ShieldAlert },
  { id: "description_of_systems", label: "Description of Systems", icon: Server },
  { id: "summary_of_business_process", label: "Business Process & Flows", icon: Workflow },
  { id: "assessment_scope", label: "Assessment Scope", icon: CheckSquare },
  { id: "summary_of_findings", label: "Summary of Findings", icon: FileCheck2 },
  { id: "commentary_on_risk_profile", label: "Commentary & Risk", icon: AlertTriangle },
  { id: "remediation_plan", label: "Remediation Plan", icon: ShieldCheck },
  { id: "checklist_compliance", label: "Checklist & Compliance", icon: ListChecks },
  { id: "control_questionnaires", label: "Control Questionnaires", icon: ClipboardCheck },
  { id: "control_matrix", label: "Control Matrix", icon: ShieldCheck },
  { id: "evidences", label: "Evidences & Files", icon: Paperclip },
  { id: "ca_signoff", label: "C&A Sign-Off", icon: Award }
];

export default function ProjectFormModal({
  isOpen,
  onClose,
  editingProject,
  onSaveProject,
  team,
  existingProjectsCount
}: ProjectFormModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modalSize, setModalSize] = useState<"standard" | "wide" | "fullscreen" | "custom">("standard");
  const [customDimensions, setCustomDimensions] = useState<{ width: number; height: number }>({
    width: 1100,
    height: 780
  });

  // Handle manual mouse drag resizing of the modal window
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = customDimensions.width || 1100;
    const startH = customDimensions.height || 780;

    setModalSize("custom");

    const onMouseMove = (moveEvt: MouseEvent) => {
      const deltaX = (moveEvt.clientX - startX) * 2;
      const deltaY = (moveEvt.clientY - startY) * 2;

      const newWidth = Math.max(680, Math.min(window.innerWidth - 24, startW + deltaX));
      const newHeight = Math.max(480, Math.min(window.innerHeight - 24, startH + deltaY));

      setCustomDimensions({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const getContainerStyle = (): React.CSSProperties => {
    if (modalSize === "fullscreen") {
      return {
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        borderRadius: 0
      };
    }
    if (modalSize === "custom") {
      return {
        width: `${customDimensions.width}px`,
        height: `${customDimensions.height}px`,
        maxWidth: "98vw",
        maxHeight: "98vh"
      };
    }
    if (modalSize === "wide") {
      return {
        width: "100%",
        maxWidth: "88rem",
        height: "94vh",
        maxHeight: "94vh"
      };
    }
    return {
      width: "100%",
      maxWidth: "68rem",
      height: "88vh",
      maxHeight: "88vh"
    };
  };

  // Section 1: Project Details
  const [pTitle, setPTitle] = useState("");
  const [pOwner, setPOwner] = useState("");
  const [pStatus, setPStatus] = useState<"Not started" | "In progress" | "Completed" | "Active">("Not started");
  const [pGeo, setPGeo] = useState("");
  const [pRisk, setPRisk] = useState<"Minimal" | "Limited" | "High Risk" | "Unacceptable">("Minimal");
  const [pRole, setPRole] = useState("");
  const [pStart, setPStart] = useState("");
  const [pFramework, setPFramework] = useState("None");
  const [pTeam, setPTeam] = useState<string[]>(["Demo Assessor", "Leo Vance", "Mark Taylor"]);
  const [pGoal, setPGoal] = useState("");
  const [pIndustry, setPIndustry] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [formValidationError, setFormValidationError] = useState<string | null>(null);

  // Section 2: System Report
  const [sysNameOfInitiative, setSysNameOfInitiative] = useState("");
  const [sysBusinessOwner, setSysBusinessOwner] = useState("");
  const [sysStakeholders, setSysStakeholders] = useState("");
  const [sysOverviewDiagram, setSysOverviewDiagram] = useState("");
  const [sysRefDocs, setSysRefDocs] = useState("");
  const [isDiagramDragging, setIsDiagramDragging] = useState(false);
  const diagramFileInputRef = React.useRef<HTMLInputElement>(null);

  // Section 3: Overview
  const [ovDescription, setOvDescription] = useState("");
  const [ovNatureOfInfo, setOvNatureOfInfo] = useState("");
  const [ovInfoClassification, setOvInfoClassification] = useState("SENSITIVE");
  const [ovConfidentialityImpact, setOvConfidentialityImpact] = useState("Major");
  const [ovConfidentialityDesc, setOvConfidentialityDesc] = useState("");
  const [ovIntegrityImpact, setOvIntegrityImpact] = useState("Major");
  const [ovIntegrityDesc, setOvIntegrityDesc] = useState("");
  const [ovAvailabilityImpact, setOvAvailabilityImpact] = useState("Major");
  const [ovAvailabilityDesc, setOvAvailabilityDesc] = useState("");

  // Section 4: Description of Systems
  const [sysScope, setSysScope] = useState("");
  const [sysPrevCertified, setSysPrevCertified] = useState("");
  const [sysOutOfScope, setSysOutOfScope] = useState("");
  const [sysDecommissioning, setSysDecommissioning] = useState("");
  const [sysIntegrated, setSysIntegrated] = useState("");
  const [sysActorsExt, setSysActorsExt] = useState("");
  const [sysActorsEnd, setSysActorsEnd] = useState("");
  const [sysActorsInt, setSysActorsInt] = useState("");

  // Section 5: Summary of Business Process
  const [bpSummary, setBpSummary] = useState("");
  const [bpGeoLocation, setBpGeoLocation] = useState("");
  const [bpCloudModel, setBpCloudModel] = useState("PaaS");
  const [bpCertifications, setBpCertifications] = useState("");
  const [bpCloudServices, setBpCloudServices] = useState("");
  const [bpPubliclyAccessible, setBpPubliclyAccessible] = useState("No");

  // Section 6: Assessment Scope
  const [scSecurity, setScSecurity] = useState("Full Scope");
  const [scSecurityDesc, setScSecurityDesc] = useState("");
  const [scPrivacy, setScPrivacy] = useState("Limited Scope");
  const [scPrivacyDesc, setScPrivacyDesc] = useState("");
  const [scHumanRights, setScHumanRights] = useState("Limited Scope");
  const [scHumanRightsDesc, setScHumanRightsDesc] = useState("");
  const [scInfoMgmt, setScInfoMgmt] = useState("Limited Scope");
  const [scInfoMgmtDesc, setScInfoMgmtDesc] = useState("");

  // Section 7: Summary of Findings
  const [fdSecurity, setFdSecurity] = useState("");
  const [fdPrivacy, setFdPrivacy] = useState("");
  const [fdHumanRights, setFdHumanRights] = useState("");
  const [fdEthics, setFdEthics] = useState("");
  const [fdInfoMgmt, setFdInfoMgmt] = useState("");

  // Section 8: Commentary on Risk Profile
  const [rkCommentary, setRkCommentary] = useState("");
  const [rkAcceptance, setRkAcceptance] = useState("");
  const [rkRiskEntries, setRkRiskEntries] = useState<RiskAssessmentEntry[]>(DEFAULT_SAMPLE_RISK_ENTRIES);

  // Section 9: Remediation Plan
  const [remediationPlanData, setRemediationPlanData] = useState<ProjectRemediationPlan>(DEFAULT_SAMPLE_REMEDIATION_PLAN);

  // Section 10: Certification & Accreditation Sign-Off
  const [caSignOffData, setCaSignOffData] = useState<ProjectCASignOff>(DEFAULT_SAMPLE_CA_SIGNOFF);

  // Section 11: Control Questionnaires
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireAnswersState>({});

  // Section 12: Control Matrix
  const [controlMatrixData, setControlMatrixData] = useState<ControlMatrixItem[]>(DEFAULT_CONTROL_MATRIX_ITEMS);

  // Section 10: Checklist & Compliance
  const [complianceChecklistData, setComplianceChecklistData] = useState<ComplianceChecklistState>({});

  useEffect(() => {
    if (editingProject) {
      setPTitle(editingProject.title || "");
      setPOwner(editingProject.owner || "");
      setPStatus(editingProject.status || "Not started");
      setPGeo(editingProject.geography || "");
      setPRisk(editingProject.riskClassification || "Minimal");
      setPRole(editingProject.roleType || "");
      setPStart(editingProject.startDate || "");
      setPFramework(editingProject.framework || "None");
      setPTeam(editingProject.teamMembers || ["Demo Assessor", "Leo Vance", "Mark Taylor"]);
      setPGoal(editingProject.goal || "");
      setPIndustry(editingProject.targetIndustry || "");
      setPDesc(editingProject.description || "");
      setQuestionnaireAnswers(editingProject.controlQuestionnaires || {});
      setControlMatrixData(editingProject.controlMatrix || DEFAULT_CONTROL_MATRIX_ITEMS);
      setComplianceChecklistData(editingProject.complianceChecklist || {});
      setRemediationPlanData(editingProject.remediationPlan || DEFAULT_SAMPLE_REMEDIATION_PLAN);
      setCaSignOffData(editingProject.caSignOff || DEFAULT_SAMPLE_CA_SIGNOFF);

      // Section 2
      const sr = editingProject.systemReport || {};
      setSysNameOfInitiative(sr.nameOfInitiative || "");
      setSysBusinessOwner(sr.businessOwnerName || "");
      setSysStakeholders(sr.stakeholdersNames || "");
      setSysOverviewDiagram(sr.systemOverviewDiagram || (sr.referenceDocuments?.startsWith("data:image") ? sr.referenceDocuments : ""));
      setSysRefDocs(sr.referenceDocuments && !sr.referenceDocuments.startsWith("data:image") ? sr.referenceDocuments : "");

      // Section 3
      const ov = editingProject.overview || {};
      setOvDescription(ov.descriptionOfInitiative || "");
      setOvNatureOfInfo(ov.natureOfInformationHandled || "");
      setOvInfoClassification(ov.informationClassification || "SENSITIVE");
      setOvConfidentialityImpact(ov.impactConfidentialityBreached || "Major");
      setOvConfidentialityDesc(ov.impactConfidentialityBreachedDescription || "");
      setOvIntegrityImpact(ov.impactIntegrityBreached || "Major");
      setOvIntegrityDesc(ov.impactIntegrityBreachedDescription || "");
      setOvAvailabilityImpact(ov.impactAvailabilityBreached || "Major");
      setOvAvailabilityDesc(ov.impactAvailabilityBreachedDescription || "");

      // Section 4
      const ds = editingProject.descriptionOfSystems || {};
      setSysScope(ds.scope || "");
      setSysPrevCertified(ds.previouslyCertifiedAndUnchangedComponents || "");
      setSysOutOfScope(ds.outOfScope || "");
      setSysDecommissioning(ds.decommissioning || "");
      setSysIntegrated(ds.integratedSubsystemOrServices || "");
      setSysActorsExt(ds.actorsExternalUsers || "");
      setSysActorsEnd(ds.actorsEndUserDevices || "");
      setSysActorsInt(ds.actorsInternalUsers || "");

      // Section 5
      const bp = editingProject.summaryOfBusinessProcess || {};
      setBpSummary(bp.summaryOfBusinessProcess || "");
      setBpGeoLocation(bp.geographicLocationOfData || "");
      setBpCloudModel(bp.natureOfCloudServiceModel || "PaaS");
      setBpCertifications(bp.independentCertifications || "");
      setBpCloudServices(bp.cloudPlatformServices || "");
      setBpPubliclyAccessible(bp.publiclyAccessible || "No");

      // Section 6
      const sc = editingProject.assessmentScope || {};
      setScSecurity(sc.securityScope || "Full Scope");
      setScSecurityDesc(sc.securityScopeDescription || "");
      setScPrivacy(sc.privacyScope || "Limited Scope");
      setScPrivacyDesc(sc.privacyScopeDescription || "");
      setScHumanRights(sc.humanRightsAndEthicsScope || "Limited Scope");
      setScHumanRightsDesc(sc.humanRightsAndEthicsScopeDescription || "");
      setScInfoMgmt(sc.informationManagementScope || "Limited Scope");
      setScInfoMgmtDesc(sc.informationManagementScopeDescription || "");

      // Section 7
      const fd = editingProject.summaryOfFindings || {};
      setFdSecurity(fd.findingsSecurity || "");
      setFdPrivacy(fd.findingsPrivacy || "");
      setFdHumanRights(fd.findingsHumanRights || "");
      setFdEthics(fd.findingsEthics || "");
      setFdInfoMgmt(fd.findingsInformationManagement || "");

      // Section 8
      const rk = editingProject.commentaryOnRiskProfile || {};
      setRkCommentary(rk.commentaryOnRiskProfile || "");
      setRkAcceptance(rk.riskAcceptance || "");
      setRkRiskEntries(rk.riskEntries && rk.riskEntries.length > 0 ? rk.riskEntries : DEFAULT_SAMPLE_RISK_ENTRIES);
    } else {
      // Reset form defaults for new project creation
      setPTitle("");
      setPOwner("");
      setPStatus("Not started");
      setPGeo("");
      setPRisk("Minimal");
      setPRole("");
      setPStart("");
      setPFramework("None");
      setPTeam(["Demo Assessor", "Leo Vance", "Mark Taylor"]);
      setPGoal("");
      setPIndustry("");
      setPDesc("");

      setSysNameOfInitiative("");
      setSysBusinessOwner("");
      setSysStakeholders("");
      setSysOverviewDiagram("");
      setSysRefDocs("");

      setOvDescription("");
      setOvNatureOfInfo("");
      setOvInfoClassification("SENSITIVE");
      setOvConfidentialityImpact("Major");
      setOvConfidentialityDesc("");
      setOvIntegrityImpact("Major");
      setOvIntegrityDesc("");
      setOvAvailabilityImpact("Major");
      setOvAvailabilityDesc("");

      setSysScope("");
      setSysPrevCertified("");
      setSysOutOfScope("");
      setSysDecommissioning("");
      setSysIntegrated("");
      setSysActorsExt("");
      setSysActorsEnd("");
      setSysActorsInt("");

      setBpSummary("");
      setBpGeoLocation("");
      setBpCloudModel("PaaS");
      setBpCertifications("");
      setBpCloudServices("");
      setBpPubliclyAccessible("No");

      setScSecurity("Full Scope");
      setScSecurityDesc("");
      setScPrivacy("Limited Scope");
      setScPrivacyDesc("");
      setScHumanRights("Limited Scope");
      setScHumanRightsDesc("");
      setScInfoMgmt("Limited Scope");
      setScInfoMgmtDesc("");

      setFdSecurity("");
      setFdPrivacy("");
      setFdHumanRights("");
      setFdEthics("");
      setFdInfoMgmt("");

      setRkCommentary("");
      setRkAcceptance("");
      setQuestionnaireAnswers({});
      setControlMatrixData(DEFAULT_CONTROL_MATRIX_ITEMS);
      setComplianceChecklistData({});
      setRemediationPlanData(DEFAULT_SAMPLE_REMEDIATION_PLAN);
      setCaSignOffData(DEFAULT_SAMPLE_CA_SIGNOFF);
    }
    setActiveTab(0);
  }, [editingProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle.trim()) {
      setFormValidationError("Please enter a Project Title before saving the project.");
      setActiveTab(0);
      return;
    }
    setFormValidationError(null);

    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const projData: AIProject = {
      id: editingProject ? editingProject.id : `UC-${existingProjectsCount + 11}`,
      title: pTitle || "Untitled AI Project",
      owner: pOwner || "Demo Assessor",
      status: pStatus,
      geography: pGeo || "Global",
      riskClassification: pRisk,
      roleType: pRole || "Provider",
      startDate: pStart || editingProject?.startDate || todayStr,
      lastUpdated: todayStr,
      framework: pFramework || "None",
      teamMembers: pTeam.length > 0 ? pTeam : ["Demo Assessor"],
      goal: pGoal || "No goal specified.",
      targetIndustry: pIndustry,
      description: pDesc,
      mappedModels: editingProject?.mappedModels || [],
      completedComplianceTasks: editingProject?.completedComplianceTasks || [],
      controlQuestionnaires: questionnaireAnswers,
      controlMatrix: controlMatrixData,
      complianceChecklist: complianceChecklistData,
      remediationPlan: remediationPlanData,
      caSignOff: caSignOffData,

      systemReport: {
        nameOfInitiative: sysNameOfInitiative,
        businessOwnerName: sysBusinessOwner,
        stakeholdersNames: sysStakeholders,
        systemOverviewDiagram: sysOverviewDiagram,
        referenceDocuments: sysRefDocs
      },
      overview: {
        descriptionOfInitiative: ovDescription,
        natureOfInformationHandled: ovNatureOfInfo,
        informationClassification: ovInfoClassification,
        impactConfidentialityBreached: ovConfidentialityImpact,
        impactConfidentialityBreachedDescription: ovConfidentialityDesc,
        impactIntegrityBreached: ovIntegrityImpact,
        impactIntegrityBreachedDescription: ovIntegrityDesc,
        impactAvailabilityBreached: ovAvailabilityImpact,
        impactAvailabilityBreachedDescription: ovAvailabilityDesc
      },
      descriptionOfSystems: {
        scope: sysScope,
        previouslyCertifiedAndUnchangedComponents: sysPrevCertified,
        outOfScope: sysOutOfScope,
        decommissioning: sysDecommissioning,
        integratedSubsystemOrServices: sysIntegrated,
        actorsExternalUsers: sysActorsExt,
        actorsEndUserDevices: sysActorsEnd,
        actorsInternalUsers: sysActorsInt
      },
      summaryOfBusinessProcess: {
        summaryOfBusinessProcess: bpSummary,
        geographicLocationOfData: bpGeoLocation,
        natureOfCloudServiceModel: bpCloudModel,
        independentCertifications: bpCertifications,
        cloudPlatformServices: bpCloudServices,
        publiclyAccessible: bpPubliclyAccessible
      },
      assessmentScope: {
        securityScope: scSecurity,
        securityScopeDescription: scSecurityDesc,
        privacyScope: scPrivacy,
        privacyScopeDescription: scPrivacyDesc,
        humanRightsAndEthicsScope: scHumanRights,
        humanRightsAndEthicsScopeDescription: scHumanRightsDesc,
        informationManagementScope: scInfoMgmt,
        informationManagementScopeDescription: scInfoMgmtDesc
      },
      summaryOfFindings: {
        findingsSecurity: fdSecurity,
        findingsPrivacy: fdPrivacy,
        findingsHumanRights: fdHumanRights,
        findingsEthics: fdEthics,
        findingsInformationManagement: fdInfoMgmt
      },
      commentaryOnRiskProfile: {
        commentaryOnRiskProfile: rkCommentary,
        riskAcceptance: rkAcceptance,
        riskEntries: rkRiskEntries
      }
    };

    onSaveProject(projData);
    onClose();
  };

  const nextStep = () => {
    if (activeTab < SECTION_TABS.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const prevStep = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  return (
    <div className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 ${
      modalSize === "fullscreen" ? "p-0" : "p-2 sm:p-4 md:p-6"
    }`}>
      <div 
        style={getContainerStyle()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col relative transition-all duration-200 ease-out animate-scale-up"
      >
        
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-150 flex justify-between items-center bg-slate-50/90 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer shrink-0"
              title={isCollapsed ? "Expand side panel" : "Collapse side panel to get more entry space"}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4 sm:w-5 sm:h-5" /> : <PanelLeftClose className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {editingProject ? `Edit Project: ${editingProject.title}` : "Create new project"}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                Fill in governance details below. {isCollapsed ? "Side panel collapsed for maximum entry space." : "Use side panel to navigate."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Window Sizing Presets */}
            <div className="hidden md:flex items-center bg-slate-200/70 p-1 rounded-xl text-xs font-semibold text-slate-600 gap-1">
              <button
                type="button"
                onClick={() => setModalSize("standard")}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                  modalSize === "standard"
                    ? "bg-white text-indigo-700 shadow-2xs font-bold"
                    : "hover:text-slate-900"
                }`}
                title="Standard window size"
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setModalSize("wide")}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                  modalSize === "wide"
                    ? "bg-white text-indigo-700 shadow-2xs font-bold"
                    : "hover:text-slate-900"
                }`}
                title="Wide window size for large forms"
              >
                Wide
              </button>
              <button
                type="button"
                onClick={() => setModalSize("fullscreen")}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                  modalSize === "fullscreen"
                    ? "bg-white text-indigo-700 shadow-2xs font-bold"
                    : "hover:text-slate-900"
                }`}
                title="Full screen view"
              >
                Full Screen
              </button>
            </div>

            {/* Collapse Side Panel Pill */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200/90 rounded-xl transition-all cursor-pointer shadow-2xs"
              title={isCollapsed ? "Expand side panel" : "Collapse side panel"}
            >
              {isCollapsed ? (
                <>
                  <PanelLeftOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Expand Side</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="w-3.5 h-3.5 text-slate-500" />
                  <span>Collapse Side</span>
                </>
              )}
            </button>

            {/* Fullscreen Toggle Icon */}
            <button
              type="button"
              onClick={() => setModalSize(modalSize === "fullscreen" ? "standard" : "fullscreen")}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
              title={modalSize === "fullscreen" ? "Exit full screen" : "Maximize to full screen"}
            >
              {modalSize === "fullscreen" ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body Container with Side Panel and Form */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Side Panel Navigation */}
          <aside className={`bg-slate-50/90 border-r border-slate-200/80 flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-y-auto ${
            isCollapsed ? "w-16 p-2 items-center" : "w-64 sm:w-72 p-3.5 sm:p-4"
          }`}>
            <div className={`w-full flex items-center mb-2.5 px-1 ${isCollapsed ? "justify-center" : "justify-between"}`}>
              {!isCollapsed && (
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sections</span>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-mono text-[10px]">
                  {isCollapsed ? `${activeTab + 1}/${SECTION_TABS.length}` : `${activeTab + 1} / ${SECTION_TABS.length}`}
                </span>
                {!isCollapsed && (
                  <button
                    type="button"
                    onClick={() => setIsCollapsed(true)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                    title="Collapse side panel"
                  >
                    <PanelLeftClose className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <nav className="space-y-1.5 flex-1 w-full">
              {SECTION_TABS.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeTab === idx;

                if (isCollapsed) {
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(idx)}
                      title={`Step ${idx + 1}: ${tab.label}`}
                      className={`w-full flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all cursor-pointer relative group ${
                        isActive
                          ? "bg-indigo-600 text-white font-bold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 font-medium"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-800"}`} />
                      <span className={`text-[10px] font-mono font-bold mt-0.5 ${isActive ? "text-white/90" : "text-slate-500"}`}>
                        {idx + 1}
                      </span>
                    </button>
                  );
                }

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs text-left transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-600 text-white font-bold shadow-xs"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-5 h-5 rounded-lg text-[10px] flex items-center justify-center font-mono font-bold shrink-0 ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {idx + 1}
                      </span>
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 text-white/80" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Form Completion Progress Card */}
            {isCollapsed ? (
              <div 
                className="mt-3 pt-2 border-t border-slate-200/80 flex flex-col items-center w-full"
                title={`Form Progress: ${Math.round(((activeTab + 1) / SECTION_TABS.length) * 100)}%`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-indigo-700 font-mono">
                    {Math.round(((activeTab + 1) / SECTION_TABS.length) * 100)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100/80 text-indigo-900 shrink-0">
                <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-900 mb-2">
                  <span>Form Progress</span>
                  <span className="font-bold text-indigo-700">{Math.round(((activeTab + 1) / SECTION_TABS.length) * 100)}%</span>
                </div>
                <div className="w-full bg-indigo-200/60 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${((activeTab + 1) / SECTION_TABS.length) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-indigo-600 mt-2 font-medium">
                  Step {activeTab + 1}: {SECTION_TABS[activeTab].label}
                </p>
              </div>
            )}
          </aside>

          {/* Form Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
          
          {/* Section 1: Project Details */}
          {activeTab === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-150 pb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Section 1: Project Details & Governance Context
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Core administrative specifications and operational parameters for this AI project initiative.</p>
              </div>

              {formValidationError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-rose-800 animate-shake">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formValidationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">PROJECT TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Customer churn prediction model"
                    value={pTitle}
                    onChange={(e) => {
                      setPTitle(e.target.value);
                      if (formValidationError) setFormValidationError(null);
                    }}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">OWNER</label>
                  <select
                    value={pOwner}
                    onChange={(e) => setPOwner(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="">Select owner</option>
                    {team.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">STATUS</label>
                  <select
                    value={pStatus}
                    onChange={(e) => setPStatus(e.target.value as any)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="Not started">Not started</option>
                    <option value="In progress">In progress</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">GEOGRAPHY</label>
                  <select
                    value={pGeo}
                    onChange={(e) => setPGeo(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="">Select geography</option>
                    <option value="North America">North America</option>
                    <option value="EU">EU</option>
                    <option value="Global">Global</option>
                    <option value="Federal">Federal</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">AI RISK CLASSIFICATION *</label>
                  <select
                    value={pRisk}
                    onChange={(e) => setPRisk(e.target.value as any)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="Minimal">Minimal</option>
                    <option value="Limited">Limited</option>
                    <option value="High Risk">High Risk</option>
                    <option value="Unacceptable">Unacceptable</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">HIGH RISK ROLE TYPE</label>
                  <select
                    value={pRole}
                    onChange={(e) => setPRole(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="">Select role</option>
                    <option value="Provider">Provider</option>
                    <option value="Deployer">Deployer</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">START DATE</label>
                  <input
                    type="date"
                    value={pStart}
                    onChange={(e) => setPStart(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">APPLICABLE FRAMEWORK</label>
                  <select
                    value={pFramework}
                    onChange={(e) => setPFramework(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="None">None</option>
                    <option value="ISO 42001">ISO 42001</option>
                    <option value="ISO 27001">ISO 27001</option>
                    <option value="NIST AI RMF">NIST AI RMF</option>
                    <option value="SOC 2">SOC 2</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">TARGET INDUSTRY</label>
                  <input
                    type="text"
                    placeholder="e.g. Financial services, Healthcare"
                    value={pIndustry}
                    onChange={(e) => setPIndustry(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">TEAM MEMBERS</label>
                  <select
                    multiple
                    value={pTeam}
                    onChange={(e) => {
                      const options = Array.from((e.target as HTMLSelectElement).selectedOptions).map(o => o.value);
                      setPTeam(options);
                    }}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none h-28 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    {team.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                  <span className="text-[11px] text-slate-400 mt-1 block">Hold Ctrl (or Cmd on Mac) to select multiple team members.</span>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">GOAL *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the primary goal, objective, and intended outcomes of this project..."
                    value={pGoal}
                    onChange={(e) => setPGoal(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">DESCRIPTION</label>
                  <textarea
                    rows={4}
                    placeholder="Provide additional background context, system architectural scope, or deployment notes..."
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 2: System Report */}
          {activeTab === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-150 pb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Section 2: System Governance Report
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Document governance sponsorship, business ownership, stakeholders, and reference artifacts.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Name of Initiative</label>
                  <input
                    type="text"
                    placeholder="Official initiative or project code name"
                    value={sysNameOfInitiative}
                    onChange={(e) => setSysNameOfInitiative(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Business Owner Name</label>
                  <input
                    type="text"
                    placeholder="Executive business sponsor or owner"
                    value={sysBusinessOwner}
                    onChange={(e) => setSysBusinessOwner(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Stakeholder(s) Names</label>
                  <input
                    type="text"
                    placeholder="Key executive, technical, or compliance stakeholders"
                    value={sysStakeholders}
                    onChange={(e) => setSysStakeholders(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                      System Overview Diagram
                    </label>
                    {sysOverviewDiagram && (
                      <button
                        type="button"
                        onClick={() => setSysOverviewDiagram("")}
                        className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove Image
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-500">
                    Upload an architectural or system flow diagram image (PNG, JPG, SVG, WebP) to visualize system boundaries.
                  </p>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={diagramFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setSysOverviewDiagram(event.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />

                  {sysOverviewDiagram ? (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                      <div className="relative group rounded-xl overflow-hidden bg-slate-900/5 border border-slate-200/80 flex items-center justify-center p-3 min-h-[220px] max-h-[380px]">
                        <img
                          src={sysOverviewDiagram}
                          alt="System Overview Diagram Preview"
                          className="max-h-[350px] w-auto max-w-full object-contain rounded-lg shadow-xs"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                          <button
                            type="button"
                            onClick={() => diagramFileInputRef.current?.click()}
                            className="px-3.5 py-2 bg-white text-slate-800 text-xs font-bold rounded-lg shadow-md hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <UploadCloud className="w-4 h-4 text-indigo-600" />
                            Replace Image
                          </button>
                          <button
                            type="button"
                            onClick={() => setSysOverviewDiagram("")}
                            className="px-3.5 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-rose-700 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Diagram attached successfully
                        </span>
                        <button
                          type="button"
                          onClick={() => diagramFileInputRef.current?.click()}
                          className="text-indigo-600 hover:text-indigo-700 font-semibold text-[11px] cursor-pointer hover:underline"
                        >
                          Change diagram file
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDiagramDragging(true);
                      }}
                      onDragLeave={() => setIsDiagramDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDiagramDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          const file = e.dataTransfer.files[0];
                          if (file.type.startsWith("image/")) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setSysOverviewDiagram(event.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                      onClick={() => diagramFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        isDiagramDragging
                          ? "border-indigo-500 bg-indigo-50/60 shadow-xs"
                          : "border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-xs">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Click to upload or drag & drop System Overview Diagram
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Supports PNG, JPG, SVG, WebP, GIF
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            diagramFileInputRef.current?.click();
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                        >
                          Browse File
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const sampleSvg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="800" height="400" fill="%23f8fafc" rx="16"/><rect x="20" y="20" width="760" height="360" fill="%23ffffff" stroke="%23e2e8f0" stroke-width="2" rx="12"/><text x="40" y="55" font-family="sans-serif" font-size="18" font-weight="bold" fill="%231e293b">SYSTEM OVERVIEW ARCHITECTURE DIAGRAM</text><text x="40" y="78" font-family="sans-serif" font-size="12" fill="%2364748b">SOC 2 %26 ISO 42001 Governance Scope — AI Pipeline</text><g transform="translate(40, 110)"><rect width="180" height="220" fill="%23eff6ff" stroke="%23bfdbfe" stroke-width="1.5" rx="10"/><text x="15" y="30" font-family="sans-serif" font-size="14" font-weight="bold" fill="%231e40af">1. Ingestion Layer</text><rect x="15" y="50" width="150" height="40" fill="%23ffffff" stroke="%2393c5fd" rx="6"/><text x="25" y="75" font-family="sans-serif" font-size="11" font-weight="600" fill="%231e3a8a">Data Warehouse</text><rect x="15" y="100" width="150" height="40" fill="%23ffffff" stroke="%2393c5fd" rx="6"/><text x="25" y="125" font-family="sans-serif" font-size="11" font-weight="600" fill="%231e3a8a">System Logs</text><rect x="15" y="150" width="150" height="40" fill="%23ffffff" stroke="%2393c5fd" rx="6"/><text x="25" y="175" font-family="sans-serif" font-size="11" font-weight="600" fill="%231e3a8a">User Telemetry</text></g><path d="M 230 220 L 270 220" stroke="%233b82f6" stroke-width="3"/><g transform="translate(280, 110)"><rect width="200" height="220" fill="%23f0fdf4" stroke="%23bbf7d0" stroke-width="1.5" rx="10"/><text x="15" y="30" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23166534">2. Processing %26 ML</text><rect x="15" y="50" width="170" height="40" fill="%23ffffff" stroke="%2386efac" rx="6"/><text x="25" y="75" font-family="sans-serif" font-size="11" font-weight="600" fill="%2314532d">Feature Pipeline</text><rect x="15" y="100" width="170" height="40" fill="%23ffffff" stroke="%2386efac" rx="6"/><text x="25" y="125" font-family="sans-serif" font-size="11" font-weight="600" fill="%2314532d">AI Inference Endpoint</text><rect x="15" y="150" width="170" height="40" fill="%23ffffff" stroke="%2386efac" rx="6"/><text x="25" y="175" font-family="sans-serif" font-size="11" font-weight="600" fill="%2314532d">Audit Logging</text></g><path d="M 490 220 L 530 220" stroke="%2322c55e" stroke-width="3"/><g transform="translate(540, 110)"><rect width="200" height="220" fill="%23faf5ff" stroke="%23e9d5ff" stroke-width="1.5" rx="10"/><text x="15" y="30" font-family="sans-serif" font-size="14" font-weight="bold" fill="%236b21a8">3. Downstream API</text><rect x="15" y="50" width="170" height="40" fill="%23ffffff" stroke="%23d8b4fe" rx="6"/><text x="25" y="75" font-family="sans-serif" font-size="11" font-weight="600" fill="%23581c87">Application Portal</text><rect x="15" y="100" width="170" height="40" fill="%23ffffff" stroke="%23d8b4fe" rx="6"/><text x="25" y="125" font-family="sans-serif" font-size="11" font-weight="600" fill="%23581c87">Compliance Monitor</text><rect x="15" y="150" width="170" height="40" fill="%23ffffff" stroke="%23d8b4fe" rx="6"/><text x="25" y="175" font-family="sans-serif" font-size="11" font-weight="600" fill="%23581c87">Alert Notifications</text></g></svg>';
                            setSysOverviewDiagram(sampleSvg);
                          }}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Use Sample Diagram
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Overview */}
          {activeTab === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-150 pb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  Section 3: Overview & Confidentiality Impact
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Characterize information handling, data classification, and CIA breach impact evaluations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Description of Initiative</label>
                  <textarea
                    rows={3}
                    placeholder="Detailed explanation of the AI initiative..."
                    value={ovDescription}
                    onChange={(e) => setOvDescription(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nature of Information being handled</label>
                  <textarea
                    rows={3}
                    placeholder="Types of data processed (e.g. PII, financial records, medical telemetry)..."
                    value={ovNatureOfInfo}
                    onChange={(e) => setOvNatureOfInfo(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Information Classification</label>
                  <select
                    value={ovInfoClassification}
                    onChange={(e) => setOvInfoClassification(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="INTERNAL">INTERNAL</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                    <option value="SENSITIVE">SENSITIVE</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Impact if Confidentiality breached</label>
                  <select
                    value={ovConfidentialityImpact}
                    onChange={(e) => setOvConfidentialityImpact(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Major">Major</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Impact if Confidentiality breached - Description</label>
                  <textarea
                    rows={3}
                    placeholder="Consequences and business impact if confidentiality is breached..."
                    value={ovConfidentialityDesc}
                    onChange={(e) => setOvConfidentialityDesc(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Impact if Integrity breached</label>
                  <select
                    value={ovIntegrityImpact}
                    onChange={(e) => setOvIntegrityImpact(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Major">Major</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Impact if Integrity breached - Description</label>
                  <textarea
                    rows={3}
                    placeholder="Consequences if data integrity or model outputs are tampered with..."
                    value={ovIntegrityDesc}
                    onChange={(e) => setOvIntegrityDesc(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Impact if Availability breached</label>
                  <select
                    value={ovAvailabilityImpact}
                    onChange={(e) => setOvAvailabilityImpact(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Major">Major</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Impact if Availability breached - Description</label>
                  <textarea
                    rows={3}
                    placeholder="Operational impact if system availability is disrupted..."
                    value={ovAvailabilityDesc}
                    onChange={(e) => setOvAvailabilityDesc(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Description of Systems */}
          {activeTab === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-150 pb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-600" />
                  Section 4: Description of Systems & Boundaries
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Detail system architecture, boundaries, actors, and integrated subsystems.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Scope</label>
                  <textarea
                    rows={3}
                    placeholder="System boundaries and functional scope..."
                    value={sysScope}
                    onChange={(e) => setSysScope(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Previously Certified and Unchanged Components (If any)</label>
                  <textarea
                    rows={3}
                    placeholder="List existing ISO or SOC2 certified components being reused..."
                    value={sysPrevCertified}
                    onChange={(e) => setSysPrevCertified(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Out of Scope</label>
                  <textarea
                    rows={3}
                    placeholder="Components explicitly excluded from this assessment..."
                    value={sysOutOfScope}
                    onChange={(e) => setSysOutOfScope(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Decommissioning</label>
                  <textarea
                    rows={3}
                    placeholder="Decommissioning strategy and legacy data cleanup policies..."
                    value={sysDecommissioning}
                    onChange={(e) => setSysDecommissioning(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Integrated Subsystem or Services</label>
                  <textarea
                    rows={3}
                    placeholder="Third-party APIs, LLM providers, database microservices..."
                    value={sysIntegrated}
                    onChange={(e) => setSysIntegrated(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Actors (Users and Devices) - External Users</label>
                  <textarea
                    rows={3}
                    placeholder="Describe external end-users, clients, or consumer personas..."
                    value={sysActorsExt}
                    onChange={(e) => setSysActorsExt(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Actors (Users and Devices) - End User Devices</label>
                  <textarea
                    rows={3}
                    placeholder="Browsers, mobile apps, IoT edge nodes..."
                    value={sysActorsEnd}
                    onChange={(e) => setSysActorsEnd(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Actors (Users and Devices) - Internal Users</label>
                  <textarea
                    rows={3}
                    placeholder="Internal admins, data engineers, auditors..."
                    value={sysActorsInt}
                    onChange={(e) => setSysActorsInt(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Summary of Business Process */}
          {activeTab === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-150 pb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-indigo-600" />
                  Section 5: Summary of Business Process / Information Flows
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Document data flow geography, cloud service models, and public exposure status.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Summary of business process / information flows</label>
                  <textarea
                    rows={4}
                    placeholder="Describe step-by-step how business data flows through the AI system..."
                    value={bpSummary}
                    onChange={(e) => setBpSummary(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[120px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Geographic location of Data/Information</label>
                  <input
                    type="text"
                    placeholder="e.g. US-East (Virginia), EU-West (Frankfurt)"
                    value={bpGeoLocation}
                    onChange={(e) => setBpGeoLocation(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nature of Cloud service model</label>
                  <select
                    value={bpCloudModel}
                    onChange={(e) => setBpCloudModel(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="PaaS">Platform as a Service (PaaS)</option>
                    <option value="SaaS">Software as a Service (SaaS)</option>
                    <option value="IaaS">Infrastructure as a Service (IaaS)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Independent Certifications</label>
                  <input
                    type="text"
                    placeholder="e.g. ISO 27001, SOC 2 Type II, FedRAMP"
                    value={bpCertifications}
                    onChange={(e) => setBpCertifications(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Cloud Platform Services</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS Bedrock, GCP Vertex AI, Azure OpenAI"
                    value={bpCloudServices}
                    onChange={(e) => setBpCloudServices(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Publicly Accessible</label>
                  <select
                    value={bpPubliclyAccessible}
                    onChange={(e) => setBpPubliclyAccessible(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Assessment Scope */}
          {activeTab === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-150 pb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                  Section 6: Assessment Scope Boundaries
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Specify evaluation scope levels across Security, Privacy, Human Rights, and Information Management.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Security Scope */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Security Scope Level</label>
                  <select
                    value={scSecurity}
                    onChange={(e) => setScSecurity(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="Full Scope">Full Scope</option>
                    <option value="Limited Scope">Limited Scope</option>
                    <option value="Out of Scope">Out of Scope</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Security Description</label>
                  <textarea
                    rows={3}
                    placeholder="Details regarding security controls in scope..."
                    value={scSecurityDesc}
                    onChange={(e) => setScSecurityDesc(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[90px]"
                  />
                </div>

                {/* Privacy Scope */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Privacy Scope Level</label>
                  <select
                    value={scPrivacy}
                    onChange={(e) => setScPrivacy(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="Full Scope">Full Scope</option>
                    <option value="Limited Scope">Limited Scope</option>
                    <option value="Out of Scope">Out of Scope</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Privacy Description</label>
                  <textarea
                    rows={3}
                    placeholder="Details regarding GDPR/CCPA or data privacy boundaries..."
                    value={scPrivacyDesc}
                    onChange={(e) => setScPrivacyDesc(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[90px]"
                  />
                </div>

                {/* Human Rights and Ethics */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Human Rights & Ethics Scope Level</label>
                  <select
                    value={scHumanRights}
                    onChange={(e) => setScHumanRights(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="Full Scope">Full Scope</option>
                    <option value="Limited Scope">Limited Scope</option>
                    <option value="Out of Scope">Out of Scope</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Human Rights & Ethics Description</label>
                  <textarea
                    rows={3}
                    placeholder="Details regarding fairness, bias, or ethical impact assessments..."
                    value={scHumanRightsDesc}
                    onChange={(e) => setScHumanRightsDesc(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[90px]"
                  />
                </div>

                {/* Information Management */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Information Management Scope Level</label>
                  <select
                    value={scInfoMgmt}
                    onChange={(e) => setScInfoMgmt(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="Full Scope">Full Scope</option>
                    <option value="Limited Scope">Limited Scope</option>
                    <option value="Out of Scope">Out of Scope</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Information Management Description</label>
                  <textarea
                    rows={3}
                    placeholder="Details regarding data governance, lineage, and lifecycle management..."
                    value={scInfoMgmtDesc}
                    onChange={(e) => setScInfoMgmtDesc(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[90px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 7: Summary of Findings */}
          {activeTab === 6 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-150 pb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-indigo-600" />
                  Section 7: Summary of Assessment Findings
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Record assessment outcomes and audit findings across Security, Privacy, Ethics, and Governance domains.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Security Findings</label>
                  <textarea
                    rows={3}
                    placeholder="Key security findings, vulnerabilities, or remediation recommendations..."
                    value={fdSecurity}
                    onChange={(e) => setFdSecurity(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Privacy Findings</label>
                  <textarea
                    rows={3}
                    placeholder="Data minimization, consent mechanism, or privacy assessment findings..."
                    value={fdPrivacy}
                    onChange={(e) => setFdPrivacy(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Human Rights Findings</label>
                  <textarea
                    rows={3}
                    placeholder="Non-discrimination and fundamental rights review findings..."
                    value={fdHumanRights}
                    onChange={(e) => setFdHumanRights(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Ethics Findings</label>
                  <textarea
                    rows={3}
                    placeholder="AI transparency, explainability, and algorithmic bias findings..."
                    value={fdEthics}
                    onChange={(e) => setFdEthics(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Information Management Findings</label>
                  <textarea
                    rows={3}
                    placeholder="Data retention, logging, and audit trail evaluation findings..."
                    value={fdInfoMgmt}
                    onChange={(e) => setFdInfoMgmt(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 8: Commentary on Risk Profile */}
          {activeTab === 7 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-150 pb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-indigo-600" />
                  Section 8: Commentary on Risk Profile & Formal Risk Acceptance
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Document security risk assessment entries, executive risk profile summary, and formal risk acceptance decisions.
                </p>
              </div>

              <RiskAssessmentView
                entries={rkRiskEntries}
                onChangeEntries={(updated) => setRkRiskEntries(updated)}
                commentary={rkCommentary}
                onChangeCommentary={(val) => setRkCommentary(val)}
                acceptance={rkAcceptance}
                onChangeAcceptance={(val) => setRkAcceptance(val)}
              />
            </div>
          )}

          {/* Section 9: Remediation Plan */}
          {activeTab === 8 && (
            <div className="space-y-4 animate-fade-in">
              <RemediationPlanView
                data={remediationPlanData}
                onChangeData={(updated) => setRemediationPlanData(updated)}
              />
            </div>
          )}

          {/* Section 10: Checklist & Standards Compliance */}
          {activeTab === 9 && (
            <div className="space-y-4 animate-fade-in">
              <ComplianceChecklistView
                data={complianceChecklistData}
                onChangeData={(updated) => setComplianceChecklistData(updated)}
              />
            </div>
          )}

          {/* Section 11: SOC 2 Control Questionnaires */}
          {activeTab === 10 && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-150 pb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                  Section 11: SOC 2 Controls Questionnaire
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete the control questionnaires based on SOC 2 criteria to assess compliance maturity and evidence readiness.
                </p>
              </div>

              <ControlQuestionnairesView
                answers={questionnaireAnswers}
                onUpdateAnswer={(qKey, ans) => {
                  setQuestionnaireAnswers((prev) => ({
                    ...prev,
                    [qKey]: ans
                  }));
                }}
              />
            </div>
          )}

          {/* Section 12: Control Matrix */}
          {activeTab === 11 && (
            <div className="space-y-4 animate-fade-in">
              <ControlMatrixView
                controls={controlMatrixData}
                onChangeControls={(updated) => setControlMatrixData(updated)}
              />
            </div>
          )}

          {/* Section 13: Evidences & Compliance Documents */}
          {activeTab === 12 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-150 pb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-indigo-600" />
                  Section 13: Evidence & Compliance Documents
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Attach, reference, or record evidence files, system documentation, and audit artifacts related to this project.</p>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Reference Documents & File Names</label>
                  <textarea
                    rows={4}
                    placeholder="e.g. System_Architecture_v2.pdf, Algorithmic_Bias_Audit_2026.docx, Data_Protection_Impact_Assessment.pdf..."
                    value={sysRefDocs}
                    onChange={(e) => setSysRefDocs(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs min-h-[120px]"
                  />
                </div>

                <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                    <UploadCloud className="w-4 h-4 text-indigo-600" />
                    <span>Workspace Evidence Registry Integration</span>
                  </div>
                  <p className="text-xs text-indigo-800/80 leading-relaxed">
                    Once registered, you can upload binary files or link existing workspace documents directly to this project via the <strong>View Project</strong> detail window.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 14: Certification & Accreditation Sign-Off */}
          {activeTab === 13 && (
            <div className="space-y-4 animate-fade-in">
              <CertificationSignOffView
                data={caSignOffData}
                projectTitle={pTitle || "AI Project"}
                onChangeData={(updated) => setCaSignOffData(updated)}
              />
            </div>
          )}
        </form>

        {/* Footer with Step Navigation & Submit */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-slate-700">Section {activeTab + 1} of {SECTION_TABS.length}:</span>
            <span className="text-indigo-700 font-bold">{SECTION_TABS[activeTab].label}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={prevStep}
              disabled={activeTab === 0}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                activeTab === 0
                  ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {activeTab < SECTION_TABS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer ml-1"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingProject ? "Save Project" : "Register Project"}</span>
            </button>
          </div>
        </div>

        {/* Interactive Corner Drag Resizer */}
        {modalSize !== "fullscreen" && (
          <div
            onMouseDown={startResizing}
            className="absolute bottom-0 right-0 w-7 h-7 cursor-se-resize flex items-end justify-end p-1 z-30 group"
            title="Click and drag corner to custom resize window (Width & Height)"
          >
            <div className="w-3.5 h-3.5 border-r-2 border-b-2 border-slate-400 group-hover:border-indigo-600 transition-colors" />
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  );
}
