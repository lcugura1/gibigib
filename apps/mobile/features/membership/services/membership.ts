import type { ActiveMembership } from '@/features/membership/types/membership';

const DAY_MS = 86_400_000;

// hardcoded stub for now, TODO: implement real membership service
// endDate is anchored once so every caller (home card, expiry popup, ...) reads
// the same fixed date instead of a fresh "30 days from now" per call

const STUB_DAYS_LEFT = 30;
let stubEndDate: string | null = null;

export async function getActiveMembership(): Promise<ActiveMembership | null> {
  if (!stubEndDate) {
    stubEndDate = new Date(Date.now() + STUB_DAYS_LEFT * DAY_MS).toISOString();
  }
  return {
    endDate: stubEndDate,
    status: 'ACTIVE',
    program: { name: 'Mjesečno', durationDays: 30 },
  };
}
