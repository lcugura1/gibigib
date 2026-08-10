import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Unesite ispravnu e-adresu'),
  password: z.string().min(8, 'Lozinka mora imati barem 8 znakova'),
});

export type LoginInput = z.infer<typeof loginSchema>;

const croatianDatePattern = /^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/;

function isRealCalendarDate(value: string) {
  const [year = 0, month = 0, day = 0] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export const birthDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Neispravan datum rođenja')
  .refine(isRealCalendarDate, 'Neispravan datum rođenja')
  .refine((value) => value >= '1900-01-01', 'Unesite ispravan datum rođenja')
  .refine((value) => value <= todayIso(), 'Datum rođenja ne može biti u budućnosti');

export const birthDateInputSchema = z
  .string()
  .trim()
  .min(1, 'Datum rođenja je obavezan')
  .regex(croatianDatePattern, 'Unesite datum u obliku DD.MM.GGGG')
  .transform((value) => {
    const [day = '', month = '', year = ''] = croatianDatePattern.exec(value)?.slice(1) ?? [];
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  })
  .pipe(birthDateSchema);

export const registerSchema = z.object({
    email: z.email('Unesite ispravnu e-adresu'),
    password: z.string().min(8, 'Lozinka mora imati barem 8 znakova'),
    firstName: z.string().min(1, 'Ime je obavezno'),
    lastName: z.string().min(1, 'Prezime je obavezno'),
    birthDate: birthDateSchema,
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
