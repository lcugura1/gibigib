import { z } from 'zod';

export const trainerInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  role: z.string().trim().min(1).max(60),
  photoUrl: z.string().nullable(),
  specialties: z.array(z.string().trim().min(1).max(24)).max(6),
  experienceYears: z.number().int().min(0).max(60),
  instagram: z.string().max(31),
  email: z.string().max(120),
  certifications: z.string().max(300),
  bio: z.string().max(600),
  gymId: z.string(),
});

export type TrainerInput = z.infer<typeof trainerInputSchema>;

export const trainerDtoSchema = trainerInputSchema.extend({ id: z.string() });

export type TrainerDto = z.infer<typeof trainerDtoSchema>;

export const trainersDtoSchema = z.object({ trainers: z.array(trainerDtoSchema) });

export type TrainersDto = z.infer<typeof trainersDtoSchema>;
