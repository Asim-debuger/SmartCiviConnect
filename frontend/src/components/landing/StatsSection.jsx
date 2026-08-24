import { Building2, Briefcase, ClipboardCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Container from "../common/Container";
import { getPlatformStats } from "../../api/publicCatalogApi";

function StatsSection() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    getPlatformStats().then((data) => setStats(data.stats || null)).catch(() => {});
  }, []);
  const cards = [
    { icon: ClipboardCheck, value: stats?.complaints ?? "—", label: "Complaints managed" },
    { icon: Users, value: stats?.people ?? "—", label: "Professionals on the network" },
    { icon: Building2, value: stats?.completed ?? "—", label: "Works completed" },
    { icon: Briefcase, value: stats?.jobs ?? "—", label: "Open civic jobs" },
  ];
  return (
    <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="rounded-xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-950 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default StatsSection;
