/*
  Warnings:

  - You are about to drop the column `businessDetailsId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `businessDetailsId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `businessDetailsId` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `businessDetailsId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `businessDetailsId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BusinessDetails` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `business_Id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_Id` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_Id` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_Id` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_Id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_businessDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_businessDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_businessDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_businessDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_businessDetailsId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "businessDetailsId",
ADD COLUMN     "business_Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "businessDetailsId",
ADD COLUMN     "business_Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "businessDetailsId",
ADD COLUMN     "business_Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "businessDetailsId",
ADD COLUMN     "business_Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "businessDetailsId",
ADD COLUMN     "business_Id" TEXT NOT NULL;

-- DropTable
DROP TABLE "BusinessDetails";

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "logo" BYTEA NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_business_Id_fkey" FOREIGN KEY ("business_Id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_business_Id_fkey" FOREIGN KEY ("business_Id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_business_Id_fkey" FOREIGN KEY ("business_Id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_business_Id_fkey" FOREIGN KEY ("business_Id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_business_Id_fkey" FOREIGN KEY ("business_Id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
