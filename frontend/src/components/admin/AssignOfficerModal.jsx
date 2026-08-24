import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { listUsers } from "../../api/userApi";

function AssignOfficerModal({ complaint, onClose, onAssign }) {
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState("");

  useEffect(() => {
    Promise.all([listUsers({ role: "Officer" }), listUsers({ role: "Head Officer" })])
      .then(([officersData, heads]) => setOfficers([...(officersData.users || []), ...(heads.users || [])]))
      .catch(() => setOfficers([]));
  }, []);

  if (!complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Assign Officer</h2>
            <p className="mt-1 text-sm text-slate-500">{complaint.complaintId} — {complaint.title}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
        </div>
        <select value={selectedOfficer} onChange={(event) => setSelectedOfficer(event.target.value)} className="mt-6 w-full rounded-lg border px-4 py-3">
          <option value="">Select officer</option>
          {officers.map((officer) => <option key={officer.id || officer._id} value={officer.id || officer._id}>{officer.name} · {officer.department || "No department"}</option>)}
        </select>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border px-5 py-2.5">Cancel</button>
          <button type="button" onClick={() => selectedOfficer && onAssign(complaint._id || complaint.complaintId, { id: selectedOfficer })} className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white">Assign Officer</button>
        </div>
      </div>
    </div>
  );
}

export default AssignOfficerModal;
