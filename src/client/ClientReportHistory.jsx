import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function ClientReportHistory({ user }) {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, "uploads"),
      where("email", "==", user.email)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(data);
    });

    return () => unsub();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{t("upload_table.report_history")}</h2>

      {reports.length === 0 ? (
        <p className="text-gray-600">{t("upload_table.no_uploads")}</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-[#0b0b5c]">
              <tr>
                <th className="p-2">{t("upload_table.title")}</th>
                <th className="p-2">{t("upload_table.status")}</th>
                <th className="p-2">{t("upload_table.date")}</th>
                <th className="p-2">{t("upload_table.file")}</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t">
                  <td className="p-2">{report.title}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(report.status)}`}>
                      {t(`upload_table.${report.status}`)}
                    </span>
                  </td>
                  <td className="p-2">
                    {report.timestamp?.seconds
                      ? format(new Date(report.timestamp.seconds * 1000), "dd MMM yyyy")
                      : "N/A"}
                  </td>
                  <td className="p-2">
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {t("upload_table.view")}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
