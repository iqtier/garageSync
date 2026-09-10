/*
  Warnings:

  - Made the column `vehicle_id` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `booking_type` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ramp` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Business` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `business_Id` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Made the column `hoursWorked` on table `ClockInOut` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `business_Id` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Made the column `pin` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_vehicle_id_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "vehicle_id" SET NOT NULL,
ALTER COLUMN "booking_type" SET NOT NULL,
ALTER COLUMN "ramp" SET NOT NULL;

-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "business_Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClockInOut" ALTER COLUMN "hoursWorked" SET NOT NULL,
ALTER COLUMN "hoursWorked" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "business_Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "pin" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_business_Id_fkey" FOREIGN KEY ("business_Id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_business_Id_fkey" FOREIGN KEY ("business_Id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
