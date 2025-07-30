import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import AdminLayout from "./AdminLayout";
import { sendFCMNotification, sendEmailNotification, logAuditTrail } from "../utils/notifications";
import PreviewModal from "./PreviewModal";

export default function AdminUpload({ user }) {
  const [uploads, setUploads] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "uploads"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUploads(data);
    });
    return () => unsub();
  }, []);

  const handleStatusChange = async (uploadId, newStatus, email, title) => {
    const uploadRef = doc(db, "uploads", uploadId);
    await updateDoc(uploadRef, { status: newStatus });

    const fallbackEmail = "noreply@ecowas.org";
    const recipientEmail = email || fallbackEmail;

    const subject = `Your file "${title}" has been ${newStatus}`;
    const htmlMessage = `
      <p>Hello,</p>
      <p>Your file titled <strong>${title}</strong> has been <strong>${newStatus}</strong> by the ECOWAS Admin.</p>
      <p>Thank you for using the ECOWAS Fisheries platform.</p>
      <p style='color: gray;'>- ECOWAS Fisheries Dashboard</p>
    `;

    await sendEmailNotification(recipientEmail, subject, htmlMessage);
    await sendFCMNotification(email, subject, "Your report update.");
    await logAuditTrail({
      action: `${newStatus.toUpperCase()} file`,
      file: title,
      admin: user?.email,
      timestamp: new Date().toISOString()
    });
  };

  const normalizedFilter = (filter || '').toLowerCase();
  const normalizedSearch = (search || '').toLowerCase();

  const filteredUploads = uploads
    .filter((u) => (u?.status || '').toLowerCase().includes(normalizedFilter))
    .filter((u) => (u?.title || '').toLowerCase().includes(normalizedSearch));

  const isImage = (url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  return (
    <AdminLayout user={user}>
      <h2 className="text-lg font-bold text-[#0b0b5c] mb-4">Manage Country Reports</h2>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <select
          className="border px-3 py-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="">All</option>
        </select>

        <input
          type="text"
          placeholder="Search by title..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 border">Title</th>
              <th className="px-3 py-2 border">Country</th>
              <th className="px-3 py-2 border">Uploader</th>
              <th className="px-3 py-2 border">Status</th>
              <th className="px-3 py-2 border">File</th>
              <th className="px-3 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUploads.map((upload) => (
              <tr key={upload.id}>
                <td className="border px-3 py-1">{upload.title}</td>
                <td className="border px-3 py-1">{upload.country}</td>
                <td className="border px-3 py-1">{upload.email}</td>
                <td className="border px-3 py-1 capitalize">{upload.status}</td>
                <td className="border px-3 py-1">
                  {upload.url ? (
                    isImage(upload.url) ? (
                      <img src={upload.url} alt="Uploaded File" className="w-16 h-16 object-cover" />
                    ) : (
                      <p className="text-xs text-gray-600">📄 Document Uploaded</p>
                    )
                  ) : (
                    <span className="text-red-500 text-xs">No File</span>
                  )}
                </td>
                <td className="border px-3 py-1 flex gap-2 flex-wrap">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleStatusChange(upload.id, "approved", upload.email, upload.title)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleStatusChange(upload.id, "rejected", upload.email, upload.title)}
                  >
                    Reject
                  </button>

                  {upload.url && (
                    <a
                      href={upload.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Download
                    </a>
                  )}

                  <button
                    className="bg-gray-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() => setSelectedFile(upload)}
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedFile && (
        <PreviewModal file={selectedFile} onClose={() => setSelectedFile(null)} />
      )}
    </AdminLayout>
  );
}
