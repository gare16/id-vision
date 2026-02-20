-- Update the rfidTagId column to allow NULL values
-- This addresses the issue where the foreign key constraint sets NULL on delete
-- but the column itself doesn't allow NULL values

-- First, update any existing records that might have issues
-- Then alter the column to allow NULL
ALTER TABLE "LogVisitor" ALTER COLUMN "rfidTagId" DROP NOT NULL;