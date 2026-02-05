/*
  Warnings:

  - You are about to drop the column `mealsLeft` on the `accomodationDetails` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('Entry', 'Exit');

-- AlterTable
ALTER TABLE "accomodationDetails" DROP COLUMN "mealsLeft",
ADD COLUMN     "mealTaken" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "messEntry" (
    "id" SERIAL NOT NULL,
    "accomodationDetailsId" UUID NOT NULL,
    "mealsLeft" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gateEntry" (
    "id" SERIAL NOT NULL,
    "accomodationDetailsId" UUID NOT NULL,
    "entryType" "EntryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gateEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostelEntry" (
    "id" SERIAL NOT NULL,
    "accomodationDetailsId" UUID NOT NULL,
    "entryType" "EntryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hostelEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messEntry" ADD CONSTRAINT "messEntry_accomodationDetailsId_fkey" FOREIGN KEY ("accomodationDetailsId") REFERENCES "accomodationDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateEntry" ADD CONSTRAINT "gateEntry_accomodationDetailsId_fkey" FOREIGN KEY ("accomodationDetailsId") REFERENCES "accomodationDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostelEntry" ADD CONSTRAINT "hostelEntry_accomodationDetailsId_fkey" FOREIGN KEY ("accomodationDetailsId") REFERENCES "accomodationDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
