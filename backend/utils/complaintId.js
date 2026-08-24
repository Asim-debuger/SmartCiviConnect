const Counter = require("../models/Counter");

async function nextComplaintId() {
  const year = new Date().getFullYear();
  const counter = await Counter.findByIdAndUpdate(
    `complaint-${year}`,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return `SCC-${year}-${String(counter.seq).padStart(5, "0")}`;
}

module.exports = { nextComplaintId };
