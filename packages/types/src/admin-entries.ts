import { z } from 'zod';
import { analyticsRangeSchema, entryDenialReasonSchema, entryLogDtoSchema } from './admin-overview';

export const entryResultFilterSchema = z.enum(['all', 'approved', 'denied']);

export type EntryResultFilter = z.infer<typeof entryResultFilterSchema>;

export const entriesQuerySchema = z.object({
  gymId: z.string().optional(),
  range: analyticsRangeSchema,
  result: entryResultFilterSchema,
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export type EntriesQuery = z.infer<typeof entriesQuerySchema>;

export const entriesPageDtoSchema = z.object({
  asOf: z.string(),
  items: z.array(entryLogDtoSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().min(0),
  counts: z.object({
    all: z.number().int().min(0),
    approved: z.number().int().min(0),
    denied: z.number().int().min(0),
  }),
  summary: z.object({
    deltaPercent: z.number(),
    topDenial: z.object({ reason: entryDenialReasonSchema, count: z.number().int().positive() }).nullable(),
    uniqueMembers: z.number().int().min(0),
    activeMembers: z.number().int().min(0),
  }),
});

export type EntriesPageDto = z.infer<typeof entriesPageDtoSchema>;
