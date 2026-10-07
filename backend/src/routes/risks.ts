import { Router, Request, Response } from "express";
import { db } from "../mockData";
import { RiskRecord } from "../../../src/types";

const router = Router();

// GET all risks
router.get("/", (req: Request, res: Response) => {
  res.json(db.risks);
});

// GET single risk
router.get("/:id", (req: Request, res: Response) => {
  const risk = db.risks.find(r => r.id === req.params.id);
  if (!risk) {
    res.status(404).json({ error: "Risk record not found" });
    return;
  }
  res.json(risk);
});

// POST create risk entry
router.post("/", (req: Request, res: Response) => {
  const { name, severity, mitigationStatus, riskLevel, description, targetDate, applicableProjects, applicableFrameworks, potentialImpact, likelihood, severityCalc, notes, mitigationPlan, implementationStrategy } = req.body;

  if (!name || !severity || !riskLevel) {
    res.status(400).json({ error: "Missing required fields: name, severity, riskLevel" });
    return;
  }

  const newRisk: RiskRecord = {
    id: `risk-${Date.now()}`,
    name,
    owner: req.body.owner || "You",
    severity,
    mitigationStatus: mitigationStatus || "NOT STARTED",
    riskLevel,
    targetDate: targetDate || new Date().toISOString().split("T")[0],
    description: description || "",
    applicableProjects: applicableProjects || [],
    applicableFrameworks: applicableFrameworks || [],
    lifecyclePhase: req.body.lifecyclePhase || "Testing & Validation",
    categories: req.body.categories || [],
    potentialImpact: potentialImpact || "",
    likelihood: likelihood || "MEDIUM",
    severityCalc: severityCalc || severity,
    notes: notes || "",
    mitigationPlan: mitigationPlan || "",
    implementationStrategy: implementationStrategy || ""
  };

  db.risks.push(newRisk);
  res.status(201).json(newRisk);
});

// PUT full update for risk mitigation tracking
router.put("/:id", (req: Request, res: Response) => {
  const index = db.risks.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Risk record not found" });
    return;
  }

  const existing = db.risks[index];
  const updatedRisk: RiskRecord = {
    ...existing,
    ...req.body,
    id: existing.id // protect ID
  };

  db.risks[index] = updatedRisk;
  res.json(updatedRisk);
});

// PATCH partial update
router.patch("/:id", (req: Request, res: Response) => {
  const index = db.risks.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Risk record not found" });
    return;
  }

  db.risks[index] = {
    ...db.risks[index],
    ...req.body,
    id: db.risks[index].id
  };

  res.json(db.risks[index]);
});

// DELETE risk entry
router.delete("/:id", (req: Request, res: Response) => {
  const index = db.risks.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Risk record not found" });
    return;
  }

  db.risks.splice(index, 1);
  res.status(204).send();
});

export default router;
