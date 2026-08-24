import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "../../components/common/Container";
import PageHero from "../../components/public/PageHero";

const questions = [
  ["How can I submit a complaint?", "Create a citizen account, open Report an Issue, add the category, description, exact location, and evidence, then submit the report to the city desk."],
  ["Can I track my complaint?", "Yes. Your citizen dashboard shows every status change, assignment, evidence update, and completion event for reports you submitted."],
  ["How does employee tracking work?", "Authorized field staff share progress and location updates while a complaint is active. Access is limited to the officers, staff, and administrators involved in that case."],
  ["Is registration required?", "You can browse the public website without an account. Registration is required to submit a complaint, receive notifications, and verify resolution."],
  ["How are complaints verified?", "An administrator reviews incoming reports, checks the location and evidence, then routes the work to the appropriate officer. Public registration never lets a user choose a city staff role."],
  ["How do notifications work?", "You receive realtime in-app updates and configured email alerts when a complaint is verified, assigned, started, or resolved."],
];

function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <PageHero
        eyebrow="FAQ"
        title="Clear answers for residents and city teams."
        description="These are the questions people ask most often before they report an issue or join a city workspace."
      />
      <Container className="py-16">
        <div className="mx-auto max-w-3xl space-y-3">
          {questions.map(([question, answer], index) => (
            <div key={question} className="rounded-2xl border border-slate-200 bg-white px-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setOpen(open === index ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-slate-900 dark:text-white"
              >
                <span>{question}</span>
                <ChevronDown className={`shrink-0 transition ${open === index ? "rotate-180 text-teal-600" : "text-slate-400"}`} size={19} />
              </button>
              {open === index && <p className="max-w-2xl pb-5 text-sm leading-7 text-slate-600 dark:text-slate-400">{answer}</p>}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default FAQ;
