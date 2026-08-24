import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicJob } from "../../api/publicCatalogApi";
import { applyToJob } from "../../api/jobApi";
import { useAuthContext } from "../../context/AuthContext";
import Avatar from "../../components/common/Avatar";
import ResumeUpload from "../../components/jobs/ResumeUpload";

function PublicJobDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthContext();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cover, setCover] = useState("");
  const redirect = encodeURIComponent(`/job/${id}`);

  useEffect(() => {
    getPublicJob(id)
      .then((data) => setJob(data.job))
      .catch((requestError) => setError(requestError.response?.data?.message || "Job not found."));
  }, [id]);

  if (error) return <div className="mx-auto max-w-3xl px-5 py-16 rounded-xl bg-rose-50 p-6 text-rose-800">{error}</div>;
  if (!job) return <p className="px-5 py-16 text-center text-slate-500">Loading job...</p>;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Link to="/jobs" className="text-sm font-bold text-teal-700">Back to jobs</Link>
      <article className="mt-4 rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Open role</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">{job.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {job.organization || "Civic department"} · {job.department} · {job.location || "Citywide"} · {job.workplace || "On-site"} · {job.type}
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-500">{job.applicantCount || 0} applicants</p>
        {(job.salaryMin || job.salaryMax) && <p className="mt-2 text-lg font-black">₹{job.salaryMin || 0} – ₹{job.salaryMax || "N/A"}</p>}
        <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-600">{job.description}</p>
        <p className="mt-4 text-sm"><span className="font-semibold">Required skills:</span> {(job.skillsRequired || []).join(", ") || "—"}</p>
        <p className="mt-2 text-sm"><span className="font-semibold">Experience:</span> {job.experience || "Not specified"}</p>
        {job.education && <p className="mt-2 text-sm"><span className="font-semibold">Education:</span> {job.education}</p>}
        {job.certifications && <p className="mt-2 text-sm"><span className="font-semibold">Certifications:</span> {job.certifications}</p>}
        {job.requiredDocuments?.length > 0 && <p className="mt-2 text-sm"><span className="font-semibold">Required documents:</span> {job.requiredDocuments.join(", ")}</p>}
        {job.deadline && <p className="mt-2 text-sm text-slate-500">Apply by {new Date(job.deadline).toLocaleDateString()}</p>}
        {job.recruiter && (
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <Avatar name={job.recruiter.name} src={job.recruiter.profileImage} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Recruiter</p>
              <p className="font-bold">{job.recruiter.name}</p>
              <p className="text-sm text-slate-500">{job.recruiter.headline || job.recruiter.role}</p>
            </div>
          </div>
        )}
        {isAuthenticated ? (
          <form
            className="mt-8 space-y-3"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                await applyToJob(job._id, { coverLetter: cover || "I am interested in this civic assignment." });
                setMessage("Application submitted.");
                setError("");
              } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to apply.");
              }
            }}
          >
            <textarea value={cover} onChange={(event) => setCover(event.target.value)} rows={3} placeholder="Cover note" className="w-full rounded-xl border p-3 text-sm" />
            <ResumeUpload />
            {user && !user.hasResume && <p className="text-xs text-rose-700">Upload a resume before applying.</p>}
            <button type="submit" disabled={!user?.hasResume} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">Apply</button>
            {message && <p className="text-sm font-semibold text-emerald-700">{message}</p>}
          </form>
        ) : (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={`/login?redirect=${redirect}`} className="inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Login to apply</Link>
            <Link to={`/register?redirect=${redirect}`} className="inline-flex rounded-xl border px-5 py-3 text-sm font-bold">Register to apply</Link>
          </div>
        )}
      </article>
    </div>
  );
}

export default PublicJobDetail;
