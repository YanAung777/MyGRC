import express from "express";
import projectRoutes from "./routes/projects";
import modelRoutes from "./routes/models";
import riskRoutes from "./routes/risks";
import evidenceRoutes from "./routes/evidence";
import governanceRoutes from "./routes/governance";
import frameworkRoutes from "./routes/frameworks";
import workspaceRoutes from "./routes/workspace";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable JSON parsers and incoming request loggers
app.use(express.json());

// Simplified request logger middleware for SOC 2 tracking
app.use((req, res, next) => {
  console.log(`[HTTP] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Mount GRC Domain REST Routers
app.use("/api/inventory/projects", projectRoutes);
app.use("/api/inventory/models", modelRoutes);
app.use("/api/risks", riskRoutes);
app.use("/api/evidence", evidenceRoutes); // covers both files and folders
app.use("/api/governance", governanceRoutes); // covers policies, trainings, vendors, incidents, and copilot draft
app.use("/api/frameworks", frameworkRoutes);
app.use("/api/workspace", workspaceRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "C&A GRC Backend Engine", timestamp: new Date().toISOString() });
});

// Centralized error handler to catch exceptions and prevent internal trace leaks
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[SERVER EXCEPTION]:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred within the GRC backend application.",
    code: "ERR_BACKEND_CRASH"
  });
});

// Bind and start listening
app.listen(PORT, "0.0.0.0", () => {
  console.log(`==================================================`);
  console.log(` C&A Portal - Mock API Server Running Successfully`);
  console.log(` Bound Address: http://0.0.0.0:${PORT}`);
  console.log(` Target Environment: API-First Development`);
  console.log(`==================================================`);
});
