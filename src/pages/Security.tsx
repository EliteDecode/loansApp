import Button from "@/components/Button/Button";
import TextInput from "@/components/TextInput/TextInput";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import React from "react";

// Validation schema
const SecuritySchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function Security() {
  return (
    <Formik
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={SecuritySchema}
      onSubmit={(values) => {
        console.log("Form Submitted ✅", values);
      }}
    >
      {({ resetForm }) => (
        <Form className="space-y-4">
          <div className="md:text-[28px] text-[20px] leading-[120%] tracking-[-2%] py-6 font-semibold text-gray-700">
            Security Settings
          </div>

          <div className="space-y-12">
            <div className="space-y-4">
              <TextInput
                placeholder="Enter your current password"
                name="currentPassword"
                type="password"
                label="Current Password"
              />
              <TextInput
                placeholder="Enter your new password"
                name="newPassword"
                type="password"
                label="New Password"
              />
              <TextInput
                placeholder="Re-enter your new password"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
              />
            </div>

            <div className="flex items-center justify-end gap-4">
              {/* Cancel resets the form */}
              <Button
                type="button"
                variant="outline"
                onClick={() => resetForm()}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
