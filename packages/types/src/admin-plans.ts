import { z } from 'zod';

export const planInputSchema = z.object({
  name: z.string().trim().min(1).max(40),
  price: z.number().min(0).nullable(),
  durationDays: z.number().int().positive().nullable(),
  pauseMaxDays: z.number().int().min(0),
  pauseCooldownDays: z.number().int().min(0),
  description: z.string().max(200),
  visible: z.boolean(),
});

export type PlanInput = z.infer<typeof planInputSchema>;

export const planDtoSchema = planInputSchema.extend({
  slug: z.string(),
  activeMembers: z.number().int().min(0),
});

export type PlanDto = z.infer<typeof planDtoSchema>;

export const plansDtoSchema = z.object({
  plans: z.array(planDtoSchema),
  activeMemberships: z.number().int().min(0),
  gymCount: z.number().int().positive(),
});

export type PlansDto = z.infer<typeof plansDtoSchema>;
