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
    <div className="mt-4">
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        className="px-4 py-2 bg-[#f47b25] text-white rounded"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="pt">Português</option>
      </select>
    </div>
  );
}
