import fp from 'fastify-plugin';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { HttpError } from '../utils/errors';
import { prisma } from '../utils/prisma';
import { hashToken } from '../utils/tokens';

export type AuthenticatedDevice = { id: string; gymId: string };

declare module 'fastify' {
  interface FastifyInstance {
    authenticateDevice: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    device: AuthenticatedDevice | null;
  }
}

const DEVICE_AUTH_PATTERN = /^Device\s+(\S+)$/i;

export function requireDevice(request: FastifyRequest): AuthenticatedDevice {
  if (!request.device) {
    throw new HttpError(401, 'Nepoznat uređaj');
  }
  return request.device;
}

export default fp(async (app) => {
  app.decorateRequest('device', null);

  app.decorate('authenticateDevice', async (request: FastifyRequest, reply: FastifyReply) => {
    const key = DEVICE_AUTH_PATTERN.exec(request.headers.authorization ?? '')?.[1];
    const device = key
      ? await prisma.device.findUnique({
          where: { keyHash: hashToken(key) },
          select: { id: true, gymId: true, revokedAt: true },
        })
      : null;

    if (!device || device.revokedAt) {
      return reply.code(401).send({ statusCode: 401, message: 'Nepoznat uređaj' });
    }

    request.device = { id: device.id, gymId: device.gymId };
  });
});
