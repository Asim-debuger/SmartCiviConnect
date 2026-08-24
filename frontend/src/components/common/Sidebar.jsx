import { Bookmark, LayoutDashboard, ClipboardList, Users, MapPinned, Bell, Wallet, Building2, Briefcase, MessageCircle, Newspaper, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { normalizeRole } from "../../utils/roles";

function Sidebar({ role = "admin" }) {
  const { user, logout } = useAuthContext();
  const current = normalizeRole(user?.role) || role;
  const isHead = current === "head officer";

  const officerLinks = [
    { name: "Dashboard", path: isHead ? "/head-officer/dashboard" : "/officer/dashboard", icon: LayoutDashboard },
    { name: "Assigned Complaints", path: "/officer/complaints", icon: ClipboardList },
    { name: "Staff", path: "/officer/staff", icon: Users },
    { name: "Live Tracking", path: "/officer/tracking", icon: MapPinned },
    { name: "Jobs", path: "/officer/jobs", icon: Briefcase },
    { name: "Network", path: "/officer/network", icon: Users },
    { name: "Feed", path: "/officer/feed", icon: Newspaper },
    { name: "Saved", path: "/officer/saved", icon: Bookmark },
    { name: "Messages", path: "/officer/inbox", icon: MessageCircle },
    { name: "Notifications", path: "/officer/notifications", icon: Bell },
    { name: "Profile", path: "/officer/profile/me", icon: UserRound },
  ];
  if (isHead) officerLinks.splice(1, 0, { name: "Department", path: "/head-officer/dashboard", icon: Building2 });
  if (isHead) officerLinks.push({ name: "Hiring", path: "/head-officer/jobs", icon: Briefcase });

  const staffLinks = [
    { name: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
    { name: "Assigned Tasks", path: "/staff/tasks", icon: ClipboardList },
    { name: "Live Location", path: "/staff/tracking", icon: MapPinned },
    { name: "Earnings", path: "/staff/earnings", icon: Wallet },
    { name: "Jobs", path: "/staff/jobs", icon: Briefcase },
    { name: "Network", path: "/staff/network", icon: Users },
    { name: "Feed", path: "/staff/feed", icon: Newspaper },
    { name: "Saved", path: "/staff/saved", icon: Bookmark },
    { name: "Messages", path: "/staff/inbox", icon: MessageCircle },
    { name: "Notifications", path: "/staff/notifications", icon: Bell },
    { name: "Profile", path: "/staff/profile/me", icon: UserRound },
  ];

  const navigationLinks = role === "staff" || current === "staff" ? staffLinks : officerLinks;
  const label = current === "head officer" ? "Head Officer Portal" : role === "staff" ? "Staff Portal" : "Officer Portal";

  return (
    <aside className="flex h-full w-72 flex-col overflow-y-auto bg-slate-900">
      <div className="border-b border-slate-700 px-6 py-6">
        <h1 className="text-xl font-bold text-white">SmartciviConnect</h1>
        <p className="mt-1 text-xs text-slate-400">{label}</p>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navigationLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path} end={item.path.endsWith("dashboard")} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      <button type="button" onClick={logout} className="border-t border-slate-800 px-6 py-4 text-left text-sm font-semibold text-slate-400 hover:text-white">Log out</button>
    </aside>
  );
}

export default Sidebar;
