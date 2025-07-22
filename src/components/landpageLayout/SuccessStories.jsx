import React from 'react';
import Slider from 'react-slick';
import { FaQuoteLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const stories = [
  {
    country: 'Ghana',
    feedbackKey: 'stories.ghana_feedback', // Translation key for feedback
    name: 'Kwesi Boateng',
    role: 'Data Officer, Ghana Fisheries Commission',
  },
  {
    country: 'Nigeria',
    feedbackKey: 'stories.nigeria_feedback',
    name: 'Fatima Yusuf',
    role: 'Regional Coordinator, Nigeria Fisheries Board',
  },
  {
    country: 'Senegal',
    feedbackKey: 'stories.senegal_feedback',
    name: 'Abdoulaye Diop',
    role: 'Field Supervisor, Senegal Marine Unit',
  },
];

export default function SuccessStories() {
  const { t } = useTranslation(); // Access translation function

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <section className="py-16 bg-white" id="success">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Translated heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          {t('stories.title')} {/* Translated title */}
        </h2>
        
        {/* Translated description */}
        <p className="text-gray-600 mb-10">
          {t('stories.description')}
        </p>

        <Slider {...settings}>
          {stories.map((story, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-md shadow-md bg-gray-50 mx-4"
            >
              <FaQuoteLeft className="text-accent text-2xl mb-4 mx-auto" />
              <p className="text-lg text-gray-700 italic mb-4">“{t(story.feedbackKey)}”</p> {/* Translated feedback */}
              <h4 className="font-semibold text-primary">{story.name}</h4>
              <p className="text-sm text-gray-500">{story.role}</p>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
