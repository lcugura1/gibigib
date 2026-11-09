import { z } from 'zod';
import { membershipStatusSchema } from './membership';

export const paymentStatusSchema = z.enum(['PAID', 'PENDING', 'FAILED', 'REFUNDED']);

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

export const memberDetailDtoSchema = z.object({
  asOf: z.string(),
  id: z.string(),
  name: z.string(),
  email: z.string(),
  oibLast3: z.string(),
  birthDate: z.string(),
  memberSince: z.string(),
  homeGymId: z.string(),
  membership: z.object({
    status: membershipStatusSchema,
    planSlug: z.string(),
    planName: z.string(),
    price: z.number(),
    durationDays: z.number().int().positive(),
    autoRenew: z.boolean(),
    startsAt: z.string(),
    endsAt: z.string(),
    paymentMethod: z.string(),
  }),
  pause: z.object({
    maxDays: z.number().int().positive(),
    cooldownDays: z.number().int().min(0),
    current: z.object({ from: z.string(), until: z.string() }).nullable(),
    nextAllowedFrom: z.string().nullable(),
    history: z.array(z.object({ from: z.string(), until: z.string(), days: z.number().int().positive() })),
  }),
  visits: z.object({
    last30Days: z.number().int().min(0),
    byGym30Days: z.array(z.object({ gymId: z.string(), count: z.number().int().min(0) })),
  }),
  payments: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      description: z.string(),
      method: z.string(),
      status: paymentStatusSchema,
      amount: z.number(),
    }),
  ),
  changeLog: z.array(
    z.object({ id: z.string(), at: z.string(), title: z.string(), detail: z.string(), actor: z.string() }),
  ),
});

export type MemberDetailDto = z.infer<typeof memberDetailDtoSchema>;

export const memberVisitsDtoSchema = z.object({
  month: z.string(),
  days: z.array(z.number().int().min(1).max(31)),
});

export type MemberVisitsDto = z.infer<typeof memberVisitsDtoSchema>;

export const extendMembershipRequestSchema = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('days'), days: z.number().int().positive() }),
  z.object({ mode: z.literal('plan'), planSlug: z.string() }),
]);

export type ExtendMembershipRequest = z.infer<typeof extendMembershipRequestSchema>;

export const pauseMembershipRequestSchema = z.object({ days: z.number().int().positive() });

export type PauseMembershipRequest = z.infer<typeof pauseMembershipRequestSchema>;
