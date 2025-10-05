import {
  Banknote,
  BanknoteArrowUp,
  ChartNetwork,
  CreditCard,
  House,
  NotepadText,
  Settings,
  User,
  Users,
  UserCircle,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

export interface SidebarLink {
  name: string;
  link: string;
  icon: any;
  allowedRoles: string[];
}

export const sidebarLinks: SidebarLink[] = [
  {
    name: "Dashboard",
    link: ROUTES.DASHBOARD,
    icon: House,
    allowedRoles: ["director", "manager", "creditAgent"],
  },
  {
    name: "Clients",
    link: ROUTES.CLIENTS,
    icon: User,
    allowedRoles: ["director", "manager", "creditAgent"],
  },
  {
    name: "Loans",
    link: ROUTES.LOANS,
    icon: NotepadText,
    allowedRoles: ["director", "manager", "creditAgent"],
  },
  {
    name: "Payments",
    link: ROUTES.PAYMENTS,
    icon: CreditCard,
    allowedRoles: ["director", "manager", "creditAgent"],
  },
  {
    name: "User Management",
    link: ROUTES.USER_MANAGEMENT,
    icon: Users,
    allowedRoles: ["director"],
  },
  {
    name: "Finance",
    link: ROUTES.FINANCE,
    icon: Banknote,
    allowedRoles: ["director", "manager"],
  },
  {
    name: "Credit Agents",
    link: ROUTES.CREDITAGENTS,
    icon: Users,
    allowedRoles: ["director", "manager"],
  },
  {
    name: "Reports",
    link: ROUTES.REPORTS,
    icon: ChartNetwork,
    allowedRoles: ["director", "manager", "creditAgent"],
  },
  {
    name: "Loan Requests",
    link: ROUTES.LOAN_REQUESTS,
    icon: NotepadText,
    allowedRoles: ["director", "manager", "creditAgent"],
  },
  {
    name: "Repayments",
    link: ROUTES.REPAYMENTS,
    icon: BanknoteArrowUp,
    allowedRoles: ["director", "manager", "creditAgent"],
  },
  {
    name: "Settings",
    link: ROUTES.SETTINGS,
    icon: Settings,
    allowedRoles: ["director", "manager"],
  },
  {
    name: "Profile",
    link: ROUTES.PROFILE,
    icon: UserCircle,
    allowedRoles: ["director", "manager", "creditAgent"],
  },
];

export const ROLE = "creditAgent";

// Helper function to get filtered sidebar links based on user role
export function getFilteredSidebarLinks(userRole: string): SidebarLink[] {
  return sidebarLinks.filter((link) => link.allowedRoles.includes(userRole));
}

export function generatePassword(length = 12) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let newPassword = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    newPassword += charset[randomIndex];
  }
  return newPassword;
}
