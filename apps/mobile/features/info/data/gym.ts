import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type OpeningHours = {
  day: string;
  time: string;
};

export type GymLocation = {
  name: string;
  city: string;
  address: string;
  phone: string;
  tel: string;
  email: string;
  hours: OpeningHours[];
};

export type SocialLink = {
  label: string;
  value: string;
  url: string;
  icon: IconName;
};

export const gym = {
  name: 'GIBIGIB',
  tagline: 'Fitness klub',
  description:
    'Gibi Gib je fitness klub koji od 2010. godine spaja vrhunsku opremu, licencirane trenere i ugodan prostor za sve razine treninga — u Varaždinu i Zagrebu.',
};

export const locations: GymLocation[] = [
  {
    name: 'Varaždin I',
    city: 'Varaždin',
    address: 'Podravska ulica 14, 42000 Varaždin',
    phone: '042 717 625',
    tel: '+38542717625',
    email: 'infovz@gibigib.com',
    hours: [
      { day: 'Pon – Pet', time: '06:00 – 22:00' },
      { day: 'Subota', time: '08:00 – 21:00' },
      { day: 'Nedjelja', time: '10:00 – 20:00' },
    ],
  },
  {
    name: 'Varaždin II',
    city: 'Varaždin',
    address: 'Ulica Miroslava Krleže 1a, 42000 Varaždin',
    phone: '042 205 031',
    tel: '+38542205031',
    email: 'infovz@gibigib.com',
    hours: [
      { day: 'Pon – Pet', time: '06:00 – 22:00' },
      { day: 'Subota', time: '08:00 – 21:00' },
      { day: 'Nedjelja', time: '08:00 – 13:00' },
    ],
  },
  {
    name: 'Zagreb',
    city: 'Zagreb',
    address: 'Lazinska ulica 40, 10000 Zagreb',
    phone: '01 383 3649',
    tel: '+38513833649',
    email: 'info@gibigib.com',
    hours: [
      { day: 'Pon – Pet', time: '06:30 – 22:30' },
      { day: 'Subota', time: '08:00 – 21:00' },
      { day: 'Nedjelja', time: '10:00 – 21:00' },
    ],
  },
];

export const socials: SocialLink[] = [
  {
    label: 'Web',
    value: 'gibigib.com',
    url: 'https://gibigib.com',
    icon: 'globe-outline',
  },
  {
    label: 'Instagram Varaždin',
    value: '@gibigibvarazdin',
    url: 'https://www.instagram.com/gibigibvarazdin/',
    icon: 'logo-instagram',
  },
  {
    label: 'Instagram Zagreb',
    value: '@gibigibzagreb',
    url: 'https://www.instagram.com/gibigibzagreb/',
    icon: 'logo-instagram',
  },
  {
    label: 'Facebook',
    value: 'Gibi Gib Varaždin',
    url: 'https://www.facebook.com/gibi.gib.varazdin/',
    icon: 'logo-facebook',
  },
];
