import { Request, Response } from "express";
import { LeadService } from "../services/lead.service.js";
import { AIService } from "../services/ai.service.js";

const leadService = new LeadService();
const aiService = new AIService();

/**
 * Procesa la generación de un resumen ejecutivo basado en inteligencia artificial.
 * Filtra los leads según los criterios del cuerpo de la petición y los envía al servicio de IA.
 * * @endpoint POST /api/leads/ai/summary
 */
export const getAISummary = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { fuente, startDate, endDate } = req.body;

    // 1. Recuperación de datos crudos sin paginación para análisis completo
    const leads = await leadService.getLeadsForAI({
      fuente,
      startDate,
      endDate,
    });

    // 2. Orquestación con el servicio de IA (Mock o Real)
    const summary = await aiService.generateSummary(leads);

    res.status(200).json(summary);
  } catch (error: any) {
    console.error("AI Controller Error:", error.message);
    res.status(500).json({
      error: "Error interno al procesar el resumen inteligente con IA.",
    });
  }
};
