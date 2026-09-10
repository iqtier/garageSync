/*
  Warnings:

  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppointmentTechnician` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_customerid_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentTechnician" DROP CONSTRAINT "AppointmentTechnician_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentTechnician" DROP CONSTRAINT "AppointmentTechnician_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceIdQty" DROP CONSTRAINT "ServiceIdQty_appointmentId_fkey";

-- DropTable
DROP TABLE "Appointment";

-- DropTable
DROP TABLE "AppointmentTechnician";

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "vehicle_id" INTEGER,
    "appointment_type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "note" TEXT NOT NULL DEFAULT '',
    "payment_status" TEXT NOT NULL DEFAULT 'unpaid',
    "payment_method" TEXT NOT NULL DEFAULT 'cash',
    "customerid" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingTechnician" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "technicianId" TEXT NOT NULL,

    CONSTRAINT "BookingTechnician_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookingTechnician_appointmentId_technicianId_key" ON "BookingTechnician"("appointmentId", "technicianId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerid_fkey" FOREIGN KEY ("customerid") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingTechnician" ADD CONSTRAINT "BookingTechnician_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingTechnician" ADD CONSTRAINT "BookingTechnician_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceIdQty" ADD CONSTRAINT "ServiceIdQty_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
