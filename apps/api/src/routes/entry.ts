import type { FastifyInstance } from 'fastify';
import { entryScanSchema } from '@gibigib/types';
import { issueEntryToken, scanEntryCode } from '../services/entry';

export async function entryRoutes(app: FastifyInstance) {
  app.get('/token', { preHandler: [app.authenticate] }, async (request) => {
    return issueEntryToken(request.user.userId);
  });

  app.post('/scan', async (request) => {
    const { code } = entryScanSchema.parse(request.body);
    return scanEntryCode(code);
  });
}
