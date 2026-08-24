export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="font-black text-slate-900">{title}</p>
      {body && <p className="mt-2 text-sm text-slate-500">{body}</p>}
      {action}
    </div>
  );
}
