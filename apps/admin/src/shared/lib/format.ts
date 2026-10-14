const LOCALE = 'hr-HR';

const integer = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const currency = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'EUR' });
const percent = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 0 });
const time = new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' });
const longWeekday = new Intl.DateTimeFormat(LOCALE, { weekday: 'long' });
const shortWeekday = new Intl.DateTimeFormat(LOCALE, { weekday: 'short' });
const monthName = new Intl.DateTimeFormat(LOCALE, { month: 'long' });
const shortMonth = new Intl.DateTimeFormat(LOCALE, { month: 'short' });
const dayAndMonthName = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long' });
const plural = new Intl.PluralRules(LOCALE);

const MINUS = '−';

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const formatInteger = (value: number) => integer.format(value);

export const formatDecimal = (value: number) => oneDecimal.format(value);

export const formatCurrency = (value: number) => currency.format(value);

export const formatShare = (part: number, whole: number) => percent.format(whole === 0 ? 0 : part / whole);

export const formatSigned = (value: number, format: (abs: number) => string = formatInteger) =>
  `${value < 0 ? MINUS : value === 0 ? '±' : '+'}${format(Math.abs(value))}`;

export const formatTime = (iso: string) => time.format(new Date(iso));

const dayMonthOf = (date: Date) => `${date.getDate()}. ${date.getMonth() + 1}.`;

export const formatDayMonth = (iso: string) => dayMonthOf(new Date(iso));

export function formatDate(iso: string) {
  const date = new Date(iso);
  return `${dayMonthOf(date)} ${date.getFullYear()}.`;
}

export function formatFullDate(iso: string) {
  const date = new Date(iso);
  return `${capitalize(longWeekday.format(date))}, ${dayMonthOf(date)} ${date.getFullYear()}.`;
}

export const formatWeekdayShort = (iso: string) => capitalize(shortWeekday.format(new Date(iso)));

export const formatMonth = (iso: string) => monthName.format(new Date(iso));

export const formatMonthShort = (iso: string) => capitalize(shortMonth.format(new Date(iso)));

export const formatMonthGenitive = (iso: string) =>
  dayAndMonthName.formatToParts(new Date(iso)).find((part) => part.type === 'month')?.value ?? '';

export function pluralize(count: number, forms: { one: string; few: string; other: string }) {
  const category = plural.select(count);
  return category === 'one' || category === 'few' ? forms[category] : forms.other;
}

export const formatMembers = (count: number) =>
  `${formatInteger(count)} ${pluralize(count, { one: 'član', few: 'člana', other: 'članova' })}`;

export const formatMembersGenitive = (count: number) =>
  `${formatInteger(count)} ${pluralize(count, { one: 'člana', few: 'člana', other: 'članova' })}`;

export const formatDays = (count: number) =>
  `${formatInteger(count)} ${pluralize(count, { one: 'dan', few: 'dana', other: 'dana' })}`;

export const initials = (name: string) =>
  name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('');
