function PostMedia({ media = [], documentsLabel = "Document" }) {
  if (!media?.length) return null;
  return (
    <div className="mt-3 grid gap-2">
      {media.map((file) => (
        file.resourceType === "video"
          ? <video key={file.url} src={file.url} controls className="max-h-80 w-full rounded-xl bg-slate-950" />
          : file.resourceType === "image"
            ? <img key={file.url} src={file.url} alt="" className="max-h-80 w-full rounded-xl object-cover" />
            : <a key={file.url} href={file.url} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-blue-700" target="_blank" rel="noreferrer">{file.name || documentsLabel}</a>
      ))}
    </div>
  );
}

export default PostMedia;
