/*
  Warnings:

  - Added the required column `businessDetailsId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessDetailsId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessDetailsId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessDetailsId` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessDetailsId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "businessDetailsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "businessDetailsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "businessDetailsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "businessDetailsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "businessDetailsId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_businessDetailsId_fkey" FOREIGN KEY ("businessDetailsId") REFERENCES "BusinessDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_businessDetailsId_fkey" FOREIGN KEY ("businessDetailsId") REFERENCES "BusinessDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_businessDetailsId_fkey" FOREIGN KEY ("businessDetailsId") REFERENCES "BusinessDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_businessDetailsId_fkey" FOREIGN KEY ("businessDetailsId") REFERENCES "BusinessDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_businessDetailsId_fkey" FOREIGN KEY ("businessDetailsId") REFERENCES "BusinessDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
