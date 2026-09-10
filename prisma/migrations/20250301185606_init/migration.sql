-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "businessDetailsId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "businessDetailsId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "businessDetailsId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "businessDetailsId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "businessDetailsId" DROP DEFAULT;
