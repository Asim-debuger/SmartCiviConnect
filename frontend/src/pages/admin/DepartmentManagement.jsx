import { useEffect, useState } from "react";
import { assignDepartmentOfficer, createDepartment, listDepartments, updateDepartment } from "../../api/platformApi";
import { listUsers } from "../../api/userApi";

function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  async function load() {
    try {
      const [dept, users] = await Promise.all([listDepartments(), listUsers({ role: "Officer" })]);
      const heads = await listUsers({ role: "Head Officer" });
      setDepartments(dept.departments || []);
      setOfficers([...(users.users || []), ...(heads.users || [])]);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load departments.");
    }
  }

  useEffect(() => { load(); }, []);

  async function create(event) {
    event.preventDefault();
    try {
      await createDepartment(form);
      setForm({ name: "", description: "" });
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create department.");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Organization</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Departments</h1>
        <p className="mt-2 text-slate-600">Complaints route automatically from category into these civic departments.</p>
      </header>
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <form onSubmit={create} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[1fr_1fr_auto]">
        <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Department name" className="rounded-xl border px-4 py-3" />
        <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" className="rounded-xl border px-4 py-3" />
        <button type="submit" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Create</button>
      </form>
      <div className="grid gap-4">
        {departments.map((department) => (
          <article key={department._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="text-xl font-black">{department.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{department.description || "No description"}</p>
                <p className="mt-2 text-xs font-semibold text-slate-400">Categories: {(department.categories || []).join(", ") || "Custom"}</p>
              </div>
              <span className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${department.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{department.active ? "Active" : "Inactive"}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <select defaultValue="" onChange={async (event) => { if (!event.target.value) return; await assignDepartmentOfficer(department._id, event.target.value); await load(); }} className="rounded-lg border px-3 py-2 text-sm">
                <option value="">Assign officer</option>
                {officers.map((officer) => <option key={officer.id} value={officer.id}>{officer.name} · {officer.role}</option>)}
              </select>
              <select defaultValue={department.headOfficerId || ""} onChange={async (event) => { await updateDepartment(department._id, { headOfficerId: event.target.value }); await load(); }} className="rounded-lg border px-3 py-2 text-sm">
                <option value="">Head officer</option>
                {officers.map((officer) => <option key={officer.id} value={officer.id}>{officer.name}</option>)}
              </select>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default DepartmentManagement;
