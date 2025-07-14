import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

export default function AdminNavbar({ user, collapsed, sidebarOpen, setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getInitial = () => {
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header
      className={`h-16 bg-white shadow-md flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 z-20 w-full transition-all duration-300 ${
        sidebarOpen ? (collapsed ? 'md:left-20' : 'md:left-64') : 'md:left-0'
      }`}
    >
      {/* Optional: Toggle Sidebar */}
      {/* <button
        onClick={() => setSidebarOpen(prev => !prev)}
        className="text-[#0b0b5c] focus:outline-none"
      >
        <Menu size={24} />
      </button> */}

      {/* Welcome Message */}
      <div className="text-[#0b0b5c] ml-20 font-semibold text-lg sm:block">
        Welcome {user?.firstName && user?.surname 
          ? `${user.firstName} ${user.surname}` 
          : user?.surname?.split('@')[0] || 'Admin'}
      </div>

      {/* Avatar & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-[#f47b20] text-white flex items-center justify-center text-sm font-bold">
            {getInitial()}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-[#0b0b5c]">
            {user?.surname || 'Admin'}
          </span>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
            <button
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#0b0b5c] hover:bg-gray-100"
              onClick={() => console.log('View profile')}
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
