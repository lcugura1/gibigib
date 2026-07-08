import { z } from 'zod';

export const visitTagSchema = z.object({
  label: z.string().trim().min(1, 'Unesi naziv plana'),
});

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Neispravan datum');

export const isoTimeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, 'Neispravno vrijeme');

export const tagColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Neispravna boja');

export const trainingTagInputSchema = z.object({
  date: isoDateSchema,
  time: isoTimeSchema.optional(),
  color: tagColorSchema,
  label: z.string().trim().min(1, 'Unesi naziv plana'),
});

export type TrainingTagInput = z.infer<typeof trainingTagInputSchema>;

export const visitDtoSchema = z.object({
  id: z.string(),
  date: isoDateSchema,
  time: isoTimeSchema.optional(),
  color: tagColorSchema,
  label: z.string(),
});

export type VisitDto = z.infer<typeof visitDtoSchema>;

export const monthlyGoalInputSchema = z.object({
  goal: z
    .number('Unesi cilj')
    .int('Cilj mora biti cijeli broj')
    .min(1, 'Cilj mora biti barem 1')
    .max(31, 'Cilj može biti najviše 31'),
});

export type MonthlyGoalDto = { goal: number | null };
