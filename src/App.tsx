import { Route, Routes, Navigate } from "react-router-dom";
import DashboardLayout from "@/layouts/Dashboard/index";
import Clients from "./pages/Clients";
import CreditAgentDashboard from "./pages/CreditAgentDashboard";
import AddClient from "./pages/AddClient";
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
import { ROLE } from "./lib/utils";
import Loans from "./pages/Loans";
import LoanInfo from "./pages/LoanInfo";
import Payments from "./pages/Payments";
import CreditAgents from "./pages/CreditAgents";
import CreditAgentsInfo from "./pages/CreditAgentsInfo";
import AddAgent from "./pages/AddAgent";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route
          index
          element={
            ROLE === "manager" ? <AdminDashboard /> : <CreditAgentDashboard />
          }
        />

        <Route path="clients" element={<Clients />} />
        <Route path="clients/new" element={<AddClient />} />
        <Route path="clients/:id" element={<ClientDetails />} />

        <Route path="loans" element={<Loans />} />
        <Route path="loans/loan-info/:id" element={<LoanInfo />} />
        <Route path="loan-requests" element={<LoanRequests />} />
        <Route path="loan-requests/loan-summary" element={<LoanSummary />} />

        <Route path="repayments" element={<Repayments />} />
        <Route path="payments" element={<Payments />} />

        <Route path="Reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />

        <Route path="credit-agents" element={<CreditAgents />} />
        <Route path="credit-agents/new" element={<AddAgent />} />
        <Route
          path="credit-agents/credit-agents-info/:id"
          element={<CreditAgentsInfo />}
        />

        {/* Profile layout with nested routes */}
        <Route path="profile" element={<ProfileLayout />}>
          <Route index element={<Navigate to="basic-info" replace />} />
          <Route path="basic-info" element={<ProfileBasicInfo />} />
          <Route path="security" element={<Security />} />
          <Route path="notifications" element={<ProfileNotifications />} />
        </Route>
      </Route>
      <Route path="login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
