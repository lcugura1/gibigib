export type Plan = {
  slug: string;
  name: string;
  duration: string;
  price?: string;
  amount?: number;
  description: string;
  benefits: string[];
  hasMore?: boolean;
  savings?: string;
  variant?: 'dark' | 'light';
  cta?: string;
};

export const plans: Plan[] = [
  {
    slug: 'mjesecno',
    name: 'Mjesečno',
    duration: '1 mjesec',
    price: '29,99 €',
    amount: 29.99,
    description:
      'Mjesečno članstvo omogućuje neograničen pristup teretani i opremi tijekom jednog mjeseca. Pogodno je za članove koji žele redovno trenirati bez dugoročne obveze.',
    benefits: ['Neograničen pristup', 'Svlačionica i tuševi', 'Besplatan Wi-Fi'],
    hasMore: true,
  },
  {
    slug: 'grupni',
    name: 'Grupni program',
    duration: '1 mjesec',
    price: '39,99 €',
    amount: 39.99,
    variant: 'light',
    description:
      'Grupni program uz pristup teretani uključuje i vođene grupne treninge prema tjednom rasporedu termina. Treninge vodi stručni trener, a namijenjeni su članovima koji redovitost lakše održavaju u grupi.',
    benefits: ['Vođeni grupni treninzi', 'Tjedni raspored termina', 'Stručni trener'],
    hasMore: true,
  },
  {
    slug: 'godisnji',
    name: 'Godišnji',
    duration: '12 mjeseci',
    price: '250,00 €',
    amount: 250,
    savings: 'Uštedi 109,88 €',
    description:
      'Godišnje članstvo obuhvaća iste pogodnosti kao mjesečno, ali se plaća unaprijed za dvanaest mjeseci. Zbog jednokratnog je plaćanja ukupna cijena niža od zbroja dvanaest mjesečnih članarina.',
    benefits: ['Neograničen pristup', 'Svlačionica i tuševi', 'Besplatan Wi-Fi'],
    hasMore: true,
  },
  {
    slug: 'trener',
    name: '1 na 1 uz trenera',
    duration: 'Prilagođeni trening',
    cta: 'Detalji',
    variant: 'light',
    description:
      'Prilagođeni trening podrazumijeva rad s odabranim trenerom prema individualnom planu i dogovorenim terminima. Cijena se određuje prema broju i trajanju treninga, pa se dogovara izravno s trenerom.',
    benefits: ['Individualni plan treninga', 'Termini po dogovoru', 'Posvećen trener'],
    hasMore: true,
  },
];

export function getPlan(slug: string) {
  return plans.find((plan) => plan.slug === slug);
}
