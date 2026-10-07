import { Router, Request, Response } from "express";
import { db } from "../mockData";
import { EvidenceFile, Folder } from "../../../src/types";

const router = Router();

// --- Evidence Folders Endpoints ---

// GET all folders
router.get("/folders", (req: Request, res: Response) => {
  res.json(db.folders);
});

// POST create folder
router.post("/folders", (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: "Missing folder name" });
    return;
  }

  const newFolder: Folder = {
    id: `fld-${Date.now()}`,
    name
  };

  db.folders.push(newFolder);
  res.status(201).json(newFolder);
});

// DELETE folder
router.delete("/folders/:id", (req: Request, res: Response) => {
  const index = db.folders.findIndex(f => f.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Folder not found" });
    return;
  }

  // Move files from deleted folder to uncategorized
  db.evidence.forEach(file => {
    if (file.folderId === req.params.id) {
      file.folderId = "fld-uncategorized";
    }
  });

  db.folders.splice(index, 1);
  res.status(204).send();
});

// --- Evidence Files Endpoints ---

// GET all files with optional folder filtering
router.get("/files", (req: Request, res: Response) => {
  let list = [...db.evidence];
  if (req.query.folderId) {
    list = list.filter(f => f.folderId === req.query.folderId);
  }
  res.json(list);
});

// POST register file upload metadata
router.post("/files", (req: Request, res: Response) => {
  const { name, folderId } = req.body;
  if (!name || !folderId) {
    res.status(400).json({ error: "Missing file name or folderId" });
    return;
  }

  const newFile: EvidenceFile = {
    id: `ev-${Date.now()}`,
    name,
    uploadDate: new Date().toISOString().split("T")[0],
    uploader: "You",
    source: "Manual upload",
    version: "v1.0",
    status: "Draft",
    folderId
  };

  db.evidence.push(newFile);
  res.status(201).json(newFile);
});

// PATCH file audit status (Approved, Under Review, Draft)
router.patch("/files/:id", (req: Request, res: Response) => {
  const file = db.evidence.find(f => f.id === req.params.id);
  if (!file) {
    res.status(404).json({ error: "Evidence file not found" });
    return;
  }

  const { status, folderId, name } = req.body;
  if (status) {
    if (!["Draft", "Approved", "Under Review"].includes(status)) {
      res.status(400).json({ error: "Invalid status value" });
      return;
    }
    file.status = status;
  }

  if (folderId) file.folderId = folderId;
  if (name) file.name = name;

  res.json(file);
});

// DELETE evidence document permanently
router.delete("/files/:id", (req: Request, res: Response) => {
  const index = db.evidence.findIndex(f => f.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Evidence file not found" });
    return;
  }

  db.evidence.splice(index, 1);
  res.status(204).send();
});

export default router;
