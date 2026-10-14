import { z } from 'zod';

const hoursSchema = z.object({ from: z.number().int().min(0).max(24), to: z.number().int().min(0).max(24) });

export const gymSettingsInputSchema = z.object({
  name: z.string().trim().min(1).max(40),
  address: z.string().trim().min(1).max(120),
  capacity: z.number().int().positive().max(2000),
  openingHours: z.object({ weekdays: hoursSchema, weekend: hoursSchema }),
});

export type GymSettingsInput = z.infer<typeof gymSettingsInputSchema>;

export const settingsDtoSchema = z.object({
  gyms: z.array(gymSettingsInputSchema.extend({ id: z.string() })),
  occupancy: z.object({
    windowMinutes: z.number().int().positive(),
    comfortableBelow: z.number().int(),
    busyFrom: z.number().int(),
  }),
  stripe: z.object({ connected: z.boolean(), accountName: z.string().nullable(), methods: z.array(z.string()) }),
  account: z.object({ name: z.string(), email: z.string() }),
});

export type SettingsDto = z.infer<typeof settingsDtoSchema>;

export const passwordChangeSchema = z.object({ current: z.string().min(1), next: z.string().min(8) });

export type PasswordChange = z.infer<typeof passwordChangeSchema>;
