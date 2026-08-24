import { NavLink } from "react-router-dom";
import { LayoutDashboard, FilePlus, ClipboardList, User, Bell } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

const menuItems = [
  { name: "Dashboard", path: "/citizen/dashboard", icon: LayoutDashboard },
  { name: "Create Complaint", path: "/citizen/create", icon: FilePlus },
  { name: "My Complaints", path: "/citizen/complaints", icon: ClipboardList },
  { name: "Notifications", path: "/citizen/notifications", icon: Bell },
  { name: "Profile", path: "/profile", icon: User },
];

function Sidebar() {
  const { user, logout } = useAuthContext();

  return (
    <div className="relative min-h-screen w-64 border-r bg-white shadow-sm">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600">SmartciviConnect</h1>
        <p className="text-sm text-gray-500">{user?.role || "Citizen"} Portal</p>
      </div>
      <div className="space-y-2 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
      <div className="absolute bottom-5 px-5">
        <p className="truncate text-sm font-semibold text-slate-800">{user?.name}</p>
        <button type="button" onClick={logout} className="mt-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
