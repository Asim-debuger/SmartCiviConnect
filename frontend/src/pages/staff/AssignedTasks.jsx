import { useCallback, useEffect, useState } from "react";
import { Check, Play } from "lucide-react";
import { getAssignedComplaints, updateTask, updateStaffLocation } from "../../api/operationsApi";
import { LocationBlock } from "../../utils/formatValue";
import FieldEvidenceCapture from "../../components/staff/FieldEvidenceCapture";

function AssignedTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState("");

  const load = useCallback(async () => {
    try {
      setTasks((await getAssignedComplaints()).complaints || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load assigned tasks.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const transition = async (task, status, extra = {}) => {
    try {
      await updateTask(task._id, { status, ...extra });
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update task.");
    }
  };

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Staff operations</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Assigned tasks</h1>
        <p className="mt-2 text-slate-600">Accept, document, and complete field work with an auditable trail.</p>
      </header>
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
      <div className="space-y-4">
        {tasks.length ? tasks.map((task) => (
          <article key={task._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <p className="text-xs font-bold text-emerald-700">{task.complaintId}</p>
                <h2 className="mt-1 text-xl font-black">{task.title}</h2>
                <p className="mt-2 text-sm text-slate-500"><LocationBlock value={task.location} /> · {task.priority} priority</p>
              </div>
              <span className="h-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{task.operationalStatus} · {task.progress}%</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${task.progress || 0}%` }} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {task.operationalStatus === "ASSIGNED" && (
                <button type="button" onClick={() => transition(task, "ACCEPTED")} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">
                  <Check size={16} /> Accept task
                </button>
              )}
              {task.operationalStatus === "ACCEPTED" && (
                <button type="button" onClick={async () => {
                  try {
                    const pos = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition((p) => resolve(p.coords), reject, { enableHighAccuracy: true, timeout: 12000 }));
                    await updateStaffLocation({ sharing: true, complaintId: task.complaintId, latitude: pos.latitude, longitude: pos.longitude });
                  } catch {
                    /* camera GPS still required at evidence submit */
                  }
                  await transition(task, "IN_PROGRESS", { progress: 10 });
                }} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white">
                  <Play size={16} /> Start live work
                </button>
              )}
              {["IN_PROGRESS"].includes(task.operationalStatus) && (
                <FieldEvidenceCapture
                  complaint={task}
                  disabled={uploading === task._id}
                  onSubmit={async (item) => {
                    setUploading(task._id);
                    try {
                      await updateTask(task._id, { status: "IN_PROGRESS", workEvidence: [...(task.workEvidence || []), item] });
                      await load();
                    } finally {
                      setUploading("");
                    }
                  }}
                />
              )}
              {task.operationalStatus === "IN_PROGRESS" && (
                <button type="button" onClick={() => transition(task, "COMPLETED", { progress: 100, workEvidence: task.workEvidence })} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white">
                  <Check size={16} /> Submit for verification
                </button>
              )}
              {task.status === "Under Verification" && <p className="text-sm font-bold text-amber-700">Waiting for officer approval</p>}
              {task.evidenceStatus === "rejected" && <p className="text-sm font-bold text-rose-700">Rejected: {task.verificationNote}. Capture new camera proof.</p>}
            </div>
            {task.workEvidence?.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {task.workEvidence.map((item) => item.resourceType === "video"
                  ? <video key={item.publicId || item.url} src={item.url} controls className="aspect-video rounded-lg bg-slate-950 object-cover" />
                  : <img key={item.publicId || item.url} src={item.url} alt={`${item.phase || "general"} work evidence`} className="aspect-video rounded-lg object-cover" />)}
              </div>
            )}
          </article>
        )) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No tasks are currently assigned to you.</div>
        )}
      </div>
    </div>
  );
}

export default AssignedTasks;
