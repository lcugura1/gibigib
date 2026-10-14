import { z } from 'zod';

const hoursSchema = z.object({ from: z.number().int().min(0).max(24), to: z.number().int().min(0).max(24) });

const deviceSchema = z.object({ online: z.boolean(), offlineSince: z.string().nullable() });

export const gymDetailDtoSchema = z.object({
  asOf: z.string(),
  gym: z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    city: z.string(),
    capacity: z.number().int().positive(),
    openingHours: z.object({ weekdays: hoursSchema, weekend: hoursSchema }),
  }),
  devices: z.object({
    reader: deviceSchema,
    controller: deviceSchema,
    lastEventAt: z.string().nullable(),
  }),
  live: z.object({
    count: z.number().int().min(0),
    windowMinutes: z.number().int().positive(),
    averageNow: z.number().int().min(0),
    peakToday: z.object({ count: z.number().int().min(0), at: z.string() }).nullable(),
  }),
  occupancyToday: z.object({
    firstHour: z.number().int().min(0).max(23),
    today: z.array(z.number().int().min(0).nullable()),
    average: z.array(z.number().int().min(0)),
  }),
});

export type GymDetailDto = z.infer<typeof gymDetailDtoSchema>;
