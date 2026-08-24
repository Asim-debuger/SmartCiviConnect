import { Briefcase, Globe2, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../common/Container";
import SectionHeading from "../public/SectionHeading";

const pillars = [
  { icon: ShieldCheck, title: "Complaint solving", description: "Report, assign, track, and close civic issues with evidence and a live timeline.", to: "/how-it-works" },
  { icon: Users, title: "Workforce management", description: "Officers coordinate staff, verify completion, and keep field work accountable.", to: "/services" },
  { icon: Globe2, title: "Professional networking", description: "Connect with electricians, officers, and departments like a civic LinkedIn.", to: "/professionals" },
  { icon: Briefcase, title: "Job marketplace", description: "Departments post roles. Citizens and workers apply, interview, and join.", to: "/jobs" },
];

function PlatformVisionSection() {
  return (
    <section className="bg-white py-20">
      <Container>
        <SectionHeading
          eyebrow="What SmartciviConnect is"
          title="Civic operations, professional network, and jobs in one platform"
          description="Not a ticket desk. A city operating system for residents, field crews, and departments."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} to={item.to} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-teal-600 hover:shadow-lg">
                <Icon className="text-teal-700" size={26} />
                <h3 className="mt-4 text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default PlatformVisionSection;
