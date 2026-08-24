import AppShell from "./AppShell";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  return <AppShell label="Admin workspace" tone="blue" sidebar={<AdminSidebar />} />;
}

export default AdminLayout;
