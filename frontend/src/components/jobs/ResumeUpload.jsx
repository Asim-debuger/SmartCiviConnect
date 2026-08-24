import { useState } from "react";
import { uploadResume } from "../../api/uploadApi";
import { getMyResume, updateCurrentUser } from "../../api/userApi";
import { useAuthContext } from "../../context/AuthContext";
import { useSignedFile } from "./ResumePreview";

function ResumeUpload({ onChange }) {
  const { user, loginSuccess } = useAuthContext();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null);
  const { openSigned, modal, error: fileError } = useSignedFile();
  const hasResume = Boolean(user?.hasResume);
  const uploadedAt = user?.resumeUploadedAt;
  const fileName = user?.resumeFileName;

  function onFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPending(file);
    setError("");
  }

  async function confirmUpload() {
    if (!pending) return;
    setBusy(true);
    setError("");
    try {
      const uploaded = await uploadResume(pending);
      const data = await updateCurrentUser(uploaded);
      if (data.user) loginSuccess({ user: data.user });
      onChange?.(uploaded);
      setPending(null);
    } catch (requestError) {
      setError(requestError.message || requestError.response?.data?.message || "Resume upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
      {modal}
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Resume (PDF, DOC, DOCX · max 5 MB)</p>
      <p className="text-xs text-slate-500">Files are stored privately. Preview and download always go through SmartciviConnect, not a public Cloudinary link.</p>
      <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onFile} disabled={busy} className="block w-full text-sm" />
      {pending && (
        <div className="rounded-lg bg-white p-2 text-xs">
          <p className="font-semibold">{pending.name}</p>
          <p className="text-slate-500">{(pending.size / 1024).toFixed(0)} KB</p>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={confirmUpload} disabled={busy} className="rounded-lg bg-blue-700 px-3 py-1 font-bold text-white disabled:opacity-50">{busy ? "Uploading…" : "Confirm upload"}</button>
            <button type="button" onClick={() => setPending(null)} className="font-bold text-rose-700">Remove</button>
          </div>
        </div>
      )}
      {busy && !pending && <p className="text-xs text-slate-500">Uploading securely…</p>}
      {(error || fileError) && <p className="text-xs text-rose-700">{error || fileError}</p>}
      {hasResume && (
        <p className="text-xs text-slate-600">
          {fileName ? `${fileName} · ` : "Resume on file · "}
          {uploadedAt ? `uploaded ${new Date(uploadedAt).toLocaleString()} · ` : ""}
          <button type="button" onClick={() => openSigned((download) => getMyResume(download))} className="font-bold text-blue-700">View</button>
          {" · "}
          <button type="button" onClick={() => openSigned((download) => getMyResume(download), { download: true })} className="font-bold text-blue-700">Download</button>
        </p>
      )}
    </div>
  );
}

export default ResumeUpload;
