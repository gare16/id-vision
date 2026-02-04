"use server";

import { prisma } from "@/lib/prisma";

// Fungsi untuk mengambil lokasi-lokasi yang terkait dengan RFID tag tertentu
export async function getRfidTagLocations(rfidTag: string) {
  const res = await prisma.rfidTagLocation.findMany({
    where: {
      rfidTagId: rfidTag,
    },
    include: {
      location: true,
    },
  });

  return res;
}

// Fungsi untuk menetapkan lokasi ke RFID tag
export async function setRfidTagLocations({
  rfidTag,
  locationIds,
}: {
  rfidTag: string;
  locationIds: number[];
}) {
  try {
    // Hapus semua penugasan lokasi sebelumnya untuk RFID tag ini
    await prisma.rfidTagLocation.deleteMany({
      where: {
        rfidTagId: rfidTag,
      },
    });

    // Buat penugasan lokasi baru untuk setiap ID lokasi yang diberikan
    const created = await prisma.rfidTagLocation.createMany({
      data: locationIds.map((locationId) => ({
        rfidTagId: rfidTag,
        locationId: locationId,
      })),
    });

    return { success: true, data: created };
  } catch (error) {
    console.error("Failed to set locations for RFID tag:", error);
    return { success: false, error: "Assignment failed" };
  }
}

// Fungsi untuk menghapus penugasan lokasi dari RFID tag
export async function removeLocationFromRfidTag(rfidTag: string) {
  try {
    const deleted = await prisma.rfidTagLocation.deleteMany({
      where: {
        rfidTagId: rfidTag,
      },
    });

    return { success: true, data: deleted };
  } catch (error) {
    console.error("Failed to remove location from RFID tag:", error);
    return { success: false, error: "Removal failed" };
  }
}
