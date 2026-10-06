import type { AuthenticatedDevice } from '../plugins/device-auth';
import { prisma } from '../utils/prisma';

const DOOR_COMMAND_TTL_MS = 5000;

export async function queueDoorOpen(gymId: string) {
  await prisma.doorCommand.create({
    data: { gymId, expiresAt: new Date(Date.now() + DOOR_COMMAND_TTL_MS) },
  });
}

export async function consumeDoorCommand(device: AuthenticatedDevice): Promise<'open' | 'idle'> {
  const now = new Date();
  // A conditional update claims pending commands atomically, so a command opens the door once.
  const { count } = await prisma.doorCommand.updateMany({
    where: { gymId: device.gymId, consumedAt: null, expiresAt: { gt: now } },
    data: { consumedAt: now, consumedByDeviceId: device.id },
  });
  return count > 0 ? 'open' : 'idle';
}
