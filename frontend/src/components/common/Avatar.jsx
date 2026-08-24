function isClerkAsset(url) {
  return Boolean(url && /clerk\.com|img\.clerk|clerk\.accounts/i.test(url));
}

export function safeProfileImage(url) {
  if (!url || isClerkAsset(url)) return "";
  return url;
}

export function initialsFromName(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "SC";
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}

function Avatar({ name, src, size = "md", className = "" }) {
  const image = safeProfileImage(src);
  const sizeClass = size === "lg" ? "h-20 w-20 text-2xl" : size === "sm" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm";
  if (image) {
    return <img src={image} alt={name || ""} className={`${sizeClass} rounded-full object-cover ${className}`} />;
  }
  return (
    <div className={`flex items-center justify-center rounded-full bg-slate-900 font-black text-white ${sizeClass} ${className}`} aria-hidden>
      {initialsFromName(name)}
    </div>
  );
}

export default Avatar;
