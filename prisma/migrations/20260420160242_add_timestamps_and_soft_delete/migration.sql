/*
  Warnings:

  - You are about to drop the `leads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "leads";

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "fuente" TEXT NOT NULL,
    "producto_interes" TEXT,
    "presupuesto" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");
