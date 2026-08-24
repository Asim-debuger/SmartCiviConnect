import { createContext, useContext, useMemo } from "react";
import { useAuthContext } from "./AuthContext";
import { dashboardPath, displayRole, portalLabel } from "../utils/roles";

const AppUserContext = createContext({
  loading: true,
  role: "Citizen",
  profile: null,
  dashboard: "/citizen/dashboard",
  portal: "Citizen Portal",
  displayRole: "Citizen",
});

export function AppUserProvider({ children }) {
  const { user, loading } = useAuthContext();

  const value = useMemo(() => {
    const role = user?.role || "Citizen";
    return {
      loading,
      profile: user,
      role,
      dashboard: dashboardPath(role),
      portal: portalLabel(role),
      displayRole: displayRole(role),
    };
  }, [user, loading]);

  return <AppUserContext.Provider value={value}>{children}</AppUserContext.Provider>;
}

export function useAppUser() {
  return useContext(AppUserContext);
}
