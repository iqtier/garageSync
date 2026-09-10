/*
  Warnings:

  - You are about to drop the column `technician_id` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `Appointment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_vehicleId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "technician_id",
DROP COLUMN "vehicleId",
ADD COLUMN     "appointment_type" TEXT,
ADD COLUMN     "vehicle_id" INTEGER;

-- CreateTable
CREATE TABLE "AppointmentTechnician" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "technicianId" TEXT NOT NULL,

    CONSTRAINT "AppointmentTechnician_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentTechnician_appointmentId_technicianId_key" ON "AppointmentTechnician"("appointmentId", "technicianId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentTechnician" ADD CONSTRAINT "AppointmentTechnician_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentTechnician" ADD CONSTRAINT "AppointmentTechnician_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
