import { useState } from "react";
import { Clock3, Mail, MapPin, Phone, Send } from "lucide-react";
import Container from "../../components/common/Container";
import PageHero from "../../components/public/PageHero";
import { submitContact } from "../../api/contactApi";

function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await submitContact({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        message: form.get("message"),
      });
      setSent(true);
      event.currentTarget.reset();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Your message could not be sent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <PageHero
        eyebrow="Contact"
        title="Reach the SmartciviConnect civic operations team."
        description="Use this form for platform questions, partnership requests, and support. Emergency civic hazards should be reported through a registered citizen account."
      />
      <Container className="py-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Name
                <input required name="name" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-900 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              </label>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email
                <input required type="email" name="email" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-900 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              </label>
            </div>
            <label className="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Phone
              <input name="phone" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-900 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            </label>
            <label className="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Message
              <textarea required name="message" rows="5" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-900 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            </label>
            {sent && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">Thank you. Your message has been sent to the civic support desk.</p>}
            {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
            <button disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 dark:bg-teal-700">
              <Send size={16} /> {loading ? "Sending..." : "Send message"}
            </button>
          </form>

          <aside className="rounded-2xl bg-slate-950 p-7 text-white sm:p-8">
            <h2 className="text-2xl font-bold">City support desk</h2>
            <div className="mt-8 space-y-6 text-sm text-slate-300">
              <p className="flex gap-3"><Mail className="shrink-0 text-teal-400" size={19} /> Use the form — messages go to the civic support inbox</p>
              <p className="flex gap-3"><Phone className="shrink-0 text-teal-400" size={19} /> Phone support is not published; use the form for platform questions</p>
              <p className="flex gap-3"><MapPin className="shrink-0 text-teal-400" size={19} /> Operations are handled online through SmartciviConnect</p>
              <p className="flex gap-3"><Clock3 className="shrink-0 text-teal-400" size={19} /> Typical reply window: Monday to Friday, 9:00 AM to 6:00 PM IST</p>
            </div>
            <div className="mt-8 overflow-hidden rounded-xl border border-slate-800">
              <div className="flex h-52 items-center justify-center bg-slate-900 p-4 text-center text-sm text-slate-400">
                Support is handled through the contact form. No public office map is published.
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}

export default Contact;
