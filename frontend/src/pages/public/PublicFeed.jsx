import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { listPublicPosts } from "../../api/publicCatalogApi";
import ShareMenu from "../../components/community/ShareMenu";
import PostMedia from "../../components/community/PostMedia";
import QuotedPost from "../../components/community/QuotedPost";
import { useAuthContext } from "../../context/AuthContext";
import Avatar from "../../components/common/Avatar";
import { timeAgo } from "../../utils/workspace";

function PublicFeed() {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPublicPosts()
      .then((data) => { setPosts(data.posts || []); setError(""); })
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load the public feed."))
      .finally(() => setLoading(false));
  }, []);

  function requireAuth() {
    navigate(`/login?redirect=${encodeURIComponent("/feed")}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Community</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">Public feed</h1>
      <p className="mt-3 text-slate-600">Anyone can browse professional updates. Like, comment, share, and save require an account.</p>
      {error && <div className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      {loading && <p className="mt-8 text-sm text-slate-500">Loading posts...</p>}
      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <article key={post._id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Avatar name={post.author?.name} src={post.author?.profileImage} />
              <div>
                <Link to={`/post/${post._id}`} className="font-bold hover:underline">{post.author?.name}</Link>
                <p className="text-xs text-slate-400">{post.author?.headline || post.author?.role} · {timeAgo(post.createdAt)}</p>
              </div>
            </div>
            {post.body ? <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{post.body}</p> : null}
            {(post.isRepost || post.sharedFrom) ? <QuotedPost original={post.sharedFrom} /> : <PostMedia media={post.media} />}
            {post.linkPreview?.url && (
              <a href={post.linkPreview.url} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-xl border">
                {post.linkPreview.image && <img src={post.linkPreview.image} alt="" className="h-40 w-full object-cover" />}
                <div className="p-3">
                  <p className="text-sm font-bold">{post.linkPreview.title}</p>
                  <p className="text-xs text-slate-500">{post.linkPreview.description}</p>
                </div>
              </a>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-slate-600">
              <button type="button" onClick={requireAuth} className="inline-flex items-center gap-1"><Heart size={16} /> {post.likes?.length || 0}</button>
              <button type="button" onClick={requireAuth} className="inline-flex items-center gap-1"><MessageCircle size={16} /> {post.comments?.length || 0}</button>
              <ShareMenu post={{ ...post, shares: post.shares || 0 }} requireAuth={requireAuth} onRepost={requireAuth} />
              <button type="button" onClick={requireAuth} className="inline-flex items-center gap-1"><Bookmark size={16} /> Save</button>
            </div>
            {!isAuthenticated && <p className="mt-3 text-xs text-slate-500">Sign in to interact with this post.</p>}
          </article>
        ))}
        {!loading && !posts.length && <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">No public posts yet.</p>}
      </div>
      {!isAuthenticated && (
        <div className="mt-8 flex gap-3">
          <Link to="/login?redirect=/feed" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Login</Link>
          <Link to="/register?redirect=/feed" className="rounded-xl border px-4 py-2 text-sm font-bold">Register</Link>
        </div>
      )}
    </div>
  );
}

export default PublicFeed;
