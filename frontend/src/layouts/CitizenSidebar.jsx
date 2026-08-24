import { NavLink } from "react-router-dom";
import { Bell, Bookmark, Briefcase, ClipboardList, FilePlus2, LayoutDashboard, MapPinned, MessageCircle, Newspaper, UserRound, Users } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import Avatar from "../components/common/Avatar";

const links = [
  { label: "Overview", path: "/citizen/dashboard", icon: LayoutDashboard },
  { label: "Report an issue", path: "/citizen/create", icon: FilePlus2 },
  { label: "My complaints", path: "/citizen/complaints", icon: ClipboardList },
  { label: "Live tracking", path: "/citizen/track", icon: MapPinned },
  { label: "Notifications", path: "/citizen/notifications", icon: Bell },
  { label: "Network", path: "/citizen/network", icon: Users },
  { label: "Feed", path: "/citizen/feed", icon: Newspaper },
  { label: "Saved", path: "/citizen/saved", icon: Bookmark },
  { label: "Jobs", path: "/citizen/jobs", icon: Briefcase },
  { label: "Messages", path: "/citizen/inbox", icon: MessageCircle },
  { label: "Profile", path: "/citizen/profile/me", icon: UserRound },
];

function CitizenSidebar() {
  const { user, logout } = useAuthContext();
  const displayName = user?.name?.split(" ")[0] || "Citizen";

  return (
    <aside className="flex h-full w-72 flex-col overflow-y-auto border-r border-slate-200 bg-[#f8fafc] px-4 py-5">
      <div className="flex items-center gap-3 px-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-black text-white">S</div>
        <div>
          <p className="font-bold tracking-tight text-slate-950">SmartCivi</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Citizen desk</p>
        </div>
      </div>
      <div className="mt-9 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</div>
      <nav className="mt-3 space-y-1">
        {links.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-slate-600 hover:bg-white hover:text-slate-950"}`}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-3 rounded-2xl bg-slate-950 p-4 text-white">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} src={user?.profileImage} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="truncate text-xs text-slate-400">{user?.username ? `@${user.username}` : "Resident"}</p>
          </div>
        </div>
        <button type="button" onClick={logout} className="text-xs font-bold text-slate-400 hover:text-white">Log out</button>
      </div>
    </aside>
  );
}

export default CitizenSidebar;
