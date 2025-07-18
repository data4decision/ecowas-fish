import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase"; // your Firebase config
import { FiDownload } from "react-icons/fi";

export default function AdminFilePreview() {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchUploads = async () => {
      const snapshot = await getDocs(collection(db, "uploads"));
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUploads(docs);
    };
    fetchUploads();
  }, []);

  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold text-[#0b0b5c] mb-4">Uploaded Files</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Filename</th>
              <th className="border px-3 py-2">Type</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Uploaded By</th>
              <th className="border px-3 py-2">Preview/Download</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map(file => (
              <tr key={file.id}>
                <td className="border px-3 py-2">{file.filename}</td>
                <td className="border px-3 py-2">{file.type}</td>
                <td className="border px-3 py-2">{file.status}</td>
                <td className="border px-3 py-2">{file.uploadedBy}</td>
                <td className="border px-3 py-2">
                  {file.type.includes("image") ? (
                    <img
                      src={file.fileURL}
                      alt={file.filename}
                      className="h-16 rounded cursor-pointer hover:scale-105 transition"
                      onClick={() => window.open(file.fileURL, "_blank")}
                    />
                  ) : (
                    <button
                      className="text-blue-600 hover:underline flex items-center gap-1"
                      onClick={() => handleDownload(file.fileURL, file.filename)}
                    >
                      <FiDownload /> Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
