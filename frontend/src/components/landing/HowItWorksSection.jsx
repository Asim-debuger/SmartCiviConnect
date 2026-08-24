import { BadgeCheck, ClipboardEdit, HardHat, SearchCheck, UserCheck } from "lucide-react";
import Container from "../common/Container";
import SectionHeading from "../public/SectionHeading";

const steps = [
  { number: "1", title: "Submit Complaint", description: "A resident files a location-tagged report with photos or video.", icon: ClipboardEdit },
  { number: "2", title: "Verification", description: "The city desk confirms details, urgency, and department ownership.", icon: SearchCheck },
  { number: "3", title: "Officer Assignment", description: "A responsible officer accepts the case and plans the field response.", icon: UserCheck },
  { number: "4", title: "Field Work", description: "Staff complete the task and upload proof of work from the site.", icon: HardHat },
  { number: "5", title: "Resolution", description: "The citizen is notified and can verify that the issue is closed.", icon: BadgeCheck },
];

function HowItWorksSection() {
  return (
    <section className="bg-white py-20 dark:bg-slate-900">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="A clear path from report to resolution"
          description="Every complaint moves through the same accountable sequence so residents always know what happens next."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <span className="text-sm font-black text-teal-700 dark:text-teal-400">{step.number}</span>
                <Icon className="mt-6 text-slate-950 dark:text-white" size={24} />
                <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.description}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold">Citizen complaint workflow</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Report with evidence, track assignment, and close the loop when work is done.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold">Professional workforce</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Officers assign staff, verify completion, and keep field progress visible in real time.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold">Jobs and networking</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Browse the public job board and professional directory. Sign in to apply, connect, or message.</p>
          </article>
        </div>
      </Container>
    </section>
  );
}

export default HowItWorksSection;
