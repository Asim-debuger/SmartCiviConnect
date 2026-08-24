const crypto = require("crypto");

function encryptionKey() {
  const raw = process.env.PAYMENT_DATA_KEY || process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "";
  if (!raw) throw new Error("No key available to encrypt payment profile data");
  return crypto.createHash("sha256").update(String(raw)).digest();
}

function encryptField(value) {
  const plain = String(value || "");
  if (!plain) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

function decryptField(payload) {
  const raw = String(payload || "");
  if (!raw) return "";
  const [ivHex, tagHex, dataHex] = raw.split(":");
  if (!ivHex || !tagHex || !dataHex) return "";
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]).toString("utf8");
}

module.exports = { encryptField, decryptField };
