import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoleRequests from "../pages/AdminRoleRequests";
import AuthCallbackPage from "../pages/AuthCallbackPage";
import CommonUserDashboard from "../pages/CommonUserDashboard";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import PendingRoleRequestPage from "../pages/PendingRoleRequestPage";
import RoleSelectionPage from "../pages/RoleSelectionPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import Userbookings from "../pages/Userbookings";
import UserHome from "../pages/UserHome";
import UserLayout from "../pages/UserLayout";
import AdminLayout from "../pages/AdminLayout";
import UserResources from "../pages/UserResources";
import UserTickets from "../pages/UserTickets";
import AdminBookings from "../pages/AdminBookings";
import AdminResources from "../pages/AdminResources";
import AdminTicket from "../pages/AdminTicket";
import TechnicianLayout from "../pages/TechnianLayout";
import TechnianTickets from "../pages/TechnianTickets";
import ExternalLayout from "../pages/ExternalLayout";
import ExternalDashboard from "../pages/ExternalDashboard";

function RootRedirect() {
  const { user, token, roleRequest } = useAuth();

  if (!token) {
    return <Navigate to="/home" replace />;
  }

  // If user has an approved role (APPROVED status and user has role assigned), redirect to dashboard
  if (user?.role && roleRequest?.status === "APPROVED") {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  // If user has a pending request, show pending page
  if (roleRequest?.status === "PENDING") {
    return <Navigate to="/pending-role-approval" replace />;
  }

  // If user has a rejected request, show pending page
  if (roleRequest?.status === "REJECTED") {
    return <Navigate to="/pending-role-approval" replace />;
  }

  // If no role and no request, show role selection
  return <Navigate to="/select-role" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/select-role" element={<RoleSelectionPage />} />
      <Route path="/pending-role-approval" element={<PendingRoleRequestPage />} />
      <Route path="/dashboard" element={<CommonUserDashboard />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="resources" element={<AdminResources />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="tickets" element={<AdminTicket />} />
        <Route path="role-requests" element={<AdminRoleRequests />} />
      </Route>

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["STUDENT", "LECTURER"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserHome />} />
        <Route path="resources" element={<UserResources />} />
        <Route path="bookings" element={<Userbookings />} />
        <Route path="tickets" element={<UserTickets />} />
      </Route>

      <Route
        path="/lecturer"
        element={
          <ProtectedRoute allowedRoles={["STUDENT", "LECTURER"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserHome />} />
        <Route path="resources" element={<UserResources />} />
        <Route path="bookings" element={<Userbookings />} />
        <Route path="tickets" element={<UserTickets />} />
      </Route>

      <Route
        path="/technician"
        element={
          <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
            <TechnicianLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TechnianTickets />} />
        <Route path="tickets" element={<TechnianTickets />} />
        <Route path="resources" element={<UserResources />} />
      </Route>

      <Route
        path="/external"
        element={
          <ProtectedRoute allowedRoles={["EXTERNAL"]}>
            <ExternalLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ExternalDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
