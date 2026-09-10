/*
  Warnings:

  - You are about to drop the column `cost` on the `UsedInventory` table. All the data in the column will be lost.
  - Added the required column `includedWithService` to the `UsedInventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsedInventory" DROP COLUMN "cost",
ADD COLUMN     "includedWithService" BOOLEAN NOT NULL;
