import { useField, useFormikContext } from "formik";
import type { TextInputProps } from "./TextInput.types";

export default function TextInput({
  label,
  amount,
  type,
  min,
  max,
  ...props
}: TextInputProps & { amount?: boolean; min?: number; max?: number }) {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();

  // ✅ Format number for display (for "amount" inputs)
  const formatAmount = (val: string | number) => {
    if (val === "" || val == null) return "";
    const num = Number(val);
    if (isNaN(num)) return val.toString();
    return new Intl.NumberFormat("en-US").format(num);
  };

  // ✅ Remove formatting for raw value
  const parseAmount = (val: string) => val.replace(/,/g, "");

  // ✅ Handle value changes (apply min–max)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;

    if (amount) {
      rawValue = parseAmount(rawValue);
    }

    // Convert to number for numeric validation
    const numericValue = Number(rawValue);

    // ✅ Apply min & max constraints if defined
    if (!isNaN(numericValue)) {
      if (typeof min === "number" && numericValue < min) rawValue = String(min);
      if (typeof max === "number" && numericValue > max) rawValue = String(max);
    }

    setFieldValue(props.name!, rawValue); // store raw (unformatted) value in Formik
  };

  // ✅ Restrict typing to digits only if type === "tel"
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "tel") {
      if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="flex flex-col gap-1 text-[14px] leading-[145%] w-full">
      <label htmlFor={props.name} className="font-medium text-gray-900">
        {label}
      </label>

      <input
        {...props}
        {...field}
        type={type}
        id={props.name}
        min={min} // ✅ native HTML min
        max={max} // ✅ native HTML max
        value={amount ? formatAmount(field.value) : field.value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`h-14 px-4 outline-primary border rounded-[6px] placeholder:text-gray-400 
          ${
            props.disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "outline-primary"
          }
          ${meta.touched && meta.error ? "border-red-500" : "border-gray-300"}
        `}
      />

      {meta.touched && meta.error && (
        <span className="text-red-500 text-xs">{meta.error}</span>
      )}
    </div>
  );
}
