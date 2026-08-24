import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axiosInstance";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post("/auth/reset-password", { token, password });
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to reset password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-black">Set a new password</h1>
        <p className="mt-2 text-sm text-slate-500">Use at least 8 characters with a letter and a number.</p>
        {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {message && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
        <input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="mt-6 w-full rounded-xl border p-3" />
        <button type="submit" disabled={submitting} className="mt-4 w-full rounded-xl bg-teal-700 py-3 font-bold text-white">{submitting ? "Saving..." : "Update password"}</button>
        <Link to="/login" className="mt-4 block text-center text-sm font-semibold text-teal-700">Go to login</Link>
      </form>
    </div>
  );
}

export default ResetPassword;
