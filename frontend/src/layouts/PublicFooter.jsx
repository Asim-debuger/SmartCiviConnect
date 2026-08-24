import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

function PublicFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500 font-black text-slate-950">S</span>
            <span className="text-lg font-black">SmartciviConnect</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
            A government-grade Smart City platform that helps residents report issues, track resolutions, and stay connected with city authorities in real time.
          </p>
        </div>
        <div>
          <h2 className="font-bold">Platform</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <Link to="/services" className="hover:text-teal-300">Services</Link>
            <Link to="/how-it-works" className="hover:text-teal-300">How It Works</Link>
            <Link to="/faq" className="hover:text-teal-300">FAQ</Link>
          </div>
        </div>
        <div>
          <h2 className="font-bold">Company</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <Link to="/about" className="hover:text-teal-300">About</Link>
            <Link to="/contact" className="hover:text-teal-300">Contact</Link>
            <Link to="/privacy-policy" className="hover:text-teal-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-teal-300">Terms</Link>
          </div>
        </div>
        <div>
          <h2 className="font-bold">Civic Support</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <p className="flex items-start gap-2"><Mail size={16} className="mt-0.5 text-teal-400" /> Contact form on this site</p>
            <p className="flex items-start gap-2"><Phone size={16} className="mt-0.5 text-teal-400" /> No public helpline published</p>
            <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 text-teal-400" /> Online civic operations</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-5 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SmartciviConnect. Built for more responsive cities.
      </div>
    </footer>
  );
}

export default PublicFooter;
