import type { FastifyInstance } from 'fastify';
import { purchaseMembershipSchema } from '@gibigib/types';
import { getActiveMembership, purchaseMembership } from '../services/membership';

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
}
