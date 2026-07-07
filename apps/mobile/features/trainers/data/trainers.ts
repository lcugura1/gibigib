import type { Trainer } from '@/features/trainers/types/trainer';

// STUB: hardcoded trainers with placeholder photos until the real Trainer model
// + API + photo upload lands (see Linear task).
export const trainers: Trainer[] = [
  {
    id: 'ivan-horvat',
    name: 'Ivan Horvat',
    role: 'Snaga i hipertrofija',
    photo: 'https://i.pravatar.cc/400?img=12',
    specialties: ['Snaga', 'Hipertrofija', 'Powerlifting'],
    experienceYears: 8,
    certifications: ['NSCA-CPT', 'Kettlebell L1'],
    bio: 'Osam godina radim s klijentima svih razina — od početnika do natjecatelja. Fokus mi je na postupnom, održivom napretku u snazi.',
    email: 'ivan.horvat@gibigib.hr',
    instagram: 'ivan.trener',
  },
  {
    id: 'ana-kovac',
    name: 'Ana Kovač',
    role: 'Mršavljenje i kondicija',
    photo: 'https://i.pravatar.cc/400?img=45',
    specialties: ['Mršavljenje', 'Kardio', 'Funkcionalni trening'],
    experienceYears: 6,
    certifications: ['ACE-CPT', 'TRX'],
    bio: 'Pomažem klijentima da izgube kilograme bez gladovanja i da zavole kretanje. Treninge prilagođavam tvom rasporedu i razini kondicije.',
    email: 'ana.kovac@gibigib.hr',
    instagram: 'ana.fit',
  },
  {
    id: 'marko-peric',
    name: 'Marko Perić',
    role: 'Rehabilitacija i mobilnost',
    photo: 'https://i.pravatar.cc/400?img=33',
    specialties: ['Rehabilitacija', 'Mobilnost', 'Korektivne vježbe'],
    experienceYears: 10,
    certifications: ['FMS', 'Kinesio Taping'],
    bio: 'Specijaliziran sam za povratak treningu nakon ozljeda i za rješavanje bolova uzrokovanih sjedilačkim načinom života. Radim pažljivo i individualno.',
    email: 'marko.peric@gibigib.hr',
    instagram: 'marko.mobility',
  },
  {
    id: 'petra-novak',
    name: 'Petra Novak',
    role: 'Grupni i HIIT treninzi',
    photo: 'https://i.pravatar.cc/400?img=48',
    specialties: ['HIIT', 'Grupni treninzi', 'Izdržljivost'],
    experienceYears: 5,
    certifications: ['Les Mills', 'ACE-GFI'],
    bio: 'Energične i zabavne treninge vodim već pet godina. Ako te motivira grupna atmosfera i dinamika, na mojim ćeš treninzima uživati i napredovati.',
    email: 'petra.novak@gibigib.hr',
    instagram: 'petra.hiit',
  },
];

export function getTrainer(id: string) {
  return trainers.find((trainer) => trainer.id === id);
}
