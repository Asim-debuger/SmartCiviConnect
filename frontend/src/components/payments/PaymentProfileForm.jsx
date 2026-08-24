import { useEffect, useState } from "react";

const empty = { accountHolderName: "", accountNumber: "", ifsc: "", bankName: "", phone: "" };

function PaymentProfileForm({ loadProfile, saveProfile, title = "Payout bank account" }) {
  const [form, setForm] = useState(empty);
  const [meta, setMeta] = useState({ hasProfile: false, verified: false });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    loadProfile()
      .then((data) => {
        if (!active) return;
        const profile = data.profile || {};
        setForm({
          accountHolderName: profile.accountHolderName || "",
          accountNumber: profile.accountNumber || "",
          ifsc: profile.ifsc || "",
          bankName: profile.bankName || "",
          phone: profile.phone || "",
        });
        setMeta({ hasProfile: Boolean(profile.hasProfile), verified: Boolean(profile.verified) });
      })
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load payout details."));
    return () => { active = false; };
  }, [loadProfile]);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const data = await saveProfile(form);
      const profile = data.profile || {};
      setMeta({ hasProfile: Boolean(profile.hasProfile), verified: Boolean(profile.verified) });
      setMessage(profile.verified ? "Payout details saved and verified." : "Payout details saved. An administrator will verify them before settlement.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save payout details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-black">{title}</h2>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${meta.verified ? "bg-emerald-100 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
          {meta.hasProfile ? (meta.verified ? "Verified" : "Pending verification") : "Not on file"}
        </span>
      </div>
      <p className="text-sm text-slate-500">Used only for workforce payouts. Never shown on public or citizen profiles.</p>
      {error && <p className="text-sm text-rose-700">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      <input required minLength={3} value={form.accountHolderName} onChange={(event) => setForm({ ...form, accountHolderName: event.target.value })} placeholder="Account holder name" className="w-full rounded-xl border px-3 py-3" />
      <input required inputMode="numeric" value={form.accountNumber} onChange={(event) => setForm({ ...form, accountNumber: event.target.value })} placeholder="Bank account number" className="w-full rounded-xl border px-3 py-3" />
      <div className="grid gap-3 sm:grid-cols-2">
        <input required value={form.ifsc} onChange={(event) => setForm({ ...form, ifsc: event.target.value.toUpperCase() })} placeholder="IFSC" className="rounded-xl border px-3 py-3" />
        <input required value={form.bankName} onChange={(event) => setForm({ ...form, bankName: event.target.value })} placeholder="Bank name" className="rounded-xl border px-3 py-3" />
      </div>
      <input required inputMode="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Payout mobile (10 digits)" className="w-full rounded-xl border px-3 py-3" />
      <button type="submit" disabled={saving} className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">{saving ? "Saving..." : "Save payout details"}</button>
    </form>
  );
}

export default PaymentProfileForm;
