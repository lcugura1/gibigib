import { z } from 'zod';

export const lockerStatusSchema = z.enum(['LOCKED', 'UNLOCKED']);

export type LockerStatus = z.infer<typeof lockerStatusSchema>;

export const lockerDtoSchema = z.object({
  number: z.number().int(),
  status: lockerStatusSchema,
  updatedAt: z.string(),
});

export type LockerDto = z.infer<typeof lockerDtoSchema>;

export const lockerTapQuerySchema = z.object({
  locker: z.coerce.number().int().min(1),
});

export type LockerTapQuery = z.infer<typeof lockerTapQuerySchema>;

export const deviceCommandsDtoSchema = z.object({
  door: z.enum(['open', 'idle']),
  locker: lockerStatusSchema,
});

export type DeviceCommandsDto = z.infer<typeof deviceCommandsDtoSchema>;
