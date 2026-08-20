import type { FastifyInstance } from 'fastify';
import { getOccupancy } from '../services/entry';

export async function occupancyRoutes(app: FastifyInstance) {
  app.get('/occupancy', { preHandler: [app.authenticate] }, async () => {
    return getOccupancy();
  });
}
