const crypto = require("crypto");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const { writeAudit } = require("../services/auditService");
const { createNotification } = require("../services/notificationService");
const { sendPaymentEmail } = require("../services/emailService");
const { isRole } = require("../utils/roles");
const { complaintQuery } = require("../utils/complaintQuery");
const { invoiceHtml } = require("../utils/invoiceHtml");
const {
  normalizePaymentStatus,
  publicStatus,
  isPaidStatus,
  workforceAmount,
  toPaise,
} = require("../utils/paymentStatus");
const { razorpayKeyId, razorpayKeySecret, razorpayWebhookSecret, isRazorpayConfigured } = require("../utils/razorpayConfig");
const { toSummary } = require("../utils/paymentProfile");

function pushHistory(payment, status, actorId, note) {
  payment.history = payment.history || [];
  payment.history.push({ status, changedBy: actorId || "system", note });
}

function toClient(payment, { includeSignature = false } = {}) {
  if (!payment) return payment;
  const obj = typeof payment.toObject === "function" ? payment.toObject() : { ...payment };
  obj.status = publicStatus(obj.status);
  obj.receiverId = obj.payeeId;
  obj.payer = obj.payerId || obj.approvedBy || obj.createdBy;
  if (!includeSignature) delete obj.razorpaySignature;
  return obj;
}

function canViewPayment(req, payment) {
  if (isRole(req.auth.role, "Admin", "Super Admin")) return true;
  if (isRole(req.auth.role, "Staff") && String(payment.payeeId) === req.auth.userId) return true;
  return false;
}

async function razorpayRequest(path, body, method = "POST") {
  const key = razorpayKeyId();
  const secret = razorpayKeySecret();
  if (!key || !secret) throw Object.assign(new Error("Razorpay is not configured"), { status: 503 });
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw Object.assign(new Error(data.error?.description || "Razorpay request failed"), { status: 400 });
  return data;
}

function expectedCheckoutSignature(orderId, paymentId) {
  return crypto.createHmac("sha256", razorpayKeySecret()).update(`${orderId}|${paymentId}`).digest("hex");
}

async function markPaid(payment, { orderId, paymentId, signature, actorId, io }) {
  if (isPaidStatus(payment.status)) return payment;
  payment.status = "Paid";
  payment.razorpayOrderId = orderId || payment.razorpayOrderId;
  payment.razorpayPaymentId = paymentId || payment.razorpayPaymentId;
  if (signature) payment.razorpaySignature = signature;
  payment.paidAt = payment.paidAt || new Date();
  if (actorId && actorId !== "webhook") payment.payerId = actorId;
  pushHistory(payment, "Paid", actorId, "Razorpay payment captured");
  await payment.save();
  await createNotification({
    userId: payment.payeeId,
    type: "payment",
    title: "Payment successful",
    message: `₹${payment.amount} for ${payment.complaintId || "your work"} was paid. Txn ${payment.transactionId}.`,
    link: "/staff/earnings",
    complaintId: payment.complaintId,
  }, io);
  const worker = await User.findById(payment.payeeId).select("name email").lean();
  await sendPaymentEmail(worker, payment);
  await writeAudit({
    actorId: actorId || payment.payerId || "razorpay",
    action: "payment.paid",
    targetType: "Payment",
    targetId: String(payment._id),
  });
  return payment;
}

exports.ensureCompletionPayment = async function ensureCompletionPayment(complaint, actorId) {
  if (!complaint?.assignedStaffId || !complaint.complaintId) return null;
  const existing = await Payment.findOne({ complaintId: complaint.complaintId, payeeId: String(complaint.assignedStaffId) });
  if (existing) return existing;
  const amount = workforceAmount(complaint.priority);
  const payment = await Payment.create({
    transactionId: `TXN-${Date.now()}`,
    payeeId: String(complaint.assignedStaffId),
    worker: complaint.assignedStaffId,
    complaint: complaint._id,
    complaintId: complaint.complaintId,
    amount,
    purpose: `Workforce payment for ${complaint.complaintId}`,
    createdBy: actorId,
    receipt: `pay_${complaint.complaintId}_${Date.now()}`,
    status: "Pending",
    history: [{ status: "Pending", changedBy: actorId, note: "Created after work verification" }],
  });
  return payment;
};

