// @ts-nocheck
import { defineConfig } from "@prisma/config";
import path from "path";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    // Usamos ./ para indicar que parta desde la raíz del proyecto
    seed: "npx ts-node ./prisma/seed.ts",
  },
  datasource: {
    url: "postgresql://postgres:test1234@localhost:5432/lead_nexus_db?schema=public",
  },
});
