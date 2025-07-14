
import DashboardLayout from "../../components/DashboardLayout";
import DashboardWelcomeSection from "../../components/DashboardWelcomeSection"


export default function NigeriaDashboard({ user }) {
  return (
    <DashboardLayout user={user}>
      <DashboardWelcomeSection/>
    </DashboardLayout>
  );
}
