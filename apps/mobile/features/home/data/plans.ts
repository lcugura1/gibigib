export type Plan = {
  slug: string;
  name: string;
  duration: string;
  price?: string;
  amount?: number;
  benefits: string[];
  extraBenefits?: number;
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
    extraBenefits: 1,
  },
  {
    slug: 'grupni',
    name: 'Grupni program',
    duration: '1 mjesec',
    price: '39,99 €',
    amount: 39.99,
    variant: 'light',
    benefits: ['Vođeni grupni treninzi', 'Tjedni raspored termina', 'Stručni trener'],
    extraBenefits: 2,
  },
  {
    slug: 'godisnji',
    name: 'Godišnji',
    duration: '12 mjeseci',
    price: '250,00 €',
    amount: 250,
    savings: 'Uštedi 109,88 €',
    benefits: ['Neograničen pristup', 'Svlačionica i tuševi', 'Besplatan Wi-Fi'],
    extraBenefits: 1,
  },
  {
    slug: 'trener',
    name: '1 na 1 uz trenera',
    duration: 'Personalni trening',
    cta: 'Detalji',
    variant: 'light',
    benefits: ['Individualni plan treninga', 'Termini po dogovoru', 'Posvećen trener'],
    extraBenefits: 2,
  },
];

export function getPlan(slug: string) {
  return plans.find((plan) => plan.slug === slug);
}
