import { en } from './en';
import { hi } from './hi';
import { mr } from './mr';
import { LanguageCode } from '../types';

export const translations = {
  en,
  hi,
  mr,
};

export const getTranslation = (lang: LanguageCode): typeof en => {
  return translations[lang] || translations.hi;
};
