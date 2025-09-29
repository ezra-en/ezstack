import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin & Access Control</h1>
        <p className="text-muted-foreground">
          Demonstration of Better Auth admin plugin with custom access control.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
}
