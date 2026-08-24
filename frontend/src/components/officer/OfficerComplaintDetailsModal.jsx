import {
  X,
  MapPin,
  User,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import { displayValue, LocationBlock, safeChild } from "../../utils/formatValue";

function OfficerComplaintDetailsModal({
  complaint,
  onClose,
  onAssignStaff,
}) {
  if (!complaint) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">
              {complaint.id}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {complaint.title}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Complaint details and task assignment.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Complaint Information */}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <InfoCard
            icon={ClipboardList}
            title="Category"
            value={complaint.category}
          />

          <InfoCard
            icon={AlertTriangle}
            title="Priority"
            value={complaint.priority}
          />

          <InfoCard
            icon={MapPin}
            title="Location"
            value={<LocationBlock value={complaint.location} />}
          />

          <InfoCard
            icon={User}
            title="Assigned Staff"
            value={displayValue(complaint.assignedStaff)}
          />
        </div>

        {/* Description */}

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Complaint Description
          </h3>

          <div className="mt-3 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {complaint.description}
          </div>
        </div>

        {/* Status */}

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Current Status
          </h3>

          <span className="mt-3 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            {complaint.status}
          </span>
        </div>

        {/* Action */}

        <div className="mt-8 flex justify-end border-t pt-6">
          <button
            type="button"
            onClick={() => onAssignStaff(complaint)}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            {complaint.assignedStaff
              ? "Reassign Staff"
              : "Assign Staff"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={18} />

        <span className="text-sm">
          {title}
        </span>
      </div>

      <div className="mt-2 font-medium text-slate-800">
        {safeChild(value)}
      </div>
    </div>
  );
}

export default OfficerComplaintDetailsModal;