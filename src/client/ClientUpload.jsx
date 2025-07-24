import React, { useState, useCallback } from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import UploadHistoryTable from "../components/UploadHistoryTable";

const UPLOAD_PRESET = "superkay";
const SERVICE_ID = "service_123abc";
const TEMPLATE_ID = "__ejs-test-mail-service__";
const PUBLIC_KEY = "YdXH7zCJtfM6CuSxE";

export default function ClientUpload({ user }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ title: "", country: "", email: "" });
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [preview, setPreview] = useState(null);

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/gif"
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      alert(t("client_upload.invalid_file"));
      return;
    }

    setFile(selectedFile);
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert(t("client_upload.select_file"));

    setStatus(t("client_upload.uploading"));
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const uploadUrl = file.type.startsWith("image/")
      ? "https://api.cloudinary.com/v1_1/dmuvs05yp/image/upload"
      : "https://api.cloudinary.com/v1_1/dmuvs05yp/raw/upload";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    });

    xhr.onload = async () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 200 && response.secure_url) {
          const fileUrl = response.secure_url;

          await addDoc(collection(db, "uploads"), {
            ...form,
            url: fileUrl,
            status: "pending",
            timestamp: new Date().toISOString()
          });

          await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
              to_email: form.email,
              subject: `${t("client_upload.email_subject")} ${form.title}`,
              message: `${t("client_upload.email_message", { title: form.title })}`
            },
            PUBLIC_KEY
          );

          setStatus(t("client_upload.success"));
          setSuccessModal(true);
          setForm({ title: "", country: "", email: "" });
          setFile(null);
          setProgress(0);
        } else {
          setStatus(t("client_upload.no_url"));
        }
      } catch (error) {
        setStatus(t("client_upload.success"));
        console.error(error);
      }
    };

    xhr.onerror = () => {
      setStatus(t("client_upload.network_error"));
    };

    xhr.send(formData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-[#0b0b5c]">{t("client_upload.title")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder={t("client_upload.placeholders.title")}
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="country"
          placeholder={t("client_upload.placeholders.country")}
          value={form.country}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t("client_upload.placeholders.email")}
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <div {...getRootProps()} className="border-2 border-dashed rounded px-4 py-6 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive
            ? <p>{t("client_upload.drop_here")}</p>
            : <p>{t("client_upload.drag_or_click")}</p>}
        </div>

        {file && (
          <div className="mt-4 flex items-center space-x-3 border p-3 rounded">
            {preview ? (
              <img src={preview} alt="Preview" className="w-14 h-14 object-cover rounded" />
            ) : (
              <div className="text-3xl">
                {file.type.includes("pdf") && <span>📕</span>}
                {file.type.includes("word") && <span>📄</span>}
                {file.type.includes("spreadsheet") && <span>📊</span>}
                {file.type.includes("image") && <span>🖼️</span>}
              </div>
            )}
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-gray-500">{file.type}</p>
            </div>
          </div>
        )}

        {progress > 0 && (
          <div className="w-full bg-gray-200 h-2 rounded">
            <div className="bg-[#0b0b5c] h-2 rounded" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        <button type="submit" className="bg-[#0b0b5c] text-white px-4 py-2 rounded hover:bg-[#f47b20]">
          {t("client_upload.upload_btn")}
        </button>
      </form>

      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}

      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm text-center shadow">
            <h3 className="text-lg font-semibold text-[#0b0b5c] mb-2">{t("client_upload.modal.title")}</h3>
            <p className="text-sm mb-4 text-gray-700">{t("client_upload.modal.body")}</p>
            <button
              onClick={() => setSuccessModal(false)}
              className="mt-2 bg-[#f47b20] text-white px-4 py-2 rounded"
            >
              {t("client_upload.modal.close_btn")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
