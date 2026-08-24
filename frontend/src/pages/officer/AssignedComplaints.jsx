import { useCallback, useEffect, useState } from "react";
import { Check, MessageCircle, Send, UserPlus } from "lucide-react";
import { getAssignedComplaints, acceptOfficerComplaint, assignStaffToComplaint, getComplaintMessages, sendComplaintMessage, updateTask, listWorkers, rejectComplaint, verifyTask, rejectEvidence } from "../../api/operationsApi";
import EvidenceReview from "../../components/officer/EvidenceReview";

function AssignedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [staffIds, setStaffIds] = useState({});
  const [workers, setWorkers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [messages, setMessages] = useState({});
  const [drafts, setDrafts] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [progressById, setProgressById] = useState({});

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [assigned, staff] = await Promise.all([getAssignedComplaints(), listWorkers({ availability: "All" })]);
      setComplaints(assigned.complaints || []);
      setWorkers(staff.workers || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load officer assignments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (id, action) => {
    setBusy(id);
    try {
      await action();
      await refreshItem();
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update this complaint.");
    } finally {
      setBusy("");
    }
  };
  const refreshItem = async () => {
    const item = await getAssignedComplaints();
    setComplaints(item.complaints || []);
  };
  const accept = (id) => run(id, () => acceptOfficerComplaint(id));
  const assign = (id) => run(id, () => assignStaffToComplaint(id, staffIds[id]));
  const updateProgress = (id) => run(id, () => updateTask(id, { status: "IN_PROGRESS", progress: Number(progressById[id] || 50) }));
  const openChat = async (complaint) => {
    const response = await getComplaintMessages(complaint._id);
    setMessages((current) => ({ ...current, [complaint._id]: response.messages || [] }));
  };
  const send = async (complaint) => {
    if (!drafts[complaint._id] || !complaint.assignedStaffId) return;
    const response = await sendComplaintMessage(complaint._id, { recipientId: complaint.assignedStaffId, body: drafts[complaint._id] });
    setMessages((current) => ({ ...current, [complaint._id]: [...(current[complaint._id] || []), response.message] }));
    setDrafts((current) => ({ ...current, [complaint._id]: "" }));
  };

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Officer operations</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Assigned complaints</h1>
        <p className="mt-2 text-slate-600">Accept the work, assign field staff, and keep communication in one place.</p>
      </header>
      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Accepted", "Completed"].map((item) => (
          <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-lg px-4 py-2 text-sm font-bold ${filter === item ? "bg-blue-700 text-white" : "bg-white"}`}>{item}</button>
        ))}
      </div>
      {loading && <p className="text-sm text-slate-500">Loading assigned complaints...</p>}
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
      <div className="space-y-4">
        {complaints.filter((complaint) => {
          if (filter === "Pending") return ["Pending", "Verified", "Assigned"].includes(complaint.status) && complaint.operationalStatus !== "ACCEPTED";
          if (filter === "Accepted") return complaint.operationalStatus === "ACCEPTED" || complaint.status === "In Progress";
          if (filter === "Completed") return complaint.status === "Completed" || complaint.status === "Under Verification";
          return true;
        }).map((complaint) => (
          <article key={complaint._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <p className="text-xs font-bold text-blue-700">{complaint.complaintId}</p>
                <h2 className="mt-1 text-xl font-black">{complaint.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{complaint.category} · {complaint.priority} priority</p>
              </div>
              <span className="h-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{complaint.operationalStatus}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {complaint.operationalStatus === "ASSIGNED" && (
                <button type="button" onClick={() => accept(complaint._id)} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white">
                  <Check size={16} /> Accept complaint
                </button>
              )}
              {["ACCEPTED", "IN_PROGRESS"].includes(complaint.operationalStatus) && (
                <>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressById[complaint._id] ?? complaint.progress ?? 50}
                    onChange={(event) => setProgressById((current) => ({ ...current, [complaint._id]: event.target.value }))}
                    className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    aria-label="Progress percent"
                  />
                  <button type="button" disabled={busy === complaint._id} onClick={() => updateProgress(complaint._id)} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                    Update progress
                  </button>
                </>
              )}
              <select
                value={staffIds[complaint._id] || ""}
                onChange={(event) => setStaffIds((current) => ({ ...current, [complaint._id]: event.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">Select staff</option>
                {workers.map((worker) => (
                  <option key={worker._id} value={worker._id}>{worker.name} ({worker.availability})</option>
                ))}
              </select>
              <button type="button" disabled={!staffIds[complaint._id] || busy === complaint._id} onClick={() => assign(complaint._id)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold disabled:opacity-40">
                <UserPlus size={16} /> Assign staff
              </button>
              <button type="button" disabled={busy === complaint._id} onClick={async () => { await run(complaint._id, () => rejectComplaint(complaint._id, "Invalid complaint")); }} className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700">
                Reject
              </button>
              {complaint.status === "Under Verification" && (
                <EvidenceReview
                  complaint={complaint}
                  busy={busy === complaint._id}
                  onApprove={() => run(complaint._id, () => verifyTask(complaint._id))}
                  onReject={() => {
                    const reason = window.prompt("Rejection reason (required)");
                    if (!reason) return;
                    return run(complaint._id, () => rejectEvidence(complaint._id, reason));
                  }}
                />
              )}
              {complaint.assignedStaffId && (
                <button type="button" onClick={() => openChat(complaint)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold">
                  <MessageCircle size={16} /> Chat
                </button>
              )}
            </div>
            {messages[complaint._id] && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <div className="max-h-40 space-y-2 overflow-auto">
                  {messages[complaint._id].map((message) => (
                    <p key={message._id} className="text-sm text-slate-700">
                      <b>{message.senderId === complaint.assignedOfficerId ? "You" : "Staff"}:</b> {message.body}
                    </p>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={drafts[complaint._id] || ""}
                    onChange={(event) => setDrafts((current) => ({ ...current, [complaint._id]: event.target.value }))}
                    placeholder="Write to field staff"
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={() => send(complaint)} className="rounded-lg bg-slate-950 p-2 text-white" aria-label="Send message">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
        {!loading && !complaints.length && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No complaints are currently assigned to you.</div>
        )}
      </div>
    </div>
  );
}

export default AssignedComplaints;
