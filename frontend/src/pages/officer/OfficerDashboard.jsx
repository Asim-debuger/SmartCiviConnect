import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ClipboardList, MapPinned, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { getAssignedComplaints } from "../../api/operationsApi";

function OfficerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setComplaints((await getAssignedComplaints()).complaints || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load assignments.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const active = useMemo(() => complaints.filter((item) => item.status === "In Progress").length, [complaints]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Field coordination</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Officer workspace</h1>
          <p className="mt-2 text-slate-600">Review your assigned complaints and move response work forward.</p>
        </div>
        <button type="button" onClick={load} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold">
          <RefreshCw size={16} /> Refresh
        </button>
      </header>
      <div className="flex flex-wrap gap-3 text-sm font-bold">
        <Link to="/officer/inbox" className="rounded-xl border bg-white px-4 py-2">Messages</Link>
        <Link to="/officer/network" className="rounded-xl border bg-white px-4 py-2">Network</Link>
        <Link to="/officer/jobs" className="rounded-xl border bg-white px-4 py-2">Jobs</Link>
      </div>
      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <section className="grid gap-4 sm:grid-cols-3">
        {[["Assigned complaints", complaints.length, ClipboardList], ["In progress", active, Activity], ["Location ready", complaints.filter((item) => item.location?.latitude).length, MapPinned]].map(([label, value, Icon]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Icon className="text-blue-700" size={20} />
            <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-1 text-4xl font-black">{value}</p>
          </div>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-xl font-black">Assigned complaints</h2>
        </div>
        {complaints.length ? complaints.map((item) => (
          <Link key={item._id} to="/officer/complaints" className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 hover:bg-slate-50 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500">{item.complaintId} · {item.category}</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{item.status}</span>
          </Link>
        )) : <p className="p-8 text-sm text-slate-500">No complaints are assigned to you yet.</p>}
      </section>
    </div>
  );
}

export default OfficerDashboard;
