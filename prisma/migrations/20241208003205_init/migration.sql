-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_customerid_fkey";

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_customerid_fkey" FOREIGN KEY ("customerid") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
