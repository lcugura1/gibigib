import { z } from 'zod';
import { paymentStatusSchema } from './admin-member-detail';
import { analyticsRangeSchema } from './admin-overview';

export const revenueQuerySchema = z.object({
  gymId: z.string().optional(),
  range: analyticsRangeSchema,
});

export type RevenueQuery = z.infer<typeof revenueQuerySchema>;

const revenueTrendSchema = z.object({
  value: z.number(),
  delta: z.number(),
  history: z.array(z.number()),
});

const revenueSeriesSchema = z.object({ key: z.string(), values: z.array(z.number()) });

export type RevenueSeriesDto = z.infer<typeof revenueSeriesSchema>;

export const revenueDtoSchema = z.discriminatedUnion('stripe', [
  z.object({
    stripe: z.literal('disconnected'),
    newMembers: z.number().int().min(0),
  }),
  z.object({
    stripe: z.literal('connected'),
    asOf: z.string(),
    revenue: revenueTrendSchema,
    perMember: revenueTrendSchema,
    newMembers: revenueTrendSchema,
    renewals: revenueTrendSchema.extend({ rate: z.number() }),
    monthly: z.object({
      months: z.array(z.string()),
      byPlan: z.array(revenueSeriesSchema),
      byGym: z.array(revenueSeriesSchema),
    }),
    breakdown: z.object({
      month: z.string(),
      rows: z.array(z.object({ gymId: z.string(), byPlan: z.array(z.number()) })),
      planSlugs: z.array(z.string()),
    }),
  }),
]);

export type RevenueDto = z.infer<typeof revenueDtoSchema>;

export type ConnectedRevenueDto = Extract<RevenueDto, { stripe: 'connected' }>;

export const paymentFilterSchema = z.enum(['all', 'pending', 'failed']);

export type PaymentFilter = z.infer<typeof paymentFilterSchema>;

export const paymentsQuerySchema = revenueQuerySchema.extend({
  status: paymentFilterSchema,
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export type PaymentsQuery = z.infer<typeof paymentsQuerySchema>;

export const paymentLogDtoSchema = z.object({
  id: z.string(),
  at: z.string(),
  memberId: z.string().nullable(),
  memberName: z.string(),
  gymId: z.string(),
  planSlug: z.string(),
  method: z.string(),
  status: paymentStatusSchema,
  amount: z.number(),
});

export type PaymentLogDto = z.infer<typeof paymentLogDtoSchema>;

export const paymentsPageDtoSchema = z.object({
  items: z.array(paymentLogDtoSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().min(0),
  counts: z.object({
    all: z.number().int().min(0),
    pending: z.number().int().min(0),
    failed: z.number().int().min(0),
  }),
});

export type PaymentsPageDto = z.infer<typeof paymentsPageDtoSchema>;
