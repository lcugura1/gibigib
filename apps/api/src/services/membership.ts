import type { MembershipDto, PurchaseMembershipInput } from '@gibigib/types';
import type { Membership, MembershipProgram } from '../generated/prisma/client';
import { HttpError } from '../utils/errors';
import { prisma } from '../utils/prisma';

const DAY_MS = 86_400_000;
const FAKE_PAYMENT_DELAY_MS = 700;

function toMembershipDto(membership: Membership & { program: MembershipProgram }): MembershipDto {
  return {
    id: membership.id,
    status: membership.status,
    startDate: membership.startDate.toISOString(),
    endDate: membership.endDate.toISOString(),
    program: {
      slug: membership.program.slug,
      name: membership.program.name,
      durationDays: membership.program.durationDays,
    },
  };
}

function findActiveMembership(userId: string) {
  return prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE', endDate: { gt: new Date() } },
    orderBy: { endDate: 'desc' },
    include: { program: true },
  });
}

export async function getActiveMembership(userId: string): Promise<MembershipDto | null> {
  const membership = await findActiveMembership(userId);
  return membership ? toMembershipDto(membership) : null;
}

export async function purchaseMembership(
  userId: string,
  input: PurchaseMembershipInput,
): Promise<MembershipDto> {
  const program = await prisma.membershipProgram.findFirst({
    where: { slug: input.programSlug, isActive: true },
  });

  if (!program) {
    throw new HttpError(404, 'Program nije pronađen');
  }

  await new Promise((resolve) => setTimeout(resolve, FAKE_PAYMENT_DELAY_MS));

  const now = new Date();
  const active = await findActiveMembership(userId);

  const membership = active
    ? await prisma.membership.update({
        where: { id: active.id },
        data: {
          programId: program.id,
          endDate: new Date(active.endDate.getTime() + program.durationDays * DAY_MS),
        },
        include: { program: true },
      })
    : await prisma.membership.create({
        data: {
          userId,
          programId: program.id,
          startDate: now,
          endDate: new Date(now.getTime() + program.durationDays * DAY_MS),
        },
        include: { program: true },
      });

  return toMembershipDto(membership);
}
