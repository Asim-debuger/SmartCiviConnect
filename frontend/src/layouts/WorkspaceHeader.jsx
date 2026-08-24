import NotificationBell from "../components/common/NotificationBell";

function WorkspaceHeader({ label, tone = "emerald" }) {
  const dot = tone === "blue" ? "bg-blue-500" : "bg-emerald-500";
  const text = tone === "blue" ? "text-blue-700" : "text-emerald-700";
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-4 backdrop-blur-md lg:px-8">
      <div className="ml-12 flex items-center gap-3 lg:ml-0">
        <span className="hidden text-sm font-semibold text-slate-500 sm:block">{label}</span>
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <span className={`text-sm font-semibold ${text}`}>Online</span>
      </div>
      <NotificationBell />
    </header>
  );
}

export default WorkspaceHeader;
