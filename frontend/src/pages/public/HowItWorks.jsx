import { ArrowDown, BadgeCheck, ClipboardEdit, HardHat, SearchCheck, UserCheck } from "lucide-react";
import Container from "../../components/common/Container";
import PageHero from "../../components/public/PageHero";

const flow = [
  { actor: "Citizen", title: "Submit complaint", body: "The resident describes the issue, pins the location, and attaches photo or video evidence.", icon: ClipboardEdit },
  { actor: "Admin", title: "Admin verification", body: "The city desk reviews the report, confirms ownership, and prepares it for operational assignment.", icon: SearchCheck },
  { actor: "Officer", title: "Officer assignment", body: "A responsible officer accepts the case and assigns the right field staff.", icon: UserCheck },
  { actor: "Staff", title: "Staff work", body: "Field staff complete the job, update progress, and upload proof from the site.", icon: HardHat },
  { actor: "Citizen", title: "Citizen verification", body: "The resident is notified of completion and can confirm that the issue has been resolved.", icon: BadgeCheck },
];

function HowItWorks() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <PageHero
        eyebrow="How it works"
        title="The complete civic response workflow."
        description="From the first location pin to citizen verification, every role sees the same case and the same next step."
      />
      <Container className="py-16">
        <div className="mx-auto max-w-3xl">
          {flow.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative pb-4">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">{step.actor}</p>
                      <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">{step.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{step.body}</p>
                    </div>
                  </div>
                </article>
                {index < flow.length - 1 && (
                  <div className="flex justify-center py-3 text-teal-600">
                    <ArrowDown size={22} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Visual workflow</p>
          <div className="mt-6 flex min-w-[720px] items-center justify-between gap-3">
            {flow.map((step, index) => (
              <div key={step.title} className="flex flex-1 items-center">
                <div className="w-full rounded-2xl bg-slate-950 px-4 py-5 text-center text-white">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal-300">{step.actor}</p>
                  <p className="mt-2 text-sm font-semibold">{step.title}</p>
                </div>
                {index < flow.length - 1 && <div className="mx-2 h-px w-8 shrink-0 bg-teal-500" />}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default HowItWorks;
