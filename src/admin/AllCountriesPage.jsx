import AdminLayout from "./AdminLayout";
import FisheriesOverview from "../components/FisheriesOverview";
import AdvancedComparison from "../components/AdvancedComparison";
import CountryComparisonChart from "../components/CountryComparisonChart";
export default function AllCountriesPage({ user }) {
  return (
    <AdminLayout user={user}>
      
      <FisheriesOverview/>
      <AdvancedComparison/>
      <CountryComparisonChart/>
    </AdminLayout>
  );
}