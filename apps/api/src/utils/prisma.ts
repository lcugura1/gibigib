import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set — check apps/api/.env');
}

// Prisma 7 connects through a driver adapter; PrismaPg drives PostgreSQL.
const adapter = new PrismaPg({ connectionString });

// Single shared Prisma instance for the whole API process.
export const prisma = new PrismaClient({ adapter });

// Make the instance available as `app.prisma` / `request.server.prisma`.
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
