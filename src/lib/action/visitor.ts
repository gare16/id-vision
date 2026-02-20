"use server";
import { prisma } from "@/lib/prisma";
import { KTPData } from "@/types/ktp";

interface ExtendedVisitorData extends KTPData {
  phoneNumber?: string | null;
  organization?: string | null;
  visitingPurpose?: string | null;
  placeDestination?: string[] | null;
  vehicleNumber?: string | null;
  rfidTag?: string | null;
}

export async function getVisitor() {
  return await prisma.visitor.findMany({
    orderBy: {
      id: "desc",
    },
  });
}

export async function createVisitor(data: ExtendedVisitorData) {
  try {
    console.log({ data });
    const created = await prisma.visitor.create({
      data: {
        nik: data.nik,
        name: data.name,
        address: data.address,
        birthInfo: data.birthInfo,
        nationality: data.nationality,
        phoneNumber: data.phoneNumber,
        organization: data.organization,
        visitingPurpose: data.visitingPurpose,
        placeDestination: data.placeDestination?.join(","),
        vehicleNumber: data.vehicleNumber,
      },
    });

    // Create RFID tag if provided
    if (data.rfidTag && created) {
      await prisma.rfidTag.create({
        data: {
          rfidTag: data.rfidTag,
          nik: data.nik,
          status: true,
        },
      });

      // Create RFID tag location assignments if placeDestinations are provided
      if (data.placeDestination && data.placeDestination.length > 0) {
        await prisma.$transaction(async (tx) => {
          for (const locationName of data.placeDestination!) {
            const location = await tx.location.findUnique({
              where: { name: locationName },
            });

            if (location) {
              await tx.rfidTagLocation.create({
                data: {
                  rfidTagId: data.rfidTag!,
                  locationId: location.id,
                },
              });
            }
          }
        });
      }
    }

    return { success: true, data: created };
  } catch (error) {
    console.error("Failed to create visitor:", error);
    return { success: false, error: "Create failed" };
  }
}

export async function updateVisitor(data: ExtendedVisitorData) {
  try {
    const updated = await prisma.visitor.update({
      where: {
        nik: data.nik,
      },
      data: {
        name: data.name,
        address: data.address,
        birthInfo: data.birthInfo,
        nationality: data.nationality,
        phoneNumber: data.phoneNumber,
        organization: data.organization,
        visitingPurpose: data.visitingPurpose,
        placeDestination: data.placeDestination?.join(",") || "",
        vehicleNumber: data.vehicleNumber,
      },
    });
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update visitor:", error);
    return { success: false, error: "Update failed" };
  }
}
