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
        <Route path="Loan-info/:id" element={<LoanInfo />} />
        <Route path="loan-requests" element={<LoanRequests />} />
        <Route path="loan-requests/loan-summary" element={<LoanSummary />} />

        <Route path="repayments" element={<Repayments />} />

        {/* Profile layout with nested routes */}
        <Route path="profile" element={<ProfileLayout />}>
          <Route index element={<Navigate to="basic-info" replace />} />
          <Route path="basic-info" element={<ProfileBasicInfo />} />
          <Route path="security" element={<Security />} />
          <Route path="notifications" element={<ProfileNotifications />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
