import { randomBytes, createHash, randomInt, timingSafeEqual } from 'node:crypto';

export function generateRefreshToken(): string {
  return randomBytes(32).toString('hex');
}

export function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function hashesMatch(a: string, b: string): boolean {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');
  return left.length === right.length && timingSafeEqual(left, right);
}