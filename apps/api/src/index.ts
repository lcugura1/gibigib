import { join } from 'node:path';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import type { ApiHealthResponse } from '@gibigib/types';
import { prisma } from './utils/prisma';
import { env } from './config/env';
import jwtPlugin from './plugins/jwt';
import { authRoutes } from './routes/auth';
import { attendanceRoutes } from './routes/attendance';
import { demoRoutes } from './routes/demo';
import { deviceRoutes } from './routes/device';
import { entryRoutes } from './routes/entry';
import { lockerRoutes } from './routes/lockers';
import { membershipRoutes } from './routes/memberships';
import { occupancyRoutes } from './routes/occupancy';
import { profileRoutes } from './routes/profile';
import { errorHandler } from './middleware/error-handler';

const port = Number(env.PORT ?? 3000);
const host = env.HOST ?? '0.0.0.0';

const app = Fastify({
  logger: true,
  bodyLimit: 6 * 1024 * 1024,
});

app.setErrorHandler(errorHandler);
app.decorate('prisma', prisma);

await app.register(jwtPlugin);
await app.register(authRoutes, { prefix: '/auth' });
await app.register(attendanceRoutes, { prefix: '/attendance' });
await app.register(membershipRoutes, { prefix: '/memberships' });
await app.register(profileRoutes, { prefix: '/profile' });
await app.register(entryRoutes, { prefix: '/entry' });
await app.register(occupancyRoutes);
await app.register(lockerRoutes);
await app.register(deviceRoutes, { prefix: '/device', logLevel: 'warn' });
await app.register(fastifyStatic, {
  root: join(import.meta.dirname, '../public'),
  prefix: '/scanner/',
  index: 'index.html',
});
app.get('/scanner', async (_request, reply) => reply.redirect('/scanner/'));

if (env.DEMO_RESET === '1') {
  await app.register(demoRoutes, { prefix: '/demo' });
}

app.addHook('onClose', async () => {
  await prisma.$disconnect();
});

app.get('/health', async (): Promise<ApiHealthResponse> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', service: 'gibigib-api', database: 'up' };
  } catch (err) {
    app.log.error(err);
    return { status: 'degraded', service: 'gibigib-api', database: 'down' };
  }
});

const shutdown = async () => {
  await app.close();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

try {
  await app.listen({ port, host });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
