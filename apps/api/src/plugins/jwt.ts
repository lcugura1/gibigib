import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../config/env';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string; role: 'MEMBER' | 'ADMIN' };
    user: { userId: string; role: 'MEMBER' | 'ADMIN' };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET_KEY,
    sign: { expiresIn: env.ACCESS_TOKEN_TTL },
  });

  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ message: 'Unauthorized' });
    }
  });
});
