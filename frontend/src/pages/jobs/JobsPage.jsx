import { useEffect, useState } from "react";
import { applyToJob, listJobs, myApplications } from "../../api/jobApi";
import { useAuthContext } from "../../context/AuthContext";
import { normalizeRole } from "../../utils/roles";
import { Link, useLocation } from "react-router-dom";
import { workspaceBase } from "../../utils/workspace";
import ResumeUpload from "../../components/jobs/ResumeUpload";
import DocumentUpload from "../../components/jobs/DocumentUpload";

function JobsPage() {
  const { user } = useAuthContext();
  const location = useLocation();
  const base = workspaceBase(location.pathname);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({ search: "", location: "", skill: "", salaryMin: "", type: "All", department: "", experience: "", workplace: "All" });
  const [debounced, setDebounced] = useState(filters);
  const [cover, setCover] = useState("");
  const [pendingDocs, setPendingDocs] = useState([]);
  const [error, setError] = useState("");
  const [appError, setAppError] = useState("");
  const [loading, setLoading] = useState(true);
  const role = normalizeRole(user?.role);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(filters), 350);
    return () => clearTimeout(timer);
  }, [filters]);

  async function loadJobs(nextFilters = debounced) {
    const params = { ...nextFilters };
    if (params.type === "All") delete params.type;
    if (params.workplace === "All") delete params.workplace;
    const jobData = await listJobs(params);
    setJobs(jobData.jobs || []);
  }

  async function loadApplications() {
    const appData = await myApplications();
    setApplications(appData.applications || []);
  }

  async function load() {
    setLoading(true);
    try {
      await loadJobs();
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load jobs.");
    }
    try {
      await loadApplications();
      setAppError("");
    } catch (requestError) {
      setAppError(requestError.response?.data?.message || "Unable to load your applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [debounced.search, debounced.location, debounced.skill, debounced.salaryMin, debounced.type, debounced.department, debounced.experience, debounced.workplace]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Job marketplace</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Find civic work</h1>
      </header>
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <div className="grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-4 xl:grid-cols-8">
        <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Keyword" className="rounded-lg border px-3 py-2" />
        <input value={filters.department} onChange={(event) => setFilters({ ...filters, department: event.target.value })} placeholder="Department" className="rounded-lg border px-3 py-2" />
        <input value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} placeholder="Location" className="rounded-lg border px-3 py-2" />
        <input value={filters.skill} onChange={(event) => setFilters({ ...filters, skill: event.target.value })} placeholder="Skill" className="rounded-lg border px-3 py-2" />
        <input value={filters.experience} onChange={(event) => setFilters({ ...filters, experience: event.target.value })} placeholder="Experience" className="rounded-lg border px-3 py-2" />
        <input type="number" value={filters.salaryMin} onChange={(event) => setFilters({ ...filters, salaryMin: event.target.value })} placeholder="Min salary" className="rounded-lg border px-3 py-2" />
        <select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} className="rounded-lg border px-3 py-2">
          {["All", "Full time", "Part time", "Contract", "Emergency work"].map((type) => <option key={type}>{type}</option>)}
        </select>
        <select value={filters.workplace} onChange={(event) => setFilters({ ...filters, workplace: event.target.value })} className="rounded-lg border px-3 py-2">
          {["All", "On-site", "Remote", "Hybrid"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {["citizen", "staff"].includes(role) && (
        <div className="space-y-3">
          <ResumeUpload />
          <DocumentUpload onUploaded={(doc) => setPendingDocs((current) => [...current, doc])} />
          {pendingDocs.length > 0 && (
            <ul className="text-xs text-slate-600">
              {pendingDocs.map((doc) => <li key={doc.publicId}>{doc.fileName} attached to your next application</li>)}
            </ul>
          )}
          <textarea value={cover} onChange={(event) => setCover(event.target.value)} placeholder="Cover note attached to your next application" className="w-full rounded-2xl border bg-white p-4 text-sm" rows={2} />
        </div>
      )}
      <div className="grid gap-4">
        {loading && <p className="text-sm text-slate-500">Loading openings...</p>}
        {jobs.map((job) => (
          <article key={job._id} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-3xl">
                <h2 className="text-xl font-black"><Link to={`${base}/jobs/${job._id}`} className="hover:underline">{job.title}</Link></h2>
                <p className="text-sm text-slate-500">{job.organization || job.department} · {job.location || "Citywide"} · {job.workplace || "On-site"} · {job.type} · {job.applicantCount || 0} applicants</p>
                <p className="mt-2 text-sm text-slate-600">{job.description}</p>
                <p className="mt-2 text-xs font-semibold text-slate-400">{(job.skillsRequired || []).join(" · ")}</p>
                <p className="mt-2 text-sm"><span className="font-semibold">Experience:</span> {job.experience || "Not specified"}</p>
                {(job.salaryMin || job.salaryMax) && <p className="mt-1 text-sm font-bold">₹{job.salaryMin || 0} – ₹{job.salaryMax || "N/A"}</p>}
                {job.deadline && <p className="mt-1 text-xs text-slate-500">Apply by {new Date(job.deadline).toLocaleDateString()}</p>}
              </div>
              {user && (
                <button
                  type="button"
                  disabled={!user.hasResume}
                  onClick={async () => {
                    try {
                      setError("");
                      if (!user.hasResume) {
                        setError("Upload a PDF, DOC, or DOCX resume on your profile before applying.");
                        return;
                      }
                      await applyToJob(job._id, {
                        coverLetter: cover || "I am interested in this civic assignment.",
                        documents: pendingDocs,
                      });
                      setPendingDocs([]);
                      await load();
                    } catch (requestError) {
                      setError(requestError.response?.data?.message || "Unable to apply for this job.");
                    }
                  }}
                  className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                >
                  {user.hasResume ? "Apply" : "Upload resume to apply"}
                </button>
              )}
            </div>
          </article>
        ))}
        {!loading && !jobs.length && <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">No open jobs match these filters.</p>}
      </div>
      <section className="rounded-2xl border bg-white p-5">
        <h2 className="font-black">My applications</h2>
        {appError && <p className="mt-2 text-sm text-rose-700">{appError}</p>}
        <div className="mt-3 space-y-2">
          {applications.map((item) => (
            <Link key={item._id} to={`${base}/jobs/applications/${item._id}`} className="block rounded-xl bg-slate-50 px-3 py-3 text-sm hover:bg-slate-100">
              <div className="flex justify-between gap-3">
                <span className="font-semibold">{item.jobId?.title || "Job"}</span>
                <span className="font-bold">{item.status}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {item.jobId?.organization || item.jobId?.department} · {item.jobId?.location || "Citywide"} · {item.jobId?.workplace || "On-site"} · {item.jobId?.type}
                {item.jobId?.salaryMin || item.jobId?.salaryMax ? ` · ₹${item.jobId?.salaryMin || 0}–${item.jobId?.salaryMax || "N/A"}` : ""}
              </p>
              <p className="mt-1 text-xs text-slate-500">Applied {new Date(item.createdAt).toLocaleString()} {item.locked ? "· Locked" : "· You can update materials"}</p>
              <p className="mt-1 text-xs text-slate-500">Resume: {item.resumeFileName || "On file"}{(applicationDocumentsSafe(item).length) ? ` · ${applicationDocumentsSafe(item).length} document(s)` : ""}</p>
              {item.recruiterNote && <p className="mt-1 text-xs text-slate-500">Recruiter: {item.recruiterNote}</p>}
              {item.interviewAt && <p className="mt-1 text-xs text-slate-500">Interview: {new Date(item.interviewAt).toLocaleString()}</p>}
            </Link>
          ))}
          {!applications.length && !appError && <p className="text-sm text-slate-500">You have not applied yet.</p>}
        </div>
      </section>
    </div>
  );
}

function applicationDocumentsSafe(item) {
  const snapshotDocs = item?.snapshot?.documents;
  if (Array.isArray(snapshotDocs) && snapshotDocs.length) return snapshotDocs;
  return item?.documents || [];
}

export default JobsPage;
