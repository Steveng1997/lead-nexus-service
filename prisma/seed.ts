// @ts-nocheck
const { PrismaClient } = require("@prisma/client");

// En Prisma 7, si el esquema está vacío, se debe pasar así:
const prisma = new PrismaClient({
  datasourceUrl:
    "postgresql://postgres:test1234@localhost:5432/lead_nexus_db?schema=public",
});

async function main() {
  console.log("🚀 Iniciando seed...");
  const leads = [
    {
      nombre: "Juan Perez",
      email: "juan@example.com",
      fuente: "Web",
      producto_interes: "Software A",
    },
    {
      nombre: "Maria Lopez",
      email: "maria@example.com",
      fuente: "LinkedIn",
      producto_interes: "Software B",
    },
    {
      nombre: "Carlos Ruiz",
      email: "cruiz@example.com",
      fuente: "Referido",
      producto_interes: "Servicio Cloud",
    },
    {
      nombre: "Ana Gomez",
      email: "agomez@example.com",
      fuente: "Web",
      producto_interes: "Software A",
    },
    {
      nombre: "Luis Prada",
      email: "lprada@example.com",
      fuente: "Instagram",
      producto_interes: "Consultoría",
    },
    {
      nombre: "Elena Mora",
      email: "emora@example.com",
      fuente: "Web",
      producto_interes: "Software B",
    },
    {
      nombre: "Pedro Diaz",
      email: "pdiaz@example.com",
      fuente: "LinkedIn",
      producto_interes: "Software A",
    },
    {
      nombre: "Sonia Vega",
      email: "svega@example.com",
      fuente: "Web",
      producto_interes: "Software C",
    },
    {
      nombre: "Jorge Tovar",
      email: "jtovar@example.com",
      fuente: "Referido",
      producto_interes: "Software B",
    },
    {
      nombre: "Lucia Rios",
      email: "lrios@example.com",
      fuente: "LinkedIn",
      producto_interes: "Software A",
    },
  ];

  for (const lead of leads) {
    await prisma.lead.upsert({
      where: { email: lead.email },
      update: {},
      create: lead,
    });
  }
  console.log("✅ Seed finalizado: 10 leads creados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
