// src/pages/LandingPage.jsx
import React from 'react';
import Navbar from '../components/landpageLayout/Navbar';
import HeroSection from '../components/landpageLayout/HeroSection';
import FeaturesSection from '../components/landpageLayout/FeaturesSection';
import SuccessStories from '../components/landpageLayout/SuccessStories';
import FlagGrid from '../components/landpageLayout/FlagGrid';
import Footer from '../components/landpageLayout/Footer';


import { useTranslation } from 'react-i18next';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white text-gray-800">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <SuccessStories />
      <FlagGrid />
      <Footer />
    </div>
  );
}
