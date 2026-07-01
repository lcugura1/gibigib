import type { ImageSourcePropType } from 'react-native';

export type GymEvent = {
  id: string;
  title: string;
  date: string;
  description: string;
  image: ImageSourcePropType;
};

export const events: GymEvent[] = [
  {
    id: 'triatlon',
    title: 'Gradski triatlon 2026.',
    date: '12. srpnja 2026.',
    description:
      'Pridruži se gradskom triatlonu kroz Varaždin — plivanje, vožnja bicikla i trčanje na jednoj stazi. Kategorije za rekreativce i natjecatelje.',
    image: require('../../../assets/triatlon.jpg'),
  },
  {
    id: 'boks',
    title: 'Osnove boksa',
    date: '21. lipnja 2026.',
    description:
      'Trosatni početnički workshop: pravilan stav, osnovni udarci, rad na vreći i footwork uz našeg trenera. Oprema je osigurana.',
    image: require('../../../assets/boks.jpg'),
  },
];
