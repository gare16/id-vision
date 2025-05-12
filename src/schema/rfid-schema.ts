import { z } from "zod";

export const RFIDTagSchema = z.object({
  id: z.number(),
  rfid_tag: z.string(),
  status: z.boolean(), // or z.string().datetime() if you prefer strict ISO strings
  Pengunjung: z
    .object({
      nama: z.string().nullable().optional(),
    })
    .nullable(),
});
