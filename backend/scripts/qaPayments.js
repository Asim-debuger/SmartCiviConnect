const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const crypto = require("crypto");
const API = "http://localhost:5000/api";
const PASSWORD = "QaScc2026!";
const results = [];

async function req(method, path, { token, body, raw, headers: extra } = {}) {
  const headers = { ...(extra || {}) };
  if (!raw) headers["Content-Type"] = headers["Content-Type"] || "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: raw ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 400) }; }
  return { status: res.status, data };
}

function log(name, ok, extra = {}) {
  results.push({ name, ok, ...extra });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${extra.detail ? ` — ${extra.detail}` : ""}`);
}

async function login(email) {
  const { status, data } = await req("POST", "/auth/login", { body: { email, password: PASSWORD } });
  if (status !== 200 || !data.accessToken) throw new Error(`login failed ${email} ${status} ${data.message}`);
  return { token: data.accessToken, user: data.user };
}

async function main() {
  const citizen = await login("qa.citizen.scc@example.com");
  const admin = await login("qa.admin.scc@example.com");
  const staff = await login("qa.staff.scc@example.com");

  const citizenList = await req("GET", "/payments", { token: citizen.token });
  log("citizen blocked from payments", citizenList.status === 403, { detail: String(citizenList.status) });

  const staffList = await req("GET", "/payments", { token: staff.token });
  const staffPays = staffList.data.payments || [];
  const foreign = staffPays.some((p) => String(p.payeeId) !== String(staff.user.id) && String(p.receiverId) !== String(staff.user.id));
  log("staff sees only own payments", staffList.status === 200 && !foreign, {
    detail: `count=${staffPays.length}`,
  });

  const adminList = await req("GET", "/payments", { token: admin.token });
  log("admin lists payments", adminList.status === 200 && Array.isArray(adminList.data.payments), {
    detail: `count=${(adminList.data.payments || []).length} razorpay=${adminList.data.razorpayEnabled}`,
  });

  const summary = await req("GET", "/payments/summary", { token: admin.token });
  log("admin payment summary", summary.status === 200 && Boolean(summary.data.summary), {
    detail: `pending=${summary.data.summary?.pending?.count}`,
  });
  const staffSummary = await req("GET", "/payments/summary", { token: staff.token });
  log("staff blocked from summary", staffSummary.status === 403, { detail: String(staffSummary.status) });

  const pending = (adminList.data.payments || []).find((p) => p.complaintId && ["Pending", "Approved", "Failed", "Cancelled", "OrderCreated", "Initiated"].includes(p.status));
  log("found workforce payment to settle", Boolean(pending), {
    detail: pending ? `${pending.complaintId} ${pending.status} ₹${pending.amount} ${pending._id}` : "none",
  });
  if (!pending) {
    console.log(JSON.stringify({ passed: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, results }, null, 2));
    process.exit(1);
  }

  const staffOther = await req("GET", `/payments/${pending._id}`, { token: staff.token });
  const staffOwns = String(pending.payeeId) === String(staff.user.id) || String(pending.receiverId) === String(staff.user.id);
  log("staff get own payment", staffOwns ? staffOther.status === 200 : staffOther.status === 403, {
    detail: String(staffOther.status),
  });

  const dup = await req("POST", "/payments", {
    token: admin.token,
    body: { payeeId: pending.payeeId, complaintId: pending.complaintId },
  });
  log("duplicate payment protected", dup.status === 409, { detail: `${dup.status} ${dup.data.message}` });

  const noAmount = await req("POST", "/payments", {
    token: admin.token,
    body: { payeeId: pending.payeeId, amount: 999999, purpose: "spoof" },
  });
  log("client amount rejected without complaint", noAmount.status === 400, {
    detail: `${noAmount.status} ${noAmount.data.message}`,
  });

  let approvedStatus = pending.status;
  if (pending.status === "Pending") {
    const approve = await req("POST", `/payments/${pending._id}/approve`, { token: admin.token });
    approvedStatus = approve.data.payment?.status;
    log("admin approve pending", approve.status === 200 && approvedStatus === "Approved", {
      detail: `${approve.status} ${approvedStatus}`,
    });
  } else {
    log("admin approve pending", true, { detail: `already ${pending.status}` });
  }

  const staffApprove = await req("POST", `/payments/${pending._id}/approve`, { token: staff.token });
  log("staff cannot approve", staffApprove.status === 403, { detail: String(staffApprove.status) });

  const order = await req("POST", `/payments/${pending._id}/order`, { token: admin.token });
  log("razorpay order created", order.status === 200 && Boolean(order.data.order?.id) && Boolean(order.data.keyId), {
    detail: `${order.status} ${order.data.order?.id || order.data.message} amount=${order.data.order?.amount}`,
  });

  const initiate = await req("POST", `/payments/${pending._id}/initiate`, { token: admin.token });
  log("payment initiated", initiate.status === 200 && initiate.data.payment?.status === "Initiated", {
    detail: `${initiate.status} ${initiate.data.payment?.status}`,
  });

  const badSig = await req("POST", "/payments/verify", {
    token: admin.token,
    body: {
      razorpay_order_id: order.data.order?.id,
      razorpay_payment_id: "pay_invalid_qa",
      razorpay_signature: "00".repeat(32),
    },
  });
  log("invalid signature fails payment", badSig.status === 400 && /invalid/i.test(String(badSig.data.message || "")), {
    detail: `${badSig.status} ${badSig.data.message}`,
  });

  const afterFail = await req("GET", `/payments/${pending._id}`, { token: admin.token });
  log("db status Failed after bad signature", afterFail.data.payment?.status === "Failed", {
    detail: afterFail.data.payment?.status,
  });

  const reorder = await req("POST", `/payments/${pending._id}/order`, { token: admin.token });
  log("retry order after Failed", reorder.status === 200 && Boolean(reorder.data.order?.id), {
    detail: reorder.data.order?.id || reorder.data.message,
  });

  const cancel = await req("POST", `/payments/${pending._id}/cancel`, { token: admin.token, body: { reason: "QA dismiss" } });
  log("checkout cancel", cancel.status === 200 && cancel.data.payment?.status === "Cancelled", {
    detail: cancel.data.payment?.status,
  });

  const failAgain = await req("POST", `/payments/${pending._id}/order`, { token: admin.token });
  await req("POST", `/payments/${pending._id}/initiate`, { token: admin.token });
  const fail = await req("POST", `/payments/${pending._id}/fail`, { token: admin.token, body: { reason: "QA failed card" } });
  log("checkout fail recorded", fail.status === 200 && fail.data.payment?.status === "Failed", {
    detail: fail.data.payment?.status,
  });

  const webhookBad = await req("POST", "/payments/webhook", {
    raw: true,
    headers: { "Content-Type": "application/json", "x-razorpay-signature": "deadbeef" },
    body: JSON.stringify({ event: "payment.captured", payload: {} }),
  });
  log("webhook rejects bad signature", webhookBad.status === 400, { detail: String(webhookBad.status) });

  const invoice = await req("GET", `/payments/${pending._id}/invoice`, { token: staff.token });
  log("staff invoice html", invoice.status === 200 && /SmartCiviConnect/.test(invoice.data.html || ""), {
    detail: String(invoice.status),
  });
  const citizenInvoice = await req("GET", `/payments/${pending._id}/invoice`, { token: citizen.token });
  log("citizen blocked from invoice", citizenInvoice.status === 403 || citizenInvoice.status === 401, {
    detail: String(citizenInvoice.status),
  });

  const paidOrder = await req("POST", `/payments/${pending._id}/order`, { token: admin.token });
  const orderId = paidOrder.data.order?.id;
  const amountPaise = paidOrder.data.order?.amount;
  const key = String(process.env.RAZORPAY_KEY_ID || "").trim();
  const secret = String(process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET || "").trim();
  let razorpayPaymentId = "";
  if (orderId && key && secret) {
    const auth = Buffer.from(`${key}:${secret}`).toString("base64");
    const s2s = await fetch("https://api.razorpay.com/v1/payments/create/json", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        order_id: orderId,
        email: "qa.admin.scc@example.com",
        contact: "9999999999",
        method: "card",
        card: {
          number: "4111111111111111",
          name: "QA Admin",
          expiry_month: "12",
          expiry_year: "30",
          cvv: "123",
        },
      }),
    });
    const s2sData = await s2s.json();
    razorpayPaymentId = s2sData.razorpay_payment_id || s2sData.id || "";
    log("razorpay test payment create", Boolean(razorpayPaymentId), {
      detail: razorpayPaymentId ? "payment id received" : (s2sData.error?.description || String(s2s.status)),
    });
    if (razorpayPaymentId) {
      const signature = crypto.createHmac("sha256", secret).update(`${orderId}|${razorpayPaymentId}`).digest("hex");
      const verify = await req("POST", "/payments/verify", {
        token: admin.token,
        body: {
          razorpay_order_id: orderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: signature,
        },
      });
      log("verify successful payment", verify.status === 200 && verify.data.payment?.status === "Paid", {
        detail: `${verify.status} ${verify.data.payment?.status || verify.data.message}`,
      });
      const dupVerify = await req("POST", "/payments/verify", {
        token: admin.token,
        body: {
          razorpay_order_id: orderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: signature,
        },
      });
      log("duplicate verify idempotent", dupVerify.status === 200 && dupVerify.data.duplicate === true, {
        detail: `${dupVerify.status} duplicate=${dupVerify.data.duplicate}`,
      });
      const paidRow = await req("GET", `/payments/${pending._id}`, { token: admin.token });
      log("db paid fields stored", Boolean(paidRow.data.payment?.razorpayPaymentId) && paidRow.data.payment?.status === "Paid", {
        detail: `status=${paidRow.data.payment?.status} hasOrder=${Boolean(paidRow.data.payment?.razorpayOrderId)}`,
      });
    }
  } else {
    log("razorpay test payment create", false, { detail: paidOrder.data.message || "order or keys missing" });
  }

  const passed = results.filter((r) => r.ok).length;
  const failedCount = results.filter((r) => !r.ok).length;
  console.log(JSON.stringify({ passed, failed: failedCount }));
  process.exit(failedCount ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
