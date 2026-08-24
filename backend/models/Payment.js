const mongoose = require("mongoose");
const { PAYMENT_STATUSES } = require("../utils/paymentStatus");

const historySchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String, trim: true, maxlength: 500 },
  changedBy: String,
}, { timestamps: true, _id: false });

const paymentSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true, sparse: true, index: true },
  payeeId: { type: String, required: true, index: true },
  payerId: { type: String, index: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
  complaintId: { type: String, index: true },
  createdBy: String,
  approvedBy: String,
  amount: { type: Number, required: true, min: 1, max: 500000 },
  currency: { type: String, default: "INR" },
  purpose: { type: String, default: "Workforce payment record" },
  status: {
    type: String,
    enum: [...PAYMENT_STATUSES, "Processing", "Success"],
    default: "Pending",
    index: true,
  },
  paidAt: Date,
  approvedAt: Date,
  orderCreatedAt: Date,
  initiatedAt: Date,
  failedAt: Date,
  cancelledAt: Date,
  refundedAt: Date,
  failureReason: String,
  razorpayOrderId: { type: String, index: true, sparse: true },
  razorpayPaymentId: { type: String, index: true, sparse: true },
  razorpaySignature: String,
  razorpayRefundId: String,
  receipt: String,
  history: { type: [historySchema], default: [] },
}, { timestamps: true });

paymentSchema.index(
  { complaintId: 1, payeeId: 1 },
  { unique: true, partialFilterExpression: { complaintId: { $type: "string" } } },
);

module.exports = mongoose.model("Payment", paymentSchema);
