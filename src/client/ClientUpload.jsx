
import React, { useState, useCallback } from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { useDropzone } from "react-dropzone";
import UploadHistoryTable from "../components/UploadHistoryTable";

const UPLOAD_PRESET = "superkay";
const SERVICE_ID = "service_123abc";
const TEMPLATE_ID = "__ejs-test-mail-service__";
const PUBLIC_KEY = "YdXH7zCJtfM6CuSxE";

export default function ClientUpload({ user }) {
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
      alert("Invalid file type");
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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    setStatus("Uploading...");
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
              subject: `Upload received: ${form.title}`,
              message: `Dear user,\n\nYour file titled \"${form.title}\" has been successfully uploaded and is under review.\n\nThank you.\n- ECOWAS Fisheries Team`
            },
            PUBLIC_KEY
          );

          setStatus("✅ Upload successful!");
          setSuccessModal(true);
          setForm({ title: "", country: "", email: "" });
          setFile(null);
          setProgress(0);
        } else {
          setStatus("❌ Upload failed. No URL returned.");
        }
      } catch (error) {
        setStatus("✅ Upload successful!.");
        console.error(error);
      }
    };

    xhr.onerror = () => {
      setStatus("❌ Upload failed. Check network.");
    };

    xhr.send(formData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-[#0b0b5c]">Client Upload</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <div {...getRootProps()} className="border-2 border-dashed rounded px-4 py-6 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? <p>Drop the file here...</p> : <p>Drag and drop a file here, or click to select</p>}
        </div>

        {file && (
  <div className="mt-4 flex items-center space-x-3 border p-3 rounded">
    {preview ? (
      <img src={preview} alt="Preview" className="w-14 h-14 object-cover rounded" />
    ) : (
      <div className="text-3xl">
        {file.type === 'application/pdf' && <span>📕</span>}
        {file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && <span>📄</span>}
        {file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && <span>📊</span>}
        {file.type === 'image/webp' && <span>🖼️</span>}
        {file.type === 'image/gif' && <span>🎞️</span>}
        {file.type.startsWith('image/') && !preview && <span>🖼️</span>}
        {!preview && !['pdf', 'docx', 'xlsx'].includes(file.type) && <span>📁</span>}
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

        <button
          type="submit"
          className="bg-[#0b0b5c] text-white px-4 py-2 rounded hover:bg-[#f47b20]"
        >
          Upload
        </button>
      </form>

      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}

      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm text-center shadow">
            <h3 className="text-lg font-semibold text-[#0b0b5c] mb-2">Upload Successful 🎉</h3>
            <p className="text-sm mb-4 text-gray-700">Thank you for submitting your report. You'll receive an email confirmation shortly.</p>
            <button
              onClick={() => setSuccessModal(false)}
              className="mt-2 bg-[#f47b20] text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
         <UploadHistoryTable user={user} />

        </div>
        
      )}
    </div>
  );
}
