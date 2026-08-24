import { useCallback, useEffect, useMemo, useState } from "react";
import { listUsers, updateUser } from "../../api/userApi";
import { listDepartments } from "../../api/platformApi";

const ROLES = ["All", "Citizen", "Staff", "Officer", "Head Officer", "Admin", "Super Admin"];

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState("");

  const load = useCallback(async () => {
    try {
      const [userData, departmentData] = await Promise.all([listUsers({ search, role }), listDepartments()]);
      setUsers(userData.users || []);
      setDepartments(departmentData.departments || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load users.");
    }
  }, [search, role]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => ({
    total: users.length,
    active: users.filter((user) => user.active).length,
  }), [users]);

  async function saveUser(user, patch) {
    setSaving(user.id);
    try {
      await updateUser(user.id, patch);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Update failed.");
    } finally {
      setSaving("");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Workforce</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">User & role management</h1>
          <p className="mt-2 text-slate-600">Search accounts, assign roles, and activate or deactivate access.</p>
        </div>
        <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800">{counts.active} active / {counts.total} loaded</div>
      </header>
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_220px]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" className="rounded-xl border border-slate-300 px-4 py-3" />
        <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3">
          {ROLES.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <select disabled={saving === user.id} value={user.role} onChange={(event) => saveUser(user, { role: event.target.value, department: user.department })} className="rounded-lg border px-2 py-1">
                    {ROLES.filter((item) => item !== "All").map((item) => <option key={item}>{item}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select disabled={saving === user.id} value={user.department || ""} onChange={(event) => saveUser(user, { role: user.role, department: event.target.value })} className="rounded-lg border px-2 py-1">
                    <option value="">None</option>
                    {departments.map((department) => <option key={department._id} value={department.name}>{department.name}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${user.active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{user.active ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-4 py-3">
                  <button type="button" disabled={saving === user.id} onClick={() => saveUser(user, { active: !user.active, role: user.role, department: user.department })} className="rounded-lg border px-3 py-1.5 text-xs font-bold">
                    {user.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!users.length && <p className="p-8 text-center text-sm text-slate-500">No users match this filter.</p>}
      </div>
    </div>
  );
}

export default UserManagement;
