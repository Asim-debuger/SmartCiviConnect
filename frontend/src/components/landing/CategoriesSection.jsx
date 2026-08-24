import { Construction, Droplets, Lightbulb, TrafficCone, Trash2, Waves, Zap, CircleAlert } from "lucide-react";
import Container from "../common/Container";
import SectionHeading from "../public/SectionHeading";

const categories = [
  { name: "Road Damage", icon: Construction, detail: "Potholes, broken stretches, and unsafe road surfaces." },
  { name: "Garbage Management", icon: Trash2, detail: "Overflowing bins, delayed collection, and dumping." },
  { name: "Water Leakage", icon: Droplets, detail: "Pipeline bursts, hydrant leaks, and water wastage." },
  { name: "Drainage", icon: Waves, detail: "Blocked drains and flooding during rainfall." },
  { name: "Street Lights", icon: Lightbulb, detail: "Dark streets, faulty poles, and unsafe night areas." },
  { name: "Electricity", icon: Zap, detail: "Outages, damaged cables, and public electrical hazards." },
  { name: "Traffic Issues", icon: TrafficCone, detail: "Signal failures, congestion points, and unsafe junctions." },
  { name: "Sewage Problems", icon: CircleAlert, detail: "Overflow, odor, and sanitation failures." },
];

function CategoriesSection() {
  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-950">
      <Container>
        <SectionHeading
          eyebrow="Civic categories"
          title="Report the issues that shape daily city life"
          description="Every category is routed to the department responsible for inspection, assignment, and resolution."
        />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <article
                key={category.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800"
              >
                <div className="inline-flex rounded-xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{category.detail}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default CategoriesSection;
