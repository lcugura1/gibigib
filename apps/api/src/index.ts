import Fastify from 'fastify';
import type { ApiHealthResponse } from '@gibigib/types';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '0.0.0.0';

const app = Fastify({
  logger: true,
});

app.get('/health', async (): Promise<ApiHealthResponse> => {
  return { status: 'ok', service: 'gibigib-api' };
});

try {
  await app.listen({ port, host });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
