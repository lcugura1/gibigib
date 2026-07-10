import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export type LanguageCode = 'hr' | 'en';

const STORAGE_KEY = 'app.language';

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  hr: 'Hrvatski',
  en: 'Engleski',
};

export function useLanguage() {
  const [language, setLanguage] = useState<LanguageCode>('hr');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === 'hr' || value === 'en') setLanguage(value);
    });
  }, []);

  const changeLanguage = (next: LanguageCode) => {
    setLanguage(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  };

  return { language, changeLanguage, label: LANGUAGE_LABELS[language] };
}
