import fp from 'fastify-plugin';
import type { FastifyRequest } from 'fastify';
import type { DeviceKind } from '../generated/prisma/client';
import { HttpError } from '../utils/errors';
import { prisma } from '../utils/prisma';
import { hashToken } from '../utils/tokens';

export type AuthenticatedDevice = { id: string; gymId: string };

declare module 'fastify' {
  interface FastifyInstance {
    // A scanner key cannot poll door commands and a door key cannot scan.
    authenticateDevice: (kind: DeviceKind) => (request: FastifyRequest) => Promise<void>;
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

  app.decorate('authenticateDevice', (kind: DeviceKind) => async (request: FastifyRequest) => {
    const key = DEVICE_AUTH_PATTERN.exec(request.headers.authorization ?? '')?.[1];
    const device = key
      ? await prisma.device.findUnique({
          where: { keyHash: hashToken(key) },
          select: { id: true, gymId: true, kind: true, revokedAt: true },
        })
      : null;

    if (!device || device.revokedAt) {
      throw new HttpError(401, 'Nepoznat uređaj');
    }
    if (device.kind !== kind) {
      throw new HttpError(403, 'Uređaj nema ovlast za ovu radnju');
    }

    request.device = { id: device.id, gymId: device.gymId };
  });
});
