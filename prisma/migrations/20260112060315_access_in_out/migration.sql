/*
  Warnings:

  - You are about to drop the column `access` on the `LogVisitor` table. All the data in the column will be lost.
  - You are about to drop the column `nikVisitor` on the `LogVisitor` table. All the data in the column will be lost.
  - Added the required column `visitType` to the `LogVisitor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VisitType" AS ENUM ('IN', 'OUT');

-- DropForeignKey
ALTER TABLE "LogVisitor" DROP CONSTRAINT "LogVisitor_nikVisitor_fkey";

-- AlterTable
ALTER TABLE "LogVisitor" DROP COLUMN "access",
DROP COLUMN "nikVisitor",
ADD COLUMN     "visitType" "VisitType" NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LogVisitor" ADD CONSTRAINT "LogVisitor_nik_fkey" FOREIGN KEY ("nik") REFERENCES "Visitor"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;
