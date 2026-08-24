export function workspaceBase(pathname = window.location.pathname) {
  if (pathname.startsWith("/staff")) return "/staff";
  if (pathname.startsWith("/head-officer")) return "/head-officer";
  if (pathname.startsWith("/officer")) return "/officer";
  if (pathname.startsWith("/super-admin") || pathname.startsWith("/admin")) return "/admin";
  return "/citizen";
}

export function resolveAppLink(link, pathname) {
  if (!link) return `${workspaceBase(pathname)}/notifications`;
  if (link.startsWith("/citizen") || link.startsWith("/admin") || link.startsWith("/officer") || link.startsWith("/staff") || link.startsWith("/head-officer") || link.startsWith("/super-admin")) {
    return link;
  }
  const base = workspaceBase(pathname);
  if (link === "/network") return `${base}/network`;
  if (link === "/inbox") return `${base}/inbox`;
  if (link === "/jobs" || link === "/feed") return `${base}${link}`;
  return link;
}

export function timeAgo(value) {
  const date = new Date(value);
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
}
