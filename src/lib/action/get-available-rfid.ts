"use server";

import { prisma } from "@/lib/prisma";

export async function getAvailableRFIDTags() {
  try {
    const tags = await prisma.rfidTag.findMany({
      where: {
        status: true,
      },
      select: {
        rfidTag: true,
        nik: true,
        Visitor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        rfidTag: "asc",
      },
    });

    return tags.map((tag) => ({
      rfidTag: tag.rfidTag,
      nik: tag.nik,
      visitorName: tag.Visitor?.name || null,
    }));
  } catch (error) {
    console.error("Failed to fetch available RFID tags:", error);
    return [];
  }
}
