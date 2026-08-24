import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPublicProfessionals } from "../../api/publicCatalogApi";
import Avatar from "../../components/common/Avatar";

function PublicProfessionals() {
  const [people, setPeople] = useState([]);
  const [filters, setFilters] = useState({ search: "", role: "All", department: "", skill: "", location: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPublicProfessionals(filters)
      .then((data) => { setPeople(data.people || []); setError(""); })
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load professionals."))
      .finally(() => setLoading(false));
  }, [filters.search, filters.role, filters.department, filters.skill, filters.location]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Talent</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">Professionals</h1>
      <p className="mt-3 max-w-2xl text-slate-600">Search electricians, officers, and field workers. Connecting and messaging requires an account.</p>
      {error && <div className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <div className="mt-8 grid gap-3 md:grid-cols-5">
        <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search" className="rounded-xl border px-3 py-2.5" />
        <select value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })} className="rounded-xl border px-3 py-2.5">
          {["All", "Citizen", "Staff", "Officer", "Head Officer"].map((role) => <option key={role}>{role}</option>)}
        </select>
        <input value={filters.department} onChange={(event) => setFilters({ ...filters, department: event.target.value })} placeholder="Department" className="rounded-xl border px-3 py-2.5" />
        <input value={filters.skill} onChange={(event) => setFilters({ ...filters, skill: event.target.value })} placeholder="Skill" className="rounded-xl border px-3 py-2.5" />
        <input value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} placeholder="Location" className="rounded-xl border px-3 py-2.5" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading && <p className="text-sm text-slate-500">Loading directory...</p>}
        {people.map((person) => (
          <Link key={person._id} to={`/professional/${person._id}`} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <Avatar name={person.name} src={person.profileImage} />
            <p className="mt-3 font-bold">{person.name}</p>
            <p className="text-sm text-slate-500">{person.headline || person.role}</p>
            <p className="mt-2 text-xs text-slate-400">{person.department || "Civic professional"} · {person.city || "India"}</p>
            <p className="mt-2 text-xs font-semibold">{(person.skills || []).slice(0, 3).join(" · ")}</p>
          </Link>
        ))}
      </div>
      {!loading && !people.length && <p className="mt-8 rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">No public profiles match these filters.</p>}
    </div>
  );
}

export default PublicProfessionals;
