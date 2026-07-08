import type { ActiveMembership } from '@/features/membership/types/membership';

const DAY_MS = 86_400_000;

// hardcoded stub for now, TODO: implement real membership service

const STUB_DAYS_LEFT = 30;

export async function getActiveMembership(): Promise<ActiveMembership | null> {
  const endDate = new Date(Date.now() + STUB_DAYS_LEFT * DAY_MS).toISOString();
  return {
    endDate,
    status: 'ACTIVE',
    program: { name: 'Mjesečno', durationDays: 30 },
  };
}
