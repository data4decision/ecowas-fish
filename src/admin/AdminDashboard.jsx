
import CompareView from "../components/CompareView";
import CountryComparisonChart from "../components/CountryComparisonChart";

import AdminKpiCards from "./AdminKpiCards";
import AdminLayout from "./AdminLayout";






export default function AdminDashboard({ user }) {
  return (
    <AdminLayout user={user}>
      <AdminKpiCards/>
      <CountryComparisonChart/>
     <CompareView/>
      
    </AdminLayout>
  );
}