import { z } from 'zod';

export const overviewRangeSchema = z.enum(['today', '7d', '30d', '12m']);

export type OverviewRange = z.infer<typeof overviewRangeSchema>;

export const overviewQuerySchema = z.object({
  gymId: z.string().optional(),
  range: overviewRangeSchema,
});

export type OverviewQuery = z.infer<typeof overviewQuerySchema>;

const trendSchema = z.object({
  value: z.number(),
  delta: z.number(),
  history: z.array(z.number()),
});

export type TrendDto = z.infer<typeof trendSchema>;

export const gymLiveDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number().int().positive(),
  count: z.number().int().min(0),
});

export type GymLiveDto = z.infer<typeof gymLiveDtoSchema>;

export const deviceKindSchema = z.enum(['reader', 'controller']);

export type DeviceKind = z.infer<typeof deviceKindSchema>;

export const liveStatusDtoSchema = z.object({
  windowMinutes: z.number().int().positive(),
  updatedAt: z.string(),
  gyms: z.array(gymLiveDtoSchema),
  offlineDevices: z.array(
    z.object({
      gymId: z.string(),
      kind: deviceKindSchema,
      offlineSince: z.string(),
    }),
  ),
});

export type LiveStatusDto = z.infer<typeof liveStatusDtoSchema>;

const attentionBaseSchema = z.object({
  memberId: z.string(),
  name: z.string(),
  gymId: z.string(),
  planName: z.string(),
});

export const attentionItemDtoSchema = z.discriminatedUnion('kind', [
  attentionBaseSchema.extend({ kind: z.literal('expiring'), expiresAt: z.string() }),
  attentionBaseSchema.extend({ kind: z.literal('inactive'), daysSinceVisit: z.number().int() }),
  attentionBaseSchema.extend({ kind: z.literal('paused'), pausedUntil: z.string() }),
  attentionBaseSchema.extend({
    kind: z.literal('failedPayment'),
    amount: z.number(),
    failedAt: z.string(),
    reason: z.enum(['declined', 'cardExpired']),
  }),
]);

export type AttentionItemDto = z.infer<typeof attentionItemDtoSchema>;

export type AttentionKind = AttentionItemDto['kind'];

const attentionGroupSchema = z.object({
  total: z.number().int().min(0),
  items: z.array(attentionItemDtoSchema),
});

export const overviewDtoSchema = z.object({
  activeMembers: trendSchema,
  monthlyRevenue: trendSchema,
  churn: trendSchema.extend({ month: z.string() }),
  arrivals: z.object({
    buckets: z.array(z.string()),
    series: z.array(z.object({ gymId: z.string(), values: z.array(z.number().int()) })),
    deltaPercent: z.number(),
  }),
  planMix: z.array(z.object({ slug: z.string(), name: z.string(), count: z.number().int() })),
  peakHours: z.object({
    firstHour: z.number().int(),
    byWeekday: z.array(z.array(z.number())),
  }),
  attention: z.object({
    expiring: attentionGroupSchema,
    inactive: attentionGroupSchema,
    paused: attentionGroupSchema,
    failedPayment: attentionGroupSchema,
  }),
});

export type OverviewDto = z.infer<typeof overviewDtoSchema>;

export const entryDenialReasonSchema = z.enum(['EXPIRED', 'PAUSED', 'CANCELLED', 'INVALID_CODE']);

export type EntryDenialReason = z.infer<typeof entryDenialReasonSchema>;

export const entryLogDtoSchema = z.object({
  id: z.string(),
  at: z.string(),
  memberName: z.string(),
  gymId: z.string(),
  approved: z.boolean(),
  denialReason: entryDenialReasonSchema.nullable(),
});

export type EntryLogDto = z.infer<typeof entryLogDtoSchema>;
