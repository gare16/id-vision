import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, endOfDay } from "date-fns";

export async function getRfidTag() {
  const res = await prisma.rfid_Tag.findMany({
    select: {
      Pengunjung: {
        select: {
          nama: true,
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
      prisma.pengunjung.findMany(),
      prisma.log_Pengunjung.count({
        where: {
          waktu: {
            gte: startOfDay(new Date()),
            lte: endOfDay(new Date()),
          },
        },
      }),
      prisma.log_Pengunjung.count({
        where: {
          waktu: {
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
