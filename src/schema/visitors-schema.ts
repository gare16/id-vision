import { z } from "zod";

export const visitorSchema = z.object({
  id: z.number(),
  nik: z.string(),
  nama: z.string(),
  alamat: z.string(),
  ttl: z.string(),
});
