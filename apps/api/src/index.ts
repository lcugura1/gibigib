import Fastify from 'fastify';
import type { ApiHealthResponse } from '@gibigib/types';
import { prisma } from './utils/prisma';
import { env } from './config/env';
import jwtPlugin from './plugins/jwt';
import { authRoutes } from './routes/auth';
import { errorHandler } from './middleware/error-handler';

const port = Number(env.PORT ?? 3000);
const host = env.HOST ?? '0.0.0.0';

const app = Fastify({
  logger: true,
});

app.setErrorHandler(errorHandler);
app.decorate('prisma', prisma);

await app.register(jwtPlugin);
await app.register(authRoutes, { prefix: '/auth' });

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
