import type { LoginInput, RegisterInput, ResetPasswordInput } from "@gibigib/types";
import { prisma } from "../utils/prisma";
import { hashPassword, verifyPassword } from "../utils/hash";
import { generateOtp, generateRefreshToken, hashToken } from "../utils/tokens";
import { env } from "../config/env";
import { HttpError } from '../utils/errors';
import { sendPasswordResetEmail } from './email';

const RESET_TTL_MS = 15 * 60 * 1000;

export async function registerUser(input: RegisterInput) {
  const passwordHash = await hashPassword(input.password);

  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      birthDate: new Date(input.birthDate),
      address: input.address,
      oib: input.oib,
    },
    omit: { passwordHash: true },
  });
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new HttpError(401, 'Neispravni podaci za prijavu');

  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

const REFRESH_TTL_MS = env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

export async function issueRefreshToken(userId: string) {
  const token = generateRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function rotateRefreshToken(plainToken: string) {
  const existing = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(plainToken) },
  });

  if (!existing || existing.expiresAt < new Date()) {
    throw new HttpError(401, "Nevažeći refresh token");
  }

  await prisma.refreshToken.delete({ where: { id: existing.id } });
  const { token: refreshToken } = await issueRefreshToken(existing.userId);
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: existing.userId },
    omit: { passwordHash: true },
  });

  return { user, refreshToken };
}

export async function revokeRefreshToken(plainToken: string) {
  await prisma.refreshToken.deleteMany({
    where: { tokenHash: hashToken(plainToken) },
  });
}

export async function getUserById(userId: string) {
    return prisma.user.findUniqueOrThrow({
        where: { id: userId },
        omit: { passwordHash: true },
    })
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(404, 'Korisnik s tom e-adresom ne postoji');
  }

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const code = generateOtp();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      codeHash: hashToken(code),
      expiresAt: new Date(Date.now() + RESET_TTL_MS),
    },
  });

  await sendPasswordResetEmail(email, code);
}

export async function resetPassword(input: ResetPasswordInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const token = user
    ? await prisma.passwordResetToken.findFirst({ where: { userId: user.id } })
    : null;

  if (!user || !token || token.expiresAt < new Date() || token.codeHash !== hashToken(input.code)) {
    throw new HttpError(400, 'Neispravan ili istekao kod');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(input.password) },
  });
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
}
