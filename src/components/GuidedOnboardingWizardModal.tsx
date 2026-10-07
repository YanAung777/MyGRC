import React, { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BrainCircuit,
  FileText,
  Server,
  Upload,
  UserCheck,
  Award,
  ArrowRight,
  HelpCircle,
  FolderPlus,
  ShieldCheck,
  CheckSquare,
  Lock,
  Check,
  CreditCard,
  Building2,
  Users,
  Database
} from "lucide-react";
import { AIProject, ModelRecord, TeamMember } from "../types";
import { PLAN_TIERS, PlanTier } from "../data/planTiers";

interface GuidedOnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (proj: AIProject) => void;
  models: ModelRecord[];
  team: TeamMember[];
  existingProjectsCount: number;
  onSelectProject?: (proj: AIProject) => void;
  onSelectPlanTier?: (plan: PlanTier) => void;
}

export default function GuidedOnboardingWizardModal({
  isOpen,
  onClose,
  onAddProject,
  models,
  team,
  existingProjectsCount,
  onSelectProject,
  onSelectPlanTier
}: GuidedOnboardingWizardModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Workspace & Plan Tier Selection
  const [selectedPlanId, setSelectedPlanId] = useState<string>("enterprise");
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

  // Step 2: System Purpose & Basics
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState(team[0]?.name || "Demo Assessor");
  const [goal, setGoal] = useState("");
  const [targetIndustry, setTargetIndustry] = useState("Financial Services");
  const [geography, setGeography] = useState("EU");
  const [roleType, setRoleType] = useState<"Provider" | "Deployer" | "Both">("Deployer");
  const [description, setDescription] = useState("");

  // Step 3: EU AI Act Risk Tier Classification Questions
  const [qEmployment, setQEmployment] = useState<boolean>(false);
  const [qCriticalInfra, setQCriticalInfra] = useState<boolean>(false);
  const [qSubliminal, setQSubliminal] = useState<boolean>(false);
  const [qGenerative, setQGenerative] = useState<boolean>(true);
  const [qBiometric, setQBiometric] = useState<boolean>(false);

  // Step 4: Model & Dataset Assignment
  const [selectedModel, setSelectedModel] = useState<string>(models[0]?.name || "Gemini 1.5 Pro");
  const [datasetName, setDatasetName] = useState("Customer Interactions & Audit Trail Dataset v2");
  const [dataClassification, setDataClassification] = useState<"PUBLIC" | "SENSITIVE" | "RESTRICTED">("SENSITIVE");
  const [dataGeography, setDataGeography] = useState("EU Data Center (Frankfurt)");
  const [stepValidationError, setStepValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Auto-calculated EU AI Act Risk Tier
  const calculateRiskTier = (): "Minimal" | "Limited" | "High Risk" | "Unacceptable" => {
    if (qSubliminal) return "Unacceptable";
    if (qEmployment || qCriticalInfra || qBiometric) return "High Risk";
    if (qGenerative) return "Limited";
    return "Minimal";
  };

  const riskTier = calculateRiskTier();

  const handleFinishWizard = () => {
    if (!title.trim()) {
      setStepValidationError("Please enter a Use Case Title to continue.");
      setCurrentStep(2);
      return;
    }
    setStepValidationError(null);

    const selectedPlan = PLAN_TIERS.find((p) => p.id === selectedPlanId) || PLAN_TIERS[2];
    if (onSelectPlanTier) {
      onSelectPlanTier(selectedPlan);
    }

    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const newProject: AIProject = {
      id: `UC-${existingProjectsCount + 101}`,
      title: title.trim(),
      owner: owner || "Demo Assessor",
      status: "In progress",
      geography: geography,
      riskClassification: riskTier,
      roleType: roleType,
      startDate: todayStr,
      lastUpdated: todayStr,
      framework: riskTier === "High Risk" ? "ISO 42001" : "NIST AI RMF",
      teamMembers: [owner || "Demo Assessor", "Leo Vance"],
      goal: goal || "Automated system deployment guided by AI Intake Wizard.",
      targetIndustry: targetIndustry,
      description: description || `AI Intake System classified as ${riskTier} under EU AI Act rules (${selectedPlan.name} tier). Grounded with model ${selectedModel} and dataset ${datasetName}.`,
      mappedModels: [selectedModel],
      completedComplianceTasks: [],
      systemReport: {
        nameOfInitiative: title.trim(),
        businessOwnerName: owner,
        stakeholdersNames: "CISO Risk Board, AI Ethics Lead",
        systemOverviewDiagram: "",
        referenceDocuments: `Dataset: ${datasetName} (${dataClassification}) • Plan Tier: ${selectedPlan.name}`
      },
      overview: {
        descriptionOfInitiative: goal || description,
        natureOfInformationHandled: `Data classification: ${dataClassification}. Location: ${dataGeography}`,
        informationClassification: dataClassification,
        impactConfidentialityBreached: riskTier === "High Risk" ? "Critical" : "Moderate",
        impactIntegrityBreached: riskTier === "High Risk" ? "Critical" : "Moderate",
        impactAvailabilityBreached: "Moderate"
      },
      assessmentScope: {
        securityScope: "Full Scope",
        privacyScope: riskTier === "High Risk" ? "Full Scope" : "Limited Scope",
        humanRightsAndEthicsScope: riskTier === "High Risk" ? "Full Scope" : "Limited Scope",
        informationManagementScope: "Full Scope"
      }
    };

    onAddProject(newProject);
    if (onSelectProject) {
      onSelectProject(newProject);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-scale-up">
        {/* Wizard Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 border-b border-indigo-900/60 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Guided Workspace & AI Intake Onboarding</h3>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-md border border-indigo-400/30">
                  EU AI Act & ISO 42001
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                Onboard your organization: select Plan Tier licensing, classify risk tier, map foundation models, and generate your GRC launch plan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-indigo-200 hover:text-white hover:bg-indigo-800/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Progress Tracker (5 Steps) */}
        <div className="bg-slate-50 border-b border-slate-200/80 p-3 px-4 sm:px-6 shrink-0">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 relative">
            {[
              { num: 1, title: "Plan Tier", desc: "Licensing & Quotas" },
              { num: 2, title: "System Basics", desc: "Purpose & Role" },
              { num: 3, title: "Risk Tier", desc: "EU AI Act Matrix" },
              { num: 4, title: "Model & Data", desc: "Registry & Lineage" },
              { num: 5, title: "Launch Plan", desc: "GRC Action Items" }
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isDone = currentStep > step.num;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    if (isDone || isActive) setCurrentStep(step.num);
                  }}
                  className={`flex items-center gap-2 text-left p-1.5 sm:p-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs font-bold"
                      : isDone
                      ? "bg-indigo-50 text-indigo-900 border border-indigo-200/60 font-semibold cursor-pointer"
                      : "bg-white text-slate-400 border border-slate-200/80 font-medium"
                  }`}
                >
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isDone
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <div className="hidden sm:block truncate">
                    <span className="text-[11px] block leading-tight truncate">{step.title}</span>
                    <span
                      className={`text-[9px] block truncate ${
                        isActive ? "text-indigo-100" : "text-slate-400"
                      }`}
                    >
                      {step.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wizard Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Plan Tier for Onboarding */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    Step 1: Select Workspace Plan Tier
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose the onboarding plan tier that satisfies your team's compliance capacity, seat licensing, and framework needs.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                      billingCycle === "monthly" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("annual")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                      billingCycle === "annual" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-500"
                    }`}
                  >
                    <span>Annual (Save 20%)</span>
                  </button>
                </div>
              </div>

              {/* Tier Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {PLAN_TIERS.map((tier) => {
                  const isSelected = tier.id === selectedPlanId;
                  const price = billingCycle === "annual" ? tier.priceMonthly : Math.round(tier.priceMonthly * 1.2);

                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedPlanId(tier.id)}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer relative ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/40 shadow-sm ring-2 ring-indigo-600/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {tier.badge && (
                        <div className="absolute -top-2.5 right-3 bg-indigo-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                          {tier.badge}
                        </div>
                      )}

                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{tier.name}</h5>
                        <p className="text-[11px] text-slate-500 mt-1 min-h-[30px]">{tier.description}</p>

                        <div className="my-3 pb-3 border-b border-slate-100">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-slate-900">${price}</span>
                            <span className="text-[11px] text-slate-500 font-medium">/mo</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            {tier.billingPeriod}
                          </span>
                        </div>

                        {/* Quota Highlights */}
                        <div className="space-y-1 bg-slate-50 p-2 rounded-lg text-[10px] text-slate-700 mb-3 border border-slate-100">
                          <div className="flex justify-between">
                            <span className="text-slate-500">AI Projects:</span>
                            <span className="font-bold text-slate-900">{tier.maxProjects} Use-cases</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Team Seats:</span>
                            <span className="font-bold text-slate-900">{tier.maxSeats} Seats</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Storage Vault:</span>
                            <span className="font-bold text-slate-900">{tier.storageGb} GB</span>
                          </div>
                        </div>

                        {/* Feature Snippets */}
                        <ul className="space-y-1.5 text-[10px] text-slate-600">
                          {tier.features.slice(0, 4).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-tight">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlanId(tier.id);
                          }}
                          className={`w-full py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow-2xs"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Plan Selected</span>
                            </>
                          ) : (
                            <span>Select Tier</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: System Purpose & Basics */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Step 2: AI System Purpose & Operational Context
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Define the core administrative identity and intended business objectives of this AI system.
                </p>
              </div>

              {stepValidationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-800 animate-shake">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{stepValidationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    USE CASE TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Credit Assessment & Fraud Scoring Model v2"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (stepValidationError) setStepValidationError(null);
                    }}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    PRIMARY ASSIGNED OWNER
                  </label>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    {team.map((m) => (
                      <option key={m.id} value={m.name}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    TARGET INDUSTRY
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Financial Services, Healthcare, E-commerce"
                    value={targetIndustry}
                    onChange={(e) => setTargetIndustry(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    DEPLOYMENT GEOGRAPHY
                  </label>
                  <select
                    value={geography}
                    onChange={(e) => setGeography(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="EU">European Union (EU AI Act Applicable)</option>
                    <option value="North America">North America</option>
                    <option value="Global">Global Deployment</option>
                    <option value="Federal">Federal / Public Sector</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    EU AI ACT ROLE TYPE
                  </label>
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value as any)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  >
                    <option value="Deployer">Deployer (Using third-party models internally)</option>
                    <option value="Provider">Provider (Developing/training custom foundation models)</option>
                    <option value="Both">Both (Provider & Deployer)</option>
                  </select>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    BUSINESS GOAL & OBJECTIVES *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the problem this AI solves, expected accuracy targets, and intended user impact..."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3.5 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: EU AI Act Risk Tier Classification Questionnaire */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start gap-4">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-indigo-600" />
                    Step 3: Automated EU AI Act Risk Tier Questionnaire
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Answer these 5 baseline questions to automatically calculate risk classification and governance duties.
                  </p>
                </div>

                {/* Real-time Risk Tier Card Indicator */}
                <div className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-extrabold shrink-0 ${
                  riskTier === "High Risk"
                    ? "bg-rose-50 text-rose-800 border-rose-200"
                    : riskTier === "Unacceptable"
                    ? "bg-purple-900 text-white border-purple-800"
                    : riskTier === "Limited"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                  <div>
                    <span className="text-[10px] block opacity-80 uppercase tracking-wider font-mono">Calculated Tier</span>
                    <span>{riskTier} System</span>
                  </div>
                </div>
              </div>

              {/* Questionnaire Questions Cards */}
              <div className="space-y-3">
                {[
                  {
                    id: "q1",
                    title: "1. Employment & HR Assessment",
                    desc: "Does the AI system score, screen, or rank candidate resumes, perform job applicant evaluations, or make worker promotion decisions?",
                    value: qEmployment,
                    setValue: setQEmployment,
                    flagIfYes: "High Risk (Annex III)"
                  },
                  {
                    id: "q2",
                    title: "2. Critical Infrastructure & Essential Services",
                    desc: "Is the AI used in credit scoring, loan granting, emergency dispatch, health diagnostic triage, or critical power grid control?",
                    value: qCriticalInfra,
                    setValue: setQCriticalInfra,
                    flagIfYes: "High Risk (Annex III)"
                  },
                  {
                    id: "q3",
                    title: "3. Prohibited Cognitive Manipulation",
                    desc: "Does the system use subliminal techniques beyond human awareness or exploit vulnerabilities to materially distort behavior causing harm?",
                    value: qSubliminal,
                    setValue: setQSubliminal,
                    flagIfYes: "Prohibited / Unacceptable (Article 5)"
                  },
                  {
                    id: "q4",
                    title: "4. Generative AI & Synthetic Media",
                    desc: "Does the system generate text, synthetic images, deepfakes, audio, or converse directly with human end-users?",
                    value: qGenerative,
                    setValue: setQGenerative,
                    flagIfYes: "Limited Risk (Transparency Duty Article 50)"
                  },
                  {
                    id: "q5",
                    title: "5. Biometrics & Sensitive Personal Attributes",
                    desc: "Does the AI process biometric identification, emotion recognition, or sensitive categorizations under GDPR?",
                    value: qBiometric,
                    setValue: setQBiometric,
                    flagIfYes: "High Risk (Annex III)"
                  }
                ].map((q) => (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                      q.value
                        ? "bg-indigo-50/60 border-indigo-300 shadow-2xs"
                        : "bg-white border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{q.title}</span>
                        {q.value && (
                          <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                            Flags: {q.flagIfYes}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{q.desc}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => q.setValue(false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          !q.value
                            ? "bg-slate-800 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => q.setValue(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          q.value
                            ? "bg-indigo-600 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Model & Dataset Assignment */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-600" />
                  Step 4: Foundation Model & Dataset Lineage Assignment
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Associate technical model assets from the registry and record dataset privacy classification.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    FOUNDATION MODEL FROM REGISTRY
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs font-semibold"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.provider} — {m.name} (v{m.version}) [{m.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    TRAINING / INFERENCE DATASET NAME
                  </label>
                  <input
                    type="text"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="e.g. Production Customer Audit Corpus v3.1"
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    DATA SENSITIVITY CLASSIFICATION
                  </label>
                  <select
                    value={dataClassification}
                    onChange={(e) => setDataClassification(e.target.value as any)}
                    className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs font-bold"
                  >
                    <option value="PUBLIC">PUBLIC — Open Data</option>
                    <option value="SENSITIVE">SENSITIVE — Internal Business / PII</option>
                    <option value="RESTRICTED">RESTRICTED — Critical Financial / Health Data</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    DATA STORAGE REGION
                  </label>
                  <input
                    type="text"
                    value={dataGeography}
                    onChange={(e) => setDataGeography(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 bg-white rounded-xl p-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Auto-Generated Action Plan & Launch Checklist */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    Step 5: Auto-Generated GRC Action Plan & Launch Checklist
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Based on your <strong className="text-slate-900">{riskTier}</strong> classification, the platform has assembled mandatory controls and evidence requests.
                  </p>
                </div>

                <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready to Launch
                </span>
              </div>

              {/* Action Plan Summary Table */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
                  <span>Mandatory Compliance Requirements</span>
                  <span>Target Verification</span>
                </div>

                <div className="space-y-2">
                  {riskTier === "High Risk" && (
                    <>
                      <div className="flex items-center justify-between text-xs p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold">Complete Data Protection & AI Impact Assessment (DPIA)</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">High Priority</span>
                      </div>

                      <div className="flex items-center justify-between text-xs p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold">ISO 42001 Annex A.6.1.2 Fairness & Demographic Bias Testing</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">ISO 42001</span>
                      </div>

                      <div className="flex items-center justify-between text-xs p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold">Configure Human-in-the-Loop Override & Fallback Procedure</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Safety Gate</span>
                      </div>
                    </>
                  )}

                  {riskTier === "Limited" && (
                    <div className="flex items-center justify-between text-xs p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold">Publish User AI Interaction Transparency Notice (EU AI Act Art. 50)</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">Transparency</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">CISO & Executive Certification Sign-Off Declaration</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">C&A Gate</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <button
            type="button"
            onClick={() => {
              if (currentStep > 1) setCurrentStep(currentStep - 1);
              else onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? "Cancel" : "Back"}</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishWizard}
                className="px-6 py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Finish Onboarding & Launch Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
