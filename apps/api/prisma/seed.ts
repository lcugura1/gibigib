import { prisma } from '../src/utils/prisma';

const programs = [
  {
    slug: 'mjesecno',
    name: 'Mjesečno',
    description: 'Neograničen pristup teretani tijekom jednog mjeseca.',
    durationDays: 30,
    priceCents: 2999,
  },
  {
    slug: 'grupni',
    name: 'Grupni program',
    description: 'Pristup teretani uz vođene grupne treninge.',
    durationDays: 30,
    priceCents: 3999,
  },
  {
    slug: 'godisnji',
    name: 'Godišnji',
    description: 'Neograničen pristup teretani tijekom dvanaest mjeseci.',
    durationDays: 365,
    priceCents: 25000,
  },
];

const existingGym = await prisma.gym.findFirst();
if (!existingGym) {
  await prisma.gym.create({
    data: {
      name: 'Varaždin I',
      city: 'Varaždin',
      address: 'Podravska ulica 14, 42000 Varaždin',
      workingHours: 'Pon – Pet 06:00 – 22:00',
      capacity: 120,
    },
  });
}

for (const program of programs) {
  await prisma.membershipProgram.upsert({
    where: { slug: program.slug },
    update: program,
    create: program,
  });
}

for (const number of [1, 2]) {
  await prisma.locker.upsert({
    where: { number },
    update: {},
    create: { number },
  });
}

console.log('Seed done: gym, programs, lockers');
await prisma.$disconnect();
