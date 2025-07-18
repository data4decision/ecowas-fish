
import DashboardLayout from "../../components/DashboardLayout";
import DashboardWelcomeSection from "../../components/DashboardWelcomeSection"
// import ClientUpload from "../ClientUpload";


export default function NigeriaDashboard({ user }) {
  return (
    <DashboardLayout user={user}>
      <DashboardWelcomeSection/>
      {/* <ClientUpload/> */}
    </DashboardLayout>
  );
}
