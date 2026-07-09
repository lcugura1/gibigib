import { prisma } from '../utils/prisma';

export async function updateAvatar(userId: string, avatar: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: avatar },
    omit: { passwordHash: true },
  });
}

export async function removeAvatar(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: null },
    omit: { passwordHash: true },
  });
}
