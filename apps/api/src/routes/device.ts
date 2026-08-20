import type { FastifyInstance } from 'fastify';
import type { DeviceCommandsDto } from '@gibigib/types';
import { consumeDoorCommand } from '../utils/device-state';
import { prisma } from '../utils/prisma';

export async function deviceRoutes(app: FastifyInstance) {
  app.get('/commands', async (): Promise<DeviceCommandsDto> => {
    const locker = await prisma.locker.findUnique({ where: { number: 1 } });
    return { door: consumeDoorCommand(), locker: locker?.status ?? 'UNLOCKED' };
  });
}
