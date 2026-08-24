import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axiosInstance";
import { useAuthContext } from "../../context/AuthContext";
import { useAppUser } from "../../context/AppUserContext";
import { dashboardPath } from "../../utils/roles";

function AlreadyLoggedIn({ mode }) {
  const { user, logout } = useAuthContext();
  const { displayRole, portal, dashboard } = useAppUser();
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">You are already logged in</p>
      <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
        {mode === "login" ? "Login is not needed" : "Registration is not needed"}
      </h1>
      <div className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4 text-left text-sm dark:bg-slate-800">
        <p><span className="font-semibold text-slate-500">Name:</span> {user?.name}</p>
        <p><span className="font-semibold text-slate-500">Email:</span> {user?.email}</p>
        <p><span className="font-semibold text-slate-500">Role:</span> {displayRole}</p>
        <p><span className="font-semibold text-slate-500">Current Portal:</span> {portal}</p>
      </div>
      <Link to={dashboard} className="mt-6 block rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-600">
        Go to Dashboard
      </Link>
      <button
        type="button"
        onClick={async () => { await logout(); navigate("/"); }}
        className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold"
      >
        Logout
      </button>
    </div>
  );
}

function AuthEntry({ mode }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { loginSuccess, isAuthenticated, loading } = useAuthContext();
  const isLogin = mode === "login";
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const redirectTo = params.get("redirect");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post(isLogin ? "/auth/login" : "/auth/register", formData);
      loginSuccess(data);
      navigate(redirectTo || dashboardPath(data.user?.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5 dark:bg-slate-950">
        <AlreadyLoggedIn mode={mode} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-md px-5 py-10">
        <div className="rounded-2xl bg-white p-7 shadow-xl dark:bg-slate-900">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{isLogin ? "Login" : "Create Account"}</h1>
          <p className="mt-2 text-sm text-slate-500">SmartciviConnect account</p>
          {error && <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <input name="name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Full name" className="w-full rounded-lg border p-3" required />
            )}
            <input name="email" type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="Email" className="w-full rounded-lg border p-3" required />
            <input name="password" type="password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} placeholder="Password (8+ chars, letter + number)" className="w-full rounded-lg border p-3" minLength={8} required />
            {isLogin && <Link to="/forgot-password" className="block text-right text-sm font-semibold text-teal-700">Forgot password?</Link>}
            <button type="submit" disabled={submitting} className="w-full rounded-lg bg-teal-700 p-3 font-semibold text-white hover:bg-teal-600">
              {submitting ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </form>
          <div className="mt-5 text-center text-sm text-slate-500">
            {isLogin ? (
              <>Don't have an account? <Link to={`/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="ml-1 font-semibold text-teal-700">Register</Link></>
            ) : (
              <>Already have an account? <Link to={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="ml-1 font-semibold text-teal-700">Login</Link></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthEntry;
