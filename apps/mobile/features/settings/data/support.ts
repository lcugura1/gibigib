export const SUPPORT_EMAIL = 'podrska@gibigib.com';
export const SUPPORT_PHONE = '+38542717625';
export const SUPPORT_PHONE_LABEL = '042 717 625';
export const SUPPORT_WEB = 'https://gibigib.com';

export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: 'Kako uđem u teretanu?',
    answer:
      'Na početnom zaslonu otvori svoju ulaznicu i skeniraj prikazani QR kod na ulaznom čitaču.',
  },
  {
    question: 'Kako produžim članstvo?',
    answer:
      'Na početnom zaslonu odaberi željeni plan i dovrši plaćanje. Novo članstvo aktivira se odmah.',
  },
  {
    question: 'Zaboravio sam lozinku, što sad?',
    answer:
      'Na zaslonu za prijavu odaberi „Zaboravili ste lozinku?“ i slijedi upute koje ćemo poslati na tvoju e-adresu.',
  },
];
