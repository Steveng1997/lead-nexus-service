import { Router } from "express";
import * as leadCtrl from "../controllers/lead.controller.js";
import { getAISummary } from "../controllers/ai.controller.js";

const router = Router();

router.get("/", leadCtrl.getLeads);
router.post("/", leadCtrl.createLead);
router.get("/stats", leadCtrl.getStats);
router.delete("/:id", leadCtrl.deleteLead);

// Endpoint de IA
router.post("/ai/summary", getAISummary);

export default router;
