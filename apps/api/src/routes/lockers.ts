import type { FastifyInstance } from 'fastify';
import { lockerTapQuerySchema } from '@gibigib/types';
import { listLockers, renderLockerPage, toggleLocker } from '../services/locker';

export async function lockerRoutes(app: FastifyInstance) {
  app.get('/lockers', { preHandler: [app.authenticate] }, async () => {
    return listLockers();
  });

  app.get('/locker/tap', async (request, reply) => {
    const { locker } = lockerTapQuerySchema.parse(request.query);
    const dto = await toggleLocker(locker);
    return reply.type('text/html; charset=utf-8').send(renderLockerPage(dto));
  });
}
