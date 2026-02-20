-- DropForeignKey
ALTER TABLE "RfidTag" DROP CONSTRAINT "RfidTag_nik_fkey";

-- AddForeignKey
ALTER TABLE "RfidTag" ADD CONSTRAINT "RfidTag_nik_fkey" FOREIGN KEY ("nik") REFERENCES "Visitor"("nik") ON DELETE NO ACTION ON UPDATE CASCADE;
