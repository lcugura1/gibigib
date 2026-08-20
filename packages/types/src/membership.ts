import { z } from 'zod';

export const membershipProgramSlugSchema = z.enum(['mjesecno', 'grupni', 'godisnji']);

export type MembershipProgramSlug = z.infer<typeof membershipProgramSlugSchema>;

export const paymentMethodSchema = z.enum(['card', 'applepay', 'gpay', 'paypal']);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const purchaseMembershipSchema = z.object({
  programSlug: membershipProgramSlugSchema,
  paymentMethod: paymentMethodSchema,
});

export type PurchaseMembershipInput = z.infer<typeof purchaseMembershipSchema>;

export const membershipStatusSchema = z.enum(['ACTIVE', 'PAUSED', 'EXPIRED', 'CANCELLED']);

export type MembershipStatus = z.infer<typeof membershipStatusSchema>;

export const membershipDtoSchema = z.object({
  id: z.string(),
  status: membershipStatusSchema,
  startDate: z.string(),
  endDate: z.string(),
  program: z.object({
    slug: z.string(),
    name: z.string(),
    durationDays: z.number().int(),
  }),
});

export type MembershipDto = z.infer<typeof membershipDtoSchema>;

export type ActiveMembershipDto = { membership: MembershipDto | null };
