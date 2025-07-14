// src/components/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => changeLanguage('en')}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        FR
      </button>
      <button
        onClick={() => changeLanguage('pt')}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        PT
      </button>
    </div>
  );
}
