import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { applicationDocuments, formatMixed } from "../../utils/applicationDisplay";
import { getApplication, getApplicationDocument, getApplicationResume, listJobApplications, listJobs, updateApplication, updateJob, createJob } from "../../api/jobApi";
import { listDepartments } from "../../api/platformApi";
import { workspaceBase } from "../../utils/workspace";
import Avatar from "../../components/common/Avatar";
import { useSignedFile } from "../../components/jobs/ResumePreview";

const empty = {
  title: "",
  description: "",
  department: "",
  organization: "",
  location: "",
  skillsRequired: "",
  salaryMin: "",
  salaryMax: "",
  experience: "",
  education: "",
  certifications: "",
  type: "Full time",
  workplace: "On-site",
  deadline: "",
  requiredDocuments: "",
  status: "Open",
};
const pipeline = ["Applied", "Viewed", "Shortlisted", "Interview Scheduled", "Selected", "Joined", "Rejected"];

function JobManagement() {
  const location = useLocation();
  const base = workspaceBase(location.pathname);
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(empty);
  const [selected, setSelected] = useState(null);
  const [applications, setApplications] = useState([]);
  const [active, setActive] = useState(null);
  const [filters, setFilters] = useState({ q: "", status: "All", sort: "latest" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { openSigned, modal, error: fileError } = useSignedFile();

  async function load() {
    try {
      setLoading(true);
      const jobData = await listJobs();
      setJobs(jobData.jobs || []);
      setError("");
      try {
        const dept = await listDepartments();
        setDepartments(dept.departments || []);
      } catch {
        setDepartments([]);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function openApplicants(job, nextFilters = filters) {
    try {
      setSelected(job);
      const data = await listJobApplications(job._id, {
        q: nextFilters.q || undefined,
        status: nextFilters.status,
        sort: nextFilters.sort,
      });
      setApplications(data.applications || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load applicants.");
    }
  }

  async function openCandidate(item) {
    const data = await getApplication(item._id);
    setActive(data.application);
    if (selected) await openApplicants(selected);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Recruiter desk</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Candidate management</h1>
      </header>
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      {fileError && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{fileError}</div>}
      {modal}
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            await createJob({
              ...form,
              salaryMin: Number(form.salaryMin) || undefined,
              salaryMax: Number(form.salaryMax) || undefined,
              deadline: form.deadline || undefined,
              skillsRequired: form.skillsRequired.split(",").map((item) => item.trim()).filter(Boolean),
              requiredDocuments: form.requiredDocuments.split(",").map((item) => item.trim()).filter(Boolean),
            });
            setForm(empty);
            await load();
          } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to create job.");
          }
        }}
        className="grid gap-3 rounded-2xl border bg-white p-5 md:grid-cols-2"
      >
        <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Job title" className="rounded-lg border p-3" />
        <select required value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className="rounded-lg border p-3">
          <option value="">Department</option>
          {departments.map((item) => <option key={item._id || item.name} value={item.name}>{item.name}</option>)}
        </select>
        <input value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} placeholder="Company / organization" className="rounded-lg border p-3" />
        <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" className="rounded-lg border p-3 md:col-span-2" />
        <input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Location" className="rounded-lg border p-3" />
        <input value={form.skillsRequired} onChange={(event) => setForm({ ...form, skillsRequired: event.target.value })} placeholder="Skills required" className="rounded-lg border p-3" />
        <input type="number" value={form.salaryMin} onChange={(event) => setForm({ ...form, salaryMin: event.target.value })} placeholder="Salary min" className="rounded-lg border p-3" />
        <input type="number" value={form.salaryMax} onChange={(event) => setForm({ ...form, salaryMax: event.target.value })} placeholder="Salary max" className="rounded-lg border p-3" />
        <input value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} placeholder="Experience" className="rounded-lg border p-3" />
        <input value={form.education} onChange={(event) => setForm({ ...form, education: event.target.value })} placeholder="Education requirement" className="rounded-lg border p-3" />
        <input value={form.certifications} onChange={(event) => setForm({ ...form, certifications: event.target.value })} placeholder="Required certifications" className="rounded-lg border p-3" />
        <input type="date" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} className="rounded-lg border p-3" />
        <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="rounded-lg border p-3">
          {["Full time", "Part time", "Contract", "Emergency work"].map((type) => <option key={type}>{type}</option>)}
        </select>
        <select value={form.workplace} onChange={(event) => setForm({ ...form, workplace: event.target.value })} className="rounded-lg border p-3">
          {["On-site", "Remote", "Hybrid"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-lg border p-3">
          {["Open", "Draft"].map((status) => <option key={status}>{status}</option>)}
        </select>
        <input value={form.requiredDocuments} onChange={(event) => setForm({ ...form, requiredDocuments: event.target.value })} placeholder="Required documents (resume, ID proof)" className="rounded-lg border p-3 md:col-span-2" />
        <button type="submit" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white md:col-span-2">Create job</button>
      </form>
      <div className="space-y-3">
        {loading && <p className="text-sm text-slate-500">Loading recruiter dashboard...</p>}
        {jobs.map((job) => (
          <article key={job._id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-black">{job.title}</h2>
                <p className="text-sm text-slate-500">{job.department} · {job.type} · {job.status} · {job.applicantCount || 0} applicants {job.deadline ? `· deadline ${new Date(job.deadline).toLocaleDateString()}` : ""}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => openApplicants(job)} className="rounded-lg border px-3 py-1.5 text-xs font-bold">Candidates</button>
                {job.status === "Draft" && <button type="button" onClick={async () => { await updateJob(job._id, { status: "Open" }); await load(); }} className="rounded-lg border px-3 py-1.5 text-xs font-bold">Publish</button>}
                {job.status === "Open" && <button type="button" onClick={async () => { await updateJob(job._id, { status: "Closed" }); await load(); }} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">Close</button>}
                {job.status === "Closed" && <button type="button" onClick={async () => { await updateJob(job._id, { status: "Open" }); await load(); }} className="rounded-lg border px-3 py-1.5 text-xs font-bold">Reopen</button>}
              </div>
            </div>
          </article>
        ))}
        {!loading && !jobs.length && <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">No open jobs match these filters.</p>}
      </div>
      {selected && (
        <section className="rounded-2xl border bg-white p-5">
          <h2 className="font-black">Pipeline · {selected.title}</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <input value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} placeholder="Search name, email, skill" className="rounded-lg border px-3 py-2 text-sm" />
            <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="rounded-lg border px-3 py-2 text-sm">
              {["All", ...pipeline].map((status) => <option key={status}>{status}</option>)}
            </select>
            <select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })} className="rounded-lg border px-3 py-2 text-sm">
              <option value="latest">Latest applied</option>
              <option value="skills">Skills</option>
              <option value="experience">Experience</option>
              <option value="status">Status</option>
            </select>
          </div>
          <button type="button" className="mt-2 text-xs font-bold text-blue-700" onClick={() => openApplicants(selected, filters)}>Apply filters</button>
          <div className="mt-4 space-y-3">
            {applications.map((item) => (
              <div key={item._id} className="rounded-xl bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <Avatar name={item.applicant?.name || item.name} src={item.applicant?.profileImage || item.snapshot?.profileImage} />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.email} · {item.status} · {item.experienceYears || 0} yrs · applied {new Date(item.createdAt).toLocaleString()}</p>
                      <p className="mt-1 text-xs text-slate-500">Skills: {(item.skills || []).join(", ") || "—"}</p>
                      {item.education && <p className="mt-1 text-xs text-slate-500">Education: {formatMixed(item.education)}</p>}
                      {(item.hasResume || item.resumeFileName) && (
                        <span className="text-xs">
                          <button type="button" onClick={() => openSigned((download) => getApplicationResume(item._id, download))} className="font-bold text-blue-700">View resume</button>
                          {" · "}
                          <button type="button" onClick={() => openSigned((download) => getApplicationResume(item._id, download), { download: true })} className="font-bold text-blue-700">Download</button>
                        </span>
                      )}
                      {applicationDocuments(item).length > 0 && (
                        <p className="mt-1 text-xs text-slate-500">{applicationDocuments(item).length} supporting document(s)</p>
                      )}
                      <button type="button" onClick={() => openCandidate(item)} className="ml-3 text-xs font-bold text-blue-700">Open profile</button>
                      <Link to={`${base}/profile/${item.applicantId}`} className="ml-3 text-xs font-bold text-blue-700">Professional profile</Link>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Shortlisted", "Interview Scheduled", "Selected", "Rejected"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={async () => { await updateApplication(item._id, status); await openApplicants(selected); }}
                        className={`rounded-lg border px-2 py-1 text-[11px] font-bold ${item.status === status ? "bg-slate-950 text-white" : "bg-white"}`}
                      >
                        {status}
                      </button>
                    ))}
                    <textarea
                      defaultValue={item.recruiterNote || ""}
                      placeholder="Recruiter note"
                      className="w-full min-w-[12rem] rounded-lg border px-2 py-1 text-xs"
                      onBlur={async (event) => {
                        await updateApplication(item._id, item.status, { recruiterNote: event.target.value });
                      }}
                    />
                    <input
                      type="datetime-local"
                      className="rounded-lg border px-2 py-1 text-[11px]"
                      onChange={async (event) => {
                        if (!event.target.value) return;
                        await updateApplication(item._id, "Interview Scheduled", { interviewAt: event.target.value });
                        await openApplicants(selected);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {!applications.length && <p className="text-sm text-slate-500">No applications yet.</p>}
          </div>
        </section>
      )}
      {active && (
        <section className="rounded-2xl border bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-black">Applicant dossier</h2>
            <button type="button" onClick={() => setActive(null)} className="text-xs font-bold">Close</button>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Avatar name={active.applicant?.name || active.name} src={active.applicant?.profileImage || active.snapshot?.profileImage} size="lg" />
            <div>
              <p className="text-xl font-black">{active.applicant?.name || active.name}</p>
              <p className="text-sm text-slate-500">{active.applicant?.headline || active.snapshot?.headline || active.applicant?.role}</p>
              <p className="text-xs text-slate-500">{active.email}</p>
            </div>
          </div>
          <p className="mt-4 text-sm"><span className="font-semibold">Skills:</span> {(active.snapshot?.skills || active.skills || []).join(", ") || "—"}</p>
          <p className="mt-2 text-sm"><span className="font-semibold">Experience:</span> {active.experienceYears || 0} yrs · {formatMixed(active.snapshot?.experience || active.experience) || "—"}</p>
          <p className="mt-2 text-sm"><span className="font-semibold">Education:</span> {formatMixed(active.snapshot?.education || active.education || active.applicant?.education) || "—"}</p>
          <p className="mt-2 text-sm"><span className="font-semibold">Certifications:</span> {formatMixed(active.snapshot?.certifications || active.certifications || active.applicant?.certifications) || "—"}</p>
          {(active.snapshot?.projects || active.applicant?.projects || []).length > 0 && (
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
              {(active.snapshot?.projects || active.applicant?.projects || []).map((project, index) => (
                <li key={index}>{project.title || project.name}{project.summary ? ` — ${project.summary}` : ""}</li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <button type="button" onClick={() => openSigned((download) => getApplicationResume(active._id, download))} className="font-bold text-blue-700">Preview resume</button>
            <button type="button" onClick={() => openSigned((download) => getApplicationResume(active._id, download), { download: true })} className="font-bold text-blue-700">Download resume</button>
            <Link to={`${base}/profile/${active.applicantId}`} className="font-bold text-blue-700">Open live profile</Link>
          </div>
          {applicationDocuments(active).length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {applicationDocuments(active).map((doc, index) => (
                <li key={doc.index ?? index}>
                  {doc.name || doc.fileName}
                  {" · "}
                  <button type="button" className="font-bold text-blue-700" onClick={() => openSigned(() => getApplicationDocument(active._id, doc.index ?? index, false))}>Preview</button>
                  {" · "}
                  <button type="button" className="font-bold text-blue-700" onClick={() => openSigned(() => getApplicationDocument(active._id, doc.index ?? index, true), { download: true })}>Download</button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-slate-500">Opening this dossier locks the submitted snapshot so the applicant cannot change it.</p>
        </section>
      )}
    </div>
  );
}

export default JobManagement;
