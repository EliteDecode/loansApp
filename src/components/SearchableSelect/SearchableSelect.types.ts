import type { ReactNode } from "react";

export interface SearchableSelectOption {
  label: string;
  value: string | number;
}

export interface SearchableSelectProps {
  name: string;
  label: string;
  options: SearchableSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  icon?: ReactNode;
  loading?: boolean;
}
