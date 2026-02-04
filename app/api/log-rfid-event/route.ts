import { NextResponse } from "next/server";

import { createVisitorLog } from "@/lib/action/create-visitor-log";
import { prisma } from "@/lib/prisma";

import { checkRfidInDatabase } from "../../../lib/services/rfid-check.service";

/**
 * Handles RFID log events. This is expected to be called by an MQTT message handler
 * on the client, which forwards the event to this server-side route.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    try {
      const dataVisitor = await checkRfidInDatabase(body.rfidTag);

      if (
        dataVisitor.rfidTagRecord?.visitor &&
        dataVisitor.rfidTagRecord.status
      ) {
        const mqttLocationName = body.location;
        let targetLocation: { id: number; name: string } | null = null;

        if (
          dataVisitor.rfidTagRecord.locations &&
          dataVisitor.rfidTagRecord.locations.length > 0
        ) {
          const matchingLocation = dataVisitor.rfidTagRecord.locations.find(
            (assignedLoc) => assignedLoc.location.name === mqttLocationName,
          );

          if (matchingLocation) {
            targetLocation = matchingLocation.location;
          } else {
            return NextResponse.json(
              {
                status: "RFID_LOCATION_MISMATCH",
                message: `Location "${mqttLocationName}" does not match any assigned locations for RFID tag "${body.rfidTag}".`,
              },
              { status: 400 },
            );
          }
        } else {
          const locationRecord = await prisma.location.findFirst({
            where: { name: body.location },
            select: { id: true, name: true },
          });

          if (locationRecord) {
            targetLocation = locationRecord;
          } else {
            return NextResponse.json(
              {
                status: "LOCATION_NOT_FOUND",
                message: `Location "${body.location}" from MQTT message does not exist in the database.`,
              },
              { status: 404 },
            );
          }
        }

        if (!targetLocation) {
          return NextResponse.json(
            {
              status: "error",
              message: "Target location could not be determined.",
            },
            { status: 500 },
          );
        }

        const logResult = await createVisitorLog({
          rfidTag: body.rfidTag,
          location: targetLocation.name,
          nik: dataVisitor.rfidTagRecord?.visitor?.nik,
        });

        if (logResult.success) {
          return NextResponse.json({
            status: "RFID_ACTIVE",
            logId: logResult.data?.id,
          });
        } else {
          return NextResponse.json(
            {
              status: "error",
              message: "Failed to create visitor log",
            },
            { status: 500 },
          );
        }
      } else {
        return NextResponse.json(
          {
            status: "RFID_INACTIVE",
            message: "RFID not active or has no associated visitor.",
          },
          { status: 403 },
        );
      }
    } catch (logError) {
      console.error("Error during RFID log processing:", logError);
      return NextResponse.json(
        {
          status: "error",
          error: logError instanceof Error ? logError.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      {
        status: "validation_error",
        error:
          error instanceof Error ? error.message : "Invalid message format",
      },
      { status: 400 },
    );
  }
}
