import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  API_URL: z.url(),
  DEVICE_KEY: z.string().min(1, 'DEVICE_KEY must hold a scanner key from `device create --kind scanner`'),
  HIKVISION_URL: z.url(),
  HIKVISION_USERNAME: z.string().min(1),
  HIKVISION_PASSWORD: z.string().min(1),
  HIKVISION_DOOR: z.coerce.number().int().positive().default(1),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error.issues);
  throw new Error('Invalid environment variables');
}

export const config = parsed.data;