exports.listPayments = async (req, res, next) => {
  try {
    let query = {};
    if (isRole(req.auth.role, "Admin", "Super Admin")) query = {};
    else if (isRole(req.auth.role, "Staff")) query = { payeeId: req.auth.userId };
    else {
      return res.status(403).json({ success: false, message: "Payments are only available to staff and administrators" });
    }
    if (req.query.status && req.query.status !== "All") {
      const status = normalizePaymentStatus(req.query.status);
      query.status = status === "Paid"
        ? { $in: ["Paid", "Success"] }
        : status === "OrderCreated"
          ? { $in: ["OrderCreated", "Processing"] }
          : status;
    }
    if (req.query.complaintId) query.complaintId = req.query.complaintId;
    const payments = await Payment.find(query).sort({ createdAt: -1 }).populate("worker", "name email department").lean();
    let payoutByUser = {};
    if (isRole(req.auth.role, "Admin", "Super Admin")) {
      const ids = [...new Set(payments.map((item) => item.payeeId).filter(Boolean))];
      const workers = await User.find({ _id: { $in: ids } }).select("+paymentProfile").lean();
      payoutByUser = Object.fromEntries(workers.map((worker) => [String(worker._id), toSummary(worker.paymentProfile)]));
    }
    const paid = payments.filter((item) => isPaidStatus(item.status));
    const monthly = paid
      .filter((item) => new Date(item.paidAt || item.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, item) => sum + item.amount, 0);
    res.json({
      success: true,
      payments: payments.map((item) => ({
        ...toClient(item, { includeSignature: isRole(req.auth.role, "Admin", "Super Admin") }),
        payout: isRole(req.auth.role, "Admin", "Super Admin") ? payoutByUser[String(item.payeeId)] || toSummary(null) : undefined,
      })),
      totals: { monthly, paid: paid.reduce((sum, item) => sum + item.amount, 0), count: payments.length },
      razorpayEnabled: isRazorpayConfigured(),
    });
  } catch (error) { next(error); }
};

exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("worker", "name email department").lean();
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    if (!canViewPayment(req, payment)) return res.status(403).json({ success: false, message: "Not authorized" });
    res.json({ success: true, payment: toClient(payment, { includeSignature: isRole(req.auth.role, "Admin", "Super Admin") }) });
  } catch (error) { next(error); }
};

exports.createPayment = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Only administrators can create payments" });
    }
    const { payeeId, purpose, complaintId } = req.body;
    if (!payeeId) return res.status(400).json({ success: false, message: "Worker is required" });
    if (!complaintId) return res.status(400).json({ success: false, message: "Completed complaint is required" });
    const worker = await User.findById(payeeId).select("role name email").lean();
    if (!worker || worker.role !== "Staff") return res.status(400).json({ success: false, message: "Payee must be a staff member" });
    const complaint = await Complaint.findOne(complaintQuery(complaintId));
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    if (complaint.status !== "Completed") {
      return res.status(409).json({ success: false, message: "Payments can only be created for completed work" });
    }
    if (String(complaint.assignedStaffId) !== String(payeeId)) {
      return res.status(400).json({ success: false, message: "Selected staff is not assigned to this complaint" });
    }
    const amount = workforceAmount(complaint.priority);
    const duplicate = await Payment.findOne({ complaintId: complaint.complaintId, payeeId: String(payeeId) });
    if (duplicate) {
      return res.status(409).json({ success: false, message: "A payment already exists for this complaint and staff member", payment: toClient(duplicate) });
    }
    const payment = await Payment.create({
      transactionId: `TXN-${Date.now()}`,
      payeeId,
      worker: payeeId,
      amount,
      purpose: purpose || (complaint ? `Workforce payment for ${complaint.complaintId}` : "Workforce payment record"),
      createdBy: req.auth.userId,
      complaint: complaint?._id,
      complaintId: complaint?.complaintId,
      receipt: `pay_${Date.now()}`,
      status: "Pending",
      history: [{ status: "Pending", changedBy: req.auth.userId, note: "Payment record created" }],
    });
    await writeAudit({ actorId: req.auth.userId, action: "payment.create", targetType: "Payment", targetId: String(payment._id) });
    res.status(201).json({ success: true, payment: toClient(payment) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "A payment already exists for this complaint and staff member" });
    }
    next(error);
  }
};

