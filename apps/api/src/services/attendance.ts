import type { MonthlyGoalDto, TrainingTagInput, VisitDto } from '@gibigib/types';
import type { TrainingTag } from '../generated/prisma/client';
import { prisma } from '../utils/prisma';

function toVisitDto(tag: TrainingTag): VisitDto {
  return {
    id: tag.id,
    date: tag.date.toISOString().slice(0, 10),
    time: tag.time ?? undefined,
    color: tag.color,
    label: tag.label,
  };
}

export async function listTrainingTags(userId: string): Promise<VisitDto[]> {
  const tags = await prisma.trainingTag.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  });

  return tags.map(toVisitDto);
}

export async function upsertTrainingTag(
  userId: string,
  input: TrainingTagInput,
): Promise<VisitDto> {
  const date = new Date(`${input.date}T00:00:00Z`);

  const tag = await prisma.trainingTag.upsert({
    where: { userId_date: { userId, date } },
    create: {
      userId,
      date,
      time: input.time,
      color: input.color,
      label: input.label,
    },
    update: {
      time: input.time,
      color: input.color,
      label: input.label,
    },
  });

  return toVisitDto(tag);
}

export async function getMonthlyGoal(userId: string): Promise<MonthlyGoalDto> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { monthlyTrainingGoal: true },
  });

  return { goal: user.monthlyTrainingGoal ?? null };
}

export async function setMonthlyGoal(userId: string, goal: number): Promise<MonthlyGoalDto> {
  await prisma.user.update({
    where: { id: userId },
    data: { monthlyTrainingGoal: goal },
  });

  return { goal };
}
