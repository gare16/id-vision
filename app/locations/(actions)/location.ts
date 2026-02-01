"use server";

import { prisma } from "@/lib/prisma";

// Get all locations
export async function getAllLocations() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        name: "desc",
      },
    });
    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw new Error("Failed to fetch locations");
  } finally {
    await prisma.$disconnect();
  }
}

// Get location by ID
export async function getLocationById(id: number) {
  try {
    const location = await prisma.location.findUnique({
      where: { id },
    });
    return location;
  } catch (error) {
    console.error(`Error fetching location with id ${id}:`, error);
    throw new Error(`Failed to fetch location with id ${id}`);
  } finally {
    await prisma.$disconnect();
  }
}

// Create a new location
export async function createLocation(data: { name: string }) {
  try {
    // Check if location with this name already exists
    const existingLocation = await prisma.location.findUnique({
      where: { name: data.name },
    });

    if (existingLocation) {
      throw new Error("Location with this name already exists");
    }

    const location = await prisma.location.create({
      data,
    });
    return location;
  } catch (error) {
    console.error("Error creating location:", error);
    throw new Error("Failed to create location");
  } finally {
    await prisma.$disconnect();
  }
}

// Update a location
export async function updateLocation(id: number, data: { name: string }) {
  try {
    // Check if location with this name already exists (excluding current location)
    const existingLocation = await prisma.location.findFirst({
      where: {
        name: data.name,
        id: {
          not: id,
        },
      },
    });

    if (existingLocation) {
      throw new Error("Location with this name already exists");
    }

    const location = await prisma.location.update({
      where: { id },
      data,
    });
    return location;
  } catch (error) {
    console.error(`Error updating location with id ${id}:`, error);
    throw new Error(`Failed to update location with id ${id}`);
  } finally {
    await prisma.$disconnect();
  }
}

// Delete a location
export async function deleteLocation(id: number) {
  try {
    // Check if location has associated records before deletion
    const rfidTagLocationCount = await prisma.rfidTagLocation.count({
      where: { locationId: id },
    });

    if (rfidTagLocationCount > 0) {
      throw new Error(
        "Cannot delete location because it has associated RFID tag assignments",
      );
    }

    const logVisitorCount = await prisma.logVisitor.count({
      where: { locationId: id },
    });

    if (logVisitorCount > 0) {
      throw new Error(
        "Cannot delete location because it has associated visitor logs",
      );
    }

    await prisma.location.delete({
      where: { id },
    });

    return { success: true, message: "Location deleted successfully" };
  } catch (error) {
    console.error(`Error deleting location with id ${id}:`, error);
    throw new Error(`Failed to delete location with id ${id}`);
  } finally {
    await prisma.$disconnect();
  }
}
