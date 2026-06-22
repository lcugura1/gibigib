import { z } from 'zod';

export const visitTagSchema = z.object({
  label: z.string().trim().min(1, 'Unesi naziv plana'),
});

export type VisitTagInput = z.infer<typeof visitTagSchema>;
