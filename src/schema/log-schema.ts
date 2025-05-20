import { z } from "zod";

const log = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  visitors: z.number().int().nonnegative(),
});

export const logSchema = z.array(log);

export const DailylogVisitorSchema = z.object({
  id_log: z.number(),
  access: z.boolean(),
  location: z.string(),
  rfid_tag: z.string(),
  date: z.date(), // or z.string().datetime() if you prefer strict ISO strings
  Visitor: z.object({
    name: z.string(),
  }),
});