exports.approvePayment = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Only administrators can approve payments" });
    }
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    if (normalizePaymentStatus(payment.status) !== "Pending") {
      return res.status(409).json({ success: false, message: `Cannot approve a payment in ${publicStatus(payment.status)} status` });
    }
    payment.status = "Approved";
    payment.approvedBy = req.auth.userId;
    payment.approvedAt = new Date();
    if (!payment.transactionId) payment.transactionId = `TXN-${Date.now()}`;
    pushHistory(payment, "Approved", req.auth.userId, "Administrator approved payout");
    await payment.save();
    await createNotification({
      userId: payment.payeeId,
      type: "payment",
      title: "Payment approved",
      message: `A payment of ₹${payment.amount} was approved and is ready for Razorpay checkout.`,
      link: "/staff/earnings",
      complaintId: payment.complaintId,
    }, req.app.get("io"));
    await writeAudit({ actorId: req.auth.userId, action: "payment.approve", targetType: "Payment", targetId: String(payment._id) });
    res.json({ success: true, payment: toClient(payment) });
  } catch (error) { next(error); }
};

exports.createOrder = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Only administrators can create Razorpay orders" });
    }
    if (!isRazorpayConfigured()) return res.status(503).json({ success: false, message: "Razorpay is not configured" });
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    const status = normalizePaymentStatus(payment.status);
    if (isPaidStatus(status)) {
      return res.status(409).json({ success: false, message: "This payment is already completed" });
    }
    if (!["Approved", "Failed", "Cancelled", "OrderCreated", "Initiated"].includes(status)) {
      return res.status(409).json({ success: false, message: "Approve the payment before creating a Razorpay order" });
    }
    if (payment.razorpayOrderId && ["OrderCreated", "Initiated"].includes(status)) {
      return res.json({
        success: true,
        order: { id: payment.razorpayOrderId, amount: toPaise(payment.amount), currency: payment.currency || "INR" },
        keyId: razorpayKeyId(),
        payment: toClient(payment),
      });
    }
    const order = await razorpayRequest("/orders", {
      amount: toPaise(payment.amount),
      currency: payment.currency || "INR",
      receipt: String(payment.receipt || payment.transactionId || `pay_${payment._id}`).slice(0, 40),
      notes: {
        paymentId: String(payment._id),
        complaintId: payment.complaintId || "",
        payeeId: payment.payeeId,
      },
    });
    payment.razorpayOrderId = order.id;
    payment.status = "OrderCreated";
    payment.orderCreatedAt = new Date();
    payment.payerId = req.auth.userId;
    pushHistory(payment, "OrderCreated", req.auth.userId, `Razorpay order ${order.id}`);
    await payment.save();
    res.json({
      success: true,
      order: { id: order.id, amount: toPaise(payment.amount), currency: payment.currency || "INR" },
      keyId: razorpayKeyId(),
      payment: toClient(payment),
    });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ success: false, message: error.message });
    next(error);
  }
};

exports.initiatePayment = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Only administrators can initiate checkout" });
    }
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    const status = normalizePaymentStatus(payment.status);
    if (!["OrderCreated", "Initiated"].includes(status)) {
      return res.status(409).json({ success: false, message: "Create a Razorpay order before initiating payment" });
    }
    payment.status = "Initiated";
    payment.initiatedAt = new Date();
    pushHistory(payment, "Initiated", req.auth.userId, "Checkout opened");
    await payment.save();
    res.json({ success: true, payment: toClient(payment) });
  } catch (error) { next(error); }
};

