import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import { getCroppedImg } from "../utils/cropImage";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { exportToCSV } from "../utils/exportToCSV";
import toast from "react-hot-toast";
import axios from "axios";

Modal.setAppElement("#root");

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";

export default function ClientSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "",
    surname: "",
    phone: "",
    country: "",
    profession: "",
    education: "",
    degrees: "",
    language: "en",
    notificationsEnabled: true,
    profileImage: ""
  });

  const [preview, setPreview] = useState(DEFAULT_AVATAR);
  const [uploading, setUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [fullImageModalOpen, setFullImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.email));
          const data = userDoc.exists() ? userDoc.data() : {};

          setForm({
            firstName: data.firstName || "",
            surname: data.surname || "",
            phone: data.phone || "",
            country: data.country || "",
            profession: data.profession || "",
            education: data.education || "",
            degrees: data.degrees || "",
            language: data.language || "en",
            notificationsEnabled: data.notificationsEnabled !== false,
            profileImage: data.profileImage || DEFAULT_AVATAR
          });

          setPreview(data.profileImage || DEFAULT_AVATAR);
        } catch (err) {
          console.error("Failed to load user data:", err);
          toast.error(t("client_settings.error"));
        }
      }
    };

    fetchUserData();
  }, [user, t]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleSave = async () => {
    if (user?.email) {
      try {
        await setDoc(doc(db, "users", user.email), form, { merge: true });
        toast.success(t("client_settings.success"));
      } catch (err) {
        console.error(err);
        toast.error(t("client_settings.error"));
      }
    }
  };

  const handleExport = () => {
    exportToCSV(
      {
        Email: user.email,
        FirstName: form.firstName,
        Surname: form.surname,
        Phone: form.phone,
        Country: form.country,
        Profession: form.profession,
        Education: form.education,
        Degrees: form.degrees,
        Language: form.language,
        Notifications: form.notificationsEnabled ? "Yes" : "No"
      },
      "profile_export"
    );
  };

  const handleDelete = () => {
    alert(t("client_settings.delete_message"));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      if (!croppedAreaPixels) return;

      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(croppedBlob);
      setPreview(previewUrl);
      setUploading(true);

      const formData = new FormData();
      formData.append("file", croppedBlob);
      formData.append("upload_preset", "superkay");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dmuvs05yp/image/upload",
        formData
      );

      const uploadedUrl = res.data.secure_url;
      setPreview(uploadedUrl);
      setForm((prev) => ({ ...prev, profileImage: uploadedUrl }));

      toast.success(t("client_settings.profile_updated"));
    } catch (err) {
      console.error(err);
      toast.error(t("client_settings.upload_failed"));
    } finally {
      setUploading(false);
      setCropModalOpen(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(DEFAULT_AVATAR);
    setForm((prev) => ({ ...prev, profileImage: "" }));
    toast.success(t("client_settings.image_removed"));
  };

  const handleResetToDefault = () => {
    setPreview(DEFAULT_AVATAR);
    setForm((prev) => ({ ...prev, profileImage: DEFAULT_AVATAR }));
    toast.success(t("client_settings.avatar_restored"));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#0b0b5c] mb-6">
        {t("client_settings.title")}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            <div
              className={`w-full h-full rounded-full overflow-hidden border border-gray-300 ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
              onClick={() => !uploading && fileInputRef.current?.click()}
              title={t("client_settings.change_image")}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="object-cover w-full h-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullImageModalOpen(true);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                  No image
                </div>
              )}
            </div>

            {!uploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition"
                title={t("client_settings.change_image")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-4.553a1 1 0 011.414 0l1.586 1.586a1 1 0 010 1.414L18 13m-3 2H6a2 2 0 01-2-2V7a2 2 0 012-2h3.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H17a2 2 0 012 2v3"
                  />
                </svg>
              </button>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {uploading && <p className="text-xs text-blue-500">{t("client_settings.uploading")}</p>}

          {!uploading && (
            <div className="flex flex-col items-center gap-1">
              <button onClick={handleRemoveImage} className="text-xs text-red-500 hover:underline">
                {t("client_settings.remove_image")}
              </button>
              <button onClick={handleResetToDefault} className="text-xs text-blue-600 hover:underline">
                {t("client_settings.reset_avatar")}
              </button>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="flex-1 space-y-4">
          {[
            { name: "firstName", label: t("client_settings.first_name") },
            { name: "surname", label: t("client_settings.surname") },
            { name: "phone", label: t("client_settings.phone") },
            { name: "country", label: t("client_settings.country") },
            { name: "profession", label: t("client_settings.profession") },
            { name: "education", label: t("client_settings.education") },
            { name: "degrees", label: t("client_settings.degrees") }
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm text-gray-700">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
          ))}

          <div>
            <label className="text-sm text-gray-700">{t("client_settings.language")}</label>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="notificationsEnabled"
              checked={form.notificationsEnabled}
              onChange={handleChange}
            />
            <label>{t("client_settings.enable_notifications")}</label>
          </div>

          <div className="flex gap-4 pt-4 flex-wrap">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded text-sm">
              {t("client_settings.save")}
            </button>
            <button onClick={handleExport} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
              {t("client_settings.export")}
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded text-sm">
              {t("client_settings.delete")}
            </button>
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      <Modal
        isOpen={cropModalOpen}
        onRequestClose={() => setCropModalOpen(false)}
        contentLabel={t("client_settings.crop_title")}
        className="bg-white p-6 max-w-md mx-auto mt-20 rounded shadow-lg"
      >
        <h2 className="text-lg font-bold mb-4">{t("client_settings.crop_title")}</h2>
        <div className="relative w-full h-64 bg-gray-100">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setCropModalOpen(false)} className="px-3 py-1 text-sm border rounded">
            {t("client_settings.cancel")}
          </button>
          <button onClick={handleCropSave} className="px-3 py-1 bg-blue-600 text-white text-sm rounded">
            {t("client_settings.save_image")}
          </button>
        </div>
      </Modal>

      {/* Full Image Modal */}
      <Modal
        isOpen={fullImageModalOpen}
        onRequestClose={() => setFullImageModalOpen(false)}
        contentLabel={t("client_settings.full_preview")}
        className="bg-white p-4 w-[50%] sm:w-[80%] md:max-w-[30%] mx-auto mt-20 rounded shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-2">{t("client_settings.full_preview")}</h2>
        <img src={preview} alt="Full Profile" className="w-full h-auto rounded" />
        <div className="flex justify-end mt-4">
          <button onClick={() => setFullImageModalOpen(false)} className="px-4 py-2 bg-gray-200 text-sm rounded">
            {t("client_settings.close")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
