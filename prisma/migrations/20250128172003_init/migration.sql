-- CreateTable
CREATE TABLE "ClockInOut" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clockIn" TIMESTAMP(3) NOT NULL,
    "clockOut" TIMESTAMP(3),
    "hoursWorked" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClockInOut_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClockInOut" ADD CONSTRAINT "ClockInOut_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
