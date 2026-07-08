import type { FastifyInstance } from 'fastify';
import { monthlyGoalInputSchema, trainingTagInputSchema } from '@gibigib/types';
import {
  getMonthlyGoal,
  listTrainingTags,
  setMonthlyGoal,
  upsertTrainingTag,
} from '../services/attendance';

export async function attendanceRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    return listTrainingTags(request.user.userId);
  });

  app.put('/tag', { preHandler: [app.authenticate] }, async (request, reply) => {
    const input = trainingTagInputSchema.parse(request.body);
    const visit = await upsertTrainingTag(request.user.userId, input);
    return reply.send(visit);
  });

  app.get('/goal', { preHandler: [app.authenticate] }, async (request) => {
    return getMonthlyGoal(request.user.userId);
  });

  app.put('/goal', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { goal } = monthlyGoalInputSchema.parse(request.body);
    const result = await setMonthlyGoal(request.user.userId, goal);
    return reply.send(result);
  });
}
