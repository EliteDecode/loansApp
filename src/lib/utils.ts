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
    name: "Loan Requests",
    link: ROUTES.LOAN_REQUESTS,
    icon: NotepadText,
  },
  {
    name: "Repayments",
    link: ROUTES.REPAYMENTS,
    icon: BanknoteArrowUp,
  },
];

export const ROLE = "manager";
