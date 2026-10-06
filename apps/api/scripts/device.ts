// Manages scanner and door devices: pnpm --filter @gibigib/api device <create|list|revoke> [options]
import { randomBytes } from 'node:crypto';
import { parseArgs } from 'node:util';
import { prisma } from '../src/utils/prisma';
import { hashToken } from '../src/utils/tokens';

const USAGE = `Usage:
  device create --kind scanner|door --name "Varaždin – glavni ulaz" [--gym <gymId>]
  device list
  device revoke --id <deviceId>

--gym may be left out only while there is a single gym.`;

const KINDS = { scanner: 'SCANNER', door: 'DOOR' } as const;

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    kind: { type: 'string' },
    name: { type: 'string' },
    gym: { type: 'string' },
    id: { type: 'string' },
  },
});

async function create() {
  const kind = KINDS[values.kind as keyof typeof KINDS];
  if (!values.name || !kind) {
    throw new Error(USAGE);
  }

  const gym = values.gym
    ? await prisma.gym.findUnique({ where: { id: values.gym } })
    : await prisma.gym.findFirst();
  if (!gym) {
    throw new Error(values.gym ? `No gym with id ${values.gym}.` : 'No gym in the database; run db:seed first.');
  }
  if (!values.gym && (await prisma.gym.count()) > 1) {
    throw new Error('There is more than one gym; pass --gym <gymId>.');
  }

  const key = randomBytes(32).toString('base64url');
  const device = await prisma.device.create({
    data: { name: values.name, kind, gymId: gym.id, keyHash: hashToken(key) },
  });

  console.log(`${device.kind} "${device.name}" (${device.id}) created for gym "${gym.name}".`);
  console.log(`Key, shown only once. Store it on the device:\n\n  ${key}\n`);
}

async function list() {
  const devices = await prisma.device.findMany({
    include: { gym: { select: { name: true } } },
    orderBy: { createdAt: 'asc' },
  });
  for (const device of devices) {
    const state = device.revokedAt ? `revoked ${device.revokedAt.toISOString()}` : 'active';
    console.log(`${device.id}  ${device.kind}  ${device.name}  (${device.gym.name}, ${state})`);
  }
}

async function revoke() {
  if (!values.id) {
    throw new Error(USAGE);
  }
  const { count } = await prisma.device.updateMany({
    where: { id: values.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  console.log(count ? `Device ${values.id} revoked.` : `No active device with id ${values.id}.`);
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
