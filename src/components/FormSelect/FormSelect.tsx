import { useField } from "formik";
import {
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  FormControl,
} from "@mui/material";
import type { ReactNode } from "react";

interface Option {
  label: string;
  value: string | number;
}

interface FormSelectProps {
  name: string;
  label: string;
  options: Option[];
  loading?: boolean;
  icon?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
}

export default function FormSelect({
  name,
  label,
  options,
  loading = false,
  icon,
  placeholder,
  disabled = false,
}: FormSelectProps) {
  const [field, meta, helpers] = useField(name);

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* ✅ Static label */}
      <label htmlFor={name} className="text-[14px] font-medium text-gray-900">
        {label}
      </label>

      <FormControl
        fullWidth
        error={meta.touched && Boolean(meta.error)}
        sx={{
          "& .MuiFormHelperText-root": {
            marginLeft: 0, // ✅ removes left indent
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#002D62", // ✅ custom border color
            },
          },
        }}
      >
        <Select
          id={name}
          value={field.value || ""}
          onChange={(e) => helpers.setValue(e.target.value)}
          disabled={disabled}
          IconComponent={() => null}
          endAdornment={
            <>
              {loading && <CircularProgress size={20} color="inherit" />}
              {icon && <span className="mr-2">{icon}</span>}
            </>
          }
          displayEmpty
          sx={{
            "& .MuiSelect-select": {
              fontSize: "14px",
              color: field.value ? "#111827" : "#9CA3AF", // dark if selected, gray if empty
            },
          }}
        >
          {placeholder && (
            <MenuItem value="">
              <span className="text-gray-400">{placeholder}</span>
            </MenuItem>
          )}
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {meta.touched && meta.error && (
          <FormHelperText>{meta.error}</FormHelperText>
        )}
      </FormControl>
    </div>
  );
}
