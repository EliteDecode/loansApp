import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import Button from "../../Button/Button";
import type { RejectLoanModalProps } from "./RejectLoanModal.types";

export default function RejectLoanModal({
  onClose,
  onConfirm,
}: RejectLoanModalProps) {
  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema: Yup.object({
      comment: Yup.string()
        .min(10, "comment must be at least 10 characters")
        .required("comment note is required"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted:", values);

      onConfirm?.(values.comment); // ✅ call parent
    },
  });

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      <div className="w-full flex-col flex gap-1">
        <label
          htmlFor="comment"
          className="text-[16px] leading-[145%] font-medium text-gray-900"
        >
          Manager’s Comments
        </label>
        <textarea
          id="comment"
          name="comment"
          className={`resize-none h-[98px] p-4 rounded-[6px] border outline-primary ${
            formik.touched.comment && formik.errors.comment
              ? "border-red-500"
              : "border-gray-300"
          }`}
          placeholder="Enter reason for rejection "
          value={formik.values.comment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.comment && formik.errors.comment && (
          <span className="text-sm text-red-500">{formik.errors.comment}</span>
        )}
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="danger">
          Confirm
        </Button>
      </div>
    </form>
  );
}
