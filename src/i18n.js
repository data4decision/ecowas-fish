// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      dashboard: 'Dashboard',
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue',
      dashboard: 'Tableau de bord',
    },
  },
  pt: {
    translation: {
      welcome: 'Bem-vindo',
      dashboard: 'Painel de Controle',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
