import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthDate: z.string(),
    address: z.string().min(1),
    oib: z.string().regex(/^\d{11}$/),
});

export type RegisterInput = z.infer<typeof registerSchema>;
