"use server";

import { prisma } from "@/lib/prisma";

export interface CreateVisitorLogInput {
  rfidTag: string;
  location: string | undefined;
  nik: string;
  date?: Date;
}

export async function createVisitorLog(input: CreateVisitorLogInput) {
  try {
    const { rfidTag, location, nik, date = new Date() } = input;

    // Validate required inputs
    if (!rfidTag || !location || !nik) {
      return {
        success: false,
        error: "Missing required fields: rfidTag, location, or nik",
      };
    }

    // Use a transaction to ensure data consistency
    const created = await prisma.$transaction(async (tx) => {
      // Determine the visitType based on the last log entry for this visitor
      let visitType: "IN" | "OUT" = "IN"; // Default to IN for first-time visitors

      const lastLogEntry = await tx.logVisitor.findFirst({
        where: {
          nik: nik,
        },
        orderBy: {
          date: "desc", // Get the most recent entry
        },
        select: {
          visitType: true,
        },
      });

      // If there was a previous log entry, alternate the visitType
      if (lastLogEntry) {
        visitType = lastLogEntry.visitType === "IN" ? "OUT" : "IN";
      }

      // Find or create the location based on the name
      const locationRecord = await tx.location.upsert({
        where: {
          name: location,
        },
        update: {},
        create: {
          name: location,
        },
      });

      // Find or create the RFID tag based on the rfidTag string
      const rfidTagRecord = await tx.rfidTag.upsert({
        where: {
          rfidTag: rfidTag,
        },
        update: {},
        create: {
          rfidTag: rfidTag,
          status: true, // Default status when creating a new RFID tag
        },
      });

      return await tx.logVisitor.create({
        data: {
          date: date,
          locationId: locationRecord.id,
          nik: nik,
          rfidTagId: rfidTagRecord.rfidTag, // Use the rfidTagId field which is the foreign key
          visitType, // Add the determined visitType
        },
      });
    });

    return { success: true, data: created };
  } catch (error) {
    console.error("Failed to create Log Visitor:", error);
    // Return more specific error information based on error type
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while creating visitor log",
    };
  }
}
