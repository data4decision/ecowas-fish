import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    supportedLngs: ['en', 'pt', 'fr'], // English, Portuguese, French
    ns: ['translation', 'indicators'], // Multiple namespaces
    
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Dynamic loading per namespace
    },
    react: {
      useSuspense: false, // Optional: prevents Suspense fallback issues
    }
  });

export default i18n;
