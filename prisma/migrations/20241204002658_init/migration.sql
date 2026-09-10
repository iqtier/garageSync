-- AddForeignKey
ALTER TABLE "ServiceIdQty" ADD CONSTRAINT "ServiceIdQty_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
