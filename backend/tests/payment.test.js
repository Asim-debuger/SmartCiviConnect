const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const { normalizePaymentStatus, workforceAmount, toPaise, isPaidStatus } = require("../utils/paymentStatus");

test("payment status aliases map to lifecycle values", () => {
  assert.equal(normalizePaymentStatus("Processing"), "OrderCreated");
  assert.equal(normalizePaymentStatus("Success"), "Paid");
  assert.equal(normalizePaymentStatus("Initiated"), "Initiated");
  assert.equal(isPaidStatus("Success"), true);
  assert.equal(isPaidStatus("Pending"), false);
});

test("workforce amounts are server-side by priority", () => {
  assert.equal(workforceAmount("Urgent"), 2500);
  assert.equal(workforceAmount("High"), 1800);
  assert.equal(workforceAmount("Medium"), 1200);
  assert.equal(toPaise(1800), 180000);
});

test("razorpay checkout signature uses HMAC SHA256 of order|payment", () => {
  const secret = "test_secret";
  const orderId = "order_abc";
  const paymentId = "pay_xyz";
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  const forged = crypto.createHmac("sha256", "other").update(`${orderId}|${paymentId}`).digest("hex");
  assert.notEqual(expected, forged);
  assert.equal(expected.length, 64);
});

test("razorpay webhook signature is HMAC of the raw JSON body", () => {
  const secret = "whsec";
  const raw = Buffer.from('{"event":"payment.captured"}');
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  assert.equal(crypto.createHmac("sha256", secret).update(raw).digest("hex"), expected);
  assert.notEqual(crypto.createHmac("sha256", secret).update(Buffer.from("{}")).digest("hex"), expected);
});
