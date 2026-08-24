import { Building2, ClipboardList, CreditCard, LayoutDashboard, Shield, Users, BarChart3, FileText, UserCog, BriefcaseBusiness, Bell, MessageCircle, Newspaper, Briefcase, Bookmark, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { normalizeRole } from "../utils/roles";

function AdminSidebar() {
  const { user, logout } = useAuthContext();
  const isSuper = normalizeRole(user?.role) === "super admin";
  const menu = [
    { name: "Dashboard", path: isSuper ? "/super-admin/dashboard" : "/admin/dashboard", icon: LayoutDashboard },
    { name: "Complaints", path: "/admin/complaints", icon: ClipboardList },
    { name: "Users & roles", path: "/admin/users", icon: Users },
    { name: "Departments", path: "/admin/departments", icon: Building2 },
    { name: "Officers", path: "/admin/officers", icon: UserCog },
    { name: "Staff", path: "/admin/staff", icon: BriefcaseBusiness },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Jobs", path: "/admin/jobs", icon: Briefcase },
    { name: "Network", path: "/admin/network", icon: Users },
    { name: "Feed", path: "/admin/feed", icon: Newspaper },
    { name: "Saved", path: "/admin/saved", icon: Bookmark },
    { name: "Messages", path: "/admin/inbox", icon: MessageCircle },
    { name: "Notifications", path: "/admin/notifications", icon: Bell },
    { name: "Profile", path: "/admin/profile/me", icon: UserRound },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { name: "Reports", path: "/admin/reports", icon: FileText },
  ];
  if (isSuper) menu.splice(1, 0, { name: "System control", path: "/super-admin/dashboard", icon: Shield });

  return (
    <aside className="flex h-full w-72 flex-col overflow-y-auto border-r bg-white p-5">
      <h2 className="mb-8 text-xl font-bold text-blue-600">{isSuper ? "Super Admin" : "Admin"}</h2>
      <nav className="space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.path + item.name} to={item.path} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      <button type="button" onClick={logout} className="mt-auto pt-6 text-left text-sm font-bold text-slate-500 hover:text-slate-900">Log out</button>
    </aside>
  );
}

export default AdminSidebar;
