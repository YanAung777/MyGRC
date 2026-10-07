import React, { useState } from "react";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Search,
  Filter,
  Eye,
  FileText,
  Printer,
  Download,
  X,
  UserCheck,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { AIProject, ProjectCASignOff } from "../types";
import CertificationSignOffView, { DEFAULT_SAMPLE_CA_SIGNOFF } from "./CertificationSignOffView";

interface CertificationSummaryViewProps {
  projects: AIProject[];
  onUpdateProject?: (updated: AIProject) => void;
  onNavigateToProject?: (projectId: string) => void;
}

export default function CertificationSummaryView({
  projects,
  onUpdateProject,
  onNavigateToProject
}: CertificationSummaryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [certFilter, setCertFilter] = useState<string>("ALL");
  const [accFilter, setAccFilter] = useState<string>("ALL");

  // Selected project for Quick Sign-Off Modal Drawer
  const [selectedModalProject, setSelectedModalProject] = useState<AIProject | null>(null);

  // Compute metrics
  const totalProjects = projects.length;

  let fullyApproved = 0;
  let qualifiedApproval = 0;
  let pendingSignOff = 0;
  let notCertified = 0;

  projects.forEach((p) => {
    const certLevel = p.caSignOff?.certification?.level || "Pending Assessment";
    const accLevel = p.caSignOff?.accreditation?.level || "Pending Assessment";

    if (certLevel === "Certified" && accLevel === "Accreditation") {
      fullyApproved++;
    } else if (certLevel === "Not Certified" || accLevel === "Not Accredited") {
      notCertified++;
    } else if (certLevel === "Pending Assessment" || accLevel === "Pending Assessment") {
      pendingSignOff++;
    } else {
      // Qualified Certification or Qualified Accreditation
      qualifiedApproval++;
    }
  });

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const titleMatch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchTerm.toLowerCase());

    const cLevel = p.caSignOff?.certification?.level || "Pending Assessment";
    const aLevel = p.caSignOff?.accreditation?.level || "Pending Assessment";

    const matchesCert = certFilter === "ALL" || cLevel === certFilter;
    const matchesAcc = accFilter === "ALL" || aLevel === accFilter;

    return titleMatch && matchesCert && matchesAcc;
  });

  const getOverallStatusBadge = (p: AIProject) => {
    const cLevel = p.caSignOff?.certification?.level || "Pending Assessment";
    const aLevel = p.caSignOff?.accreditation?.level || "Pending Assessment";

    if (cLevel === "Certified" && aLevel === "Accreditation") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fully Approved
        </span>
      );
    }
    if (cLevel === "Not Certified" || aLevel === "Not Accredited") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected / Action Req.
        </span>
      );
    }
    if (cLevel === "Pending Assessment" || aLevel === "Pending Assessment") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
          <Clock className="w-3.5 h-3.5 text-blue-600" /> Pending Sign-Off
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Qualified Approval
      </span>
    );
  };

  const getLevelBadge = (level?: string) => {
    switch (level) {
      case "Certified":
      case "Accreditation":
        return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{level}</span>;
      case "Qualified Certification":
      case "Qualified Accreditation":
        return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">{level}</span>;
      case "Not Certified":
      case "Not Accredited":
        return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">{level}</span>;
      default:
        return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Pending Assessment</span>;
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Certification & Accreditation Sign-Off Status
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Centralized executive assurance matrix tracking CISO Certification and Executive Sponsor Accreditation sign-offs across all registered AI initiatives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Matrix</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total AI Systems</span>
          <div className="text-2xl font-extrabold text-slate-900">{totalProjects}</div>
          <span className="text-[11px] text-slate-500 font-medium block">Active Register</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Fully Approved</span>
          <div className="text-2xl font-extrabold text-emerald-900">{fullyApproved}</div>
          <span className="text-[11px] text-emerald-700 font-semibold block">Certified & Accredited</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Qualified C&A</span>
          <div className="text-2xl font-extrabold text-amber-900">{qualifiedApproval}</div>
          <span className="text-[11px] text-amber-700 font-semibold block">Conditional Remediation</span>
        </div>

        <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Pending Sign-Off</span>
          <div className="text-2xl font-extrabold text-blue-900">{pendingSignOff}</div>
          <span className="text-[11px] text-blue-700 font-semibold block">Awaiting CISO / DCE</span>
        </div>

        <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/80 shadow-2xs space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Not Certified</span>
          <div className="text-2xl font-extrabold text-rose-900">{notCertified}</div>
          <span className="text-[11px] text-rose-700 font-semibold block">Action Required</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search AI projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 outline-none focus:border-indigo-600 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Certification:</span>
            <select
              value={certFilter}
              onChange={(e) => setCertFilter(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 outline-none focus:border-indigo-600"
            >
              <option value="ALL">All Levels</option>
              <option value="Certified">Certified</option>
              <option value="Qualified Certification">Qualified Certification</option>
              <option value="Not Certified">Not Certified</option>
              <option value="Pending Assessment">Pending Assessment</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span>Accreditation:</span>
            <select
              value={accFilter}
              onChange={(e) => setAccFilter(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 outline-none focus:border-indigo-600"
            >
              <option value="ALL">All Levels</option>
              <option value="Accreditation">Accreditation</option>
              <option value="Qualified Accreditation">Qualified Accreditation</option>
              <option value="Not Accredited">Not Accredited</option>
              <option value="Pending Assessment">Pending Assessment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main C&A Status Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        <table className="w-full text-left text-xs border-collapse min-w-[950px]">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/80">
              <th className="py-3.5 px-4 w-64">AI PROJECT / SYSTEM</th>
              <th className="py-3.5 px-4">CERTIFICATION (CISO)</th>
              <th className="py-3.5 px-4">ACCREDITATION (DCE)</th>
              <th className="py-3.5 px-4 w-40">OVERALL C&A STATUS</th>
              <th className="py-3.5 px-4 w-28 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 italic font-medium">
                  No projects match the current search or filter criteria.
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => {
                const cert = project.caSignOff?.certification;
                const acc = project.caSignOff?.accreditation;

                return (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Project Title & Owner */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 text-xs block leading-snug">
                          {project.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-medium">
                            Lead: {project.owner}
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {project.riskClassification}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Certification Details */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div>{getLevelBadge(cert?.level)}</div>
                        <div className="text-[11px] text-slate-700 font-semibold">
                          {cert?.signatory?.name || "Pending CISO"}
                        </div>
                        {cert?.signatory?.date && (
                          <div className="text-[10px] font-mono text-slate-400">
                            Signed: {cert.signatory.date}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Accreditation Details */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div>{getLevelBadge(acc?.level)}</div>
                        <div className="text-[11px] text-slate-700 font-semibold">
                          {acc?.signatory?.name || "Pending Executive"}
                        </div>
                        {acc?.signatory?.date && (
                          <div className="text-[10px] font-mono text-slate-400">
                            Signed: {acc.signatory.date}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Overall Status Badge */}
                    <td className="py-4 px-4">
                      {getOverallStatusBadge(project)}
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedModalProject(project)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Sign-Off / Review</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Sign-Off Modal Drawer */}
      {selectedModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl my-8 overflow-hidden animate-scale-up">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                  <Award className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Sign-Off: {selectedModalProject.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Review or update Chief Officer & Executive accreditation decisions.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModalProject(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto">
              <CertificationSignOffView
                data={selectedModalProject.caSignOff}
                projectTitle={selectedModalProject.title}
                onChangeData={(updated) => {
                  const updatedProj: AIProject = {
                    ...selectedModalProject,
                    caSignOff: updated
                  };
                  setSelectedModalProject(updatedProj);
                  if (onUpdateProject) {
                    onUpdateProject(updatedProj);
                  }
                }}
              />
            </div>

            <div className="p-4 border-t border-slate-150 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToProject) {
                    onNavigateToProject(selectedModalProject.id);
                  }
                  setSelectedModalProject(null);
                }}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                <span>View Full Project Dossier</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedModalProject(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
