// src/pages/LandingPage.jsx
import React from 'react';
import Navbar from '../components/landpageLayout/Navbar';
import HeroSection from '../components/landpageLayout/HeroSection';
import FeaturesSection from '../components/landpageLayout/FeaturesSection';
import SuccessStories from '../components/landpageLayout/SuccessStories';
import FlagGrid from '../components/landpageLayout/FlagGrid';
import Footer from '../components/landpageLayout/Footer';
import HomePage from '../components/landpageLayout/HomePage';

import { useTranslation } from 'react-i18next';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white text-gray-800">
      <Navbar />
      <HeroSection />

      {/* Optional: Translated welcome message */}
      <section className="p-6 text-center">
        <h1 className="text-3xl font-bold">{t('welcome')}</h1>
        <p className="text-lg mt-2">{t('about')}</p>
      </section>

      <HomePage />
      <FeaturesSection />
      <SuccessStories />
      <FlagGrid />
      <Footer />
    </div>
  );
}
