import type { AttendanceVisitDto, MonthlyGoalDto, TrainingTagInput, VisitDto } from '@gibigib/types';
import { authedFetch } from '@/shared/api';

export function fetchVisits() {
  return authedFetch<VisitDto[]>('/attendance');
}

export function fetchEntryVisits() {
  return authedFetch<AttendanceVisitDto[]>('/attendance/visits');
}

export function saveTag(input: TrainingTagInput) {
  return authedFetch<VisitDto>('/attendance/tag', {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function fetchGoal() {
  return authedFetch<MonthlyGoalDto>('/attendance/goal');
}

export function saveGoal(goal: number) {
  return authedFetch<MonthlyGoalDto>('/attendance/goal', {
    method: 'PUT',
    body: JSON.stringify({ goal }),
  });
}
