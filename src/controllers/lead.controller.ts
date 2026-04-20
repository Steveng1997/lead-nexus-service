import { Request, Response } from "express";
import { LeadService } from "../services/lead.service.js";

const leadService = new LeadService();

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await leadService.getAllLeads(page, limit, req.query);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const newLead = await leadService.createLead(req.body);
    res.status(201).json(newLead);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await leadService.getStats();
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ error: "Error al generar métricas." });
  }
};

export const deleteLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    await leadService.softDelete(id as string);
    res.status(200).json({ message: "Lead desactivado correctamente." });
  } catch (error: any) {
    res.status(404).json({ error: "No se pudo encontrar el prospecto." });
  }
};
