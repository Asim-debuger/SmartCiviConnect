import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CalendarDays, CheckCircle2, Clock3, Image, MapPin, Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { getComplaintById, updateComplaint } from "../../api/complaintApi";
import useSocket from "../../hooks/useSocket";
import { LocationBlock, displayValue, mapCenter } from "../../utils/formatValue";
import { COMPLAINT_TIMELINE_STEPS, complaintTimelineIndex, payloadMatchesComplaint } from "../../utils/complaintTimeline";

const statusStyles = { Pending: "bg-amber-50 text-amber-700", Verified: "bg-sky-50 text-sky-700", Assigned: "bg-violet-50 text-violet-700", "In Progress": "bg-blue-50 text-blue-700", Completed: "bg-emerald-50 text-emerald-700", Rejected: "bg-rose-50 text-rose-700" };

function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingQuality, setRatingQuality] = useState(0);
  const [ratingSatisfaction, setRatingSatisfaction] = useState(0);
  const [ratingBehaviour, setRatingBehaviour] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const loadComplaint = useCallback(async ({ quiet } = {}) => {
    try {
      if (!quiet) setLoading(true);
      const response = await getComplaintById(id);
      const next = response?.complaint || null;
      setComplaint(next);
      setFeedback(next?.feedback || "");
      setRating(next?.rating || 0);
      setRatingQuality(next?.ratingQuality || 0);
      setRatingSatisfaction(next?.ratingSatisfaction || 0);
      setRatingBehaviour(next?.ratingBehaviour || 0);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load this complaint.");
      if (!quiet) setComplaint(null);
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadComplaint();
  }, [loadComplaint]);

  useEffect(() => {
    if (!socket || !complaint) return;
    [complaint._id, complaint.complaintId, id].filter(Boolean).forEach((room) => {
      socket.emit("complaint:join", String(room));
    });

    const onComplaintEvent = (payload) => {
      if (payloadMatchesComplaint(payload, complaint, id) || !payload?._id) {
        loadComplaint({ quiet: true });
      }
    };

    const onLocation = (payload) => {
      if (!payload) return;
      const lat = payload.latitude ?? payload.lat;
      const lng = payload.longitude ?? payload.lng;
      if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return;
      if (!payloadMatchesComplaint(payload, complaint, id) && payload.complaintId) return;
      setComplaint((current) => {
        if (!current) return current;
        if (payload.staffId && current.assignedStaffId && String(payload.staffId) !== String(current.assignedStaffId)) {
          if (!payloadMatchesComplaint(payload, current, id)) return current;
        }
        return {
          ...current,
          assignedStaff: {
            ...(current.assignedStaff || {}),
            lastLocation: {
              latitude: Number(lat),
              longitude: Number(lng),
              updatedAt: payload.updatedAt || new Date().toISOString(),
            },
          },
        };
      });
    };

    socket.on("complaint:update", onComplaintEvent);
    socket.on("complaint:updated", onComplaintEvent);
    socket.on("location:update", onLocation);
    socket.on("location:updated", onLocation);
    return () => {
      socket.off("complaint:update", onComplaintEvent);
      socket.off("complaint:updated", onComplaintEvent);
      socket.off("location:update", onLocation);
      socket.off("location:updated", onLocation);
    };
  }, [socket, complaint?._id, complaint?.complaintId, id, loadComplaint]);

  const submitFeedback = async () => {
    if (!rating) return;
    setSaving(true);
    try {
      const response = await updateComplaint(id, { rating, feedback, ratingQuality, ratingSatisfaction, ratingBehaviour });
      setComplaint(response.complaint);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save feedback.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">Loading complaint details...</div>;
  if (error && !complaint) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
        <p>{error}</p>
        <button type="button" onClick={() => loadComplaint()} className="mt-4 rounded-xl bg-rose-800 px-4 py-2 text-sm font-bold text-white">Retry</button>
      </div>
    );
  }
  if (!complaint) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">This complaint could not be found.</div>;

  const currentStep = complaintTimelineIndex(complaint);
  const verified = complaint.status === "Completed" && Boolean(complaint.verifiedAt);
  const proof = verified ? (complaint.workEvidence || []) : [];
  const evidence = complaint.media?.length ? complaint.media : (complaint.images || []).map((url) => ({ url, resourceType: "image" }));
  const staffLoc = complaint.assignedStaff?.locationSharing ? complaint.assignedStaff.lastLocation : null;
  const lastUpdate = complaint.updatedAt || complaint.history?.[complaint.history.length - 1]?.createdAt;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Complaint record</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">{complaint.title}</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">{complaint.complaintId}</p>
        </div>
        <span className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${statusStyles[complaint.status] || "bg-slate-100 text-slate-700"}`}>{complaint.status}</span>
      </header>
      {error && <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{error}</div>}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Info icon={AlertTriangle} label="Category" value={complaint.category} />
          <Info icon={Clock3} label="Priority" value={complaint.priority} />
          <Info icon={CalendarDays} label="Submitted" value={new Date(complaint.createdAt).toLocaleDateString()} />
        </div>
        <div className="mt-7 rounded-2xl bg-slate-50 p-5">
          <h2 className="font-bold text-slate-900">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{complaint.description}</p>
        </div>
        {complaint.location && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-900">
            <MapPin className="mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-bold">Reported location</p>
              <div className="mt-1"><LocationBlock value={complaint.location} /></div>
            </div>
          </div>
        )}
        {evidence.length > 0 && (
          <div className="mt-7">
            <div className="flex items-center gap-2"><Image size={18} /><h2 className="font-bold">Submitted evidence</h2></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {evidence.map((item) => item.resourceType === "video"
                ? <video key={item.publicId || item.url} src={item.url} controls className="aspect-video w-full rounded-xl bg-slate-950 object-cover" />
                : <img key={item.publicId || item.url} src={typeof item === "string" ? item : item.url} alt="Complaint evidence" className="aspect-video w-full rounded-xl object-cover" />)}
            </div>
          </div>
        )}
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Assigned officer", value: displayValue(complaint.assignedOfficer || complaint.officer) },
          { label: "Officer department", value: complaint.assignedOfficer?.department || complaint.department || "Routing" },
          { label: "Assigned staff", value: displayValue(complaint.assignedStaff) },
          { label: "Latest update", value: lastUpdate ? new Date(lastUpdate).toLocaleString() : "—" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className="mt-2 font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Staff live location</p>
        {staffLoc && mapCenter(staffLoc) ? (
          <div className="mt-2 text-sm font-bold text-slate-900">
            <p>{staffLoc.latitude}, {staffLoc.longitude}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Updated {staffLoc.updatedAt ? new Date(staffLoc.updatedAt).toLocaleString() : "just now"}</p>
            <a className="mt-2 inline-block text-xs font-bold text-blue-700" href={`https://www.google.com/maps?q=${staffLoc.latitude},${staffLoc.longitude}`} target="_blank" rel="noreferrer">Open map</a>
          </div>
        ) : (
          <p className="mt-2 text-sm font-bold text-slate-500">Location is only shown when assigned staff is sharing live GPS.</p>
        )}
      </section>
      {complaint.status === "Under Verification" && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-black">Waiting for officer verification</h2>
          <p className="mt-2 text-sm text-slate-600">Completion proof is hidden until an officer or head officer approves it.</p>
        </section>
      )}
      {proof.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-black">Verified completion evidence</h2>
          {complaint.verifiedAt && <p className="mt-1 text-sm text-slate-500">Verified {new Date(complaint.verifiedAt).toLocaleString()}{complaint.verifiedBy ? ` · officer ${complaint.verifiedBy}` : ""}</p>}
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {proof.map((item) => (
              <figure key={item.url}>
                {item.resourceType === "video"
                  ? <video src={item.url} controls className="aspect-video w-full rounded-xl bg-slate-950" />
                  : <img src={item.url} alt="Verified completion proof" className="aspect-video w-full rounded-xl object-cover" />}
                {Number.isFinite(item.latitude) && <p className="mt-1 text-[11px] text-slate-500">{new Date(item.capturedAt || item.uploadedAt).toLocaleString()} · {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</p>}
              </figure>
            ))}
          </div>
        </section>
      )}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black">Progress timeline</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {COMPLAINT_TIMELINE_STEPS.map((step, index) => {
            const reached = currentStep >= index;
            return (
              <div key={step} className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${reached ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {reached ? <CheckCircle2 size={19} /> : <span className="text-sm font-bold">{index + 1}</span>}
                </div>
                <p className={`text-sm font-bold ${reached ? "text-slate-900" : "text-slate-400"}`}>{step}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-7 space-y-4 border-t border-slate-100 pt-6">
          {(complaint.history || []).map((event, index) => (
            <div key={`${event.status}-${event.createdAt}-${index}`} className="flex gap-3">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <div>
                <p className="text-sm font-bold text-slate-900">{event.status}</p>
                <p className="text-xs text-slate-500">{event.note || "Status updated"} · {event.createdAt ? new Date(event.createdAt).toLocaleString() : ""}</p>
              </div>
            </div>
          ))}
          {!(complaint.history || []).length && <p className="text-sm text-slate-500">No history events yet. Updates appear here as officers and staff act on this report.</p>}
        </div>
      </section>
      {verified && (
        <section className="rounded-2xl border border-orange-100 bg-orange-50 p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Rate verified work</h2>
          <p className="mt-1 text-sm text-slate-600">Available only after you can view officer-approved evidence.</p>
          {[
            ["Work quality", ratingQuality, setRatingQuality],
            ["Resolution satisfaction", ratingSatisfaction, setRatingSatisfaction],
            ["Staff behaviour", ratingBehaviour, setRatingBehaviour],
          ].map(([label, value, setter]) => (
            <div key={label} className="mt-4">
              <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
              <div className="mt-1 flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => { setter(star); setRating(star); }} className={`text-2xl ${star <= value ? "text-orange-500" : "text-slate-300"}`}>★</button>
                ))}
              </div>
            </div>
          ))}
          <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} className="mt-4 min-h-24 w-full rounded-xl border border-orange-200 bg-white p-3 text-sm" placeholder="Share a short note" />
          <button type="button" onClick={submitFeedback} disabled={!ratingQuality || !ratingSatisfaction || !ratingBehaviour || saving} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-40">
            <Send size={16} /> {saving ? "Saving..." : "Save feedback"}
          </button>
        </section>
      )}
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <Icon size={18} className="text-emerald-600" />
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{typeof value === "object" ? displayValue(value) : value}</p>
    </div>
  );
}

export default ComplaintDetails;
