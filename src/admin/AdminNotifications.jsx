import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import AdminLayout from "./AdminLayout";

const ECOWAS_COUNTRIES = [
  { name: "Nigeria", code: "NG" },
  { name: "Ghana", code: "GH" },
  { name: "Benin", code: "BJ" },
  { name: "Togo", code: "TG" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Côte d'Ivoire", code: "CI" },
  { name: "Gambia", code: "GM" },
  { name: "Guinea", code: "GN" },
  { name: "Guinea-Bissau", code: "GW" },
  { name: "Liberia", code: "LR" },
  { name: "Mali", code: "ML" },
  { name: "Niger", code: "NE" },
  { name: "Senegal", code: "SN" },
  { name: "Sierra Leone", code: "SL" }
];

export default function AdminNotificationForm() {
  const [title, setTitle] = useState({ en: "", fr: "", pt: "" });
  const [message, setMessage] = useState({ en: "", fr: "", pt: "" });
  const [recipientType, setRecipientType] = useState("all");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyField =
      !title.en || !message.en || !title.fr || !message.fr || !title.pt || !message.pt;

    if (
      hasEmptyField ||
      (recipientType === "country" && selectedCountries.length === 0)
    ) {
      return alert("Please complete all title and message fields in each language.");
    }

    const timestamp = new Date();

    try {
      if (recipientType === "all") {
        await addDoc(collection(db, "notifications"), {
          title,
          message,
          timestamp,
          type: "all",
          recipient: "all",
          readBy: []
        });
      } else if (recipientType === "country") {
        for (const country of selectedCountries) {
          const matched = ECOWAS_COUNTRIES.find(c => c.name === country);
          const code = matched?.code?.toLowerCase() || country.toLowerCase();

          await addDoc(collection(db, "notifications"), {
            title,
            message,
            timestamp,
            type: "country",
            recipient: code.trim(),
            readBy: []
          });
        }
      } else {
        await addDoc(collection(db, "notifications"), {
          title,
          message,
          timestamp,
          type: "user",
          recipient: recipientEmail.trim().toLowerCase(),
          readBy: []
        });
      }

      setStatus("✅ Notification sent successfully.");
      setTitle({ en: "", fr: "", pt: "" });
      setMessage({ en: "", fr: "", pt: "" });
      setSelectedCountries([]);
      setRecipientEmail("");
    } catch (err) {
      console.error("Error sending notification:", err);
      setStatus("❌ Error sending notification.");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
        <h2 className="text-2xl font-semibold text-[#0b0b5c] mb-4">
          Post New Notification (Multilingual)
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Fields */}
          <div className="grid md:grid-cols-3 gap-4">
            {["en", "fr", "pt"].map((lang) => (
              <input
                key={lang}
                type="text"
                placeholder={`Title (${lang.toUpperCase()})`}
                className="w-full border px-3 py-2 rounded"
                value={title[lang]}
                onChange={(e) => setTitle({ ...title, [lang]: e.target.value })}
                required
              />
            ))}
          </div>

          {/* Message Fields */}
          <div className="grid md:grid-cols-3 gap-4">
            {["en", "fr", "pt"].map((lang) => (
              <textarea
                key={lang}
                placeholder={`Message (${lang.toUpperCase()})`}
                className="w-full border px-3 py-2 rounded"
                rows={3}
                value={message[lang]}
                onChange={(e) => setMessage({ ...message, [lang]: e.target.value })}
                required
              />
            ))}
          </div>

          {/* Recipient Type */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Recipient Type</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={recipientType}
              onChange={(e) => {
                setRecipientType(e.target.value);
                setSelectedCountries([]);
                setRecipientEmail("");
              }}
            >
              <option value="all">All Users</option>
              <option value="country">One or More Countries</option>
              <option value="user">Specific User Email</option>
            </select>
          </div>

          {/* Country Selector */}
          {recipientType === "country" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Country/Countries
              </label>
              <select
                multiple
                className="w-full border px-3 py-2 rounded h-40"
                value={selectedCountries}
                onChange={(e) =>
                  setSelectedCountries([...e.target.selectedOptions].map(opt => opt.value))
                }
                required
              >
                {ECOWAS_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or ⌘ (Mac) to select multiple.</p>
            </div>
          )}

          {/* User Email Field */}
          {recipientType === "user" && (
            <input
              type="email"
              className="w-full border px-3 py-2 rounded"
              placeholder="Recipient Email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            className="bg-[#0b0b5c] text-white px-6 py-2 rounded hover:bg-[#f47b20]"
          >
            Send Notification
          </button>
        </form>

        {status && <p className="text-sm mt-3 text-green-600">{status}</p>}
      </div>
    </AdminLayout>
  );
}
