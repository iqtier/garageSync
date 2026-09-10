/*
  Warnings:

  - You are about to drop the `Car` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_customerId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "note" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "payment_method" TEXT NOT NULL DEFAULT 'cash',
ADD COLUMN     "payment_status" TEXT NOT NULL DEFAULT 'unpaid',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "technician_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "vehicle_id" INTEGER;

-- DropTable
DROP TABLE "Car";

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
