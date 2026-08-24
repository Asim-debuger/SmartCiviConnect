import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleDot, ClipboardList, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { getAssignedComplaints } from "../../api/operationsApi";

function StaffDashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setTasks((await getAssignedComplaints()).complaints || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load tasks.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const completed = useMemo(() => tasks.filter((item) => item.status === "Completed").length, [tasks]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Field work</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Staff workspace</h1>
          <p className="mt-2 text-slate-600">Accept tasks, share progress, and close the work loop.</p>
        </div>
        <button type="button" onClick={load} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold">
          <RefreshCw size={16} /> Refresh
        </button>
      </header>
      <div className="flex flex-wrap gap-3 text-sm font-bold">
        <Link to="/staff/earnings" className="rounded-xl border bg-white px-4 py-2">Earnings</Link>
        <Link to="/staff/jobs" className="rounded-xl border bg-white px-4 py-2">Jobs</Link>
        <Link to="/staff/network" className="rounded-xl border bg-white px-4 py-2">Network</Link>
        <Link to="/staff/inbox" className="rounded-xl border bg-white px-4 py-2">Messages</Link>
        <Link to="/staff/profile/me" className="rounded-xl border bg-white px-4 py-2">Profile</Link>
      </div>
      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <section className="grid gap-4 sm:grid-cols-3">
        {[["Assigned tasks", tasks.length, ClipboardList], ["In progress", tasks.filter((item) => item.status === "In Progress").length, CircleDot], ["Completed", completed, CheckCircle2]].map(([label, value, Icon]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Icon className="text-emerald-700" size={20} />
            <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-1 text-4xl font-black">{value}</p>
          </div>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-xl font-black">Your tasks</h2>
        </div>
        {tasks.length ? tasks.map((item) => (
          <div key={item._id} className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500">{item.complaintId} · {item.location?.address || "Location attached"}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{item.status}</span>
          </div>
        )) : <p className="p-8 text-sm text-slate-500">No tasks are assigned to you yet.</p>}
      </section>
    </div>
  );
}

export default StaffDashboard;
