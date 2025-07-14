// src/components/SuccessStories.jsx
import React from 'react';
import Slider from 'react-slick';
import { FaQuoteLeft } from 'react-icons/fa';

const stories = [
  {
    country: 'Ghana',
    feedback: 'Ghana improved monthly fisheries reporting accuracy by 40% within six months using the platform.',
    name: 'Kwesi Boateng',
    role: 'Data Officer, Ghana Fisheries Commission',
  },
  {
    country: 'Nigeria',
    feedback: 'The dashboard enabled real-time oversight and eliminated reporting delays across multiple states.',
    name: 'Fatima Yusuf',
    role: 'Regional Coordinator, Nigeria Fisheries Board',
  },
  {
    country: 'Senegal',
    feedback: 'Our local teams now submit verified catch data weekly, improving compliance and insights.',
    name: 'Abdoulaye Diop',
    role: 'Field Supervisor, Senegal Marine Unit',
  },
];

export default function SuccessStories() {
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
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Success Stories</h2>
        <p className="text-gray-600 mb-10">Real impact across ECOWAS nations</p>

        <Slider {...settings}>
          {stories.map((story, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-md shadow-md bg-gray-50 mx-4"
            >
              <FaQuoteLeft className="text-accent text-2xl mb-4 mx-auto" />
              <p className="text-lg text-gray-700 italic mb-4">“{story.feedback}”</p>
              <h4 className="font-semibold text-primary">{story.name}</h4>
              <p className="text-sm text-gray-500">{story.role}</p>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
