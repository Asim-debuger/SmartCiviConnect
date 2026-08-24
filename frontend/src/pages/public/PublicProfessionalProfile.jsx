import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getPublicProfessional } from "../../api/publicCatalogApi";
import Avatar from "../../components/common/Avatar";
import { formatMixed } from "../../utils/applicationDisplay";
import { useAuthContext } from "../../context/AuthContext";
import { useAppUser } from "../../context/AppUserContext";
import { workspaceBase } from "../../utils/workspace";

function PublicProfessionalProfile() {
  const { id, username } = useParams();
  const key = id || username;
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { dashboard } = useAppUser();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!key) return;
    getPublicProfessional(key)
      .then((data) => { setProfile(data.profile); setStats(data.stats || {}); })
      .catch((requestError) => setError(requestError.response?.data?.message || "Profile not found."));
  }, [key]);

  if (authLoading) return <p className="px-5 py-16 text-center text-slate-500">Loading profile...</p>;
  if (isAuthenticated && key) {
    return <Navigate to={`${workspaceBase(dashboard)}/profile/${key}`} replace />;
  }
  if (error) return <div className="mx-auto max-w-3xl px-5 py-16 rounded-xl bg-rose-50 p-6 text-rose-800">{error}</div>;
  if (!profile) return <p className="px-5 py-16 text-center text-slate-500">Loading profile...</p>;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="h-24 bg-slate-950" />
        <div className="-mt-8 px-6 pb-8">
          <Avatar name={profile.name} src={profile.profileImage} size="lg" className="border-4 border-white" />
          <h1 className="mt-3 text-3xl font-black">{profile.name}</h1>
          {profile.username && <p className="text-sm font-semibold text-teal-700">@{profile.username}</p>}
          <p className="text-slate-600">{profile.headline || profile.role}</p>
          <p className="mt-2 text-sm text-slate-500">{[profile.city, profile.department, profile.organization].filter(Boolean).join(" · ") || "Location not listed"}</p>
          <p className="mt-3 text-sm font-semibold text-slate-500">{stats.connections || 0} connections · {stats.followers || 0} followers · {stats.completedWorks || 0} completed works</p>
          <p className="mt-4 text-sm leading-6 text-slate-600">{profile.bio || "This professional has not added a public summary yet."}</p>
          <p className="mt-4 text-sm"><span className="font-semibold">Skills:</span> {(profile.skills || []).join(", ") || "—"}</p>
          <p className="mt-2 text-sm"><span className="font-semibold">Experience:</span> {profile.experienceYears || 0} years{formatMixed(profile.experience) ? ` · ${formatMixed(profile.experience)}` : ""}</p>
          {formatMixed(profile.education) ? <p className="mt-2 text-sm"><span className="font-semibold">Education:</span> {formatMixed(profile.education)}</p> : null}
          {formatMixed(profile.certifications) ? <p className="mt-2 text-sm"><span className="font-semibold">Certificates:</span> {formatMixed(profile.certifications)}</p> : null}
          {(profile.projects || []).length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              {profile.projects.map((item, index) => (
                <li key={index}><span className="font-semibold text-slate-900">{item.title || item.name || "Project"}</span>{item.summary ? ` — ${item.summary}` : ""}</li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex gap-3">
            <Link to="/login" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Sign in to connect</Link>
            <Link to="/login" className="rounded-xl border px-4 py-2 text-sm font-bold">Sign in to message</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicProfessionalProfile;
