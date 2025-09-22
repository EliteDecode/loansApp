import type { ChangeEvent, ReactNode } from "react";

export type SelectInputProps = {
  label: string;
  children: ReactNode;
  name: string; // required for Formik
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void; // optional handler
};
