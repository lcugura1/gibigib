import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type OpeningHours = {
  day: string;
  time: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type GymLocation = {
  name: string;
  city: string;
  address: string;
  phone: string;
  tel: string;
  email: string;
  coordinates: Coordinates;
  hours: OpeningHours[];
};

export type SocialLink = {
  label: string;
  value: string;
  url: string;
  icon: IconName;
};

export type IntroSegment = {
  text: string;
  bold?: boolean;
};

export const gym = {
  intro: [
    { text: 'Gibi Gib je fitness klub koji ' },
    { text: 'od 2010.', bold: true },
    {
      text: ' spaja vrhunsku opremu, licencirane trenere i ugodan prostor za sve razine treninga — u ',
    },
    { text: 'Varaždinu i Zagrebu', bold: true },
    { text: '.' },
  ] as IntroSegment[],
};

export const locations: GymLocation[] = [
  {
    name: 'Varaždin I',
    city: 'Varaždin',
    address: 'Podravska ulica 14, 42000 Varaždin',
    phone: '042 717 625',
    tel: '+38542717625',
    email: 'infovz@gibigib.com',
    coordinates: { latitude: 46.313255, longitude: 16.349829 },
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
    coordinates: { latitude: 46.296655, longitude: 16.330017 },
    hours: [
      { day: 'Pon – Pet', time: '06:00 – 22:00' },
      { day: 'Subota', time: '08:00 – 21:00' },
      { day: 'Nedjelja', time: '08:00 – 13:00' },
    ],
  },
  {
    name: 'Zagreb I',
    city: 'Zagreb',
    address: 'Lazinska ulica 40, 10000 Zagreb',
    phone: '01 383 3649',
    tel: '+38513833649',
    email: 'info@gibigib.com',
    coordinates: { latitude: 45.794466, longitude: 15.933312 },
    hours: [
      { day: 'Pon – Pet', time: '06:30 – 22:30' },
      { day: 'Subota', time: '08:00 – 21:00' },
      { day: 'Nedjelja', time: '10:00 – 21:00' },
    ],
  },
  {
    name: 'Zagreb II',
    city: 'Zagreb',
    address: 'Zagrebačka cesta 143A, 10000 Zagreb',
    phone: '01 33 58 172',
    tel: '+38513358172',
    email: 'info@gibigib.com',
    coordinates: { latitude: 45.805521, longitude: 15.923823 },
    hours: [
      { day: 'Pon – Pet', time: '06:00 – 22:00' },
      { day: 'Subota', time: '08:00 – 21:00' },
      { day: 'Nedjelja', time: '10:00 – 21:00' },
    ],
  },
];

export const cities = [...new Set(locations.map((location) => location.city))];

export const cityCameras = cities.map((city) => {
  const points = locations
    .filter((location) => location.city === city)
    .map((location) => location.coordinates);
  const latitude = points.reduce((sum, point) => sum + point.latitude, 0) / points.length;
  const longitude = points.reduce((sum, point) => sum + point.longitude, 0) / points.length;
  return { coordinates: { latitude, longitude }, zoom: 12.5 };
});

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
