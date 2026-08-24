import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { deleteNotification, listNotifications, markAllNotificationsRead, markNotificationRead } from "../../api/notificationApi";
import useSocket from "../../hooks/useSocket";
import { resolveAppLink, timeAgo } from "../../utils/workspace";
import { useAuthContext } from "../../context/AuthContext";
import { normalizeRole } from "../../utils/roles";

function NotificationInbox({ accent = "emerald" }) {
  const { user } = useAuthContext();
  const role = normalizeRole(user?.role);
  const showPayment = ["admin", "super admin", "staff"].includes(role);
  const tabs = [
    { id: "all", label: "All" },
    { id: "complaint", label: "Complaints" },
    { id: "assignment", label: "Assignments" },
    { id: "task", label: "Tasks" },
    { id: "job", label: "Jobs" },
    { id: "application", label: "Applications" },
    { id: "connection", label: "Connections" },
    { id: "post", label: "Posts" },
    { id: "message", label: "Messages" },
    ...(showPayment ? [{ id: "payment", label: "Payments" }] : []),
    { id: "system", label: "System" },
  ];
  const socket = useSocket();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);

  async function load(category = tab) {
    try {
      setLoading(true);
      const data = await listNotifications(category === "all" ? {} : { category });
      setNotifications(data.notifications || []);
      setUnread(data.unread || 0);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(tab); }, [tab]);

  useEffect(() => {
    if (!socket) return undefined;
    const onNew = (notification) => {
      setNotifications((current) => [notification, ...current]);
      setUnread((count) => count + 1);
    };
    socket.on("notification:new", onNew);
    return () => socket.off("notification:new", onNew);
  }, [socket]);

  const visible = useMemo(() => notifications, [notifications]);
  const tone = accent === "blue" ? "text-blue-700" : "text-emerald-700";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className={`text-xs font-bold uppercase tracking-[0.16em] ${tone}`}>Inbox</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Notification center</h1>
          <p className="mt-2 text-slate-600">Assignments, network activity, jobs{showPayment ? ", and payments" : ""} in one professional feed.</p>
        </div>
        <button type="button" disabled={!unread} onClick={async () => { await markAllNotificationsRead(); await load(tab); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold disabled:opacity-40">
          <CheckCheck size={16} /> Mark all read
        </button>
      </header>
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${tab === item.id ? "bg-slate-950 text-white" : "bg-white text-slate-600"}`}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? <p className="p-10 text-center text-sm text-slate-500">Loading notifications...</p> : visible.length ? visible.map((item) => (
          <article key={item._id} className={`flex gap-4 border-b px-5 py-4 last:border-0 ${item.read ? "bg-white" : "bg-sky-50/80"}`}>
            <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.read ? "bg-slate-200" : "bg-blue-600"}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{item.category} · {timeAgo(item.createdAt)}</p>
                </div>
                <button type="button" onClick={async () => { await deleteNotification(item._id); await load(tab); }} className="text-slate-400 hover:text-rose-600" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-3 flex gap-3 text-sm font-bold">
                {item.link && <Link to={resolveAppLink(item.link, location.pathname)} className="text-blue-700">Open</Link>}
                {!item.read && <button type="button" onClick={async () => { await markNotificationRead(item._id); await load(tab); }} className="text-slate-700">Mark read</button>}
              </div>
            </div>
          </article>
        )) : (
          <div className="p-16 text-center">
            <Bell className="mx-auto text-slate-300" />
            <p className="mt-3 font-bold">No notifications in this category</p>
            <p className="mt-1 text-sm text-slate-500">New activity will appear here in real time.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationInbox;
