import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getApplication, getApplicationDocument, getApplicationResume, updateApplicationMaterials } from "../../api/jobApi";
import { uploadResume } from "../../api/uploadApi";
import { workspaceBase } from "../../utils/workspace";
import Avatar from "../../components/common/Avatar";
import { useSignedFile } from "../../components/jobs/ResumePreview";
import DocumentUpload from "../../components/jobs/DocumentUpload";
import { applicationDocuments, formatMixed } from "../../utils/applicationDisplay";

function salary(job) {
  if (!job?.salaryMin && !job?.salaryMax) return "Not listed";
  return `₹${job.salaryMin || 0} – ₹${job.salaryMax || "N/A"}`;
}

function ApplicationDetail() {
  const { applicationId } = useParams();
  const location = useLocation();
  const base = workspaceBase(location.pathname);
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { openSigned, modal, error: fileError } = useSignedFile();
  const snapshot = item?.snapshot || {};
  const job = item?.jobId || {};

  async function load() {
    const data = await getApplication(applicationId);
    setItem(data.application);
  }

  useEffect(() => {
    load().catch((requestError) => setError(requestError.response?.data?.message || "Unable to load application."));
  }, [applicationId]);

  const docs = useMemo(() => applicationDocuments(item), [item]);

  if (error) return <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>;
  if (!item) return <p className="text-sm text-slate-500">Loading application…</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {modal}
      <Link to={`${base}/jobs`} className="text-sm font-bold text-blue-700">Back to My applications</Link>
      <article className="rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">My application</p>
        <h1 className="mt-2 text-3xl font-black">{job.title || "Role"}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {job.organization || job.department} · {job.location || "Citywide"} · {job.workplace || "On-site"} · {job.type}
        </p>
        <p className="mt-2 text-sm font-bold">{salary(job)}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{job.description}</p>
        <p className="mt-3 text-xs font-semibold text-slate-400">Skills required: {(job.skillsRequired || []).join(", ") || "—"}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-slate-950 px-3 py-1 font-bold text-white">{item.status}</span>
          <span className="text-slate-500">Applied {new Date(item.createdAt).toLocaleString()}</span>
          {item.locked ? <span className="font-bold text-amber-700">Snapshot locked</span> : <span className="font-bold text-emerald-700">You can still update materials</span>}
        </div>
        {item.interviewAt && <p className="mt-2 text-sm">Interview: {new Date(item.interviewAt).toLocaleString()}</p>}
        {item.recruiterNote && <p className="mt-2 text-sm text-slate-600">Recruiter note: {item.recruiterNote}</p>}
        {item.coverLetter && <p className="mt-3 text-sm text-slate-600"><span className="font-semibold">Cover note:</span> {item.coverLetter}</p>}
      </article>

      <section className="rounded-3xl border bg-white p-6">
        <h2 className="font-black">Submitted profile snapshot</h2>
        <div className="mt-4 flex items-center gap-3">
          <Avatar name={snapshot.name || item.name} src={snapshot.profileImage} />
          <div>
            <p className="font-bold">{snapshot.name || item.name}</p>
            <p className="text-sm text-slate-500">{snapshot.headline || snapshot.role}</p>
          </div>
        </div>
        <p className="mt-3 text-sm"><span className="font-semibold">Skills:</span> {(snapshot.skills || item.skills || []).join(", ") || "—"}</p>
        <p className="mt-2 text-sm"><span className="font-semibold">Experience:</span> {snapshot.experienceYears ?? item.experienceYears ?? 0} yrs · {formatMixed(snapshot.experience || item.experience) || "—"}</p>
        <p className="mt-2 text-sm"><span className="font-semibold">Education:</span> {formatMixed(snapshot.education || item.education) || "—"}</p>
        <p className="mt-2 text-sm"><span className="font-semibold">Certifications:</span> {formatMixed(snapshot.certifications || item.certifications) || "—"}</p>
        {(snapshot.projects || []).length > 0 && (
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
            {snapshot.projects.map((project, index) => <li key={index}>{project.title || project.name}{project.summary ? ` — ${project.summary}` : ""}</li>)}
          </ul>
        )}
        <div className="mt-4 text-sm">
          <p className="font-semibold">Resume submitted: {item.resumeFileName || snapshot.resumeFileName || (item.hasResume ? "On file" : "Not attached")}</p>
          {(item.hasResume || item.resumeFileName || snapshot.resumeFileName) && (
            <div className="mt-2 flex gap-3">
              <button type="button" onClick={() => openSigned((download) => getApplicationResume(item._id, download))} className="font-bold text-blue-700">Preview</button>
              <button type="button" onClick={() => openSigned((download) => getApplicationResume(item._id, download), { download: true })} className="font-bold text-blue-700">Download</button>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="font-semibold">Uploaded documents</p>
          {docs.length ? (
            <ul className="mt-2 space-y-1 text-sm">
              {docs.map((doc, index) => (
                <li key={doc.index ?? doc.fileName ?? index}>
                  {doc.name || doc.fileName}
                  {" · "}
                  <button type="button" className="font-bold text-blue-700" onClick={() => openSigned(() => getApplicationDocument(item._id, doc.index ?? index, false))}>Preview</button>
                  {" · "}
                  <button type="button" className="font-bold text-blue-700" onClick={() => openSigned(() => getApplicationDocument(item._id, doc.index ?? index, true), { download: true })}>Download</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-slate-500">No supporting documents were attached.</p>
          )}
        </div>
        {(fileError) && <p className="mt-2 text-xs text-rose-700">{fileError}</p>}
      </section>

      {item.canUpdate && (
        <section className="rounded-3xl border bg-white p-6">
          <h2 className="font-black">Update application materials</h2>
          <p className="mt-1 text-sm text-slate-500">You can replace the resume and supporting documents until a recruiter reviews this application or the job closes.</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="mt-4 block w-full text-sm"
            disabled={busy}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              setBusy(true);
              try {
                const uploaded = await uploadResume(file);
                await updateApplicationMaterials(item._id, uploaded);
                await load();
              } catch (requestError) {
                setError(requestError.response?.data?.message || requestError.message || "Unable to update application.");
              } finally {
                setBusy(false);
              }
            }}
          />
          <div className="mt-4">
            <DocumentUpload
              disabled={busy}
              onUploaded={async (doc) => {
                setBusy(true);
                try {
                  await updateApplicationMaterials(item._id, { documents: [doc] });
                  await load();
                } catch (requestError) {
                  setError(requestError.response?.data?.message || "Unable to attach document.");
                } finally {
                  setBusy(false);
                }
              }}
            />
          </div>
          {busy && <p className="mt-2 text-xs text-slate-500">Updating…</p>}
        </section>
      )}
    </div>
  );
}

export default ApplicationDetail;
