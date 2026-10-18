import type { FastifyInstance } from 'fastify';
import { entryScanSchema } from '@gibigib/types';
import { requireDevice } from '../plugins/device-auth';
import { limitRequests } from '../plugins/rate-limit';
import { issueEntryToken, scanEntryCode } from '../services/entry';

export async function entryRoutes(app: FastifyInstance) {
  app.get('/token', { preHandler: [app.authenticate] }, async (request) => {
    return issueEntryToken(request.user.userId);
  });

  const limitScanPerDevice = limitRequests(app, 'scan-device', {
    max: 60,
    timeWindow: '1 minute',
    key: (request) => request.device?.id ?? request.ip,
  });

  app.post('/scan', { preHandler: [app.authenticateDevice('SCANNER'), limitScanPerDevice] }, async (request) => {
    const { code } = entryScanSchema.parse(request.body);
    return scanEntryCode(code, requireDevice(request));
  });
}
