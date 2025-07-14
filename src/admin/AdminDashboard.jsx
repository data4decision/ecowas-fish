import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Adjust the path as needed
import AdminLayout from "./AdminLayout";

export default function AdminDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(collection(db, "dashboardData")); // Replace "dashboardData" with your actual collection name
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-lg text-[#0b0b5c] font-bold">
        Loading dashboard...
      </div>
    );
  }

  return (
    <AdminLayout user={user}>
      <h1 className=" text-2xl font-bold mb-6 ml-25">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <div className="bg-white shadow p-5 rounded-xl">
          <h2 className="font-semibold text-gray-600">Countries Monitored</h2>
          <p className="text-3xl font-bold text-[#0b0b5c]">
            {new Set(dashboardData.map((item) => item.Country)).size}
          </p>
        </div>

        <div className="bg-white shadow p-5 rounded-xl">
          <h2 className="font-semibold text-gray-600">Total Fishing Trips</h2>
          <p className="text-3xl font-bold text-[#0b0b5c]">
            {dashboardData.reduce(
              (sum, d) => sum + (Number(d["Number of fishing trips per year"]) || 0),
              0
            ).toLocaleString()}
          </p>
        </div>

        <div className="bg-white shadow p-5 rounded-xl">
          <h2 className="font-semibold text-gray-600">Active Vessels</h2>
          <p className="text-3xl font-bold text-[#0b0b5c]">
            {dashboardData.reduce(
              (sum, d) => sum + (Number(d["Number of active fishing vessels"]) || 0),
              0
            ).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow p-5 rounded-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Data Upload</h2>
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-[#f47b20] text-white text-sm">
              <th className="px-4 py-2 text-left">Country</th>
              <th className="px-4 py-2">Year</th>
              <th className="px-4 py-2">Total Catch (MT)</th>
              <th className="px-4 py-2">Vessels</th>
              <th className="px-4 py-2">Fishing Trips</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.slice(0, 10).map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 text-sm">
                <td className="px-4 py-2">{item.Country}</td>
                <td className="px-4 py-2 text-center">{item.Year}</td>
                <td className="px-4 py-2 text-center">
                  {Number(item["Total fish catch (MT/year)"] || 0).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-center">{item["Number of active fishing vessels"]}</td>
                <td className="px-4 py-2 text-center">{item["Number of fishing trips per year"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
