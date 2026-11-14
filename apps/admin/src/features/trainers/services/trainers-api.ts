import type { TrainerDto, TrainerInput, TrainersDto } from '@gibigib/types';
import type { Observable } from 'rxjs';
import { toAscii } from '../../../shared/lib/text';
import { respond } from '../../../shared/mock/respond';
import { recordChange } from '../../audit/services/audit-store';

export interface TrainersApi {
  trainers(): Observable<TrainersDto>;
  save(id: string | null, input: TrainerInput): Observable<string>;
  remove(id: string): Observable<true>;
}

const SEEDS: readonly [string, string, number, string[], string, string, string, string][] = [
  [
    'Ivan Matić',
    'Glavni trener',
    12,
    ['Snaga', 'Kondicija'],
    'z1',
    '@ivan.matic',
    'NSCA-CSCS · Kineziološki fakultet Zagreb',
    'Vodi tim trenera u Zagrebu od otvaranja. Radi sa sportašima i rekreativcima na snazi i kondiciji.',
  ],
  [
    'Marija Perić',
    'Trenerica grupnih programa',
    6,
    ['Funkcionalni trening', 'Mobilnost'],
    'v1',
    '@marija.trenira',
    'Kineziološki fakultet Zagreb · Les Mills BODYPUMP',
    'Vodi grupne treninge u Varaždinu od 2020. Voli dobro složenu playlistu i čisto izvedene čučnjeve.',
  ],
  [
    'Tomislav Knežević',
    'Osobni trener',
    9,
    ['Powerlifting', 'Prehrana'],
    'z2',
    '@tomo.lifts',
    'IPF trener · nutricionist',
    'Priprema natjecatelje u powerliftingu i pomaže s planom prehrane uz trening.',
  ],
  [
    'Lea Vidović',
    'Osobna trenerica',
    7,
    ['Rehabilitacija', 'Pilates'],
    'v2',
    '@lea.pilates',
    'Fizioterapeutkinja · STOTT Pilates',
    'Pomaže članovima da se nakon ozljede sigurno vrate treningu.',
  ],
  [
    'Dominik Babić',
    'Trener',
    4,
    ['HIIT', 'Kondicija'],
    'z1',
    '',
    'Kineziološki fakultet Zagreb',
    'Vodi jutarnje HIIT treninge u Zagrebu I.',
  ],
  [
    'Petra Novosel',
    'Trenerica',
    5,
    ['Joga', 'Mobilnost'],
    'z2',
    '@petra.joga',
    'RYT 200',
    'Vodi jogu i treninge mobilnosti u Zagrebu II.',
  ],
];

const emailOf = (name: string) => `${toAscii(name).split(' ').join('.')}@primjer.hr`;

let trainers: TrainerDto[] = SEEDS.map(
  ([name, role, experienceYears, specialties, gymId, instagram, certifications, bio], i) => ({
    id: `t${i + 1}`,
    name,
    role,
    photoUrl: null,
    specialties,
    experienceYears,
    instagram,
    email: emailOf(name),
    certifications,
    bio,
    gymId,
  }),
);

let nextId = trainers.length + 1;

export const trainersApi: TrainersApi = {
  trainers: () => respond(() => ({ trainers }) satisfies TrainersDto),
  save: (id, input) =>
    respond(() => {
      const before = trainers.find((trainer) => trainer.id === id);
      const saved: TrainerDto = { ...input, id: before?.id ?? `t${nextId++}` };
      trainers = before
        ? trainers.map((trainer) => (trainer.id === before.id ? saved : trainer))
        : [...trainers, saved];
      recordChange({
        kind: 'TRAINER',
        title: before ? 'Izmijenjen trener' : 'Dodan trener',
        details: [saved.name],
        gymId: saved.gymId,
      });
      return saved.id;
    }),
  remove: (id) =>
    respond(() => {
      const target = trainers.find((trainer) => trainer.id === id);
      if (!target) return undefined;
      trainers = trainers.filter((trainer) => trainer.id !== id);
      recordChange({ kind: 'TRAINER', title: 'Uklonjen trener', details: [target.name], gymId: target.gymId });
      return true as const;
    }),
};
