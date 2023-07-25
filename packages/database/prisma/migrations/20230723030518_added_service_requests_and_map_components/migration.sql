/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Floor" AS ENUM ('L1', 'L2', 'ONE', 'TWO', 'THREE');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Node" (
    "id" SERIAL NOT NULL,
    "xCoord" INTEGER NOT NULL,
    "yCoord" INTEGER NOT NULL,
    "floor" "Floor" NOT NULL,
    "building" TEXT NOT NULL,
    "location" TEXT,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" SERIAL NOT NULL,
    "startNodeId" INTEGER NOT NULL,
    "endNodeId" INTEGER NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationName" (
    "shortName" TEXT NOT NULL,
    "longName" TEXT NOT NULL,
    "locationType" TEXT NOT NULL,

    CONSTRAINT "LocationName_pkey" PRIMARY KEY ("longName")
);

-- CreateIndex
CREATE UNIQUE INDEX "Node_location_key" ON "Node"("location");

-- CreateIndex
CREATE UNIQUE INDEX "Node_xCoord_yCoord_floor_key" ON "Node"("xCoord", "yCoord", "floor");

-- CreateIndex
CREATE UNIQUE INDEX "LocationName_longName_key" ON "LocationName"("longName");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_location_fkey" FOREIGN KEY ("location") REFERENCES "LocationName"("longName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_startNodeId_fkey" FOREIGN KEY ("startNodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_endNodeId_fkey" FOREIGN KEY ("endNodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
