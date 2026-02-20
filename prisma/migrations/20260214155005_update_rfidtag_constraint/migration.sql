-- DropForeignKey
ALTER TABLE "LogVisitor" DROP CONSTRAINT "LogVisitor_rfidTagId_fkey";

-- AddForeignKey
ALTER TABLE "LogVisitor" ADD CONSTRAINT "LogVisitor_rfidTagId_fkey" FOREIGN KEY ("rfidTagId") REFERENCES "RfidTag"("rfidTag") ON DELETE SET NULL ON UPDATE CASCADE;
