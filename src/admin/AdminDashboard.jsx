
import CompareView from "../components/CompareView";
import CompareViews from "../components/CompareViews";
// import CountryComparisonChart from "../components/CountryComparisonChart";
import FisheriesOverview from "../components/FisheriesOverview";

import AdminKpiCards from "./AdminKpiCards";
import AdminLayout from "./AdminLayout";






export default function AdminDashboard({ user }) {
  return (
    <AdminLayout user={user}>
      <AdminKpiCards/>
      <FisheriesOverview />
      {/* <CountryComparisonChart/> */}
     <CompareView/>
     <CompareViews/>
     
      
    </AdminLayout>
  );
}