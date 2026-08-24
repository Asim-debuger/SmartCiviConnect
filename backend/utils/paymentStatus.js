const PAYMENT_STATUSES = [
  "Pending",
  "Approved",
  "OrderCreated",
  "Initiated",
  "Paid",
  "Failed",
  "Cancelled",
  "Refunded",
];

const ALIASES = {
  Processing: "OrderCreated",
  Success: "Paid",
  "Razorpay Order Created": "OrderCreated",
  "Payment Initiated": "Initiated",
  "Payment Completed": "Paid",
};

function normalizePaymentStatus(status) {
  const raw = String(status || "").trim();
  if (ALIASES[raw]) return ALIASES[raw];
  return PAYMENT_STATUSES.includes(raw) ? raw : "Pending";
}

function publicStatus(status) {
  return normalizePaymentStatus(status);
}

function isPaidStatus(status) {
  return normalizePaymentStatus(status) === "Paid";
}

function workforceAmount(priority) {
  if (priority === "Urgent") return 2500;
  if (priority === "High") return 1800;
  return 1200;
}

function toPaise(amount) {
  return Math.round(Number(amount) * 100);
}

module.exports = {
  PAYMENT_STATUSES,
  normalizePaymentStatus,
  publicStatus,
  isPaidStatus,
  workforceAmount,
  toPaise,
};
