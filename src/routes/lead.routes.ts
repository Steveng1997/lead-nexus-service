import { Router } from "express";
import * as leadCtrl from "../controllers/lead.controller.js";
import { getAISummary } from "../controllers/ai.controller.js";

const router = Router();

// Endpoints estáticos
router.get("/", leadCtrl.getLeads);
router.post("/", leadCtrl.createLead);
router.get("/stats", leadCtrl.getStats);

// Aquí usas la función que importaste de ai.controller
router.post("/ai/summary", getAISummary);

// Endpoints dinámicos
router.get("/:id", leadCtrl.getLeadById);
router.patch("/:id", leadCtrl.updateLead);
router.delete("/:id", leadCtrl.deleteLead);

export default router;
