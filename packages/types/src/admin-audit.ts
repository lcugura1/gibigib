import { z } from 'zod';
import { analyticsRangeSchema } from './admin-overview';

export const auditKindSchema = z.enum(['DEVICE', 'MEMBERSHIP', 'PLAN', 'PAYMENT', 'EVENT', 'TRAINER', 'SETTINGS']);

export type AuditKind = z.infer<typeof auditKindSchema>;

export const auditActorKindSchema = z.enum(['OWNER', 'SYSTEM', 'MEMBER']);

export type AuditActorKind = z.infer<typeof auditActorKindSchema>;

export const auditEntryDtoSchema = z.object({
  id: z.string(),
  at: z.string(),
  actor: z.object({ kind: auditActorKindSchema, name: z.string(), memberId: z.string().nullable() }),
  kind: auditKindSchema,
  title: z.string(),
  details: z.array(z.string()),
  gymId: z.string().nullable(),
});

export type AuditEntryDto = z.infer<typeof auditEntryDtoSchema>;

export const auditQuerySchema = z.object({
  range: analyticsRangeSchema,
  kind: auditKindSchema.optional(),
  actor: auditActorKindSchema.optional(),
  gymId: z.string().optional(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export type AuditQuery = z.infer<typeof auditQuerySchema>;

export const auditPageDtoSchema = z.object({
  asOf: z.string(),
  items: z.array(auditEntryDtoSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().min(0),
});

export type AuditPageDto = z.infer<typeof auditPageDtoSchema>;
