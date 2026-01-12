-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "LogVisitor" (
    "idLog" SERIAL NOT NULL,
    "rfidTag" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "access" BOOLEAN NOT NULL,
    "location" TEXT NOT NULL,
    "rfidTagId" TEXT NOT NULL,
    "nikVisitor" TEXT NOT NULL,

    CONSTRAINT "LogVisitor_pkey" PRIMARY KEY ("idLog")
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
    "personToVisit" TEXT,
    "vehicleNumber" TEXT,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfidTag" (
    "rfidTag" TEXT NOT NULL,
    "nik" TEXT,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "RfidTag_pkey" PRIMARY KEY ("rfidTag")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_nik_key" ON "Visitor"("nik");

-- AddForeignKey
ALTER TABLE "LogVisitor" ADD CONSTRAINT "LogVisitor_nikVisitor_fkey" FOREIGN KEY ("nikVisitor") REFERENCES "Visitor"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogVisitor" ADD CONSTRAINT "LogVisitor_rfidTagId_fkey" FOREIGN KEY ("rfidTagId") REFERENCES "RfidTag"("rfidTag") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfidTag" ADD CONSTRAINT "RfidTag_nik_fkey" FOREIGN KEY ("nik") REFERENCES "Visitor"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;
