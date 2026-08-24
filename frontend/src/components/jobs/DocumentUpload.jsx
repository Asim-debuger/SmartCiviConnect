import { useState } from "react";
import { uploadResume } from "../../api/uploadApi";

function DocumentUpload({ disabled, onUploaded }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null);

  return (
    <div className="space-y-2 rounded-xl border border-dashed border-slate-300 bg-white p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Supporting documents (PDF, DOC, DOCX)</p>
      <input
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        disabled={disabled || busy}
        className="block w-full text-sm"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) {
            setPending(file);
            setError("");
          }
        }}
      />
      {pending && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold">{pending.name}</span>
          <button
            type="button"
            disabled={busy}
            className="rounded-lg bg-blue-700 px-3 py-1 font-bold text-white disabled:opacity-50"
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                const uploaded = await uploadResume(pending);
                onUploaded?.({
                  publicId: uploaded.resumePublicId,
                  fileName: uploaded.resumeFileName,
                  fileType: uploaded.resumeFileType,
                  name: uploaded.resumeFileName,
                  uploadedAt: uploaded.resumeUploadedAt,
                });
                setPending(null);
              } catch (requestError) {
                setError(requestError.response?.data?.message || requestError.message || "Upload failed.");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Uploading…" : "Attach file"}
          </button>
          <button type="button" className="font-bold text-rose-700" onClick={() => setPending(null)}>Remove</button>
        </div>
      )}
      {error && <p className="text-xs text-rose-700">{error}</p>}
    </div>
  );
}

export default DocumentUpload;
