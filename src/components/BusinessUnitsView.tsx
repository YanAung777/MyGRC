// Multi-Tenant Business Units & Organizational Risk Appetite Management
import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  Shield,
  Users,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Lock,
  Activity,
  ArrowRight,
  UserCheck,
  Search,
  SlidersHorizontal,
  Mail,
  AlertCircle
} from "lucide-react";
import { BusinessUnit } from "../types";
import { INITIAL_BUSINESS_UNITS } from "../data";

const LOCAL_STORAGE_KEY = "onyx_business_units_v1";

interface BusinessUnitsViewProps {
  onSendAuditLog: (logPayload: any) => void;
}

export default function BusinessUnitsView({ onSendAuditLog }: BusinessUnitsViewProps) {
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not parse saved business units:", e);
    }
    return INITIAL_BUSINESS_UNITS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterAppetite, setFilterAppetite] = useState<string>("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<BusinessUnit>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [unitToDelete, setUnitToDelete] = useState<BusinessUnit | null>(null);

  // Sync to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(businessUnits));
    } catch (e) {
      console.warn("Failed to persist business units to localStorage:", e);
    }
  }, [businessUnits]);

  // Open modal to create a new Business Unit
  const handleOpenAddModal = () => {
    setIsCreating(true);
    setFormErrors({});
    const newId = `bu-${Date.now()}`;
    setFormData({
      id: newId,
      name: "",
      code: "BU-",
      description: "",
      industryDomain: "Enterprise SaaS & GenAI",
      riskAppetite: "Balanced",
      maxAllowedInherentRisk: "Medium",
      complianceHealthScore: 95,
      projectCount: 0,
      modelCount: 0,
      incidentCount: 0,
      dpoName: "Yan Aung",
      dpoEmail: "yan.aung@gmail.com",
      aiCustodian: "Lead ML Architect"
    });
    setIsModalOpen(true);
  };

  // Open modal to edit existing Business Unit
  const handleOpenEditModal = (unit: BusinessUnit) => {
    setIsCreating(false);
    setFormErrors({});
    setFormData({ ...unit });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name?.trim()) errors.name = "Business unit name is required";
    if (!formData.code?.trim()) errors.code = "Division code is required";
    if (!formData.dpoName?.trim()) errors.dpoName = "DPO name is required";
    if (!formData.dpoEmail?.trim() || !formData.dpoEmail.includes("@")) {
      errors.dpoEmail = "Valid DPO email is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    const unitToSave: BusinessUnit = {
      id: formData.id || `bu-${Date.now()}`,
      name: formData.name!.trim(),
      code: (formData.code || "BU-GEN").trim().toUpperCase(),
      description: formData.description?.trim() || "Organizational division governing AI system deployments.",
      industryDomain: (formData.industryDomain as any) || "Enterprise SaaS & GenAI",
      riskAppetite: (formData.riskAppetite as any) || "Balanced",
      maxAllowedInherentRisk: (formData.maxAllowedInherentRisk as any) || "Medium",
      complianceHealthScore: typeof formData.complianceHealthScore === "number" ? formData.complianceHealthScore : 92,
      projectCount: typeof formData.projectCount === "number" ? formData.projectCount : 0,
      modelCount: typeof formData.modelCount === "number" ? formData.modelCount : 0,
      incidentCount: typeof formData.incidentCount === "number" ? formData.incidentCount : 0,
      dpoName: formData.dpoName!.trim(),
      dpoEmail: formData.dpoEmail!.trim(),
      aiCustodian: formData.aiCustodian?.trim() || "Lead AI Custodian"
    };

    setBusinessUnits((prev) => {
      const existsIndex = prev.findIndex((u) => u.id === unitToSave.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = unitToSave;
        return updated;
      } else {
        // Prepend newly added business unit to top of list
        return [unitToSave, ...prev];
      }
    });

    onSendAuditLog({
      action: isCreating ? "BUSINESS_UNIT_CREATED" : "BUSINESS_UNIT_RISK_APPETITE_UPDATED",
      isoControl: "A.5.1.1",
      category: "ORGANIZATIONAL_GOVERNANCE",
      severity: isCreating ? "INFO" : "WARN",
      targetResource: { type: "BUSINESS_UNIT", id: unitToSave.id, name: unitToSave.name },
      details: {
        code: unitToSave.code,
        riskAppetite: unitToSave.riskAppetite,
        dpo: unitToSave.dpoName,
        dpoEmail: unitToSave.dpoEmail,
        industry: unitToSave.industryDomain
      }
    });

    setSaveSuccessMsg(
      isCreating
        ? `Successfully created Business Unit "${unitToSave.name}" (${unitToSave.code}).`
        : `Updated Business Unit "${unitToSave.name}" governance parameters.`
    );
    setIsModalOpen(false);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const confirmDeleteUnit = () => {
    if (!unitToDelete) return;
    const deleted = unitToDelete;

    setBusinessUnits((prev) => prev.filter((u) => u.id !== deleted.id));

    onSendAuditLog({
      action: "BUSINESS_UNIT_DELETED",
      isoControl: "A.5.1.1",
      category: "ORGANIZATIONAL_GOVERNANCE",
      severity: "WARN",
      targetResource: { type: "BUSINESS_UNIT", id: deleted.id, name: deleted.name },
      details: { code: deleted.code, dpo: deleted.dpoName }
    });

    setSaveSuccessMsg(`Deleted Business Unit "${deleted.name}".`);
    setUnitToDelete(null);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const filteredUnits = useMemo(() => {
    return businessUnits.filter((unit) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        unit.name.toLowerCase().includes(q) ||
        unit.code.toLowerCase().includes(q) ||
        unit.industryDomain.toLowerCase().includes(q) ||
        unit.dpoName.toLowerCase().includes(q) ||
        unit.aiCustodian.toLowerCase().includes(q) ||
        unit.description.toLowerCase().includes(q);

      const matchesAppetite = filterAppetite === "All" || unit.riskAppetite === filterAppetite;

      return matchesQuery && matchesAppetite;
    });
  }, [businessUnits, searchQuery, filterAppetite]);

  // Compute summary stats
  const stats = useMemo(() => {
    const total = businessUnits.length;
    const totalProjects = businessUnits.reduce((acc, u) => acc + (u.projectCount || 0), 0);
    const totalIncidents = businessUnits.reduce((acc, u) => acc + (u.incidentCount || 0), 0);
    const avgScore = total > 0 ? Math.round(businessUnits.reduce((acc, u) => acc + (u.complianceHealthScore || 0), 0) / total) : 0;
    return { total, totalProjects, totalIncidents, avgScore };
  }, [businessUnits]);

  const getRiskAppetiteBadge = (appetite: string) => {
    switch (appetite) {
      case "Zero Tolerance":
        return <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-100 text-rose-800 rounded-md whitespace-nowrap">Zero Tolerance</span>;
      case "Conservative":
        return <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-800 rounded-md whitespace-nowrap">Conservative</span>;
      case "Balanced":
        return <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-100 text-blue-800 rounded-md whitespace-nowrap">Balanced</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-md whitespace-nowrap">Innovative / Sandbox</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Multi-Tenant Business Units &amp; Org Partitioning</h1>
              <p className="text-xs text-slate-500">
                Calibrate custom risk appetites, assign Data Protection Officers (DPO), and track departmental AI compliance
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          id="btn-add-business-unit"
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Business Unit</span>
        </button>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Business Units</span>
          <div className="text-xl font-black text-slate-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Health Score</span>
          <div className="text-xl font-black text-indigo-600 mt-1">{stats.avgScore}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active AI Systems</span>
          <div className="text-xl font-black text-slate-900 mt-1">{stats.totalProjects}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Open Incidents</span>
          <div className={`text-xl font-black mt-1 ${stats.totalIncidents === 0 ? "text-emerald-600" : "text-amber-600"}`}>
            {stats.totalIncidents}
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-scale-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search business units by name, code, DPO, or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">Appetite:</span>
          {["All", "Zero Tolerance", "Conservative", "Balanced", "Innovative / Sandbox"].map((appetite) => (
            <button
              key={appetite}
              onClick={() => setFilterAppetite(appetite)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterAppetite === appetite
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {appetite}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Business Units */}
      {filteredUnits.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Business Units Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            {searchQuery || filterAppetite !== "All"
              ? "No business units matched your current filter criteria. Try clearing search terms."
              : "No business units configured yet. Click below to add your first organizational partition."}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Business Unit</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">{unit.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">
                        {unit.code}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{unit.industryDomain}</span>
                  </div>
                  {getRiskAppetiteBadge(unit.riskAppetite)}
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-150 min-h-[58px]">
                  {unit.description || "No mission description provided for this business unit."}
                </p>

                {/* Department Governance Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Health Score</span>
                    <div className="text-base font-black text-indigo-600">{unit.complianceHealthScore ?? 92}%</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">AI Projects</span>
                    <div className="text-base font-black text-slate-800">{unit.projectCount ?? 0}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Incidents</span>
                    <div className={`text-base font-black ${(unit.incidentCount || 0) === 0 ? "text-emerald-600" : "text-amber-600"}`}>
                      {unit.incidentCount ?? 0}
                    </div>
                  </div>
                </div>

                {/* Key Custodians */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-1.5 truncate">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-700 shrink-0">DPO:</span>
                    <span className="truncate">{unit.dpoName}</span>
                    {unit.dpoEmail && (
                      <span className="text-slate-400 text-[11px] truncate">({unit.dpoEmail})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-700 shrink-0">AI Custodian:</span>
                    <span className="truncate">{unit.aiCustodian || "Unassigned"}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-slate-150 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  Max Inherent Risk: <strong className="text-slate-800">{unit.maxAllowedInherentRisk}</strong>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(unit)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Edit and calibrate risk parameters"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Calibrate Risk</span>
                  </button>
                  <button
                    onClick={() => setUnitToDelete(unit)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title={`Delete ${unit.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation / Calibration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-up border border-slate-200">
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {isCreating ? "Add New Business Unit" : "Calibrate Business Unit Governance"}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isCreating
                      ? "Create an organizational partition with custom DPO and risk tolerances"
                      : `Configure risk appetite tolerances & compliance thresholds for ${formData.name || "Business Unit"}`}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              
              {/* Unit Name and Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Division / Business Unit Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Retail & Customer Intelligence"
                    value={formData.name || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: "" });
                    }}
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-none font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 ${
                      formErrors.name ? "border-rose-400 bg-rose-50/50" : "border-slate-200"
                    }`}
                  />
                  {formErrors.name && <span className="text-[10px] text-rose-600">{formErrors.name}</span>}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BU-RTL"
                    value={formData.code || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, code: e.target.value.toUpperCase() });
                      if (formErrors.code) setFormErrors({ ...formErrors, code: "" });
                    }}
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-none font-semibold font-mono text-slate-800 focus:bg-white focus:border-indigo-500 ${
                      formErrors.code ? "border-rose-400 bg-rose-50/50" : "border-slate-200"
                    }`}
                  />
                  {formErrors.code && <span className="text-[10px] text-rose-600">{formErrors.code}</span>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Description &amp; AI Scope</label>
                <textarea
                  rows={2}
                  placeholder="Describe the operational mandate, data pipelines, and AI systems managed by this unit..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-normal text-slate-800 focus:bg-white focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Industry Domain */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Industry Domain</label>
                <select
                  value={formData.industryDomain || "Enterprise SaaS & GenAI"}
                  onChange={(e: any) => setFormData({ ...formData, industryDomain: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-800 focus:bg-white focus:border-indigo-500"
                >
                  <option value="Healthcare & Life Sciences">Healthcare &amp; Life Sciences</option>
                  <option value="Financial Services & Fraud">Financial Services &amp; Fraud</option>
                  <option value="Enterprise SaaS & GenAI">Enterprise SaaS &amp; GenAI</option>
                  <option value="Autonomous Systems & Robotics">Autonomous Systems &amp; Robotics</option>
                  <option value="Retail & Customer Intelligence">Retail &amp; Customer Intelligence</option>
                </select>
              </div>

              {/* Risk Appetite & Max Inherent Risk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Risk Appetite Threshold</label>
                  <select
                    value={formData.riskAppetite || "Balanced"}
                    onChange={(e: any) => setFormData({ ...formData, riskAppetite: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-800 focus:bg-white focus:border-indigo-500"
                  >
                    <option value="Zero Tolerance">Zero Tolerance (Strict Healthcare / Critical Safety)</option>
                    <option value="Conservative">Conservative (Financial / Banking)</option>
                    <option value="Balanced">Balanced (Standard Enterprise SaaS)</option>
                    <option value="Innovative / Sandbox">Innovative / Sandbox (Internal R&amp;D)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Max Inherent Risk Allowed</label>
                  <select
                    value={formData.maxAllowedInherentRisk || "Medium"}
                    onChange={(e: any) => setFormData({ ...formData, maxAllowedInherentRisk: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-800 focus:bg-white focus:border-indigo-500"
                  >
                    <option value="Low">Low Only (Block Medium / High)</option>
                    <option value="Medium">Medium (Require CISO Approval)</option>
                    <option value="High">High (Sandbox &amp; Research Only)</option>
                  </select>
                </div>
              </div>

              {/* DPO Name & DPO Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Assigned DPO Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yan Aung"
                    value={formData.dpoName || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, dpoName: e.target.value });
                      if (formErrors.dpoName) setFormErrors({ ...formErrors, dpoName: "" });
                    }}
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-none font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 ${
                      formErrors.dpoName ? "border-rose-400 bg-rose-50/50" : "border-slate-200"
                    }`}
                  />
                  {formErrors.dpoName && <span className="text-[10px] text-rose-600">{formErrors.dpoName}</span>}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Assigned DPO Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. yan.aung@gmail.com"
                    value={formData.dpoEmail || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, dpoEmail: e.target.value });
                      if (formErrors.dpoEmail) setFormErrors({ ...formErrors, dpoEmail: "" });
                    }}
                    className={`w-full p-2.5 bg-slate-50 border rounded-lg outline-none font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 ${
                      formErrors.dpoEmail ? "border-rose-400 bg-rose-50/50" : "border-slate-200"
                    }`}
                  />
                  {formErrors.dpoEmail && <span className="text-[10px] text-rose-600">{formErrors.dpoEmail}</span>}
                </div>
              </div>

              {/* AI Custodian & Health Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Lead AI Custodian</label>
                  <input
                    type="text"
                    placeholder="e.g. Staff MLOps Architect"
                    value={formData.aiCustodian || ""}
                    onChange={(e) => setFormData({ ...formData, aiCustodian: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold text-slate-800 focus:bg-white focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Target Compliance Health ({formData.complianceHealthScore ?? 95}%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formData.complianceHealthScore ?? 95}
                    onChange={(e) => setFormData({ ...formData, complianceHealthScore: parseInt(e.target.value, 10) })}
                    className="w-full accent-indigo-600 mt-2"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-business-unit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                >
                  {isCreating ? "Create Business Unit" : "Save & Apply Parameters"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {unitToDelete && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up border border-slate-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Business Unit?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to delete <strong className="text-slate-800">{unitToDelete.name}</strong> ({unitToDelete.code})? This will unpartition associated risk profiles.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setUnitToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUnit}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
