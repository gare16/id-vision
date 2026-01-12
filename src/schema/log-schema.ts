import { z } from "zod";

const log = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  visitors: z.number().int().nonnegative(),
});

export const logSchema = z.array(log);

export const DailylogVisitorSchema = z.object({
  idLog: z.number(),
  visitType: z.enum(["IN", "OUT"]),
  location: z.string().nullable(),
  rfidTagId: z.string(),
  nik: z.string(),
  date: z.date(), // or z.string().datetime() if you prefer strict ISO strings
  visitor: z.object({
    name: z.string(),
  }),
});
