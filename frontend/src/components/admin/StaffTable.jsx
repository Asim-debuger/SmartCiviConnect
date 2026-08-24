import {
  Eye,
  Power,
  UserPlus,
} from "lucide-react";

function StaffTable({
  staffMembers,
  onView,
  onToggleStatus,
  onAdd,
}) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Staff Members
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage field staff, tasks, availability, and performance.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <UserPlus size={18} />
          Add Staff
        </button>
      </div>

      <table className="w-full min-w-[1000px]">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Staff Member
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Department
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Assigned Tasks
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Availability
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Performance
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
          {staffMembers.map((staff) => (
            <tr
              key={staff.id}
              className="border-b last:border-none hover:bg-slate-50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-600">
                    {staff.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium text-slate-800">
                      {staff.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {staff.email}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4 text-sm text-slate-600">
                {staff.department}
              </td>

              <td className="px-5 py-4">
                <span className="font-semibold text-slate-800">
                  {staff.assignedTasks}
                </span>

                <span className="text-sm text-slate-500">
                  {" "}
                  active
                </span>
              </td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    staff.availability === "Available"
                      ? "bg-green-100 text-green-700"
                      : staff.availability === "Busy"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {staff.availability}
                </span>
              </td>

              <td className="px-5 py-4">
                <span className="font-semibold text-green-600">
                  {staff.performance}%
                </span>
              </td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    staff.status === "Active"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {staff.status}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView(staff)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    title="View Staff"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleStatus(staff.id)}
                    className="rounded-lg p-2 text-orange-600 hover:bg-orange-50"
                    title="Toggle Staff Status"
                  >
                    <Power size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {staffMembers.length === 0 && (
            <tr>
              <td
                colSpan="7"
                className="px-5 py-10 text-center text-slate-500"
              >
                No staff members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StaffTable;