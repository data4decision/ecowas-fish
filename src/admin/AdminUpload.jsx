import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import AdminLayout from "./AdminLayout";

const CLOUDINARY_UPLOAD_PRESET = "superkay";
const CLOUDINARY_CLOUD_NAME = "dmuvs05yp";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

const ECOWAS_COUNTRIES = [
  { code: "ALL", name: "All ECOWAS Countries" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "BJ", name: "Benin" },
  { code: "TG", name: "Togo" },
  { code: "BF", name: "Burkina Faso" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "GM", name: "Gambia" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "LR", name: "Liberia" },
  { code: "ML", name: "Mali" },
  { code: "NE", name: "Niger" },
  { code: "SN", name: "Senegal" },
  { code: "SL", name: "Sierra Leone" },
];

export default function AdminUpload() {
  const [form, setForm] = useState({ title: "", country: "ALL" });
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async () => {
    if (!form.title || !form.country || !file) {
      setStatus("Please fill all fields and choose a file.");
      return;
    }

    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", CLOUDINARY_URL);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded * 100.0) / event.total);
        setProgress(percent);
      }
    });

    xhr.onload = async () => {
      const response = JSON.parse(xhr.responseText);
      const url = response.secure_url;

      try {
        await addDoc(collection(db, "upload"), {
          title: form.title,
          url,
          country: form.country,
          uploadedBy: "admin_d4d@gmail.com", // You can replace with actual user auth
          status: "approved",
          timestamp: serverTimestamp(),
        });

        setStatus("File uploaded successfully!");
        setForm({ title: "", country: "ALL" });
        setFile(null);
        setProgress(0);
      } catch (error) {
        console.error("Firestore Error:", error);
        setStatus("Failed to save file to Firestore.");
      }
    };

    xhr.onerror = () => {
      setStatus("Cloudinary upload failed.");
    };

    xhr.send(formData);
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Admin Upload</h2>

        <label className="block mb-2 font-medium">Document Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter document title"
        />

        <label className="block mb-2 font-medium">Select Country</label>
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        >
          {ECOWAS_COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Choose File</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-4"
        />

        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded mb-4">
            <div
              className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload File
        </button>

        {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
      </div>
    </AdminLayout>
  );
}
