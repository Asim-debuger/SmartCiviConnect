function emitToRoles(io, roles, event, payload) {
  if (!io) return;
  (roles || []).forEach((role) => io.to(`role:${role}`).emit(event, payload));
}

function emitComplaint(io, complaint, extraEvents = []) {
  if (!io || !complaint) return;
  const payload = typeof complaint.toObject === "function" ? complaint.toObject() : complaint;
  const rooms = [`complaint:${payload.complaintId}`];
  if (payload._id) rooms.push(`complaint:${String(payload._id)}`);
  rooms.forEach((room) => {
    io.to(room).emit("complaint:update", payload);
    io.to(room).emit("complaint:updated", payload);
    extraEvents.forEach((event) => io.to(room).emit(event, payload));
  });
  emitToRoles(io, ["Admin", "Super Admin", "Head Officer", "Officer"], "complaint:update", payload);
}

function emitAssignment(io, payload) {
  if (!io) return;
  io.to(`user:${payload.userId}`).emit("assignment:new", payload);
  emitToRoles(io, ["Admin", "Super Admin", "Head Officer"], "assignment:new", payload);
}

function emitLocation(io, payload) {
  if (!io) return;
  const ids = [payload.complaintId, payload.complaintMongoId].filter(Boolean);
  ids.forEach((id) => {
    io.to(`complaint:${id}`).emit("location:update", payload);
    io.to(`complaint:${id}`).emit("location:updated", payload);
  });
  emitToRoles(io, ["Officer", "Head Officer", "Admin", "Super Admin"], "location:update", payload);
}

module.exports = { emitToRoles, emitComplaint, emitAssignment, emitLocation };
