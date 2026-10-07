import { Router, Request, Response } from "express";
import { db } from "../mockData";
import { TeamMember } from "../../../src/types";

const router = Router();

// GET workspace organizational metadata
router.get("/profile", (req: Request, res: Response) => {
  res.json({
    id: "ws-default",
    name: "Enterprise Compliance Workspace",
    created: "2026-01-01",
    tier: "Enterprise Pro"
  });
});

// GET workspace roster (all collaborators)
router.get("/team", (req: Request, res: Response) => {
  res.json(db.workspaceMembers);
});

// POST add teammate to workspace
router.post("/team", (req: Request, res: Response) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role) {
    res.status(400).json({ error: "Missing required fields: name, email, role" });
    return;
  }

  const existing = db.workspaceMembers.find(m => m.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(400).json({ error: "A user with this email address already exists in the workspace" });
    return;
  }

  const newMember: TeamMember = {
    id: `m-${Date.now()}`,
    name,
    email,
    role,
    joinedDate: new Date().toISOString().split("T")[0]
  };

  db.workspaceMembers.push(newMember);
  res.status(201).json(newMember);
});

// PUT edit teammate role
router.put("/team/:id", (req: Request, res: Response) => {
  const member = db.workspaceMembers.find(m => m.id === req.params.id);
  if (!member) {
    res.status(404).json({ error: "Team member not found" });
    return;
  }

  const { role, name } = req.body;
  if (role) {
    if (!["Admin", "Editor", "Reviewer", "Auditor"].includes(role)) {
      res.status(400).json({ error: "Invalid role specified" });
      return;
    }
    member.role = role;
  }

  if (name) member.name = name;

  res.json(member);
});

// DELETE remove collaborator from workspace
router.delete("/team/:id", (req: Request, res: Response) => {
  const index = db.workspaceMembers.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Team member not found" });
    return;
  }

  const member = db.workspaceMembers[index];
  if (member.isYou) {
    res.status(400).json({ error: "You cannot remove your own administrator account from the workspace" });
    return;
  }

  db.workspaceMembers.splice(index, 1);
  res.status(204).send();
});

export default router;
