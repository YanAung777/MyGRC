import React, { useState, useEffect } from "react";
import {
  Users,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Search,
  Filter,
  Edit3,
  Check,
  Lock,
  Unlock,
  Mail,
  RefreshCw,
  Sliders,
  Shield,
  ShieldCheck,
  Key,
  Eye,
  X,
  UserCheck,
  UserPlus,
  Settings,
  HelpCircle,
  Palette,
  Download,
  CheckSquare,
  Square,
  Sparkles
} from "lucide-react";
import { TeamMember } from "../types";
import ThemeSelectorView from "./ThemeSelectorView";
import AuditLogsView from "./AuditLogsView";
import PlanTierModal from "./PlanTierModal";
import { PLAN_TIERS, PlanTier } from "../data/planTiers";

interface PendingInvite {
  id: string;
  email: string;
  name?: string;
  role: "Admin" | "Editor" | "Reviewer" | "Auditor";
  sentDate: string;
  invitedBy: string;
  status: "Pending" | "Expired";
}

interface PermissionItem {
  id: string;
  category: "Workspace & Users" | "AI Projects & Models" | "Risk & Assurance" | "Governance & Policies";
  name: string;
  description: string;
  roles: {
    Admin: boolean;
    Editor: boolean;
    Reviewer: boolean;
    Auditor: boolean;
  };
}

interface CustomRole {
  id: string;
  name: string;
  description: string;
  color: string;
  permissionsCount: number;
}

import EnterpriseSSOConfigView from "./EnterpriseSSOConfigView";

interface SettingsViewProps {
  team: TeamMember[];
  onAddMember: (m: TeamMember) => void;
  onRemoveMember: (id: string) => void;
  onUpdateMemberRole?: (id: string, newRole: "Admin" | "Editor" | "Reviewer" | "Auditor") => void;
  onUpdateMember?: (updated: TeamMember) => void;
  activePage?: string;
  onNavigateToTab?: (page: string) => void;
  currentThemeId?: string;
  onSelectTheme?: (themeId: string) => void;
  onOpenMfaStepUp?: (actionTitle: string, onSuccess: () => void) => void;
  onSendAuditLog?: (event: any) => void;
}

// Initial Permission Matrix Configuration
const DEFAULT_PERMISSIONS: PermissionItem[] = [
  // Workspace & Users
  {
    id: "perm-1",
    category: "Workspace & Users",
    name: "Invite & Remove Team Members",
    description: "Grant or revoke workspace access for internal and external collaborators.",
    roles: { Admin: true, Editor: false, Reviewer: false, Auditor: false }
  },
  {
    id: "perm-2",
    category: "Workspace & Users",
    name: "Modify Member Roles & Permissions",
    description: "Reassign access tiers and configure granular capability matrices.",
    roles: { Admin: true, Editor: false, Reviewer: false, Auditor: false }
  },
  {
    id: "perm-3",
    category: "Workspace & Users",
    name: "Manage Plan & Billing",
    description: "Upgrade subscriptions, update payment methods, and view invoices.",
    roles: { Admin: true, Editor: false, Reviewer: false, Auditor: false }
  },
  {
    id: "perm-4",
    category: "Workspace & Users",
    name: "View System Audit Logs",
    description: "Access immutable event logs of all user actions and system changes.",
    roles: { Admin: true, Editor: false, Reviewer: false, Auditor: true }
  },

  // AI Projects & Models
  {
    id: "perm-5",
    category: "AI Projects & Models",
    name: "Register & Edit AI Projects",
    description: "Draft, configure, and maintain technical use-case dossiers.",
    roles: { Admin: true, Editor: true, Reviewer: false, Auditor: false }
  },
  {
    id: "perm-6",
    category: "AI Projects & Models",
    name: "Delete AI Projects",
    description: "Permanently purge project records from the workspace inventory.",
    roles: { Admin: true, Editor: false, Reviewer: false, Auditor: false }
  },
  {
    id: "perm-7",
    category: "AI Projects & Models",
    name: "Approve or Block LLM Models",
    description: "Set governance approval status for foundation models in the Model Registry.",
    roles: { Admin: true, Editor: true, Reviewer: false, Auditor: false }
  },
  {
    id: "perm-8",
    category: "AI Projects & Models",
    name: "View AI Inventory & Models",
    description: "Read-only access to all registered AI initiatives and model catalogs.",
    roles: { Admin: true, Editor: true, Reviewer: true, Auditor: true }
  },

  // Risk & Assurance
  {
    id: "perm-9",
    category: "Risk & Assurance",
    name: "Create & Update Risk Register",
    description: "Log algorithmic risks, quantify impact, and assign mitigation leads.",
    roles: { Admin: true, Editor: true, Reviewer: false, Auditor: false }
  },
  {
    id: "perm-10",
    category: "Risk & Assurance",
    name: "Approve Risk Mitigations & Signoff",
    description: "Formally approve residual risk levels and sign off on control plans.",
    roles: { Admin: true, Editor: false, Reviewer: true, Auditor: false }
  },
  {
    id: "perm-11",
    category: "Risk & Assurance",
    name: "Upload & Link Evidence Documents",
    description: "Manage compliance artifacts, audit files, and system blueprints.",
    roles: { Admin: true, Editor: true, Reviewer: false, Auditor: false }
  },
  {
    id: "perm-12",
    category: "Risk & Assurance",
    name: "Generate Formal Audit Reports",
    description: "Export ISO 42001 and NIST AI RMF audit PDF/DOCX report packages.",
    roles: { Admin: true, Editor: true, Reviewer: true, Auditor: true }
  },

  // Governance & Policies
  {
    id: "perm-13",
    category: "Governance & Policies",
    name: "Publish Organizational Policies",
    description: "Draft, review, and formally publish corporate AI governance policies.",
    roles: { Admin: true, Editor: true, Reviewer: false, Auditor: false }
  },
  {
    id: "perm-14",
    category: "Governance & Policies",
    name: "Vendor & Subcontractor Assessment",
    description: "Conduct third-party model vendor risk assessments and scorecards.",
    roles: { Admin: true, Editor: true, Reviewer: true, Auditor: false }
  },
  {
    id: "perm-15",
    category: "Governance & Policies",
    name: "Log & Investigate Incidents",
    description: "Report algorithmic bias, drift, or safety breach incidents.",
    roles: { Admin: true, Editor: true, Reviewer: false, Auditor: false }
  },
  {
    id: "perm-16",
    category: "Governance & Policies",
    name: "Read-Only Compliance Vault Access",
    description: "Unrestricted read-only access for external auditors to inspect all vaults.",
    roles: { Admin: true, Editor: true, Reviewer: true, Auditor: true }
  }
];

