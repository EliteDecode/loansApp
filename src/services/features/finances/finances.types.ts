export interface FinancesState {
  records: FinanceRecord[];
  total: number;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  isError: boolean;
  message: string | null;
}

export interface FinanceRecord {
  _id: string;
  staffId: string;
  staffType: "creditAgent" | "manager" | "director" | string; // extendable
  staffName: string;
  staffEmail: string;
  currentSalary: number;
  salaryHistory: SalaryHistory[];
  paymentRecords: PaymentRecord[];
  unpaidMonths: string[]; // e.g. ["2025-10"]
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  __v?: number;
}

// Example sub-types (if backend adds more detail later)
export interface SalaryHistory {
  month: string; // e.g. "2025-09"
  amount: number;
  datePaid: string;
}

export interface PaymentRecord {
  amount: number;
  datePaid: string;
  reference: string;
}
