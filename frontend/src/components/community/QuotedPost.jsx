import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import PostMedia from "./PostMedia";

function QuotedPost({ original }) {
  if (!original) {
    return (
      <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        Original post is no longer available.
      </div>
    );
  }

  const author = original.author || {};
  const profileHref = author.username ? `/u/${author.username}` : (author._id ? `/professional/${author._id}` : `/post/${original._id}`);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <div className="flex items-start gap-3 p-3">
        <Avatar name={author.name} src={author.profileImage} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link to={profileHref} className="text-sm font-bold text-slate-900 hover:underline">{author.name || "Member"}</Link>
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Original</span>
          </div>
          {author.headline && <p className="text-xs text-slate-500">{author.headline}</p>}
          {original.body ? <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{original.body}</p> : null}
          <PostMedia media={original.media} />
          {original.linkPreview?.url && (
            <a href={original.linkPreview.url} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-lg border bg-white">
              {original.linkPreview.image && <img src={original.linkPreview.image} alt="" className="max-h-40 w-full object-cover" />}
              <div className="p-3">
                <p className="text-sm font-bold">{original.linkPreview.title}</p>
                <p className="text-xs text-slate-500">{original.linkPreview.description}</p>
              </div>
            </a>
          )}
          {original.link && !original.linkPreview?.url && (
            <a href={original.link} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-bold text-blue-700">{original.link}</a>
          )}
          <Link to={`/post/${original._id}`} className="mt-3 inline-block text-xs font-bold text-blue-700">Open original post</Link>
        </div>
      </div>
    </div>
  );
}

export default QuotedPost;
