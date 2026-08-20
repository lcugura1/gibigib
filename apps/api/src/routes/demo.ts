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
    const lockers = await prisma.locker.updateMany({ data: { status: 'UNLOCKED' } });

    return {
      attendanceDeleted: attendance.count,
      tokensDeleted: tokens.count,
      lockersReset: lockers.count,
    };
  });
}
