import { Router, Request, Response } from "express";
import { db } from "../mockData";
import { GoogleGenAI } from "@google/genai";
import { OrganizationalPolicy, TrainingRecord, Vendor, IncidentRecord } from "../../../src/types";

const router = Router();

// Initialize the Gemini AI SDK client lazily to handle missing API keys gracefully
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required for AI features");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// --- 1. Organizational Policies Endpoints ---

router.get("/policies", (req: Request, res: Response) => {
  res.json(db.policies);
});

router.post("/policies", (req: Request, res: Response) => {
  const { title, status, tags, content } = req.body;
  if (!title) {
    res.status(400).json({ error: "Missing policy title" });
    return;
  }

  const newPolicy: OrganizationalPolicy = {
    id: `pol-${Date.now()}`,
    title,
    status: status || "Draft",
    tags: tags || [],
    teamSize: 1,
    nextReview: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0],
    lastUpdated: new Date().toISOString().split("T")[0],
    content: content || ""
  };

  db.policies.push(newPolicy);
  res.status(201).json(newPolicy);
});

router.put("/policies/:id", (req: Request, res: Response) => {
  const index = db.policies.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Policy not found" });
    return;
  }

  db.policies[index] = {
    ...db.policies[index],
    ...req.body,
    id: db.policies[index].id,
    lastUpdated: new Date().toISOString().split("T")[0]
  };

  res.json(db.policies[index]);
});

router.delete("/policies/:id", (req: Request, res: Response) => {
  const index = db.policies.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Policy not found" });
    return;
  }

  db.policies.splice(index, 1);
  res.status(204).send();
});

// --- 2. Employee Training Curriculum Endpoints ---

router.get("/trainings", (req: Request, res: Response) => {
  res.json(db.trainings);
});

router.post("/trainings", (req: Request, res: Response) => {
  const { name, duration, provider, department, status, peopleCount, description } = req.body;
  if (!name || !provider) {
    res.status(400).json({ error: "Missing name or provider fields" });
    return;
  }

  const newTraining: TrainingRecord = {
    id: `tr-${Date.now()}`,
    name,
    duration: duration || "1 hour",
    provider,
    department: department || "Compliance",
    status: status || "Planned",
    peopleCount: peopleCount || 0,
    description: description || ""
  };

  db.trainings.push(newTraining);
  res.status(201).json(newTraining);
});

router.put("/trainings/:id", (req: Request, res: Response) => {
  const index = db.trainings.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Training record not found" });
    return;
  }

  db.trainings[index] = {
    ...db.trainings[index],
    ...req.body,
    id: db.trainings[index].id
  };

  res.json(db.trainings[index]);
});

router.delete("/trainings/:id", (req: Request, res: Response) => {
  const index = db.trainings.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Training record not found" });
    return;
  }

  db.trainings.splice(index, 1);
  res.status(204).send();
});

// --- 3. Vendor Management Endpoints ---

router.get("/vendors", (req: Request, res: Response) => {
  res.json(db.vendors);
});

router.post("/vendors", (req: Request, res: Response) => {
  const { name, website, projects, score } = req.body;
  if (!name) {
    res.status(400).json({ error: "Missing vendor name" });
    return;
  }

  const newVendor: Vendor = {
    id: `ven-${Date.now()}`,
    name,
    website: website || "",
    projects: projects || "TBD",
    reviewStatus: "Pending",
    score: score || "N/A",
    assignee: "You",
    reviewDate: new Date().toISOString().split("T")[0]
  };

  db.vendors.push(newVendor);
  res.status(201).json(newVendor);
});

router.put("/vendors/:id", (req: Request, res: Response) => {
  const index = db.vendors.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }

  db.vendors[index] = {
    ...db.vendors[index],
    ...req.body,
    id: db.vendors[index].id
  };

  res.json(db.vendors[index]);
});

router.delete("/vendors/:id", (req: Request, res: Response) => {
  const index = db.vendors.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }

  db.vendors.splice(index, 1);
  res.status(204).send();
});

// --- 4. System Incidents Endpoints ---

router.get("/incidents", (req: Request, res: Response) => {
  res.json(db.incidents);
});

router.post("/incidents", (req: Request, res: Response) => {
  const { project, type, severity } = req.body;
  if (!project || !type || !severity) {
    res.status(400).json({ error: "Missing project, type, or severity fields" });
    return;
  }

  const newIncident: IncidentRecord = {
    id: `inc-${Date.now()}`,
    project,
    type,
    severity,
    status: "Open",
    occurred: new Date().toISOString().split("T")[0],
    approvedBy: "Unassigned"
  };

  db.incidents.push(newIncident);
  res.status(201).json(newIncident);
});

router.patch("/incidents/:id", (req: Request, res: Response) => {
  const incident = db.incidents.find(i => i.id === req.params.id);
  if (!incident) {
    res.status(404).json({ error: "Incident log not found" });
    return;
  }

  const { status, approvedBy } = req.body;
  if (status) incident.status = status;
  if (approvedBy) incident.approvedBy = approvedBy;

  res.json(incident);
});

// --- 5. AI Copilot Safe Proxy Endpoint ---

router.post("/copilot/draft-policy", async (req: Request, res: Response) => {
  try {
    const { prompt, chatHistory } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const ai = getAiClient();
    
    // Construct system instructions context
    const systemInstruction = 
      "You are the C&A Copilot, an expert AI GRC consultant specializing in ISO 42001, " +
      "ISO 27001, and NIST AI RMF standards. Draft precise, authoritative, enterprise-ready policies, " +
      "or refine existing templates based on user goals. Always format your response using professional " +
      "markdown with clearly divided sections, purpose statements, operational rules, and metric trackers.";

    // Convert history into Google Gemini API compatible roles
    const contents = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    }

    // Append the active user query
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    // Invoke Gemini 3.5 Flash Model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "No response received from the model.";
    res.json({ text: replyText });
  } catch (error: any) {
    console.error("Gemini Copilot API Integration Error:", error);
    res.status(500).json({ 
      error: "AI Generation Failed", 
      message: error.message || "Failed to communicate with the Gemini API." 
    });
  }
});

export default router;
