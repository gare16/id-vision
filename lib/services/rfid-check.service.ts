"use server";

import { prisma } from "@/lib/prisma";

// Define the type based on the RfidTag table structure from Prisma schema
type RfidTagFromDb = {
  rfidTag: string;
  nik: string | null;
  status: boolean;
  visitor: VisitorFromDb | null;
};

// Define the type based on the Visitor table structure from Prisma schema
type VisitorFromDb = {
  id: number;
  nik: string;
  name: string;
  address: string;
  birthInfo: string;
  nationality: string | null;
  phoneNumber: string | null;
  organization: string | null;
  visitingPurpose: string | null;
  placeDestination: string | null;
  vehicleNumber: string | null;
};

/**
 * Checks if an RFID tag exists in the database and returns the RFID tag record
 * @param rfidTag The RFID tag to check
 * @returns Object containing whether the RFID exists, the RFID tag record, and status
 */
export async function checkRfidInDatabase(rfidTag: string): Promise<{
  exists: boolean;
  rfidTagRecord: RfidTagFromDb | null;
  status: "success" | "error" | "invalid";
}> {
  try {
    // Validate input
    if (!rfidTag || typeof rfidTag !== "string" || rfidTag.trim() === "") {
      console.error("Invalid RFID tag provided:", rfidTag);
      return {
        exists: false,
        rfidTagRecord: null,
        status: "invalid",
      };
    }

    // Check if the RFID tag exists in the RfidTag table
    const rfidRecord = await prisma.rfidTag.findUnique({
      where: {
        rfidTag: rfidTag.trim(),
      },
      include: {
        visitor: true, // Include visitor information if associated
      },
    });

    if (rfidRecord && rfidRecord.visitor) {
      // RFID tag exists and has an associated visitor, return the visitor info
      // Transform the Prisma result to match the expected VisitorFromDb type
      const transformedVisitor: VisitorFromDb = {
        id: rfidRecord.visitor.id,
        nik: rfidRecord.visitor.nik,
        name: rfidRecord.visitor.name,
        address: rfidRecord.visitor.address,
        birthInfo: rfidRecord.visitor.birthInfo,
        nationality: rfidRecord.visitor.nationality,
        phoneNumber: rfidRecord.visitor.phoneNumber,
        organization: rfidRecord.visitor.organization,
        visitingPurpose: rfidRecord.visitor.visitingPurpose,
        placeDestination: rfidRecord.visitor.placeDestination,
        vehicleNumber: rfidRecord.visitor.vehicleNumber,
      };

      // Create the complete RFID tag record to return
      const rfidTagRecord: RfidTagFromDb = {
        rfidTag: rfidRecord.rfidTag,
        nik: rfidRecord.nik,
        status: rfidRecord.status,
        visitor: transformedVisitor,
      };

      return {
        exists: true,
        rfidTagRecord: rfidTagRecord,
        status: "success",
      };
    } else {
      // RFID tag does not exist
      return {
        exists: false,
        rfidTagRecord: null,
        status: "success",
      };
    }
  } catch (error) {
    console.error("Database error checking RFID:", error);
    return {
      exists: false,
      rfidTagRecord: null,
      status: "error",
    };
  }
}
