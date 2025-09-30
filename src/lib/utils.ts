import { BanknoteArrowUp, House, NotepadText, User } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export const sidebarLinks = [
  {
    name: "Dashboard",
    link: ROUTES.DASHBOARD,
    icon: House,
  },
  {
    name: "Clients",
    link: ROUTES.CLIENTS,
    icon: User,
  },
  {
    name: "Loans",
    link: ROUTES.LOANS,
    icon: NotepadText,
  },
  {
    name: "Payments",
    link: ROUTES.PAYMENTS,
    icon: NotepadText,
  },
  {
    name: "Credit Agents",
    link: ROUTES.CREDITAGENTS,
    icon: NotepadText,
  },
  {
    name: "Reports",
    link: ROUTES.REPORTS,
    icon: NotepadText,
  },
  {
    name: "Loan Requests",
    link: ROUTES.LOAN_REQUESTS,
    icon: NotepadText,
  },
  {
    name: "Repayments",
    link: ROUTES.REPAYMENTS,
    icon: BanknoteArrowUp,
  },
  {
    name: "Settings",
    link: ROUTES.SETTINGS,
    icon: BanknoteArrowUp,
  },
];

export const ROLE = "manager";

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
