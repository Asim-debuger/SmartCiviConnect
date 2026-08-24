import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { getMyComplaints } from "../../api/complaintApi";

function TrackComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyComplaints()
      .then((data) => setComplaints(data.complaints || []))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load complaints."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Live tracking</h1>
      <p className="mt-2 text-slate-600">Open a complaint to watch official status and, when available, assigned staff GPS.</p>
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {loading && <p className="mt-8 text-sm text-slate-500">Loading your reports...</p>}
      <div className="mt-8 space-y-3">
        {complaints.map((complaint) => (
          <Link
            key={complaint._id}
            to={`/citizen/tracking/${complaint.complaintId || complaint._id}`}
            className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm"
          >
            <div>
              <p className="font-bold">{complaint.title}</p>
              <p className="text-xs text-slate-500">{complaint.complaintId} · {complaint.status}</p>
            </div>
            <MapPin className="text-emerald-600" />
          </Link>
        ))}
        {!loading && !complaints.length && (
          <div className="flex h-64 items-center justify-center rounded-xl bg-slate-100 text-center text-slate-500">
            No complaints to track yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackComplaint;
