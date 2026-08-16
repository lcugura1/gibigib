import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET_KEY: z.string().min(32),
  ACCESS_TOKEN_TTL: z.string(),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number(),
  PORT: z.coerce.number(),
  HOST: z.string(),
  DEMO_RESET: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error.issues);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;