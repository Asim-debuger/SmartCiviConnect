import { useEffect, useState } from "react";
import { getAnalytics } from "../../api/platformApi";
import BarChart from "../../components/common/BarChart";

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAnalytics()
      .then((data) => setAnalytics(data.analytics))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load analytics."));
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Intelligence</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Analytics & reports</h1>
        <p className="mt-2 text-slate-600">Complaint volume, department load, and workforce completion.</p>
      </header>
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <section className="grid gap-4 sm:grid-cols-4">
        {[
          ["Completion rate", `${analytics?.completionRate ?? 0}%`],
          ["Officers", analytics?.workforce?.officers ?? "-"],
          ["Staff", analytics?.workforce?.staff ?? "-"],
          ["Available staff", analytics?.workforce?.availableStaff ?? "-"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="mb-4 font-black">Complaints by status</h2><BarChart items={analytics?.byStatus || []} /></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="mb-4 font-black">Complaints by category</h2><BarChart items={analytics?.byCategory || []} /></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="mb-4 font-black">Department load</h2><BarChart items={analytics?.byDepartment || []} /></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="mb-4 font-black">Monthly volume</h2><BarChart items={analytics?.byMonth || []} /></div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 font-black">Worker performance</h2>
        <BarChart items={(analytics?.workerPerformance || []).map((item) => ({ _id: item._id, count: item.completed }))} />
      </section>
    </div>
  );
}

export default AnalyticsDashboard;
