import { z } from "zod";

const log = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  visitors: z.number().int().nonnegative(),
});

export const logSchema = z.array(log);

export const LocationSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const DailylogVisitorSchema = z.object({
  id: z.number(),
  visitType: z.enum(["IN", "OUT"]),
  location: LocationSchema.nullable(),
  rfidTagId: z.string().nullable(),
  nik: z.string(),
  date: z.date(), // Prisma DateTime maps to ISO string
  visitor: z.object({
    id: z.number(),
    nik: z.string(),
    name: z.string(),
    address: z.string(),
    birthInfo: z.string(),
    nationality: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    organization: z.string().nullable(),
    visitingPurpose: z.string().nullable(),
    placeDestination: z.string().nullable(),
    vehicleNumber: z.string().nullable(),
  }),
});
