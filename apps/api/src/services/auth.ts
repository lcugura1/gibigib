import type { LoginInput, RegisterInput } from "@gibigib/types";
import { prisma } from "../utils/prisma";
import { hashPassword, verifyPassword } from "../utils/hash";
import { generateRefreshToken, hashToken } from '../utils/tokens';
import { env } from '../config/env';

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

  if (!user || !(await verifyPassword(user.passwordHash, input.password))) {
    throw new Error("Neuspješna prijava");
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
        throw new Error("Nevažeći ili istekao refresh token");
    }

    await prisma.refreshToken.delete({ where: { id: existing.id } });
    return issueRefreshToken(existing.userId);
}

export async function revokeRefreshToken(plainToken: string) {
    await prisma.refreshToken.deleteMany({
        where: { tokenHash: hashToken(plainToken) },
    });
}