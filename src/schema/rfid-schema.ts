import { z } from "zod";

export const RFIDTagSchema = z.object({
  rfidTag: z.string(),
  nik: z.string().nullable().optional(),
  status: z.boolean(), // or z.string().datetime() if you prefer strict ISO strings
  visitor: z
    .object({
      name: z.string().nullable().optional(),
    })
    .nullable(),
});

export const RegisterRFIDSchema = z.object({
  rfidTag: z.string(),
  status: z.string(),
});
