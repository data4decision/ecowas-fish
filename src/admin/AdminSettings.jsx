import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "./AdminLayout";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import axios from "axios";
import toast from "react-hot-toast";

import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

import { exportToCSV } from "../utils/exportToCSV";
import { getCroppedImg } from "../utils/cropImage";

Modal.setAppElement("#root");

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff";

export default function AdminSettings({ user }) {
  const fileInputRef = useRef(null);

  // ----- profile form -----
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [surname, setSurname] = useState(user?.surname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Africa/Lagos");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);

  // ----- security form -----
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  // ----- avatar + crop -----
  const [preview, setPreview] = useState(DEFAULT_AVATAR);
  const [profileImage, setProfileImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [fullImageModalOpen, setFullImageModalOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const userDocRef = user?.uid ? doc(db, "users", user.uid) : null;

  // load admin profile
  useEffect(() => {
    const load = async () => {
      if (!userDocRef) return;
      try {
        const snap = await getDoc(userDocRef);
        const data = snap.exists() ? snap.data() : {};
        setFirstName(data.firstName || user?.firstName || "");
        setSurname(data.surname || user?.surname || "");
        setEmail(data.email || user?.email || "");
        setLanguage(data?.preferences?.language || "en");
        setTimezone(data?.preferences?.timezone || "Africa/Lagos");
        setNotifyEmail(data?.preferences?.notifyEmail ?? true);
        setNotifyPush(data?.preferences?.notifyPush ?? false);

        const img = data.profileImage || DEFAULT_AVATAR;
        setProfileImage(img);
        setPreview(img);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load settings.");
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  // ---------- helpers ----------
  const reauth = async () => {
    if (!auth.currentUser?.email) throw new Error("No signed-in user.");
    const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPw);
    await reauthenticateWithCredential(auth.currentUser, cred);
  };

  // ---------- save profile / prefs ----------
  const onSaveProfile = async () => {
    if (!userDocRef) return;
    setSaving(true); setMsg(null);
    try {
      await setDoc(userDocRef, {
        firstName, surname, email,
        profileImage,
        preferences: { language, timezone, notifyEmail, notifyPush }
      }, { merge: true });
      setMsg({ type: "success", text: "Profile saved." });
      toast.success("Profile saved.");
    } catch (e) {
      setMsg({ type: "error", text: e.message });
      toast.error("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // ---------- change email ----------
  const onChangeEmail = async () => {
    if (!auth.currentUser || !userDocRef) return;
    if (!currentPw) { toast.error("Enter your current password to change email."); return; }
    setSaving(true); setMsg(null);
    try {
      await reauth();
      await updateEmail(auth.currentUser, email);
      await setDoc(userDocRef, { email }, { merge: true });
      toast.success("Email updated.");
    } catch (e) {
      toast.error(e.message);
      setMsg({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  // ---------- change password ----------
  const onChangePassword = async () => {
    if (!auth.currentUser) return;
    if (!currentPw || !newPw) { toast.error("Enter current and new password."); return; }
    setSaving(true); setMsg(null);
    try {
      await reauth();
      await updatePassword(auth.currentUser, newPw);
      setCurrentPw(""); setNewPw("");
      toast.success("Password updated.");
    } catch (e) {
      toast.error(e.message);
      setMsg({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  // ---------- export profile ----------
  const onExport = () => {
    exportToCSV(
      {
        Email: email,
        FirstName: firstName,
        Surname: surname,
        Language: language,
        Timezone: timezone,
        NotifyEmail: notifyEmail ? "Yes" : "No",
        NotifyPush: notifyPush ? "Yes" : "No"
      },
      "admin_profile_export"
    );
  };

  // ---------- delete (placeholder) ----------
  const onDelete = () => {
    alert("This would trigger an admin account deletion flow (with re-auth & confirmation).");
  };

  // ---------- avatar upload / crop ----------
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { setImageSrc(reader.result); setCropModalOpen(true); };
    reader.readAsDataURL(f);
  };

  const onCropComplete = (_, area) => setCroppedAreaPixels(area);

  const onCropSave = async () => {
    try {
      if (!croppedAreaPixels) return;
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const previewUrl = URL.createObjectURL(blob);
      setPreview(previewUrl);
      setUploading(true);

      const fd = new FormData();
      fd.append("file", blob);
      fd.append("upload_preset", "superkay");

      const res = await axios.post("https://api.cloudinary.com/v1_1/dmuvs05yp/image/upload", fd);
      const url = res.data.secure_url;

      setPreview(url);
      setProfileImage(url);
      toast.success("Profile photo updated.");
    } catch (e) {
      console.error(e);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
      setCropModalOpen(false);
    }
  };

  const removeImage = () => {
    setPreview(DEFAULT_AVATAR);
    setProfileImage("");
    toast.success("Image removed.");
  };
  const resetAvatar = () => {
    setPreview(DEFAULT_AVATAR);
    setProfileImage(DEFAULT_AVATAR);
    toast.success("Default avatar restored.");
  };

  return (
    <AdminLayout user={user}>
      <div className="p-6">
        <h2 className="mb-4 text-2xl font-bold text-primary dark:text-gray-100">Admin Settings</h2>

        {msg && (
          <div className={`mb-4 rounded border px-3 py-2 text-sm ${
            msg.type === "success"
              ? "border-green-400 text-green-700 bg-green-50 dark:bg-green-900/20"
              : "border-red-400 text-red-700 bg-red-50 dark:bg-red-900/20"
          }`}>
            {msg.text}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[320px,1fr]">
          {/* Avatar Card */}
          <section className="rounded border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-primary dark:text-gray-100">Profile Photo</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-32 w-32">
                <button
                  type="button"
                  className={`h-32 w-32 overflow-hidden rounded-full border border-gray-300 dark:border-gray-600 ${uploading ? "opacity-50" : ""}`}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  title="Change image"
                >
                  <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />
              </div>

              {uploading && <p className="text-xs text-blue-500">Uploading...</p>}

              {!uploading && (
                <div className="flex flex-col items-center gap-1">
                  <button onClick={removeImage} className="text-xs text-red-500 hover:underline">Remove image</button>
                  <button onClick={resetAvatar} className="text-xs text-blue-600 hover:underline">Reset to default</button>
                </div>
              )}
            </div>
          </section>

          {/* Details + Preferences */}
          <section className="rounded border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-3 text-lg font-semibold text-primary dark:text-gray-100">Profile & Preferences</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">First name</label>
                <input value={firstName} onChange={e=>setFirstName(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"/>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Surname</label>
                <input value={surname} onChange={e=>setSurname(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"/>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"/>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Language</label>
                <select value={language} onChange={e=>setLanguage(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100">
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Timezone</label>
                <select value={timezone} onChange={e=>setTimezone(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100">
                  <option value="Africa/Lagos">Africa/Lagos</option>
                </select>
              </div>

              <label className="sm:col-span-2 mt-1 flex items-center gap-3 text-sm">
                <input type="checkbox" checked={notifyEmail} onChange={e=>setNotifyEmail(e.target.checked)}
                  className="h-4 w-4 accent-[var(--tw-color-accent,#f47b20)]"/>
                <span className="text-gray-700 dark:text-gray-300">Email me when new reports are available</span>
              </label>

              <label className="sm:col-span-2 -mt-2 flex items-center gap-3 text-sm">
                <input type="checkbox" checked={notifyPush} onChange={e=>setNotifyPush(e.target.checked)}
                  className="h-4 w-4 accent-[var(--tw-color-accent,#f47b20)]"/>
                <span className="text-gray-700 dark:text-gray-300">Enable push notifications</span>
              </label>

              <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
                <button onClick={onSaveProfile} disabled={saving}
                  className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
                  {saving ? "Saving..." : "Save Profile"}
                </button>
                <button onClick={onExport}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-primary hover:bg-accent/10 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700">
                  Export CSV
                </button>
                <button onClick={onDelete}
                  className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Security */}
        <section className="mt-6 rounded border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-3 text-lg font-semibold text-primary dark:text-gray-100">Security</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Current password</label>
              <input type="password" value={currentPw} onChange={e=>setCurrentPw(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"/>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">New password</label>
              <input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-accent dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"/>
            </div>
            <div className="flex items-end gap-3">
              <button onClick={onChangePassword} disabled={saving}
                className="rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60">
                Update Password
              </button>
              <button onClick={onChangeEmail} disabled={saving}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                Update Email
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Changing email/password requires your current password (re-authentication).
          </p>
        </section>
      </div>

      {/* Crop Modal */}
      <Modal
        isOpen={cropModalOpen}
        onRequestClose={() => setCropModalOpen(false)}
        contentLabel="Crop Image"
        className="mx-auto mt-20 max-w-md rounded bg-white p-6 shadow-lg dark:bg-gray-800"
        overlayClassName="fixed inset-0 bg-black/40"
      >
        <h2 className="mb-4 text-lg font-bold text-primary dark:text-gray-100">Crop Image</h2>
        <div className="relative h-64 w-full rounded bg-gray-100 dark:bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, area)=>setCroppedAreaPixels(area)}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => setCropModalOpen(false)} className="rounded border border-gray-300 px-3 py-1 text-sm dark:border-gray-600 dark:text-gray-200">Cancel</button>
          <button onClick={onCropSave} className="rounded bg-accent px-3 py-1 text-sm text-white">Save Image</button>
        </div>
      </Modal>

      {/* Full Image Modal */}
      <Modal
        isOpen={fullImageModalOpen}
        onRequestClose={() => setFullImageModalOpen(false)}
        contentLabel="Full Preview"
        className="mx-auto mt-20 w-[50%] rounded bg-white p-4 shadow-lg dark:bg-gray-800 sm:w-[80%] md:max-w-[30%]"
        overlayClassName="fixed inset-0 bg-black/40"
      >
        <h2 className="mb-2 text-lg font-semibold text-primary dark:text-gray-100">Profile Preview</h2>
        <img src={preview} alt="Full Profile" className="h-auto w-full rounded" />
        <div className="mt-4 flex justify-end">
          <button onClick={() => setFullImageModalOpen(false)} className="rounded bg-gray-200 px-4 py-2 text-sm dark:bg-gray-700 dark:text-gray-100">Close</button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
