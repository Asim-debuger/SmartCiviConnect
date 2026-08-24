import { Bell, Camera, FileBarChart, MapPinned, MessageSquare, Radio } from "lucide-react";
import Container from "../common/Container";
import SectionHeading from "../public/SectionHeading";

const features = [
  { icon: MapPinned, title: "GPS Complaint Tracking", description: "Pin the exact issue location and follow it on an operational map." },
  { icon: Radio, title: "Live Workforce Tracking", description: "See field movement and task progress while work is underway." },
  { icon: Bell, title: "Real-time Notifications", description: "Receive instant updates when a complaint is assigned, started, or closed." },
  { icon: Camera, title: "Photo/Video Evidence", description: "Attach before and after media so every case has a verifiable record." },
  { icon: MessageSquare, title: "Professional network", description: "Connect, follow, and message civic professionals with LinkedIn-style profiles." },
  { icon: FileBarChart, title: "Jobs marketplace", description: "Departments post roles. Workers apply, get shortlisted, and join field teams." },
];

function FeaturesSection() {
  return (
    <section className="bg-slate-950 py-20">
      <Container>
        <SectionHeading
          light
          eyebrow="Platform capabilities"
          title="Built for transparent city operations"
          description="The same workspace that captures a citizen report also coordinates the teams responsible for closing it."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-teal-500">
                <div className="inline-flex rounded-xl bg-teal-500/10 p-3 text-teal-300">
                  <Icon size={26} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default FeaturesSection;
