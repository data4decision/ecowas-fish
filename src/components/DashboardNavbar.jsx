import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar({ user, sidebarOpen, collapsed }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const userCountry = (user.country || user.countryCode || '').trim().toLowerCase();
      const userEmail = user.email.trim().toLowerCase();

      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = data.filter(n => {
        const recipient = n.recipient?.toString().trim().toLowerCase();
        return (
          recipient === 'all' ||
          recipient === userEmail ||
          recipient === userCountry
        );
      });

      setNotifications(filtered);

      const unread = filtered.filter(n => !(n.readBy || []).includes(user.email));
      setUnreadCount(unread.length);
    });

    return () => unsub();
  }, [user]);

  const markNotificationsAsRead = async () => {
    const unread = notifications.filter(n => !(n.readBy || []).includes(user.email));
    for (const noti of unread) {
      const notiRef = doc(db, 'notifications', noti.id);
      try {
        await updateDoc(notiRef, {
          readBy: [...(noti.readBy || []), user.email]
        });
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
  };

  const handleNotificationToggle = () => {
    setNotifDropdownOpen(prev => !prev);
    if (!notifDropdownOpen) markNotificationsAsRead();
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Add logout logic here
  };

  const getInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const sidebarWidth = sidebarOpen ? (collapsed ? '5rem' : '16rem') : '0';

  // const handleNotificationClick = () => {
  //   if (user?.role === 'admin') {
  //     navigate('/admin/notifications');
  //   } else {
  //     const code = user?.countryCode?.toLowerCase() || 'ng';
  //     navigate(`/${code}/notifications`);
  //   }
  // };
  const handleNotificationClick = () => {
  setNotifDropdownOpen(false); // Close the dropdown
  if (user?.role === 'admin') {
    navigate('/admin/notifications');
  } else {
    const code = user?.countryCode?.toLowerCase() || 'ng';
    navigate(`/${code}/notifications`);
  }
};


  return (
    <header
      className="h-16 bg-white shadow-md fixed top-0 right-0 left-0 z-20 flex items-center justify-between px-4 md:px-6 transition-all duration-300"
      style={{ paddingLeft: sidebarWidth }}
    >
      <div className="text-[#0b0b5c] font-semibold text-sm sm:text-base ml-22 truncate max-w-[60%]">
        {t('navbar.welcome', {
          name: user?.displayName || user?.email?.split('@')[0] || 'User',
        })}
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <LanguageSwitcher />

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            className="relative cursor-pointer"
            onClick={handleNotificationToggle}
          >
            <Bell className="text-[#0b0b5c]" size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white border rounded shadow-md z-50 text-sm">
              {notifications.length === 0 ? (
                <p className="p-4 text-gray-500">No notifications</p>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={handleNotificationClick}
                  >
                    <div className="font-semibold text-[#0b0b5c] truncate">
                      {n.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {n.message}
                    </div>
                  </div>
                ))
              )}
              <div className="text-center py-2">
                <button
                  onClick={handleNotificationClick}
                  className="text-blue-600 hover:underline text-xs"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#f47b20] text-white flex items-center justify-center text-sm font-bold">
              {getInitial()}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-[#0b0b5c] truncate max-w-[100px]">
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
              <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#0b0b5c] hover:bg-gray-100">
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
