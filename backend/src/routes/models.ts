import { Router, Request, Response } from "express";
import { db } from "../mockData";
import { ModelRecord } from "../../../src/types";

const router = Router();

// GET all registered models
router.get("/", (req: Request, res: Response) => {
  res.json(db.models);
});

// GET single model
router.get("/:id", (req: Request, res: Response) => {
  const model = db.models.find(m => m.id === req.params.id);
  if (!model) {
    res.status(404).json({ error: "Model not found" });
    return;
  }
  res.json(model);
});

// POST register model
router.post("/", (req: Request, res: Response) => {
  const { provider, name, version } = req.body;

  if (!provider || !name) {
    res.status(400).json({ error: "Missing required fields: provider, name" });
    return;
  }

  const newModel: ModelRecord = {
    id: `model-${Date.now()}`,
    provider,
    name,
    version: version || "v1.0.0",
    status: "Pending",
    approver: "Unassigned",
    statusDate: new Date().toISOString().split("T")[0],
    useCasesCount: 0
  };

  db.models.push(newModel);
  res.status(201).json(newModel);
});

// PATCH model status (Approval Gating)
router.patch("/:id", (req: Request, res: Response) => {
  const model = db.models.find(m => m.id === req.params.id);
  if (!model) {
    res.status(404).json({ error: "Model not found" });
    return;
  }

  const { status, approver } = req.body;
  if (status) {
    if (!["Pending", "Approved", "Restricted", "Blocked"].includes(status)) {
      res.status(400).json({ error: "Invalid status value" });
      return;
    }
    model.status = status;
    model.approver = approver || "AI Governance Board";
    model.statusDate = new Date().toISOString().split("T")[0];
  }

  // Allow updating general parameters
  if (req.body.name) model.name = req.body.name;
  if (req.body.provider) model.provider = req.body.provider;
  if (req.body.version) model.version = req.body.version;

  res.json(model);
});

// DELETE model from registry
router.delete("/:id", (req: Request, res: Response) => {
  const index = db.models.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Model not found" });
    return;
  }

  // Remove reference from projects mappedModels
  db.projects.forEach(proj => {
    if (proj.mappedModels) {
      proj.mappedModels = proj.mappedModels.filter(id => id !== req.params.id);
    }
  });

  db.models.splice(index, 1);
  res.status(204).send();
});

export default router;
