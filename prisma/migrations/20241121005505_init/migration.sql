-- DropForeignKey
ALTER TABLE "ServiceFields" DROP CONSTRAINT "ServiceFields_serviceId_fkey";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "ServiceFields" ADD CONSTRAINT "ServiceFields_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
