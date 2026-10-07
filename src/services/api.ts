// Centralized API Client for PostgreSQL & Cloud SQL Integration
import { auth } from "../firebase";
import { AIProject, ModelRecord, RiskRecord, IncidentRecord, EvidenceFile } from "../types";

async function getAuthHeader(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  try {
    if (auth && auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
  } catch (err) {
    // Continue without token
  }
  return headers;
}

export const dbApi = {
  // Projects
  async getProjects(): Promise<AIProject[]> {
    const headers = await getAuthHeader();
    const res = await fetch("/api/projects", { headers });
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = await res.json();
    return data.projects || [];
  },

  async saveProject(project: AIProject): Promise<AIProject> {
    const headers = await getAuthHeader();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers,
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error("Failed to save project");
    const data = await res.json();
    return data.project;
  },

  async deleteProject(id: string): Promise<boolean> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers,
    });
    return res.ok;
  },

  // Models
  async getModels(): Promise<ModelRecord[]> {
    const headers = await getAuthHeader();
    const res = await fetch("/api/models", { headers });
    if (!res.ok) throw new Error("Failed to fetch models");
    const data = await res.json();
    return data.models || [];
  },

  async saveModel(model: ModelRecord): Promise<ModelRecord> {
    const headers = await getAuthHeader();
    const res = await fetch("/api/models", {
      method: "POST",
      headers,
      body: JSON.stringify(model),
    });
    if (!res.ok) throw new Error("Failed to save model");
    const data = await res.json();
    return data.model;
  },

  async deleteModel(id: string): Promise<boolean> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/models/${id}`, {
      method: "DELETE",
      headers,
    });
    return res.ok;
  },

  async batchImportModels(models: ModelRecord[], mode: "merge" | "overwrite" | "append" = "merge"): Promise<{ success: boolean; count: number; models: ModelRecord[] }> {
    const headers = await getAuthHeader();
    const res = await fetch("/api/models/batch-import", {
      method: "POST",
      headers,
      body: JSON.stringify({ models, mode }),
    });
    if (!res.ok) throw new Error("Failed to batch import models");
    return await res.json();
  },

  async exportModels(status?: string): Promise<ModelRecord[]> {
    const headers = await getAuthHeader();
    const url = status ? `/api/models/export?status=${encodeURIComponent(status)}` : "/api/models/export";
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error("Failed to export models");
    const data = await res.json();
    return data.models || [];
  },

  // Risks
  async getRisks(): Promise<RiskRecord[]> {
    const headers = await getAuthHeader();
    const res = await fetch("/api/risks", { headers });
    if (!res.ok) throw new Error("Failed to fetch risks");
    const data = await res.json();
    return data.risks || [];
  },

  async saveRisk(risk: RiskRecord): Promise<RiskRecord> {
    const headers = await getAuthHeader();
    const res = await fetch("/api/risks", {
      method: "POST",
      headers,
      body: JSON.stringify(risk),
    });
    if (!res.ok) throw new Error("Failed to save risk");
    const data = await res.json();
    return data.risk;
  },

  async deleteRisk(id: string): Promise<boolean> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/risks/${id}`, {
      method: "DELETE",
      headers,
    });
    return res.ok;
  },

  // Incidents
  async getIncidents(): Promise<IncidentRecord[]> {
    const headers = await getAuthHeader();
    const res = await fetch("/api/incidents", { headers });
    if (!res.ok) throw new Error("Failed to fetch incidents");
    const data = await res.json();
    return data.incidents || [];
  },

  async saveIncident(incident: IncidentRecord): Promise<IncidentRecord> {
    const headers = await getAuthHeader();
    const res = await fetch("/api/incidents", {
      method: "POST",
      headers,
      body: JSON.stringify(incident),
    });
    if (!res.ok) throw new Error("Failed to save incident");
    const data = await res.json();
    return data.incident;
  },

  // Evidence Files
  async getEvidenceFiles(): Promise<EvidenceFile[]> {
    const headers = await getAuthHeader();
    const res = await fetch("/api/evidence", { headers });
    if (!res.ok) throw new Error("Failed to fetch evidence files");
    const data = await res.json();
    return data.evidenceFiles || [];
  },

  async saveEvidenceFile(file: EvidenceFile): Promise<EvidenceFile> {
    const headers = await getAuthHeader();
    const res = await fetch("/api/evidence", {
      method: "POST",
      headers,
      body: JSON.stringify(file),
    });
    if (!res.ok) throw new Error("Failed to save evidence file");
    const data = await res.json();
    return data.evidenceFile;
  },

  async deleteEvidenceFile(id: string): Promise<boolean> {
    const headers = await getAuthHeader();
    const res = await fetch(`/api/evidence/${id}`, {
      method: "DELETE",
      headers,
    });
    return res.ok;
  },
};
