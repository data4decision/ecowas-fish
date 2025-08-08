import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import AdminLayout from "./AdminLayout";
import PreviewModal from "./PreviewModal";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function AdminEntries({ user }) {
  const [entries, setEntries] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "uploads"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
    });
    return () => unsub();
  }, []);

  const filtered = entries.filter((entry) => {
    if (filter === "all") return true;
    return (entry.status || "").toLowerCase() === filter.toLowerCase();
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Admin Report Entries", 14, 14);
    const rows = filtered.map((e) => [
      e.title,
      e.country,
      e.email,
      e.status || "N/A"
    ]);
    doc.autoTable({
      head: [["Title", "Country", "Uploader", "Status"]],
      body: rows,
    });
    doc.save("admin-entries.pdf");
  };

const handleExportCSV = () => {
  try {
    const parser = new Parser();
    const csv = parser.parse(
      filtered.map((e) => ({
        Title: e.title,
        Country: e.country,
        Uploader: e.email,
        Status: e.status,
        Date: new Date(e.timestamp || e.addedAt || Date.now()).toLocaleDateString(),
      }))
    );

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "admin-entries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("CSV Export Error:", error);
  }
};


  return (
    <AdminLayout user={user}>
      <div className="p-4">
        <h2 className="text-xl font-bold text-[#0b0b5c] mb-4">Admin Report Entries</h2>

        <div className="flex justify-between items-center mb-4">
          <select
            className="border px-3 py-2 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded text-sm"
              onClick={handleExportPDF}
            >
              Export PDF
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
              onClick={handleExportCSV}
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">Title</th>
                <th className="px-3 py-2 border">Country</th>
                <th className="px-3 py-2 border">Uploader</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id}>
                  <td className="border px-3 py-2">{entry.title}</td>
                  <td className="border px-3 py-2">{entry.country}</td>
                  <td className="border px-3 py-2">{entry.email}</td>
                  <td className="border px-3 py-2 capitalize">{entry.status}</td>
                  <td className="border px-3 py-2">
                    <button
                      className="bg-gray-700 text-white px-2 py-1 rounded text-xs"
                      onClick={() => setSelectedFile(entry)}
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
      </div>
    </AdminLayout>
  );
}
