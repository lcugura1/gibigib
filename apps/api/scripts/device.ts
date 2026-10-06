// Manages scanner and door devices: pnpm --filter @gibigib/api device <create|list|revoke> [options]
import { randomBytes } from 'node:crypto';
import { parseArgs } from 'node:util';
import { prisma } from '../src/utils/prisma';
import { hashToken } from '../src/utils/tokens';

const USAGE = `Usage:
  device create --name "Varaždin – glavni ulaz" [--gym <gymId>]
  device list
  device revoke --id <deviceId>`;

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    name: { type: 'string' },
    gym: { type: 'string' },
    id: { type: 'string' },
  },
});

async function create() {
  if (!values.name) {
    throw new Error(USAGE);
  }
  const gym = values.gym
    ? await prisma.gym.findUniqueOrThrow({ where: { id: values.gym } })
    : await prisma.gym.findFirstOrThrow();

  const key = randomBytes(32).toString('base64url');
  const device = await prisma.device.create({
    data: { name: values.name, gymId: gym.id, keyHash: hashToken(key) },
  });

  console.log(`Device "${device.name}" (${device.id}) created for gym "${gym.name}".`);
  console.log(`Key, shown only once. Store it on the device:\n\n  ${key}\n`);
}

async function list() {
  const devices = await prisma.device.findMany({
    include: { gym: { select: { name: true } } },
    orderBy: { createdAt: 'asc' },
  });
  for (const device of devices) {
    const state = device.revokedAt ? `revoked ${device.revokedAt.toISOString()}` : 'active';
    console.log(`${device.id}  ${device.name}  (${device.gym.name}, ${state})`);
  }
}

async function revoke() {
  if (!values.id) {
    throw new Error(USAGE);
  }
  const device = await prisma.device.update({
    where: { id: values.id },
    data: { revokedAt: new Date() },
  });
  console.log(`Device "${device.name}" revoked.`);
}

const commands: Record<string, () => Promise<void>> = { create, list, revoke };
const command = commands[positionals[0] ?? ''];

try {
  if (!command) {
    throw new Error(USAGE);
  }
  await command();
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
