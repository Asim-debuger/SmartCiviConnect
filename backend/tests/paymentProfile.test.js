const test = require("node:test");
const assert = require("node:assert/strict");

process.env.JWT_SECRET = process.env.JWT_SECRET || "qa-payment-profile-key";

const { encryptField, decryptField } = require("../utils/fieldCrypto");
const { validatePaymentProfileInput } = require("../utils/paymentProfile");

test("payment profile AES-GCM round-trips and is not stored as plaintext", () => {
  const secret = "123456789012345";
  const packed = encryptField(secret);
  assert.notEqual(packed, secret);
  assert.equal(decryptField(packed), secret);
});

test("IFSC and account validation reject spoofed payout details", () => {
  assert.equal(validatePaymentProfileInput({
    accountHolderName: "QA Staff",
    accountNumber: "12345678901",
    ifsc: "SBIN0001234",
    bankName: "State Bank of India",
    phone: "9876543210",
  }).error, undefined);
  assert.ok(validatePaymentProfileInput({
    accountHolderName: "QA Staff",
    accountNumber: "12",
    ifsc: "bad",
    bankName: "Bank",
    phone: "123",
  }).error);
});
