const AuditLog = require("../models/AuditLog");

async function writeAudit({ actorId, action, targetType, targetId, metadata }) {
  try {
    await AuditLog.create({ actorId, action, targetType, targetId, metadata });
  } catch (error) {
    console.error("Audit log failed", error.message);
  }
}

module.exports = { writeAudit };
