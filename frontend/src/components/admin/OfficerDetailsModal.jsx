import {
  X,
  Mail,
  Phone,
  Building2,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

function OfficerDetailsModal({
  officer,
  onClose,
}) {
  if (!officer) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
              {officer.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {officer.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Officer ID: {officer.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon={Mail}
            title="Email"
            value={officer.email}
          />

          <InfoCard
            icon={Phone}
            title="Phone"
            value={officer.phone}
          />

          <InfoCard
            icon={Building2}
            title="Department"
            value={officer.department}
          />

          <InfoCard
            icon={ClipboardList}
            title="Active Workload"
            value={`${officer.assignedComplaints} complaints`}
          />

          <InfoCard
            icon={TrendingUp}
            title="Performance"
            value={`${officer.performance}%`}
          />

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Account Status
            </p>

            <p
              className={`mt-2 font-semibold ${
                officer.status === "Active"
                  ? "text-green-600"
                  : "text-slate-600"
              }`}
            >
              {officer.status}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Assigned Complaints
          </h3>

          <div className="mt-4 space-y-3">
            {officer.recentTasks.length > 0 ? (
              officer.recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-800">
                        {task.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {task.complaintId}
                      </p>
                    </div>

                    <span className="text-sm font-medium text-blue-600">
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-slate-50 p-5 text-sm text-slate-500">
                No recent complaints assigned.
              </p>
            )}
          </div>
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

      <p className="mt-2 font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}


export default OfficerDetailsModal;