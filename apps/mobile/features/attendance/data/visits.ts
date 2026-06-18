export type Visit = {
  id: string;
  date: string;
  time: string;
};

export const visits: Visit[] = [
  { id: "1", date: "2026-06-11", time: "09:00" },
  { id: "2", date: "2026-06-12", time: "10:00" },
  { id: "3", date: "2026-06-13", time: "11:00" },
  { id: "4", date: "2026-06-14", time: "12:00" },
  { id: "5", date: "2026-06-15", time: "13:00" },
  { id: "6", date: "2026-06-16", time: "14:00" },
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

export function buildMonthGrid(year: number, month: number) {
  const dayIsMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = [];
  for (let i = 0; i < leadingBlanks; i += 1) cells.push(null);
  for (let day = 1; day <= dayIsMonth; day += 1) cells.push(day);

  return cells;
}

export function visitedDaysInMonth(year: number, month: number) {
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
