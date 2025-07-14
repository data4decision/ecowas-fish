// src/pages/CountryDashboard.jsx
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

export default function CountryDashboard() {
  const { countryCode } = useParams();

  return (
    <DashboardLayout>
      <h2 className="text-xl font-semibold text-[#0b0b5c] capitalize">
        {countryCode} Fisheries Dashboard
      </h2>
      {/* Dynamic data content can go here */}
    </DashboardLayout>
  );
}
