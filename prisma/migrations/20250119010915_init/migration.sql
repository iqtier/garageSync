/*
  Warnings:

  - You are about to drop the column `supplierId` on the `Inventory` table. All the data in the column will be lost.
  - Added the required column `supplierId` to the `InventoryTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_supplierId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "compatibleVehicles" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fields" TEXT[];

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "supplierId";

-- AlterTable
ALTER TABLE "InventoryTransaction" ADD COLUMN     "supplierId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "InventoryFields" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "inventoryId" INTEGER NOT NULL,

    CONSTRAINT "InventoryFields_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InventoryFields" ADD CONSTRAINT "InventoryFields_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
