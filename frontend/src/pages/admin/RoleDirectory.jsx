import { useEffect, useState } from "react";
import { listUsers, updateUser } from "../../api/userApi";

function RoleDirectory({ role, title, subtitle }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setUsers((await listUsers({ role })).users || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load directory.");
    }
  }

  useEffect(() => { load(); }, [role]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-black tracking-tight">{title}</h1>
        <p className="mt-2 text-slate-600">{subtitle}</p>
      </header>
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {users.map((user) => (
          <div key={user.id} className="flex flex-col justify-between gap-3 border-b p-5 last:border-0 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email} · {user.department || "No department"}</p>
            </div>
            <button type="button" onClick={async () => { await updateUser(user.id, { active: !user.active, role: user.role, department: user.department }); await load(); }} className="rounded-lg border px-4 py-2 text-sm font-bold">
              {user.active ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
        {!users.length && <p className="p-8 text-center text-sm text-slate-500">No {role.toLowerCase()} accounts yet. Promote users from User & role management.</p>}
      </div>
    </div>
  );
}

export default RoleDirectory;
