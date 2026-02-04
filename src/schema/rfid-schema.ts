import { z } from "zod";

export const RFIDTagSchema = z.object({
  rfidTag: z.string(),
  nik: z.string().nullable(),
  status: z.boolean(),
  visitor: z
    .object({
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
    })
    .nullable(),
  locations: z
    .array(
      z.object({
        location: z.object({
          id: z.number(),
          name: z.string(),
        }),
      }),
    )
    .optional(),
});

export const RegisterRFIDSchema = z.object({
  rfidTag: z.string(),
  status: z.boolean(),
});
