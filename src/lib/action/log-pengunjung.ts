import { endOfDay, startOfDay } from "date-fns";

import { prisma } from "@/lib/prisma";

export async function getLogPengunjung() {
  const res = await prisma.logVisitor.findMany({
    select: {
      id: true,
      visitType: true,
      Location: {
        select: {
          id: true,
          name: true,
        },
      },
      rfidTagId: true,
      nik: true,
      date: true,
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
    },
    orderBy: {
      date: "desc",
    },
  });

  // Transform the data to match the expected schema (lowercase field names)
  return res.map((item) => ({
    ...item,
    location: item.Location,
    visitor: item.Visitor,
  }));
}

export async function getChartLogPengunjung() {
  const date = await prisma.logVisitor.findMany({
    select: {
      date: true,
    },
  });

  const grouped: Record<string, number> = date.reduce(
    (acc, log) => {
      const date = new Date(log.date).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chart = Object.entries(grouped).map(([date, visitors]) => ({
    date,
    visitors,
  }));

  return { chart };
}

export async function getDailyTableLogVisitor() {
  const log = await prisma.logVisitor.findMany({
    where: {
      date: {
        gte: startOfDay(new Date()),
        lte: endOfDay(new Date()),
      },
    },
    select: {
      id: true,
      visitType: true,
      Location: {
        select: {
          id: true,
          name: true,
        },
      },
      rfidTagId: true,
      nik: true,
      date: true,
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
    },
  });

  // Transform the data to match the expected schema (lowercase field names)
  return log.map((item) => ({
    ...item,
    location: item.Location,
    visitor: item.Visitor,
  }));
}
