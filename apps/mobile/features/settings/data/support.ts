export const SUPPORT_EMAIL = 'podrska@gibigib.com';
export const SUPPORT_PHONE = '+38542717625';
export const SUPPORT_PHONE_LABEL = '042 717 625';
export const SUPPORT_WEB = 'https://gibigib.com';

export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: 'Kako uđem u teretanu?',
    answer:
      'Na početnom zaslonu otvori svoju člansku iskaznicu i skeniraj prikazani barkod na ulaznom čitaču.',
  },
  {
    question: 'Kako produžim članstvo?',
    answer:
      'Na početnom zaslonu odaberi željeni plan i dovrši plaćanje. Novo članstvo aktivira se odmah.',
  },
  {
    question: 'Mogu li zamrznuti članstvo?',
    answer: 'Da — javi nam se na podršku i privremeno ćemo pauzirati tvoje članstvo.',
  },
  {
    question: 'Zaboravio sam lozinku, što sad?',
    answer:
      'Na zaslonu za prijavu odaberi „Zaboravljena lozinka” i slijedi upute koje ćemo poslati na tvoju e-adresu.',
  },
];
