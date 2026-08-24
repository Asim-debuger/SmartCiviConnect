import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../common/Container";
import Avatar from "../common/Avatar";
import { getFeatured } from "../../api/publicCatalogApi";

function MarketplacePreview() {
  const [data, setData] = useState({ jobs: [], professionals: [] });
  useEffect(() => {
    getFeatured().then(setData).catch(() => {});
  }, []);

  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Job marketplace</p>
            <h2 className="mt-2 text-3xl font-black">Featured civic roles</h2>
            <div className="mt-6 space-y-3">
              {(data.jobs || []).map((job) => (
                <Link key={job._id} to={`/job/${job._id}`} className="block rounded-2xl border bg-white p-4 hover:border-teal-600">
                  <p className="font-bold">{job.title}</p>
                  <p className="text-sm text-slate-500">{job.organization || job.department} · {job.location || "Citywide"}</p>
                </Link>
              ))}
              {!(data.jobs || []).length && <p className="text-sm text-slate-500">Open roles appear here as departments hire.</p>}
            </div>
            <Link to="/jobs" className="mt-4 inline-block text-sm font-bold text-teal-700">View all jobs</Link>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Professional network</p>
            <h2 className="mt-2 text-3xl font-black">Featured professionals</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(data.professionals || []).map((person) => (
                <Link key={person._id} to={person.username ? `/u/${person.username}` : `/professional/${person._id}`} className="rounded-2xl border bg-white p-4 hover:border-teal-600">
                  <Avatar name={person.name} src={person.profileImage} size="sm" />
                  <p className="mt-2 font-bold">{person.name}</p>
                  <p className="text-xs text-slate-500">{person.headline || person.role}</p>
                </Link>
              ))}
              {!(data.professionals || []).length && <p className="text-sm text-slate-500">Professionals with headlines appear here.</p>}
            </div>
            <Link to="/professionals" className="mt-4 inline-block text-sm font-bold text-teal-700">Browse directory</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default MarketplacePreview;
