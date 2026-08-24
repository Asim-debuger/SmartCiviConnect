import { useEffect, useState } from "react";
import {
  approvePayment,
  cancelPayment,
  createPayment,
  createPaymentOrder,
  failPayment,
  getPaymentInvoice,
  getPaymentSummary,
  initiatePayment,
  listPayments,
  printInvoiceHtml,
  refundPayment,
  verifyPayment,
} from "../../api/platformApi";
import { getUserPaymentProfile, listUsers, updateUserPaymentProfile } from "../../api/userApi";
import { getAdminComplaints } from "../../api/operationsApi";

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout"));
    document.body.appendChild(script);
  });
}

const FILTERS = ["All", "Pending", "Approved", "OrderCreated", "Initiated", "Paid", "Failed", "Cancelled", "Refunded"];

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState("All");
  const [form, setForm] = useState({ payeeId: "", complaintId: "", purpose: "Workforce payment" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [bankUser, setBankUser] = useState(null);
  const [bankProfile, setBankProfile] = useState(null);
  const [bankBusy, setBankBusy] = useState(false);

  async function load() {
    try {
      const [pay, staff, jobs, totals] = await Promise.all([
        listPayments({ status }),
        listUsers({ role: "Staff" }),
        getAdminComplaints({ status: "Completed" }),
        getPaymentSummary(),
      ]);
      setPayments(pay.payments || []);
      setWorkers(staff.users || []);
      setComplaints(jobs.complaints || []);
      setSummary(totals.summary);
      setRazorpayEnabled(Boolean(pay.razorpayEnabled || totals.razorpayEnabled));
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load payments.");
    }
  }

  useEffect(() => { load(); }, [status]);

  async function submit(event) {
    event.preventDefault();
    try {
      await createPayment(form);
      setForm({ payeeId: "", complaintId: "", purpose: "Workforce payment" });
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create payment.");
    }
  }

  async function openInvoice(id) {
    const data = await getPaymentInvoice(id);
    printInvoiceHtml(data.html);
  }

  async function payWithRazorpay(payment) {
    let settled = false;
    setBusy(payment._id);
    try {
      const Razorpay = await loadRazorpay();
      const data = await createPaymentOrder(payment._id);
      await initiatePayment(payment._id);
      const checkout = new Razorpay({
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "SmartCiviConnect",
        description: payment.purpose || `Workforce payment ${payment.complaintId || ""}`.trim(),
        notes: { complaintId: payment.complaintId || "", paymentId: payment._id },
        handler: async (response) => {
          settled = true;
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await load();
          } catch (verifyError) {
            setError(verifyError.response?.data?.message || "Payment was captured by Razorpay but could not be verified locally. Do not retry until this is checked.");
          }
        },
        modal: {
          ondismiss: async () => {
            if (settled) return;
            await cancelPayment(payment._id, "Checkout dismissed");
            await load();
          },
        },
      });
      checkout.on("payment.failed", async (failed) => {
        settled = true;
        await failPayment(payment._id, failed?.error?.description || "Razorpay checkout failed");
        await load();
      });
      checkout.open();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Razorpay checkout failed.");
    } finally {
      setBusy("");
    }
  }

  const cards = [
    ["Pending", summary?.pending],
    ["Approved", summary?.approved],
    ["Checkout", summary?.checkout],
    ["Paid", summary?.paid],
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Finance</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Workforce payments</h1>
        <p className="mt-2 text-slate-600">
          Approve completed work, then collect a Razorpay settlement. Amounts for complaint-linked records are calculated on the server.
        </p>
        <p className="mt-2 text-xs font-semibold text-slate-500">{razorpayEnabled ? "Razorpay keys loaded from environment (TEST or LIVE)." : "Razorpay is not configured."}</p>
      </header>
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border bg-white p-5">
            <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black">{value?.count || 0}</p>
            <p className="text-sm text-slate-500">₹{value?.amount || 0}</p>
          </div>
        ))}
      </section>
      <p className="text-xs text-slate-500">Failed {summary?.failed || 0} · Cancelled {summary?.cancelled || 0} · Refunded {summary?.refunded?.count || 0}</p>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button key={item} type="button" onClick={() => setStatus(item)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${status === item ? "bg-slate-950 text-white" : "bg-white"}`}>{item}</button>
        ))}
      </div>
      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2 xl:grid-cols-4">
        <select required value={form.payeeId} onChange={(event) => setForm({ ...form, payeeId: event.target.value })} className="rounded-xl border px-3 py-3">
          <option value="">Select staff</option>
          {workers.map((worker) => <option key={worker.id || worker._id} value={worker.id || worker._id}>{worker.name}</option>)}
        </select>
        <select required value={form.complaintId} onChange={(event) => setForm({ ...form, complaintId: event.target.value })} className="rounded-xl border px-3 py-3">
          <option value="">Completed complaint</option>
          {complaints.map((item) => <option key={item._id} value={item.complaintId}>{item.complaintId} · {item.title}</option>)}
        </select>
        <input value={form.purpose} onChange={(event) => setForm({ ...form, purpose: event.target.value })} placeholder="Purpose" className="rounded-xl border px-3 py-3" />
        <button type="submit" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Create pending payment</button>
      </form>
      <p className="text-xs text-slate-500">INR amount is set from complaint priority (Urgent ₹2500, High ₹1800, otherwise ₹1200). It cannot be edited in this form.</p>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Txn</th>
              <th className="px-4 py-3">Staff</th>
              <th className="px-4 py-3">Complaint</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Razorpay</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b last:border-0">
                <td className="px-4 py-3 text-xs">{payment.transactionId || "—"}</td>
                <td className="px-4 py-3">{payment.worker?.name || payment.payeeId}
                  {payment.payout?.hasProfile && (
                    <p className="text-[11px] text-slate-500">••••{payment.payout.last4} · {payment.payout.verified ? "Verified" : "Unverified"}</p>
                  )}
                </td>
                <td className="px-4 py-3">{payment.complaintId || "—"}</td>
                <td className="px-4 py-3 font-bold">₹{payment.amount}</td>
                <td className="px-4 py-3">{payment.status}</td>
                <td className="px-4 py-3 text-xs">{payment.razorpayPaymentId || payment.razorpayOrderId || "—"}</td>
                <td className="px-4 py-3">{new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                  {payment.status === "Pending" && (
                    <button type="button" disabled={busy === payment._id} onClick={async () => { setBusy(payment._id); try { await approvePayment(payment._id); await load(); } finally { setBusy(""); } }} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">Approve</button>
                  )}
                  {["Approved", "Failed", "Cancelled", "OrderCreated", "Initiated"].includes(payment.status) && (
                    <button type="button" disabled={busy === payment._id} onClick={() => payWithRazorpay(payment)} className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-bold text-white">Pay with Razorpay</button>
                  )}
                  {payment.status === "Paid" && (
                    <button type="button" onClick={async () => { if (window.confirm("Refund this Razorpay payment?")) { await refundPayment(payment._id); await load(); } }} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700">Refund</button>
                  )}
                  <button type="button" onClick={() => openInvoice(payment._id)} className="rounded-lg border px-3 py-1.5 text-xs font-bold">Invoice</button>
                  <button type="button" onClick={async () => {
                    try {
                      const data = await getUserPaymentProfile(payment.payeeId);
                      setBankUser(data.user);
                      setBankProfile(data.profile);
                    } catch (requestError) {
                      setError(requestError.response?.data?.message || "Unable to load bank details.");
                    }
                  }} className="rounded-lg border px-3 py-1.5 text-xs font-bold">Bank</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!payments.length && <p className="p-8 text-center text-sm text-slate-500">No payment records in this filter.</p>}
      </div>
      {bankProfile && (
        <div className="rounded-2xl border bg-slate-50 p-5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-black">Workforce payout details · {bankUser?.name}</h2>
            <button type="button" onClick={() => { setBankProfile(null); setBankUser(null); }} className="text-xs font-bold">Close</button>
          </div>
          {bankProfile.hasProfile ? (
            <dl className="mt-4 grid gap-2 sm:grid-cols-2">
              <div><dt className="text-slate-500">Holder</dt><dd className="font-semibold">{bankProfile.accountHolderName}</dd></div>
              <div><dt className="text-slate-500">Account</dt><dd className="font-semibold">{bankProfile.accountNumber}</dd></div>
              <div><dt className="text-slate-500">IFSC</dt><dd className="font-semibold">{bankProfile.ifsc}</dd></div>
              <div><dt className="text-slate-500">Bank</dt><dd className="font-semibold">{bankProfile.bankName}</dd></div>
              <div><dt className="text-slate-500">Phone</dt><dd className="font-semibold">{bankProfile.phone}</dd></div>
              <div><dt className="text-slate-500">Status</dt><dd className="font-semibold">{bankProfile.verified ? "Verified" : "Unverified"}</dd></div>
            </dl>
          ) : (
            <p className="mt-3 text-slate-600">This staff member has not submitted payout details yet.</p>
          )}
          {bankProfile.hasProfile && (
            <button
              type="button"
              disabled={bankBusy}
              onClick={async () => {
                setBankBusy(true);
                try {
                  const data = await updateUserPaymentProfile(bankUser.id, { verified: !bankProfile.verified });
                  setBankProfile(data.profile);
                  await load();
                } finally {
                  setBankBusy(false);
                }
              }}
              className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white"
            >
              {bankProfile.verified ? "Mark unverified" : "Verify bank details"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PaymentManagement;
