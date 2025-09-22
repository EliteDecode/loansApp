import { Field, ErrorMessage, type FieldProps } from "formik";
import { DatePicker } from "@mui/x-date-pickers"; // or your date picker component
import type { FormDatePickerProps } from "./FormDatePickerProps.types";

export default function FormDatePicker({
  name,
  label,
  disableFuture,
}: FormDatePickerProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-medium text-gray-900">{label}</label>

      <Field name={name}>
        {({ field, form }: FieldProps) => (
          <DatePicker
            value={field.value || null}
            onChange={(val) => form.setFieldValue(field.name, val)}
            disableFuture={disableFuture}
            slotProps={{
              textField: {
                fullWidth: true,
                error: Boolean(form.touched[name] && form.errors[name]),
              },
            }}
          />
        )}
      </Field>

      <ErrorMessage
        name={name}
        component="span"
        className="text-red-500 text-xs"
      />
    </div>
  );
}
