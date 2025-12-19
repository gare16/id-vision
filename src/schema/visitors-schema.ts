import { z } from "zod";

export const visitorSchema = z.object({
  id: z.number(),
  nik: z.string(),
  name: z.string(),
  address: z.string(),
  birthInfo: z.string(),
});
