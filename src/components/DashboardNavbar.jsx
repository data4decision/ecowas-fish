import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User } from 'lucide-react';

export default function Navbar({ user, collapsed, sidebarOpen, setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sidebarWidth = sidebarOpen ? (collapsed ? '5rem' : '16rem') : '0';

  // Close dropdown when clicking outside
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
    // Replace this with your logout logic
    console.log("Logging out...");
  };

  return (
    // <header
    //   className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between bg-white w-full shadow-md px-4 z-30 transition-all duration-300"
    //   style={{
    //     marginLeft: sidebarWidth,
    //     width: `calc(100% - ${sidebarWidth})`,
    //   }}
    // >
      <header
      className={`h-16 bg-white shadow-md flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 z-20 w-full transition-all duration-300 ${
        sidebarOpen
          ? collapsed
            ? "md:left-20"
            : "md:left-64"
          : "md:left-0"
      }`}
    >
      {/* Sidebar toggle */}
      {/* <button
        onClick={() => setSidebarOpen(prev => !prev)}
        className="text-[#0b0b5c] focus:outline-none"
      >
        <Menu size={24} />
      </button> */}

      {/* Desktop welcome text */}
      <div className="text-[#0b0b5c] ml-20 font-semibold text-lg sm:block">
        Welcome {user?.displayName || user?.email?.split('@')[0] || 'User'}
      </div>

      {/* User Avatar & Dropdown */}
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
            {user?.displayName || user?.email}
          </span>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
            <button
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#0b0b5c] hover:bg-gray-100"
              onClick={() => console.log("View profile")}
            >
              <User size={16} />
              Profile
            </button>
            <button
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
