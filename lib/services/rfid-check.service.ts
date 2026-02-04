"use server";

import { prisma } from "@/lib/prisma";

// Define the type based on the RfidTag table structure from Prisma schema
type RfidTagFromDb = {
  rfidTag: string;
  nik: string | null;
  status: boolean;
  visitor: VisitorFromDb | null;
  locations: RfidTagLocationFromDb[]; // Add locations here
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

// New type for Location for inclusion
type LocationFromDb = {
  id: number;
  name: string;
};

// New type for RfidTagLocation for inclusion
type RfidTagLocationFromDb = {
  rfidTagId: string;
  locationId: number;
  assignedAt: Date;
  location: LocationFromDb; // Include the nested Location
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
        locations: {
          // Include locations
          include: {
            location: true, // Include the Location details
          },
        },
      },
    });

    if (rfidRecord) {
      const transformedVisitor: VisitorFromDb | null = rfidRecord.visitor
        ? {
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
          }
        : null;

      const rfidTagRecord: RfidTagFromDb = {
        rfidTag: rfidRecord.rfidTag,
        nik: rfidRecord.nik,
        status: rfidRecord.status,
        visitor: transformedVisitor,
        locations: rfidRecord.locations.map((rtl) => ({
          // Map over RfidTagLocation
          rfidTagId: rtl.rfidTagId,
          locationId: rtl.locationId,
          assignedAt: rtl.assignedAt,
          location: {
            id: rtl.location.id,
            name: rtl.location.name,
          },
        })),
      };

      // RFID tag exists, return its information
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
