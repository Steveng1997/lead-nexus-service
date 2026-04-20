import { Request, Response } from "express";
import { LeadService } from "../services/lead.service.js";
import { AIService } from "../services/ai.service.js";

const leadService = new LeadService();
const aiService = new AIService();

export const getAISummary = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const leads = await leadService.getLeadsForAI(req.body);
    const summary = await aiService.generateSummary(leads);
    res.status(200).json(summary);
  } catch (error: any) {
    res.status(500).json({ error: "Error en el procesamiento de IA." });
  }
};
