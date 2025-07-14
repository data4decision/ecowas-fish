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

const Example = () => {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>; // This should change with language
};


export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800">
      <Navbar />
      <HeroSection />
      <HomePage/>
      <FeaturesSection />
      <SuccessStories />
      <FlagGrid />
      <Footer />
    </div>
  );
}
