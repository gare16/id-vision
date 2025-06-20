"use server";

import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, endOfDay } from "date-fns";

export async function getRfidTag() {
  const res = await prisma.rfid_Tag.findMany({
    select: {
      Visitor: {
        select: {
          name: true,
        },
      },
      status: true,
      rfid_tag: true,
      id: true,
    },
  });
  return res;
}

export async function getDataSummaryCard() {
  const [active, inactive, visitors, logsToday, logsYesterday] =
    await Promise.all([
      prisma.rfid_Tag.findMany({ where: { status: true } }),
      prisma.rfid_Tag.findMany({ where: { status: false } }),
      prisma.visitor.findMany(),
      prisma.log_Visitor.count({
        where: {
          date: {
            gte: startOfDay(new Date()),
            lte: endOfDay(new Date()),
          },
        },
      }),
      prisma.log_Visitor.count({
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
    const created = await prisma.rfid_Tag.create({
      data: { rfid_tag, status },
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
    const updated = await prisma.rfid_Tag.update({
      where: { rfid_tag },
      data: { status, nik },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update RFID tag:", error);
    return { success: false, error: "Update failed" };
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
    const created = await prisma.log_Visitor.create({
      data: {
        access: data.access,
        date: data.date,
        location: data.location,
        nik: data.nik,
        rfid_tag: data.rfid_tag,
      },
    });
    return { success: true, data: created };
  } catch (error) {
    console.error("Failed to create Log Visitor :", error);
    return { success: false, error: "Create failed" };
  }
}
