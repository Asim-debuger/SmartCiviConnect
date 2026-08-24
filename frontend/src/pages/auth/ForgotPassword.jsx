import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosInstance";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to send reset email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-black">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-500">We will email a SmartciviConnect reset link if the account exists.</p>
        {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {message && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="mt-6 w-full rounded-xl border p-3" />
        <button type="submit" disabled={submitting} className="mt-4 w-full rounded-xl bg-teal-700 py-3 font-bold text-white">{submitting ? "Sending..." : "Send reset link"}</button>
        <Link to="/login" className="mt-4 block text-center text-sm font-semibold text-teal-700">Back to login</Link>
      </form>
    </div>
  );
}

export default ForgotPassword;
