import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar({ user, collapsed, sidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  // Detect click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  // Calculate left offset for navbar based on sidebar state
  const sidebarWidth = sidebarOpen ? (collapsed ? '5rem' : '16rem') : '0';

  return (
    <header
      className="h-16 bg-white shadow-md flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 z-20 transition-all duration-300"
      style={{
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth})`,
      }}
    >
      {/* Left - Welcome message */}
      <div className="text-[#0b0b5c] font-semibold text-lg sm:block">
        {t('navbar.welcome', {
          name: user?.displayName || user?.email?.split('@')[0] || 'User'
        })}
      </div>

      {/* Right - Language + Avatar */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#f47b20] text-white flex items-center justify-center text-sm font-bold">
              {user?.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-[#0b0b5c]">
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#0b0b5c] hover:bg-gray-100"
              >
                <User size={16} />
                {t('navbar.profile')}
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                {t('navbar.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
