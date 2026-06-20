export type Visit = {
  id: string;
  date: string;
  time: string;
  color?: string;
  label?: string;
};

export type TagStat = {
  label: string;
  color: string;
  count: number;
};

export const TAG_COLORS = [
  '#C5F23D',
  '#4DA3FF',
  '#FF9F45',
  '#FF6B8A',
  '#B57BFF',
  '#3DDC97',
];

export const initialVisits: Visit[] = [
  { id: "1", date: "2026-06-11", time: "09:00", color: '#C5F23D', label: 'Push' },
  { id: "2", date: "2026-06-12", time: "10:00", color: '#4DA3FF', label: 'Pull' },
  { id: "3", date: "2026-06-13", time: "11:00", color: '#FF9F45', label: 'Squat' },
  { id: "4", date: "2026-06-14", time: "12:00", color: '#FF6B8A', label: 'Deadlift' },
  { id: "5", date: "2026-06-15", time: "13:00", color: '#B57BFF', label: 'Bench Press' },
  { id: "6", date: "2026-06-16", time: "14:00", color: '#3DDC97', label: 'Overhead Press' },
];

export const MONTHS_HR = [
  "Siječanj",
  "Veljača",
  "Ožujak",
  "Travanj",
  "Svibanj",
  "Lipanj",
  "Srpanj",
  "Kolovoz",
  "Rujan",
  "Listopad",
  "Studeni",
  "Prosinac",
];

export const MONTHS_HR_SHORT = [
  "Sij",
  "Velj",
  "Ožu",
  "Tra",
  "Svi",
  "Lip",
  "Srp",
  "Kol",
  "Ruj",
  "Lis",
  "Stu",
  "Pro",
];

export const WEEKDAYS_HR = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

function parseLocalDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toISODate(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function buildMonthGrid(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = [];
  for (let i = 0; i < leadingBlanks; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

  return cells;
}

export function visitedDaysInMonth(visits: Visit[], year: number, month: number) {
  return new Set(
    visits
      .map((visit) => parseLocalDate(visit.date))
      .filter(
        (date) => date.getFullYear() === year && date.getMonth() === month,
      )
      .map((date) => date.getDate()),
  );
}

export function formatVisitDate(iso: string) {
    const date = parseLocalDate(iso);
    const weekday = WEEKDAYS_HR[(date.getDay() + 6) % 7];
    return `${weekday}, ${date.getDate()} ${MONTHS_HR_SHORT[date.getMonth()]}`;
}

export function tagStats(visits: Visit[]): TagStat[] {
  const map = new Map<string, TagStat>();
  for (const visit of visits) {
    if (!visit.label || !visit.color) continue;
    const existing = map.get(visit.label);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(visit.label, { label: visit.label, color: visit.color, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function visitsByDayInMonth(visits: Visit[], year: number, month: number) {
  const map = new Map<number, Visit>();
  for (const visit of visits) {
    const date = parseLocalDate(visit.date);
    if (date.getFullYear() === year && date.getMonth() === month) {
      map.set(date.getDate(), visit);
    }
  }
  return map;
}