import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Moon, Sun, UserRound, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuthContext } from "../context/AuthContext";
import { useAppUser } from "../context/AppUserContext";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Jobs", "/jobs"],
  ["Feed", "/feed"],
  ["Professionals", "/professionals"],
  ["How It Works", "/how-it-works"],
  ["Contact", "/contact"],
];

function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuthContext();
  const { dashboard } = useAppUser();
  const navigate = useNavigate();

  const close = () => setOpen(false);
  const handleLogout = async () => {
    close();
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" onClick={close} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-700 text-lg font-black text-white">S</span>
          <span className="text-lg font-black tracking-tight text-slate-950 dark:text-white">SmartciviConnect</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) => `text-sm font-semibold transition ${isActive ? "text-teal-700 dark:text-teal-400" : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <button type="button" onClick={toggleTheme} className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Toggle theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-300">Login</Link>
              <Link to="/register" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"><UserRound size={16} /> Profile</Link>
              <Link to={dashboard || "/citizen/dashboard"} className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white"><LayoutDashboard size={16} /> Dashboard</Link>
              <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"><LogOut size={16} /> Logout</button>
            </>
          )}
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="rounded-xl p-2 lg:hidden" aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col gap-2">
            {links.map(([label, path]) => (
              <NavLink key={path} to={path} onClick={close} className="rounded-lg px-3 py-2 text-sm font-semibold">{label}</NavLink>
            ))}
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={close} className="rounded-lg px-3 py-2 text-sm font-semibold">Login</Link>
                <Link to="/register" onClick={close} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white">Register</Link>
              </>
            ) : (
              <>
                <Link to="/profile" onClick={close} className="rounded-lg px-3 py-2 text-sm font-semibold">Profile</Link>
                <Link to={dashboard} onClick={close} className="rounded-lg px-3 py-2 text-sm font-semibold">Dashboard</Link>
                <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm font-semibold">Logout</button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default PublicNavbar;
