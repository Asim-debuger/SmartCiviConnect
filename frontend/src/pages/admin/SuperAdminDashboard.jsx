import { useEffect, useState } from "react";
import { getAuditLogs } from "../../api/platformApi";
import AnalyticsDashboard from "../admin/AnalyticsDashboard";

function SuperAdminDashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getAuditLogs().then((data) => setLogs(data.logs || [])).catch(() => setLogs([]));
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">System control</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Super Admin</h1>
        <p className="mt-2 text-slate-600">Full platform control, audit history, and operational intelligence.</p>
      </header>
      <AnalyticsDashboard />
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-black">Recent audit log</h2>
        <div className="mt-4 max-h-[420px] space-y-3 overflow-auto">
          {logs.map((log) => (
            <div key={log._id} className="rounded-xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold">{log.action}</p>
              <p className="text-xs text-slate-500">{log.targetType} {log.targetId} · {new Date(log.createdAt).toLocaleString()}</p>
            </div>
          ))}
          {!logs.length && <p className="text-sm text-slate-500">No audit events yet.</p>}
        </div>
      </section>
    </div>
  );
}

export default SuperAdminDashboard;
