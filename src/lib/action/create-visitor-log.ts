"use server";

import { prisma } from "@/lib/prisma";

export interface CreateVisitorLogInput {
  rfidTag: string;
  location: string;
  nik: string;
  date?: Date;
}

export async function createVisitorLog(input: CreateVisitorLogInput) {
  try {
    const { rfidTag, location, nik, date = new Date() } = input;

    // Determine the visitType based on the last log entry for this visitor
    let visitType: "IN" | "OUT" = "IN"; // Default to IN for first-time visitors

    const lastLogEntry = await prisma.logVisitor.findFirst({
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

    const created = await prisma.logVisitor.create({
      data: {
        date: date,
        location: location,
        nik: nik,
        rfidTagId: rfidTag,
        rfidTag: rfidTag,
        visitType, // Add the determined visitType
      },
    });

    return { success: true, data: created };
  } catch (error) {
    console.error("Failed to create Log Visitor :", error);
    return { success: false, error: "Create failed" };
  }
}

// Function to get cached RFID events (would connect to Redis in production)
export async function getCachedRFIDEvents() {
  // This is a placeholder - in production, this would fetch from Redis or similar cache
  // For now, returning an empty array since we're using in-memory cache in the context
  return [];
}

// Function to get the latest RFID event
export async function getLatestRFIDEvent() {
  // This would fetch from Redis or similar cache in production
  // For now, this would need to come from the MQTT context state
  return null;
}
