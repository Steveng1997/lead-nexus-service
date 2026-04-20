import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export class LeadService {
  async getAllLeads(page: number, limit: number, filters: any) {
    const skip = (page - 1) * limit;
    const where: any = {
      deletedAt: null,
      ...(filters.fuente && { fuente: filters.fuente }),
    };

    const [data, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.count({ where }),
    ]);
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async getLeadById(id: string) {
    return await prisma.lead.findFirst({ where: { id, deletedAt: null } });
  }

  // Método requerido para la parte 3 de la prueba
  async getLeadsForAI(filters: any) {
    return await prisma.lead.findMany({
      where: { deletedAt: null, ...filters },
    });
  }

  async createLead(data: any) {
    if (await prisma.lead.findUnique({ where: { email: data.email } }))
      throw new Error("Email duplicado.");
    return await prisma.lead.create({ data });
  }

  async updateLead(id: string, data: any) {
    return await prisma.lead.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return await prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStats() {
    const [total, groups, agg] = await Promise.all([
      prisma.lead.count({ where: { deletedAt: null } }),
      prisma.lead.groupBy({
        by: ["fuente"],
        _count: { _all: true },
        where: { deletedAt: null },
      }),
      prisma.lead.aggregate({
        _avg: { presupuesto: true },
        where: { deletedAt: null },
      }),
    ]);
    return {
      total_leads: total,
      promedio_presupuesto: agg._avg.presupuesto,
      distribucion: groups,
    };
  }
}
