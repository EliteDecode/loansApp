import type { InputHTMLAttributes } from "react";
import type { FieldHookConfig } from "formik";

// Extend Formik field config with normal <input> props
export type TextInputProps = {
  label: string;
  amount?: boolean; // if true → formatted display, raw value in Formik
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "value" | "onChange"> &
  FieldHookConfig<string | number>;
