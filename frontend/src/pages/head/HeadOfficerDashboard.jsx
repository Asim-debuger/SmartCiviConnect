import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDepartmentOverview, getAnalytics } from "../../api/platformApi";
import { getAssignedComplaints, verifyTask, rejectEvidence } from "../../api/operationsApi";
import EvidenceReview from "../../components/officer/EvidenceReview";
import BarChart from "../../components/common/BarChart";

function HeadOfficerDashboard() {
  const [overview, setOverview] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [over, assigned, charts] = await Promise.all([getDepartmentOverview(), getAssignedComplaints(), getAnalytics()]);
      setOverview(over.overview);
      setComplaints(assigned.complaints || []);
      setAnalytics(charts.analytics);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load department overview.");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">Department command</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">{overview?.department || "Head Officer"} overview</h1>
        <p className="mt-2 text-slate-600">Monitor officers, complaints, and completion quality for your department.</p>
      </header>
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <section className="grid gap-4 sm:grid-cols-4">
        {[["Total complaints", overview?.total], ["Open", overview?.pending], ["Completed", overview?.completed], ["Active workers", overview?.activeWorkers]].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value ?? "-"}</p></div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-black">Officers in department</h2>
          <div className="mt-4 space-y-3">
            {(overview?.officers || []).map((officer) => (
              <div key={officer._id} className="rounded-xl bg-slate-50 p-4">
                <p className="font-semibold">{officer.name}</p>
                <p className="text-xs text-slate-500">{officer.role} · {officer.email}</p>
              </div>
            ))}
            {!overview?.officers?.length && <p className="text-sm text-slate-500">No officers assigned yet.</p>}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-black">Department performance</h2>
          <BarChart items={analytics?.byStatus || []} />
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-black">Complaints awaiting approval</h2>
          <Link to="/officer/complaints" className="text-sm font-bold text-indigo-700">Open queue</Link>
        </div>
        {(complaints.filter((item) => item.status === "Under Verification") || []).map((item) => (
          <EvidenceReview
            key={item._id}
            complaint={item}
            onApprove={async () => { await verifyTask(item._id); await load(); }}
            onReject={async () => {
              const reason = window.prompt("Rejection reason (required)");
              if (!reason) return;
              await rejectEvidence(item._id, reason);
              await load();
            }}
          />
        ))}
        {!complaints.filter((item) => item.status === "Under Verification").length && <p className="text-sm text-slate-500">No completions waiting.</p>}
      </section>
    </div>
  );
}

export default HeadOfficerDashboard;
