import { useState } from "react";
import { Link2, Mail, Share2 } from "lucide-react";

function postUrl(postId) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/post/${postId}`;
}

function ShareMenu({ post, onRepost, requireAuth }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");
  const url = postUrl(post._id);
  const text = encodeURIComponent(post.body?.slice(0, 140) || "SmartciviConnect update");
  const encoded = encodeURIComponent(url);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title: "SmartciviConnect", text: post.body?.slice(0, 140), url });
      return;
    }
    await copyLink();
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-1" aria-label="Share">
        <Share2 size={16} /> {post.shares || post.shares || 0}
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-2 w-64 rounded-2xl border bg-white p-3 text-xs shadow-xl">
          <p className="font-black text-slate-900">Share</p>
          <div className="mt-2 grid gap-1">
            <button type="button" onClick={copyLink} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50"><Link2 size={14} /> {copied ? "Link copied" : "Copy link"}</button>
            <a href={`https://wa.me/?text=${text}%20${encoded}`} target="_blank" rel="noreferrer" className="rounded-lg px-2 py-1.5 hover:bg-slate-50">WhatsApp</a>
            <a href={`mailto:?subject=${encodeURIComponent("SmartciviConnect post")}&body=${encoded}`} className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"><Mail size={14} /> Email</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`} target="_blank" rel="noreferrer" className="rounded-lg px-2 py-1.5 hover:bg-slate-50">LinkedIn</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`} target="_blank" rel="noreferrer" className="rounded-lg px-2 py-1.5 hover:bg-slate-50">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`} target="_blank" rel="noreferrer" className="rounded-lg px-2 py-1.5 hover:bg-slate-50">X / Twitter</a>
            <button type="button" onClick={nativeShare} className="rounded-lg px-2 py-1.5 text-left hover:bg-slate-50">Device share</button>
          </div>
          <div className="mt-3 border-t pt-2">
            <p className="font-bold text-slate-700">Repost on SmartciviConnect</p>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} placeholder="Optional comment" className="mt-1 w-full rounded-lg border px-2 py-1" />
            <button
              type="button"
              onClick={async () => {
                if (requireAuth) return requireAuth();
                await onRepost(note);
                setNote("");
                setOpen(false);
              }}
              className="mt-2 w-full rounded-lg bg-slate-950 py-1.5 font-bold text-white"
            >
              Repost
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareMenu;
export { postUrl };
