import { Router, Request, Response } from "express";
import { db } from "../mockData";
import { AIProject } from "../../../src/types";

const router = Router();

// GET all projects with optional filtering
router.get("/", (req: Request, res: Response) => {
  let list = [...db.projects];
  
  if (req.query.riskClassification) {
    list = list.filter(p => p.riskClassification === req.query.riskClassification);
  }
  if (req.query.status) {
    list = list.filter(p => p.status === req.query.status);
  }
  
  res.json(list);
});

// GET single project by id
router.get("/:id", (req: Request, res: Response) => {
  const item = db.projects.find(p => p.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(item);
});

// POST create project
router.post("/", (req: Request, res: Response) => {
  const { title, riskClassification, status, description, geography, roleType, framework, goal, targetIndustry } = req.body;
  
  if (!title || !riskClassification || !status) {
    res.status(400).json({ error: "Missing required fields: title, riskClassification, status" });
    return;
  }

  const newProject: AIProject = {
    id: `proj-${Date.now()}`,
    title,
    owner: "You",
    status,
    geography: geography || "Global",
    riskClassification,
    roleType: roleType || "Developer",
    startDate: new Date().toISOString().split("T")[0],
    lastUpdated: new Date().toISOString().split("T")[0],
    framework: framework || "ISO 42001",
    teamMembers: ["You"],
    goal: goal || "",
    targetIndustry: targetIndustry || "General",
    description: description || "",
    mappedModels: [],
    completedComplianceTasks: []
  };

  db.projects.push(newProject);
  res.status(201).json(newProject);
});

// PUT full update
router.put("/:id", (req: Request, res: Response) => {
  const index = db.projects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const existing = db.projects[index];
  const updatedProject: AIProject = {
    ...existing,
    ...req.body,
    id: existing.id, // ID must remain immutable
    lastUpdated: new Date().toISOString().split("T")[0]
  };

  db.projects[index] = updatedProject;
  res.json(updatedProject);
});

// PATCH partial update
router.patch("/:id", (req: Request, res: Response) => {
  const index = db.projects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  db.projects[index] = {
    ...db.projects[index],
    ...req.body,
    id: db.projects[index].id,
    lastUpdated: new Date().toISOString().split("T")[0]
  };

  res.json(db.projects[index]);
});

// DELETE project
router.delete("/:id", (req: Request, res: Response) => {
  const index = db.projects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  db.projects.splice(index, 1);
  res.status(204).send();
});

// POST map model to project
router.post("/:id/models/:modelId", (req: Request, res: Response) => {
  const project = db.projects.find(p => p.id === req.params.id);
  const model = db.models.find(m => m.id === req.params.modelId);

  if (!project || !model) {
    res.status(404).json({ error: "Project or Model not found" });
    return;
  }

  if (!project.mappedModels) {
    project.mappedModels = [];
  }

  if (!project.mappedModels.includes(model.id)) {
    project.mappedModels.push(model.id);
    model.useCasesCount += 1;
  }

  res.json(project);
});

export default router;
