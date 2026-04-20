import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. Configuramos la conexión
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export class LeadService {
  /**
   * Parte 1: Listado de leads con paginación y filtros.
   */
  async getAllLeads(page: number = 1, limit: number = 10, filters: any = {}) {
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null, // Solo registros activos
      ...(filters.fuente && { fuente: filters.fuente }),
      ...(filters.startDate &&
        filters.endDate && {
          createdAt: {
            gte: new Date(filters.startDate),
            lte: new Date(filters.endDate),
          },
        }),
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

  /**
   * Parte 2: Creación de un nuevo prospecto.
   */
  async createLead(data: any) {
    const existing = await prisma.lead.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new Error("El correo electrónico ya está registrado.");

    return await prisma.lead.create({
      data: {
        ...data,
        presupuesto: data.presupuesto
          ? parseFloat(data.presupuesto.toString())
          : 0,
      },
    });
  }

  /**
   * Parte 4: Eliminación lógica (Soft Delete).
   */
  async softDelete(id: string) {
    return await prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Parte 5: Métricas generales para el Dashboard.
   */
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
      promedio_presupuesto: Number(agg._avg?.presupuesto?.toFixed(2)) || 0,
      distribucion: groups.map((g) => ({
        fuente: g.fuente,
        cantidad: g._count._all,
      })),
    };
  }

  /**
   * Parte 3: Recuperación de datos crudos para la IA.
   */
  async getLeadsForAI(filters: any) {
    return await prisma.lead.findMany({
      where: {
        deletedAt: null,
        ...(filters.fuente && { fuente: filters.fuente }),
      },
    });
  }
}
