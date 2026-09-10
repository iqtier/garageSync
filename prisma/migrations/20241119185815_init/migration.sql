/*
  Warnings:

  - You are about to drop the column `basePrice` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Car` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompletedTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OilChange` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TireChange` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedTask" DROP CONSTRAINT "CompletedTask_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedTask" DROP CONSTRAINT "CompletedTask_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "OilChange" DROP CONSTRAINT "OilChange_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "TireChange" DROP CONSTRAINT "TireChange_serviceId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "basePrice",
DROP COLUMN "description",
DROP COLUMN "duration",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "Car";

-- DropTable
DROP TABLE "CompletedTask";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Inventory";

-- DropTable
DROP TABLE "OilChange";

-- DropTable
DROP TABLE "TireChange";

-- CreateTable
CREATE TABLE "ServiceFields" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ServiceFields_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceFields" ADD CONSTRAINT "ServiceFields_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
