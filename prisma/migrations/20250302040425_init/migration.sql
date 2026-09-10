-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_business_Id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "business_Id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_business_Id_fkey" FOREIGN KEY ("business_Id") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;
