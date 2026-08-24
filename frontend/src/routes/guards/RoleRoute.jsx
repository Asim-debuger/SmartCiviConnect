import { Navigate } from "react-router-dom";
import { PageSkeleton } from "../../components/common/Skeleton";
import { useAuthContext } from "../../context/AuthContext";
import { normalizeRole } from "../../utils/roles";

function RoleRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <PageSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const current = normalizeRole(user.role);
  const allowed = allowedRoles.some((role) => normalizeRole(role) === current);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl bg-white p-8 shadow">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-3">Current Role: {user.role}</p>
        </div>
      </div>
    );
  }

  return children;
}

export default RoleRoute;
