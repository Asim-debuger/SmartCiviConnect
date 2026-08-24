function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

function money(amount, currency = "INR") {
  const n = Number(amount) || 0;
  return `${currency === "INR" ? "₹" : `${currency} `}${n.toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function invoiceHtml(invoice) {
  const rows = [
    ["Invoice number", invoice.invoiceNo],
    ["Transaction ID", invoice.transactionId],
    ["Razorpay payment ID", invoice.razorpayPaymentId || "—"],
    ["Razorpay order ID", invoice.razorpayOrderId || "—"],
    ["Status", invoice.status],
    ["Staff / receiver", invoice.payee],
    ["Staff email", invoice.email || "—"],
    ["Complaint / task", invoice.complaintId || "—"],
    ["Purpose", invoice.purpose || "Workforce payment"],
    ["Amount", money(invoice.amount, invoice.currency)],
    ["Paid at", formatDate(invoice.paidAt)],
    ["Issued", formatDate(invoice.createdAt)],
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(invoice.invoiceNo)} · SmartCiviConnect</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; margin: 0; background: #f8fafc; }
    .sheet { max-width: 720px; margin: 24px auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
    .brand { background: #042f2e; color: #fff; padding: 28px 32px; display: flex; justify-content: space-between; gap: 16px; }
    .mark { width: 40px; height: 40px; border-radius: 12px; background: #14b8a6; color: #042f2e; font-weight: 800; display: flex; align-items: center; justify-content: center; }
    h1 { margin: 0; font-size: 22px; }
    .muted { color: #94a3b8; font-size: 12px; margin-top: 6px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 12px 32px; border-bottom: 1px solid #e2e8f0; font-size: 14px; vertical-align: top; }
    th { width: 40%; color: #64748b; font-weight: 600; }
    .total { padding: 24px 32px 32px; }
    .total strong { font-size: 28px; }
    .foot { padding: 0 32px 28px; color: #64748b; font-size: 12px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="brand">
      <div style="display:flex;gap:12px;align-items:center">
        <div class="mark">S</div>
        <div>
          <h1>SmartCiviConnect</h1>
          <p class="muted">Civic workforce payment receipt</p>
        </div>
      </div>
      <div style="text-align:right">
        <p style="margin:0;font-size:13px;color:#99f6e4">TAX INVOICE / RECEIPT</p>
        <p style="margin:8px 0 0;font-size:18px;font-weight:700">${escapeHtml(invoice.invoiceNo)}</p>
      </div>
    </div>
    <table>
      ${rows.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("")}
    </table>
    <div class="total">
      <p style="margin:0;color:#64748b;font-size:12px;font-weight:700;letter-spacing:.12em">AMOUNT PAID</p>
      <strong>${escapeHtml(money(invoice.amount, invoice.currency))}</strong>
    </div>
    <p class="foot">This receipt confirms a Razorpay TEST or LIVE settlement recorded by SmartCiviConnect. Switching environments is an API-key change only. Keep this document with the related civic task file.</p>
  </div>
</body>
</html>`;
}

module.exports = { invoiceHtml, money, formatDate };
