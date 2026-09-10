/*
  Warnings:

  - You are about to drop the column `description` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "description",
ADD COLUMN     "brand" TEXT;
