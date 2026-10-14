import { z } from 'zod';

export const eventStatusSchema = z.enum(['PUBLISHED', 'DRAFT']);

export type EventStatus = z.infer<typeof eventStatusSchema>;

export const eventInputSchema = z.object({
  title: z.string().trim().min(1).max(80),
  date: z.string(),
  imageUrl: z.string().nullable(),
  text: z.string().max(1000),
});

export type EventInput = z.infer<typeof eventInputSchema>;

export const eventDtoSchema = eventInputSchema.extend({
  id: z.string(),
  status: eventStatusSchema,
  updatedAt: z.string(),
});

export type EventDto = z.infer<typeof eventDtoSchema>;

export const eventsDtoSchema = z.object({ events: z.array(eventDtoSchema) });

export type EventsDto = z.infer<typeof eventsDtoSchema>;
