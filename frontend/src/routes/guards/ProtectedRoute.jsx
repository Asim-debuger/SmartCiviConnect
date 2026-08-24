import { Navigate } from "react-router-dom";
import { PageSkeleton } from "../../components/common/Skeleton";
import { useAuthContext } from "../../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
