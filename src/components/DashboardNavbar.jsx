import React, { useState, useEffect, useRef } from "react";
import { LogOut, User, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // ✅ At the top

import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import Modal from "react-modal";
import LanguageSwitcher from "./LanguageSwitcher";
import toast from "react-hot-toast";

Modal.setAppElement("#root");

export default function Navbar({ sidebarOpen, collapsed }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const [profile, setProfile] = useState({ firstName: "", surname: "", profileImage: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [latestTimestamp, setLatestTimestamp] = useState(null);

  const audioRef = useRef(null);

  const fullName =
    profile.firstName || profile.surname
      ? `${profile.firstName} ${profile.surname}`
      : user?.email?.split("@")[0];

  const sidebarWidth = sidebarOpen ? (collapsed ? "5rem" : "16rem") : "0";

  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.email));
        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            profileImage: data.profileImage || "",
            firstName: data.firstName || "",
            surname: data.surname || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!user?.email) return;

    const userEmail = user.email.toLowerCase();
    const userCountry = (user.country || user.countryCode || "").toLowerCase();
    const userReadKey = `${userEmail}_read`;

    const q = query(collection(db, "notifications"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const filtered = data.filter((n) => {
        const recipient = n.recipient;
        const type = n.type;

        if ((n.readBy || []).includes(`${userEmail}_deleted`)) return false;
        if (recipient === "all") return true;
        if (type === "user" && recipient === userEmail) return true;
        if (type === "country") {
          if (Array.isArray(recipient)) {
            return recipient.map((r) => r.toLowerCase()).includes(userCountry);
          } else if (typeof recipient === "string") {
            return recipient.toLowerCase().trim() === userCountry;
          }
        }
        return false;
      });

      const unread = filtered.filter((n) => !(n.readBy || []).includes(userReadKey));
      setUnreadCount(unread.length);
      setNotifications(filtered);

      // Check for new notification and play sound + toast
      if (
        filtered.length > 0 &&
        (!latestTimestamp || filtered[0].timestamp > latestTimestamp)
      ) {
        if (latestTimestamp !== null) {
          audioRef.current?.play();
          toast.success("New notification received");
        }
        setLatestTimestamp(filtered[0].timestamp);
      }
    });

    return () => unsubscribe();
  }, [user, latestTimestamp]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Logout clicked.");
    // Add actual logout logic
  };

  const handleNotificationClick = () => {
    setNotifDropdownOpen(false);
    const code = user?.countryCode?.toLowerCase() || "ng";
    navigate(user?.role === "admin" ? "/admin/notifications" : `/${code}/notifications`);
  };

  const markNotificationsAsRead = async () => {
    const userReadKey = `${user.email}_read`;
    const unread = notifications.filter((n) => !(n.readBy || []).includes(userReadKey));
    for (const n of unread) {
      await updateDoc(doc(db, "notifications", n.id), {
        readBy: [...(n.readBy || []), userReadKey],
      });
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />

      <header
        className="h-16 bg-white shadow-md fixed top-0 right-0 left-0 z-20 flex items-center justify-between px-4 md:px-6 transition-all duration-300"
        style={{ paddingLeft: sidebarWidth }}
      >
        <div className="text-[#0b0b5c] font-semibold text-sm sm:text-base truncate max-w-[60%]">
          {t("navbar.welcome", { name: fullName })}
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          {/* 🔔 Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              className="relative"
              onClick={() => {
                setNotifDropdownOpen((prev) => !prev);
                if (!notifDropdownOpen) markNotificationsAsRead();
              }}
            >
              <Bell className="text-[#0b0b5c]" size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
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
                      <div className="font-semibold text-[#0b0b5c] truncate">{n.title}</div>
                      <div className="text-xs text-gray-500 truncate">{n.message}</div>
                    </div>
                  ))
                )}
                <div className="text-center py-2">
  <button
    className="text-blue-600 hover:underline text-xs"
    onClick={() => {
      setNotifDropdownOpen(false);
      const path = user?.role === "client"
        ? "/notifications"
        : `/${user?.countryCode?.toLowerCase() || "ng"}/notifications`;
      navigate(path);
    }}
  >
    View all notifications
  </button>
</div>


              </div>
            )}
          </div>

          {/* 👤 Avatar */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <div
                className="w-8 h-8 rounded-full overflow-hidden border bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  if (profile.profileImage) setShowImageModal(true);
                }}
              >
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white bg-[#f47b20] text-sm font-semibold">
                    {fullName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-[#0b0b5c] truncate max-w-[100px]">
                {fullName}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md z-50">
                <div className="px-4 py-2 text-sm font-semibold text-[#0b0b5c]">{fullName}</div>
                <button
                  onClick={() => {
                    const code = user?.countryCode?.toLowerCase() || "ng";
                    navigate(`/${code}/settings`);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#0b0b5c] hover:bg-gray-100"
                >
                  <User size={16} />
                  {t("navbar.settings") || "Settings"}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  <LogOut size={16} />
                  {t("navbar.logout") || "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🖼️ Modal */}
      <Modal
        isOpen={showImageModal}
        onRequestClose={() => setShowImageModal(false)}
        className="bg-white p-4 max-w-sm mx-auto mt-20 rounded shadow-lg"
        contentLabel="Image Preview"
      >
        <h2 className="text-lg font-semibold mb-2">Profile Image</h2>
        <img src={profile.profileImage} alt="Full Avatar" className="w-full rounded" />
        <div className="flex justify-end mt-4">
          <button onClick={() => setShowImageModal(false)} className="px-4 py-2 bg-gray-200 rounded text-sm">
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}
