function EvidenceReview({ complaint, onApprove, onReject, busy }) {
  const evidence = complaint.workEvidence || [];
  return (
    <div className="mt-5 space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-black">Verification desk · {complaint.complaintId}</p>
      <p className="text-xs text-slate-600">{complaint.category} · {complaint.priority} · {complaint.assignedStaffId ? "Staff assigned" : "No staff"}</p>
      {complaint.location && (
        <a className="text-xs font-bold text-blue-700" href={complaint.location.mapsUrl || `https://www.google.com/maps?q=${complaint.location.latitude},${complaint.location.longitude}`} target="_blank" rel="noreferrer">Open complaint map</a>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {evidence.map((item) => (
          <figure key={item.publicId || item.url} className="overflow-hidden rounded-lg bg-white">
            {item.resourceType === "video"
              ? <video src={item.url} controls className="aspect-video w-full bg-black" />
              : <img src={item.url} alt={item.name || "Work evidence"} className="aspect-video w-full object-cover" />}
            <figcaption className="space-y-1 p-2 text-[11px] text-slate-600">
              <p>{item.phase || "after"} · {item.source || "upload"} · {item.capturedAt ? new Date(item.capturedAt).toLocaleString() : "no capture time"}</p>
              {Number.isFinite(item.latitude) && Number.isFinite(item.longitude) ? (
                <a className="font-bold text-blue-700" href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`} target="_blank" rel="noreferrer">GPS {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}</a>
              ) : <p className="text-rose-700">Missing GPS</p>}
            </figcaption>
          </figure>
        ))}
      </div>
      {!evidence.length && <p className="text-sm text-rose-700">No evidence attached.</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={onApprove} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Approve work</button>
        <button type="button" disabled={busy} onClick={onReject} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-50">Reject evidence</button>
      </div>
    </div>
  );
}

export default EvidenceReview;
