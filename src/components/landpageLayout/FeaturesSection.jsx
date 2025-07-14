// src/components/FeaturesSection.jsx
import React from 'react';
import { FaGlobeAfrica, FaLock, FaChartLine, FaUsersCog } from 'react-icons/fa';

const features = [
  {
    icon: <FaGlobeAfrica size={40} className="text-accent" />,
    title: 'Country-specific Dashboards',
    description: 'Each ECOWAS nation gets a dedicated dashboard to manage and review fisheries data effectively.',
  },
  {
    icon: <FaLock size={40} className="text-accent" />,
    title: 'Secure Data Uploads',
    description: 'Robust authentication and secure cloud storage to ensure data integrity and privacy.',
  },
  {
    icon: <FaChartLine size={40} className="text-accent" />,
    title: 'Real-time Analytics',
    description: 'Instant insights to track patterns, trends, and performance metrics across the region.',
  },
  {
    icon: <FaUsersCog size={40} className="text-accent" />,
    title: 'Centralized Oversight',
    description: 'Admin panel for monitoring, managing permissions, and regional coordination.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-100" id="features">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Platform Features</h2>
        <p className="text-gray-600 mb-12">
          Designed to make data-driven fisheries governance simple, secure, and scalable.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
