import { z } from 'zod';
import { membershipStatusSchema } from './membership';

export const memberSortKeySchema = z.enum(['name', 'plan', 'status', 'homeGym', 'expiresAt', 'lastVisit', 'visits30d']);

export type MemberSortKey = z.infer<typeof memberSortKeySchema>;

export const sortDirectionSchema = z.enum(['asc', 'desc']);

export type SortDirection = z.infer<typeof sortDirectionSchema>;

export const membersQuerySchema = z.object({
  search: z.string().optional(),
  status: membershipStatusSchema.optional(),
  planSlug: z.string().optional(),
  gymId: z.string().optional(),
  inactiveOnly: z.boolean(),
  sort: memberSortKeySchema,
  direction: sortDirectionSchema,
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export type MembersQuery = z.infer<typeof membersQuerySchema>;

export const memberListItemDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  planSlug: z.string(),
  planName: z.string(),
  status: membershipStatusSchema,
  homeGymId: z.string(),
  expiresAt: z.string(),
  lastVisitAt: z.string().nullable(),
  visits30d: z.number().int().min(0),
});

export type MemberListItemDto = z.infer<typeof memberListItemDtoSchema>;

export const membersPageDtoSchema = z.object({
  asOf: z.string(),
  items: z.array(memberListItemDtoSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().min(0),
  inactiveCount: z.number().int().min(0),
  activeMembers: z.number().int().min(0),
  allMembers: z.number().int().min(0),
});

export type MembersPageDto = z.infer<typeof membersPageDtoSchema>;
