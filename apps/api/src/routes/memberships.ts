import type { FastifyInstance } from 'fastify';
import { getActiveMembership, pauseMembership, resumeMembership } from '../services/membership';

export async function membershipRoutes(app: FastifyInstance) {
  app.get('/active', { preHandler: [app.authenticate] }, async (request) => {
    const membership = await getActiveMembership(request.user.userId);
    return { membership };
  });

  app.post('/active/pause', { preHandler: [app.authenticate] }, async (request) => {
    return pauseMembership(request.user.userId);
  });

  app.post('/active/resume', { preHandler: [app.authenticate] }, async (request) => {
    return resumeMembership(request.user.userId);
  });
}
