import {
  useState,
} from "react";

import {
  X,
  UserCheck,
} from "lucide-react";



function AssignStaffModal({
  complaint,
  onClose,
  onAssign,
}) {
  const [selectedStaff, setSelectedStaff] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedStaff) {
      return;
    }

    onAssign({ id: selectedStaff, name: selectedStaff });
  };


  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Assign Staff
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Assign a field staff member to:
            </p>

            <p className="mt-2 font-medium text-blue-600">
              {complaint.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>


        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >
          <input value={selectedStaff} onChange={(event) => setSelectedStaff(event.target.value)} placeholder="Staff user ID" className="w-full rounded-lg border border-slate-300 px-4 py-3" />


          <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!selectedStaff}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserCheck size={18} />

              Assign Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default AssignStaffModal;