import { z } from "zod";

export const visitorSchema = z.object({
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
  personToVisit: z.string().nullable(),
  vehicleNumber: z.string().nullable(),
});
