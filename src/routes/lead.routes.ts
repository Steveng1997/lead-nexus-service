import { Router } from "express";
import {
  getLeads,
  createLead,
  getStats,
  deleteLead,
} from "../controllers/lead.controller.js";

const router = Router();

router.get("/", getLeads);
router.get("/stats", getStats); // ¡Importante! Poner /stats antes de /:id
router.post("/", createLead);
router.delete("/:id", deleteLead);

export default router;
