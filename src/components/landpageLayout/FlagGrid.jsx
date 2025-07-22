import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import countryCodes from '../../assets/countryCodes.json';

export default function FlagGrid() {
  const { t } = useTranslation(); // Access translation function

  return (
    <section className="py-16 bg-[#f47b20]" id="countries">
      <div className="max-w-6xl mx-auto px-4">
        {/* Translated Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-8">
          {t('flag_grid.explore_ecowas_countries')}
        </h2>

        {/* Translated Description */}
        <p className="text-center text-gray-600 mb-10">
          {t('flag_grid.select_country')}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {countryCodes.map(({ code, name }) => (
            <a
              href={`/${code.toLowerCase()}/login`}
              key={code}
              className="flex flex-col items-center justify-center p-4 bg-white rounded shadow hover:shadow-lg hover:scale-105 transition-transform"
            >
              <img
                src={`/${code.toLowerCase()}.png`}
                alt={`${name} Flag`}
                className="w-16 h-10 object-contain mb-2"
              />
              <span className="text-sm font-medium text-gray-700">{name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
