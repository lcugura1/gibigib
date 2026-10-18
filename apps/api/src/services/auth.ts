import { randomBytes } from "node:crypto";
import type { LoginInput, RegisterInput, ResetPasswordInput } from "@gibigib/types";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../utils/prisma";
import { hashPassword, needsRehash, verifyPassword } from "../utils/hash";
import { generateOtp, generateRefreshToken, hashesMatch, hashToken } from "../utils/tokens";
import { env } from "../config/env";
import { HttpError } from '../utils/errors';
import { sendPasswordResetEmail } from './email';

const RESET_TTL_MS = 15 * 60 * 1000;
const RESET_MAX_ATTEMPTS = 5;
const RESET_RESEND_COOLDOWN_MS = 60 * 1000;
const INVALID_RESET_CODE = 'Neispravan ili istekao kod. Ako si ga više puta krivo upisao, zatraži novi.';

// Verifying against a throwaway hash keeps login equally slow whether or not the email exists.
let dummyPasswordHash: Promise<string> | undefined;
function getDummyPasswordHash() {
  return (dummyPasswordHash ??= hashPassword(randomBytes(16).toString('hex')));
}

export async function registerUser(input: RegisterInput) {
  const passwordHash = await hashPassword(input.password);

  try {
    return await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        birthDate: new Date(`${input.birthDate}T00:00:00.000Z`),
        address: input.address,
        oib: input.oib,
      },
      omit: { passwordHash: true },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new HttpError(
        409,
        'Registracija s tim podacima nije moguća. Ako već imaš račun, prijavi se ili obnovi lozinku.',
      );
    }
    throw err;
  }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const passwordMatches = await verifyPassword(
    input.password,
    user?.passwordHash ?? (await getDummyPasswordHash()),
  );

  if (!user || !passwordMatches) {
    throw new HttpError(401, 'Neispravni podaci za prijavu');
  }

  if (needsRehash(user.passwordHash)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(input.password) },
    });
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
  // The route answers the same either way, so it does not reveal who has an account.
  if (!user) {
    return;
  }

  // Keeps the current code valid when new ones are requested in a loop to lock the member out.
  const recentCode = await prisma.passwordResetToken.findFirst({
    where: { userId: user.id, createdAt: { gt: new Date(Date.now() - RESET_RESEND_COOLDOWN_MS) } },
  });
  if (recentCode) {
    return;
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

  // Sent in the background so the response time does not reveal whether the account exists.
  sendPasswordResetEmail(email, code, RESET_TTL_MS / 60_000).catch((err: { code?: string }) => {
    // Only the error code: SMTP messages can contain the recipient's address.
    console.error(`[email] password reset email failed: ${err?.code ?? 'unknown error'}`);
  });
}

export async function resetPassword(input: ResetPasswordInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const token = user
    ? await prisma.passwordResetToken.findFirst({ where: { userId: user.id } })
    : null;

  if (!user || !token || token.expiresAt < new Date()) {
    throw new HttpError(400, INVALID_RESET_CODE);
  }

  // Claims an attempt before comparing, so parallel guesses cannot go past the limit.
  const claimed = await prisma.passwordResetToken.updateMany({
    where: { id: token.id, attempts: { lt: RESET_MAX_ATTEMPTS } },
    data: { attempts: { increment: 1 } },
  });
  if (claimed.count === 0) {
    await prisma.passwordResetToken.deleteMany({ where: { id: token.id } });
    throw new HttpError(400, INVALID_RESET_CODE);
  }
  if (!hashesMatch(token.codeHash, hashToken(input.code))) {
    throw new HttpError(400, INVALID_RESET_CODE);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(input.password) },
  });
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
}
