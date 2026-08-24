import { useEffect, useState } from "react";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import ShareMenu from "../../components/community/ShareMenu";
import PostMedia from "../../components/community/PostMedia";
import QuotedPost from "../../components/community/QuotedPost";
import { commentPost, createPost, deletePost, likeComment, likePost, listFeed, listTrending, savePost, sharePost } from "../../api/communityApi";
import { uploadComplaintMedia } from "../../api/uploadApi";
import { timeAgo, workspaceBase } from "../../utils/workspace";
import { Link, useLocation } from "react-router-dom";
import Avatar from "../../components/common/Avatar";

const categories = ["Professional Achievement", "Work Update", "Job Opportunity", "Community Update", "Announcement", "Project"];

function FeedPage() {
  const { user } = useAuthContext();
  const location = useLocation();
  const base = workspaceBase(location.pathname);
  const [posts, setPosts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [body, setBody] = useState("");
  const [kind, setKind] = useState("Community Update");
  const [link, setLink] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [progress, setProgress] = useState("");
  const [comment, setComment] = useState({});
  const [reply, setReply] = useState({});

  async function load(reset = true) {
    try {
      if (!reset) setLoadingMore(true);
      const data = await listFeed({ limit: 8, before: reset ? undefined : cursor });
      setPosts((current) => (reset ? data.posts || [] : [...current, ...(data.posts || [])]));
      setHasMore(Boolean(data.hasMore));
      setCursor(data.nextCursor);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load feed.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    load(true);
    listTrending().then((data) => setTrending(data.posts || [])).catch(() => {});
  }, []);

  useEffect(() => {
    function onScroll() {
      if (!hasMore || loading || loadingMore) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 480) load(false);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, cursor, loading, loadingMore]);

  const FILE_LIMITS = { image: 8 * 1024 * 1024, video: 40 * 1024 * 1024, file: 10 * 1024 * 1024 };

  function chooseFiles(selected) {
    const valid = [];
    for (const file of selected) {
      const limit = file.type.startsWith("video/") ? FILE_LIMITS.video : file.type.startsWith("image/") ? FILE_LIMITS.image : FILE_LIMITS.file;
      if (file.size > limit) {
        setError(`${file.name} is too large.`);
        continue;
      }
      valid.push(file);
    }
    setFiles(valid);
    setPreviews(valid.map((file) => ({
      name: file.name,
      type: file.type,
      url: file.type.startsWith("image/") || file.type.startsWith("video/") ? URL.createObjectURL(file) : "",
    })));
    setConfirming(false);
  }

  async function submit(event) {
    event.preventDefault();
    if (!confirming) {
      if (!body.trim() && !files.length && !link.trim()) {
        setError("Add text, a file, or a link before publishing.");
        return;
      }
      setConfirming(true);
      return;
    }
    setPublishing(true);
    setError("");
    setProgress(files.length ? "Uploading media..." : "Publishing...");
    try {
      const media = files.length ? await uploadComplaintMedia(files, null, (name) => setProgress(`Uploaded ${name}`)) : [];
      await createPost({ body: body.trim(), kind, media, link: link.trim() });
      setBody("");
      setLink("");
      setFiles([]);
      setPreviews([]);
      setConfirming(false);
      await load(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to publish this post.");
    } finally {
      setPublishing(false);
      setProgress("");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Professional feed</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Updates</h1>
        </header>
        {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
        <form onSubmit={submit} className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <Avatar name={user?.name} src={user?.profileImage} size="sm" />
            <p className="text-sm font-semibold">{user?.name}</p>
          </div>
          <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={3} placeholder="Share an achievement, work update, or announcement..." className="w-full rounded-xl border p-3" />
          <input value={link} onChange={(event) => setLink(event.target.value)} placeholder="Optional link" className="mt-3 w-full rounded-xl border px-3 py-2 text-sm" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <select value={kind} onChange={(event) => setKind(event.target.value)} className="rounded-lg border px-3 py-2 text-sm">
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
              <input type="file" accept="image/*,video/*,.pdf,.doc,.docx" multiple onChange={(event) => chooseFiles(Array.from(event.target.files || []))} className="max-w-[12rem] text-xs" />
            </div>
            <div className="flex gap-2">
              {confirming && <button type="button" onClick={() => setConfirming(false)} className="rounded-xl border px-4 py-2 text-sm font-bold">Edit</button>}
              <button type="submit" disabled={publishing} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{publishing ? "Publishing..." : confirming ? "Confirm & publish" : "Review post"}</button>
            </div>
          </div>
          {previews.length > 0 && (
            <div className="mt-4 space-y-2">
              {previews.map((file) => (
                <div key={file.name} className="rounded-xl bg-slate-50 p-3 text-sm">
                  {file.type.startsWith("image/") && file.url && <img src={file.url} alt="" className="mb-2 max-h-48 w-full rounded-lg object-cover" />}
                  {file.type.startsWith("video/") && file.url && <video src={file.url} controls className="mb-2 max-h-48 w-full rounded-lg bg-slate-950" />}
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{file.name}</p>
                    <button type="button" onClick={() => chooseFiles(files.filter((item) => item.name !== file.name))} className="text-xs font-bold text-rose-700">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {progress && <p className="mt-3 text-xs font-semibold text-blue-700">{progress}</p>}
          {confirming && <p className="mt-3 text-xs font-semibold text-slate-500">Review your update, then confirm to publish to the public feed.</p>}
        </form>
        {loading && <p className="text-center text-sm text-slate-500">Loading your professional feed...</p>}
        {posts.map((post) => (
          <article key={post._id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Avatar name={post.author?.name} src={post.author?.profileImage} />
              <div>
                <Link to={`${base}/profile/${post.author?._id}`} className="font-bold hover:underline">{post.author?.name}</Link>
                <p className="text-xs text-slate-400">{post.author?.headline || post.author?.role} · {timeAgo(post.createdAt)}</p>
                {post.sharedFrom && <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Reposted</p>}
              </div>
              <span className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">{post.kind}</span>
            </div>
            {post.recommended && <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-blue-600">Recommended</p>}
            {post.body ? <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{post.body}</p> : null}
            {(post.isRepost || post.sharedFrom) && <QuotedPost original={post.sharedFrom} />}
            {post.linkPreview?.url && !post.sharedFrom && (
              <a href={post.linkPreview.url} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-xl border">
                {post.linkPreview.image && <img src={post.linkPreview.image} alt="" className="max-h-48 w-full object-cover" />}
                <div className="p-3">
                  <p className="text-sm font-bold">{post.linkPreview.title}</p>
                  <p className="text-xs text-slate-500">{post.linkPreview.description}</p>
                </div>
              </a>
            )}
            {post.link && !post.linkPreview?.url && !post.sharedFrom && <a href={post.link} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-bold text-blue-700">{post.link}</a>}
            {!post.sharedFrom && <PostMedia media={post.media} />}
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-slate-600">
              <button type="button" onClick={async () => { await likePost(post._id); await load(true); }} className="inline-flex items-center gap-1"><Heart size={16} /> {post.likes?.length || 0}</button>
              <span className="inline-flex items-center gap-1"><MessageCircle size={16} /> {post.comments?.length || 0}</span>
              <ShareMenu post={{ ...post, shares: post.shares || 0 }} onRepost={async (note) => { await sharePost(post._id, note); await load(true); }} />
              <button type="button" onClick={async () => { await savePost(post._id); await load(true); }} className={`inline-flex items-center gap-1 ${post.saved ? "text-blue-700" : ""}`}><Bookmark size={16} /> {post.saved ? "Saved" : "Save"}</button>
              {(String(post.author?._id) === String(user?.id) || String(post.author?._id) === String(user?._id)) && (
                <button type="button" onClick={async () => { if (window.confirm("Delete this post? The original will stay published.")) { await deletePost(post._id); await load(true); } }} className="text-rose-700">Delete</button>
              )}
            </div>
            <div className="mt-4 space-y-3">
              {(post.comments || []).map((item) => (
                <div key={item._id} className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-sm"><span className="font-semibold">{item.author?.name || "Member"}:</span> {item.body}</p>
                  <button type="button" onClick={async () => { await likeComment(post._id, item._id); await load(true); }} className="mt-1 text-[11px] font-bold text-slate-500">Like {item.likes?.length || 0}</button>
                  {(item.replies || []).map((entry) => (
                    <p key={entry._id} className="mt-2 ml-4 text-xs text-slate-600"><span className="font-semibold">{entry.author?.name}:</span> {entry.body}</p>
                  ))}
                  <form onSubmit={async (event) => { event.preventDefault(); await commentPost(post._id, reply[item._id], item._id); setReply((current) => ({ ...current, [item._id]: "" })); await load(true); }} className="mt-2 flex gap-2">
                    <input value={reply[item._id] || ""} onChange={(event) => setReply((current) => ({ ...current, [item._id]: event.target.value }))} placeholder="Reply" className="flex-1 rounded-lg border px-2 py-1 text-xs" />
                    <button type="submit" className="text-xs font-bold text-blue-700">Reply</button>
                  </form>
                </div>
              ))}
              <form onSubmit={async (event) => { event.preventDefault(); await commentPost(post._id, comment[post._id]); setComment((current) => ({ ...current, [post._id]: "" })); await load(true); }} className="flex gap-2">
                <input value={comment[post._id] || ""} onChange={(event) => setComment((current) => ({ ...current, [post._id]: event.target.value }))} placeholder={`Comment as ${user?.name || "you"}`} className="flex-1 rounded-lg border px-3 py-2 text-sm" />
                <button type="submit" className="text-sm font-bold text-blue-700">Send</button>
              </form>
            </div>
          </article>
        ))}
        {hasMore && <button type="button" onClick={() => load(false)} className="w-full rounded-xl border bg-white py-3 text-sm font-bold">Load more</button>}
        {!loading && !posts.length && <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">Your feed is empty. Connect with professionals or publish the first update.</p>}
      </div>
      <aside className="space-y-4">
        <div className="rounded-2xl border bg-white p-4">
          <h2 className="font-black">Trending</h2>
          <div className="mt-3 space-y-3">
            {trending.map((post) => (
              <p key={post._id} className="text-sm"><span className="font-semibold">{post.author?.name}:</span> {post.body?.slice(0, 72)}</p>
            ))}
            {!trending.length && <p className="text-xs text-slate-500">Trending posts will appear as activity grows.</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default FeedPage;
