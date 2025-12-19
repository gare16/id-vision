import { z } from "zod";

export const RFIDPayloadSchema = z.object({
  access: z.string(),
  location: z.string(),
  rfidTag: z.string(),
  status: z.string(),
  name: z.string(),
  nik: z.string(),
});
