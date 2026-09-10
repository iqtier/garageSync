/*
  Warnings:

  - A unique constraint covering the columns `[pin]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pin" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_pin_key" ON "User"("pin");
