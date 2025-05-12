import { z } from "zod";

export const SectionCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  value: z.string(),
  description: z.string(),
  percentage: z.string().optional(),
  footerText: z.string(),
  status: z.string(),
});

export const SectionCardsPropsSchema = z.object({
  data: z.array(SectionCardSchema),
});

export type SectionCard = z.infer<typeof SectionCardSchema>;
export type SectionCardsProps = z.infer<typeof SectionCardsPropsSchema>;
