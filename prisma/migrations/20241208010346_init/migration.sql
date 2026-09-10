-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_customerid_fkey";

-- DropForeignKey
ALTER TABLE "ServiceIdQty" DROP CONSTRAINT "ServiceIdQty_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceIdQty" DROP CONSTRAINT "ServiceIdQty_serviceId_fkey";

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_customerid_fkey" FOREIGN KEY ("customerid") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceIdQty" ADD CONSTRAINT "ServiceIdQty_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceIdQty" ADD CONSTRAINT "ServiceIdQty_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
