import {
  Eye,
  UserPlus,
  Power,
} from "lucide-react";

function OfficerTable({
  officers,
  onView,
  onToggleStatus,
  onAdd,
}) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Officers
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage officers and monitor their workload.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <UserPlus size={18} />

          Add Officer
        </button>
      </div>

      <table className="w-full min-w-[950px]">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Officer
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Department
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Assigned Complaints
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
          {officers.map((officer) => (
            <tr
              key={officer.id}
              className="border-b last:border-none hover:bg-slate-50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                    {officer.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium text-slate-800">
                      {officer.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {officer.email}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4 text-sm text-slate-600">
                {officer.department}
              </td>

              <td className="px-5 py-4">
                <span className="font-semibold text-slate-800">
                  {officer.assignedComplaints}
                </span>

                <span className="text-sm text-slate-500">
                  {" "}
                  active
                </span>
              </td>

              <td className="px-5 py-4">
                <span className="font-semibold text-green-600">
                  {officer.performance}%
                </span>
              </td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    officer.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {officer.status}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView(officer)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    title="View Officer"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onToggleStatus(officer.id)
                    }
                    className="rounded-lg p-2 text-orange-600 hover:bg-orange-50"
                    title="Toggle Officer Status"
                  >
                    <Power size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {officers.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="px-5 py-10 text-center text-slate-500"
              >
                No officers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OfficerTable;