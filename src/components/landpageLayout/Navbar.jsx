import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import countryCodes from '../../data/countryCodes.json';
import LanguageSwitcher from '../../components/LanguageSwitcher'; // Import LanguageSwitcher component
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t } = useTranslation(); // Access translation function

  return (
    <nav className="bg-[#0b0b5c] text-white shadow-md px-6 py-4 md:flex justify-between">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a href="https://www.data4decision.org/" className="text-xl font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="inline-block w-8 mr-2" />
          {t('navbar.company_name')} {/* Translated company name */}
        </a>

        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menu Links (visible on md and up OR when toggled on mobile) */}
      <ul className={`mt-4 md:mt-0 md:flex items-center space-y-4 md:space-y-0 md:space-x-6 ${menuOpen ? 'block' : 'hidden'} md:block`}>
        <li>
          <a
            href="https://www.data4decision.org/about"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#f47b20] block"
          >
            {t('navbar.about')} {/* Translated About */}
          </a>
        </li>
        <li className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="hover:text-[#f47b20] block w-full text-left"
          >
            {t('navbar.countries')} ▾ {/* Translated Countries */}
          </button>
          {dropdownOpen && (
            <ul className="absolute z-50 bg-white text-[#0b0b5c] shadow-lg rounded-md w-52 mt-2">
              {countryCodes.map(({ code, name, flag }) => (
                <li
                  key={code}
                  className="border-b last:border-0 hover:bg-gray-100"
                >
                  <a
                    href={`/${code.toLowerCase()}/login`}
                    className="flex items-center px-4 py-2"
                  >
                    <img
                      src={flag}
                      alt={name}
                      className="w-5 h-5 mr-2 object-contain"
                    />
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
        <li>
          <Link to="/admin/login" className="hover:text-[#f47b20] block">
            {t('navbar.admin_login')} {/* Translated Admin Login */}
          </Link>
        </li>
        <li>
          <a
            href="#get-started"
            className="bg-[#f47b20] text-white px-4 py-2 rounded hover:bg-opacity-90 transition block text-center"
          >
            {t('navbar.get_started')} {/* Translated Get Started */}
          </a>
        </li>

        {/* Language Switcher in Navbar */}
        <li className="ml-6">
          <LanguageSwitcher /> {/* Language switcher component */}
        </li>
      </ul>
    </nav>
  );
}
