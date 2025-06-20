import { z } from "zod";

export const RFIDPayloadSchema = z.object({
  access: z.string(),
  location: z.string(),
  rfid_tag: z.string(),
  status: z.string(),
  name: z.string(),
  nik: z.string(),
});
