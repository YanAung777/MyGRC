import { Router, Request, Response } from "express";
import { db } from "../mockData";

const router = Router();

// GET all frameworks and dynamic progresses
router.get("/", (req: Request, res: Response) => {
  // Compute progress rates dynamically before returning
  db.frameworks.forEach(fw => {
    let totalReqs = 0;
    let completedReqs = 0;

    fw.clauses.forEach(clause => {
      clause.requirements.forEach(req => {
        totalReqs += 1;
        if (req.status === "Implemented") {
          completedReqs += 1;
        } else if (req.status === "In progress") {
          completedReqs += 0.5; // partial credit
        }
      });
    });

    fw.progress = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0;
  });

  res.json(db.frameworks);
});

// GET requirement details by standard
router.get("/:frameworkId/requirements", (req: Request, res: Response) => {
  const fw = db.frameworks.find(f => f.id === req.params.frameworkId);
  if (!fw) {
    res.status(404).json({ error: "Framework standard not found" });
    return;
  }
  res.json(fw);
});

// PATCH update status/notes/guidance for a specific control requirement
router.patch("/:frameworkId/requirements/:reqId", (req: Request, res: Response) => {
  const fw = db.frameworks.find(f => f.id === req.params.frameworkId);
  if (!fw) {
    res.status(404).json({ error: "Framework standard not found" });
    return;
  }

  let requirementFound = false;

  for (const clause of fw.clauses) {
    const requirement = clause.requirements.find(r => r.id === req.params.reqId);
    if (requirement) {
      requirementFound = true;
      
      const { 
        status, 
        implementationDescription, 
        owner, 
        reviewer, 
        approver, 
        dueDate, 
        auditorFeedback, 
        notes 
      } = req.body;

      if (status) {
        if (!["Implemented", "In progress", "Not started"].includes(status)) {
          res.status(400).json({ error: "Invalid requirement status value" });
          return;
        }
        requirement.status = status;
      }

      if (implementationDescription !== undefined) requirement.implementationDescription = implementationDescription;
      if (owner !== undefined) requirement.owner = owner;
      if (reviewer !== undefined) requirement.reviewer = reviewer;
      if (approver !== undefined) requirement.approver = approver;
      if (dueDate !== undefined) requirement.dueDate = dueDate;
      if (auditorFeedback !== undefined) requirement.auditorFeedback = auditorFeedback;
      if (notes !== undefined) requirement.notes = notes;

      res.json(requirement);
      return;
    }
  }

  if (!requirementFound) {
    res.status(404).json({ error: "Specific control requirement ID not found" });
  }
});

export default router;
