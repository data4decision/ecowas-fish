// src/components/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lng) => {
    if (lng !== currentLang) {
      i18n.changeLanguage(lng);
    }
  };

  const languages = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'pt', label: 'PT', flag: '🇵🇹' }
  ];

  return (
    <div className="flex gap-2 sm:gap-3 items-center text-sm font-medium ">
      {languages.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => changeLanguage(code)}
          className={`px-2 py-1 rounded transition-colors duration-200 bg-[#0b0b5c] text-white focus:outline-none focus:ring-2 focus:ring-orange-400
            ${currentLang === code
              ? 'bg-[#f47b20] text-white'
              : 'text-[#0b0b5c] hover:bg-orange-100'}
          `}
        >
          <span className="mr-1">{flag}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
