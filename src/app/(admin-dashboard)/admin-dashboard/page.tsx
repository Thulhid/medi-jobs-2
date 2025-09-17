import { AdminRoleGuard } from "@/modules/adminDashboard/admins/admin/role-guard";
import { AdminDashboard } from "@/modules/adminDashboard/admins/admin/AdminDashboard";

export default function AdminDashboardPage() {
  return (
    <AdminRoleGuard>
      <AdminDashboard />
    </AdminRoleGuard>
  );
}
