import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { applyToJob, getJob } from "../../api/jobApi";
import { useAuthContext } from "../../context/AuthContext";
import { normalizeRole } from "../../utils/roles";
import { workspaceBase } from "../../utils/workspace";
import Avatar from "../../components/common/Avatar";
import ResumeUpload from "../../components/jobs/ResumeUpload";

function JobDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuthContext();
  const base = workspaceBase(location.pathname);
  const role = normalizeRole(user?.role);
  const [job, setJob] = useState(null);
  const [cover, setCover] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [certifications, setCertifications] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getJob(id)
      .then((data) => setJob(data.job))
      .catch((requestError) => setError(requestError.response?.data?.message || "Job not found."));
  }, [id]);

  if (error) return <div className="rounded-xl bg-rose-50 p-4 text-rose-800">{error}</div>;
  if (!job) return <p className="text-slate-500">Loading job...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to={`${base}/jobs`} className="text-sm font-bold text-blue-700">Back to marketplace</Link>
      <article className="rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-black tracking-tight">{job.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {job.organization || "Civic department"} · {job.department} · {job.location || "Citywide"} · {job.workplace || "On-site"} · {job.type}
        </p>
        <p className="mt-2 text-sm font-semibold">{job.applicantCount || 0} applicants · {job.status}</p>
        {(job.salaryMin || job.salaryMax) && <p className="mt-3 text-lg font-black">₹{job.salaryMin || 0} – ₹{job.salaryMax || "N/A"}</p>}
        <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-600">{job.description}</p>
        <p className="mt-4 text-sm"><span className="font-semibold">Required skills:</span> {(job.skillsRequired || []).join(", ") || "—"}</p>
        <p className="mt-2 text-sm"><span className="font-semibold">Experience:</span> {job.experience || "Not specified"}</p>
        {job.education && <p className="mt-2 text-sm"><span className="font-semibold">Education:</span> {job.education}</p>}
        {job.certifications && <p className="mt-2 text-sm"><span className="font-semibold">Certifications:</span> {job.certifications}</p>}
        {job.deadline && <p className="mt-2 text-xs text-slate-500">Apply by {new Date(job.deadline).toLocaleDateString()}</p>}
        {job.requiredDocuments?.length > 0 && <p className="mt-2 text-sm"><span className="font-semibold">Required documents:</span> {job.requiredDocuments.join(", ")}</p>}
        {job.recruiter && (
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <Avatar name={job.recruiter.name} src={job.recruiter.profileImage} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Recruiter</p>
              <p className="font-bold">{job.recruiter.name}</p>
              <p className="text-sm text-slate-500">{job.recruiter.headline || job.recruiter.role} · {job.recruiter.department}</p>
            </div>
          </div>
        )}
        {user && job.status === "Open" && (
          <form
            className="mt-8 space-y-3"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                await applyToJob(job._id, {
                  coverLetter: cover || "I am interested in this civic assignment.",
                  skills: skills || user?.skills,
                  experience: experience || user?.experience,
                  education: education || undefined,
                  certifications: certifications || undefined,
                });
                setMessage("Application submitted.");
                setError("");
                const data = await getJob(id);
                setJob(data.job);
              } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to apply.");
              }
            }}
          >
            <textarea value={cover} onChange={(event) => setCover(event.target.value)} rows={3} placeholder="Cover note" className="w-full rounded-xl border p-3 text-sm" />
            <input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Skills" className="w-full rounded-xl border p-3 text-sm" />
            <input value={experience} onChange={(event) => setExperience(event.target.value)} placeholder="Experience" className="w-full rounded-xl border p-3 text-sm" />
            <input value={education} onChange={(event) => setEducation(event.target.value)} placeholder="Education" className="w-full rounded-xl border p-3 text-sm" />
            <input value={certifications} onChange={(event) => setCertifications(event.target.value)} placeholder="Certifications" className="w-full rounded-xl border p-3 text-sm" />
            <ResumeUpload />
            {!user?.hasResume && <p className="text-xs text-rose-700">Upload a resume on your profile before applying.</p>}
            <button type="submit" disabled={!user?.hasResume} className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">Apply</button>
            {message && <p className="text-sm font-semibold text-emerald-700">{message}</p>}
          </form>
        )}
      </article>
    </div>
  );
}

export default JobDetailPage;
