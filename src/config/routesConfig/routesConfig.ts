// src/config/routesConfig.ts
import { BanknoteArrowUp, House, NotepadText, User } from "lucide-react";
import Dashboard from "@/pages/CreditAgentDashboard";
import Clients from "@/pages/";
import AddClient from "@/pages/AddClient";
import ClientDetails from "@/pages/ClientDetails";
import LoanRequests from "@/pages/LoanRequests";
import LoanSummary from "@/pages/LoanSummary";
import Repayments from "@/pages/Repayments";
import type { JSX } from "react";

export type Role = "credit-agent" | "manager" | "director";

export interface AppRoute {
  name: string;
  path: string;
  icon?: React.ComponentType<any>;
  element: JSX.Element;
  allowedRoles: Role[];
  sidebar?: boolean; // 👈 toggle if it should appear in sidebar
}

export const appRoutes: AppRoute[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: House,
    element: <Dashboard />,
    allowedRoles: ["credit-agent", "manager", "director"],
    sidebar: true,
  },
  {
    name: "Clients",
    path: "clients",
    icon: User,
    element: <Clients />,
    allowedRoles: ["credit-agent"],
    sidebar: true,
  },
  {
    name: "Add Client",
    path: "clients/add",
    element: <AddClient />,
    allowedRoles: ["credit-agent"],
    sidebar: false, // 👈 hidden from sidebar
  },
  {
    name: "Client Details",
    path: "clients/:id",
    element: <ClientDetails />,
    allowedRoles: ["credit-agent"],
    sidebar: false,
  },
  {
    name: "Loan Requests",
    path: "loan-requests",
    icon: NotepadText,
    element: <LoanRequests />,
    allowedRoles: ["manager"],
    sidebar: true,
  },
  {
    name: "Loan Summary",
    path: "loan-requests/loan-summary",
    element: <LoanSummary />,
    allowedRoles: ["manager"],
    sidebar: false,
  },
  {
    name: "Repayments",
    path: "repayments",
    icon: BanknoteArrowUp,
    element: <Repayments />,
    allowedRoles: ["director"],
    sidebar: true,
  },
];
