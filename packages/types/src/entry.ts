import { z } from 'zod';

export const ENTRY_QR_PREFIX = 'gibigib:';

export const entryTokenDtoSchema = z.object({
  token: z.string(),
  expiresAt: z.string(),
});

export type EntryTokenDto = z.infer<typeof entryTokenDtoSchema>;

export const entryScanSchema = z.object({
  code: z.string().min(1, 'Nevažeća ulaznica'),
});

export type EntryScanInput = z.infer<typeof entryScanSchema>;

export const entryScanResultSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
  memberName: z.string().optional(),
});

export type EntryScanResult = z.infer<typeof entryScanResultSchema>;

export const occupancyDtoSchema = z.object({
  count: z.number().int().min(0),
  capacity: z.number().int().positive(),
});

export type OccupancyDto = z.infer<typeof occupancyDtoSchema>;
