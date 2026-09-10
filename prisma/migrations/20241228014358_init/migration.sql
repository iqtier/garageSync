/*
  Warnings:

  - You are about to drop the column `partId` on the `InventoryTransaction` table. All the data in the column will be lost.
  - You are about to drop the `Part` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inventoryId` to the `InventoryTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InventoryTransaction" DROP CONSTRAINT "InventoryTransaction_partId_fkey";

-- DropForeignKey
ALTER TABLE "Part" DROP CONSTRAINT "Part_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Part" DROP CONSTRAINT "Part_supplierId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InventoryTransaction" DROP COLUMN "partId",
ADD COLUMN     "inventoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Part";

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" INTEGER NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "retailPrice" DOUBLE PRECISION NOT NULL,
    "quantityOnHand" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT,
    "reorderPoint" INTEGER,
    "supplierId" INTEGER NOT NULL,
    "compatibleVehicles" JSONB,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_sku_key" ON "Inventory"("sku");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
