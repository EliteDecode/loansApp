import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import lock from "@/assets/icons/lock.svg";
import Button from "../Button/Button";
import TextInput from "../TextInput/TextInput";

// ✅ Validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters") // adjust if needed
    .required("Password is required"),
});

interface ShutdownPasswordProps {
  onClose: () => void;
  // onConfirm?: (values: { password: string }) => void;
}

export default function ShutdownPassword({
  onClose,
}: // onConfirm,
ShutdownPasswordProps) {
  return (
    <Formik
      initialValues={{ password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log("🔑 Password submitted:", values);
        // onConfirm?.(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <Form className="flex items-center justify-center flex-col gap-6 ">
          {/* Lock Icon */}
          <img src={lock} alt="" />

          {/* Title */}
          <h4 className="text-[24px] leading-[120%] tracking-[-2%] font-semibold text-gray-700">
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

          {/* Buttons */}
          <div className="space-x-4">
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
