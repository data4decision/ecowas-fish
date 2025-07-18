import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { saveAs } from "file-saver";

export default function UploadHistoryTable({ user }) {
  const [uploads, setUploads] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const q = query(collection(db, "uploads"), where("email", "==", user.email));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUploads(data);
    });

    return () => unsub();
  }, [user.email]);

  const handleDownload = (url, title) => {
    saveAs(url, title || "download");
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this file?");
    if (confirm) {
      await deleteDoc(doc(db, "uploads", id));
    }
  };

  const filteredUploads = uploads.filter(
    (u) =>
      (!statusFilter || u.status === statusFilter) &&
      u.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUploads.length / itemsPerPage);
  const paginated = filteredUploads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <input
            type="text"
            placeholder="Search by title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-1 rounded"
          />
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-left text-[#0b0b5c]">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Country</th>
              <th className="p-2">Status</th>
              <th className="p-2">File</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((upload) => (
              <tr key={upload.id} className="border-t">
                <td className="p-2">{upload.title}</td>
                <td className="p-2">{upload.country}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      upload.status === "approved"
                        ? "bg-green-500"
                        : upload.status === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {upload.status}
                  </span>
                </td>
                <td className="p-2">
                  {upload.url.includes(".pdf") ? "📕" :
                   upload.url.includes(".docx") ? "📄" :
                   upload.url.includes(".xlsx") ? "📊" :
                   upload.url.includes(".png") || upload.url.includes(".jpg") ? "🖼️" :
                   "📁"}
                </td>
                <td className="p-2 flex gap-2 flex-wrap">
                  <button
                    onClick={() => window.open(upload.url, "_blank")}
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownload(upload.url, upload.title)}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(upload.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUploads.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No uploads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-3 items-center text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-[#0b0b5c] font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
