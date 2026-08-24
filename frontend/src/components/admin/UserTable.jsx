import { Eye, Lock, Unlock } from "lucide-react";

function UserTable({
  users,
  onView,
  onToggleStatus,
}) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full min-w-[850px]">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              User
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Email
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Phone
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
              Complaints
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
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b last:border-none hover:bg-slate-50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium text-slate-800">
                      {user.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      Citizen ID: {user.id}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4 text-sm text-slate-600">
                {user.email}
              </td>

              <td className="px-5 py-4 text-sm text-slate-600">
                {user.phone}
              </td>

              <td className="px-5 py-4 text-sm font-medium text-slate-700">
                {user.complaintsCount}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView(user)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    title="View User"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleStatus(user.id)}
                    className={`rounded-lg p-2 ${
                      user.status === "Active"
                        ? "text-red-600 hover:bg-red-50"
                        : "text-green-600 hover:bg-green-50"
                    }`}
                    title={
                      user.status === "Active"
                        ? "Block User"
                        : "Activate User"
                    }
                  >
                    {user.status === "Active" ? (
                      <Lock size={18} />
                    ) : (
                      <Unlock size={18} />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="px-5 py-10 text-center text-slate-500"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;