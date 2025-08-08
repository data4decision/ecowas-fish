import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import AdminLayout from "./AdminLayout";
import PreviewModal from "./PreviewModal";

export default function AdminReport({ user }) {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "uploads"), (snapshot) => {
      const approved = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => (item.status || "").toLowerCase() === "approved");
      setReports(approved);
    });
    return () => unsub();
  }, []);

  const filtered = reports.filter((r) =>
    (r?.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (r?.country || "").toLowerCase().includes(search.toLowerCase())
  );

  const isImage = (url) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url);

  return (
    <AdminLayout user={user}>
      <h2 className="text-lg font-bold text-[#0b0b5c] mb-4">Approved Reports</h2>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by title or country..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 border text-[#0b0b5c]">Title</th>
              <th className="px-3 py-2 border text-[#0b0b5c]">Country</th>
              <th className="px-3 py-2 border text-[#0b0b5c]">Uploader</th>
              <th className="px-3 py-2 border text-[#0b0b5c]">Status</th>
              <th className="px-3 py-2 border text-[#0b0b5c]">File</th>
              <th className="px-3 py-2 border text-[#0b0b5c]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="border px-3 py-2">{r.title}</td>
                <td className="border px-3 py-2 uppercase">{r.country}</td>
                <td className="border px-3 py-2">{r.email}</td>
                <td className="border px-3 py-2 capitalize">{r.status}</td>
                <td className="border px-3 py-2">
                  {r.fileUrl || r.url ? (
                    isImage(r.fileUrl || r.url) ? (
                      <img
                        src={r.fileUrl || r.url}
                        alt="File"
                        className="w-16 h-16 object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-600">📄 Document</span>
                    )
                  ) : (
                    <span className="text-red-500 text-xs">No File</span>
                  )}
                </td>
                <td className="border px-3 py-2 flex gap-2 flex-wrap">
                  {(r.fileUrl || r.url) && (
                    <>
                      <a
                        href={r.fileUrl || r.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0b0b5c] text-white px-2 py-1 rounded text-xs"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => setSelectedReport(r)}
                        className="bg-gray-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Preview
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReport && (
        <PreviewModal file={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </AdminLayout>
  );
}
