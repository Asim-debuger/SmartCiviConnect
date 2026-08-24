const mongoose = require("mongoose");

function complaintQuery(id) {
  if (!id) return { _id: null };
  if (mongoose.isValidObjectId(id)) {
    return { $or: [{ _id: id }, { complaintId: id }] };
  }
  return { complaintId: id };
}

module.exports = { complaintQuery };
