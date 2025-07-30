import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  };

  return (
    <div className="mt-1">
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        className="bg-[#f47b25] text-white rounded px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base"
      >
        {/* Full name for desktop/tablet, short name for mobile */}
        <option value="en">{window.innerWidth < 640 ? 'EN' : 'English'}</option>
        <option value="fr">{window.innerWidth < 640 ? 'FR' : 'Français'}</option>
        <option value="pt">{window.innerWidth < 640 ? 'PT' : 'Português'}</option>
      </select>
    </div>
  );
}
