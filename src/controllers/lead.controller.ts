import { Request, Response } from "express";
import { LeadService } from "../services/lead.service.js";

const leadService = new LeadService();

export const getLeads = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await leadService.getAllLeads(page, limit);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createLead = async (req: Request, res: Response) => {
  try {
    const newLead = await leadService.createLead(req.body);
    res.status(201).json(newLead);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await leadService.getStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    // Forzamos el ID a string para que TS no se queje
    const { id } = req.params;
    await leadService.softDelete(id as string);

    res.json({ message: "Lead eliminado correctamente (Soft Delete)" });
  } catch (error: any) {
    res.status(404).json({ error: "Lead no encontrado" });
  }
};
