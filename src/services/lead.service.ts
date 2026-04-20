import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Validación de seguridad para evitar errores de conexión
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "❌ Error: DATABASE_URL no definida. Verifica tu archivo .env",
  );
}

/**
 * Configuración del Pool utilizando el connectionString directamente.
 * Evitamos pasar un objeto complejo para que el driver no falle al parsear credenciales.
 */
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * LeadService: Centraliza la lógica de persistencia y analítica.
 */
export class LeadService {
  async getAllLeads(page: number = 1, limit: number = 10, filters: any = {}) {
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
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

  async updateLead(id: string, data: any) {
    // Nota: El update no requiere borrado previo.
    return await prisma.lead.update({
      where: { id },
      data: {
        ...data,
        ...(data.presupuesto && {
          presupuesto: parseFloat(data.presupuesto.toString()),
        }),
      },
    });
  }

  async softDelete(id: string) {
    return await prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStats() {
    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

    const [total, groups, agg, recientes] = await Promise.all([
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
      prisma.lead.count({
        where: { deletedAt: null, createdAt: { gte: sieteDiasAtras } },
      }),
    ]);

    return {
      total_leads: total,
      leads_ultimos_7_dias: recientes,
      promedio_presupuesto: Number(agg._avg?.presupuesto?.toFixed(2)) || 0,
      distribucion: groups.map((g: any) => ({
        fuente: g.fuente,
        cantidad: g._count._all,
      })),
    };
  }

  async getLeadsForAI(filters: any) {
    return await prisma.lead.findMany({
      where: {
        deletedAt: null,
        ...(filters.fuente && { fuente: filters.fuente }),
      },
      take: 50,
    });
  }
}
