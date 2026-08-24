function ComplaintFilter({
  search,
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
}) {
  return (
    <div className="grid gap-4 rounded-xl bg-white p-5 shadow-sm md:grid-cols-3">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by complaint ID or title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
      >
        <option value="All">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Verified">Verified</option>
        <option value="Assigned">Assigned</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Rejected">Rejected</option>
      </select>

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
      >
        <option value="All">All Categories</option>
        <option value="Road Damage">Road Damage</option>
        <option value="Potholes">Potholes</option>
        <option value="Garbage">Garbage</option>
        <option value="Drainage Problems">Drainage Problems</option>
        <option value="Water Leakage">Water Leakage</option>
        <option value="Street Light Problems">Street Light Problems</option>
        <option value="Electricity Problems">Electricity Problems</option>
        <option value="Sewage Issues">Sewage Issues</option>
        <option value="Traffic Problems">Traffic Problems</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
}

export default ComplaintFilter;