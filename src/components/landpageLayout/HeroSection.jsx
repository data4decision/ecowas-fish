import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation


export default function HeroSection() {
  const { t } = useTranslation(); // Access the translation function

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat h-[90vh] flex items-center justify-center text-center text-white"
      style={{ backgroundImage: "url('/ocean.jpg')" }}
      id="get-started"
    >
      <div className="bg-black/60 absolute inset-0"></div>

      <div className="relative z-10 max-w-4xl px-4">
       
        {/* Translatable heading */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white animate-fadeIn">
          {t('hero_heading')} {/* Translated text */}
        </h1>
        
        {/* Translatable description */}
        <p className="text-lg md:text-xl mb-8 animate-fadeIn delay-100 text-gray-200">
          {t('hero_description')} {/* Translated text */}
        </p>
        
        <div className="flex justify-center gap-4 animate-fadeIn delay-200">
          {/* Translatable button text */}
          <a href="#features" className="bg-accent px-6 py-3 rounded shadow hover:bg-orange-500 transition duration-300">
            {t('get_started')} {/* Translated text */}
          </a>
          
          {/* Translatable button text */}
          <a href="#flag" className="border border-white px-6 py-3 rounded hover:bg-white hover:text-primary transition duration-300">
            {t('explore_countries')} {/* Translated text */}
          </a>
          
         
        </div>
      </div>
    </section>
  );
}
