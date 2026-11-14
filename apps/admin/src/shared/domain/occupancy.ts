export type Level = 'ok' | 'warn' | 'danger';

export interface OccupancyLevel {
  level: Level;
  label: string;
}

export function occupancyLevel(count: number, capacity: number): OccupancyLevel {
  const share = capacity === 0 ? 0 : count / capacity;
  if (share >= 0.8) return { level: 'danger', label: 'Velika gužva' };
  if (share >= 0.5) return { level: 'warn', label: 'Umjerena gužva' };
  return { level: 'ok', label: 'Ugodno' };
}
