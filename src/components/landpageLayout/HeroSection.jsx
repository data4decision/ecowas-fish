// src/components/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../LanguageSwitcher';

export default function HeroSection() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat h-[90vh] flex items-center justify-center text-center text-white"
      style={{ backgroundImage: "url('/ocean.jpg')" }}
      id="get-started"
    >
      <div className="bg-black/60 absolute inset-0"></div>

      <div className="relative z-10 max-w-4xl px-4">
       
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white animate-fadeIn">
          Empowering Fisheries Data for Sustainable Development in ECOWAS.
        </h1>
        <p className="text-lg md:text-xl mb-8 animate-fadeIn delay-100 text-gray-200">
          Track, analyze, and manage country-level fisheries data in one unified platform.
        </p>
        <div className="flex justify-center gap-4 animate-fadeIn delay-200">
          <a href="#features" className="bg-accent px-6 py-3 rounded shadow hover:bg-orange-500 transition duration-300">
            Get Started
          </a>
          <a href="#flag" className="border border-white px-6 py-3 rounded hover:bg-white hover:text-primary transition duration-300">
            Explore Countries
          </a>
           <LanguageSwitcher/>
        </div>
      </div>
    </section>
  );
}
