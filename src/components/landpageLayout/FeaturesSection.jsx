import React from 'react';
import { FaGlobeAfrica, FaLock, FaChartLine, FaUsersCog } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const features = [
  {
    icon: <FaGlobeAfrica size={40} className="text-accent" />,
    titleKey: 'features.country_specific_dashboards', // Using translation key
    descriptionKey: 'features.country_specific_dashboards_desc', // Using translation key
  },
  {
    icon: <FaLock size={40} className="text-accent" />,
    titleKey: 'features.secure_data_uploads',
    descriptionKey: 'features.secure_data_uploads_desc',
  },
  {
    icon: <FaChartLine size={40} className="text-accent" />,
    titleKey: 'features.real_time_analytics',
    descriptionKey: 'features.real_time_analytics_desc',
  },
  {
    icon: <FaUsersCog size={40} className="text-accent" />,
    titleKey: 'features.centralized_oversight',
    descriptionKey: 'features.centralized_oversight_desc',
  },
];

export default function FeaturesSection() {
  const { t } = useTranslation(); // Access translation function

  return (
    <section className="py-16 bg-gray-100" id="features">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('features.platform_features')}</h2> {/* Translated header */}
        <p className="text-gray-600 mb-12">
          {t('features.description')} {/* Translated description */}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-primary mb-2">{t(feature.titleKey)}</h3> {/* Translated title */}
              <p className="text-gray-600 text-sm">{t(feature.descriptionKey)}</p> {/* Translated description */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
