import { Request, Response } from "express";
import { LeadService } from "../services/lead.service.js";

const leadService = new LeadService();

/**
 * Obtiene el listado de leads aplicando paginación y filtros opcionales.
 * @endpoint GET /api/leads
 */
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extracción y parseo de parámetros de consulta
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Filtros requeridos por el requerimiento técnico (Parte 1)
    const filters = {
      fuente: req.query.fuente as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    const result = await leadService.getAllLeads(page, limit, filters);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Gestiona la creación de un nuevo prospecto (lead).
 * @endpoint POST /api/leads
 */
export const createLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const newLead = await leadService.createLead(req.body);
    res.status(201).json(newLead);
  } catch (error: any) {
    // Error 400 para fallos de validación (ej. email duplicado)
    res.status(400).json({ error: error.message });
  }
};

/**
 * Recupera métricas generales para visualización en el Dashboard.
 * @endpoint GET /api/leads/stats
 */
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await leadService.getStats();
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Ejecuta una eliminación lógica (Soft Delete) de un lead específico.
 * @endpoint DELETE /api/leads/:id
 */
export const deleteLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Aseguramos que el ID sea tratado como string para compatibilidad con UUID
    await leadService.softDelete(id as string);

    res.status(200).json({
      message:
        "Registro desactivado correctamente. Los datos permanecen en auditoría.",
    });
  } catch (error: any) {
    res
      .status(404)
      .json({
        error: "No se encontró un lead con el identificador proporcionado.",
      });
  }
};
