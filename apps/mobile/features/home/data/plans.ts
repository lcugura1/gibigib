export type Plan = {
  slug: string;
  name: string;
  duration: string;
  price?: string;
  amount?: number;
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
    benefits: ['Neograničen pristup', 'Svlačionica i tuševi', 'Besplatan Wi-Fi'],
    hasMore: true,
  },
  {
    slug: 'trener',
    name: '1 na 1 uz trenera',
    duration: 'Personalni trening',
    cta: 'Detalji',
    variant: 'light',
    benefits: ['Individualni plan treninga', 'Termini po dogovoru', 'Posvećen trener'],
    hasMore: true,
  },
];

export function getPlan(slug: string) {
  return plans.find((plan) => plan.slug === slug);
}
