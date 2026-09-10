/*
  Warnings:

  - You are about to drop the column `appointment_type` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentId` on the `BookingTechnician` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentId` on the `ServiceIdQty` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId,technicianId]` on the table `BookingTechnician` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `BookingTechnician` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingId` to the `ServiceIdQty` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookingTechnician" DROP CONSTRAINT "BookingTechnician_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceIdQty" DROP CONSTRAINT "ServiceIdQty_appointmentId_fkey";

-- DropIndex
DROP INDEX "BookingTechnician_appointmentId_technicianId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "appointment_type",
ADD COLUMN     "booking_type" TEXT;

-- AlterTable
ALTER TABLE "BookingTechnician" DROP COLUMN "appointmentId",
ADD COLUMN     "bookingId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ServiceIdQty" DROP COLUMN "appointmentId",
ADD COLUMN     "bookingId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BookingTechnician_bookingId_technicianId_key" ON "BookingTechnician"("bookingId", "technicianId");

-- AddForeignKey
ALTER TABLE "BookingTechnician" ADD CONSTRAINT "BookingTechnician_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceIdQty" ADD CONSTRAINT "ServiceIdQty_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
