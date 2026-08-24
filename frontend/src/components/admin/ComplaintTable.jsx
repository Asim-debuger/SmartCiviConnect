import { Eye, UserPlus } from "lucide-react";
import ComplaintStatus from "../complaints/ComplaintStatus";

function ComplaintTable({
  complaints,
  onView,
  onAssign,
}) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full min-w-[850px]">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Complaint ID
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Title
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Category
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Priority
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Status
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((complaint) => (
            <tr
              key={complaint.id}
              className="border-b last:border-none hover:bg-slate-50"
            >
              <td className="px-5 py-4 text-sm font-medium text-slate-800">
                {complaint.complaintId}
              </td>

              <td className="px-5 py-4">
                <p className="font-medium text-slate-800">
                  {complaint.title}
                </p>

                <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                  {complaint.description}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-slate-600">
                {complaint.category}
              </td>

              <td className="px-5 py-4 text-sm">
                {complaint.priority}
              </td>

              <td className="px-5 py-4">
                <ComplaintStatus status={complaint.status} />
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView(complaint)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    title="View Complaint"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onAssign(complaint)}
                    className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                    title="Assign Officer"
                  >
                    <UserPlus size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {complaints.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="px-5 py-10 text-center text-slate-500"
              >
                No complaints found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintTable;