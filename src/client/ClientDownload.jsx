// import React, { useEffect, useState } from "react";
// import { db } from "../firebase/firebase";
// import { collection, onSnapshot, query } from "firebase/firestore";
// import { saveAs } from "file-saver";
// import { useTranslation } from "react-i18next";

// export default function ClientDownload({ user }) {
//   const { t } = useTranslation();
//   const [downloads, setDownloads] = useState([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     const q = query(collection(db, "upload"));
//     const unsub = onSnapshot(q, (snapshot) => {
//       const data = snapshot.docs
//         .map((doc) => ({ id: doc.id, ...doc.data() }))
//         .filter(
//           (file) =>
//             file.status === "approved" &&
//             (file.country === user.country || file.country === "ALL")
//         );
//       setDownloads(data);
//     });
//     return () => unsub();
//   }, [user.country]);

//   const handleDownload = (url, title) => {
//     saveAs(url, title || "download");
//   };

//   const filtered = downloads.filter((d) =>
//     d.title?.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const paginated = filtered.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const getFileIcon = (url) => {
//     if (!url) return "📁";
//     if (url.includes(".pdf")) return "📕";
//     if (url.includes(".docx") || url.includes(".doc")) return "📄";
//     if (url.includes(".xlsx") || url.includes(".xls")) return "📊";
//     if (url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg"))
//       return "🖼️";
//     return "📁";
//   };

//   return (
//     <div className="mt-8">
//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
//         <div className="flex gap-2">
//           {/* Search */}
//           <input
//             type="text"
//             placeholder={t("upload_table.search_placeholder")}
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="border px-3 py-1 rounded"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto border rounded">
//         <table className="min-w-full divide-y divide-gray-200 text-sm">
//           <thead className="bg-gray-100 text-left text-[#0b0b5c]">
//             <tr>
//               <th className="p-2">{t("upload_table.title")}</th>
//               <th className="p-2">{t("upload_table.country")}</th>
//               <th className="p-2">{t("upload_table.file")}</th>
//               <th className="p-2">{t("upload_table.actions")}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.map((file) => (
//               <tr key={file.id} className="border-t">
//                 <td className="p-2">{file.title}</td>
//                 <td className="p-2">
//                   {file.country === "ALL" ? "All Countries" : file.country}
//                 </td>
//                 <td className="p-2">{getFileIcon(file.url)}</td>
//                 <td className="p-2 flex gap-2 flex-wrap">
//                   <button
//                     onClick={() => window.open(file.url, "_blank")}
//                     className="bg-gray-700 text-white px-2 py-1 rounded"
//                   >
//                     {t("upload_table.preview")}
//                   </button>
//                   <button
//                     onClick={() => handleDownload(file.url, file.title)}
//                     className="bg-blue-600 text-white px-2 py-1 rounded"
//                   >
//                     {t("upload_table.download")}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {filtered.length === 0 && (
//               <tr>
//                 <td colSpan="4" className="p-4 text-center text-gray-500">
//                   {t("upload_table.no_uploads")}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-end mt-4 gap-3 items-center text-sm">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             {t("upload_table.prev")}
//           </button>
//           <span className="text-[#0b0b5c] font-semibold">
//             {t("upload_table.page", { current: currentPage, total: totalPages })}
//           </span>
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             {t("upload_table.next")}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";

export default function ClientDownload({ user }) {
  const { t } = useTranslation();
  const [downloads, setDownloads] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Normalize country for safe match
  const getUserCountry = () =>
    (user?.country || user?.countryCode || "").toUpperCase();

  useEffect(() => {
    const q = query(collection(db, "upload"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const userCountry = getUserCountry();

      const filtered = data.filter((file) => {
        const fileCountry = file.country?.toUpperCase();
        return (
          file.status === "approved" &&
          (fileCountry === "ALL" || fileCountry === userCountry)
        );
      });

      setDownloads(filtered);
    });

    return () => unsub();
  }, [user]);

  // ✅ Log and download
  const handleDownload = async (url, title) => {
    saveAs(url, title || "download");

    try {
      await addDoc(collection(db, "downloads_log"), {
        email: user.email,
        title,
        url,
        country: getUserCountry(),
        downloadedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to log download:", error);
    }
  };

  const filtered = downloads.filter((d) =>
    d.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getFileIcon = (url) => {
    if (!url) return "📁";
    if (url.includes(".pdf")) return "📕";
    if (url.includes(".docx") || url.includes(".doc")) return "📄";
    if (url.includes(".xlsx") || url.includes(".xls")) return "📊";
    if (url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg"))
      return "🖼️";
    return "📁";
  };

  return (
    <div className="mt-8">
      {/* Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder={t("upload_table.search_placeholder")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-1 rounded"
        />
      </div>

      {/* File Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-left text-[#0b0b5c]">
            <tr>
              <th className="p-2">{t("upload_table.title")}</th>
              <th className="p-2">{t("upload_table.country")}</th>
              <th className="p-2">{t("upload_table.file")}</th>
              <th className="p-2">{t("upload_table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((file) => (
              <tr key={file.id} className="border-t">
                <td className="p-2">{file.title}</td>
                <td className="p-2">
                  {file.country === "ALL" ? "All Countries" : file.country}
                </td>
                <td className="p-2">{getFileIcon(file.url)}</td>
                <td className="p-2 flex gap-2 flex-wrap">
                  <button
                    onClick={() => window.open(file.url, "_blank")}
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                  >
                    {t("upload_table.preview")}
                  </button>
                  <button
                    onClick={() => handleDownload(file.url, file.title)}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    {t("upload_table.download")}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  {t("upload_table.no_uploads")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-3 items-center text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {t("upload_table.prev")}
          </button>
          <span className="text-[#0b0b5c] font-semibold">
            {t("upload_table.page", {
              current: currentPage,
              total: totalPages,
            })}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {t("upload_table.next")}
          </button>
        </div>
      )}
    </div>
  );
}
