// client/countries/NigeriaDashboard.jsx
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import DashboardHeader from "../../components/DashboardHeader";

export default function NigerDashboard({ user }) {
  return (
    <DashboardLayout user={user}>
      <h1 className="text-2xl font-bold text-[#0b0b5c]">Niger Dashboard</h1>
   <DashboardHeader/>
    </DashboardLayout>
  );
}
