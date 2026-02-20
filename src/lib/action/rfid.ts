"use server";

import { subDays, startOfDay, endOfDay } from "date-fns";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

// Function for the RFID Tag page that returns full data structure
export async function getRfidTagForTable() {
  const res = await prisma.rfidTag.findMany({
    select: {
      Visitor: {
        select: {
          id: true,
          nik: true,
          name: true,
          address: true,
          birthInfo: true,
          nationality: true,
          phoneNumber: true,
          organization: true,
          visitingPurpose: true,
          placeDestination: true,
          vehicleNumber: true,
        },
      },
      status: true,
      rfidTag: true,
      nik: true,
      RfidTagLocation: {
        select: {
          locationId: true,
          Location: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  return res;
}

// Function for the SheetEditRFIDTag component that returns simplified data structure
export async function getRfidTag() {
  const res = await prisma.rfidTag.findMany({
    select: {
      Visitor: {
        select: {
          id: true,
          nik: true,
          name: true,
          address: true,
          birthInfo: true,
          nationality: true,
          phoneNumber: true,
          organization: true,
          visitingPurpose: true,
          placeDestination: true,
          vehicleNumber: true,
        },
      },
      status: true,
      rfidTag: true,
      nik: true,
      RfidTagLocation: {
        select: {
          locationId: true,
          Location: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  // Transform the data to match the expected format
  return res.map((item) => ({
    rfidTag: item.rfidTag,
    nik: item.nik,
    status: item.status,
    visitor: item.Visitor
      ? {
          name: item.Visitor.name,
        }
      : null,
    locations: item.RfidTagLocation
      ? item.RfidTagLocation.map((location) => ({
          location: {
            id: location.locationId,
            name: location.Location.name,
          },
        }))
      : undefined,
  }));
}

export async function getDataSummaryCard() {
  const [active, inactive, visitors, logsToday, logsYesterday] =
    await Promise.all([
      prisma.rfidTag.findMany({ where: { status: true } }),
      prisma.rfidTag.findMany({ where: { status: false } }),
      prisma.visitor.findMany(),
      prisma.logVisitor.count({
        where: {
          date: {
            gte: startOfDay(new Date()),
            lte: endOfDay(new Date()),
          },
        },
      }),
      prisma.logVisitor.count({
        where: {
          date: {
            gte: startOfDay(subDays(new Date(), 1)),
            lte: endOfDay(subDays(new Date(), 1)),
          },
        },
      }),
    ]);

  const percentageChange =
    logsYesterday === 0
      ? "0%"
      : `${(((logsToday - logsYesterday) / logsYesterday) * 100).toFixed(1)}%`;

  const trendStatus =
    logsToday > logsYesterday
      ? "up"
      : logsToday < logsYesterday
        ? "down"
        : "stable";

  return [
    {
      id: "visitor",
      title: "Total Visitors",
      value: String(visitors.length),
      description: "Registered in system",
      footerText: "Visitor count in system",
      status: "user",
    },
    {
      id: "visitorLogs",
      title: "Daily Log Visitor",
      value: String(logsToday),
      description: `Compared to yesterday`,
      percentage: percentageChange,
      footerText: "Daily log trend",
      status: trendStatus,
    },
    {
      id: "activeTags",
      title: "Active RFID Tags",
      value: String(active.length),
      description: "Available for use",
      footerText: "Most tags are active",
      status: "active",
    },
    {
      id: "inactiveTags",
      title: "Inactive RFID Tags",
      value: String(inactive.length),
      description: "Cannot be used at the moment",
      footerText: "Check for faulty or missing tags",
      status: "inactive",
    },
  ];
}

export async function createRfidTag({
  rfid_tag,
  status,
}: {
  rfid_tag: string;
  status: boolean;
}) {
  try {
    const created = await prisma.rfidTag.create({
      data: { rfidTag: rfid_tag, status },
    });
    return { success: true, data: created };
  } catch (error) {
    console.log("Failed to create RFID Tag: ", error);
    return { success: false, error: "Create failed" };
  }
}

export async function updateRfidTag({
  rfid_tag,
  nik,
  status,
}: {
  rfid_tag: string;
  nik: string;
  status: boolean;
}) {
  try {
    const updated = await prisma.rfidTag.update({
      where: { rfidTag: rfid_tag },
      data: { status, nik },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update RFID tag:", error);
    return { success: false, error: "Update failed" };
  }
}

export async function deleteRfidTag({ rfid_tag }: { rfid_tag: string }) {
  try {
    // Delete the RFID tag - Prisma should handle the referential action automatically
    // due to onDelete: SetNull in the schema
    const deleted = await prisma.rfidTag.delete({
      where: { rfidTag: rfid_tag },
    });
    revalidatePath("/rfid-tag");
    return { success: true, data: deleted };
  } catch (error) {
    console.error("Failed to delete RFID tag:", error);
    return { success: false, error: "Delete failed" };
  }
}

export async function createLogVisitor({
  data,
}: {
  data: {
    access: boolean;
    date: Date;
    location: string;
    nik: string;
    rfid_tag: string;
  };
}) {
  try {
    // Find the location by name to get its ID
    const location = await prisma.location.findUnique({
      where: { name: data.location },
    });

    if (!location) {
      return { success: false, error: "Location not found" };
    }

    // Determine the visitType based on the last log entry for this visitor
    let visitType: "IN" | "OUT" = "IN"; // Default to IN for first-time visitors

    const lastLogEntry = await prisma.logVisitor.findFirst({
      where: {
        nik: data.nik,
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
        date: data.date,
        locationId: location.id,
        nik: data.nik,
        rfidTagId: data.rfid_tag,
        visitType, // Add the determined visitType
      },
    });
    return { success: true, data: created };
  } catch (error) {
    console.error("Failed to create Log Visitor :", error);
    return { success: false, error: "Create failed" };
  }
}
