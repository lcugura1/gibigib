import type { FastifyInstance } from 'fastify';
import type { DeviceCommandsDto } from '@gibigib/types';
import { requireDevice } from '../plugins/device-auth';
import { consumeDoorCommand } from '../services/door';

export async function deviceRoutes(app: FastifyInstance) {
  app.get(
    '/commands',
    { preHandler: [app.authenticateDevice] },
    async (request): Promise<DeviceCommandsDto> => {
      return { door: await consumeDoorCommand(requireDevice(request)) };
    },
  );
}
