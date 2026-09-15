import type { FastifyInstance } from 'fastify';
import { purchaseMembershipSchema } from '@gibigib/types';
import {
  getActiveMembership,
  pauseMembership,
  purchaseMembership,
  resumeMembership,
} from '../services/membership';

export async function membershipRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    const input = purchaseMembershipSchema.parse(request.body);
    const membership = await purchaseMembership(request.user.userId, input);
    return reply.code(201).send(membership);
  });

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
