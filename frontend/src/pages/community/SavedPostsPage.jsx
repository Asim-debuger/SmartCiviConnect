import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listSavedPosts, savePost, sharePost } from "../../api/communityApi";
import { EmptyState, PageSkeleton } from "../../components/common/Skeleton";
import Avatar from "../../components/common/Avatar";
import PostMedia from "../../components/community/PostMedia";
import QuotedPost from "../../components/community/QuotedPost";
import ShareMenu from "../../components/community/ShareMenu";
import { timeAgo } from "../../utils/workspace";

function SavedPostsPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await listSavedPosts();
      setPosts(data.posts || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load saved posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <PageSkeleton />;
  if (error) return <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Library</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Saved posts</h1>
      </header>
      {posts.map((post) => (
        <article key={post._id} className="rounded-2xl border bg-white p-5">
          <div className="flex items-center gap-3">
            <Avatar name={post.author?.name} src={post.author?.profileImage} size="sm" />
            <div>
              <p className="font-bold">{post.author?.name}</p>
              <p className="text-xs text-slate-400">{timeAgo(post.createdAt)}</p>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm">{post.body}</p>
          {(post.isRepost || post.sharedFrom) && <QuotedPost original={post.sharedFrom} />}
          {!post.sharedFrom && !post.isRepost && <PostMedia media={post.media} />}
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Link to={`/post/${post._id}`} className="text-xs font-bold text-blue-700">Open post</Link>
            <ShareMenu post={post} onRepost={async (note) => { await sharePost(post._id, note); }} />
            <button type="button" onClick={async () => { await savePost(post._id); await load(); }} className="text-xs font-bold text-rose-700">Remove save</button>
          </div>
        </article>
      ))}
      {!posts.length && <EmptyState title="No saved posts" body="Bookmark professional updates from the feed to review them later." />}
    </div>
  );
}

export default SavedPostsPage;
