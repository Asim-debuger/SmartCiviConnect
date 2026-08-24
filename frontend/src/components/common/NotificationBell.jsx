import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { deleteNotification, listNotifications, markAllNotificationsRead, markNotificationRead } from "../../api/notificationApi";
import useSocket from "../../hooks/useSocket";
import { resolveAppLink, timeAgo, workspaceBase } from "../../utils/workspace";

function NotificationBell() {
  const socket = useSocket();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [coords, setCoords] = useState(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  async function load() {
    const data = await listNotifications();
    setItems((data.notifications || []).slice(0, 8));
    setUnread(data.unread || 0);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return undefined;
    const onNew = (notification) => {
      setItems((current) => [notification, ...current].slice(0, 8));
      setUnread((count) => count + 1);
    };
    socket.on("notification:new", onNew);
    return () => socket.off("notification:new", onNew);
  }, [socket]);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return undefined;
    function place() {
      const rect = buttonRef.current.getBoundingClientRect();
      const width = Math.min(416, window.innerWidth - 16);
      const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8));
      const top = Math.min(rect.bottom + 8, window.innerHeight - 24);
      setCoords({ top, left, width });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    function onClick(event) {
      if (buttonRef.current?.contains(event.target) || dropdownRef.current?.contains(event.target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const dropdown = open && coords && createPortal(
    <div
      ref={dropdownRef}
      style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width, zIndex: 99999 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="font-bold">Notifications</p>
        <button type="button" disabled={!unread} onClick={async () => { await markAllNotificationsRead(); await load(); }} className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 disabled:opacity-40">
          <CheckCheck size={14} /> Mark all
        </button>
      </div>
      <div className="max-h-[min(24rem,70vh)] overflow-y-auto">
        {items.length ? items.map((item) => (
          <div key={item._id} className={`flex gap-3 border-b px-4 py-3 last:border-0 ${item.read ? "bg-white" : "bg-blue-50/70"}`}>
            <div className="min-w-0 flex-1">
              <Link to={resolveAppLink(item.link, location.pathname)} onClick={async () => { if (!item.read) await markNotificationRead(item._id); setOpen(false); }} className="block">
                <p className="text-sm font-bold text-slate-950">{item.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{item.message}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{item.category} · {timeAgo(item.createdAt)}</p>
              </Link>
            </div>
            <button type="button" onClick={async () => { await deleteNotification(item._id); await load(); }} className="text-slate-400 hover:text-rose-600" aria-label="Delete notification">
              <Trash2 size={14} />
            </button>
          </div>
        )) : <p className="p-8 text-center text-sm text-slate-500">You are all caught up.</p>}
      </div>
      <Link to={`${workspaceBase(location.pathname)}/notifications`} onClick={() => setOpen(false)} className="block bg-slate-50 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-100">
        View notification center
      </Link>
    </div>,
    document.body,
  );

  return (
    <div className="relative">
      <button ref={buttonRef} type="button" onClick={() => setOpen((value) => !value)} className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100" aria-label="Notifications">
        <Bell size={19} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-rose-600 px-1 text-center text-[10px] font-bold leading-5 text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
      {dropdown}
    </div>
  );
}

export default NotificationBell;
