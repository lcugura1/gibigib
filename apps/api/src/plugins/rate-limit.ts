import rateLimit from '@fastify/rate-limit';
import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { HttpError } from '../utils/errors';

const TOO_MANY_REQUESTS = 'Previše zahtjeva. Pokušaj ponovno malo kasnije.';

type LimitKey = (request: FastifyRequest) => string;

export const byIp: LimitKey = (request) => request.ip;

// Keys on the email in the body, so guessing against one account is capped from any number of IPs.
export const byEmail: LimitKey = (request) => {
  const email = (request.body as { email?: unknown } | undefined)?.email;
  return typeof email === 'string' ? email.trim().toLowerCase() : request.ip;
};

// The plugin runs only one of its own hooks per request, and the global one always runs first,
// so route limits are checked here with createRateLimit. Several can be stacked on one route.
export function limitRequests(
  app: FastifyInstance,
  name: string,
  options: { max: number; timeWindow: string; key: LimitKey },
) {
  const check = app.createRateLimit({
    max: options.max,
    timeWindow: options.timeWindow,
    keyGenerator: (request) => `${name}:${options.key(request)}`,
  });

  return async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await check(request);
    if (!result.isAllowed && result.isExceeded) {
      reply.header('retry-after', result.ttlInSeconds);
      throw new HttpError(429, TOO_MANY_REQUESTS);
    }
  };
}

export default fp(async (app) => {
  // A loose ceiling per IP for every route; stricter limits sit on the routes that need them.
  await app.register(rateLimit, {
    global: true,
    max: 1200,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: TOO_MANY_REQUESTS,
    }),
  });
});
