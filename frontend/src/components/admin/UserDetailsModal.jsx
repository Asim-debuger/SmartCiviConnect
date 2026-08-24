import { X, Mail, Phone, FileText } from "lucide-react";

function UserDetailsModal({
  user,
  onClose,
}) {
  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {user.name}
              </h2>

              <p className="text-sm text-slate-500">
                Citizen Profile
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

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Mail size={18} />

              <span className="text-sm">
                Email
              </span>
            </div>

            <p className="mt-2 font-medium text-slate-800">
              {user.email}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Phone size={18} />

              <span className="text-sm">
                Phone
              </span>
            </div>

            <p className="mt-2 font-medium text-slate-800">
              {user.phone}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <FileText size={18} />

              <span className="text-sm">
                Total Complaints
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {user.complaintsCount}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Account Status
            </p>

            <p
              className={`mt-2 font-semibold ${
                user.status === "Active"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {user.status}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Complaint History
          </h3>

          <div className="mt-4 space-y-3">
            {user.recentComplaints.length > 0 ? (
              user.recentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-800">
                        {complaint.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {complaint.category}
                      </p>
                    </div>

                    <span className="text-sm font-medium text-blue-600">
                      {complaint.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-slate-50 p-5 text-sm text-slate-500">
                No complaints found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsModal;