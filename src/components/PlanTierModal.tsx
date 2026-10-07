import React, { useState } from "react";
import { X, Check, ShieldCheck, Sparkles, Zap, Building2, ArrowRight } from "lucide-react";
import { PLAN_TIERS, PlanTier } from "../data/planTiers";

interface PlanTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId: string;
  onSelectPlan: (plan: PlanTier) => void;
}

export default function PlanTierModal({
  isOpen,
  onClose,
  currentPlanId,
  onSelectPlan
}: PlanTierModalProps) {
  const [selectedId, setSelectedId] = useState<string>(currentPlanId);
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

  if (!isOpen) return null;

  const handleConfirm = () => {
    const plan = PLAN_TIERS.find((p) => p.id === selectedId) || PLAN_TIERS[2];
    onSelectPlan(plan);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-scale-up">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Select Workspace Plan Tier</h3>
            </div>
            <p className="text-xs text-indigo-200/80 mt-1">
              Choose the tier matching your organization's AI governance, seat license, and compliance needs.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-indigo-200 hover:text-white hover:bg-indigo-800/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Billing cycle switch */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-center items-center gap-3 shrink-0">
          <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-slate-900" : "text-slate-500"}`}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === "annual" ? "monthly" : "annual")}
            className="w-12 h-6 bg-indigo-600 rounded-full p-1 transition-colors flex items-center cursor-pointer"
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === "annual" ? "text-slate-900" : "text-slate-500"}`}>
            <span>Annual Billing</span>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </span>
        </div>

        {/* Tier Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          {PLAN_TIERS.map((tier) => {
            const isCurrent = tier.id === currentPlanId;
            const isSelected = tier.id === selectedId;
            const adjustedPrice = billingCycle === "annual" ? tier.priceMonthly : Math.round(tier.priceMonthly * 1.2);

            return (
              <div
                key={tier.id}
                onClick={() => setSelectedId(tier.id)}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer relative ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/30 shadow-md ring-2 ring-indigo-600/20"
                    : "border-slate-200 bg-white hover:border-slate-300 shadow-2xs"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-900">{tier.name}</h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 min-h-[32px]">{tier.description}</p>

                  <div className="my-4 pb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">${adjustedPrice}</span>
                      <span className="text-xs text-slate-500 font-medium">/mo</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      {tier.billingPeriod}
                    </span>
                  </div>

                  {/* Quotas */}
                  <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-700 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">AI Projects:</span>
                      <span className="font-bold text-slate-900">{tier.maxProjects} Use-cases</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Team Seats:</span>
                      <span className="font-bold text-slate-900">{tier.maxSeats} Seats</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Evidence Vault:</span>
                      <span className="font-bold text-slate-900">{tier.storageGb} GB</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2 text-[11px] text-slate-600">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(tier.id);
                    }}
                    className={`w-full py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Selected Tier</span>
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

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition-colors shadow-md flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Confirm & Update Workspace Plan Tier</span>
          </button>
        </div>
      </div>
    </div>
  );
}