export default function SettingsView({
  team,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
  onUpdateMember,
  activePage,
  onNavigateToTab,
  currentThemeId,
  onSelectTheme,
  onOpenMfaStepUp,
  onSendAuditLog
}: SettingsViewProps) {
  // Tabs: "team" | "billing" | "themes" | "sso" | "audit_logs"
  const [activeTab, setActiveTab] = useState<"team" | "billing" | "themes" | "sso" | "audit_logs">("team");

  // Synchronize state with incoming activePage prop from parent
  useEffect(() => {
    if (activePage === "billing") {
      setActiveTab("billing");
    } else if (activePage === "themes" || activePage === "appearance") {
      setActiveTab("themes");
    } else if (activePage === "sso" || activePage === "security") {
      setActiveTab("sso");
    } else if (activePage === "audit_logs" || activePage === "siem") {
      setActiveTab("audit_logs");
    } else if (activePage === "team") {
      setActiveTab("team");
    }
  }, [activePage]);

  // Sub-tabs for team: "members" | "permissions"
  const [teamSubTab, setTeamSubTab] = useState<"members" | "permissions">("members");

  // Permissions View Sub-mode: "cards" | "matrix"
  const [permissionViewMode, setPermissionViewMode] = useState<"cards" | "matrix">("matrix");

  // Toast notification message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Plan Tier State
  const [activePlan, setActivePlan] = useState<PlanTier>(PLAN_TIERS[2]);
  const [isPlanTierModalOpen, setIsPlanTierModalOpen] = useState<boolean>(false);

  const handleSelectPlan = (plan: PlanTier) => {
    setActivePlan(plan);
    showToast(`Workspace subscription updated to ${plan.name}`);
    if (onSendAuditLog) {
      onSendAuditLog({
        isoControl: "A.9.2.1",
        action: "PLAN_TIER_UPDATED",
        category: "ORGANIZATION_SETTINGS",
        severity: "INFO",
        targetResource: {
          type: "SUBSCRIPTION_PLAN",
          id: plan.id,
          name: plan.name
        },
        details: {
          newPlanId: plan.id,
          newPlanName: plan.name,
          priceMonthly: plan.priceMonthly,
          maxProjects: plan.maxProjects,
          maxSeats: plan.maxSeats,
          storageGb: plan.storageGb
        }
      });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // --- MEMBER FILTERING & SEARCH STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [resendingInviteId, setResendingInviteId] = useState<string | null>(null);

  // --- PENDING INVITES STATE ---
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([
    {
      id: "inv-1",
      email: "sarah.compliance@acmeai.org",
      name: "Sarah Jenkins",
      role: "Auditor",
      sentDate: "May 2, 2026",
      invitedBy: "Demo Assessor",
      status: "Pending"
    },
    {
      id: "inv-2",
      email: "partner.evaluator@alpha.com",
      name: "David Chen",
      role: "Reviewer",
      sentDate: "May 4, 2026",
      invitedBy: "Demo Assessor",
      status: "Pending"
    }
  ]);

  // --- PERMISSIONS MATRIX STATE ---
  const [permissionsMatrix, setPermissionsMatrix] = useState<PermissionItem[]>(DEFAULT_PERMISSIONS);

  // --- INVITE MEMBER MODAL STATE ---
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Editor" | "Reviewer" | "Auditor">("Editor");
  const [sendAsPending, setSendAsPending] = useState(true);

  // --- EDIT MEMBER MODAL STATE ---
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"Admin" | "Editor" | "Reviewer" | "Auditor">("Editor");

  // --- CUSTOM ROLE MODAL STATE ---
  const [isCustomRoleModalOpen, setIsCustomRoleModalOpen] = useState(false);
  const [customRoleName, setCustomRoleName] = useState("");
  const [customRoleDesc, setCustomRoleDesc] = useState("");
  const [customRolesList, setCustomRolesList] = useState<CustomRole[]>([]);

  // Filtered members list
  const filteredMembers = team.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Unique roles in use metric
  const rolesInUseCount = new Set(team.map((m) => m.role)).size;

  // Handle Export Roster (CSV)
  const handleExportRoster = () => {
    const headers = ["Member ID", "Full Name", "Email Address", "Assigned Role", "Joined Date", "MFA Enforced", "SSO Linked"];
    const rows = team.map((m) => [
      `"${m.id}"`,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.email}"`,
      `"${m.role}"`,
      `"${m.joinedDate}"`,
      '"Yes"',
      '"Active"'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `workspace_team_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onSendAuditLog) {
      onSendAuditLog({
        action: "TEAM_ROSTER_EXPORTED",
        isoControl: "A.9.2.1",
        category: "ACCESS_CONTROL",
        details: { totalMembers: team.length, timestamp: new Date().toISOString() }
      });
    }
    showToast(`Exported ${team.length} team members to CSV roster.`);
  };

  // Handle Bulk Role Change
  const handleBulkRoleChange = (newRole: "Admin" | "Editor" | "Reviewer" | "Auditor") => {
    if (selectedMemberIds.length === 0) return;
    selectedMemberIds.forEach((id) => {
      const member = team.find(m => m.id === id);
      if (member && !member.isYou && onUpdateMemberRole) {
        onUpdateMemberRole(id, newRole);
      }
    });
    showToast(`Updated ${selectedMemberIds.length} members to role: ${newRole}`);
    setSelectedMemberIds([]);
  };

  // Handle Bulk Remove
  const handleBulkRemove = () => {
    const removable = selectedMemberIds.filter(id => {
      const mem = team.find(m => m.id === id);
      return mem && !mem.isYou;
    });
    if (removable.length === 0) return;
    if (!confirm(`Are you sure you want to remove ${removable.length} selected member(s) from the workspace?`)) return;

    removable.forEach((id) => onRemoveMember(id));
    showToast(`Removed ${removable.length} member(s) from workspace.`);
    setSelectedMemberIds([]);
  };

  // Handle Invitation Submission
  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    if (sendAsPending) {
      const newInv: PendingInvite = {
        id: `inv-${Date.now()}`,
        email: inviteEmail.trim(),
        name: inviteName.trim(),
        role: inviteRole,
        sentDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        invitedBy: "Demo Assessor",
        status: "Pending"
      };
      setPendingInvites((prev) => [newInv, ...prev]);
      if (onSendAuditLog) {
        onSendAuditLog({
          action: "INVITATION_SENT",
          isoControl: "A.9.2.2",
          category: "ACCESS_CONTROL",
          targetResource: { type: "INVITATION", id: newInv.id, name: newInv.email },
          details: { email: newInv.email, role: newInv.role, invitedBy: newInv.invitedBy }
        });
      }
      showToast(`Invitation sent to ${inviteEmail} as ${inviteRole}`);
    } else {
      const newMem: TeamMember = {
        id: `tm-${Date.now()}`,
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      };
      onAddMember(newMem);
      showToast(`Member ${inviteName} added to workspace as ${inviteRole}`);
    }

    setIsInviteModalOpen(false);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Editor");
  };

  // Handle Inline Role Change
  const handleInlineRoleChange = (memberId: string, memberName: string, newRole: "Admin" | "Editor" | "Reviewer" | "Auditor") => {
    if (onUpdateMemberRole) {
      onUpdateMemberRole(memberId, newRole);
      showToast(`${memberName}'s role updated to ${newRole}`);
    }
  };

  // Handle Resend Invite
  const handleResendInvite = (inv: PendingInvite) => {
    setResendingInviteId(inv.id);
    setTimeout(() => {
      setResendingInviteId(null);
      if (onSendAuditLog) {
        onSendAuditLog({
          action: "INVITATION_RESENT",
          isoControl: "A.9.2.2",
          category: "ACCESS_CONTROL",
          targetResource: { type: "INVITATION", id: inv.id, name: inv.email },
          details: { email: inv.email, role: inv.role }
        });
      }
      showToast(`Invitation email successfully resent to ${inv.email}`);
    }, 800);
  };

  // Handle Revoke Invite
  const handleRevokeInvite = (invId: string, email: string) => {
    setPendingInvites((prev) => prev.filter((i) => i.id !== invId));
    if (onSendAuditLog) {
      onSendAuditLog({
        action: "INVITATION_REVOKED",
        isoControl: "A.9.2.6",
        category: "ACCESS_CONTROL",
        severity: "WARN",
        targetResource: { type: "INVITATION", id: invId, name: email },
        details: { email, invId }
      });
    }
    showToast(`Invitation for ${email} revoked`);
  };

  // Handle Accept/Convert Pending Invite to Active Member
  const handleConvertInviteToMember = (inv: PendingInvite) => {
    const newMem: TeamMember = {
      id: `tm-${Date.now()}`,
      name: inv.name || inv.email.split("@")[0],
      email: inv.email,
      role: inv.role,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    onAddMember(newMem);
    setPendingInvites((prev) => prev.filter((i) => i.id !== inv.id));
    if (onSendAuditLog) {
      onSendAuditLog({
        action: "INVITATION_ACCEPTED",
        isoControl: "A.9.2.2",
        category: "ACCESS_CONTROL",
        targetResource: { type: "USER", id: newMem.id, name: newMem.name },
        details: { memberName: newMem.name, email: newMem.email, role: newMem.role }
      });
    }
    showToast(`${inv.name || inv.email} is now an active workspace member`);
  };

  // Handle Edit Member Form Open
  const handleOpenEditMember = (m: TeamMember) => {
    setEditingMember(m);
    setEditName(m.name);
    setEditEmail(m.email);
    setEditRole(m.role);
  };

  // Handle Save Edited Member
  const handleSaveEditedMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editName.trim() || !editEmail.trim()) return;

    if (onUpdateMember) {
      onUpdateMember({
        ...editingMember,
        name: editName.trim(),
        email: editEmail.trim(),
        role: editRole
      });
      showToast(`Member ${editName} updated successfully`);
    } else if (onUpdateMemberRole) {
      onUpdateMemberRole(editingMember.id, editRole);
      showToast(`${editName}'s role set to ${editRole}`);
    }

    setEditingMember(null);
  };

  // Handle Toggle Permission in Matrix
  const handleTogglePermission = (permId: string, role: "Admin" | "Editor" | "Reviewer" | "Auditor") => {
    setPermissionsMatrix((prev) =>
      prev.map((item) => {
        if (item.id !== permId) return item;
        return {
          ...item,
          roles: {
            ...item.roles,
            [role]: !item.roles[role]
          }
        };
      })
    );
  };

  // Handle Save Permission Matrix
  const handleSavePermissionsMatrix = () => {
    if (onSendAuditLog) {
      onSendAuditLog({
        action: "PERMISSIONS_MATRIX_UPDATED",
        isoControl: "A.9.1.2",
        category: "ACCESS_CONTROL",
        severity: "WARN",
        details: { totalScopes: permissionsMatrix.length, timestamp: new Date().toISOString() }
      });
    }
    showToast("Role permissions matrix successfully saved and enforced across workspace.");
  };

  // Handle Reset Permission Matrix
  const handleResetPermissionsMatrix = () => {
    setPermissionsMatrix(DEFAULT_PERMISSIONS);
    showToast("Role permissions reset to standard GRC default presets.");
  };

  // Handle Create Custom Role
  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleName.trim()) return;

    const newRole: CustomRole = {
      id: `crole-${Date.now()}`,
      name: customRoleName.trim(),
      description: customRoleDesc.trim() || "Custom tailored workspace access tier.",
      color: "bg-purple-50 text-purple-700 border-purple-200",
      permissionsCount: 8
    };

    setCustomRolesList((prev) => [...prev, newRole]);
    setIsCustomRoleModalOpen(false);
    setCustomRoleName("");
    setCustomRoleDesc("");
    if (onSendAuditLog) {
      onSendAuditLog({
        action: "CUSTOM_ROLE_CREATED",
        isoControl: "A.9.1.2",
        category: "ACCESS_CONTROL",
        targetResource: { type: "ROLE", id: newRole.id, name: newRole.name },
        details: { roleName: newRole.name, description: newRole.description }
      });
    }
    showToast(`Custom Role "${newRole.name}" created!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 z-50 animate-bounce-subtle">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top level Settings tab switcher */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure workspace team access, roles, granular permissions, and billing plan subscriptions.
            </p>
          </div>

          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100 flex-wrap">
            <button
              onClick={() => {
                setActiveTab("team");
                if (onNavigateToTab) onNavigateToTab("team");
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "team"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              id="set-tab-team"
            >
              Team Management
            </button>
            <button
              onClick={() => {
                setActiveTab("billing");
                if (onNavigateToTab) onNavigateToTab("billing");
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "billing"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              id="set-tab-billing"
            >
              Plan & Billing
            </button>
            <button
              onClick={() => {
                setActiveTab("sso");
                if (onNavigateToTab) onNavigateToTab("sso");
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "sso"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              id="set-tab-sso"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>Enterprise SSO &amp; SCIM</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("audit_logs");
                if (onNavigateToTab) onNavigateToTab("audit_logs");
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "audit_logs"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              id="set-tab-audit-logs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Audit Logs &amp; SIEM</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("themes");
                if (onNavigateToTab) onNavigateToTab("themes");
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "themes"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              id="set-tab-themes"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span>Appearance & Color Themes</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Team Management View */}
      {activeTab === "team" && (
        <div className="space-y-6 animate-fade-in" id="panel-team-management">
          
          {/* Quick stats strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Members</span>
                <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{team.length}</span>
              </div>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pending Invites</span>
                <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{pendingInvites.length}</span>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Roles in Use</span>
                <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{rolesInUseCount}</span>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Shield className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Sub tabs controls (Members vs Permissions) */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full md:w-auto">
              <button
                onClick={() => setTeamSubTab("members")}
                className={`flex-1 md:flex-initial px-5 py-2 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  teamSubTab === "members" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
                id="btn-team-members"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Members & Invites ({team.length + pendingInvites.length})</span>
              </button>
              <button
                onClick={() => setTeamSubTab("permissions")}
                className={`flex-1 md:flex-initial px-5 py-2 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  teamSubTab === "permissions" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
                id="btn-team-permissions"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Role Permissions Matrix</span>
              </button>
            </div>

            {teamSubTab === "members" ? (
              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                <button
                  onClick={handleExportRoster}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                  id="btn-export-roster"
                  title="Export complete member roster as CSV"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={() => {
                    const demoPool = [
                      { name: "Dr. Sarah Vance", email: "sarah.vance@ai-governance.org", role: "Auditor" as const },
                      { name: "Alexander Wright", email: "alexander.wright@saas-tech.com", role: "Admin" as const },
                      { name: "Siddharth Patel", email: "siddharth.patel@ml-ops.io", role: "Editor" as const },
                      { name: "Claire Dubois", email: "claire.dubois@legal-ai.eu", role: "Reviewer" as const },
                      { name: "Sofia Martinez", email: "sofia.martinez@iso-cert.org", role: "Auditor" as const },
                      { name: "Ethan Zhang", email: "ethan.zhang@tech-demo.com", role: "Editor" as const }
                    ];
                    // Find one that isn't already added
                    const available = demoPool.find(d => !team.some(m => m.email === d.email));
                    const selected = available || {
                      name: `Demo User ${team.length + 1}`,
                      email: `demouser${team.length + 1}@aigovernance.demo`,
                      role: "Editor" as const
                    };
                    const newMem: TeamMember = {
                      id: `tm-${Date.now()}`,
                      name: selected.name,
                      email: selected.email,
                      role: selected.role,
                      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    };
                    onAddMember(newMem);
                    showToast(`Demo member ${selected.name} (${selected.role}) added successfully!`);
                  }}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                  id="btn-quick-add-demo-member"
                  title="Instantly add a realistic demo member"
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>+ Quick Demo Member</span>
                </button>

                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  id="btn-invite-member"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Invite Member</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setPermissionViewMode("matrix")}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded transition-all cursor-pointer ${
                      permissionViewMode === "matrix" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Permissions Matrix
                  </button>
                  <button
                    onClick={() => setPermissionViewMode("cards")}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded transition-all cursor-pointer ${
                      permissionViewMode === "cards" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Role Overview Cards
                  </button>
                </div>
                <button
                  onClick={() => setIsCustomRoleModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Custom Role</span>
                </button>
              </div>
            )}
          </div>

          {/* Sub-Tab 1: Members & Invites */}
          {teamSubTab === "members" && (
            <div className="space-y-6">
              
              {/* Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-500 font-semibold shrink-0">Role Filter:</span>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none font-semibold cursor-pointer focus:bg-white focus:border-indigo-500"
                  >
                    <option value="ALL">All Roles ({team.length})</option>
                    <option value="Admin">Admin ({team.filter(m => m.role === "Admin").length})</option>
                    <option value="Editor">Editor ({team.filter(m => m.role === "Editor").length})</option>
                    <option value="Reviewer">Reviewer ({team.filter(m => m.role === "Reviewer").length})</option>
                    <option value="Auditor">Auditor ({team.filter(m => m.role === "Auditor").length})</option>
                  </select>
                </div>
              </div>

              {/* Bulk Action Bar (Visible when members are selected) */}
              {selectedMemberIds.length > 0 && (
                <div className="bg-indigo-900 text-white p-3 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold bg-indigo-800 px-2.5 py-1 rounded-md">
                      {selectedMemberIds.length} Selected
                    </span>
                    <span className="text-xs text-indigo-200">Bulk Actions:</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-indigo-800/80 px-2.5 py-1 rounded-lg">
                      <span className="text-[11px] font-medium text-indigo-200">Change Role:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleBulkRoleChange(e.target.value as any);
                            e.target.value = "";
                          }
                        }}
                        defaultValue=""
                        className="bg-indigo-950 text-white text-xs rounded px-2 py-1 outline-none font-bold border border-indigo-700 cursor-pointer"
                      >
                        <option value="" disabled>Select Role...</option>
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Reviewer">Reviewer</option>
                        <option value="Auditor">Auditor</option>
                      </select>
                    </div>

                    <button
                      onClick={handleBulkRemove}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>

                    <button
                      onClick={() => setSelectedMemberIds([])}
                      className="px-2.5 py-1 bg-indigo-800 hover:bg-indigo-700 text-indigo-200 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Members Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    Active Workspace Members ({filteredMembers.length})
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Select rows for bulk operations or use inline dropdowns.
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="p-4 pl-6 w-10">
                          <input
                            type="checkbox"
                            checked={filteredMembers.length > 0 && selectedMemberIds.length === filteredMembers.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMemberIds(filteredMembers.map(m => m.id));
                              } else {
                                setSelectedMemberIds([]);
                              }
                            }}
                            className="rounded text-indigo-600 cursor-pointer"
                          />
                        </th>
                        <th className="p-4">Member Name</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Assigned Role</th>
                        <th className="p-4">Joined Date</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMembers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-xs text-slate-400">
                            No active workspace members match your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredMembers.map((m) => {
                          const isSelected = selectedMemberIds.includes(m.id);
                          return (
                            <tr
                              key={m.id}
                              className={`transition-colors text-xs text-slate-700 ${isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/60"}`}
                            >
                              <td className="p-4 pl-6">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedMemberIds(prev => [...prev, m.id]);
                                    } else {
                                      setSelectedMemberIds(prev => prev.filter(id => id !== m.id));
                                    }
                                  }}
                                  className="rounded text-indigo-600 cursor-pointer"
                                />
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                                    {m.name.split(" ").map((n) => n[0]).join("")}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900">{m.name}</span>
                                      {m.isYou && (
                                        <span className="text-[9px] font-extrabold bg-indigo-600 text-white px-1.5 py-0.5 rounded-md">
                                          YOU
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">
                                      Member ID: {m.id}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 font-semibold text-slate-600">{m.email}</td>
                              <td className="p-4">
                                {/* Inline Role Selector */}
                                <select
                                  value={m.role}
                                  onChange={(e) =>
                                    handleInlineRoleChange(
                                      m.id,
                                      m.name,
                                      e.target.value as "Admin" | "Editor" | "Reviewer" | "Auditor"
                                    )
                                  }
                                  disabled={m.isYou}
                                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-all ${
                                    m.role === "Admin"
                                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                      : m.role === "Editor"
                                      ? "bg-sky-50 text-sky-700 border-sky-200"
                                      : m.role === "Reviewer"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-slate-100 text-slate-700 border-slate-200"
                                  } ${m.isYou ? "opacity-75 cursor-not-allowed" : "hover:border-indigo-400"}`}
                                >
                                  <option value="Admin">Admin (Full Access)</option>
                                  <option value="Editor">Editor (Publisher)</option>
                                  <option value="Reviewer">Reviewer (Evaluator)</option>
                                  <option value="Auditor">Auditor (Compliance View)</option>
                                </select>
                              </td>
                              <td className="p-4 text-slate-500 font-medium">{m.joinedDate}</td>
                              <td className="p-4 pr-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditMember(m)}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                    title="Edit member information"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  {!m.isYou && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Remove ${m.name} (${m.email}) from this workspace?`)) {
                                          onRemoveMember(m.id);
                                          showToast(`Removed ${m.name} from workspace`);
                                        }
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                      title="Remove member"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Invitations Section */}
              {pendingInvites.length > 0 && (
                <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-amber-100 bg-amber-50/50 flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                      <Mail className="w-4 h-4 text-amber-600" />
                      Pending Workspace Invitations ({pendingInvites.length})
                    </span>
                    <span className="text-[11px] text-amber-700">
                      Sent invitations waiting for user acceptance.
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {pendingInvites.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 font-extrabold flex items-center justify-center text-xs shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{inv.name || inv.email}</span>
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                                {inv.role}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {inv.email} • Invited by {inv.invitedBy} on {inv.sentDate}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleConvertInviteToMember(inv)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="Instantly convert pending invite to active member"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Activate Now</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResendInvite(inv)}
                            disabled={resendingInviteId === inv.id}
                            className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-60"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${resendingInviteId === inv.id ? "animate-spin text-indigo-600" : ""}`} />
                            <span>{resendingInviteId === inv.id ? "Sending..." : "Resend Email"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRevokeInvite(inv.id, inv.email)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Revoke invitation"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Sub-Tab 2: Role Permissions Matrix & Overview Cards */}
          {teamSubTab === "permissions" && (
            <div className="space-y-6">
              
              {/* Permission View Mode 1: Interactive Matrix */}
              {permissionViewMode === "matrix" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden space-y-4 p-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Key className="w-4 h-4 text-indigo-600" />
                        Granular Permission Matrix by Workspace Role
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Toggle specific GRC operational capabilities for each standard role in real time.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetPermissionsMatrix}
                        className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Reset Defaults
                      </button>
                      <button
                        type="button"
                        onClick={handleSavePermissionsMatrix}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save & Enforce Matrix</span>
                      </button>
                    </div>
                  </div>

                  {/* The Matrix Grid Table */}
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                          <th className="p-3.5 pl-5 w-2/5">Capability / Permission Scope</th>
                          <th className="p-3.5 text-center w-1/8 bg-indigo-900/60 border-l border-slate-800">
                            Admin
                          </th>
                          <th className="p-3.5 text-center w-1/8 border-l border-slate-800">Editor</th>
                          <th className="p-3.5 text-center w-1/8 border-l border-slate-800">Reviewer</th>
                          <th className="p-3.5 text-center w-1/8 border-l border-slate-800">Auditor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                        {["Workspace & Users", "AI Projects & Models", "Risk & Assurance", "Governance & Policies"].map(
                          (cat) => {
                            const categoryItems = permissionsMatrix.filter((p) => p.category === cat);
                            return (
                              <React.Fragment key={cat}>
                                <tr className="bg-slate-100/90 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                                  <td colSpan={5} className="p-2.5 pl-5 bg-slate-100 font-mono text-indigo-900">
                                    • {cat} ({categoryItems.length} Scopes)
                                  </td>
                                </tr>
                                {categoryItems.map((item) => (
                                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="p-3.5 pl-5">
                                      <span className="font-bold text-slate-900 block">{item.name}</span>
                                      <span className="text-[11px] text-slate-400 block mt-0.5 leading-tight">
                                        {item.description}
                                      </span>
                                    </td>

                                    {/* Admin Column */}
                                    <td className="p-3.5 text-center border-l border-slate-150 bg-indigo-50/20">
                                      <input
                                        type="checkbox"
                                        checked={item.roles.Admin}
                                        onChange={() => handleTogglePermission(item.id, "Admin")}
                                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                      />
                                    </td>

                                    {/* Editor Column */}
                                    <td className="p-3.5 text-center border-l border-slate-150">
                                      <input
                                        type="checkbox"
                                        checked={item.roles.Editor}
                                        onChange={() => handleTogglePermission(item.id, "Editor")}
                                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                      />
                                    </td>

                                    {/* Reviewer Column */}
                                    <td className="p-3.5 text-center border-l border-slate-150">
                                      <input
                                        type="checkbox"
                                        checked={item.roles.Reviewer}
                                        onChange={() => handleTogglePermission(item.id, "Reviewer")}
                                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                      />
                                    </td>

                                    {/* Auditor Column */}
                                    <td className="p-3.5 text-center border-l border-slate-150">
                                      <input
                                        type="checkbox"
                                        checked={item.roles.Auditor}
                                        onChange={() => handleTogglePermission(item.id, "Auditor")}
                                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Permission View Mode 2: Role Overview Cards */}
              {permissionViewMode === "cards" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Admin Role Card */}
                    <div className="bg-white p-6 rounded-2xl border border-indigo-150 shadow-xs space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-extrabold rounded-lg">
                            ADMIN
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">Full Access Manager</h4>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          {team.filter((m) => m.role === "Admin").length} Members
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Full administrative authority over workspace settings, user role assignments, billing, policy publishing, and audit logs.
                      </p>
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Capabilities:</span>
                        <ul className="text-xs text-slate-700 space-y-1.5">
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Manage team members and invite permissions</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Upgrade subscriptions & manage billing</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Approve, block, or delete AI model registries</li>
                        </ul>
                      </div>
                    </div>

                    {/* Editor Role Card */}
                    <div className="bg-white p-6 rounded-2xl border border-sky-150 shadow-xs space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-extrabold rounded-lg">
                            EDITOR
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">Collaborator & Publisher</h4>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          {team.filter((m) => m.role === "Editor").length} Members
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Can draft, publish, and edit AI projects, organizational policies, risks, incidents, and model registries. Cannot modify workspace billing or team lists.
                      </p>
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Capabilities:</span>
                        <ul className="text-xs text-slate-700 space-y-1.5">
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Register and update AI projects</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Edit risks, incidents, and policy templates</li>
                          <li className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Cannot manage workspace subscription</li>
                        </ul>
                      </div>
                    </div>

                    {/* Reviewer Role Card */}
                    <div className="bg-white p-6 rounded-2xl border border-emerald-150 shadow-xs space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-lg">
                            REVIEWER
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">External Evaluator</h4>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          {team.filter((m) => m.role === "Reviewer").length} Members
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Evaluates compliance frameworks, leaves assessment recommendations, audits risk mitigations, and conducts vendor evaluations.
                      </p>
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Capabilities:</span>
                        <ul className="text-xs text-slate-700 space-y-1.5">
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Approve or review risk mitigation strategies</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Generate compliance audit report summaries</li>
                          <li className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Cannot delete projects or alter roles</li>
                        </ul>
                      </div>
                    </div>

                    {/* Auditor Role Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-extrabold rounded-lg">
                            AUDITOR
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">Compliance Assessor</h4>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          {team.filter((m) => m.role === "Auditor").length} Members
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Strictly read-only access to all evidence files, system blueprints, logs, and evidence vaults to perform formal standard alignment audits (e.g., ISO 42001 certification).
                      </p>
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Capabilities:</span>
                        <ul className="text-xs text-slate-700 space-y-1.5">
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Read-only access to all evidence files</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Export audit logs and compliance reports</li>
                          <li className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" /> No editing or writing capabilities</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Custom Roles List (if created) */}
                  {customRolesList.length > 0 && (
                    <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-xs space-y-3">
                      <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        Custom Defined Roles ({customRolesList.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {customRolesList.map((cr) => (
                          <div key={cr.id} className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-150 flex justify-between items-center">
                            <div>
                              <span className="text-xs font-bold text-purple-900 block">{cr.name}</span>
                              <span className="text-[10px] text-purple-700/80 block mt-0.5">{cr.description}</span>
                            </div>
                            <span className="text-[10px] font-bold bg-white text-purple-700 border border-purple-200 px-2 py-1 rounded-md">
                              {cr.permissionsCount} Scopes
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* 2. Billing View */}
      {activeTab === "billing" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="panel-billing">
          
          {/* Active Plan Detail Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6 lg:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Subscription</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{activePlan.name}</h3>
              </div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-150">
                {activePlan.badge || "Active plan"}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {activePlan.description} Next renewal is on <strong className="text-slate-700">May 30, 2026</strong> for ${activePlan.priceMonthly}/mo ({activePlan.billingPeriod}).
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <span className="text-xs font-bold text-slate-800 block uppercase tracking-wider">Usage & Metering Metrics</span>
              <div className="space-y-3 text-xs">
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Active AI use-cases registered</span>
                    <span className="font-semibold text-slate-800">6 / {activePlan.maxProjects >= 900 ? "Unlimited" : `${activePlan.maxProjects}`}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((6 / activePlan.maxProjects) * 100))}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Evidence storage vault capacity</span>
                    <span className="font-semibold text-slate-800">12.4 MB / {activePlan.storageGb} GB</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((0.0124 / activePlan.storageGb) * 100))}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metric 3 */}
                <div>
                  <div className="flex justify-between text-slate-500 mb-1">
                    <span>Workspace Team Seat Licenses</span>
                    <span className="font-semibold text-slate-800">
                      {team.length + pendingInvites.length} / {activePlan.maxSeats >= 100 ? "100+ Seats" : `${activePlan.maxSeats} Seats`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round(((team.length + pendingInvites.length) / activePlan.maxSeats) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={() => setIsPlanTierModalOpen(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Change Plan Tier</span>
              </button>
              <button
                type="button"
                onClick={() => showToast("Payment methods: Card **** 9821 successfully linked.")}
                className="px-4 py-2.5 bg-white text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Manage Payment Method
              </button>
            </div>
          </div>

          {/* Payment card & Invoice Log side column */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Payment Card</h4>
              <div className="p-4 bg-slate-900 rounded-xl text-white space-y-6 shadow-md">
                <div className="flex justify-between items-start">
                  <CreditCard className="w-8 h-8 text-indigo-400" />
                  <span className="text-[10px] font-bold text-indigo-300 tracking-widest">VISA</span>
                </div>
                <div>
                  <span className="text-xs font-mono tracking-widest block">••••  ••••  ••••  9821</span>
                  <div className="flex justify-between items-center mt-3 text-[10px] font-medium text-slate-400">
                    <span>DEMO A.</span>
                    <span>12 / 2029</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100">
                Invoice History
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 block">INV-0912</span>
                    <span className="text-[10px] text-slate-400">Apr 20, 2026</span>
                  </div>
                  <span className="font-semibold text-slate-600">$0.00 (Trial)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. Appearance & Color Themes View */}
      {activeTab === "themes" && (
        <div className="animate-fade-in" id="panel-themes">
          <ThemeSelectorView
            currentThemeId={currentThemeId || "indigo-enterprise"}
            onSelectTheme={onSelectTheme || (() => {})}
          />
        </div>
      )}

      {/* 4. Enterprise SSO & Security View */}
      {activeTab === "sso" && (
        <div className="animate-fade-in" id="panel-sso">
          <EnterpriseSSOConfigView onOpenMfaStepUp={onOpenMfaStepUp} />
        </div>
      )}

      {/* 5. Audit Logs & SIEM View */}
      {activeTab === "audit_logs" && (
        <div className="animate-fade-in" id="panel-audit-logs">
          <AuditLogsView />
        </div>
      )}

      {/* Plan Tier Selection Modal */}
      {isPlanTierModalOpen && (
        <PlanTierModal
          isOpen={isPlanTierModalOpen}
          onClose={() => setIsPlanTierModalOpen(false)}
          currentPlanId={activePlan.id}
          onSelectPlan={handleSelectPlan}
        />
      )}

      {/* --- INVITE MEMBER MODAL --- */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up border border-slate-100">
            <div className="p-5 border-b border-slate-100 font-bold text-xs text-slate-800 bg-slate-50/50 flex justify-between items-center">
              <span className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                Invite Team Member to Workspace
              </span>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="p-5 space-y-4">
              {/* Quick Fill Demo Member Presets */}
              <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 space-y-2">
                <span className="text-[11px] font-bold text-indigo-900 block">
                  ⚡ Quick Fill Demo Persona
                </span>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setInviteName("Dr. Sarah Vance");
                      setInviteEmail("sarah.vance@ai-governance.org");
                      setInviteRole("Auditor");
                    }}
                    className="px-2 py-1 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-semibold cursor-pointer transition-colors"
                  >
                    Dr. Sarah Vance (Auditor)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInviteName("Alexander Wright");
                      setInviteEmail("alexander.wright@saas-tech.com");
                      setInviteRole("Admin");
                    }}
                    className="px-2 py-1 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-semibold cursor-pointer transition-colors"
                  >
                    Alexander Wright (Admin)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInviteName("Siddharth Patel");
                      setInviteEmail("siddharth.patel@ml-ops.io");
                      setInviteRole("Editor");
                    }}
                    className="px-2 py-1 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-semibold cursor-pointer transition-colors"
                  >
                    Siddharth Patel (Editor)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInviteName("Claire Dubois");
                      setInviteEmail("claire.dubois@legal-ai.eu");
                      setInviteRole("Reviewer");
                    }}
                    className="px-2 py-1 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-semibold cursor-pointer transition-colors"
                  >
                    Claire Dubois (Reviewer)
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Leo Vance"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-xl p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. partner@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-xl p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Assign Workspace Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold focus:border-indigo-500"
                  >
                    <option value="Admin">Admin (Full Access & Settings)</option>
                    <option value="Editor">Editor (Create & Publish Content)</option>
                    <option value="Reviewer">Reviewer (Audit & Evaluate Risks)</option>
                    <option value="Auditor">Auditor (Read-Only Compliance Vault)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendAsPending}
                      onChange={(e) => setSendAsPending(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                    />
                    <span className="text-xs text-slate-600">
                      Send invitation email link (adds to pending queue)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT MEMBER MODAL --- */}
      {editingMember && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up border border-slate-100">
            <div className="p-5 border-b border-slate-100 font-bold text-xs text-slate-800 bg-slate-50/50 flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Workspace Member Details
              </span>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedMember} className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-xl p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-xl p-2.5 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Role Tier
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-semibold focus:border-indigo-500"
                  >
                    <option value="Admin">Admin (Full Access & Settings)</option>
                    <option value="Editor">Editor (Create & Publish Content)</option>
                    <option value="Reviewer">Reviewer (Audit & Evaluate Risks)</option>
                    <option value="Auditor">Auditor (Read-Only Compliance Vault)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CREATE CUSTOM ROLE MODAL --- */}
      {isCustomRoleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up border border-slate-100">
            <div className="p-5 border-b border-slate-100 font-bold text-xs text-slate-800 bg-slate-50/50 flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                Define Custom Workspace Role
              </span>
              <button
                type="button"
                onClick={() => setIsCustomRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Data Protection Officer"
                    value={customRoleName}
                    onChange={(e) => setCustomRoleName(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-xl p-2.5 outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Role Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe the purpose and access boundaries of this custom role..."
                    value={customRoleDesc}
                    onChange={(e) => setCustomRoleDesc(e.target.value)}
                    className="w-full text-xs text-slate-800 border border-slate-200 bg-white rounded-xl p-2.5 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCustomRoleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs"
                >
                  Create Custom Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