exports.cancelPayment = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Only administrators can cancel checkout" });
    }
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    if (isPaidStatus(payment.status)) {
      return res.status(409).json({ success: false, message: "Paid records cannot be cancelled" });
    }
    const status = normalizePaymentStatus(payment.status);
    if (!["OrderCreated", "Initiated"].includes(status)) {
      return res.json({ success: true, payment: toClient(payment) });
    }
    payment.status = "Cancelled";
    payment.cancelledAt = new Date();
    payment.failureReason = req.body?.reason || "Checkout dismissed";
    pushHistory(payment, "Cancelled", req.auth.userId, payment.failureReason);
    await payment.save();
    res.json({ success: true, payment: toClient(payment) });
  } catch (error) { next(error); }
};

exports.failPayment = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Only administrators can record failed checkout" });
    }
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    if (isPaidStatus(payment.status)) {
      return res.status(409).json({ success: false, message: "Paid records cannot be marked failed" });
    }
    payment.status = "Failed";
    payment.failedAt = new Date();
    payment.failureReason = req.body?.reason || "Razorpay checkout failed";
    pushHistory(payment, "Failed", req.auth.userId, payment.failureReason);
    await payment.save();
    res.json({ success: true, payment: toClient(payment) });
  } catch (error) { next(error); }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Only administrators can verify Razorpay payments" });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Razorpay order, payment id, and signature are required" });
    }
    if (!razorpayKeySecret()) return res.status(503).json({ success: false, message: "Razorpay is not configured" });
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) return res.status(404).json({ success: false, message: "No payment matches this Razorpay order" });
    if (isPaidStatus(payment.status) && payment.razorpayPaymentId === razorpay_payment_id) {
      return res.json({ success: true, payment: toClient(payment), duplicate: true });
    }
    if (isPaidStatus(payment.status)) {
      return res.status(409).json({ success: false, message: "This payment was already completed" });
    }
    const expected = expectedCheckoutSignature(razorpay_order_id, razorpay_payment_id);
    if (expected !== razorpay_signature) {
      payment.status = "Failed";
      payment.failedAt = new Date();
      payment.failureReason = "Invalid Razorpay signature";
      pushHistory(payment, "Failed", req.auth.userId, payment.failureReason);
      await payment.save();
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
    await markPaid(payment, {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      actorId: req.auth.userId,
      io: req.app.get("io"),
    });
    res.json({ success: true, payment: toClient(payment, { includeSignature: true }) });
  } catch (error) { next(error); }
};

exports.refundPayment = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Only administrators can refund payments" });
    }
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    if (!isPaidStatus(payment.status) || !payment.razorpayPaymentId) {
      return res.status(409).json({ success: false, message: "Only completed Razorpay payments can be refunded" });
    }
    const refund = await razorpayRequest(`/payments/${payment.razorpayPaymentId}/refund`, {
      amount: toPaise(payment.amount),
      notes: { paymentId: String(payment._id) },
    });
    payment.status = "Refunded";
    payment.refundedAt = new Date();
    payment.razorpayRefundId = refund.id;
    pushHistory(payment, "Refunded", req.auth.userId, `Refund ${refund.id}`);
    await payment.save();
    await createNotification({
      userId: payment.payeeId,
      type: "payment",
      title: "Payment refunded",
      message: `₹${payment.amount} for ${payment.complaintId || "a task"} was refunded.`,
      link: "/staff/earnings",
      complaintId: payment.complaintId,
    }, req.app.get("io"));
    res.json({ success: true, payment: toClient(payment), refund });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ success: false, message: error.message });
    next(error);
  }
};

