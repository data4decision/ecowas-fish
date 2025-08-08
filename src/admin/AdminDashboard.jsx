import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard({ user }) {
  const [uploads, setUploads] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubUploads = onSnapshot(collection(db, "uploads"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUploads(data);
    });

    const unsubDownloads = onSnapshot(collection(db, "downloadHistory"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDownloads(data);
    });

    return () => {
      unsubUploads();
      unsubDownloads();
    };
  }, []);

  const total = uploads.length;
  const approved = uploads.filter((u) => u.status === "approved").length;
  const pending = uploads.filter((u) => u.status === "pending").length;
  const rejected = uploads.filter((u) => u.status === "rejected").length;

  return (
    <AdminLayout user={user}>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-[#0b0b5c] mb-6">Admin Dashboard</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KPI title="Total Reports" count={total} color="bg-[#0b0b5c]" />
          <KPI title="Approved" count={approved} color="bg-green-600" />
          <KPI title="Pending" count={pending} color="bg-yellow-500" />
          <KPI title="Rejected" count={rejected} color="bg-red-500" />
        </div>

        {/* KPI & Trends Visual Grid with Slide-In Overlay */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
  {/* KPI Summary */}
  <div
    onClick={() => navigate("/admin/kpi-analysis")}
    className="relative group cursor-pointer border rounded shadow overflow-hidden hover:shadow-lg transition-all duration-300"
  >
    <img
      src="/admin-kpi-preview.png"
      alt="Admin KPI"
      className="w-full h-48 object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center opacity-0 translate-y-4 group-hover:opacity-20 group-hover:translate-y-0 transition-all duration-500">
      <p className="text-white text-lg font-semibold p-4">View KPI Summary</p>
    </div>
    <div className="p-3 bg-white">
      <h3 className="font-bold text-[#0b0b5c] text-lg">KPI Summary</h3>
      <p className="text-sm text-gray-600">Click to view all performance indicators in detail.</p>
    </div>
  </div>

  {/* Trends & Charts */}
  <div
    onClick={() => navigate("/admin/trends")}
    className="relative group cursor-pointer border rounded shadow overflow-hidden hover:shadow-lg transition-all duration-300"
  >
    <img
      src="/admin-trends-preview.png"
      alt="Admin Trends"
      className="w-full h-48 object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-center opacity-0 translate-y-4 group-hover:opacity-20 group-hover:translate-y-0 transition-all duration-500">
      <p className="text-white text-lg font-semibold p-4">Explore Trends</p>
    </div>
    <div className="p-3 bg-white">
      <h3 className="font-bold text-[#0b0b5c] text-lg">Trends & Charts</h3>
      <p className="text-sm text-gray-600">Click to explore downloads, uploads and trend patterns.</p>
    </div>
  </div>
</div>


        {/* Recent Uploads */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-[#0b0b5c] mb-2">Recent Uploads</h3>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Country</th>
                  <th className="p-2">Uploader</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {uploads.slice(0, 5).map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-2">{u.title}</td>
                    <td className="p-2">{u.country}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2 capitalize">{u.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Download Logs */}
        <section>
          <h3 className="text-lg font-semibold text-[#0b0b5c] mb-2">Recent Downloads</h3>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Country</th>
                  <th className="p-2">Downloaded By</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {downloads.slice(0, 5).map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="p-2">{d.title}</td>
                    <td className="p-2">{d.country}</td>
                    <td className="p-2">{d.admin}</td>
                    <td className="p-2">{new Date(d.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function KPI({ title, count, color }) {
  return (
    <div className={`p-4 rounded text-white shadow ${color}`}>
      <h4 className="text-sm">{title}</h4>
      <p className="text-xl font-bold">{count}</p>
    </div>
  );
}
