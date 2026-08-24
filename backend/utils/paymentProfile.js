const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT = /^[0-9]{9,18}$/;
const PHONE = /^[6-9][0-9]{9}$/;

function normalizeIfsc(value) {
  return String(value || "").replace(/\s+/g, "").toUpperCase();
}

function normalizeAccount(value) {
  return String(value || "").replace(/\s+/g, "");
}

function normalizePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

function validatePaymentProfileInput(body) {
  const accountNumber = normalizeAccount(body.accountNumber);
  const accountHolderName = String(body.accountHolderName || "").trim();
  const ifsc = normalizeIfsc(body.ifsc);
  const bankName = String(body.bankName || "").trim();
  const phone = normalizePhone(body.phone);
  if (!accountHolderName || accountHolderName.length < 3 || accountHolderName.length > 80) {
    return { error: "Account holder name must be 3–80 characters" };
  }
  if (!ACCOUNT.test(accountNumber)) {
    return { error: "Bank account number must be 9–18 digits" };
  }
  if (!IFSC.test(ifsc)) {
    return { error: "Enter a valid IFSC code" };
  }
  if (!bankName || bankName.length > 80) {
    return { error: "Bank name is required" };
  }
  if (!PHONE.test(phone)) {
    return { error: "Enter a valid 10-digit Indian mobile number" };
  }
  return { accountNumber, accountHolderName, ifsc, bankName, phone };
}

function maskName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return parts.map((part) => `${part[0]}${"•".repeat(Math.max(2, Math.min(6, part.length - 1)))}`).join(" ") || "—";
}

function toSummary(profile) {
  if (!profile?.last4) {
    return { hasProfile: false, verified: false, last4: "", bankName: "", ifscPrefix: "", holderMasked: "", phone: "" };
  }
  return {
    hasProfile: true,
    verified: Boolean(profile.verified),
    last4: profile.last4,
    bankName: profile.bankNameDisplay || "",
    ifscPrefix: profile.ifscPrefix || "",
    holderMasked: profile.holderMasked || "",
    verifiedAt: profile.verifiedAt || null,
  };
}

module.exports = {
  validatePaymentProfileInput,
  maskName,
  toSummary,
  normalizeIfsc,
  normalizeAccount,
  normalizePhone,
};
