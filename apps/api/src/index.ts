import Fastify from 'fastify';
import type { ApiHealthResponse } from '@gibigib/types';
import { prisma } from './utils/prisma';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '0.0.0.0';

const app = Fastify({
  logger: true,
});

// Expose the Prisma client to routes via `request.server.prisma`.
app.decorate('prisma', prisma);

// Close the database connection when the server shuts down.
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
