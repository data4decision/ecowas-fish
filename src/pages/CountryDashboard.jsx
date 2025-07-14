
import DashboardLayout from "../components/DashboardLayout";
import Dashboard from "./Dashboard"; // Your data-rendering wrapper (uses WelcomeSummary)

const CountryDashboard = () => {
  const user = {
    name: "Jane",
    country: "Benin"
  };

  return (
    <DashboardLayout user={user}>
      <Dashboard user={user} />
    </DashboardLayout>
  );
};

export default CountryDashboard;
