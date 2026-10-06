import type { FastifyInstance } from 'fastify';
import { entryScanSchema } from '@gibigib/types';
import { requireDevice } from '../plugins/device-auth';
import { issueEntryToken, scanEntryCode } from '../services/entry';

export async function entryRoutes(app: FastifyInstance) {
  app.get('/token', { preHandler: [app.authenticate] }, async (request) => {
    return issueEntryToken(request.user.userId);
  });

  app.post('/scan', { preHandler: [app.authenticateDevice] }, async (request) => {
    const { code } = entryScanSchema.parse(request.body);
    return scanEntryCode(code, requireDevice(request));
  });
}
