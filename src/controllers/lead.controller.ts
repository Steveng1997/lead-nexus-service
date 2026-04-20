import { Request, Response } from "express";
import { LeadService } from "../services/lead.service.js";
import { AIService } from "../services/ai.service.js";

const leadService = new LeadService();
const aiService = new AIService();

/**
 * Obtiene la lista paginada de leads activos.
 */
export const getLeads = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await leadService.getAllLeads(page, limit, req.query);
    res.status(200).json(result);
  } catch (error: any) {
    // --- CAMBIO AQUÍ ---
    console.error("ERROR REAL EN EL SERVIDOR:", error); 
    res.status(500).json({ error: error.message }); 
    // -------------------
  }
};

/**
 * Gestiona la creación de nuevos leads con validación previa.
 */
export const createLead = async (req: Request, res: Response) => {
  try {
    if (!req.body.nombre || req.body.nombre.length < 2) {
      return res
        .status(400)
        .json({ error: "El nombre es obligatorio y debe ser válido." });
    }
    const newLead = await leadService.createLead(req.body);
    res.status(201).json(newLead);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Actualiza la información de un prospecto específico.
 */
export const updateLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Validamos existencia antes de actualizar
    const updated = await leadService.updateLead(id as string, req.body);
    res.status(200).json(updated);
  } catch (error: any) {
    res
      .status(404)
      .json({ error: "No se pudo encontrar o actualizar el lead solicitado." });
  }
};

/**
 * Ejecuta la eliminación lógica de un lead por ID.
 */
export const deleteLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await leadService.softDelete(id as string);

    res
      .status(200)
      .json({ message: "Lead desactivado correctamente (Soft Delete)." });
  } catch (error: any) {
    res.status(404).json({ error: "Lead no encontrado para eliminar." });
  }
};

/**
 * Retorna las métricas analíticas para la visualización en el dashboard.
 */
export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await leadService.getStats();
    res.status(200).json(stats);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Error al generar las métricas del sistema." });
  }
};

/**
 * Endpoint de Integración con IA: Consume datos filtrados y genera un resumen narrativo.
 */
export const getAISummary = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Usamos req.query o req.body según cómo definas tu ruta
    const filters = Object.keys(req.body).length > 0 ? req.body : req.query;
    const leads = await leadService.getLeadsForAI(filters);
    const summary = await aiService.generateSummary(leads);
    res.status(200).json(summary);
  } catch (error: any) {
    res.status(500).json({
      error: "Error en el procesamiento de datos por el motor de IA.",
    });
  }
};
