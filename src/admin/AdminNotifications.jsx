import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import AdminLayout from "./AdminLayout";

// Country name + code mapping
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
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState("all");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !message || (recipientType === "country" && selectedCountries.length === 0)) {
      return alert("Please fill in all required fields.");
    }

    const timestamp = new Date().toISOString();

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
      setTitle("");
      setMessage("");
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
          Post New Notification
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Message"
            className="w-full border px-3 py-2 rounded"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

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
