import { Outlet } from "react-router-dom";
import AppShell from "./AppShell";
import CitizenSidebar from "./CitizenSidebar";

function CitizenLayout() {
  return <AppShell label="Citizen workspace" sidebar={<CitizenSidebar />} />;
}

export default CitizenLayout;
