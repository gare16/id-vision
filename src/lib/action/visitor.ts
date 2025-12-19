"use server";
import { prisma } from "@/lib/prisma";
import { KTPData } from "@/utils/parse-ktp";

interface ExtendedVisitorData extends KTPData {
  nationality?: string | null;
  phoneNumber?: string | null;
  organization?: string | null;
  visitingPurpose?: string | null;
  placeDestination?: string | null;
  personToVisit?: string | null;
  vehicleNumber?: string | null;
}

export async function getVisitor() {
  return await prisma.visitor.findMany();
}

export async function createVisitor(data: ExtendedVisitorData) {
  try {
    const created = await prisma.visitor.create({
      data: data,
    });
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
      data: data,
    });
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update visitor:", error);
    return { success: false, error: "Update failed" };
  }
}
