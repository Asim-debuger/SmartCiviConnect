import { useCallback, useEffect, useMemo, useState } from "react";
import { Clock, MapPin, Navigation, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getComplaintById } from "../../api/complaintApi";
import ComplaintTrackingMap from "../../components/maps/ComplaintTrackingMap";
import useSocket from "../../hooks/useSocket";
import { displayValue, LocationBlock, mapCenter } from "../../utils/formatValue";
import { payloadMatchesComplaint } from "../../utils/complaintTimeline";

function ComplaintTracking() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const loadComplaint = useCallback(async ({ quiet } = {}) => {
    try {
      if (!quiet) setLoading(true);
      const response = await getComplaintById(id);
      setComplaint(response?.complaint || null);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load live tracking.");
      if (!quiet) setComplaint(null);
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadComplaint(); }, [loadComplaint]);

  useEffect(() => {
    if (!socket || !complaint) return;
    [complaint._id, complaint.complaintId, id].filter(Boolean).forEach((room) => socket.emit("complaint:join", String(room)));
    const onComplaintEvent = (payload) => {
      if (payloadMatchesComplaint(payload, complaint, id) || !payload?._id) loadComplaint({ quiet: true });
    };
    const onLocation = (payload) => {
      const lat = payload?.latitude ?? payload?.lat;
      const lng = payload?.longitude ?? payload?.lng;
      if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return;
      if (payload.complaintId && !payloadMatchesComplaint(payload, complaint, id)) return;
      setComplaint((current) => current ? ({
        ...current,
        assignedStaff: {
          ...(current.assignedStaff || {}),
          lastLocation: {
            latitude: Number(lat),
            longitude: Number(lng),
            updatedAt: payload.updatedAt || new Date().toISOString(),
          },
        },
      }) : current);
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

  const complaintLocation = useMemo(() => mapCenter(complaint?.location), [complaint]);
  const sharing = Boolean(complaint?.assignedStaff?.locationSharing && complaint?.assignedStaff?.lastLocation);
  const staffLocation = sharing ? mapCenter(complaint.assignedStaff.lastLocation) : null;

  if (loading) return <div className="rounded-2xl border bg-white p-8 text-slate-500">Loading live tracking...</div>;
  if (error && !complaint) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
        <p>{error}</p>
        <button type="button" onClick={() => loadComplaint()} className="mt-4 rounded-xl bg-rose-800 px-4 py-2 text-sm font-bold text-white">Retry</button>
      </div>
    );
  }
  if (!complaint) return <div className="rounded-2xl border bg-white p-8 text-slate-500">Complaint not found.</div>;

  return (
    <div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Live operations</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Live complaint tracking</h1>
        <p className="mt-2 text-slate-600">{complaint.complaintId} · {complaint.title}</p>
        <Link to={`/citizen/complaint/${complaint.complaintId || complaint._id}`} className="mt-3 inline-block text-sm font-bold text-blue-700">Open full complaint record</Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <MapPin className="text-blue-600" />
          <h3 className="mt-3 font-semibold">Complaint location</h3>
          <div className="mt-2 text-sm text-slate-500"><LocationBlock value={complaint.location} /></div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <User className="text-green-600" />
          <h3 className="mt-3 font-semibold">Assigned staff</h3>
          <p className="mt-2 text-sm text-slate-500">{displayValue(complaint.assignedStaff)}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <Clock className="text-orange-600" />
          <h3 className="mt-3 font-semibold">Current status</h3>
          <p className="mt-2 text-sm text-slate-500">{complaint.status}</p>
          {complaint.assignedStaff?.lastLocation?.updatedAt && (
            <p className="mt-1 text-xs text-slate-400">GPS {new Date(complaint.assignedStaff.lastLocation.updatedAt).toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <Navigation className="text-blue-600" />
          <h2 className="text-xl font-semibold">Live location map</h2>
        </div>
        {complaintLocation ? (
          <ComplaintTrackingMap complaintLocation={complaintLocation} staffLocation={staffLocation} />
        ) : (
          <p className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">This complaint has no GPS coordinates to display.</p>
        )}
        {!staffLocation && (
          <p className="mt-4 text-sm text-slate-500">Staff location appears only when the assigned worker has live sharing enabled. No placeholder coordinates are shown.</p>
        )}
      </div>
    </div>
  );
}

export default ComplaintTracking;
