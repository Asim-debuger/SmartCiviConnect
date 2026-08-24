const { createNotification, notifyRoles, notifyMany } = require("./notificationService");

async function onComplaintCreated(complaint, io) {
  await createNotification({
    userId: complaint.citizenId,
    type: "status",
    title: "Complaint submitted",
    message: `Your complaint ${complaint.complaintId} was created successfully and routed to ${complaint.department || "the civic desk"}.`,
    link: `/citizen/complaint/${complaint.complaintId}`,
    complaintId: complaint.complaintId,
  }, io);
  const adminPayload = {
    type: complaint.priority === "Urgent" || complaint.priority === "High" ? "workload" : "status",
    title: complaint.priority === "Urgent" || complaint.priority === "High" ? "High priority complaint" : "New complaint received",
    message: `${complaint.complaintId}: ${complaint.title}`,
    link: "/admin/complaints",
    complaintId: complaint.complaintId,
  };
  await notifyRoles(["Admin", "Super Admin"], adminPayload, io);
}

async function onDepartmentAssigned(complaint, io) {
  await createNotification({
    userId: complaint.citizenId,
    type: "assignment",
    title: "Department assigned",
    message: `Your complaint ${complaint.complaintId} has been assigned to ${complaint.department} Department.`,
    link: `/citizen/complaint/${complaint.complaintId}`,
    complaintId: complaint.complaintId,
  }, io);
}

async function onOfficerAssigned(complaint, officer, io) {
  await createNotification({
    userId: complaint.citizenId,
    type: "assignment",
    title: "Officer assigned",
    message: `Your complaint ${complaint.complaintId} has been assigned to ${officer?.name || "an officer"}.`,
    link: `/citizen/complaint/${complaint.complaintId}`,
    complaintId: complaint.complaintId,
  }, io);
  if (officer?._id) {
    await createNotification({
      userId: officer._id.toString(),
      type: "assignment",
      title: "New complaint assigned",
      message: `${complaint.complaintId} has been assigned to you.`,
      link: "/officer/complaints",
      complaintId: complaint.complaintId,
    }, io);
  }
}

async function onStaffAssigned(complaint, staff, actorRole, io) {
  await createNotification({
    userId: complaint.citizenId,
    type: "assignment",
    title: "Field worker assigned",
    message: `Staff has been assigned to ${complaint.complaintId}.`,
    link: `/citizen/complaint/${complaint.complaintId}`,
    complaintId: complaint.complaintId,
  }, io);
  if (staff?._id) {
    await createNotification({
      userId: staff._id.toString(),
      type: "task",
      title: "New task assigned",
      message: `You have a new task: ${complaint.complaintId} (${complaint.priority} priority).`,
      link: "/staff/tasks",
      complaintId: complaint.complaintId,
    }, io);
  }
  if (complaint.assignedOfficerId) {
    await createNotification({
      userId: complaint.assignedOfficerId,
      type: "task",
      title: "Staff assigned",
      message: `${staff?.name || "A worker"} was assigned to ${complaint.complaintId}.`,
      link: "/officer/complaints",
      complaintId: complaint.complaintId,
    }, io);
  }
}

async function onStatusForCitizen(complaint, status, io) {
  const map = {
    Verified: { type: "verification", title: "Complaint verified", message: `Your complaint ${complaint.complaintId} has been verified.` },
    Rejected: { type: "rejection", title: "Complaint rejected", message: `Your complaint ${complaint.complaintId} was marked invalid.` },
    Assigned: { type: "assignment", title: "Complaint assigned", message: `Your complaint ${complaint.complaintId} is now with the operations team.` },
    "In Progress": { type: "progress", title: "Work started", message: `Work has started on ${complaint.complaintId}.` },
    "Under Verification": { type: "progress", title: "Completion proof uploaded", message: `Proof was uploaded for ${complaint.complaintId}. It is under verification.` },
    Completed: { type: "completion", title: "Complaint completed", message: `${complaint.complaintId} is completed. Please share feedback.` },
  };
  const payload = map[status];
  if (!payload) return;
  await createNotification({
    userId: complaint.citizenId,
    ...payload,
    link: `/citizen/complaint/${complaint.complaintId}`,
    complaintId: complaint.complaintId,
    type: status === "Completed" ? "feedback" : payload.type,
  }, io);
  if (status === "Completed") {
    await notifyRoles(["Admin", "Super Admin"], {
      type: "payment",
      title: "Payment approval required",
      message: `${complaint.complaintId} is complete. Review workforce payment.`,
      link: "/admin/payments",
      complaintId: complaint.complaintId,
    }, io);
  }
}

module.exports = {
  onComplaintCreated,
  onDepartmentAssigned,
  onOfficerAssigned,
  onStaffAssigned,
  onStatusForCitizen,
  notifyMany,
};
