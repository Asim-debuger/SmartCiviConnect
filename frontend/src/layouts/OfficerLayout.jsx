import AppShell from "./AppShell";
import Sidebar from "../components/common/Sidebar";

function OfficerLayout() {
  return <AppShell label="Officer workspace" tone="blue" sidebar={<Sidebar role="officer" />} />;
}

export default OfficerLayout;
