import type { FastifyInstance } from 'fastify';
import { trainingTagInputSchema } from '@gibigib/types';
import { listTrainingTags, upsertTrainingTag } from '../services/attendance';

export async function attendanceRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    return listTrainingTags(request.user.userId);
  });

  app.put('/tag', { preHandler: [app.authenticate] }, async (request, reply) => {
    const input = trainingTagInputSchema.parse(request.body);
    const visit = await upsertTrainingTag(request.user.userId, input);
    return reply.send(visit);
  });
}
