import { ArrowRight, MapPin, Radio, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../common/Button";
import Container from "../common/Container";
import { useAuthContext } from "../../context/AuthContext";
import { useAppUser } from "../../context/AppUserContext";
import { reportIssuePath } from "../../utils/roles";
import { getPlatformStats } from "../../api/publicCatalogApi";

function CityVisual() {
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0 });
  useEffect(() => {
    getPlatformStats().then((data) => setStats(data.stats || {})).catch(() => {});
  }, []);
  return (
    <div className="relative">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Live civic operations</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">City Command View</h3>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-soft" />
            Live
          </div>
        </div>
        <div className="relative mt-5 h-56 overflow-hidden rounded-2xl bg-gradient-to-br from-teal-100 via-slate-100 to-sky-100 dark:from-slate-800 dark:via-slate-900 dark:to-teal-950">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(#0f766e 1px, transparent 1px), linear-gradient(90deg, #0f766e 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="absolute left-[18%] top-[28%] rounded-full bg-rose-500 p-2 text-white shadow-lg">
            <MapPin size={16} />
          </div>
          <div className="absolute right-[22%] top-[42%] rounded-full bg-teal-600 p-2 text-white shadow-lg">
            <MapPin size={16} />
          </div>
          <div className="absolute bottom-[18%] left-[46%] rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-slate-800 shadow-lg dark:bg-slate-950 dark:text-slate-100">
            Live complaint map from city operations
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[["Pending", stats.pending ?? 0, "text-amber-500"], ["In progress", stats.inProgress ?? 0, "text-sky-600"], ["Resolved", stats.completed ?? 0, "text-emerald-600"]].map(([label, value, color]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:block dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs text-slate-500 dark:text-slate-400">Citizen reporting</p>
        <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">Photo evidence attached</p>
      </div>
      <div className="absolute -right-3 top-16 hidden rounded-xl border border-slate-200 bg-white p-3 shadow-lg sm:block dark:border-slate-700 dark:bg-slate-900">
        <Radio size={16} className="text-teal-600" />
        <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200">Field crew en route</p>
      </div>
    </div>
  );
}

function HeroSection() {
  const { isAuthenticated } = useAuthContext();
  const { role, dashboard } = useAppUser();
  const issuePath = isAuthenticated ? reportIssuePath(role) : "/register";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-teal-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Container className="py-20 sm:py-24 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300">
              <ShieldCheck size={18} />
              SmartciviConnect
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-[3.4rem] dark:text-white">
              SmartciviConnect for Cities
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Report civic issues, run the field workforce, hire on a job marketplace, and network like LinkedIn — in one production platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={issuePath}>
                <Button size="lg" className="bg-teal-700 hover:bg-teal-600">
                  Report an Issue
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg" className="border-slate-300 text-slate-800 dark:border-slate-600 dark:text-white">
                  Browse jobs
                </Button>
              </Link>
              {isAuthenticated ? (
                <Link to={dashboard}>
                  <Button variant="outline" size="lg" className="border-slate-300 text-slate-800 dark:border-slate-600 dark:text-white">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="lg" className="border-slate-300 text-slate-800 dark:border-slate-600 dark:text-white">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="animate-fade-up animate-delay-2">
            <CityVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
