import type { FastifyInstance } from 'fastify';
import type { DeviceCommandsDto } from '@gibigib/types';
import { consumeDoorCommand } from '../utils/device-state';

export async function deviceRoutes(app: FastifyInstance) {
  app.get('/commands', async (): Promise<DeviceCommandsDto> => {
    return { door: consumeDoorCommand() };
  });
}
