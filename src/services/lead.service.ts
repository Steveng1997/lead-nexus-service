import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Configuración de la base de datos utilizando el adaptador de pg para Prisma.
 * Esto permite una mejor gestión del pool de conexiones en entornos PostgreSQL.
 */
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:test1234@localhost:5432/lead_nexus_db?schema=public";

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export class LeadService {
  /**
   * Obtiene una lista paginada de leads con soporte para filtros dinámicos.
   * Cumple con los requerimientos de filtrado por fuente y rango de fechas.
   * * @param page Número de página actual
   * @param limit Cantidad de registros por página
   * @param filters Objeto con filtros opcionales (fuente, startDate, endDate)
   */
  async getAllLeads(page: number = 1, limit: number = 10, filters: any = {}) {
    const skip = (page - 1) * limit;

    // Construcción del objeto 'where' para filtrado dinámico
    const where: any = {
      deletedAt: null, // Excluir registros eliminados (Soft Delete)
      ...(filters.fuente && { fuente: filters.fuente }),
      ...(filters.startDate &&
        filters.endDate && {
          createdAt: {
            gte: new Date(filters.startDate),
            lte: new Date(filters.endDate),
          },
        }),
    };

    try {
      const [data, total] = await Promise.all([
        prisma.lead.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.lead.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error en getAllLeads Service:", error);
      throw new Error("No se pudo recuperar la lista de leads.");
    }
  }

  /**
   * Registra un nuevo lead verificando que el email sea único.
   * Realiza una conversión segura del presupuesto a tipo Float.
   */
  async createLead(data: any) {
    try {
      const existing = await prisma.lead.findUnique({
        where: { email: data.email },
      });

      if (existing) {
        throw new Error("El email ya existe en nuestra base de datos");
      }

      return await prisma.lead.create({
        data: {
          nombre: data.nombre,
          email: data.email,
          fuente: data.fuente,
          telefono: data.telefono,
          producto_interes: data.producto_interes,
          presupuesto: data.presupuesto
            ? parseFloat(data.presupuesto.toString())
            : 0,
        },
      });
    } catch (error) {
      console.error("Error en createLead Service:", error);
      throw error;
    }
  }

  /**
   * Obtiene métricas agregadas para el dashboard ejecutivo.
   * Calcula el total, promedio de presupuesto y distribución por canales.
   */
  async getStats() {
    try {
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
        distribucion_fuentes: groups.map((g) => ({
          fuente: g.fuente,
          cantidad: g._count?._all || 0,
        })),
      };
    } catch (error) {
      console.error("Error en getStats Service:", error);
      throw new Error("Error al calcular estadísticas.");
    }
  }

  /**
   * Obtiene la colección completa de leads filtrados para el análisis de IA.
   * A diferencia de getAllLeads, este método no aplica paginación para permitir
   * que el LLM analice el set de datos completo.
   */
  async getLeadsForAI(filters: any = {}) {
    try {
      return await prisma.lead.findMany({
        where: {
          deletedAt: null,
          ...(filters.fuente && { fuente: filters.fuente }),
          ...(filters.startDate &&
            filters.endDate && {
              createdAt: {
                gte: new Date(filters.startDate),
                lte: new Date(filters.endDate),
              },
            }),
        },
      });
    } catch (error) {
      console.error("Error en getLeadsForAI Service:", error);
      throw error;
    }
  }

  /**
   * Implementación de Soft Delete para preservar la integridad referencial.
   * Marca el registro con una marca de tiempo en 'deletedAt' en lugar de eliminarlo físicamente.
   */
  async softDelete(id: string) {
    try {
      return await prisma.lead.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      console.error("Error en softDelete Service:", error);
      throw new Error(
        "No se pudo procesar la eliminación. Verifique el ID proporcionado.",
      );
    }
  }
}