exports.webhook = async (req, res) => {
  try {
    const secret = razorpayWebhookSecret();
    if (!secret) return res.status(503).json({ success: false, message: "Razorpay is not configured" });
    const signature = req.headers["x-razorpay-signature"];
    const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(typeof req.body === "string" ? req.body : JSON.stringify(req.body || {}));
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    if (!signature || expected !== signature) {
      return res.status(400).json({ success: false, message: "Invalid webhook signature" });
    }
    const event = JSON.parse(raw.toString("utf8"));
    const entity = event.payload?.payment?.entity || event.payload?.refund?.entity || {};
    const orderId = entity.order_id;
    const paymentId = entity.id;
    if (event.event === "payment.captured" && orderId) {
      const payment = await Payment.findOne({ razorpayOrderId: orderId });
      if (payment && !isPaidStatus(payment.status)) {
        await markPaid(payment, { orderId, paymentId, actorId: "webhook", io: req.app.get("io") });
      }
    }
    if (event.event === "payment.failed" && orderId) {
      const payment = await Payment.findOne({ razorpayOrderId: orderId });
      if (payment && !isPaidStatus(payment.status) && normalizePaymentStatus(payment.status) !== "Refunded") {
        payment.status = "Failed";
        payment.failedAt = new Date();
        payment.failureReason = entity.error_description || "Razorpay payment.failed";
        pushHistory(payment, "Failed", "webhook", payment.failureReason);
        await payment.save();
      }
    }
    if (event.event === "refund.processed" && entity.payment_id) {
      const payment = await Payment.findOne({ razorpayPaymentId: entity.payment_id });
      if (payment && isPaidStatus(payment.status)) {
        payment.status = "Refunded";
        payment.refundedAt = new Date();
        payment.razorpayRefundId = entity.id;
        pushHistory(payment, "Refunded", "webhook", "Razorpay refund.processed");
        await payment.save();
      }
    }
    return res.json({ success: true });
  } catch (error) {
    console.error("Razorpay webhook failed", error.message);
    return res.status(500).json({ success: false, message: "Webhook processing failed" });
  }
};

exports.summary = async (req, res, next) => {
  try {
    if (!isRole(req.auth.role, "Admin", "Super Admin")) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    const [pending, approved, orders, paid, failed, cancelled, refunded] = await Promise.all([
      Payment.aggregate([{ $match: { status: "Pending" } }, { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: "$amount" } } }]),
      Payment.aggregate([{ $match: { status: "Approved" } }, { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: "$amount" } } }]),
      Payment.aggregate([{ $match: { status: { $in: ["OrderCreated", "Initiated", "Processing"] } } }, { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: "$amount" } } }]),
      Payment.aggregate([{ $match: { status: { $in: ["Paid", "Success"] } } }, { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: "$amount" } } }]),
      Payment.countDocuments({ status: "Failed" }),
      Payment.countDocuments({ status: "Cancelled" }),
      Payment.aggregate([{ $match: { status: "Refunded" } }, { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: "$amount" } } }]),
    ]);
    res.json({
      success: true,
      summary: {
        pending: pending[0] || { count: 0, amount: 0 },
        approved: approved[0] || { count: 0, amount: 0 },
        checkout: orders[0] || { count: 0, amount: 0 },
        paid: paid[0] || { count: 0, amount: 0 },
        failed,
        cancelled,
        refunded: refunded[0] || { count: 0, amount: 0 },
      },
      razorpayEnabled: isRazorpayConfigured(),
    });
  } catch (error) { next(error); }
};

function invoicePayload(payment) {
  return {
    invoiceNo: `INV-${payment.transactionId || payment._id}`,
    transactionId: payment.transactionId,
    razorpayPaymentId: payment.razorpayPaymentId,
    razorpayOrderId: payment.razorpayOrderId,
    amount: payment.amount,
    currency: payment.currency || "INR",
    status: publicStatus(payment.status),
    purpose: payment.purpose,
    complaintId: payment.complaintId,
    payee: payment.worker?.name || payment.payeeId,
    email: payment.worker?.email,
    paidAt: payment.paidAt,
    createdAt: payment.createdAt,
    brand: "SmartCiviConnect",
  };
}

exports.invoice = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("worker", "name email").lean();
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    if (!canViewPayment(req, payment)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    if (isRole(req.auth.role, "Citizen", "Officer", "Head Officer")) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    const invoice = invoicePayload(payment);
    res.json({ success: true, invoice, html: invoiceHtml(invoice) });
  } catch (error) { next(error); }
};
