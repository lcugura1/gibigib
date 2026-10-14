import type { EventDto, EventInput, EventStatus, EventsDto } from '@gibigib/types';
import type { Observable } from 'rxjs';
import { local, mockNow } from '../../../shared/mock/fixtures';
import { respond } from '../../../shared/mock/respond';
import { recordChange } from '../../audit/services/audit-store';

export interface EventsApi {
  events(): Observable<EventsDto>;
  save(id: string | null, input: EventInput, status: EventStatus): Observable<string>;
  remove(id: string): Observable<true>;
}

const SEEDS: readonly [string, string, EventStatus, string][] = [
  [
    'Noć otvorenih vrata u Zagrebu II',
    '2026-10-24',
    'DRAFT',
    'Dođi s prijateljem u subotu od 10 do 14 h. Besplatan probni trening, upoznaj trenere i obiđi novu zonu za snagu.',
  ],
  [
    'Radno vrijeme za Sve svete',
    '2026-11-01',
    'DRAFT',
    'Na Sve svete sve četiri teretane rade od 8 do 14 h. Grupnih treninga taj dan nema.',
  ],
  [
    'Novi termini grupnih treninga',
    '2026-10-12',
    'PUBLISHED',
    'Od ponedjeljka grupni treninzi u Varaždinu I kreću i u 6:30 i u 20:00. Prijave u aplikaciji.',
  ],
  [
    'Funkcionalni trening subotom',
    '2026-10-05',
    'PUBLISHED',
    'Svake subote u 10 h funkcionalni trening s Marijom u Varaždinu I. Ponesi ručnik i vodu.',
  ],
  [
    'Varaždin II: nova zona za snagu',
    '2026-09-28',
    'PUBLISHED',
    'Otvorili smo novu zonu za snagu s četiri nova stalka za čučanj i platformom za mrtvo dizanje.',
  ],
];

let events: EventDto[] = SEEDS.map(([title, date, status, text], i) => ({
  id: `e${i + 1}`,
  title,
  date,
  status,
  text,
  imageUrl: null,
  updatedAt: `${date}T09:00:00`,
}));

let nextId = events.length + 1;

const byOrder = (a: EventDto, b: EventDto) =>
  a.status !== b.status
    ? a.status === 'DRAFT'
      ? -1
      : 1
    : a.status === 'DRAFT'
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date);

function auditTitle(before: EventDto | undefined, status: EventStatus) {
  if (status === 'PUBLISHED') return before?.status === 'PUBLISHED' ? 'Izmijenjen događaj' : 'Objavljen događaj';
  if (before?.status === 'PUBLISHED') return 'Događaj vraćen u skice';
  return before ? 'Izmijenjena skica' : 'Nova skica događaja';
}

export const eventsApi: EventsApi = {
  events: () => respond(() => ({ events: [...events].sort(byOrder) })),
  save: (id, input, status) =>
    respond(() => {
      const before = events.find((event) => event.id === id);
      const saved: EventDto = { ...input, id: before?.id ?? `e${nextId++}`, status, updatedAt: local(mockNow()) };
      events = before ? events.map((event) => (event.id === before.id ? saved : event)) : [saved, ...events];
      recordChange({ kind: 'EVENT', title: auditTitle(before, status), details: [saved.title], gymId: null });
      return saved.id;
    }),
  remove: (id) =>
    respond(() => {
      const target = events.find((event) => event.id === id);
      if (!target) return undefined;
      events = events.filter((event) => event.id !== id);
      recordChange({ kind: 'EVENT', title: 'Obrisan događaj', details: [target.title], gymId: null });
      return true as const;
    }),
};
