import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPublicJobs } from "../../api/publicCatalogApi";

function PublicJobs() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ search: "", location: "", skill: "", type: "All" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = { ...filters };
    if (params.type === "All") delete params.type;
    listPublicJobs(params)
      .then((data) => { setJobs(data.jobs || []); setError(""); })
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load jobs."))
      .finally(() => setLoading(false));
  }, [filters.search, filters.location, filters.skill, filters.type]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Marketplace</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">Civic jobs</h1>
      <p className="mt-3 max-w-2xl text-slate-600">Browse open field, contract, and department roles. Sign in to apply with your professional profile.</p>
      {error && <div className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <div className="mt-8 grid gap-3 md:grid-cols-4">
        <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search roles" className="rounded-xl border px-3 py-2.5" />
        <input value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} placeholder="Location" className="rounded-xl border px-3 py-2.5" />
        <input value={filters.skill} onChange={(event) => setFilters({ ...filters, skill: event.target.value })} placeholder="Skill" className="rounded-xl border px-3 py-2.5" />
        <select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} className="rounded-xl border px-3 py-2.5">
          {["All", "Full time", "Part time", "Contract", "Emergency work"].map((type) => <option key={type}>{type}</option>)}
        </select>
      </div>
      <div className="mt-8 space-y-4">
        {loading && <p className="text-sm text-slate-500">Loading openings...</p>}
        {jobs.map((job) => (
          <article key={job._id} className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">{job.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{job.department} · {job.location || "Citywide"} · {job.type} · {job.applicantCount || 0} applicants</p>
            <p className="mt-3 text-sm text-slate-600">{job.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to={`/job/${job._id}`} className="inline-flex rounded-xl border px-4 py-2 text-sm font-bold">View role</Link>
              <Link to={`/login?redirect=${encodeURIComponent(`/job/${job._id}`)}`} className="inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Sign in to apply</Link>
              <Link to={`/register?redirect=${encodeURIComponent(`/job/${job._id}`)}`} className="inline-flex rounded-xl border px-4 py-2 text-sm font-bold">Register</Link>
            </div>
          </article>
        ))}
        {!loading && !jobs.length && <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">No public openings right now.</p>}
      </div>
    </div>
  );
}

export default PublicJobs;
