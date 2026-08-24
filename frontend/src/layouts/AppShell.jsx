import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import NotificationBell from "../components/common/NotificationBell";

function AppShell({ sidebar, label, tone = "emerald" }) {
  const [open, setOpen] = useState(false);
  const dot = tone === "blue" ? "bg-blue-500" : tone === "violet" ? "bg-violet-500" : "bg-emerald-500";
  const text = tone === "blue" ? "text-blue-700" : tone === "violet" ? "text-violet-700" : "text-emerald-700";

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-100 text-slate-950">
      {open && (
        <button type="button" className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" aria-label="Close navigation" onClick={() => setOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full" onClick={() => setOpen(false)}>
          {sidebar}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-[80] flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setOpen(true)} className="rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden" aria-label="Open navigation">
              <Menu size={18} />
            </button>
            <span className="hidden text-sm font-semibold text-slate-500 sm:block">{label}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            <span className={`text-sm font-semibold ${text}`}>Online</span>
          </div>
          <NotificationBell />
        </header>
        <main className="relative z-0 min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1440px] p-5 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
