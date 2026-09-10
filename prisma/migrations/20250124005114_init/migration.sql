-- DropForeignKey
ALTER TABLE "InventoryFields" DROP CONSTRAINT "InventoryFields_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransaction" DROP CONSTRAINT "InventoryTransaction_inventoryId_fkey";

-- CreateTable
CREATE TABLE "UsedInventory" (
    "id" SERIAL NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "transactionType" TEXT NOT NULL,

    CONSTRAINT "UsedInventory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InventoryFields" ADD CONSTRAINT "InventoryFields_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedInventory" ADD CONSTRAINT "UsedInventory_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedInventory" ADD CONSTRAINT "UsedInventory_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
