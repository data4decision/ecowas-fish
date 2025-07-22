import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="mt-4">
      {/* Language Dropdown */}
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-4 py-2 mb-3 bg-[#f47b25] text-white rounded"
        defaultValue={i18n.language}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="pt">Português</option>
      </select>
    </div>
  );
}
