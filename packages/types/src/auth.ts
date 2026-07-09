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

export const forgotPasswordSchema = z.object({
  email: z.email('Unesite ispravnu e-adresu'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.email('Unesite ispravnu e-adresu'),
  code: z.string().regex(/^\d{6}$/, 'Kod mora imati 6 znamenki'),
  password: z.string().min(8, 'Lozinka mora imati barem 8 znakova'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const updateAvatarSchema = z.object({
  avatar: z
    .string()
    .startsWith('data:image/', 'Neispravan format slike')
    .max(4_000_000, 'Slika je prevelika'),
});

export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
