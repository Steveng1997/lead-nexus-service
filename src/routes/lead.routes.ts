import { Router } from "express";
import {
  getLeads,
  createLead,
  getStats,
  deleteLead,
} from "../controllers/lead.controller.js";

import { getAISummary } from "../controllers/ai.controller.js";

const router = Router();

// Endpoints básicos
router.get("/", getLeads);
router.get("/stats", getStats);
router.post("/", createLead);
router.delete("/:id", deleteLead);

// Endpoint de IA (Parte 3)
router.post("/ai/summary", getAISummary);

export default router;
