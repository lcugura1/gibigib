import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET_KEY: z
    .string()
    .min(32, 'JWT_SECRET_KEY must be at least 32 characters, e.g. openssl rand -base64 48')
    .refine(
      (value) => !/replace|change[-_]?me|example|secret/i.test(value),
      'JWT_SECRET_KEY still holds a placeholder; generate one with openssl rand -base64 48',
    ),
  ACCESS_TOKEN_TTL: z.string(),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number(),
  PORT: z.coerce.number(),
  HOST: z.string(),
  DEMO_RESET: z.string().optional(),
  ENTRY_ANTI_PASSBACK_MINUTES: z.coerce.number().int().min(0).default(30),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error.issues);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;