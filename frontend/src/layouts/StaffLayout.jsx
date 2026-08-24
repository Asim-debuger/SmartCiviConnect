import AppShell from "./AppShell";
import Sidebar from "../components/common/Sidebar";

function StaffLayout() {
  return <AppShell label="Staff workspace" sidebar={<Sidebar role="staff" />} />;
}

export default StaffLayout;
