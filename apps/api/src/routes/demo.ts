import type { FastifyInstance } from 'fastify';
import { prisma } from '../utils/prisma';

export async function demoRoutes(app: FastifyInstance) {
  app.post('/reset', async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.deleteMany({
      where: { checkInAt: { gte: startOfDay } },
    });
    const tokens = await prisma.entryToken.deleteMany({ where: { usedAt: null } });
    const events = await prisma.entryEvent.deleteMany({
      where: { createdAt: { gte: startOfDay } },
    });

    return {
      attendanceDeleted: attendance.count,
      tokensDeleted: tokens.count,
      entryEventsDeleted: events.count,
    };
  });
}
