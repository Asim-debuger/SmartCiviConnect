import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { ArrowUpRight, CheckCircle2, Clock3, FilePlus2, MapPinned, Megaphone, RefreshCw, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { getMyComplaints } from "../../api/complaintApi";
import { listNotifications } from "../../api/notificationApi";
import { timeAgo } from "../../utils/workspace";

const statusStyles = { Pending: "bg-amber-50 text-amber-700", Verified: "bg-sky-50 text-sky-700", Assigned: "bg-violet-50 text-violet-700", "In Progress": "bg-blue-50 text-blue-700", Completed: "bg-emerald-50 text-emerald-700", Rejected: "bg-rose-50 text-rose-700" };

function CitizenDashboard() {
  const { user } = useAuthContext();
  const [complaints, setComplaints] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const [response, notes] = await Promise.all([getMyComplaints(), listNotifications().catch(() => ({ notifications: [] }))]);
      setComplaints(response?.complaints || []);
      setActivity((notes.notifications || []).slice(0, 6));
      setOffline(false);
    } catch {
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial remote loading intentionally updates dashboard state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadComplaints();
  }, [loadComplaints]);

  const stats = useMemo(() => ({
    total: complaints.length,
    pending: complaints.filter((complaint) => complaint.status === "Pending").length,
    active: complaints.filter((complaint) => ["Assigned", "In Progress", "Verified", "Under Verification"].includes(complaint.status)).length,
    completed: complaints.filter((complaint) => complaint.status === "Completed").length,
  }), [complaints]);
  const recent = complaints.slice(0, 3);
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-10 sm:py-10">
        <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full border-[34px] border-emerald-500/20" />
        <div className="absolute bottom-0 right-24 h-2 w-32 bg-orange-400" />
        <div className="relative max-w-2xl">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300"><ShieldCheck size={15} /> Your neighborhood desk</div>
          <h1 className="max-w-xl text-3xl font-black tracking-tight sm:text-5xl">Good morning, {firstName}.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Report what needs attention, follow every handoff, and help your city respond with clarity.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link to="/citizen/create" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400"><FilePlus2 size={18} /> Report an issue</Link><Link to="/citizen/track" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"><MapPinned size={18} /> Track progress</Link><Link to="/citizen/network" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">Network</Link><Link to="/citizen/jobs" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">Jobs</Link><Link to="/citizen/inbox" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">Messages</Link></div>
        </div>
      </section>

      {offline && <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><span>Live data is temporarily unavailable.</span><button type="button" onClick={loadComplaints} className="inline-flex items-center gap-2 font-bold"><RefreshCw size={15} /> Retry</button></div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[{ label: "Created", value: stats.total, icon: Megaphone, tone: "text-slate-950 bg-white" }, { label: "Pending", value: stats.pending, icon: Clock3, tone: "text-amber-900 bg-amber-50" }, { label: "In progress", value: stats.active, icon: Clock3, tone: "text-blue-900 bg-blue-50" }, { label: "Completed", value: stats.completed, icon: CheckCircle2, tone: "text-emerald-900 bg-emerald-50" }].map(({ label, value, icon: Icon, tone }) => <div key={label} className={`rounded-2xl border border-slate-200/80 p-5 shadow-sm ${tone}`}><div className="flex items-center justify-between"><span className="text-sm font-semibold opacity-70">{label}</span><Icon size={20} /></div><p className="mt-4 text-4xl font-black">{loading ? "-" : value}</p></div>)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Activity</p><h2 className="mt-2 text-2xl font-black tracking-tight">Recent reports</h2></div><Link to="/citizen/complaints" className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">View all <ArrowUpRight size={16} /></Link></div><div className="mt-6 divide-y divide-slate-100">{loading ? <p className="py-8 text-sm text-slate-500">Loading your reports...</p> : recent.length === 0 ? <div className="rounded-2xl bg-slate-50 p-6 text-center"><p className="font-bold text-slate-800">No reports yet</p><p className="mt-1 text-sm text-slate-500">Your first report can start a useful change nearby.</p></div> : recent.map((complaint) => <Link to={`/citizen/complaint/${complaint.complaintId || complaint._id}`} key={complaint._id || complaint.complaintId} className="flex items-center justify-between gap-4 py-4 hover:bg-slate-50"><div className="min-w-0"><p className="truncate font-bold text-slate-900">{complaint.title}</p><p className="mt-1 text-xs text-slate-500">{complaint.complaintId} · {complaint.category}</p></div><span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[complaint.status] || "bg-slate-100 text-slate-700"}`}>{complaint.status}</span></Link>)}</div></div>
        <div className="rounded-2xl border border-slate-200/80 bg-[#dff1e9] p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Timeline</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Latest activity</h2>
          <div className="mt-4 space-y-3">
            {activity.map((item) => (
              <div key={item._id} className="rounded-xl bg-white/70 p-3">
                <p className="text-sm font-bold">{item.title}</p>
                <p className="text-xs text-slate-500">{item.category} · {timeAgo(item.createdAt)}</p>
              </div>
            ))}
            {!activity.length && !loading && <p className="text-sm text-slate-600">No notifications yet. Reports and network activity will appear here.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CitizenDashboard;
