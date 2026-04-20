import { Request, Response } from "express";
import { LeadService } from "../services/lead.service.js";
import { AIService } from "../services/ai.service.js";

const leadService = new LeadService();
const aiService = new AIService();

/**
 * Obtiene el listado de leads con paginación y filtros opcionales.
 */
export const getLeads = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = req.query;
    res.json(await leadService.getAllLeads(page, limit, filters));
  } catch (error) {
    res.status(500).json({ error: "Error al listar los leads." });
  }
};

/**
 * Obtiene un lead específico por su ID.
 */
export const getLeadById = async (req: Request, res: Response) => {
  try {
    const lead = await leadService.getLeadById(req.params.id as string);
    lead
      ? res.json(lead)
      : res.status(404).json({ error: "Lead no encontrado." });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el lead." });
  }
};

/**
 * Registra un nuevo lead en el sistema.
 */
export const createLead = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await leadService.createLead(req.body));
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error al crear lead." });
  }
};

/**
 * Actualiza la información de un lead existente.
 */
export const updateLead = async (req: Request, res: Response) => {
  try {
    res.json(await leadService.updateLead(req.params.id as string, req.body));
  } catch (error) {
    res.status(404).json({ error: "No se pudo actualizar el lead." });
  }
};

/**
 * Realiza un Soft Delete (eliminación lógica) de un lead.
 */
export const deleteLead = async (req: Request, res: Response) => {
  try {
    await leadService.softDelete(req.params.id as string);
    res.json({ message: "Lead eliminado correctamente." });
  } catch (error) {
    res.status(404).json({ error: "Lead no encontrado." });
  }
};

/**
 * Retorna estadísticas clave de los leads.
 */
export const getStats = async (_req: Request, res: Response) => {
  try {
    res.json(await leadService.getStats());
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estadísticas." });
  }
};

/**
 * Integra el análisis de IA sobre el conjunto de leads filtrado.
 */
export const getAISummary = async (req: Request, res: Response) => {
  try {
    const leads = await leadService.getLeadsForAI(req.body);
    const summary = await aiService.generateSummary(leads);
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: "Error en el procesamiento de IA." });
  }
};
