/*
  Warnings:

  - Changed the type of `logo` on the `BusinessDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BusinessDetails" DROP COLUMN "logo",
ADD COLUMN     "logo" BYTEA NOT NULL;
