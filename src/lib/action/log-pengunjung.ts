import { prisma } from "@/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

export async function getLogPengunjung() {
  const res = await prisma.log_Visitor.findMany({
    select: {
      id_log: true,
      access: true,
      location: true,
      rfid_tag: true,
      date: true,
      Visitor: {
        select: {
          name: true,
        },
      },
    },
  });
  return res;
}

export async function getChartLogPengunjung() {
  const date = await prisma.log_Visitor.findMany({
    select: {
      date: true,
    },
  });

  const grouped: Record<string, number> = date.reduce((acc, log) => {
    const date = new Date(log.date).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chart = Object.entries(grouped).map(([date, visitors]) => ({
    date,
    visitors,
  }));

  return { chart };
}

export async function getDailyTableLogVisitor() {
  const log = await prisma.log_Visitor.findMany({
    where: {
      date: {
        gte: startOfDay(new Date()),
        lte: endOfDay(new Date()),
      },
    },
    select: {
      id_log: true,
      access: true,
      location: true,
      rfid_tag: true,
      date: true,
      Visitor: {
        select: {
          name: true,
        },
      },
    },
  });
  return log;
}
