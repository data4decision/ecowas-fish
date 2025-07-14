import AdminLayout from "./AdminLayout";

export default function AdminReports({ user }) {
  return (
    <AdminLayout user={user}>
      <h2 className="text-lg font-bold mb-4">Reports Overview</h2>
      {/* Add report management content here */}
    </AdminLayout>
  );
}