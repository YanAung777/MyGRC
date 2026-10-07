// Cloud SQL & PostgreSQL Entity Repository
import {
  INITIAL_PROJECTS,
  INITIAL_MODELS,
  INITIAL_RISKS,
  INITIAL_INCIDENTS,
  INITIAL_EVIDENCE,
} from "../data.ts";

// Stores
const projectsMap = new Map<string, any>(INITIAL_PROJECTS.map((p) => [p.id, { ...p, workspaceId: p.workspaceId || "ws-1" }]));
const modelsMap = new Map<string, any>(INITIAL_MODELS.map((m) => [m.id, { ...m, workspaceId: m.workspaceId || "ws-1" }]));
const risksMap = new Map<string, any>(INITIAL_RISKS.map((r) => [r.id, { ...r, workspaceId: r.workspaceId || "ws-1" }]));
const incidentsMap = new Map<string, any>(INITIAL_INCIDENTS.map((i) => [i.id, { ...i, workspaceId: i.workspaceId || "ws-1" }]));
const evidenceMap = new Map<string, any>(INITIAL_EVIDENCE.map((e) => [e.id, { ...e, workspaceId: e.workspaceId || "ws-1" }]));

const auditorRoomsMap = new Map<string, any>();
const auditorNotesList: any[] = [];
const modelTelemetryList: any[] = [];
const cicdGateEventsList: any[] = [];

// Projects
export async function getDbProjects(workspaceId?: string): Promise<any[]> {
  const all = Array.from(projectsMap.values());
  if (!workspaceId) return all;
  return all.filter((p) => p.workspaceId === workspaceId || !p.workspaceId);
}

export async function upsertDbProject(project: any, workspaceId: string = "ws-1"): Promise<any> {
  const record = { ...project, workspaceId: project.workspaceId || workspaceId };
  projectsMap.set(project.id, record);
  return record;
}

export async function deleteDbProject(id: string): Promise<boolean> {
  return projectsMap.delete(id);
}

// Models
export async function getDbModels(workspaceId?: string): Promise<any[]> {
  const all = Array.from(modelsMap.values());
  if (!workspaceId) return all;
  return all.filter((m) => m.workspaceId === workspaceId || !m.workspaceId);
}

export async function upsertDbModel(model: any, workspaceId: string = "ws-1"): Promise<any> {
  const record = { ...model, workspaceId: model.workspaceId || workspaceId };
  modelsMap.set(model.id, record);
  return record;
}

export async function deleteDbModel(id: string): Promise<boolean> {
  return modelsMap.delete(id);
}

export async function batchUpsertDbModels(models: any[], workspaceId: string = "ws-1", mode: "merge" | "overwrite" | "append" = "merge"): Promise<any[]> {
  const existing = Array.from(modelsMap.values()).filter((m) => m.workspaceId === workspaceId);
  const updatedList: any[] = [];

  if (mode === "overwrite") {
    for (const em of existing) {
      modelsMap.delete(em.id);
    }
  }

  for (const m of models) {
    let targetId = m.id;
    // Check if duplicate exists by provider + name + version if no explicit ID or in append mode
    if (!targetId || mode === "append") {
      const match = !targetId && existing.find(e => e.name.toLowerCase() === m.name.toLowerCase() && e.provider.toLowerCase() === m.provider.toLowerCase());
      if (match && mode === "merge") {
        targetId = match.id;
      } else {
        targetId = `mod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      }
    }
    const record = { ...m, id: targetId, workspaceId: m.workspaceId || workspaceId };
    modelsMap.set(targetId, record);
    updatedList.push(record);
  }
  return updatedList;
}

// Risks
export async function getDbRisks(workspaceId?: string): Promise<any[]> {
  const all = Array.from(risksMap.values());
  if (!workspaceId) return all;
  return all.filter((r) => r.workspaceId === workspaceId || !r.workspaceId);
}

export async function upsertDbRisk(risk: any, workspaceId: string = "ws-1"): Promise<any> {
  const record = { ...risk, workspaceId: risk.workspaceId || workspaceId };
  risksMap.set(risk.id, record);
  return record;
}

export async function deleteDbRisk(id: string): Promise<boolean> {
  return risksMap.delete(id);
}

// Incidents
export async function getDbIncidents(workspaceId?: string): Promise<any[]> {
  const all = Array.from(incidentsMap.values());
  if (!workspaceId) return all;
  return all.filter((i) => i.workspaceId === workspaceId || !i.workspaceId);
}

export async function upsertDbIncident(incident: any, workspaceId: string = "ws-1"): Promise<any> {
  const record = { ...incident, workspaceId: incident.workspaceId || workspaceId };
  incidentsMap.set(incident.id, record);
  return record;
}

// Evidence Files
export async function getDbEvidenceFiles(workspaceId?: string): Promise<any[]> {
  const all = Array.from(evidenceMap.values());
  if (!workspaceId) return all;
  return all.filter((e) => e.workspaceId === workspaceId || !e.workspaceId);
}

export async function upsertDbEvidenceFile(file: any, workspaceId: string = "ws-1"): Promise<any> {
  const record = { ...file, workspaceId: file.workspaceId || workspaceId };
  evidenceMap.set(file.id, record);
  return record;
}

export async function deleteDbEvidenceFile(id: string): Promise<boolean> {
  return evidenceMap.delete(id);
}

// Auditor Rooms & Notes
export async function getDbAuditorRooms(workspaceId?: string): Promise<any[]> {
  return Array.from(auditorRoomsMap.values());
}

export async function insertDbAuditorRoom(room: any): Promise<any> {
  auditorRoomsMap.set(room.id, room);
  return room;
}

export async function getDbAuditorNotes(roomId: string): Promise<any[]> {
  return auditorNotesList.filter((n) => n.roomId === roomId);
}

export async function insertDbAuditorNote(note: any): Promise<any> {
  auditorNotesList.push(note);
  return note;
}

// Telemetry & CI/CD Gates
export async function getDbModelTelemetry(modelId?: string): Promise<any[]> {
  if (!modelId) return modelTelemetryList;
  return modelTelemetryList.filter((t) => t.modelId === modelId);
}

export async function insertDbModelTelemetry(telemetry: any): Promise<any> {
  modelTelemetryList.push(telemetry);
  return telemetry;
}

export async function getDbCicdGateEvents(workspaceId?: string): Promise<any[]> {
  return cicdGateEventsList;
}

export async function insertDbCicdGateEvent(event: any): Promise<any> {
  cicdGateEventsList.push(event);
  return event;
}
