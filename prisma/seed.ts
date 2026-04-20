import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:test1234@localhost:5432/lead_nexus_db?schema=public";

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando el seeding de 10 leads requeridos...");

  const leads = [
    {
      nombre: "Lucía Alfonso",
      email: "lucia@example.com",
      fuente: "instagram",
      producto_interes: "Curso Backend",
      presupuesto: 250.5,
    },
    {
      nombre: "Steven Dev",
      email: "steven@example.com",
      fuente: "facebook",
      producto_interes: "Asesoría Tech",
      presupuesto: 500.0,
    },
    {
      nombre: "Juan Perez",
      email: "juan@example.com",
      fuente: "landing_page",
      producto_interes: "Ebook Marketing",
      presupuesto: 50.0,
    },
    {
      nombre: "Maria Garcia",
      email: "maria@example.com",
      fuente: "referido",
      producto_interes: "Curso Backend",
      presupuesto: 300.0,
    },
    {
      nombre: "Carlos Ruiz",
      email: "carlos@example.com",
      fuente: "instagram",
      producto_interes: "Consultoría",
      presupuesto: 1000.0,
    },
    {
      nombre: "Ana López",
      email: "ana@example.com",
      fuente: "facebook",
      producto_interes: "Curso Backend",
      presupuesto: 250.0,
    },
    {
      nombre: "Roberto Gomez",
      email: "roberto@example.com",
      fuente: "otro",
      producto_interes: "Soporte",
      presupuesto: 150.0,
    },
    {
      nombre: "Laura Beltrán",
      email: "laura@example.com",
      fuente: "landing_page",
      producto_interes: "Curso Backend",
      presupuesto: 280.0,
    },
    {
      nombre: "Diego Torres",
      email: "diego@example.com",
      fuente: "instagram",
      producto_interes: "Ebook Marketing",
      presupuesto: 45.0,
    },
    {
      nombre: "Elena Sanz",
      email: "elena@example.com",
      fuente: "referido",
      producto_interes: "Consultoría",
      presupuesto: 900.0,
    },
  ];

  for (const lead of leads) {
    // Usamos upsert para evitar errores si el correo ya existe
    await prisma.lead.upsert({
      where: { email: lead.email },
      update: {}, // No actualiza nada si ya existe
      create: lead,
    });
  }

  console.log("✅ Proceso completado: 10 leads listos en la base de datos.");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
