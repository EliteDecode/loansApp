import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "@/layouts/Dashboard/index";
import Clients from "./pages/Clients";
import CreditAgentDashboard from "./pages/CreditAgentDashboard";
import AddClient from "./pages/AddClient";
import EditClient from "./pages/EditClient";
import ClientDetails from "./pages/ClientDetails";
import LoanRequests from "./pages/LoanRequests";
import LoanSummary from "./pages/LoanSummary";
import Repayments from "./pages/Repayments";
import ProfileLayout from "./layouts/ProfileLayout/ProfileLayout";

// Profile subpages
import ProfileBasicInfo from "./pages/ProfileBasicInfo";
import Security from "./pages/Security";
import ProfileNotifications from "./pages/ProfileNotifications";
import AdminDashboard from "./pages/AdminDashboard";
import type { RootState } from "./store";
import Loans from "./pages/Loans";
import LoanDetails from "./pages/LoanDetails";
import LoanInfo from "./pages/LoanInfo";
import Payments from "./pages/Payments";
import CreditAgents from "./pages/CreditAgents";
import CreditAgentsInfo from "./pages/CreditAgentsInfo";
import AddAgent from "./pages/AddAgent";
import EditAgent from "./pages/EditAgent";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";
import DirectorLoginPage from "./pages/DirectorLoginPage";
import ManagerLoginPage from "./pages/ManagerLoginPage";
import AgentLoginPage from "./pages/AgentLoginPage";
import UserManagement from "./pages/UserManagement";
import Finance from "./pages/Finance";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { RoleRoute } from "./routes/RoleRoute";
import AddManager from "./pages/AddManager";

function App() {
  const { role } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/* Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            role === "creditAgent" ? (
              <CreditAgentDashboard />
            ) : (
              <AdminDashboard />
            )
          }
        />

        <Route path="clients" element={<Clients />} />
        <Route path="clients/new" element={<AddClient />} />
        <Route path="clients/:id/edit" element={<EditClient />} />
        <Route path="clients/:id" element={<ClientDetails />} />

        <Route path="loans" element={<Loans />} />
        <Route path="loans/:id" element={<LoanDetails />} />
        <Route path="loans/loan-info/:id" element={<LoanInfo />} />
        <Route path="loan-requests" element={<LoanRequests />} />
        <Route path="loan-requests/loan-summary" element={<LoanSummary />} />

        <Route path="repayments" element={<Repayments />} />

        <Route path="payments" element={<Payments />} />

        <Route path="Reports" element={<Reports />} />

        <Route
          path="settings"
          element={
            <RoleRoute allowedRoles={["director", "manager"]}>
              <Settings />
            </RoleRoute>
          }
        />

        <Route
          path="user-management"
          element={
            <RoleRoute allowedRoles={["director"]}>
              <UserManagement />
            </RoleRoute>
          }
        />
        <Route
          path="user-management/manager/new"
          element={
            <RoleRoute allowedRoles={["director"]}>
              <AddManager />
            </RoleRoute>
          }
        />

        <Route
          path="finance"
          element={
            <RoleRoute allowedRoles={["director", "manager"]}>
              <Finance />
            </RoleRoute>
          }
        />

        <Route
          path="credit-agents"
          element={
            <RoleRoute allowedRoles={["director", "manager"]}>
              <CreditAgents />
            </RoleRoute>
          }
        />
        <Route
          path="credit-agents/new"
          element={
            <RoleRoute allowedRoles={["director", "manager"]}>
              <AddAgent />
            </RoleRoute>
          }
        />
        <Route
          path="credit-agents/credit-agents-info/:id"
          element={
            <RoleRoute allowedRoles={["director", "manager"]}>
              <CreditAgentsInfo />
            </RoleRoute>
          }
        />
        <Route
          path="credit-agents/edit/:id"
          element={
            <RoleRoute allowedRoles={["director", "manager"]}>
              <EditAgent />
            </RoleRoute>
          }
        />

        {/* Profile layout with nested routes */}
        <Route path="profile" element={<ProfileLayout />}>
          <Route index element={<Navigate to="basic-info" replace />} />
          <Route path="basic-info" element={<ProfileBasicInfo />} />
          <Route path="security" element={<Security />} />
          <Route path="notifications" element={<ProfileNotifications />} />
        </Route>
      </Route>

      {/* Public Login Routes */}
      <Route path="login" element={<LoginPage />} />
      <Route path="director" element={<DirectorLoginPage />} />
      <Route path="manager" element={<ManagerLoginPage />} />
      <Route path="agent" element={<AgentLoginPage />} />

      {/* Redirect any unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
