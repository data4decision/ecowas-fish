import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import countryCodes from '../../data/countryCodes.json';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#0b0b5c] text-white shadow-md">
      <a href="https://www.data4decision.org/" className="text-xl font-bold flex items-center">
        <img src="/logo.png" alt="Logo" className="inline-block w-8 mr-2" />
        Data4Decision Int'l
      </a>

      <ul className="hidden md:flex items-center space-x-6">
        <li>
          <a
            href="https://www.data4decision.org/about"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#f47b20]"
          >
            About
          </a>
        </li>
        <li className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="hover:text-[#f47b20]">
            Countries ▾
          </button>
          {dropdownOpen && (
            <ul className="absolute top-8 left-0 bg-white text-[#0b0b5c] shadow-lg rounded-md w-52 z-50">
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
          <Link to="/admin/login" className="hover:text-[#f47b20]">
            Admin Login
          </Link>
        </li>
        <li>
          <a
            href="#get-started"
            className="bg-[#f47b20] text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
          >
            Get Started
          </a>
        </li>
      </ul>
    </nav>
  );
}
