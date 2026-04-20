import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:test1234@localhost:5432/lead_nexus_db?schema=public";

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export class LeadService {
  /**
   * Obtiene leads paginados que no han sido borrados
   */
  async getAllLeads(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    try {
      const [data, total] = await Promise.all([
        prisma.lead.findMany({
          // Filtramos por registros cuya fecha de borrado sea nula
          where: { deletedAt: null },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.lead.count({
          where: { deletedAt: null },
        }),
      ]);

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error en getAllLeads:", error);
      throw error;
    }
  }

  /**
   * Crea un lead validando unicidad de email
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
      console.error("Error en createLead:", error);
      throw error;
    }
  }

  /**
   * Genera estadísticas agregadas para el dashboard
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
        // .toFixed(2) para que el promedio se vea profesional (ej: 250.50)
        promedio_presupuesto: Number(agg._avg?.presupuesto?.toFixed(2)) || 0,
        distribucion_fuentes: groups.map((g) => ({
          fuente: g.fuente,
          // Acceso seguro al conteo autogenerado por Prisma
          cantidad: g._count?._all || 0,
        })),
      };
    } catch (error) {
      console.error("Error en getStats:", error);
      throw error;
    }
  }

  /**
   * Soft Delete: Actualiza el campo deletedAt en lugar de borrar la fila
   */
  async softDelete(id: string) {
    try {
      // Verificamos primero si existe para dar un error claro si no
      return await prisma.lead.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      console.error("Error en softDelete:", error);
      throw new Error("No se pudo eliminar el lead. El ID no existe.");
    }
  }
}
