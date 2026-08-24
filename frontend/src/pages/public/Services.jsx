import { BarChart3, BellRing, Briefcase, ClipboardList, MessagesSquare, Radio, Siren, Users } from "lucide-react";
import Container from "../../components/common/Container";
import PageHero from "../../components/public/PageHero";

const services = [
  {
    icon: ClipboardList,
    title: "Complaint Management",
    description: "Capture, categorize, prioritize, and close civic reports from a single operational queue.",
    benefits: ["Structured intake with location and evidence", "Department routing without lost files", "A complete history for every case"],
  },
  {
    icon: Siren,
    title: "Emergency Reporting",
    description: "Escalate high-risk issues such as exposed cables, flooding, or unsafe roads for faster attention.",
    benefits: ["Priority flags for urgent cases", "Immediate visibility for city desks", "Faster assignment to on-call teams"],
  },
  {
    icon: Users,
    title: "Workforce Management",
    description: "Assign the right officer and field staff, then follow the work until it is verified.",
    benefits: ["Role-based task ownership", "Clear handoffs between teams", "Accountability at every stage"],
  },
  {
    icon: Radio,
    title: "Live Tracking",
    description: "Watch complaint locations and authorized field movement as work progresses across the city.",
    benefits: ["Map-first operational awareness", "Reduced guesswork for supervisors", "Citizens stay informed without calling"],
  },
  {
    icon: Briefcase,
    title: "Department Coordination",
    description: "Keep roads, sanitation, water, electricity, and traffic teams working from the same case record.",
    benefits: ["Shared status across departments", "Less duplicated effort", "Cleaner ownership of outcomes"],
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Measure complaint volume, resolution speed, and department performance with digital reports.",
    benefits: ["Leadership-ready summaries", "Ward and category insights", "Evidence for planning and audits"],
  },
  {
    icon: MessagesSquare,
    title: "Citizen Communication",
    description: "Notify residents when a report is verified, assigned, in progress, or resolved.",
    benefits: ["Realtime in-app updates", "Email alerts for major status changes", "Fewer follow-up calls to the city desk"],
  },
  {
    icon: BellRing,
    title: "Job & Workforce Portal",
    description: "Give officers and staff a dedicated workspace for assigned jobs, updates, and completion proof.",
    benefits: ["Mobile-ready field updates", "Before and after evidence", "Supervisor visibility without extra paperwork"],
  },
];

function Services() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <PageHero
        eyebrow="Services"
        title="City operations, coordinated from report to resolution."
        description="SmartciviConnect gives residents a trusted way to raise issues and gives city teams the tools to act on them together."
      />
      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map(({ icon: Icon, title, description, benefits }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Icon className="text-teal-700 dark:text-teal-400" size={28} />
              <h2 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{description}</p>
              <ul className="mt-5 space-y-2">
                {benefits.map((benefit) => (
                  <li key={benefit} className="text-sm font-medium text-slate-700 dark:text-slate-300">• {benefit}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Services;
