import { useCallback, useEffect, useState } from "react";
import { Activity, AlertCircle, CheckCircle2, ClipboardList, RefreshCw, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { getAdminStats } from "../../api/operationsApi";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    setError("");
    try {
      const response = await getAdminStats();
      setStats(response?.stats || null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load operations data.");
    }
  }, []);

  useEffect(() => {
    // Initial remote loading intentionally updates dashboard state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStats();
  }, [loadStats]);

  const cards = [
    { label: "Total complaints", value: stats?.total, icon: ClipboardList, color: "bg-blue-50 text-blue-700" },
    { label: "Pending verification", value: stats?.pending, icon: AlertCircle, color: "bg-amber-50 text-amber-700" },
    { label: "Active operations", value: stats?.active, icon: Activity, color: "bg-violet-50 text-violet-700" },
    { label: "Under verification", value: stats?.verification, icon: AlertCircle, color: "bg-orange-50 text-orange-700" },
    { label: "Resolved complaints", value: stats?.completed, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700" },
    { label: "Active users", value: stats?.users, icon: Users, color: "bg-sky-50 text-sky-700" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Command center</p><h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">City operations</h1><p className="mt-2 text-slate-600">Review incoming reports and keep every response moving.</p></div><button type="button" onClick={loadStats} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"><RefreshCw size={16} /> Refresh</button></header>
      {error && <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"><span>{error}</span><button type="button" onClick={loadStats} className="font-bold">Retry</button></div>}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">{cards.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">{label}</p><div className={`rounded-xl p-3 ${color}`}><Icon size={19} /></div></div><p className="mt-5 text-4xl font-black text-slate-950">{value ?? "-"}</p></div>)}</section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link to="/admin/complaints" className="rounded-2xl border bg-white p-4 text-sm font-bold">Complaints</Link>
        <Link to="/admin/users" className="rounded-2xl border bg-white p-4 text-sm font-bold">Users</Link>
        <Link to="/admin/jobs" className="rounded-2xl border bg-white p-4 text-sm font-bold">Jobs & hiring</Link>
        <Link to="/admin/notifications" className="rounded-2xl border bg-white p-4 text-sm font-bold">Notifications</Link>
        <a href="/jobs" className="rounded-2xl border bg-white p-4 text-sm font-bold">Public jobs</a>
        <a href="/feed" className="rounded-2xl border bg-white p-4 text-sm font-bold">Public posts</a>
        <a href="/professionals" className="rounded-2xl border bg-white p-4 text-sm font-bold">Public professionals</a>
        <Link to="/admin/feed" className="rounded-2xl border bg-white p-4 text-sm font-bold">Workspace feed</Link>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"><div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3"><div className="rounded-xl bg-slate-950 p-3 text-white"><Activity size={20} /></div><div><h2 className="text-xl font-black">Operations pulse</h2><p className="text-sm text-slate-500">Live counts from MongoDB Atlas</p></div></div><div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0}%` }} /></div><div className="mt-3 flex justify-between text-xs font-bold text-slate-500"><span>Response pipeline</span><span>{stats?.total ? `${Math.round((stats.completed / stats.total) * 100)}% resolved` : "Waiting for data"}</span></div></div><div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8"><Users className="text-blue-700" size={24} /><h2 className="mt-5 text-xl font-black text-slate-950">Workforce coordination</h2><p className="mt-2 text-sm leading-6 text-slate-700">Assign verified complaints to officers, then keep staff progress visible from one queue.</p></div></section>
    </div>
  );
}

export default AdminDashboard;
