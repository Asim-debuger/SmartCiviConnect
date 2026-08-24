import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { dashboardPath } from "../../utils/roles";

function AuthRedirect() {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    navigate(dashboardPath(user?.role), { replace: true });
  }, [isAuthenticated, loading, navigate, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="font-bold text-slate-700">Preparing your workspace...</p>
    </div>
  );
}

export default AuthRedirect;
