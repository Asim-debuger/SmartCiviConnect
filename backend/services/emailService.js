const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const VERIFIED_SENDER = {
  name: "SmartCiviConnect",
  email: "akpal5151@gmail.com",
};

function readEnv(name) {
  const raw = process.env[name];
  if (raw == null || String(raw).trim() === "") return "";
  return String(raw).trim().replace(/^["']|["']$/g, "").trim();
}

function smtpConfig() {
  return {
    host: readEnv("BREVO_SMTP_HOST") || "smtp-relay.brevo.com",
    port: Number(readEnv("BREVO_SMTP_PORT") || 587),
    login: readEnv("BREVO_SMTP_LOGIN"),
    key: readEnv("BREVO_SMTP_KEY") || readEnv("BREVO_API_KEY"),
  };
}

function isSmtpConfigured() {
  const { host, port, login, key } = smtpConfig();
  return Boolean(host && port && login && key);
}

function formatSmtpError(error) {
  const response = error.response || error.responseText || "";
  const code = error.responseCode || error.code || "";
  const pieces = [code, response, error.message].filter(Boolean);
  return `Brevo SMTP: ${[...new Set(pieces)].join(" — ")}`;
}

function resolveSender() {
  return {
    name: readEnv("BREVO_SENDER_NAME") || VERIFIED_SENDER.name,
    email: readEnv("BREVO_SENDER_EMAIL") || VERIFIED_SENDER.email,
  };
}

function supportInbox() {
  return readEnv("SUPPORT_EMAIL") || resolveSender().email;
}

function createTransporter() {
  const { host, port, login, key } = smtpConfig();
  return nodemailer.createTransport({
    host,
    port,
    secure: Number(port) === 465,
    requireTLS: Number(port) === 587,
    auth: {
      user: login,
      pass: key,
    },
  });
}

async function sendEmail({ to, subject, html, replyTo }) {
  console.log("Email sending started");
  const configured = isSmtpConfigured();
  console.log("SMTP configured:", configured);
  if (!configured) {
    throw new Error("Email service is not configured");
  }
  if (!to) {
    throw new Error("Email recipient is required");
  }

  const sender = resolveSender();
  try {
    await createTransporter().sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to,
      subject,
      html,
      replyTo: replyTo || `"${sender.name}" <${sender.email}>`,
    });
  } catch (error) {
    const detail = formatSmtpError(error);
    console.error(detail);
    throw new Error(detail);
  }

  console.log("Email sent successfully");
}

function layout(title, body) {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a"><h2 style="color:#0f766e">${title}</h2>${body}<p style="color:#64748b;font-size:12px;margin-top:24px">SmartCiviConnect civic operations</p></div>`;
}

async function sendPasswordResetEmail(user, link) {
  if (!user?.email) throw new Error("Account email is missing");
  await sendEmail({
    to: user.email,
    subject: "SmartCiviConnect Password Reset",
    html: layout("Reset your password", `<p>Hi ${user.name},</p><p>Use this SmartCiviConnect password reset link. It expires in 1 hour.</p><p><a href="${link}">${link}</a></p><p>If you did not request this, you can ignore this email.</p>`),
  });
}

async function sendWelcomeEmail(user) {
  if (!user?.email) return;
  await sendEmail({
    to: user.email,
    subject: "Welcome to SmartCiviConnect",
    html: layout("Your citizen account is ready", `<p>Hi ${user.name},</p><p>Your SmartCiviConnect account has been created. You can now report civic issues and track every response.</p>`),
  }).catch((error) => console.error("Welcome email failed", error.message));
}

