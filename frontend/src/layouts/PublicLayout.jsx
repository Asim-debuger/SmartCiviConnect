import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

export default PublicLayout;
