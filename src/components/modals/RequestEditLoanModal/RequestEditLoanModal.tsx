import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import Button from "../../Button/Button";
import type { RequestEditLoanModalProps } from "./RequestEditLoanModal.types";

export default function RequestEditLoanModal({
  onClose,
}: RequestEditLoanModalProps) {
  const formik = useFormik({
    initialValues: {
      comment: "",
      reasons: [] as string[], // store selected checkboxes
    },
    validationSchema: Yup.object({
      reasons: Yup.array()
        .min(1, "Please select at least one reason")
        .required("Please select at least one reason"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted:", values);
      onClose();
    },
  });

  const checkboxOptions = [
    { value: "amount", label: "Amount" },
    { value: "tenure", label: "Tenure" },
    { value: "missingDocs", label: "Missing Documents" },
    { value: "incorrectInfo", label: "Incorrect Info" },
  ];

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <div className="w-full flex-col flex gap-4">
        <p className="text-[16px] leading-[145%] font-medium text-gray-500">
          Specify what needs editing
        </p>

        <div className="space-y-4">
          {checkboxOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="reasons"
                value={opt.value}
                checked={formik.values.reasons.includes(opt.value)}
                onChange={formik.handleChange}
                className="border-[1.5px] border-gray-300 w-6 h-6 rounded accent-primary"
              />
              <span className="text-[16px] leading-[145%] font-medium text-gray-500">
                {opt.label}
              </span>
            </label>
          ))}
        </div>

        {formik.touched.reasons && formik.errors.reasons && (
          <span className="text-sm text-red-500">{formik.errors.reasons}</span>
        )}
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Confirm</Button>
      </div>
    </form>
  );
}
