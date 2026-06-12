import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Unesite ispravnu e-adresu'),
  password: z.string().min(8, 'Lozinka mora imati barem 8 znakova'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z.email('Unesite ispravnu e-adresu'),
    password: z.string().min(8, 'Lozinka mora imati barem 8 znakova'),
    firstName: z.string().min(1, 'Ime je obavezno'),
    lastName: z.string().min(1, 'Prezime je obavezno'),
    birthDate: z.string().min(1, 'Datum rođenja je obavezan'),
    address: z.string().min(1, 'Adresa je obavezna'),
    oib: z.string().regex(/^\d{11}$/, 'Unesite ispravan OIB'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
