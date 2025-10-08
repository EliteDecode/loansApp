import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import lock from "@/assets/icons/lock.svg";
import Button from "../Button/Button";
import TextInput from "../TextInput/TextInput";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { getSystemSettings, shutdownSystem } from "@/services/features";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtils";

// ✅ Validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  reason: Yup.string()
    .min(10, "Reason must be at least 10 characters long")
    .required("Reason for shutdown is required"),
});

interface ShutdownPasswordProps {
  onClose: () => void;
}

export default function ShutdownPassword({ onClose }: ShutdownPasswordProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Formik
      initialValues={{ password: "", reason: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        console.log(values);
        try {
          const res = await dispatch(shutdownSystem(values)).unwrap();
          showSuccessToast(res?.message || "System shutdown successfully.");
          dispatch(getSystemSettings());
          onClose();
        } catch (err: any) {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to shut down system. Try again.";
          showErrorToast(message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, dirty, isValid, errors, touched }) => (
        <Form className="flex items-center justify-center flex-col gap-6">
          {/* Lock Icon */}
          <img src={lock} alt="lock icon" />

          {/* Title */}
          <h4 className="text-[24px] leading-[120%] tracking-[-2%] font-semibold text-gray-700 text-center">
            Enter your password to continue
          </h4>

          {/* Password Field */}
          <Field
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your system password"
            as={TextInput}
          />

          {/* Reason Field */}
          <div className="w-full">
            <label
              htmlFor="reason"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Reason for Shutdown
            </label>
            <Field name="reason">
              {({ field }: any) => (
                <textarea
                  {...field}
                  id="reason"
                  placeholder="Enter your reason for shutting down the system..."
                  onFocus={() => setIsFocused(true)}
                  onBlur={(e) => {
                    setIsFocused(false);
                    field.onBlur(e);
                  }}
                  className={`w-full h-28 px-3 py-2 border rounded text-[14px] leading-[145%] resize-none focus:outline-none focus:ring-2 ${
                    errors.reason && touched.reason && !isFocused
                      ? "border-red-500"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                />
              )}
            </Field>
            {errors.reason && touched.reason && (
              <p className="text-red-500 text-xs">{errors.reason}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-x-4 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              type="submit"
              disabled={isSubmitting || !dirty || !isValid}
            >
              {isSubmitting ? "Processing..." : "Confirm Shutdown"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
