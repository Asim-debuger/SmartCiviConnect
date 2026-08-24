import { BriefcaseBusiness, HardHat, Shield, UserRound } from "lucide-react";
import Container from "../common/Container";
import SectionHeading from "../public/SectionHeading";

const portals = [
  { title: "Citizen Portal", description: "Report civic issues, attach evidence, track progress, and confirm resolution.", icon: UserRound },
  { title: "Officer Portal", description: "Accept verified complaints, assign field staff, and supervise department work.", icon: BriefcaseBusiness },
  { title: "Staff Portal", description: "Receive assigned jobs, update live progress, and submit proof of completion.", icon: HardHat },
  { title: "Admin Portal", description: "Verify incoming reports, coordinate departments, and monitor city-wide performance.", icon: Shield },
];

function RolesSection() {
  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-950">
      <Container>
        <SectionHeading
          eyebrow="User types"
          title="One platform, four operational portals"
          description="Access is granted by city administrators. Public registration always creates a citizen account."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <article key={portal.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="h-fit rounded-xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">{portal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{portal.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default RolesSection;
