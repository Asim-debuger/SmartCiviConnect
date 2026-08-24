import { useState } from "react";
import { revokeFileUrl } from "../../api/fileAccess";

function ResumePreview({ fileName, fileType, url, onClose }) {
  const type = String(fileType || fileName || "").toLowerCase();
  const isPdf = type.includes("pdf");
  const isOffice = type.includes("word") || type.includes("msword") || /\.docx?$/i.test(fileName || "");

  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="truncate text-sm font-bold">{fileName || "Resume"}</p>
          <div className="flex gap-2">
            <a href={url} download={fileName || "resume"} className="rounded-lg border px-3 py-1.5 text-xs font-bold">Download</a>
            <button type="button" onClick={onClose} className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-bold text-white">Close</button>
          </div>
        </div>
        {isPdf ? (
          <iframe title={fileName || "Resume preview"} src={url} className="min-h-0 flex-1 bg-slate-100" />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="font-bold text-slate-900">{fileName}</p>
            <p className="max-w-md text-sm text-slate-600">
              {isOffice
                ? "Word files are streamed privately by SmartciviConnect and cannot be previewed in an external viewer. Download the file to open it."
                : "Preview is available for PDF. Download this file to open it on your device."}
            </p>
            <a href={url} download={fileName || "document"} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Download file</a>
          </div>
        )}
      </div>
    </div>
  );
}

export function useSignedFile() {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  async function openSigned(loader, { download = false } = {}) {
    try {
      setError("");
      const data = await loader(download);
      if (!data?.url) throw new Error("File is not available.");
      if (download) {
        const link = document.createElement("a");
        link.href = data.url;
        link.download = data.fileName || "document";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => revokeFileUrl(data.url), 60_000);
        return data;
      }
      if (preview?.url) revokeFileUrl(preview.url);
      setPreview(data);
      return data;
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to open file.");
      return null;
    }
  }

  const modal = preview ? (
    <ResumePreview
      fileName={preview.fileName || preview.name}
      fileType={preview.fileType}
      url={preview.url}
      onClose={() => {
        revokeFileUrl(preview.url);
        setPreview(null);
      }}
    />
  ) : null;

  return { openSigned, modal, error, setError };
}

export default ResumePreview;
