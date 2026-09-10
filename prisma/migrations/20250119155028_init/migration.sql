/*
  Warnings:

  - Made the column `compatibleVehicles` on table `Inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "compatibleVehicles" SET NOT NULL,
ALTER COLUMN "compatibleVehicles" SET DATA TYPE TEXT;
