import { useEffect, useState } from "react";
import { getPaymentInvoice, listPayments, printInvoiceHtml } from "../../api/platformApi";
import { getMyPaymentProfile, updateMyPaymentProfile } from "../../api/userApi";
import PaymentProfileForm from "../../components/payments/PaymentProfileForm";

function StaffEarnings() {
  const [payments, setPayments] = useState([]);
  const [totals, setTotals] = useState({ paid: 0, monthly: 0, count: 0 });
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    listPayments()
      .then((data) => {
        setPayments(data.payments || []);
        setTotals(data.totals || { paid: 0, monthly: 0, count: 0 });
        setError("");
      })
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load earnings."));
  }, []);

  const pending = payments.filter((item) => ["Pending", "Approved", "OrderCreated", "Initiated"].includes(item.status));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Compensation</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Earnings</h1>
        <p className="mt-2 text-slate-600">Live Razorpay settlement history for your completed field work.</p>
      </header>
      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-950 p-6 text-white">
          <p className="text-sm text-slate-300">Paid total</p>
          <p className="mt-2 text-4xl font-black">₹{totals.paid || 0}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-slate-500">Paid this month</p>
          <p className="mt-2 text-3xl font-black">₹{totals.monthly || 0}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-slate-500">In pipeline</p>
          <p className="mt-2 text-3xl font-black">{pending.length}</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {payments.map((payment) => (
          <div key={payment._id} className="grid gap-3 border-b p-4 last:border-0 sm:grid-cols-[1fr_auto_auto] sm:items-center">
            <div>
              <p className="font-semibold">₹{payment.amount} · {payment.complaintId || payment.purpose}</p>
              <p className="text-xs text-slate-500">{payment.transactionId} {payment.razorpayPaymentId ? `· ${payment.razorpayPaymentId}` : ""}</p>
              <p className="text-xs text-slate-400">{new Date(payment.paidAt || payment.updatedAt || payment.createdAt).toLocaleString()}</p>
            </div>
            <span className="h-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{payment.status}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setSelected(payment)} className="text-[11px] font-bold text-slate-700">Details</button>
              <button type="button" onClick={async () => {
                const data = await getPaymentInvoice(payment._id);
                printInvoiceHtml(data.html);
              }} className="text-[11px] font-bold text-blue-700">Invoice</button>
            </div>
          </div>
        ))}
        {!payments.length && <p className="p-8 text-center text-sm text-slate-500">No payment records yet.</p>}
      </div>
      <PaymentProfileForm loadProfile={getMyPaymentProfile} saveProfile={updateMyPaymentProfile} />
      {selected && (
        <div className="rounded-2xl border bg-slate-50 p-5 text-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-black">Transaction details</h2>
            <button type="button" onClick={() => setSelected(null)} className="text-xs font-bold">Close</button>
          </div>
          <dl className="mt-4 grid gap-2 sm:grid-cols-2">
            <div><dt className="text-slate-500">Status</dt><dd className="font-semibold">{selected.status}</dd></div>
            <div><dt className="text-slate-500">Amount</dt><dd className="font-semibold">₹{selected.amount} {selected.currency || "INR"}</dd></div>
            <div><dt className="text-slate-500">Complaint</dt><dd className="font-semibold">{selected.complaintId || "—"}</dd></div>
            <div><dt className="text-slate-500">Internal txn</dt><dd className="font-semibold">{selected.transactionId || "—"}</dd></div>
            <div><dt className="text-slate-500">Razorpay order</dt><dd className="font-semibold">{selected.razorpayOrderId || "—"}</dd></div>
            <div><dt className="text-slate-500">Razorpay payment</dt><dd className="font-semibold">{selected.razorpayPaymentId || "—"}</dd></div>
          </dl>
        </div>
      )}
    </div>
  );
}

export default StaffEarnings;
