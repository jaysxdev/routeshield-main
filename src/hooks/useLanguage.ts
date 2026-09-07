import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, SupportedLanguageCode } from '../i18n';

export function useLanguage() {
  const { t, i18n } = useTranslation();

  const currentLanguage = (i18n.language || 'en').split('-')[0] as SupportedLanguageCode;

  const setLanguage = (langCode: SupportedLanguageCode) => {
    i18n.changeLanguage(langCode);
  };

  return {
    t,
    i18n,
    currentLanguage,
    setLanguage,
    languages: SUPPORTED_LANGUAGES
  };
}
