const SERIES = ['var(--tag-lime)', 'var(--tag-blue)', 'var(--tag-orange)', 'var(--tag-violet)'] as const;

const PLAN_ORDER = ['mjesecno', 'grupni', 'godisnji', 'trener'];

export const seriesColor = (index: number) => SERIES[index % SERIES.length] ?? SERIES[0];

export function gymColor(gymIds: readonly string[], gymId: string) {
  return seriesColor(Math.max(0, gymIds.indexOf(gymId)));
}

export function planColor(slug: string) {
  return seriesColor(Math.max(0, PLAN_ORDER.indexOf(slug)));
}
