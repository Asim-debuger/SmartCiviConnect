import { useEffect, useState } from "react";
import { listWorkers } from "../../api/operationsApi";

function OfficerStaff() {
  const [workers, setWorkers] = useState([]);
  const [skill, setSkill] = useState("");
  const [availability, setAvailability] = useState("All");
  const [error, setError] = useState("");

  async function load() {
    try {
      setWorkers((await listWorkers({ skill, availability })).workers || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load workers.");
    }
  }

  useEffect(() => { load(); }, [skill, availability]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Workforce</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Available staff</h1>
      </header>
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={skill} onChange={(event) => setSkill(event.target.value)} placeholder="Filter by skill" className="rounded-xl border px-4 py-3" />
        <select value={availability} onChange={(event) => setAvailability(event.target.value)} className="rounded-xl border px-4 py-3">
          {["All", "Available", "Busy", "Off Duty"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {workers.map((worker) => (
          <article key={worker._id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-black">{worker.name}</h2>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{worker.availability}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{worker.email}</p>
            <p className="mt-3 text-xs font-semibold text-slate-400">Skills: {(worker.skills || []).join(", ") || "Not listed"}</p>
            <p className="mt-1 text-xs text-slate-400">ID: {worker._id}</p>
          </article>
        ))}
        {!workers.length && <p className="text-sm text-slate-500">No matching workers.</p>}
      </div>
    </div>
  );
}

export default OfficerStaff;
