import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ClientSettings() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    language: "en",
    notifyUploads: true,
    notifyUpdates: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      const fetchSettings = async () => {
        const docRef = doc(db, "users", user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({
            fullName: data.fullName || user.name || "",
            language: data.language || "en",
            notifyUploads: data.notifyUploads ?? true,
            notifyUpdates: data.notifyUpdates ?? false,
          });
        }
        setLoading(false);
      };
      fetchSettings();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "users", user.email), form, { merge: true });
      i18n.changeLanguage(form.language);
      toast.success(t("settings.success", { defaultValue: "Settings updated successfully" }));
    } catch (err) {
      toast.error(t("settings.error", { defaultValue: "Failed to update settings" }));
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold text-[#0b0b5c]">
        {t("settings.title", { defaultValue: "Client Settings" })}
      </h2>

      {/* General Info */}
      <section className="bg-white shadow-md rounded p-5">
        <h3 className="text-lg font-semibold mb-4">👤 {t("settings.general", { defaultValue: "General Account Info" })}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("settings.fullName")}</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              value={user.email}
              disabled
              className="w-full border border-gray-200 p-2 bg-gray-100 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              type="text"
              value={user.countryCode || "-"}
              disabled
              className="w-full border border-gray-200 p-2 bg-gray-100 rounded"
            />
          </div>
        </div>
      </section>

      {/* Language & Region */}
      <section className="bg-white shadow-md rounded p-5">
        <h3 className="text-lg font-semibold mb-4">🌐 {t("settings.languageSection", { defaultValue: "Language & Region" })}</h3>
        <select
          name="language"
          value={form.language}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="pt">Português</option>
        </select>
      </section>

      {/* Notifications */}
      <section className="bg-white shadow-md rounded p-5">
        <h3 className="text-lg font-semibold mb-4">🔔 {t("settings.notifications", { defaultValue: "Notifications" })}</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="notifyUploads"
              checked={form.notifyUploads}
              onChange={handleChange}
              id="uploads"
            />
            <label htmlFor="uploads">{t("settings.notifyUploads")}</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="notifyUpdates"
              checked={form.notifyUpdates}
              onChange={handleChange}
              id="updates"
            />
            <label htmlFor="updates">{t("settings.notifyUpdates")}</label>
          </div>
        </div>
      </section>

      {/* Your Info */}
      <section className="bg-white shadow-md rounded p-5">
        <h3 className="text-lg font-semibold mb-4">📂 {t("settings.yourInfo", { defaultValue: "Your Information" })}</h3>
        <div className="flex flex-col gap-4">
          <button type="button" className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm">
            ⬇️ {t("settings.exportData", { defaultValue: "Export my activity (CSV)" })}
          </button>
          <button type="button" className="border px-4 py-2 rounded bg-red-100 hover:bg-red-200 text-sm">
            🗑️ {t("settings.requestDeletion", { defaultValue: "Request data deletion" })}
          </button>
        </div>
      </section>

      {/* Help & Support */}
      <section className="bg-white shadow-md rounded p-5">
        <h3 className="text-lg font-semibold mb-4">🛠️ {t("settings.help", { defaultValue: "Help & Support" })}</h3>
        <div className="flex flex-col gap-2 text-sm">
          <a href="/help" className="text-blue-600 underline">❓ {t("settings.visitHelp", { defaultValue: "Visit Help Page" })}</a>
          <a href="mailto:d4d2025t@data4decision.org" className="text-blue-600 underline">📧 d4d2025t@data4decision.org</a>
          <a href="https://wa.me/2349040009930" className="text-green-600 underline">💬 +234 904 000 9930 (WhatsApp)</a>
        </div>
      </section>

      {/* Submit */}
      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="bg-[#0b0b5c] text-white px-6 py-2 rounded hover:bg-[#2d2d8a]"
        >
          {t("settings.save", { defaultValue: "Save Changes" })}
        </button>
      </div>
    </div>
  );
}