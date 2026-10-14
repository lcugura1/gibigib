import { z } from 'zod';
import { deviceKindSchema } from './admin-overview';

export const deviceDtoSchema = z.object({
  id: z.string(),
  kind: deviceKindSchema,
  online: z.boolean(),
  offlineSince: z.string().nullable(),
  lastEventAt: z.string().nullable(),
});

export type DeviceDto = z.infer<typeof deviceDtoSchema>;

export const gymDevicesDtoSchema = z.object({
  gymId: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  devices: z.array(deviceDtoSchema),
  lastManualOpenAt: z.string().nullable(),
});

export type GymDevicesDto = z.infer<typeof gymDevicesDtoSchema>;

export const devicesDtoSchema = z.object({
  asOf: z.string(),
  pollSeconds: z.number().int().positive(),
  gyms: z.array(gymDevicesDtoSchema),
});

export type DevicesDto = z.infer<typeof devicesDtoSchema>;
