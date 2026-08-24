import { Link } from "react-router-dom";
import { useState } from "react";
import PublicNavbar from "../../layouts/PublicNavbar";
import PublicFooter from "../../layouts/PublicFooter";
import { useAuthContext } from "../../context/AuthContext";
import { useAppUser } from "../../context/AppUserContext";
import api from "../../api/axiosInstance";
import PaymentProfileForm from "../../components/payments/PaymentProfileForm";
import { getMyPaymentProfile, updateMyPaymentProfile } from "../../api/userApi";
import { normalizeRole } from "../../utils/roles";
import ResumeUpload from "../../components/jobs/ResumeUpload";

function Profile() {
  const { user, loginSuccess } = useAuthContext();
  const { dashboard, displayRole, portal } = useAppUser();
  const workforce = ["staff", "officer", "head officer"].includes(normalizeRole(user?.role));
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />
      <main className="flex-1 px-5 py-10">
        <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Account security</p>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Profile</h1>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p><span className="font-semibold">Name:</span> {user?.name}</p>
            <p><span className="font-semibold">Email:</span> {user?.email}</p>
            <p><span className="font-semibold">Username:</span> {user?.username ? `@${user.username}` : "Assigned on next login"}</p>
            <p><span className="font-semibold">Role:</span> {displayRole}</p>
            <p><span className="font-semibold">Portal:</span> {portal}</p>
          </div>
          {["citizen", "staff", "officer", "head officer"].includes(normalizeRole(user?.role)) && (
            <div className="border-t pt-6">
              <h2 className="mb-3 font-black">Resume</h2>
              <ResumeUpload />
            </div>
          )}
          {workforce && (
            <PaymentProfileForm loadProfile={getMyPaymentProfile} saveProfile={updateMyPaymentProfile} />
          )}
          <form
            className="space-y-3 border-t pt-6"
            onSubmit={async (event) => {
              event.preventDefault();
              setError("");
              setMessage("");
              try {
                const { data } = await api.post("/auth/change-password", form);
                loginSuccess(data);
                setMessage(data.message);
                setForm({ currentPassword: "", newPassword: "" });
              } catch (requestError) {
                setError(requestError.response?.data?.message || "Unable to change password.");
              }
            }}
          >
            <h2 className="font-black">Change password</h2>
            {error && <p className="text-sm text-rose-700">{error}</p>}
            {message && <p className="text-sm text-emerald-700">{message}</p>}
            <input type="password" required value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} placeholder="Current password" className="w-full rounded-lg border p-3" />
            <input type="password" required minLength={8} value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} placeholder="New password (letter + number)" className="w-full rounded-lg border p-3" />
            <button type="submit" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">Update password</button>
          </form>
          <Link to={dashboard} className="inline-flex rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600">
            Go Dashboard
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

export default Profile;
