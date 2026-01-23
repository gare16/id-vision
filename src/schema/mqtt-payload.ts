import { z } from "zod";

export const VisitorSchema = z.object({
  id: z.number(),
  nik: z.string(),
  name: z.string(),
  address: z.string(),
  birthInfo: z.string(), // "Semarang, 1987-09-18"
  nationality: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  organization: z.string().nullable(),
  visitingPurpose: z.string().nullable(),
  placeDestination: z.string().nullable(),
  personToVisit: z.string().nullable(),
  vehicleNumber: z.string().nullable(),
});

// Schema for RFID check requests
export const RFIDCheckPayloadSchema = z.object({
  location: z.string(),
  rfidTag: z.string(),
  processedAt: z.string().datetime().optional(), // ISO string
  rfidExists: z.boolean().optional(),
  status: z.string().optional(),
  visitor: VisitorSchema.nullable().optional(),
});

// Schema for RFID log events
export const RFIDLogPayloadSchema = z.object({
  rfidTag: z.string(),
  deviceId: z.string(),
  location: z.string(),
  timestamp: z.string().optional(),
});
