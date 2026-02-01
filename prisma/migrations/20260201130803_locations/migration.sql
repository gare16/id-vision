-- CreateEnum
CREATE TYPE "VisitType" AS ENUM ('IN', 'OUT');

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" SERIAL NOT NULL,
    "nik" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birthInfo" TEXT NOT NULL,
    "nationality" TEXT,
    "phoneNumber" TEXT,
    "organization" TEXT,
    "visitingPurpose" TEXT,
    "placeDestination" TEXT,
    "vehicleNumber" TEXT,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfidTag" (
    "rfidTag" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "nik" TEXT,

    CONSTRAINT "RfidTag_pkey" PRIMARY KEY ("rfidTag")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfidTagLocation" (
    "rfidTagId" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RfidTagLocation_pkey" PRIMARY KEY ("rfidTagId","locationId")
);

-- CreateTable
CREATE TABLE "LogVisitor" (
    "id" SERIAL NOT NULL,
    "nik" TEXT NOT NULL,
    "rfidTagId" TEXT NOT NULL,
    "locationId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitType" "VisitType" NOT NULL,

    CONSTRAINT "LogVisitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_nik_key" ON "Visitor"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- AddForeignKey
ALTER TABLE "RfidTag" ADD CONSTRAINT "RfidTag_nik_fkey" FOREIGN KEY ("nik") REFERENCES "Visitor"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfidTagLocation" ADD CONSTRAINT "RfidTagLocation_rfidTagId_fkey" FOREIGN KEY ("rfidTagId") REFERENCES "RfidTag"("rfidTag") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfidTagLocation" ADD CONSTRAINT "RfidTagLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogVisitor" ADD CONSTRAINT "LogVisitor_nik_fkey" FOREIGN KEY ("nik") REFERENCES "Visitor"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogVisitor" ADD CONSTRAINT "LogVisitor_rfidTagId_fkey" FOREIGN KEY ("rfidTagId") REFERENCES "RfidTag"("rfidTag") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogVisitor" ADD CONSTRAINT "LogVisitor_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
