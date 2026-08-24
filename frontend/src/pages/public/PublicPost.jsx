import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPublicPost } from "../../api/publicCatalogApi";
import Avatar from "../../components/common/Avatar";
import PostMedia from "../../components/community/PostMedia";
import QuotedPost from "../../components/community/QuotedPost";
import ShareMenu from "../../components/community/ShareMenu";
import { useAuthContext } from "../../context/AuthContext";
import { timeAgo } from "../../utils/workspace";
import { sharePost } from "../../api/communityApi";

function PublicPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicPost(id)
      .then((data) => setPost(data.post))
      .catch((requestError) => setError(requestError.response?.data?.message || "Post not found."));
  }, [id]);

  if (error) return <div className="mx-auto max-w-2xl px-5 py-16 rounded-xl bg-rose-50 p-6 text-rose-800">{error}</div>;
  if (!post) return <p className="px-5 py-16 text-center text-slate-500">Loading post...</p>;

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Link to="/feed" className="text-sm font-bold text-teal-700">Back to feed</Link>
      <article className="mt-4 rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <Avatar name={post.author?.name} src={post.author?.profileImage} />
          <div>
            <p className="font-bold">{post.author?.name}</p>
            <p className="text-xs text-slate-400">{post.author?.headline || post.author?.role} · {timeAgo(post.createdAt)}</p>
          </div>
        </div>
        {post.body ? <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{post.body}</p> : null}
        {(post.isRepost || post.sharedFrom) ? <QuotedPost original={post.sharedFrom} /> : <PostMedia media={post.media} />}
        <div className="mt-4">
          <ShareMenu
            post={post}
            requireAuth={isAuthenticated ? null : () => navigate(`/login?redirect=${encodeURIComponent(`/post/${id}`)}`)}
            onRepost={isAuthenticated
              ? async (note) => { await sharePost(post._id, note); }
              : () => navigate(`/login?redirect=${encodeURIComponent(`/post/${id}`)}`)}
          />
        </div>
      </article>
    </div>
  );
}

export default PublicPost;
