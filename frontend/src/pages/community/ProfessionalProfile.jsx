import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { getPublicProfile, requestConnection, toggleFollow, listFollows } from "../../api/communityApi";
import { formatMixed } from "../../utils/applicationDisplay";
import { openConversation } from "../../api/chatApi";
import { useAuthContext } from "../../context/AuthContext";
import { updateCurrentUser } from "../../api/userApi";
import { workspaceBase } from "../../utils/workspace";
import Avatar from "../../components/common/Avatar";
import ResumeUpload from "../../components/jobs/ResumeUpload";
import QuotedPost from "../../components/community/QuotedPost";
import PostMedia from "../../components/community/PostMedia";

function ProfessionalProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, restoreSession, loading: authLoading } = useAuthContext();
  const mine = !id || id === "me" || id === user?.id || id === user?._id;
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [relation, setRelation] = useState({});
  const [form, setForm] = useState({ headline: "", bio: "", city: "", organization: "", skills: "", experienceYears: 0, achievements: "" });
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [follows, setFollows] = useState({ followers: [], following: [] });

  useEffect(() => {
    const loadId = mine ? user?.id || user?._id : id;
    if (!loadId) return;
    setError("");
    getPublicProfile(loadId)
      .then((data) => {
        setProfile(data.profile);
        setStats(data.stats || {});
        setPosts(data.posts || []);
        setRelation(data.relation || {});
        const source = mine ? { ...user, ...data.profile } : data.profile;
        setForm({
          headline: source.headline || "",
          bio: source.bio || "",
          city: source.city || "",
          organization: source.organization || "",
          skills: (source.skills || []).join(", "),
          experienceYears: source.experienceYears || 0,
          achievements: (source.achievements || []).map((item) => typeof item === "string" ? item : item?.name).filter(Boolean).join("\n"),
        });
        const followId = data.profile?._id || data.profile?.id || loadId;
        return listFollows({ userId: followId }).catch(() => ({ followers: [], following: [] }));
      })
      .then((followData) => {
        if (followData) setFollows({ followers: followData.followers || [], following: followData.following || [] });
      })
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load profile."));
  }, [id, mine, user]);

  const profileId = profile?._id || profile?.id;

  if (error) return <div className="rounded-xl bg-rose-50 p-4 text-rose-800">{error}</div>;
  if (authLoading || !profile) return <p className="text-slate-500">Loading profile...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-slate-900 to-blue-800" />
        <div className="-mt-10 px-6 pb-6">
          <div className="inline-block rounded-full border-4 border-white"><Avatar name={profile.name} src={profile.profileImage} size="lg" /></div>
          <h1 className="mt-3 text-3xl font-black">{profile.name}</h1>
          {profile.username && <p className="text-sm font-semibold text-blue-700">@{profile.username} · /u/{profile.username}</p>}
          <p className="text-slate-600">{profile.headline || profile.role}</p>
          <p className="mt-1 text-sm text-slate-500">{profile.city || "Location not set"} {profile.department ? `· ${profile.department}` : ""} {profile.organization ? `· ${profile.organization}` : ""} · {profile.availability || "Available"}</p>
          <p className="mt-3 text-sm font-semibold text-slate-500">{stats.connections || 0} connections · {stats.followers || 0} followers · {stats.following || 0} following · {stats.completedWorks || profile.completedWorks || 0} completed works</p>
          {!mine && (
            <div className="mt-4 flex flex-wrap gap-2">
              {relation.connected ? (
                <button type="button" onClick={async () => { try { const data = await openConversation(profileId); navigate(`${workspaceBase(location.pathname)}/inbox?c=${data.conversation._id}`); } catch (requestError) { setError(requestError.response?.data?.message || "Unable to open chat."); } }} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white">Message</button>
              ) : relation.pending ? (
                <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500">{relation.incoming ? "Respond in Network" : "Request pending"}</span>
              ) : (
                <button type="button" onClick={async () => { try { await requestConnection(profileId); setRelation((current) => ({ ...current, pending: true })); } catch (requestError) { setError(requestError.response?.data?.message || "Unable to send connection request."); } }} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white">Connect</button>
              )}
              <button type="button" onClick={async () => { try { const data = await toggleFollow(profileId); setRelation((current) => ({ ...current, following: data.following })); } catch (requestError) { setError(requestError.response?.data?.message || "Unable to update follow."); } }} className="rounded-xl border px-4 py-2 text-sm font-bold">{relation.following ? "Unfollow" : "Follow"}</button>
              <button type="button" onClick={() => navigator.clipboard.writeText(window.location.href)} className="rounded-xl border px-4 py-2 text-sm font-bold">Share profile</button>
            </div>
          )}
        </div>
      </section>
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="font-black">About</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{profile.bio || "No summary yet."}</p>
        <p className="mt-4 text-sm"><span className="font-semibold">Experience:</span> {profile.experienceYears || 0} years{formatMixed(profile.experience) ? ` · ${formatMixed(profile.experience)}` : ""}</p>
        <p className="mt-2 text-sm"><span className="font-semibold">Skills:</span> {(profile.skills || []).join(", ") || "—"}</p>
        {formatMixed(profile.education) ? <p className="mt-2 text-sm"><span className="font-semibold">Education:</span> {formatMixed(profile.education)}</p> : null}
        {formatMixed(profile.certifications) ? <p className="mt-2 text-sm"><span className="font-semibold">Certifications:</span> {formatMixed(profile.certifications)}</p> : null}
        {(profile.achievements || []).length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Achievements</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">{profile.achievements.map((item, index) => <li key={index}>{typeof item === "string" ? item : item?.name || "Achievement"}</li>)}</ul>
          </div>
        )}
      </section>
      {(profile.projects || []).length > 0 && (
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="font-black">Projects</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">{profile.projects.map((item, index) => <li key={index}><span className="font-semibold text-slate-900">{item.title || item.name || "Project"}</span>{item.summary ? ` — ${item.summary}` : ""}</li>)}</ul>
        </section>
      )}
      {(follows.followers.length > 0 || follows.following.length > 0) && (
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="font-black">Followers</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {follows.followers.map((item) => {
                const person = item.follower || item;
                const pid = person._id || person.id;
                return <li key={item._id || pid}><Link className="font-semibold text-blue-700" to={`${workspaceBase(location.pathname)}/profile/${pid}`}>{person.name}</Link></li>;
              })}
              {!follows.followers.length && <li className="text-slate-500">No followers yet.</li>}
            </ul>
          </div>
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="font-black">Following</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {follows.following.map((item) => {
                const person = item.following || item;
                const pid = person._id || person.id;
                return <li key={item._id || pid}><Link className="font-semibold text-blue-700" to={`${workspaceBase(location.pathname)}/profile/${pid}`}>{person.name}</Link></li>;
              })}
              {!follows.following.length && <li className="text-slate-500">Not following anyone yet.</li>}
            </ul>
          </div>
        </section>
      )}
      {posts.length > 0 && (
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="font-black">Posts</h2>
          <ul className="mt-3 space-y-4">
            {posts.slice(0, 8).map((post) => (
              <li key={post._id} className="rounded-xl border border-slate-100 p-3">
                {post.isRepost && <p className="text-[11px] font-bold uppercase text-slate-500">Reposted</p>}
                {post.body ? <p className="text-sm text-slate-700">{post.body}</p> : null}
                {(post.isRepost || post.sharedFrom) ? <QuotedPost original={post.sharedFrom} /> : <PostMedia media={post.media} />}
                <Link to={`/post/${post._id}`} className="mt-2 inline-block text-xs font-bold text-blue-700">Open post</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {mine && (
        <form onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          try {
            await updateCurrentUser({
              ...form,
              skills: form.skills.split(",").map((item) => item.trim()).filter(Boolean),
              achievements: form.achievements.split("\n").map((item) => item.trim()).filter(Boolean),
              experienceYears: Number(form.experienceYears) || 0,
            });
            if (restoreSession) await restoreSession();
          } finally {
            setSaving(false);
          }
        }} className="space-y-3 rounded-2xl border bg-white p-6">
          <h2 className="font-black">Edit professional profile</h2>
          <input value={form.headline} onChange={(event) => setForm({ ...form, headline: event.target.value })} placeholder="Headline" className="w-full rounded-lg border p-3" />
          <input value={form.organization || ""} onChange={(event) => setForm({ ...form, organization: event.target.value })} placeholder="Organization" className="w-full rounded-lg border p-3" />
          <textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} placeholder="About" rows={4} className="w-full rounded-lg border p-3" />
          <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Location" className="w-full rounded-lg border p-3" />
          <input value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })} placeholder="Skills (comma separated)" className="w-full rounded-lg border p-3" />
          <input type="number" min="0" value={form.experienceYears} onChange={(event) => setForm({ ...form, experienceYears: event.target.value })} placeholder="Years of experience" className="w-full rounded-lg border p-3" />
          <ResumeUpload />
          <textarea value={form.achievements} onChange={(event) => setForm({ ...form, achievements: event.target.value })} placeholder="Achievements (one per line)" rows={3} className="w-full rounded-lg border p-3" />
          <button type="submit" disabled={saving} className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving..." : "Save profile"}</button>
        </form>
      )}
    </div>
  );
}

export default ProfessionalProfile;
