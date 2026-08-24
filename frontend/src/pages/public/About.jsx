import { CheckCircle2, Cpu, Eye, HeartHandshake, ShieldAlert, Target } from "lucide-react";
import Container from "../../components/common/Container";
import PageHero from "../../components/public/PageHero";

const pillars = [
  { icon: Target, title: "Mission", body: "Give every resident a simple way to report civic problems and give every city team the context needed to respond with speed and accountability." },
  { icon: Eye, title: "Vision", body: "Cities where public trust grows because progress is visible, communication is timely, and service records are reliable." },
  { icon: HeartHandshake, title: "Why SmartciviConnect", body: "Most civic requests disappear into disconnected helplines, paper files, and private chats. We replace that with one operational timeline for citizens, officers, staff, and administrators." },
];

const problemPoints = [
  "Residents cannot see whether a report was received, assigned, or completed.",
  "Departments lack a shared picture of workload, location, and evidence.",
  "Field teams receive incomplete instructions and cannot prove work on site.",
  "City leadership cannot measure resolution quality across wards and departments.",
];

const technologies = [
  "JWT-secured identity for citizens and authorized city staff",
  "GPS and map intelligence for precise complaint locations",
  "Realtime updates for assignments, messages, and field movement",
  "Photo and video evidence stored with each case record",
  "Role-based portals for Citizen, Staff, Officer, Head Officer, Admin, and Super Admin",
];

const milestones = [
  ["2024", "The idea", "City service needed a clearer path between a resident report and the team responsible for fixing it."],
  ["2025", "The platform", "Complaint workflows, location intelligence, media evidence, and workforce coordination were unified."],
  ["Today", "The network", "Citizens, officers, field staff, and administrators now share one operational view of civic work."],
];

const roadmap = [
  ["2026", "City expansion", "Multi-ward analytics, department scorecards, and faster emergency routing."],
  ["2027", "Predictive operations", "Pattern detection for recurring issues and tighter integration with field sensors."],
  ["2028", "Open civic participation", "Richer public dashboards, multilingual support, and citizen verification at scale."],
];

function About() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <PageHero
        eyebrow="About SmartciviConnect"
        title="Public service works better when everyone can see the next step."
        description="SmartciviConnect is a Smart City operations platform designed to make civic response visible, accountable, and human."
      />

      <Container className="py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Icon className="text-teal-700 dark:text-teal-400" size={26} />
              <h2 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{body}</p>
            </article>
          ))}
        </div>
      </Container>

      <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">The problem we solve</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">Civic work should not vanish after it is reported.</h2>
              <ul className="mt-6 space-y-4">
                {problemPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    <ShieldAlert className="mt-1 shrink-0 text-teal-700" size={18} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">Technology used</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">A secure stack for live civic operations.</h2>
              <ul className="mt-6 space-y-4">
                {technologies.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    <Cpu className="mt-1 shrink-0 text-teal-700" size={18} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="rounded-3xl bg-slate-950 p-8 text-white sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">Impact on smart cities</p>
          <h2 className="mt-3 text-3xl font-bold">Less uncertainty for residents. Better coordination for city teams.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            SmartciviConnect turns isolated complaints into an operational record: who reported the issue, where it is, which department owns it, who is on site, and when the work was verified. That record is the foundation of a more responsive city.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["Faster routing to the right department", "Visible proof of field completion", "A durable history for audits and planning"].map((item) => (
              <p key={item} className="flex items-start gap-2 text-sm text-slate-200">
                <CheckCircle2 className="mt-0.5 shrink-0 text-teal-400" size={18} />
                {item}
              </p>
            ))}
          </div>
        </div>
      </Container>

      <section className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
        <Container>
          <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Timeline</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {milestones.map(([year, title, body]) => (
              <div key={year} className="border-l-2 border-teal-600 pl-5">
                <p className="text-sm font-bold text-teal-700 dark:text-teal-400">{year}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Future roadmap</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {roadmap.map(([year, title, body]) => (
            <article key={year} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-bold text-teal-700 dark:text-teal-400">{year}</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{body}</p>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default About;
