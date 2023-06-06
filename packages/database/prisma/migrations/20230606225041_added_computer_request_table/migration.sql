-- CreateTable
CREATE TABLE "ComputerRequest" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "staff" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "ComputerRequest_pkey" PRIMARY KEY ("id")
);
