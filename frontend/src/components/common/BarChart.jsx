function BarChart({ items = [], labelKey = "_id", valueKey = "count" }) {
  const max = Math.max(...items.map((item) => Number(item[valueKey] || 0)), 1);
  if (!items.length) {
    return <p className="py-8 text-center text-sm text-slate-500">No data yet.</p>;
  }
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const label = item[labelKey] || "Unknown";
        const value = Number(item[valueKey] || 0);
        return (
          <div key={label}>
            <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
              <span>{label}</span>
              <span>{value}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-teal-600" style={{ width: `${Math.round((value / max) * 100)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BarChart;
