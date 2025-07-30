import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { FaTrash, FaCheckCircle } from "react-icons/fa";

export default function ClientNotifications({ user }) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const q = query(collection(db, "notifications"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        const userEmail = user.email?.toLowerCase().trim();
        const userCountry = (user.country || user.countryCode || "").toLowerCase().trim();

        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((noti) => {
            const readBy = noti.readBy || [];
            const recipient = noti.recipient;
            const type = noti.type;

            if (readBy.includes(`${userEmail}_deleted`)) return false;

            if (recipient === "all") return true;

            if (type === "user" && recipient === userEmail) return true;

            if (type === "country") {
              if (Array.isArray(recipient)) {
                return recipient.map(r => r.toLowerCase()).includes(userCountry);
              } else if (typeof recipient === "string") {
                return recipient.toLowerCase().trim() === userCountry;
              }
            }

            return false;
          });

        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleDelete = async (notiId) => {
    const userKey = `${user.email}_deleted`;
    try {
      const noti = notifications.find((n) => n.id === notiId);
      const updatedReadBy = [...(noti.readBy || []), userKey];

      await updateDoc(doc(db, "notifications", notiId), {
        readBy: updatedReadBy,
      });

      setNotifications((prev) => prev.filter((n) => n.id !== notiId));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleMarkAsRead = async (notiId) => {
    const userKey = `${user.email}_read`;
    try {
      const noti = notifications.find((n) => n.id === notiId);
      const updatedReadBy = [...(noti.readBy || []), userKey];

      await updateDoc(doc(db, "notifications", notiId), {
        readBy: updatedReadBy,
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notiId ? { ...n, readBy: updatedReadBy } : n
        )
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const isRead = (noti) =>
    (noti.readBy || []).includes(`${user.email}_read`);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-[#0b0b5c] mb-4">
        {t("notifications.title", { defaultValue: "Notifications" })}
      </h2>

      {loading ? (
        <p>{t("notifications.loading", { defaultValue: "Loading notifications..." })}</p>
      ) : notifications.length === 0 ? (
        <p>{t("notifications.none", { defaultValue: "No notifications yet." })}</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((noti) => (
            <li
              key={noti.id}
              className={`border p-4 rounded shadow bg-white relative ${
                isRead(noti) ? "opacity-60" : ""
              }`}
            >
              <div className="absolute top-2 right-2 flex space-x-2">
                {!isRead(noti) && (
                  <button
                    onClick={() => handleMarkAsRead(noti.id)}
                    className="text-green-600 hover:text-green-800"
                    title="Mark as Read"
                  >
                    <FaCheckCircle />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(noti.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Notification"
                >
                  <FaTrash />
                </button>
              </div>
              <h4 className="text-lg font-semibold text-[#0b0b5c]">{noti.title}</h4>
              <p className="text-gray-700 text-sm">{noti.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(noti.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
