import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listInbox, listMessages, sendMessage } from "../../api/chatApi";
import { uploadComplaintMedia } from "../../api/uploadApi";
import useSocket from "../../hooks/useSocket";
import { useAuthContext } from "../../context/AuthContext";
import { timeAgo } from "../../utils/workspace";
import Avatar from "../../components/common/Avatar";

function InboxPage() {
  const { user } = useAuthContext();
  const socket = useSocket();
  const [params, setParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState({});
  const [error, setError] = useState("");
  const activeId = params.get("c");
  const myId = user?.id || user?._id;

  async function loadInbox() {
    const data = await listInbox();
    setConversations(data.conversations || []);
  }

  async function openThread(id) {
    setParams({ c: id });
    const data = await listMessages(id);
    setMessages(data.messages || []);
    socket?.emit("chat:join", id);
  }

  useEffect(() => { loadInbox().catch((requestError) => setError(requestError.response?.data?.message || "Unable to load inbox.")); }, []);

  useEffect(() => {
    if (activeId) openThread(activeId).catch(() => {});
  }, [activeId]);

  useEffect(() => {
    if (!socket) return undefined;
    const onMessage = (message) => {
      if (String(message.conversation) === String(activeId) || String(message.conversation?._id) === String(activeId)) {
        setMessages((current) => [...current, message]);
      }
      loadInbox().catch(() => {});
    };
    const onTyping = (payload) => {
      if (payload.userId !== myId) setTyping(Boolean(payload.typing));
    };
    const onRead = (payload) => {
      if (String(payload.conversationId) === String(activeId)) {
        setMessages((current) => current.map((message) => (
          message.senderId === myId && !message.readBy?.includes(payload.userId)
            ? { ...message, readBy: [...(message.readBy || []), payload.userId] }
            : message
        )));
      }
    };
    const onOnline = (payload) => setOnline((current) => ({ ...current, [payload.userId]: true }));
    const onOffline = (payload) => setOnline((current) => ({ ...current, [payload.userId]: false }));
    socket.on("chat:message", onMessage);
    socket.on("chat:typing", onTyping);
    socket.on("chat:read", onRead);
    socket.on("presence:online", onOnline);
    socket.on("presence:offline", onOffline);
    return () => {
      socket.off("chat:message", onMessage);
      socket.off("chat:typing", onTyping);
      socket.off("chat:read", onRead);
      socket.off("presence:online", onOnline);
      socket.off("presence:offline", onOffline);
    };
  }, [socket, activeId, myId]);

  const active = useMemo(() => conversations.find((item) => item._id === activeId), [conversations, activeId]);

  async function submit(event) {
    event.preventDefault();
    if (!activeId || !body.trim()) return;
    await sendMessage(activeId, { body });
    setBody("");
    socket?.emit("chat:typing", { conversationId: activeId, typing: false });
  }

  async function shareFile(event) {
    const file = event.target.files?.[0];
    if (!file || !activeId) return;
    const media = await uploadComplaintMedia([file]);
    await sendMessage(activeId, { body: "", attachments: media });
  }

  return (
    <div className="grid min-h-[70vh] overflow-hidden rounded-2xl border bg-white lg:grid-cols-[280px_1fr]">
      <aside className="border-b lg:border-b-0 lg:border-r">
        <div className="border-b p-4">
          <h1 className="text-lg font-black">Messaging</h1>
          <p className="text-xs text-slate-500">Accepted connections only</p>
        </div>
        {error && <p className="p-4 text-sm text-rose-700">{error}</p>}
        {conversations.map((item) => (
          <button key={item._id} type="button" onClick={() => openThread(item._id)} className={`flex w-full items-center gap-3 border-b px-4 py-3 text-left ${item._id === activeId ? "bg-blue-50" : ""}`}>
            <Avatar name={item.other?.name} src={item.other?.profileImage} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-bold">{item.other?.name || "Conversation"}</p>
                {item.unread > 0 && <span className="rounded-full bg-blue-700 px-2 text-[10px] font-bold leading-5 text-white">{item.unread}</span>}
              </div>
              <p className="truncate text-xs text-slate-500">{item.lastMessage || "No messages yet"}</p>
              <p className="mt-1 text-[11px] text-slate-400">{item.other && online[item.other._id] ? "Online" : timeAgo(item.lastAt || item.updatedAt)}</p>
            </div>
          </button>
        ))}
        {!conversations.length && <p className="p-6 text-sm text-slate-500">Start a conversation from Network.</p>}
      </aside>
      <section className="flex min-h-[50vh] flex-col">
        {activeId ? (
          <>
            <div className="border-b px-5 py-4">
              <p className="font-black">{active?.other?.name || "Conversation"}</p>
              {typing && <p className="text-xs text-blue-700">Typing...</p>}
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {messages.map((message) => (
                <div key={message._id} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${message.senderId === myId ? "ml-auto bg-blue-700 text-white" : "bg-slate-100"}`}>
                  <p>{message.body}</p>
                  {(message.attachments || []).map((file) => file.resourceType === "video"
                    ? <video key={file.url} src={file.url} controls className="mt-2 max-h-40 rounded-lg" />
                    : file.resourceType === "image"
                      ? <img key={file.url} src={file.url} alt="" className="mt-2 max-h-40 rounded-lg" />
                      : <a key={file.url} href={file.url} target="_blank" rel="noreferrer" className="mt-2 block text-xs underline">Attachment</a>)}
                  <p className={`mt-1 text-[10px] ${message.senderId === myId ? "text-blue-100" : "text-slate-400"}`}>
                    {timeAgo(message.createdAt)} {message.senderId === myId && (message.readBy?.length > 1 ? "· Read" : "· Sent")}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={submit} className="flex gap-2 border-t p-4">
              <input type="file" onChange={shareFile} className="max-w-[8rem] text-xs" />
              <input value={body} onChange={(event) => { setBody(event.target.value); socket?.emit("chat:typing", { conversationId: activeId, typing: Boolean(event.target.value) }); }} placeholder="Write a message" className="flex-1 rounded-xl border px-3 py-2" />
              <button type="submit" className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white">Send</button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-500">Select a conversation</div>
        )}
      </section>
    </div>
  );
}

export default InboxPage;
