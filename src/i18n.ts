import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';
import mrTranslation from './locales/mr.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'mr', label: 'मराठी', short: 'मराठी' },
  { code: 'hi', label: 'हिन्दी', short: 'हिन्दी' }
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

const STORAGE_KEY = 'routeshield_lang';

// Retrieve stored language or default to 'en'
const getInitialLanguage = (): string => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ['en', 'hi', 'mr'].includes(saved)) {
      return saved;
    }
    // Also check browser navigator language as fallback
    const browserLang = navigator.language?.split('-')[0];
    if (browserLang && ['hi', 'mr'].includes(browserLang)) {
      return browserLang;
    }
  } catch (e) {
    // localStorage might be unavailable or restricted
  }
  return 'en';
};

const initialLang = getInitialLanguage();

// Ensure HTML document lang attribute reflects initial language
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
  document.documentElement.dir = 'ltr';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
      mr: { translation: mrTranslation }
    },
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false // Avoid blocking renders if components load early
    }
  });

// Keep html lang and localStorage updated on any language change
i18n.on('languageChanged', (lng: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lng;
      document.documentElement.dir = 'ltr'; // Maintain LTR layout for EN, HI, MR
    }
  } catch (e) {
    console.warn('Failed to persist language preference:', e);
  }
});

export default i18n;
