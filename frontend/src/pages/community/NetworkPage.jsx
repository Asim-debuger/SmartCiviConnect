import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { listConnections, listPeople, listRecommendations, requestConnection, respondConnection, toggleFollow, removeConnection, listFollows } from "../../api/communityApi";
import { openConversation } from "../../api/chatApi";
import { workspaceBase } from "../../utils/workspace";
import Avatar from "../../components/common/Avatar";

const roles = ["All", "Citizen", "Staff", "Officer", "Head Officer", "Admin"];

function personKey(person) {
  return person?._id || person?.id;
}

function NetworkPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const base = workspaceBase(location.pathname);
  const [people, setPeople] = useState([]);
  const [pending, setPending] = useState([]);
  const [connections, setConnections] = useState([]);
  const [filters, setFilters] = useState({ search: "", role: "All", department: "", skill: "", location: "" });
  const [recommended, setRecommended] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const [dir, net, rec, follows] = await Promise.all([
        listPeople(filters),
        listConnections(),
        listRecommendations().catch(() => ({ people: [] })),
        listFollows().catch(() => ({ followers: [], following: [] })),
      ]);
      setPeople(dir.people || []);
      setPending(net.pending || []);
      setConnections(net.connections || []);
      setRecommended(rec.people || []);
      setFollowers(follows.followers || []);
      setFollowing(follows.following || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load network.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filters.search, filters.role, filters.department, filters.skill, filters.location]);

  async function message(userId) {
    const data = await openConversation(userId);
    navigate(`${base}/inbox?c=${data.conversation._id}`);
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Professional network</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">People discovery</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Find electricians, road officers, and maintenance workers. Connect, follow, then message once accepted.</p>
      </header>
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <div className="grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-5">
        <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search name or headline" className="rounded-xl border px-3 py-2.5" />
        <select value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })} className="rounded-xl border px-3 py-2.5">
          {roles.map((role) => <option key={role}>{role}</option>)}
        </select>
        <input value={filters.department} onChange={(event) => setFilters({ ...filters, department: event.target.value })} placeholder="Department" className="rounded-xl border px-3 py-2.5" />
        <input value={filters.skill} onChange={(event) => setFilters({ ...filters, skill: event.target.value })} placeholder="Skill e.g. electrician" className="rounded-xl border px-3 py-2.5" />
        <input value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} placeholder="Location" className="rounded-xl border px-3 py-2.5" />
      </div>
      {recommended.length > 0 && (
        <section className="rounded-2xl border bg-white p-5">
          <h2 className="font-black">Recommended for you</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recommended.map((person) => (
              <article key={personKey(person)} className="rounded-xl bg-slate-50 p-4">
                <Avatar name={person.name} src={person.profileImage} size="sm" />
                <p className="mt-2 font-bold">{person.name}</p>
                <p className="text-xs text-slate-500">{person.reason}</p>
                <button type="button" onClick={async () => { await requestConnection(personKey(person)); await load(); }} className="mt-3 text-xs font-bold text-blue-700">Connect</button>
              </article>
            ))}
          </div>
        </section>
      )}
      {pending.length > 0 && (
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="font-black">Invitations</h2>
          <div className="mt-4 space-y-3">
            {pending.map((item) => (
              <div key={item._id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="font-semibold">{item.requester?.name}</p>
                  <p className="text-xs text-slate-500">{item.requester?.headline || item.requester?.role}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={async () => { await respondConnection(item._id, "Accepted"); await load(); }} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">Accept</button>
                  <button type="button" onClick={async () => { await respondConnection(item._id, "Rejected"); await load(); }} className="rounded-lg border bg-white px-3 py-1.5 text-xs font-bold">Ignore</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <section>
        <h2 className="font-black">Your connections ({connections.length})</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {connections.map((item) => (
            <article key={item._id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="font-bold">{item.person?.name}</p>
              <p className="text-sm text-slate-500">{item.person?.headline || item.person?.role}</p>
              <button type="button" onClick={() => message(personKey(item.person))} className="mt-3 text-sm font-bold text-blue-700">Message</button>
              <button type="button" onClick={async () => { await removeConnection(item._id); await load(); }} className="ml-3 text-sm font-bold text-slate-500">Remove</button>
            </article>
          ))}
          {!connections.length && !loading && <p className="text-sm text-slate-500">No connections yet. Send a request from Discover.</p>}
        </div>
      </section>
      {(followers.length > 0 || following.length > 0) && (
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5">
            <h2 className="font-black">Followers ({followers.length})</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {followers.map((item) => {
                const person = item.follower || {};
                return <li key={item._id}><Link className="font-semibold text-blue-700" to={`${base}/profile/${personKey(person)}`}>{person.name}</Link></li>;
              })}
            </ul>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <h2 className="font-black">Following ({following.length})</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {following.map((item) => {
                const person = item.following || {};
                return <li key={item._id}><Link className="font-semibold text-blue-700" to={`${base}/profile/${personKey(person)}`}>{person.name}</Link></li>;
              })}
            </ul>
          </div>
        </section>
      )}
      <section>
        <h2 className="font-black">Discover</h2>
        {loading ? <p className="mt-6 text-sm text-slate-500">Finding professionals...</p> : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {people.map((person) => (
              <article key={personKey(person)} className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <Link to={`${base}/profile/${personKey(person)}`} className="flex items-center gap-3">
                  <Avatar name={person.name} src={person.profileImage} />
                  <div>
                    <p className="font-bold hover:underline">{person.name}</p>
                    <p className="text-sm text-slate-500">{person.headline || person.role}</p>
                  </div>
                </Link>
                <p className="mt-3 text-xs text-slate-400">{person.department || "Independent"} · {person.city || "Location hidden"}</p>
                <p className="mt-2 text-xs font-semibold text-slate-500">{(person.skills || []).slice(0, 4).join(" · ") || "No skills listed"}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {person.relation?.connected ? (
                    <button type="button" onClick={() => message(personKey(person))} className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-bold text-white">Message</button>
                  ) : person.relation?.requested ? (
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">Pending</span>
                  ) : (
                    <button type="button" onClick={async () => { await requestConnection(personKey(person)); await load(); }} className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-bold text-white">Connect</button>
                  )}
                  <button type="button" onClick={async () => { await toggleFollow(personKey(person)); await load(); }} className="rounded-lg border px-3 py-1.5 text-xs font-bold">
                    {person.relation?.following ? "Unfollow" : "Follow"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        {!loading && !people.length && <p className="mt-6 rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">No professionals match these filters.</p>}
      </section>
    </div>
  );
}

export default NetworkPage;
