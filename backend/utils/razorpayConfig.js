function trimEnv(name) {
  const raw = process.env[name];
  if (raw == null) return "";
  return String(raw).trim().replace(/^["']|["']$/g, "").trim();
}

function razorpayKeyId() {
  return trimEnv("RAZORPAY_KEY_ID");
}

function razorpayKeySecret() {
  return trimEnv("RAZORPAY_KEY_SECRET") || trimEnv("RAZORPAY_SECRET");
}

function razorpayWebhookSecret() {
  return trimEnv("RAZORPAY_WEBHOOK_SECRET") || razorpayKeySecret();
}

function isRazorpayConfigured() {
  return Boolean(razorpayKeyId() && razorpayKeySecret());
}

module.exports = {
  razorpayKeyId,
  razorpayKeySecret,
  razorpayWebhookSecret,
  isRazorpayConfigured,
};