async function sendRoleUpdatedEmail(user) {
  if (!user?.email) return;
  await sendEmail({
    to: user.email,
    subject: "Your SmartCiviConnect role has been updated",
    html: layout("Role updated", `<p>Hi ${user.name},</p><p>Your account role has changed to <strong>${user.role}</strong>.</p>${user.department ? `<p>Department: <strong>${user.department}</strong></p>` : ""}`),
  }).catch((error) => console.error("Role email failed", error.message));
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

function mapsUrlFor(complaint) {
  const location = complaint?.location || {};
  if (location.mapsUrl) return location.mapsUrl;
  if (Number.isFinite(location.latitude) && Number.isFinite(location.longitude)) {
    return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  }
  return "";
}

function mediaSummary(complaint) {
  const items = complaint?.media || complaint?.media || [];
  if (!items.length) return "No image or video attached";
  return items.map((item, index) => {
    const kind = item.resourceType === "video" ? "Video" : "Image";
    return `${kind} ${index + 1}${item.url ? `: ${item.url}` : ""}`;
  }).join("<br/>");
}

function assignmentTemplate({ user, complaint, roleLabel, assignedBy }) {
  const location = complaint?.location || {};
  const mapsUrl = mapsUrlFor(complaint);
  const created = complaint?.createdAt ? new Date(complaint.createdAt).toLocaleString() : "Not recorded";
  const coords = Number.isFinite(location.latitude) && Number.isFinite(location.longitude)
    ? `${location.latitude}, ${location.longitude}`
    : "Not captured";
  const address = location.formattedAddress || location.address || "Address pending reverse geocode";
  const trackingPath = String(roleLabel).toLowerCase().includes("staff") ? "/staff/tasks" : "/officer/complaints";
  const trackingUrl = `${readEnv("FRONTEND_URL") || "http://localhost:5173"}${trackingPath}`;
  const action = String(roleLabel).toLowerCase().includes("staff")
    ? "Review the task, accept it, and begin on-site resolution. Upload evidence as work progresses."
    : "Review the complaint, assign field staff if needed, and supervise resolution through completion.";
  const row = (label, value) => `<tr><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;width:180px;color:#475569;font-size:13px">${label}</td><td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#0f172a">${value}</td></tr>`;

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f8fafc;padding:24px">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
      <div style="background:#0f766e;color:#fff;padding:22px 28px">
        <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.85">SmartCiviConnect operations</p>
        <h1 style="margin:8px 0 0;font-size:22px">Complaint assignment</h1>
      </div>
      <div style="padding:28px">
        <p style="margin:0 0 16px;color:#0f172a">Hello ${escapeHtml(user.name)},</p>
        <p style="margin:0 0 20px;color:#334155">You have been assigned as <strong>${escapeHtml(roleLabel)}</strong> for a civic complaint. Please review the details below and take the required action.</p>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:12px">
          ${row("Complaint ID", `<strong>${escapeHtml(complaint.complaintId)}</strong>`)}
          ${row("Complaint title", escapeHtml(complaint.title))}
          ${row("Issue category", escapeHtml(complaint.category))}
          ${row("Priority", escapeHtml(complaint.priority))}
          ${row("Complete description", escapeHtml(complaint.description))}
          ${row("Live GPS location", escapeHtml(coords))}
          ${row("Formatted address", escapeHtml(address))}
          ${row("Google Maps", mapsUrl ? `<a href="${escapeHtml(mapsUrl)}" style="color:#0f766e;font-weight:700">Open live location</a>` : "Not available")}
          ${row("Attached media", mediaSummary(complaint))}
          ${row("Assigned by", escapeHtml(assignedBy?.name || assignedBy?.role || "Operations"))}
          ${row("Required action", escapeHtml(action))}
        </table>
        <p style="margin:24px 0 0">
          <a href="${escapeHtml(trackingUrl)}" style="display:inline-block;background:#0f766e;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700">Open complaint tracking</a>
        </p>
      </div>
    </div>
  </div>`;
}

async function sendAssignmentEmail(user, complaint, roleLabel, assignedBy) {
  if (!user?.email) return;
  await sendEmail({
    to: user.email,
    subject: `Assignment: ${complaint.complaintId} · ${complaint.title || "Civic complaint"}`,
    html: assignmentTemplate({ user, complaint, roleLabel, assignedBy }),
  }).catch((error) => console.error("Assignment email failed", error.message));
}

async function sendStatusEmail(user, complaint, status) {
  if (!user?.email) return;
  await sendEmail({
    to: user.email,
    subject: `Complaint ${complaint.complaintId} is ${status}`,
    html: layout("Complaint update", `<p>Hi ${user.name},</p><p>Complaint <strong>${complaint.complaintId}</strong> is now <strong>${status}</strong>.</p><p>${complaint.title}</p>`),
  }).catch((error) => console.error("Status email failed", error.message));
}

async function sendPaymentEmail(user, payment) {
  if (!user?.email) return;
  const paid = String(payment.status).toLowerCase() === "paid" || String(payment.status).toLowerCase() === "success";
  const subject = paid ? "Payment successful · SmartCiviConnect" : "SmartCiviConnect payment update";
  const txn = payment.razorpayPaymentId || payment.transactionId || "—";
  const html = paid
    ? layout(
      "Payment successful",
      `<p>Hi ${escapeHtml(user.name)},</p>
       <p>Your workforce payment has been completed.</p>
       <p><strong>Amount:</strong> ₹${escapeHtml(payment.amount)}</p>
       <p><strong>Complaint / task:</strong> ${escapeHtml(payment.complaintId || "Assigned work")}</p>
       <p><strong>Transaction ID:</strong> ${escapeHtml(txn)}</p>
       <p><strong>Internal reference:</strong> ${escapeHtml(payment.transactionId || "")}</p>`,
    )
    : layout("Payment recorded", `<p>Hi ${escapeHtml(user.name)},</p><p>A payment of ₹${escapeHtml(payment.amount)} is now <strong>${escapeHtml(payment.status)}</strong> for ${escapeHtml(payment.complaintId || "your assigned work")}.</p>`);
  await sendEmail({ to: user.email, subject, html }).catch((error) => console.error("Payment email failed", error.message));
}

module.exports = {
  sendEmail,
  supportInbox,
  sendWelcomeEmail,
  sendWelcomeEmail: sendWelcomeEmail,
  sendRoleUpdatedEmail,
  sendRoleChangedEmail: sendRoleUpdatedEmail,
  sendAssignmentEmail,
  sendAssignmentEmail: sendAssignmentEmail,
  sendStatusEmail,
  sendStatusEmail: sendStatusEmail,
  sendPaymentEmail,
  sendPaymentEmail: sendPaymentEmail,
  sendPasswordResetEmail,
  sendPasswordResetEmail: sendPasswordResetEmail,
};
