import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import CitizenLayout from "../layouts/CitizenLayout";
import AdminLayout from "../layouts/AdminLayout";
import OfficerLayout from "../layouts/OfficerLayout";
import StaffLayout from "../layouts/StaffLayout";
import ProtectedRoute from "./guards/ProtectedRoute";
import RoleRoute from "./guards/RoleRoute";

const Home = lazy(() => import("../pages/public/Home"));
const About = lazy(() => import("../pages/public/About"));
const Services = lazy(() => import("../pages/public/Services"));
const Contact = lazy(() => import("../pages/public/Contact"));
const HowItWorks = lazy(() => import("../pages/public/HowItWorks"));
const FAQ = lazy(() => import("../pages/public/FAQ"));
const LegalPage = lazy(() => import("../pages/public/LegalPage"));
const NotFound = lazy(() => import("../pages/public/NotFound"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Profile = lazy(() => import("../pages/auth/Profile"));
const AuthRedirect = lazy(() => import("../pages/auth/AuthRedirect"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const CitizenDashboard = lazy(() => import("../pages/citizen/CitizenDashboard"));
const CitizenNotifications = lazy(() => import("../pages/citizen/CitizenNotifications"));
const CreateComplaint = lazy(() => import("../pages/citizen/CreateComplaint"));
const ComplaintHistory = lazy(() => import("../pages/citizen/ComplaintHistory"));
const ComplaintDetails = lazy(() => import("../pages/citizen/ComplaintDetails"));
const TrackComplaint = lazy(() => import("../pages/citizen/TrackComplaint"));
const MyComplaints = lazy(() => import("../pages/citizen/MyComplaints"));
const ComplaintTracking = lazy(() => import("../pages/citizen/ComplaintTracking"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const ComplaintManagement = lazy(() => import("../pages/admin/ComplaintManagement"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const OfficerManagement = lazy(() => import("../pages/admin/OfficerManagement"));
const StaffManagement = lazy(() => import("../pages/admin/StaffManagement"));
const DepartmentManagement = lazy(() => import("../pages/admin/DepartmentManagement"));
const AnalyticsDashboard = lazy(() => import("../pages/admin/AnalyticsDashboard"));
const PaymentManagement = lazy(() => import("../pages/admin/PaymentManagement"));
const SuperAdminDashboard = lazy(() => import("../pages/admin/SuperAdminDashboard"));
const OfficerDashboard = lazy(() => import("../pages/officer/OfficerDashboard"));
const AssignedComplaints = lazy(() => import("../pages/officer/AssignedComplaints"));
const OfficerStaff = lazy(() => import("../pages/officer/OfficerStaff"));
const OfficerTracking = lazy(() => import("../pages/officer/OfficerTracking"));
const OfficerNotifications = lazy(() => import("../pages/officer/OfficerNotifications"));
const HeadOfficerDashboard = lazy(() => import("../pages/head/HeadOfficerDashboard"));
const StaffDashboard = lazy(() => import("../pages/staff/StaffDashboard"));
const AssignedTasks = lazy(() => import("../pages/staff/AssignedTasks"));
const StaffLiveTracking = lazy(() => import("../pages/staff/StaffLiveTracking"));
const StaffNotifications = lazy(() => import("../pages/staff/StaffNotifications"));
const StaffEarnings = lazy(() => import("../pages/staff/StaffEarnings"));
const NetworkPage = lazy(() => import("../pages/community/NetworkPage"));
const FeedPage = lazy(() => import("../pages/community/FeedPage"));
const InboxPage = lazy(() => import("../pages/community/InboxPage"));
const ProfessionalProfile = lazy(() => import("../pages/community/ProfessionalProfile"));
const JobsPage = lazy(() => import("../pages/jobs/JobsPage"));
const JobManagement = lazy(() => import("../pages/jobs/JobManagement"));
const NotificationInbox = lazy(() => import("../components/common/NotificationInbox"));
const PublicJobs = lazy(() => import("../pages/public/PublicJobs"));
const PublicProfessionals = lazy(() => import("../pages/public/PublicProfessionals"));
const PublicProfessionalProfile = lazy(() => import("../pages/public/PublicProfessionalProfile"));
const PublicJobDetail = lazy(() => import("../pages/public/PublicJobDetail"));
const PublicFeed = lazy(() => import("../pages/public/PublicFeed"));
const PublicPost = lazy(() => import("../pages/public/PublicPost"));
const JobDetailPage = lazy(() => import("../pages/jobs/JobDetailPage"));
const ApplicationDetail = lazy(() => import("../pages/jobs/ApplicationDetail"));
const SavedPostsPage = lazy(() => import("../pages/community/SavedPostsPage"));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-sm font-semibold text-slate-500">Loading…</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/jobs" element={<PublicJobs />} />
          <Route path="/job/:id" element={<PublicJobDetail />} />
          <Route path="/feed" element={<PublicFeed />} />
          <Route path="/post/:id" element={<PublicPost />} />
          <Route path="/professionals" element={<PublicProfessionals />} />
          <Route path="/professional/:id" element={<PublicProfessionalProfile />} />
          <Route path="/u/:username" element={<PublicProfessionalProfile />} />
          <Route path="/profile/:username" element={<PublicProfessionalProfile />} />
          <Route path="/public/jobs" element={<Navigate to="/jobs" replace />} />
          <Route path="/public/professionals" element={<PublicProfessionals />} />
          <Route path="/public/professionals/:id" element={<PublicProfessionalProfile />} />
          <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
        </Route>

        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/redirect" element={<ProtectedRoute><AuthRedirect /></ProtectedRoute>} />

        <Route element={<ProtectedRoute><RoleRoute allowedRoles={["CITIZEN"]}><CitizenLayout /></RoleRoute></ProtectedRoute>}>
          <Route path="/citizen" element={<Navigate to="/citizen/dashboard" replace />} />
          <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
          <Route path="/citizen/create" element={<CreateComplaint />} />
          <Route path="/citizen/history" element={<ComplaintHistory />} />
          <Route path="/citizen/complaint/:id" element={<ComplaintDetails />} />
          <Route path="/citizen/track" element={<TrackComplaint />} />
          <Route path="/citizen/complaints" element={<MyComplaints />} />
          <Route path="/citizen/notifications" element={<CitizenNotifications />} />
          <Route path="/citizen/tracking/:id" element={<ComplaintTracking />} />
          <Route path="/citizen/network" element={<NetworkPage />} />
          <Route path="/citizen/feed" element={<FeedPage />} />
          <Route path="/citizen/saved" element={<SavedPostsPage />} />
          <Route path="/citizen/jobs" element={<JobsPage />} />
          <Route path="/citizen/jobs/applications/:applicationId" element={<ApplicationDetail />} />
          <Route path="/citizen/jobs/:id" element={<JobDetailPage />} />
          <Route path="/citizen/inbox" element={<InboxPage />} />
          <Route path="/citizen/profile/:id" element={<ProfessionalProfile />} />
        </Route>

        <Route element={<ProtectedRoute><RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><AdminLayout /></RoleRoute></ProtectedRoute>}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<ComplaintManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/roles" element={<UserManagement />} />
          <Route path="/admin/departments" element={<DepartmentManagement />} />
          <Route path="/admin/officers" element={<OfficerManagement />} />
          <Route path="/admin/staff" element={<StaffManagement />} />
          <Route path="/admin/payments" element={<PaymentManagement />} />
          <Route path="/admin/jobs" element={<JobManagement />} />
          <Route path="/admin/network" element={<NetworkPage />} />
          <Route path="/admin/feed" element={<FeedPage />} />
          <Route path="/admin/saved" element={<SavedPostsPage />} />
          <Route path="/admin/inbox" element={<InboxPage />} />
          <Route path="/admin/profile/:id" element={<ProfessionalProfile />} />
          <Route path="/admin/notifications" element={<NotificationInbox accent="blue" />} />
          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
          <Route path="/admin/reports" element={<AnalyticsDashboard />} />
        </Route>

        <Route element={<ProtectedRoute><RoleRoute allowedRoles={["SUPER_ADMIN"]}><AdminLayout /></RoleRoute></ProtectedRoute>}>
          <Route path="/super-admin" element={<Navigate to="/super-admin/dashboard" replace />} />
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute><RoleRoute allowedRoles={["OFFICER", "HEAD_OFFICER"]}><OfficerLayout /></RoleRoute></ProtectedRoute>}>
          <Route path="/officer" element={<Navigate to="/officer/dashboard" replace />} />
          <Route path="/officer/dashboard" element={<OfficerDashboard />} />
          <Route path="/officer/complaints" element={<AssignedComplaints />} />
          <Route path="/officer/staff" element={<OfficerStaff />} />
          <Route path="/officer/tracking" element={<OfficerTracking />} />
          <Route path="/officer/notifications" element={<OfficerNotifications />} />
          <Route path="/officer/network" element={<NetworkPage />} />
          <Route path="/officer/feed" element={<FeedPage />} />
          <Route path="/officer/saved" element={<SavedPostsPage />} />
          <Route path="/officer/jobs" element={<JobsPage />} />
          <Route path="/officer/jobs/applications/:applicationId" element={<ApplicationDetail />} />
          <Route path="/officer/jobs/:id" element={<JobDetailPage />} />
          <Route path="/officer/inbox" element={<InboxPage />} />
          <Route path="/officer/profile/:id" element={<ProfessionalProfile />} />
          <Route path="/head-officer" element={<Navigate to="/head-officer/dashboard" replace />} />
          <Route path="/head-officer/dashboard" element={<HeadOfficerDashboard />} />
          <Route path="/head-officer/jobs" element={<JobManagement />} />
          <Route path="/head-officer/jobs/applications/:applicationId" element={<ApplicationDetail />} />
          <Route path="/head-officer/feed" element={<FeedPage />} />
          <Route path="/head-officer/profile/:id" element={<ProfessionalProfile />} />
          <Route path="/head-officer/network" element={<NetworkPage />} />
          <Route path="/head-officer/inbox" element={<InboxPage />} />
        </Route>

        <Route element={<ProtectedRoute><RoleRoute allowedRoles={["STAFF"]}><StaffLayout /></RoleRoute></ProtectedRoute>}>
          <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/tasks" element={<AssignedTasks />} />
          <Route path="/staff/tracking" element={<StaffLiveTracking />} />
          <Route path="/staff/notifications" element={<StaffNotifications />} />
          <Route path="/staff/earnings" element={<StaffEarnings />} />
          <Route path="/staff/network" element={<NetworkPage />} />
          <Route path="/staff/feed" element={<FeedPage />} />
          <Route path="/staff/saved" element={<SavedPostsPage />} />
          <Route path="/staff/jobs" element={<JobsPage />} />
          <Route path="/staff/jobs/applications/:applicationId" element={<ApplicationDetail />} />
          <Route path="/staff/jobs/:id" element={<JobDetailPage />} />
          <Route path="/staff/inbox" element={<InboxPage />} />
          <Route path="/staff/profile/:id" element={<ProfessionalProfile />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
