import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-teal-700">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Page not found</h2>
      <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">
        The page you requested is not part of the SmartciviConnect public website or your current workspace.
      </p>
      <Link to="/" className="mt-6 rounded-lg bg-teal-700 px-5 py-3 font-medium text-white transition hover:bg-teal-600">
        Back to Home
      </Link>
    </section>
  );
}

export default NotFound;
