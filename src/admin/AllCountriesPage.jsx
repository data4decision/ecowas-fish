import AdminLayout from "./AdminLayout";

export default function AllCountriesPage({ user }) {
  return (
    <AdminLayout user={user}>
      <h2 className="text-lg font-bold mb-4">All countries</h2>
      {/* Add report management content here */}
    </AdminLayout>
  );
}